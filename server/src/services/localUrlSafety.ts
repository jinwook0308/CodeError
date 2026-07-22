const MAX_URL_LENGTH = 2048;
const ALLOWED_LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export function isLoopbackAddress(address: string | undefined): boolean {
  return address === "127.0.0.1" || address === "::1" || address === "::ffff:127.0.0.1";
}

export function normalizeLocalUrl(input: unknown): URL {
  if (typeof input !== "string" || !input.trim()) {
    throw new Error("검사할 localhost URL을 입력해주세요.");
  }

  const value = input.trim();
  if (value.length > MAX_URL_LENGTH) {
    throw new Error("URL이 너무 깁니다. 2,048자 이하로 입력해주세요.");
  }

  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `http://${value}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error("올바른 localhost URL을 입력해주세요.");
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error("Local Runner는 http 또는 https URL만 검사할 수 있습니다.");
  }
  if (url.username || url.password) {
    throw new Error("사용자 정보가 포함된 URL은 검사할 수 없습니다.");
  }

  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  if (!ALLOWED_LOCAL_HOSTNAMES.has(hostname)) {
    throw new Error("Local Runner는 localhost, 127.0.0.1 또는 ::1 주소만 검사할 수 있습니다.");
  }

  url.hash = "";
  return url;
}
