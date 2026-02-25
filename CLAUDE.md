# claude-nextjs-starterkit

## 프로젝트 개요
Next.js 16 App Router 기반 풀스택 스타터킷.
다국어(next-intl), 테마(next-themes), 인증(NextAuth v5)이 사전 설정되어 있음.

## 기술 스택
- **프레임워크**: Next.js 16.1.6 (App Router) + React 19
- **언어**: TypeScript 5 (strict 모드)
- **스타일링**: TailwindCSS v4 + shadcn/ui + Radix UI
- **다국어**: next-intl v4 (한국어 기본, 영어 지원)
- **테마**: next-themes v0.4.6 (라이트/다크/시스템)
- **인증**: NextAuth v5.0.0-beta.30 (Credentials Provider)
- **패키지 매니저**: npm

## 디렉토리 구조
```
src/
├── app/
│   ├── [locale]/
│   │   ├── (main)/       # 메인 레이아웃 그룹 (홈, about)
│   │   └── (auth)/       # 인증 레이아웃 그룹 (login, register)
│   └── api/
│       └── auth/[...nextauth]/
├── components/
│   ├── layout/           # Header, Navigation, Footer
│   ├── shared/           # ThemeProvider, ThemeToggle, LocaleSwitcher
│   └── ui/               # shadcn/ui 컴포넌트
├── lib/
│   └── utils.ts          # cn() 유틸리티
└── messages/
    ├── ko.json           # 한국어 메시지
    └── en.json           # 영어 메시지

i18n/
├── routing.ts            # 로케일 라우팅 정의
└── request.ts            # 요청 기반 로케일 설정

auth.ts                   # NextAuth 설정 (루트)
src/proxy.ts              # next-intl 미들웨어 (middleware.ts 아님)
```

## 코드 컨벤션
- 경로 별칭: `@/*` → `src/*`
- 컴포넌트: PascalCase, 파일명도 PascalCase
- 유틸리티/훅: camelCase
- 클라이언트 컴포넌트는 파일 상단에 `"use client"` 선언
- 스타일은 `cn()` 함수로 TailwindCSS 클래스 병합

## i18n 규칙
- 지원 로케일: `ko`(기본), `en`
- 새 텍스트 추가 시 `src/messages/ko.json`, `src/messages/en.json` 모두 업데이트
- 페이지/컴포넌트에서 `useTranslations()` 훅으로 메시지 사용

## shadcn/ui 컴포넌트 추가
```bash
npx shadcn@latest add <component-name>
```

## 개발 서버 실행
```bash
npm run dev
```

## 주의사항
- `src/proxy.ts`가 미들웨어 역할 (`middleware.ts`가 아님)
- NextAuth 테스트 계정: `test@example.com` / `password`
- TailwindCSS v4는 `@import "tailwindcss"` 방식 사용 (v3와 다름)
