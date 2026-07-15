const sharedStyles = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, sans-serif; background: #f4f6fb; color: #172033; }
  .shell { max-width: 920px; margin: 0 auto; padding: 36px 24px 72px; }
  header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 42px; }
  .logo { font-size: 22px; font-weight: 800; color: #5b3ee4; }
  nav { display: flex; gap: 22px; }
  nav a { color: #455065; text-decoration: none; }
  .hero { display: grid; grid-template-columns: 1fr 300px; gap: 36px; align-items: center; background: white; padding: 42px; border-radius: 22px; box-shadow: 0 18px 45px rgba(23,32,51,.08); }
  h1 { margin: 0 0 14px; font-size: 38px; line-height: 1.2; }
  h2, h3 { margin-top: 28px; }
  p { line-height: 1.7; }
  .hero img { display: block; width: 100%; border-radius: 16px; }
  .form { margin-top: 24px; display: grid; grid-template-columns: 1fr auto; gap: 10px; }
  input { width: 100%; padding: 13px; border: 1px solid #cfd5e1; border-radius: 9px; }
  button { min-width: 48px; padding: 12px 18px; border: 0; border-radius: 9px; background: #6c4dff; color: white; font-weight: 700; }
  .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 22px; }
  .feature { background: white; border: 1px solid #e3e7ef; border-radius: 14px; padding: 18px; }
  footer { margin-top: 34px; color: #667085; font-size: 13px; }
`;

const demoImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='420'%3E%3Crect width='600' height='420' rx='32' fill='%23eee9ff'/%3E%3Ccircle cx='300' cy='180' r='90' fill='%236c4dff' opacity='.8'/%3E%3Cpath d='M235 285h130' stroke='%23382a78' stroke-width='18' stroke-linecap='round'/%3E%3C/svg%3E";

export const beforeDemoPage = `<!doctype html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${sharedStyles}.low-contrast{color:#c7cbd4}</style></head>
<body><div class="shell"><header><div class="logo">Bright Shop</div><nav><a href="#"></a><a href="#features">기능</a></nav></header>
<div class="hero" aria-madeup="demo"><div><h1>더 편리한 쇼핑 경험</h1><h3>오늘의 추천 상품</h3><p class="low-contrast">누구나 편하게 사용할 수 있는 쇼핑 서비스를 만나보세요.</p>
<div class="form"><input id="email" type="email"><button><svg width="20" height="20" aria-hidden="true"><path d="M2 10h16M12 4l6 6-6 6" stroke="currentColor" fill="none"/></svg></button></div></div>
<img src="${demoImage}"></div>
<div class="features" id="features"><div class="feature"><b>빠른 배송</b><p>주문한 상품을 빠르게 받아보세요.</p></div><div class="feature"><b>안전 결제</b><p>보호된 결제 환경을 제공합니다.</p></div><div class="feature"><b>고객 지원</b><p>언제든 문의할 수 있습니다.</p></div></div>
<footer>© 2026 Bright Shop</footer></div></body></html>`;

export const afterDemoPage = `<!doctype html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bright Shop 접근성 개선 페이지</title><style>${sharedStyles}.description{color:#455065}</style></head>
<body><div class="shell"><header><div class="logo">Bright Shop</div><nav aria-label="주요 메뉴"><a href="#content">본문으로 이동</a><a href="#features">기능</a></nav></header>
<main id="content"><div class="hero" aria-label="서비스 소개"><div><h1>더 편리한 쇼핑 경험</h1><h2>오늘의 추천 상품</h2><p class="description">누구나 편하게 사용할 수 있는 쇼핑 서비스를 만나보세요.</p>
<div class="form"><div><label for="email">이메일 주소</label><input id="email" type="email" placeholder="name@example.com"></div><button aria-label="이메일로 추천 상품 받기"><svg width="20" height="20" aria-hidden="true"><path d="M2 10h16M12 4l6 6-6 6" stroke="currentColor" fill="none"/></svg></button></div></div>
<img src="${demoImage}" alt="Bright Shop 추천 상품을 상징하는 보라색 원형 그래픽"></div>
<section class="features" id="features" aria-label="서비스 특징"><div class="feature"><h2>빠른 배송</h2><p>주문한 상품을 빠르게 받아보세요.</p></div><div class="feature"><h2>안전 결제</h2><p>보호된 결제 환경을 제공합니다.</p></div><div class="feature"><h2>고객 지원</h2><p>언제든 문의할 수 있습니다.</p></div></section></main>
<footer>© 2026 Bright Shop</footer></div></body></html>`;
