import type { Impact, ScanHistoryItem, ScanIssue, ScanKind, ScanResult } from '../types/scan'

const STORAGE_KEY = 'codeerror.scan-history.v1'
const MAX_HISTORY_ITEMS = 10
const impacts: Impact[] = ['critical', 'serious', 'moderate', 'minor']

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isScanIssue(value: unknown): value is ScanIssue {
  if (!isObject(value) || typeof value.id !== 'string' || typeof value.title !== 'string') return false
  if (!impacts.includes(value.impact as Impact) || !isStringArray(value.wcag)) return false
  if (typeof value.description !== 'string' || typeof value.solution !== 'string') return false
  if (typeof value.exampleBefore !== 'string' || typeof value.exampleAfter !== 'string') return false
  return Array.isArray(value.nodes) && value.nodes.every((node) => (
    isObject(node) && typeof node.html === 'string' && isStringArray(node.target)
  ))
}

function isScanResult(value: unknown): value is ScanResult {
  if (!isObject(value) || value.success !== true || typeof value.url !== 'string') return false
  if (typeof value.scannedAt !== 'string' || typeof value.score !== 'number') return false
  if (!Number.isFinite(Date.parse(value.scannedAt)) || !Number.isFinite(value.score)) return false
  const summary = value.summary
  if (!isObject(summary) || !Array.isArray(value.issues) || !value.issues.every(isScanIssue)) return false

  const summaryKeys = [...impacts, 'total', 'passes']
  return summaryKeys.every((key) => typeof summary[key] === 'number' && Number.isFinite(summary[key]))
}

function isHistoryItem(value: unknown): value is ScanHistoryItem {
  if (!isObject(value) || typeof value.id !== 'string') return false
  if (!['url', 'before', 'after'].includes(value.kind as string)) return false
  return isScanResult(value.result)
}

export function loadScanHistory(): ScanHistoryItem[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    if (!isObject(parsed) || parsed.version !== 1 || !Array.isArray(parsed.items)) return []
    return parsed.items.filter(isHistoryItem).slice(0, MAX_HISTORY_ITEMS)
  } catch {
    return []
  }
}

function persistHistory(items: ScanHistoryItem[]): ScanHistoryItem[] {
  let itemsToStore = items.slice(0, MAX_HISTORY_ITEMS)

  while (itemsToStore.length > 0) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, items: itemsToStore }))
      return itemsToStore
    } catch {
      itemsToStore = itemsToStore.slice(0, -1)
    }
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage를 사용할 수 없는 환경에서는 현재 세션의 기록만 비워 둡니다.
  }
  return []
}

export function addScanHistory(result: ScanResult, kind: ScanKind): ScanHistoryItem[] {
  const item: ScanHistoryItem = {
    id: `${result.scannedAt}:${kind}`,
    kind,
    result,
  }
  const history = loadScanHistory().filter((saved) => saved.id !== item.id)
  return persistHistory([item, ...history])
}

export function deleteScanHistory(id: string): ScanHistoryItem[] {
  return persistHistory(loadScanHistory().filter((item) => item.id !== id))
}

export function clearScanHistory(): ScanHistoryItem[] {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // 저장소 접근이 차단되어도 화면에서는 기록을 비웁니다.
  }
  return []
}
