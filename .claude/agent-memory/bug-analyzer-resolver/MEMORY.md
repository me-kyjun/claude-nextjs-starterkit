# Bug Analyzer Resolver - 에이전트 메모리

## 자주 발생하는 버그 패턴

### Bash IFS 파싱 버그 (높음)
- **패턴**: `while IFS='=' read -r key value` 방식은 값(value)에 `=`가 포함되면 첫 번째 `=` 이후만 잘린 값을 읽음
- **발생 파일**: `.claude/hooks/*.sh` (환경변수 파일 파싱 로직)
- **수정 방법**: `read -r key rest`로 변경 후 `rest`를 value로 사용
  ```bash
  while IFS='=' read -r key rest; do
    value=$(echo "$rest" | tr -d '\r')
  ```
- **영향**: Base64 URL, JWT 토큰 등 `=` 포함 값을 환경변수로 사용할 때 잘림

### Bash export 보안 이슈 (보안)
- **패턴**: `export "$key=$value"` 방식은 key에 특수문자 삽입 시 인젝션 가능
- **수정 방법**: `export "${key}=${value}"` 방식 사용 (중괄호 명시)

### Python 삼항 연산자 우선순위 버그 (중간)
- **패턴**: `'prefix' + var[:12] + '...' if len(var) > 12 else 'alt'`
  - Python 파싱: `('prefix' + var[:12] + '...') if cond else 'alt'` (접두사가 조건 안에 포함)
  - 의도: 조건에 따라 값만 달라지고 접두사는 항상 출력
- **수정 방법**: 조건 표현식을 괄호로 묶어 값 부분만 분리
  ```python
  '*접두사*\n`' + (var[:12] + '...' if len(var) > 12 else var) + '`'
  ```

## 핵심 파일 위치 (Hooks)
- `.claude/hooks/slack-subagent-stop.sh` - SubagentStop 이벤트 알림
- `.claude/hooks/slack-stop.sh` - Stop 이벤트 알림
- `.claude/hooks/slack-permission.sh` - 권한 요청 알림
- `.claude/.env.local` - Slack Webhook URL 저장 (git 제외)

## 효과적인 수정 패턴
1. 파일 Read -> 버그 분석 -> 수정 계획 설명 -> Edit -> 수정 후 Read 검증 순서 준수
2. 3개 파일 공통 버그는 한 파일씩 순서대로 수정 (동시 수정 지양)
3. 수정 후 반드시 Read로 변경사항 검증

## 주의사항
- `.claude/hooks/` 파일들은 Claude Code Hooks로 실행되므로 bash 문법 정확성 중요
- Python 인라인 코드(`python -c "..."`)는 따옴표 이스케이프에 주의
- `stop_hook_active` 체크: SubagentStop에서는 해당 필드가 전달되지 않으나 방어적으로 유지
