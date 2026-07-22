import { AxeBuilder } from "@axe-core/playwright";
import { chromium, type Browser } from "playwright";
import { accessibilityGuides } from "../data/accessibilityGuides.js";
import type { Impact, ScanResponse } from "../types/scan.js";
import { assertPublicHostname, normalizeUrl } from "./urlSafety.js";

const impacts: Impact[] = ["critical", "serious", "moderate", "minor"];
const previewViewport = { width: 1440, height: 900 };

function wcagFromTags(tags: string[]): string[] {
  return tags
    .filter((tag) => /^wcag\d{3,4}$/.test(tag))
    .map((tag) => tag.slice(4).split("").join("."));
}

interface ScanOptions {
  trustedHostnames?: string[];
}

export async function scanWebsite(input: unknown, options: ScanOptions = {}): Promise<ScanResponse> {
  const targetUrl = normalizeUrl(input);
  const trustedHostnames = new Set(options.trustedHostnames ?? []);
  if (!trustedHostnames.has(targetUrl.hostname)) await assertPublicHostname(targetUrl.hostname);
  let browser: Browser | undefined;

  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ ignoreHTTPSErrors: false, viewport: previewViewport });
    const checkedHosts = new Map<string, Promise<void>>();
    await context.route("**/*", async (route) => {
      const requestUrl = new URL(route.request().url());
      if (!["http:", "https:"].includes(requestUrl.protocol)) return route.continue();
      if (trustedHostnames.has(requestUrl.hostname)) return route.continue();
      const check = checkedHosts.get(requestUrl.hostname) ?? assertPublicHostname(requestUrl.hostname);
      checkedHosts.set(requestUrl.hostname, check);
      try { await check; await route.continue(); } catch { await route.abort("blockedbyclient"); }
    });

    const page = await context.newPage();
    await page.goto(targetUrl.href, { waitUntil: "domcontentloaded", timeout: 20_000 });
    const results = await Promise.race([
      new AxeBuilder({ page }).analyze(),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("검사 시간이 초과되었습니다.")), 15_000)),
    ]);
    const previewBuffer = await page.screenshot({
      type: "jpeg",
      quality: 70,
      fullPage: false,
      animations: "disabled",
    }).catch(() => null);

    const counts: Record<Impact, number> = { critical: 0, serious: 0, moderate: 0, minor: 0 };
    const issues = results.violations.map((violation) => {
      const impact: Impact = impacts.includes(violation.impact as Impact) ? violation.impact as Impact : "minor";
      counts[impact] += 1;
      const guide = accessibilityGuides.get(violation.id);
      return {
        id: violation.id,
        title: guide?.title ?? violation.help,
        impact,
        wcag: guide?.wcag ?? wcagFromTags(violation.tags),
        description: guide?.description ?? violation.description,
        solution: guide?.solution ?? `axe-core 안내를 확인하고 ${violation.id} 규칙을 만족하도록 표시된 요소를 수정하세요.`,
        nodes: violation.nodes.map((node) => ({ html: node.html, target: node.target.map(String) })),
        exampleBefore: guide?.exampleBefore ?? violation.nodes[0]?.html ?? "",
        exampleAfter: guide?.exampleAfter ?? "프로젝트 구조에 맞게 해당 요소의 접근성 속성을 수정하세요.",
      };
    });
    const score = Math.max(0, 100 - counts.critical * 10 - counts.serious * 6 - counts.moderate * 3 - counts.minor);
    return {
      success: true,
      url: page.url(),
      scannedAt: new Date().toISOString(),
      score,
      summary: { total: issues.length, ...counts, passes: results.passes.length },
      issues,
      preview: previewBuffer ? {
        dataUrl: `data:image/jpeg;base64,${previewBuffer.toString("base64")}`,
        ...previewViewport,
      } : undefined,
    };
  } finally {
    await browser?.close();
  }
}
