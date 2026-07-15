# CodeError

CodeError는 웹 접근성에 익숙하지 않은 개발자를 위한 오픈소스 웹 접근성 자동 검사 및 한국어 수정 가이드 MVP입니다. URL을 입력하면 서버가 Playwright Chromium으로 페이지를 열고 axe-core 검사를 수행한 뒤, 문제의 원인·대상 요소·WCAG 기준·수정 예시를 보여줍니다.

> 화면의 점수는 CodeError의 자동 검사 결과를 바탕으로 계산한 참고용 점수이며 공식 WCAG 적합성 인증 점수가 아닙니다.

## 주요 기능

- 프로토콜이 없는 URL의 `https://` 자동 보정
- Playwright와 axe-core를 이용한 실제 단일 페이지 검사
- Critical, Serious, Moderate, Minor 심각도별 집계 및 필터
- 주요 axe 규칙 10개의 초보자용 한국어 설명과 수정 코드 예시
- 가이드가 없는 규칙의 axe-core 기반 fallback 안내
- 현재 URL 재검사 및 단계별 로딩 상태
- 잘못된 URL, 접속 실패, HTTPS 오류, 타임아웃의 사용자 친화적 처리
- localhost, IP literal 및 DNS가 사설 IP로 해석되는 대상 차단
- 검사 성공·실패와 관계없이 Playwright 브라우저 종료

## 기술 스택

- Client: React 19, TypeScript, Vite, 일반 CSS
- Server: Node.js, Express, TypeScript, CORS
- Inspection: Playwright Chromium, `@axe-core/playwright`

## 폴더 구조

```text
CodeError/
├─ client/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ services/
│  │  ├─ styles/
│  │  ├─ types/
│  │  ├─ App.tsx
│  │  └─ main.tsx
│  ├─ package.json
│  └─ vite.config.ts
├─ server/
│  ├─ src/
│  │  ├─ data/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ types/
│  │  └─ index.ts
│  ├─ package.json
│  └─ tsconfig.json
├─ .gitignore
├─ LICENSE
└─ README.md
```

## 설치

Node.js LTS와 npm이 필요합니다.

```powershell
cd CodeError\client
npm install

cd ..\server
npm install
npx playwright install chromium
```

## 개발 서버 실행

PowerShell 창 두 개를 사용합니다.

첫 번째 창:

```powershell
cd CodeError\server
npm run dev
```

두 번째 창:

```powershell
cd CodeError\client
npm run dev
```

브라우저에서 `http://localhost:5173`을 열고 공개 웹사이트 URL을 입력합니다. 서버는 `http://localhost:3001`에서 실행되며 Vite가 `/api` 요청을 프록시합니다.

## 빌드 및 검사

```powershell
cd CodeError\server
npm run typecheck
npm run build

cd ..\client
npm run lint
npm run build
```

## API

### `GET /api/health`

```json
{ "status": "ok" }
```

### `POST /api/scan`

```json
{ "url": "https://example.com" }
```

응답에는 정규화된 URL, 검사 시간, 참고 점수, 심각도별 요약, 통과 규칙 수, 문제별 대상 HTML과 한국어 수정 가이드가 포함됩니다.

## 현재 범위와 제한

- 입력한 URL의 첫 페이지 하나만 검사합니다.
- 로그인, 검사 기록, 데이터베이스, PDF, AI 수정, GitHub 연동은 구현하지 않았습니다.
- axe-core 자동 검사는 수동 접근성 평가 전체를 대체하지 않습니다.
- 리디렉션 및 하위 리소스 요청도 사설 주소를 차단하지만, 공개 DNS 환경과 네트워크 정책에 따라 접속 결과가 달라질 수 있습니다.
- 서버는 MVP 안정성을 위해 동시에 한 번의 검사만 처리합니다.
