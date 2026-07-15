import { useEffect, useRef, useState } from 'react'
import type { ScanHistoryItem } from '../types/scan'

interface Props {
  items: ScanHistoryItem[]
  onClose: () => void
  onOpenResult: (item: ScanHistoryItem) => void
  onDelete: (id: string) => void
  onClear: () => void
}

function pageTitle(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.pathname === '/demo/before') return '수정 전 시연 페이지'
    if (parsed.pathname === '/demo/after') return '수정 후 시연 페이지'
    return `${parsed.hostname}${parsed.pathname === '/' ? '' : parsed.pathname}`
  } catch {
    return url
  }
}

function formattedDate(value: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function HistoryDialog({ items, onClose, onOpenResult, onDelete, onClear }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
    }
  }, [])

  return (
    <dialog
      className="history-dialog"
      ref={dialogRef}
      aria-labelledby="history-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <header className="history-header">
        <div>
          <span className="eyebrow">실제 검사 결과</span>
          <h2 id="history-title">검사 기록</h2>
          <p>이 브라우저에 최근 검사 결과를 최대 10개까지 저장합니다.</p>
        </div>
        <button type="button" className="history-close" onClick={onClose} aria-label="검사 기록 닫기" autoFocus>×</button>
      </header>

      {items.length ? (
        <>
          <div className="history-list">
            {items.map((item) => (
              <article className="history-item" key={item.id}>
                <div className={`history-score ${item.result.score >= 80 ? 'good' : item.result.score >= 50 ? 'caution' : 'poor'}`}>
                  <strong>{item.result.score}</strong>
                  <span>/100</span>
                </div>
                <div className="history-copy">
                  <h3>{pageTitle(item.result.url)}</h3>
                  <p title={item.result.url}>{item.result.url}</p>
                  <small>{formattedDate(item.result.scannedAt)} · 문제 {item.result.summary.total}개</small>
                </div>
                <div className="history-actions">
                  <button type="button" className="history-open" onClick={() => onOpenResult(item)}>결과 열기</button>
                  <button type="button" className="history-delete" onClick={() => onDelete(item.id)} aria-label={`${pageTitle(item.result.url)} 검사 기록 삭제`}>삭제</button>
                </div>
              </article>
            ))}
          </div>
          <footer className="history-footer">
            <span>기록은 서버로 전송되지 않고 현재 브라우저에만 저장됩니다.</span>
            {confirmClear ? (
              <div className="clear-confirm">
                <button type="button" onClick={() => setConfirmClear(false)}>취소</button>
                <button type="button" className="confirm-button" onClick={onClear}>정말 전체 삭제</button>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirmClear(true)}>전체 삭제</button>
            )}
          </footer>
        </>
      ) : (
        <div className="history-empty">
          <span aria-hidden="true">↺</span>
          <h3>아직 검사 기록이 없습니다</h3>
          <p>웹사이트를 검사하면 실제 결과가 여기에 자동으로 저장됩니다.</p>
        </div>
      )}
    </dialog>
  )
}
