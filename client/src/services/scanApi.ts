import type { ScanResult } from '../types/scan'

export async function requestScan(url: string): Promise<ScanResult> {
  let response: Response
  try {
    response = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
  } catch {
    throw new Error('검사 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.')
  }

  const data = await response.json().catch(() => null) as ScanResult | { message?: string } | null
  if (!response.ok) {
    throw new Error(data && 'message' in data && data.message ? data.message : '검사 요청을 처리하지 못했습니다.')
  }
  return data as ScanResult
}
