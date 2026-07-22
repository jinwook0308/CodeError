export type Impact = "critical" | "serious" | "moderate" | "minor";

export interface ScanNode {
  html: string;
  target: string[];
}

export interface ScanIssue {
  id: string;
  title: string;
  impact: Impact;
  wcag: string[];
  description: string;
  solution: string;
  nodes: ScanNode[];
  exampleBefore: string;
  exampleAfter: string;
}

export interface ScanPreview {
  dataUrl: string;
  width: number;
  height: number;
}

export interface ScanResponse {
  success: true;
  url: string;
  scannedAt: string;
  score: number;
  summary: Record<Impact, number> & { total: number; passes: number };
  issues: ScanIssue[];
  preview?: ScanPreview;
}

export interface AccessibilityGuide {
  ruleId: string;
  title: string;
  description: string;
  solution: string;
  wcag: string[];
  exampleBefore: string;
  exampleAfter: string;
}
