export function HeroGraphic() {
  return (
    <div className="hero-visual" role="img" aria-label="CodeError 접근성 검사 결과 예시 그래픽">
      <div className="browser-card" aria-hidden="true">
        <div className="browser-bar"><i /><i /><i /></div>
        <div className="visual-body">
          <div className="score-ring"><strong>94</strong><span>/100</span></div>
          <div className="visual-lines"><i /><i /><i /></div>
        </div>
      </div>
      <div className="floating-card float-success" aria-hidden="true"><span>✓</span> 접근성 검사 완료</div>
      <div className="floating-card float-code" aria-hidden="true"><b>&lt;/&gt;</b><span>수정 가이드<br /><small>한국어로 쉽게</small></span></div>
      <div className="floating-card float-warning" aria-hidden="true"><span>!</span><b>2</b> 개선 항목</div>
    </div>
  )
}
