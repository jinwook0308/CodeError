import { scanWebsite } from "../services/scanner.js";
import { normalizeLocalUrl } from "../services/localUrlSafety.js";
import { saveLocalScanResult } from "../services/localScanStore.js";
import type { Impact, ScanIssue } from "../types/scan.js";

const impactLabels: Record<Impact, string> = {
  critical: "치명적",
  serious: "심각",
  moderate: "보통",
  minor: "경미",
};

function printHelp(): void {
  console.log(`
CodeError Local Runner

사용법:
  npm run scan:local -- http://localhost:5173

허용 주소:
  localhost, 127.0.0.1, ::1

먼저 검사할 프로젝트의 개발 서버를 실행한 뒤 이 명령어를 사용하세요.
`);
}

function shortHtml(issue: ScanIssue): string {
  const html = issue.nodes[0]?.html.replace(/\s+/g, " ").trim() ?? "";
  return html.length > 150 ? `${html.slice(0, 147)}...` : html;
}

function friendlyError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/ECONNREFUSED|ERR_CONNECTION_REFUSED/i.test(message)) {
    return "localhost 개발 서버에 연결할 수 없습니다. 먼저 npm run dev로 검사할 화면을 실행해주세요.";
  }
  if (/timeout|시간.*초과/i.test(message)) {
    return "검사 시간이 초과되었습니다. 개발 서버가 정상적으로 열린 상태인지 확인해주세요.";
  }
  if (/Executable doesn't exist|browserType\.launch/i.test(message)) {
    return "Playwright Chromium이 없습니다. server 폴더에서 npx playwright install chromium을 실행해주세요.";
  }
  return message;
}

function printIssue(issue: ScanIssue, index: number): void {
  console.log(`\n${index + 1}. [${impactLabels[issue.impact]}] ${issue.title}`);
  console.log(`   Rule ID: ${issue.id}`);
  if (issue.wcag.length) console.log(`   WCAG: ${issue.wcag.join(", ")}`);
  console.log(`   영향 요소: ${issue.nodes.length}개`);
  console.log(`   설명: ${issue.description}`);
  console.log(`   수정 방법: ${issue.solution}`);
  const html = shortHtml(issue);
  if (html) console.log(`   첫 번째 요소: ${html}`);
}

async function main(): Promise<void> {
  const [input, ...extraArgs] = process.argv.slice(2);
  if (!input || input === "--help" || input === "-h") {
    printHelp();
    process.exitCode = input ? 0 : 1;
    return;
  }
  if (extraArgs.length) {
    throw new Error("검사할 localhost URL은 하나만 입력해주세요.");
  }

  const target = normalizeLocalUrl(input);
  const startedAt = Date.now();
  console.log("\n[CodeError Local Runner]");
  console.log(`검사 시작: ${target.href}`);
  console.log("Playwright와 axe-core로 실제 화면을 검사하고 있습니다...");

  const result = await scanWebsite(target.href, { trustedHostnames: [target.hostname] });
  await saveLocalScanResult(result);
  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);

  console.log("\n검사 완료");
  console.log(`- URL: ${result.url}`);
  console.log(`- CodeError 참고 점수: ${result.score}/100`);
  console.log(`- 발견된 규칙: ${result.summary.total}개`);
  console.log(`- 치명적 ${result.summary.critical} · 심각 ${result.summary.serious} · 보통 ${result.summary.moderate} · 경미 ${result.summary.minor}`);
  console.log(`- 통과 규칙: ${result.summary.passes}개`);
  console.log(`- 검사 시간: ${seconds}초`);
  console.log("- 저장 파일: server/.codeerror/latest-local-scan.json");

  if (!result.issues.length) {
    console.log("\n자동 검사에서 발견된 문제가 없습니다. 수동 접근성 검사도 함께 진행해주세요.");
    return;
  }

  console.log("\n발견된 문제와 수정 가이드");
  result.issues.forEach(printIssue);
  console.log("\n이 점수는 자동 검사 기반의 참고용 점수이며 공식 WCAG 인증 점수가 아닙니다.");
}

main().catch((error) => {
  console.error(`\n검사 실패: ${friendlyError(error)}`);
  printHelp();
  process.exitCode = 1;
});
