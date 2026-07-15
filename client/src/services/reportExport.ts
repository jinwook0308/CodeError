import type { Impact, ScanResult } from '../types/scan'

const impactLabels: Record<Impact, string> = { critical: 'Critical', serious: 'Serious', moderate: 'Moderate', minor: 'Minor' }

function escapeHtml(value: unknown): string {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')
}

function reportFileName(result: ScanResult, extension: 'json' | 'html'): string {
  const hostname = new URL(result.url).hostname.replace(/[^a-z0-9.-]/gi, '-')
  const scannedAt = new Date(result.scannedAt)
  const localDate = [scannedAt.getFullYear(), String(scannedAt.getMonth() + 1).padStart(2, '0'), String(scannedAt.getDate()).padStart(2, '0')].join('-')
  return `codeerror-${hostname}-${localDate}.${extension}`
}

function download(content: string, type: string, fileName: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function buildJsonReport(result: ScanResult): string {
  return JSON.stringify(result, null, 2)
}

export function buildHtmlReport(result: ScanResult): string {
  const scannedAt = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'long', timeStyle: 'medium' }).format(new Date(result.scannedAt))
  const metrics = (['critical', 'serious', 'moderate', 'minor'] as Impact[])
    .map((impact) => `<div class="metric ${impact}"><strong>${result.summary[impact]}</strong><span>${impactLabels[impact]}</span></div>`).join('')
  const issues = result.issues.map((issue, index) => {
    const nodes = issue.nodes.map((node, nodeIndex) => `<div class="node"><b>문제 요소 ${nodeIndex + 1}</b><pre><code>${escapeHtml(node.html)}</code></pre><p><b>위치:</b> ${escapeHtml(node.target.join(' → '))}</p></div>`).join('')
    return `<article class="issue ${issue.impact}"><header><span class="number">${index + 1}</span><div><h2>${escapeHtml(issue.title)}</h2><p>Rule: ${escapeHtml(issue.id)} · WCAG ${escapeHtml(issue.wcag.join(', ') || '관련 기준 확인 필요')}</p></div><span class="pill">${impactLabels[issue.impact]}</span></header><section><h3>왜 문제인가요?</h3><p>${escapeHtml(issue.description)}</p></section><section><h3>어떻게 수정하나요?</h3><p>${escapeHtml(issue.solution)}</p></section>${nodes}<div class="code-grid"><section><h3>수정 전</h3><pre><code>${escapeHtml(issue.exampleBefore)}</code></pre></section><section class="after"><h3>수정 후</h3><pre><code>${escapeHtml(issue.exampleAfter)}</code></pre></section></div></article>`
  }).join('')

  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CodeError 접근성 검사 리포트 - ${escapeHtml(new URL(result.url).hostname)}</title><style>
:root{font-family:Inter,"Malgun Gothic",sans-serif;color:#111827;background:#f5f6fa}*{box-sizing:border-box}body{margin:0}.wrap{max-width:980px;margin:auto;padding:48px 28px 80px}.brand{font-size:25px;font-weight:800}.brand span{color:#6c4dff}.hero{margin-top:24px;padding:30px;border-radius:18px;color:#fff;background:linear-gradient(120deg,#101b30,#273b5d)}.hero small{color:#b9c2d0}.hero h1{margin:8px 0 6px;font-size:25px}.score-box{display:grid;grid-template-columns:220px 1fr;gap:18px;margin:18px 0}.score,.summary{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:24px}.score strong{display:block;color:#6c4dff;font-size:58px}.score span{color:#667085}.metrics{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.metric{padding:15px 9px;border-radius:10px;background:#f7f8fb;text-align:center}.metric strong,.metric span{display:block}.metric strong{font-size:22px}.metric span{font-size:10px;color:#667085}.passes{color:#22a06b}.notice{font-size:11px;line-height:1.6;color:#6048bf;background:#f2efff;padding:12px;border-radius:9px}.issue{margin:14px 0;padding:24px;background:#fff;border:1px solid #e5e7eb;border-left:4px solid #98a2b3;border-radius:14px;break-inside:avoid}.issue.critical{border-left-color:#e5484d}.issue.serious{border-left-color:#f97316}.issue.moderate{border-left-color:#f5a524}.issue.minor{border-left-color:#3b82f6}.issue header{display:flex;align-items:flex-start;gap:12px}.issue h2{font-size:17px;margin:0 0 4px}.issue header p{font-size:11px;color:#667085;margin:0}.number{display:grid;place-items:center;width:28px;height:28px;border-radius:8px;background:#eee9ff;color:#6c4dff;font-weight:800}.pill{margin-left:auto;padding:5px 8px;border-radius:6px;background:#f2f4f7;font-size:10px;font-weight:800}.issue section{margin-top:20px}.issue h3{font-size:12px;margin:0 0 8px}.issue section p,.node p{font-size:12px;line-height:1.65;color:#667085}.node{margin-top:15px}.node b{font-size:11px}pre{white-space:pre-wrap;overflow-wrap:anywhere;margin:7px 0 0;padding:13px;border-radius:8px;background:#182235;color:#f5f7fa;font-size:10px;line-height:1.5}.code-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.after pre{color:#a9f1c9}.footer{margin-top:30px;text-align:center;color:#98a2b3;font-size:10px}@media(max-width:700px){.score-box,.code-grid{grid-template-columns:1fr}.metrics{grid-template-columns:repeat(2,1fr)}}@media print{body{background:#fff}.wrap{padding:10px}.hero{print-color-adjust:exact}.issue{break-inside:avoid}}
</style></head><body><main class="wrap"><div class="brand">Code<span>Error</span></div><section class="hero"><small>웹 접근성 자동 검사 리포트</small><h1>${escapeHtml(result.url)}</h1><p>검사 완료: ${escapeHtml(scannedAt)}</p></section><section class="score-box"><div class="score"><span>접근성 참고 점수</span><strong>${result.score}</strong><span>/ 100</span></div><div class="summary"><div class="metrics">${metrics}<div class="metric passes"><strong>${result.summary.passes}</strong><span>통과 항목</span></div></div><p class="notice">이 점수는 CodeError의 자동 검사 결과를 기반으로 계산된 참고용 점수이며, 공식 WCAG 적합성 인증 점수가 아닙니다.</p></div></section><h1>발견된 문제 ${result.summary.total}개</h1>${issues || '<section class="issue"><h2>자동 검사에서 발견된 문제가 없습니다.</h2><p>수동 접근성 검사를 함께 진행하는 것을 권장합니다.</p></section>'}<p class="footer">CodeError · 초보 개발자를 위한 오픈소스 웹 접근성 검사 도구</p></main></body></html>`
}

export function exportJsonReport(result: ScanResult): void {
  download(buildJsonReport(result), 'application/json;charset=utf-8', reportFileName(result, 'json'))
}

export function exportHtmlReport(result: ScanResult): void {
  download(buildHtmlReport(result), 'text/html;charset=utf-8', reportFileName(result, 'html'))
}
