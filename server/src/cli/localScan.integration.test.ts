import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import test from "node:test";
import { scanWebsite } from "../services/scanner.js";

test("로컬 HTTP 페이지를 실제 axe-core로 검사한다", { timeout: 30_000 }, async (context) => {
  const server = createServer((_request, response) => {
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end(`<!doctype html>
      <html lang="ko">
        <head><title>Local Runner Test</title></head>
        <body><main><h1>테스트</h1><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw="></main></body>
      </html>`);
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  context.after(() => new Promise<void>((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));

  const { port } = server.address() as AddressInfo;
  const result = await scanWebsite(`http://127.0.0.1:${port}`, { trustedHostnames: ["127.0.0.1"] });

  assert.equal(result.success, true);
  assert.equal(result.url, `http://127.0.0.1:${port}/`);
  assert.ok(result.issues.some((issue) => issue.id === "image-alt"));
});

