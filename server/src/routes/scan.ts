import { Router, type Response } from "express";
import { isLoopbackAddress, normalizeLocalUrl } from "../services/localUrlSafety.js";
import { loadLocalScanResult, saveLocalScanResult } from "../services/localScanStore.js";
import { scanWebsite } from "../services/scanner.js";

export const scanRouter = Router();
let scanInProgress = false;

async function respondWithScan(response: Response, scan: () => ReturnType<typeof scanWebsite>): Promise<void> {
  if (scanInProgress) {
    response.status(429).json({ success: false, message: "다른 검사가 진행 중입니다. 잠시 후 다시 시도해주세요." });
    return;
  }
  scanInProgress = true;
  try {
    response.json(await scan());
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : "";
    const isInputError = /입력|URL|http|사설|로컬|2,048|사용자 정보/.test(rawMessage);
    const isTimeout = /timeout|시간이 초과/i.test(rawMessage);
    const message = isInputError
      ? rawMessage
      : isTimeout
        ? "검사 시간이 초과되었습니다. 잠시 후 다시 시도해주세요."
        : "웹사이트에 접속하거나 검사할 수 없습니다. URL을 확인한 후 다시 시도해주세요.";
    response.status(isInputError ? 400 : isTimeout ? 504 : 502).json({ success: false, message });
  } finally {
    scanInProgress = false;
  }
}

scanRouter.post("/", async (request, response) => {
  await respondWithScan(response, () => scanWebsite(request.body?.url));
});

scanRouter.post("/local", async (request, response) => {
  if (process.env.NODE_ENV === "production" || !isLoopbackAddress(request.socket.remoteAddress)) {
    response.status(403).json({
      success: false,
      message: "localhost 검사는 사용자 PC에서 실행 중인 CodeError 개발 서버에서만 사용할 수 있습니다.",
    });
    return;
  }

  await respondWithScan(response, async () => {
    const target = normalizeLocalUrl(request.body?.url);
    const result = await scanWebsite(target.href, { trustedHostnames: [target.hostname] });
    await saveLocalScanResult(result);
    return result;
  });
});

scanRouter.get("/local/latest", async (_request, response) => {
  try {
    const result = await loadLocalScanResult();
    if (!result) {
      response.status(404).json({
        success: false,
        message: "아직 로컬 검사 결과가 없습니다. 먼저 npm run scan:local -- localhost:포트를 실행해주세요.",
      });
      return;
    }
    response.json(result);
  } catch {
    response.status(500).json({ success: false, message: "저장된 로컬 검사 결과를 불러오지 못했습니다." });
  }
});

scanRouter.post("/demo/:variant", async (request, response) => {
  const variant = request.params.variant;
  if (variant !== "before" && variant !== "after") {
    response.status(404).json({ success: false, message: "존재하지 않는 시연 페이지입니다." });
    return;
  }
  const demoUrl = `http://127.0.0.1:3001/demo/${variant}`;
  await respondWithScan(response, () => scanWebsite(demoUrl, { trustedHostnames: ["127.0.0.1"] }));
});
