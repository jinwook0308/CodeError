import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { ScanResponse } from "../types/scan.js";

const serverRoot = fileURLToPath(new URL("../..", import.meta.url));
export const defaultLocalScanResultPath = join(serverRoot, ".codeerror", "latest-local-scan.json");

export async function saveLocalScanResult(result: ScanResponse, path = defaultLocalScanResultPath): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(result, null, 2), "utf8");
}

export async function loadLocalScanResult(path = defaultLocalScanResultPath): Promise<ScanResponse | null> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as ScanResponse;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

