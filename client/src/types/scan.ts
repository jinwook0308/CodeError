export type Impact = 'critical' | 'serious' | 'moderate' | 'minor'

export interface ScanIssue {
  id: string
  title: string
  impact: Impact
  wcag: string[]
  description: string
  solution: string
  nodes: { html: string; target: string[] }[]
  exampleBefore: string
  exampleAfter: string
}

export interface ScanResult {
  success: true
  url: string
  scannedAt: string
  score: number
  summary: Record<Impact, number> & { total: number; passes: number }
  issues: ScanIssue[]
}

export type ScanKind = 'url' | 'before' | 'after'

export interface ScanHistoryItem {
  id: string
  kind: ScanKind
  result: ScanResult
}
