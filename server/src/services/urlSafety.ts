import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const MAX_URL_LENGTH = 2048;

function isPrivateIpv4(address: string): boolean {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return true;
  const [a, b] = parts;
  return (
    a === 0 || a === 10 || a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

function isPrivateIpv6(address: string): boolean {
  const normalized = address.toLowerCase();
  return normalized === "::" || normalized === "::1" || normalized.startsWith("fc") ||
    normalized.startsWith("fd") || normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb");
}

function isPrivateAddress(address: string): boolean {
  const version = isIP(address);
  return version === 4 ? isPrivateIpv4(address) : version === 6 ? isPrivateIpv6(address) : true;
}

export function normalizeUrl(input: unknown): URL {
  if (typeof input !== "string" || !input.trim()) throw new Error("검사할 웹사이트 URL을 입력해주세요.");
  const value = input.trim();
  if (value.length > MAX_URL_LENGTH) throw new Error("URL이 너무 깁니다. 2,048자 이하로 입력해주세요.");
  const candidate = /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`;
  let url: URL;
  try { url = new URL(candidate); } catch { throw new Error("올바른 웹사이트 URL을 입력해주세요."); }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error("http 또는 https 웹사이트만 검사할 수 있습니다.");
  if (url.username || url.password) throw new Error("사용자 정보가 포함된 URL은 검사할 수 없습니다.");
  url.hash = "";
  return url;
}

export async function assertPublicHostname(hostname: string): Promise<void> {
  const name = hostname.toLowerCase().replace(/\.$/, "");
  if (name === "localhost" || name.endsWith(".localhost")) throw new Error("로컬 또는 사설 네트워크 주소는 검사할 수 없습니다.");
  const literalVersion = isIP(name);
  const addresses = literalVersion ? [{ address: name }] : await lookup(name, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error("로컬 또는 사설 네트워크 주소는 검사할 수 없습니다.");
  }
}
