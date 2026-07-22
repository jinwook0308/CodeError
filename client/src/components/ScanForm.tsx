import type { FormEvent } from 'react'

interface Props {
  url: string
  loading: boolean
  status: string
  error: string
  onUrlChange: (value: string) => void
  onSubmit: () => void
}

export function ScanForm({ url, loading, status, error, onUrlChange, onSubmit }: Props) {
  function submit(event: FormEvent) {
    event.preventDefault()
    if (!loading) onSubmit()
  }

  return (
    <form className="scan-form" onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor="scan-url">검사할 공개 URL 또는 localhost</label>
      <div className={`url-control ${error ? 'has-error' : ''}`}>
        <span className="globe-icon" aria-hidden="true">◎</span>
        <input id="scan-url" type="text" inputMode="url" autoComplete="url" maxLength={2048}
          placeholder="공개 URL을 입력하세요" value={url}
          onChange={(event) => onUrlChange(event.target.value)} disabled={loading} />
        <button type="submit" disabled={loading || !url.trim()}>
          {loading ? <><span className="spinner" /> 검사 중</> : <>검사 시작 <span aria-hidden="true">→</span></>}
        </button>
      </div>
      <div className="form-message" aria-live="polite">
        {error ? <p className="error-message">{error}</p> : loading ? <p className="loading-message">{status}</p> : null}
      </div>
    </form>
  )
}
