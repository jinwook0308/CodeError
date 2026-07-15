interface Props {
  loading: boolean
  onScan: (variant: 'before' | 'after') => void
}

export function DemoPanel({ loading, onScan }: Props) {
  return (
    <section className="demo-panel" id="demo" aria-labelledby="demo-title">
      <div className="demo-heading">
        <div><span className="eyebrow">실제 axe-core 비교 시연</span><h2 id="demo-title">접근성을 고치면 결과가 어떻게 달라질까요?</h2></div>
        <p>동일한 화면의 수정 전·후 페이지를 실제로 검사합니다. 결과는 미리 만들어 둔 데이터가 아닙니다.</p>
      </div>
      <div className="demo-cards">
        <article className="demo-card before">
          <div className="demo-card-top"><span className="demo-number">01</span><span className="demo-status">수정 전</span></div>
          <h3>접근성 문제가 있는 페이지</h3>
          <p>대체 텍스트, 버튼 이름, 입력 레이블, 색상 대비 등 흔한 문제를 포함합니다.</p>
          <div className="demo-actions"><a href="/demo/before" target="_blank" rel="noreferrer">페이지 보기 ↗</a><button type="button" onClick={() => onScan('before')} disabled={loading}>수정 전 검사</button></div>
        </article>
        <div className="demo-arrow" aria-hidden="true">→</div>
        <article className="demo-card after">
          <div className="demo-card-top"><span className="demo-number">02</span><span className="demo-status">수정 후</span></div>
          <h3>접근성을 개선한 페이지</h3>
          <p>한국어 가이드에 따라 의미 구조와 이름, 레이블, 색상 대비를 올바르게 수정했습니다.</p>
          <div className="demo-actions"><a href="/demo/after" target="_blank" rel="noreferrer">페이지 보기 ↗</a><button type="button" onClick={() => onScan('after')} disabled={loading}>수정 후 검사</button></div>
        </article>
      </div>
    </section>
  )
}
