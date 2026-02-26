#!/usr/bin/env bash
# Notification 이벤트 (permission_prompt) → Slack 권한 요청 알림

if [ -z "$SLACK_WEBHOOK_URL" ]; then
  exit 0
fi

INPUT=$(cat)

# Python으로 JSON 파싱
NOTIFICATION_TYPE=$(echo "$INPUT" | python3 -c "
import sys, json
try:
  d = json.load(sys.stdin)
  print(d.get('notification_type', 'unknown'))
except:
  print('unknown')
" 2>/dev/null)

[ "$NOTIFICATION_TYPE" != "permission_prompt" ] && exit 0

MESSAGE=$(echo "$INPUT" | python3 -c "
import sys, json
try:
  d = json.load(sys.stdin)
  print(d.get('message', '내용 없음'))
except:
  print('내용 없음')
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

# 환경변수로 Python에 값 전달
export MSG_MESSAGE="$MESSAGE"
export MSG_PROJECT="$PROJECT_NAME"

SLACK_PAYLOAD=$(python3 -c "
import json, os
payload = {
    'text': '⚠️ Claude가 권한을 요청합니다',
    'blocks': [
        {
            'type': 'header',
            'text': {'type': 'plain_text', 'text': '⚠️ Claude 권한 요청', 'emoji': True}
        },
        {
            'type': 'section',
            'fields': [
                {'type': 'mrkdwn', 'text': f'*요청 내용:*\n{os.environ.get(\"MSG_MESSAGE\", \"내용 없음\")}'},
                {'type': 'mrkdwn', 'text': f'*프로젝트:*\n\`{os.environ.get(\"MSG_PROJECT\", \"unknown\")}\`'}
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
