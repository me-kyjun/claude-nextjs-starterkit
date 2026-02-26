#!/usr/bin/env bash
# Stop 이벤트 → Slack 작업 완료 알림

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
from datetime import datetime

raw = sys.stdin.read()
try:
    d = json.loads(raw)
except:
    sys.exit(0)

# 무한루프 방지
if d.get('stop_hook_active'):
    sys.exit(0)

session_id = d.get('session_id', 'unknown')
transcript_path = d.get('transcript_path', '')
if transcript_path:
    # 부모 디렉토리명 추출 (인코딩된 경로에서 실제 프로젝트명 복원)
    parent = os.path.basename(os.path.dirname(transcript_path))
    # D--workspace-claude-nextjs-starterkit → claude-nextjs-starterkit
    project = parent.split('--')[-1] if '--' in parent else parent
else:
    project = 'unknown'
completed_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
webhook_url = os.environ.get('SLACK_WEBHOOK_URL', '')

if not webhook_url:
    sys.exit(0)

payload = {
    'text': 'Claude 작업이 완료되었습니다',
    'blocks': [
        {
            'type': 'header',
            'text': {'type': 'plain_text', 'text': '✅ Claude 작업 완료', 'emoji': True}
        },
        {
            'type': 'section',
            'text': {'type': 'mrkdwn', 'text': '*프로젝트*\n\`' + project + '\`'}
        },
        {
            'type': 'section',
            'text': {'type': 'mrkdwn', 'text': '*시간*\n' + completed_at}
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
