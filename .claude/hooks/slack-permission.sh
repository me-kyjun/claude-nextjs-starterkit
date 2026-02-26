#!/usr/bin/env bash
# Notification 이벤트 (permission_prompt) → Slack 권한 요청 알림

# .env.local에서 직접 환경변수 읽기
ENV_FILE="$(dirname "$0")/../.env.local"
if [ -f "$ENV_FILE" ]; then
  while IFS='=' read -r key rest; do
    [[ "$key" =~ ^[[:space:]]*# ]] && continue
    [[ -z "$key" ]] && continue
    value=$(echo "$rest" | tr -d '\r')
    export "${key}=${value}"
  done < "$ENV_FILE"
fi

if [ -z "$SLACK_WEBHOOK_URL" ]; then
  exit 0
fi

INPUT=$(cat)

# Python으로 파싱 및 Slack 전송을 한 번에 처리
RESULT=$(echo "$INPUT" | python -c "
import sys, json, urllib.request, urllib.error, os

raw = sys.stdin.read()
try:
    d = json.loads(raw)
except:
    sys.exit(0)

if d.get('notification_type') != 'permission_prompt':
    sys.exit(0)

message = d.get('message', '내용 없음')
cwd = d.get('cwd', 'unknown')
project = os.path.basename(cwd)
webhook_url = os.environ.get('SLACK_WEBHOOK_URL', '')

if not webhook_url:
    sys.exit(0)

payload = {
    'text': 'Claude가 권한을 요청합니다',
    'blocks': [
        {
            'type': 'header',
            'text': {'type': 'plain_text', 'text': '🔐 Claude 권한 요청', 'emoji': True}
        },
        {
            'type': 'section',
            'text': {'type': 'mrkdwn', 'text': '*프로젝트*\n\`' + project + '\`'}
        },
        {
            'type': 'section',
            'text': {'type': 'mrkdwn', 'text': '*요청 내용*\n' + message}
        },
        {
            'type': 'section',
            'text': {'type': 'mrkdwn', 'text': '*시간*\n' + __import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        }
    ]
}

data = json.dumps(payload, ensure_ascii=False).encode('utf-8')
req = urllib.request.Request(webhook_url, data=data, headers={'Content-Type': 'application/json; charset=utf-8'})
try:
    urllib.request.urlopen(req, timeout=10)
    print('ok')
except Exception as e:
    print('error:', e)
" 2>&1)

echo "$RESULT" > /dev/null
exit 0
