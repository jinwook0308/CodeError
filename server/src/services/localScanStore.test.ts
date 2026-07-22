import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import type { ScanResponse } from "../types/scan.js";
import { loadLocalScanResult, saveLocalScanResult } from "./localScanStore.js";

const sample: ScanResponse = {
  success: true,
  url: "http://localhost:5173/",
  scannedAt: "2026-07-23T00:00:00.000Z",
  score: 100,
  summary: { total: 0, critical: 0, serious: 0, moderate: 0, minor: 0, passes: 10 },
  issues: [],
};

test("저장한 Local Runner 결과를 다시 불러온다", async (context) => {
  const directory = await mkdtemp(join(tmpdir(), "codeerror-local-result-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const path = join(directory, "latest.json");

  assert.equal(await loadLocalScanResult(path), null);
  await saveLocalScanResult(sample, path);
  assert.deepEqual(await loadLocalScanResult(path), sample);
});

