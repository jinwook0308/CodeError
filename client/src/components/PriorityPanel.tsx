import type { Impact, ScanIssue } from '../types/scan'

const impactWeights: Record<Impact, number> = { critical: 4, serious: 3, moderate: 2, minor: 1 }
const impactLabels: Record<Impact, string> = { critical: 'Critical', serious: 'Serious', moderate: 'Moderate', minor: 'Minor' }

function reasonFor(issue: ScanIssue): string {
  const impactReason: Record<Impact, string> = {
    critical: '핵심 기능을 사용하지 못하게 할 가능성이 큰 문제입니다.',
    serious: '많은 사용자에게 중요한 사용 불편을 줄 수 있습니다.',
    moderate: '페이지 구조와 탐색 경험을 개선하기 위해 수정이 필요합니다.',
    minor: '작은 불편을 줄이고 완성도를 높이기 위해 확인하세요.',
  }
  const nodeReason = issue.nodes.length > 1 ? ` 같은 문제가 ${issue.nodes.length}개 요소에 영향을 줍니다.` : ''
  return impactReason[issue.impact] + nodeReason
}

export function PriorityPanel({ issues, onSelect }: { issues: ScanIssue[]; onSelect: (issueId: string) => void }) {
  if (issues.length === 0) {
    return <section className="priority-panel complete"><span className="priority-check" aria-hidden="true">✓</span><div><strong>우선 수정할 문제가 없습니다</strong><p>자동 검사에서 발견된 문제가 없습니다. 수동 접근성 검사도 함께 진행해보세요.</p></div></section>
  }

  const priorities = [...issues]
    .sort((a, b) => impactWeights[b.impact] - impactWeights[a.impact] || b.nodes.length - a.nodes.length || a.title.localeCompare(b.title, 'ko'))
    .slice(0, 3)

  return (
    <section className="priority-panel" aria-labelledby="priority-title">
      <div className="priority-intro"><span className="panel-label">추천 수정 순서</span><h4 id="priority-title">이 문제부터 고쳐보세요</h4><p>심각도와 영향 요소 수를 기준으로 계산했습니다.</p></div>
      <ol className="priority-list">
        {priorities.map((issue, index) => (
          <li key={issue.id}>
            <button type="button" onClick={() => onSelect(issue.id)} aria-label={`우선순위 ${index + 1}, ${issue.title} 문제로 이동`}>
              <span className="priority-rank">{index + 1}</span>
              <span className="priority-content"><strong>{issue.title}</strong><small>{reasonFor(issue)}</small></span>
              <span className={`impact-pill ${issue.impact}`}>{impactLabels[issue.impact]}</span>
              <span className="priority-go" aria-hidden="true">→</span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
