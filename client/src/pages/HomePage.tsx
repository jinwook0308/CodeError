import { useEffect, useRef, useState } from 'react'
import { HeroGraphic } from '../components/HeroGraphic'
import { DemoPanel } from '../components/DemoPanel'
import { HistoryDialog } from '../components/HistoryDialog'
import { ResultsPanel } from '../components/ResultsPanel'
import { ScanForm } from '../components/ScanForm'
import { addScanHistory, clearScanHistory, deleteScanHistory, loadScanHistory } from '../services/scanHistory'
import { isLocalScanTarget, requestDemoScan, requestLatestLocalScan, requestScan } from '../services/scanApi'
import type { ScanHistoryItem, ScanKind, ScanResult } from '../types/scan'

const loadingSteps = ['웹사이트를 불러오는 중입니다...', '접근성 규칙을 검사하고 있습니다...', '검사 결과를 정리하고 있습니다...']

export function HomePage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [lastScan, setLastScan] = useState<ScanKind>('url')
  const [history, setHistory] = useState<ScanHistoryItem[]>(loadScanHistory)
  const [historyOpen, setHistoryOpen] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading) return
    const timer = window.setInterval(() => setStep((value) => Math.min(value + 1, loadingSteps.length - 1)), 2600)
    return () => window.clearInterval(timer)
  }, [loading])

  async function runScan(scanRequest: () => Promise<ScanResult>, kind: ScanKind) {
    if (loading) return
    setLoading(true)
    setStep(0)
    setError('')
    try {
      const data = await scanRequest()
      setResult(data)
      setLastScan(kind)
      setHistory(addScanHistory(data, kind))
      if (kind === 'url' || kind === 'local') setUrl(data.url)
      window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '검사 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  async function scan() {
    if (!url.trim()) return
    await runScan(() => requestScan(url), isLocalScanTarget(url) ? 'local' : 'url')
  }

  async function scanDemo(variant: 'before' | 'after') {
    await runScan(() => requestDemoScan(variant), variant)
  }

  async function openLocalResult() {
    await runScan(requestLatestLocalScan, 'local')
  }

  async function rescan() {
    if (lastScan === 'url' || lastScan === 'local') await scan()
    else await scanDemo(lastScan)
  }

  function openHistoryResult(item: ScanHistoryItem) {
    setResult(item.result)
    setLastScan(item.kind)
    if (item.kind === 'url') setUrl(item.result.url)
    setHistoryOpen(false)
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  function removeHistoryItem(id: string) {
    setHistory(deleteScanHistory(id))
  }

  function removeAllHistory() {
    setHistory(clearScanHistory())
  }

  return (
    <main>
      <div className="hero-background">
        <nav className="top-nav" aria-label="주요 메뉴">
          <a className="brand" href="#top" aria-label="CodeError 홈"><strong>Code<span>Error</span></strong><small>WEB ACCESSIBILITY CHECKER</small></a>
          <div className="nav-links">
            <a href="#about">프로젝트 소개</a>
            <a href="#demo">실제 시연</a>
            <a href="https://github.com/jinwook0308/CodeError" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            <button type="button" className="history-nav-button" onClick={() => setHistoryOpen(true)} aria-haspopup="dialog">검사 기록 <span>{history.length}</span></button>
          </div>
        </nav>
        <section className="hero" id="top">
          <div className="hero-copy">
            <div className="hero-kicker"><span>✓</span> 초보 개발자를 위한 접근성 검사</div>
            <h1>웹 <em>접근성</em> 문제,<br />몇 초 만에 확인하세요</h1>
            <p>WCAG 기반 자동 검사로 웹사이트의 접근성 문제를 찾고,<br />초보 개발자도 이해할 수 있는 한국어 설명과 수정 방법을 제공합니다.</p>
            <ScanForm url={url} loading={loading} status={loadingSteps[step]} error={error} onUrlChange={(value) => { setUrl(value); setError('') }} onSubmit={scan} />
            <div className="local-result-callout">
              <div><strong>localhost도 위 입력창에서 바로 검사할 수 있어요.</strong><span>터미널로 검사한 결과가 있다면 오른쪽 버튼으로 다시 열 수 있어요.</span></div>
              <button type="button" onClick={openLocalResult} disabled={loading}>저장된 로컬 결과 열기 <span aria-hidden="true">→</span></button>
            </div>
            <div className="badge-row" id="open-source"><span>◈ WCAG 기반 검사</span><span>⌘ axe-core 엔진</span><span>&lt;/&gt; 한국어 수정 가이드</span><span>♧ 오픈소스</span></div>
          </div>
          <HeroGraphic />
        </section>
      </div>
      <div className="demo-wrap"><DemoPanel loading={loading} onScan={scanDemo} /></div>
      <div ref={resultsRef} className="content-wrap">
        {result ? <ResultsPanel key={result.scannedAt} result={result} onRescan={rescan} loading={loading} /> : (
          <section className="empty-state" id="about"><div className="empty-icon"><span>✓</span></div><div><span className="eyebrow">실제 axe-core 자동 검사</span><h2>URL을 입력하면 개선할 접근성 문제를 찾아드려요</h2><p>검사 결과에서 문제의 원인, 해당 HTML 요소, WCAG 기준과 바로 적용할 수 있는 수정 예시를 확인할 수 있습니다.</p></div><div className="empty-steps"><span><b>01</b> URL 입력</span><i /><span><b>02</b> 자동 검사</span><i /><span><b>03</b> 수정 가이드</span></div></section>
        )}
      </div>
      {historyOpen && <HistoryDialog items={history} onClose={() => setHistoryOpen(false)} onOpenResult={openHistoryResult} onDelete={removeHistoryItem} onClear={removeAllHistory} />}
      <footer><a className="brand footer-brand" href="#top"><strong>Code<span>Error</span></strong></a><p>더 이해하기 쉬운 웹 접근성 검사를 만듭니다.</p><span>Open source MVP · 2026</span></footer>
    </main>
  )

  
}
