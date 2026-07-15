import { useMemo, useState } from 'react'
import { exportHtmlReport, exportJsonReport } from '../services/reportExport'
import type { Impact, ScanIssue, ScanResult } from '../types/scan'

const labels: Record<Impact, string> = { critical: 'Critical', serious: 'Serious', moderate: 'Moderate', minor: 'Minor' }
const filters: Array<'all' | Impact> = ['all', 'critical', 'serious', 'moderate', 'minor']

function resultTitle(url: string): string {
  const parsed = new URL(url)
  if (parsed.pathname === '/demo/before') return '수정 전 시연 페이지'
  if (parsed.pathname === '/demo/after') return '수정 후 시연 페이지'
  return parsed.hostname
}

function IssueCard({ issue }: { issue: ScanIssue }) {
  const [open, setOpen] = useState(false)
  return (
    <article className={`issue-card impact-${issue.impact}`}>
      <button className="issue-summary" type="button" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="impact-mark" aria-hidden="true">!</span>
        <span className="issue-heading"><strong>{issue.title}</strong><small>Rule: {issue.id} · WCAG {issue.wcag.join(', ') || '관련 기준 확인 필요'}</small></span>
        <span className={`impact-pill ${issue.impact}`}>{labels[issue.impact]}</span>
        <span className="node-count">영향 {issue.nodes.length}개</span>
        <span className={`chevron ${open ? 'open' : ''}`} aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div className="issue-detail">
          <section><h4>왜 문제인가요?</h4><p>{issue.description}</p></section>
          <section><h4>어떻게 수정하나요?</h4><p>{issue.solution}</p></section>
          {issue.nodes.slice(0, 5).map((node, index) => (
            <section key={`${issue.id}-${index}`}><h4>문제 요소 {index + 1}</h4><code>{node.html}</code><p className="target">위치: {node.target.join(' → ')}</p></section>
          ))}
          <div className="code-grid">
            <section><h4>수정 전</h4><pre><code>{issue.exampleBefore}</code></pre></section>
            <section className="after-code"><h4>수정 후</h4><pre><code>{issue.exampleAfter}</code></pre></section>
          </div>
        </div>
      )}
    </article>
  )
}

export function ResultsPanel({ result, onRescan, loading }: { result: ScanResult; onRescan: () => void; loading: boolean }) {
  const [filter, setFilter] = useState<'all' | Impact>('all')
  const visibleIssues = useMemo(() => filter === 'all' ? result.issues : result.issues.filter((issue) => issue.impact === filter), [filter, result.issues])
  return (
    <section className="results-shell" id="results" aria-labelledby="results-title">
      <header className="results-header">
        <div><span className="eyebrow">검사 결과</span><h2 id="results-title">{resultTitle(result.url)}</h2><p>{result.url} · {new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(result.scannedAt))}</p></div>
        <div className="result-actions">
          <button type="button" className="export-button" onClick={() => exportJsonReport(result)} disabled={loading}><span aria-hidden="true">↓</span> JSON</button>
          <button type="button" className="export-button primary" onClick={() => exportHtmlReport(result)} disabled={loading}><span aria-hidden="true">↓</span> HTML 리포트</button>
          <button type="button" className="rescan-button" onClick={onRescan} disabled={loading}><span aria-hidden="true">↻</span> 다시 검사</button>
        </div>
      </header>
      <div className="results-grid">
        <aside className="score-panel">
          <span className="panel-label">접근성 참고 점수</span>
          <div className="score-display"><strong>{result.score}</strong><span>/ 100</span></div>
          <div className="score-track"><i style={{ width: `${result.score}%` }} /></div>
          <div className="metric-grid">
            {(['critical','serious','moderate','minor'] as Impact[]).map((impact) => <div className={`metric ${impact}`} key={impact}><strong>{result.summary[impact]}</strong><span>{labels[impact]}</span></div>)}
            <div className="metric passes"><strong>{result.summary.passes}</strong><span>통과 항목</span></div>
          </div>
          <p className="score-notice"><span aria-hidden="true">i</span> 이 점수는 CodeError의 자동 검사 결과를 기반으로 계산된 참고용 점수이며, 공식 WCAG 적합성 인증 점수가 아닙니다.</p>
        </aside>
        <div className="issues-panel">
          <div className="issues-top"><div><span className="panel-label">발견된 문제</span><h3>{result.summary.total}개의 개선 항목</h3></div></div>
          <div className="filter-row" aria-label="심각도 필터">
            {filters.map((item) => <button type="button" className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} key={item}>{item === 'all' ? '전체' : labels[item]} <span>{item === 'all' ? result.summary.total : result.summary[item]}</span></button>)}
          </div>
          <div className="issue-list">
            {visibleIssues.length ? visibleIssues.map((issue) => <IssueCard key={issue.id} issue={issue} />) : <div className="empty-filter"><span>✓</span><p>이 심각도에서 발견된 문제가 없습니다.</p></div>}
          </div>
        </div>
      </div>
    </section>
  )
}
