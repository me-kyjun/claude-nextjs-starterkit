#!/usr/bin/env bash
# Stop 이벤트 → Slack 작업 완료 알림

if [ -z "$SLACK_WEBHOOK_URL" ]; then
  exit 0
fi

INPUT=$(cat)

STOP_HOOK_ACTIVE=$(echo "$INPUT" | python3 -c "
import sys, json
try:
  d = json.load(sys.stdin)
  print(str(d.get('stop_hook_active', False)).lower())
except:
  print('false')
" 2>/dev/null)

# 무한루프 방지
[ "$STOP_HOOK_ACTIVE" = "true" ] && exit 0

SESSION_ID=$(echo "$INPUT" | python3 -c "
import sys, json
try:
  d = json.load(sys.stdin)
  print(d.get('session_id', 'unknown'))
except:
  print('unknown')
" 2>/dev/null)

CWD=$(echo "$INPUT" | python3 -c "
import sys, json
try:
  d = json.load(sys.stdin)
  print(d.get('cwd', 'unknown'))
except:
  print('unknown')
" 2>/dev/null)

PROJECT_NAME=$(basename "$CWD")
COMPLETED_AT=$(date "+%Y-%m-%d %H:%M:%S")

# 환경변수로 Python에 값 전달 (안전한 방식)
export MSG_PROJECT="$PROJECT_NAME"
export MSG_TIME="$COMPLETED_AT"
export MSG_SESSION="$SESSION_ID"

SLACK_PAYLOAD=$(python3 -c "
import json, os
payload = {
    'text': '✅ Claude 작업이 완료되었습니다',
    'blocks': [
        {
            'type': 'header',
            'text': {'type': 'plain_text', 'text': '✅ Claude 작업 완료', 'emoji': True}
        },
        {
            'type': 'section',
            'fields': [
                {'type': 'mrkdwn', 'text': f'*프로젝트:*\n\`{os.environ.get(\"MSG_PROJECT\", \"unknown\")}\`'},
                {'type': 'mrkdwn', 'text': f'*완료 시각:*\n{os.environ.get(\"MSG_TIME\", \"unknown\")}'}
            ]
        },
        {
            'type': 'context',
            'elements': [
                {'type': 'mrkdwn', 'text': f'Session: \`{os.environ.get(\"MSG_SESSION\", \"unknown\")}\`'}
            ]
        }
    ]
}
print(json.dumps(payload, ensure_ascii=False))
" 2>/dev/null)

[ -z "$SLACK_PAYLOAD" ] && exit 0

MSYS_NO_PATHCONV=1 curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "$SLACK_PAYLOAD" \
  "$SLACK_WEBHOOK_URL" \
  --max-time 10 \
  -o /dev/null 2>/dev/null

exit 0
