import { Router } from "express";
import { scanWebsite } from "../services/scanner.js";

export const scanRouter = Router();
let scanInProgress = false;

scanRouter.post("/", async (request, response) => {
  if (scanInProgress) return response.status(429).json({ success: false, message: "다른 검사가 진행 중입니다. 잠시 후 다시 시도해주세요." });
  scanInProgress = true;
  try {
    response.json(await scanWebsite(request.body?.url));
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
});
