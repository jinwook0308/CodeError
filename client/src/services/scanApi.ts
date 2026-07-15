import type { ScanResult } from '../types/scan'

export async function requestScan(url: string): Promise<ScanResult> {
  return request('/api/scan', { url })
}

export async function requestDemoScan(variant: 'before' | 'after'): Promise<ScanResult> {
  return request(`/api/scan/demo/${variant}`)
}

async function request(endpoint: string, body?: { url: string }): Promise<ScanResult> {
  let response: Response
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
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
