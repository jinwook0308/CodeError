import { useEffect } from 'react'

const features = [
  { number: '01', title: '공개 URL 검사', description: '배포된 웹사이트 주소를 입력하면 Playwright와 axe-core가 실제 페이지를 열어 접근성 문제를 검사합니다.' },
  { number: '02', title: 'localhost 검사', description: '배포 전 개발 중인 React, HTML 등의 로컬 프로젝트도 같은 입력창에서 바로 검사할 수 있습니다.' },
  { number: '03', title: '한국어 수정 가이드', description: '주요 접근성 규칙 25개를 초보 개발자가 이해하기 쉬운 설명과 수정 코드 예시로 제공합니다.' },
  { number: '04', title: '수정 우선순위', description: '문제의 심각도와 영향을 받는 요소 수를 기준으로 먼저 고칠 항목을 추천합니다.' },
  { number: '05', title: '검색과 검사 기록', description: '문제를 필터링하고 검색할 수 있으며, 최근 검사 결과를 현재 브라우저에 최대 10개 저장합니다.' },
  { number: '06', title: '결과 내보내기', description: '검사 결과를 JSON 원본 데이터와 독립적으로 열 수 있는 HTML 리포트로 저장할 수 있습니다.' },
]

const workflow = [
  ['URL 입력', '공개 웹사이트 또는 같은 컴퓨터에서 실행 중인 localhost 주소를 입력합니다.'],
  ['자동 검사', 'Playwright가 페이지를 열고 axe-core가 WCAG 기반 규칙을 실제로 검사합니다.'],
  ['문제 이해', '원인, 영향 요소, WCAG 기준과 한국어 수정 예시를 확인합니다.'],
  ['수정과 재검사', '코드를 수정한 뒤 다시 검사해 접근성이 개선됐는지 확인합니다.'],
]

export function AboutPage() {
  useEffect(() => {
    document.title = '프로젝트 소개 | CodeError'
  }, [])

  return (
    <main className="about-page">
      <div className="about-hero-background">
        <nav className="top-nav" aria-label="주요 메뉴">
          <a className="brand" href="/" aria-label="CodeError 검사 홈"><strong>Code<span>Error</span></strong><small>WEB ACCESSIBILITY CHECKER</small></a>
          <div className="nav-links">
            <a href="/">검사 홈</a>
            <a href="/about" className="about-nav-current" aria-current="page">프로젝트 소개</a>
            <a href="#open-source">오픈소스</a>
            <a href="https://github.com/jinwook0308/CodeError" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
          </div>
        </nav>

        <section className="about-hero" aria-labelledby="about-title">
          <div className="about-hero-copy">
            <span className="about-kicker">OPEN SOURCE ACCESSIBILITY TOOL</span>
            <h1 id="about-title">접근성 문제를 발견하고<br /><em>고치는 경험</em>까지</h1>
            <p>CodeError는 웹 접근성이 낯선 초보 개발자가 배포 전과 배포 후에 문제를 발견<br/> 
            이해하고, 직접 수정할 수 있도록 돕는 오픈소스 웹 도구입니다.</p>
            <div className="about-actions">
              <a className="about-primary-action" href="/">검사 시작하기 <span aria-hidden="true">→</span></a>
              <a className="about-secondary-action" href="https://github.com/jinwook0308/CodeError" target="_blank" rel="noreferrer">GitHub에서 보기 <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="about-summary" aria-label="CodeError 핵심 특징">
            <div><strong>REAL</strong><span>Playwright·axe-core 실제 검사</span></div>
            <div><strong>25</strong><span>초보자용 한국어 핵심 가이드</span></div>
            <div><strong>2 WAY</strong><span>공개 URL·localhost 지원</span></div>
            <div><strong>MIT</strong><span>누구나 함께 개선하는 오픈소스</span></div>
          </div>
        </section>
      </div>

      <div className="about-content">
        <section className="about-section about-problem" aria-labelledby="problem-title">
          <div className="about-section-heading">
            <span className="eyebrow">WHY CODEERROR</span>
            <h2 id="problem-title">문제를 찾았는데, 어떻게 고쳐야 할지 모르겠다면?</h2>
            <p>기존 접근성 검사 결과에는 영어와 전문용어가 많아 처음 접하는 개발자가 원인과 해결 방법을 연결하기 어렵습니다.</p>
          </div>
          <div className="about-problem-grid">
            <article><span aria-hidden="true">?</span><h3>이해하기 어려운 결과</h3><p>Rule ID와 오류 문장만으로는 어떤 사용자가 왜 불편한지<br/>파악하기 어렵습니다.</p></article>
            <article><span aria-hidden="true">&lt;/&gt;</span><h3>수정 방법의 부재</h3><p>문제를 발견하더라도 내 코드에서 무엇을 바꿔야 하는지<br/> 다시 검색해야 합니다.</p></article>
            <article><span aria-hidden="true">✓</span><h3>CodeError의 해결 방식</h3><p>실제 문제 요소와 한국어 설명, 수정 전·후 예시를 한 화면에서 연결해 보여줍니다.</p></article>
          </div>
        </section>

        <section className="about-section" aria-labelledby="workflow-title">
          <div className="about-section-heading compact">
            <span className="eyebrow">HOW IT WORKS</span>
            <h2 id="workflow-title">검사부터 재검사까지 네 단계</h2>
          </div>
          <ol className="about-workflow">
            {workflow.map(([title, description], index) => (
              <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{description}</p></li>
            ))}
          </ol>
        </section>

        <section className="about-section" aria-labelledby="features-title">
          <div className="about-section-heading compact">
            <span className="eyebrow">CURRENT FEATURES</span>
            <h2 id="features-title">현재 사용할 수 있는 기능</h2>
            <p>화면의 숫자는 예시 데이터가 아니라 실제 검사 결과를 바탕으로 계산됩니다.</p>
          </div>
          <div className="about-feature-grid">
            {features.map((feature) => (
              <article key={feature.number}><span style={{ color: '#5f43d9' }}>{feature.number}</span><h3>{feature.title}</h3><p>{feature.description}</p></article>
            ))}
          </div>
        </section>

        <section className="about-section about-open-source" id="open-source" aria-labelledby="open-source-title">
          <div>
            <span className="eyebrow">BUILT WITH OPEN SOURCE</span>
            <h2 id="open-source-title">오픈소스로 만들고, 오픈소스로 돌려드립니다</h2>
            <p>CodeError는 검증된 오픈소스 도구를 연결해 초보 개발자에게 필요한 새로운 경험을 만듭니다. 프로젝트 코드는 MIT 라이선스로 공개되어 누구나 학습하고 개선에 참여할 수 있습니다.</p>
            <a href="https://github.com/jinwook0308/CodeError" target="_blank" rel="noreferrer">GitHub 저장소 방문하기 <span aria-hidden="true">→</span></a>
          </div>
          <ul aria-label="사용 기술">
            <li><strong>React · TypeScript · Vite</strong><span>사용자 화면</span></li>
            <li><strong>Node.js · Express</strong><span>검사 API</span></li>
            <li><strong>Playwright · axe-core</strong><span>실제 접근성 자동검사</span></li>
            <li><strong>Git · GitHub · MIT</strong><span>협업과 공개</span></li>
          </ul>
        </section>

        <section className="about-section about-roadmap" aria-labelledby="roadmap-title">
          <div className="about-section-heading compact">
            <span className="eyebrow">LIMITS & ROADMAP</span>
            <h2 id="roadmap-title">현재의 한계도 솔직하게 공개합니다</h2>
            <p>자동검사는 모든 접근성 문제를 대신할 수 없으며, CodeError 점수는 공식 WCAG 인증 점수가 아닙니다. 자동검사 이후에도 키보드 탐색과 스크린 리더를 이용한 수동 확인이 필요합니다.</p>
          </div>
          <div className="about-roadmap-grid">
            <article><span>NOW</span><h3>현재 MVP</h3><p>한 페이지 자동검사, 한국어 가이드, localhost 검사, 기록과 리포트를 제공합니다.</p></article>
            <article><span>NEXT</span><h3>수정 전·후 자동 비교</h3><p>해결된 문제, 남은 문제와 새로 발생한 문제를 한눈에 비교할 예정입니다.</p></article>
            <article><span>FUTURE</span><h3>여러 페이지와 협업</h3><p>사이트 여러 페이지 검사와 팀 개발 과정에서 활용할 수 있는 연동 기능을 확장할 예정입니다.</p></article>
          </div>
        </section>

        <section className="about-final-cta" aria-labelledby="cta-title">
          <span className="eyebrow">START CHECKING</span>
          <h2 id="cta-title">지금 개발 중인 화면부터 확인해보세요</h2>
          <p>공개 URL이나 localhost 주소 하나면 실제 접근성 검사를 시작할 수 있습니다.</p>
          <a href="/">CodeError 검사 시작 <span aria-hidden="true">→</span></a>
        </section>
      </div>

      <footer className="about-footer"><a className="brand footer-brand" href="/"><strong>Code<span>Error</span></strong></a><p>초보 개발자가 접근성을 이해하고 직접 고칠 수 있도록.</p><span>Open source MVP · MIT License</span></footer>
    </main>
  )
}
