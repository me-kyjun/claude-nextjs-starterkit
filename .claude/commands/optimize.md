---
description: '코드베이스를 전반적으로 분석하고 성능 최적화를 진행합니다'
allowed-tools:
  [
    'Read',
    'Edit',
    'Glob',
    'Grep',
    'Bash(npm run build:*)',
    'Bash(npm run lint:*)',
  ]
---

# Claude 명령어: Optimize

Next.js 프로젝트의 코드베이스를 전반적으로 분석하고 성능 최적화를 진행합니다.

## 사용법

```
/optimize
```

## 분석 범위

### 1. 번들 크기 및 코드 스플리팅
- `next/dynamic`으로 동적 임포트 가능한 컴포넌트 탐색
- 무거운 라이브러리의 tree-shaking 가능 여부 확인
- 불필요한 클라이언트 번들 포함 여부 검토

### 2. 렌더링 전략 최적화
- Server Component / Client Component 분리 적절성 검토
- `"use client"` 지시어가 필요 이상으로 넓게 적용된 경우 탐색
- 불필요한 리렌더링 유발 패턴 확인 (예: 인라인 객체/함수)

### 3. 이미지 및 폰트 최적화
- `<img>` 태그를 `next/image`로 교체 가능한 케이스 탐색
- `next/font`로 최적화 가능한 폰트 로드 방식 확인

### 4. 데이터 페칭 최적화
- `fetch` 캐싱 옵션(`cache`, `revalidate`) 누락 여부 확인
- 병렬 처리 가능한 순차 `await` 패턴 탐색 (`Promise.all` 활용 제안)
- 중복 데이터 요청 여부 확인

### 5. React 최적화
- `memo`, `useCallback`, `useMemo` 적용 가능한 패턴 탐색
- 불필요한 `useEffect` 사용 여부 검토
- 상태 과다 사용 및 불필요한 상태 끌어올림 확인

### 6. i18n 성능
- `useTranslations()` 호출 범위 최소화 여부 확인
- 메시지 키 일관성 및 미사용 키 탐색

### 7. CSS / TailwindCSS
- 중복 스타일 클래스 패턴 확인
- `cn()` 함수 미사용으로 인한 클래스 충돌 가능성 탐색

### 8. 접근성 및 SEO
- 메타데이터(`metadata` export) 누락 페이지 탐색
- `<title>`, `<description>` 미설정 여부 확인

## 진행 프로세스

1. **탐색** — `Glob`으로 `src/` 내 모든 `.tsx`, `.ts` 파일 목록 수집
2. **분석** — 각 분석 범위에 따라 파일 읽기 및 패턴 탐색
3. **보고** — 발견된 문제를 심각도(High / Medium / Low)별로 정리
4. **최적화 실행** — 사용자 승인 후 실제 코드 수정 진행
5. **검증** — 가능한 경우 `npm run build` 또는 `npm run lint`로 결과 확인

## 보고 형식

```
## 최적화 분석 결과

### 🔴 High (즉시 수정 권장)
- [파일:라인] 문제 설명 → 제안 해결책

### 🟡 Medium (검토 권장)
- [파일:라인] 문제 설명 → 제안 해결책

### 🟢 Low (선택적 개선)
- [파일:라인] 문제 설명 → 제안 해결책
```

## 참고사항

- 분석 결과를 먼저 보고한 후, 사용자 확인을 거쳐 수정 진행
- 기능 변경 없이 성능만 개선하는 것을 원칙으로 함
- 수정 시 기존 동작이 깨지지 않도록 주의
- TypeScript strict 모드 준수 필수
- TailwindCSS v4 문법(`@import "tailwindcss"`) 유지
