import type { ScanResult } from '../types/scan'

const localHostnames = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])

export function isLocalScanTarget(input: string): boolean {
  const value = input.trim()
  if (!value) return false
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `http://${value}`
  try {
    return localHostnames.has(new URL(candidate).hostname.toLowerCase())
  } catch {
    return false
  }
}

export async function requestScan(url: string): Promise<ScanResult> {
  return request(isLocalScanTarget(url) ? '/api/scan/local' : '/api/scan', { url })
}

export async function requestDemoScan(variant: 'before' | 'after'): Promise<ScanResult> {
  return request(`/api/scan/demo/${variant}`)
}

async function request(endpoint: string, body?: { url: string }, method = 'POST'): Promise<ScanResult> {
  let response: Response
  try {
    response = await fetch(endpoint, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
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
