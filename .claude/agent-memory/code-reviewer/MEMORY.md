# 코드 리뷰어 에이전트 메모리

## 프로젝트 구조 핵심 정보
- 미들웨어: `src/proxy.ts` (middleware.ts 아님)
- 인증: `auth.ts` (루트, src 외부)
- i18n 설정: `i18n/routing.ts`, `i18n/request.ts` (src 외부)
- 경로 별칭: `@/*` → `./src/*` (src 외부 파일은 `@/../auth` 형태로 참조)
- TailwindCSS v4: `@import "tailwindcss"` + `@theme inline {}` + `@custom-variant dark` 방식

## 반복적으로 발견된 이슈 패턴
- **Server Component에서 훅 사용**: `page.tsx`가 Server Component인데 `useTranslations`, `useLocale` 훅 사용 중 (next-intl은 Server Component에서도 허용하지만 "use client" 없이 훅 사용은 next-intl 전용 패턴)
- **하드코딩된 로케일**: `auth.ts`의 `pages.signIn: "/ko/login"` → "/login"으로 수정됨, 그러나 next-intl 미들웨어와 callbackUrl 처리 상호작용 문제 잔존
- **경로 별칭 미사용**: `src/app/[locale]/layout.tsx`에서 `../../../i18n/routing` 상대 경로 사용 — 반복 미수정
- **이중 html/body 태그**: 루트 layout과 locale layout 모두 html/body 태그 포함 → 수정 완료 (루트만 html/body, locale은 Provider만)
- **로그인 폼 미구현**: login/register 페이지 → Client Component("use client") + signIn("credentials", {redirect:false}) 패턴으로 수정 완료
- **auth.ts redirect 콜백 버그 패턴**: url이 상대경로일 때 url.startsWith(baseUrl)이 false → 항상 로그인 페이지로 리다이렉트. callbackUrl 파라미터에서 로케일 추출 필요
- **SUPPORTED_LOCALES 이중 관리**: auth.ts와 i18n/routing.ts에 동일 로케일 목록 중복 정의

## 인증 관련 패턴
- NextAuth v5 beta: `auth.ts` 루트에 설정, `src/app/api/auth/[...nextauth]/route.ts`에서 handlers 내보냄
- route.ts의 import: `@/../auth` (경로 별칭으로 루트 auth.ts 참조)
- JWT 세션 전략 사용 중
- 테스트 계정 하드코딩 (스타터킷 목적상 허용)

## i18n 패턴
- `useTranslations()`, `useLocale()`은 Server/Client 모두 사용 가능 (next-intl v4)
- `getMessages()`는 Server Component 전용
- LocaleSwitcher: next-intl의 `Link`, `useRouter` 대신 `next/navigation` 사용 중 — 쿼리 파라미터 유실 가능성

## 검토된 버전 정보
- Next.js 16.1.6, React 19.2.3
- next-intl 4.8.3, next-themes 0.4.6, NextAuth 5.0.0-beta.30
- TailwindCSS v4 (postcss 플러그인 방식)

## 상세 이슈 문서
- [첫 번째 전체 리뷰 이슈 목록](./review-2026-02-25.md)
