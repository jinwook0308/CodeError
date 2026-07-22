import assert from "node:assert/strict";
import test from "node:test";
import { isLoopbackAddress, normalizeLocalUrl } from "./localUrlSafety.js";

test("로컬 요청 주소만 허용한다", () => {
  assert.equal(isLoopbackAddress("127.0.0.1"), true);
  assert.equal(isLoopbackAddress("::1"), true);
  assert.equal(isLoopbackAddress("::ffff:127.0.0.1"), true);
  assert.equal(isLoopbackAddress("192.168.0.10"), false);
  assert.equal(isLoopbackAddress(undefined), false);
});

test("프로토콜이 없는 localhost는 http로 보정한다", () => {
  assert.equal(normalizeLocalUrl("localhost:5173").href, "http://localhost:5173/");
});

test("127.0.0.1과 경로를 허용한다", () => {
  assert.equal(normalizeLocalUrl("http://127.0.0.1:3000/demo").href, "http://127.0.0.1:3000/demo");
});

test("IPv6 loopback을 허용한다", () => {
  assert.equal(normalizeLocalUrl("http://[::1]:4000").hostname, "[::1]");
});

test("공개 도메인과 사설망 주소는 거부한다", () => {
  assert.throws(() => normalizeLocalUrl("https://example.com"), /localhost/);
  assert.throws(() => normalizeLocalUrl("http://192.168.0.10:5173"), /localhost/);
});

test("http 이외의 프로토콜과 사용자 정보는 거부한다", () => {
  assert.throws(() => normalizeLocalUrl("ftp://localhost:21"), /http/);
  assert.throws(() => normalizeLocalUrl("http://user:pass@localhost:5173"), /사용자 정보/);
});
