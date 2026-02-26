# Claude Code Hooks + Slack Webhook 알림 설정 가이드

## 개요

Claude Code 작업 중 두 가지 주요 이벤트를 **Slack 모바일 앱**으로 실시간 알림 받습니다:
- ⚠️ **권한 요청 시**: Slack 채널로 권한 알림 전송
- ✅ **작업 완료 시**: Slack 채널로 완료 알림 전송

---

## 설치 단계

### 1단계: Slack Workspace에서 Incoming Webhook 생성

1. [Slack App 디렉토리](https://api.slack.com/apps)에서 앱 생성:
   - **Create New App** → **From scratch** 선택
   - **App Name**: `Claude Code Hooks` (자유)
   - **Workspace**: 본인의 Slack Workspace 선택

2. **Incoming Webhooks** 활성화:
   - 좌측 메뉴 → **Incoming Webhooks**
   - **Activate Incoming Webhooks** 토글 `On`
   - **Add New Webhook to Workspace** 클릭

3. **Webhook URL 복사**:
   - 채널 선택 (예: #claude-notifications)
   - **Allow** 클릭
   - **Webhook URL** 복사 (예: `https://hooks.slack.com/services/T.../B.../XXX`)

### 2단계: Webhook URL을 `.claude/.env.local`에 설정

파일 위치: `D:\workspace\claude-nextjs-starterkit\.claude\.env.local`

```bash
# Claude Code Hooks 환경변수
# 설정 가이드는 .claude/SLACK_SETUP.md 참고

# Slack Webhook URL (https://api.slack.com/messaging/webhooks)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../XXX
```

> ⚠️ **주의**: `.env.local`은 **git에 커밋되지 않습니다**. 로컬 머신에만 저장됩니다.

### 3단계: Claude Code 재시작

Hooks 설정 로드를 위해 Claude Code를 완전히 재시작합니다.

```bash
# Claude Code 종료 후 다시 실행
```

---

## 검증

### 방법 1: 직접 Webhook 테스트

```bash
MSYS_NO_PATHCONV=1 curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"text":"✅ Claude Hooks 연동 테스트 성공"}' \
  "https://hooks.slack.com/services/YOUR_WEBHOOK_URL"
```

응답이 `ok`이면 성공입니다.

### 방법 2: Claude Code에서 권한 요청 알림 확인

1. Claude Code에서 파일 편집 요청 (권한 필요)
2. 권한 승인 시 Slack 채널에 **⚠️ Claude 권한 요청** 메시지 도착 확인

### 방법 3: 작업 완료 알림 확인

1. Claude Code에서 작업 완료
2. Slack 채널에 **✅ Claude 작업 완료** 메시지 도착 확인

---

## 훅 파일 구조

```
.claude/
├── settings.json              ← 훅 설정 등록 (git 커밋)
├── settings.local.json        ← 권한 설정 (git 제외)
├── .env.local                 ← 환경변수 저장 (git 제외) ⭐ 신규
└── hooks/
    ├── load-env.sh            ← SessionStart: .env.local 읽기 → 환경변수 주입
    ├── slack-permission.sh    ← Notification: 권한 요청 알림
    └── slack-stop.sh          ← Stop: 작업 완료 알림
```

### 환경변수 관리 방식

1. **`.env.local` 파일**: 환경변수 정의 (git 제외)
   ```bash
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
   ```

2. **`load-env.sh` 스크립트**: SessionStart 이벤트에서 `.env.local` 읽기
   - 파일의 모든 환경변수를 `CLAUDE_ENV_FILE`에 주입
   - 주석(`#`)과 빈 줄은 무시

3. **훅 스크립트들**: 주입된 환경변수 사용
   - `slack-permission.sh`: `$SLACK_WEBHOOK_URL` 사용
   - `slack-stop.sh`: `$SLACK_WEBHOOK_URL` 사용

---

## 훅 이벤트 상세

### SessionStart (load-env.sh)
- **트리거**: Claude Code 세션 시작 시
- **역할**: `settings.local.json`의 `SLACK_WEBHOOK_URL`을 환경변수로 주입
- **타임아웃**: 10초

### Notification - permission_prompt (slack-permission.sh)
- **트리거**: Claude가 권한을 요청할 때 (파일 편집, Bash 실행 등)
- **메시지 형식**:
  ```
  ⚠️ Claude 권한 요청
  요청 내용: [권한 요청 메시지]
  프로젝트: [프로젝트명]
  ```
- **타임아웃**: 15초

### Stop (slack-stop.sh)
- **트리거**: Claude Code 작업 완료 시
- **메시지 형식**:
  ```
  ✅ Claude 작업 완료
  프로젝트: [프로젝트명]
  완료 시각: [YYYY-MM-DD HH:MM:SS]
  Session: [세션ID]
  ```
- **타임아웃**: 15초

---

## 트러블슈팅

### Slack 알림이 안 옵니다

1. **Webhook URL 확인**:
   ```bash
   echo $SLACK_WEBHOOK_URL
   ```

2. **Webhook 유효성 테스트**:
   ```bash
   MSYS_NO_PATHCONV=1 curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"text":"테스트"}' \
     "$SLACK_WEBHOOK_URL"
   ```

3. **Claude Code 로그 확인**:
   - `/hooks` 명령어로 등록 상태 확인
   - 훅 스크립트 권한 확인: `ls -la .claude/hooks/`

### Python3 오류

Windows에서 `python3` 명령이 없으면:
```bash
# Python 경로 직접 지정 또는 python으로 변경
# hooks/*.sh 파일에서 python3 → python 변경
```

### 권한 오류

```bash
chmod +x .claude/hooks/*.sh
```

---

## 보안 참고사항

- ✅ `settings.local.json`은 git에 **자동으로** 제외됩니다
- ✅ Webhook URL은 프로젝트 로컬에만 저장됩니다
- ⚠️ Webhook URL을 공유하지 마세요 (권한 있는 사람이라면 메시지 전송 가능)
- ⚠️ 파일을 삭제해야 할 경우 `.gitignore` 확인 후 안전하게 제거합니다

---

## 환경변수 추가/수정

`.claude/.env.local` 파일에 새로운 환경변수를 추가할 수 있습니다:

```bash
# Claude Code Hooks 환경변수
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
MY_CUSTOM_VAR=value
ANOTHER_VAR=another_value
```

각 훅 스크립트에서 `$SLACK_WEBHOOK_URL`, `$MY_CUSTOM_VAR` 등으로 접근 가능합니다.

---

## 훅 비활성화

훅을 일시적으로 비활성화하려면:

### 옵션 1: Webhook URL 제거
`.claude/.env.local`에서 `SLACK_WEBHOOK_URL` 값을 비워둡니다.

### 옵션 2: settings.json 수정
`.claude/settings.json`의 해당 훅 섹션을 주석 처리하거나 삭제합니다.

---

## 참고 자료

- [Slack Incoming Webhooks 공식 문서](https://api.slack.com/messaging/webhooks)
- [Claude Code 공식 문서](https://claude.com/claude-code)
