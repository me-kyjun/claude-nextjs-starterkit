#!/usr/bin/env bash
# SubagentStop 이벤트 → Slack 서브에이전트 완료 알림

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

# SubagentStop에서는 stop_hook_active가 전달되지 않지만 방어적으로 유지
if d.get('stop_hook_active'):
    sys.exit(0)

session_id = d.get('session_id', 'unknown')
agent_id = d.get('agent_id', 'unknown')
agent_type = d.get('agent_type', 'unknown')
last_message = d.get('last_assistant_message', '')
transcript_path = d.get('transcript_path', '')

# 프로젝트명 추출
if transcript_path:
    parent = os.path.basename(os.path.dirname(transcript_path))
    project = parent.split('--')[-1] if '--' in parent else parent
else:
    project = 'unknown'

completed_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
webhook_url = os.environ.get('SLACK_WEBHOOK_URL', '')

if not webhook_url:
    sys.exit(0)

# 마지막 메시지 요약 (너무 길면 자르기)
MAX_LEN = 200
if last_message and len(last_message) > MAX_LEN:
    last_message = last_message[:MAX_LEN] + '...'

# 에이전트 타입별 이모지 매핑
type_emoji = {
    'Explore': ':mag:',
    'Plan': ':memo:',
    'Bash': ':terminal:',
    'code-reviewer': ':white_check_mark:',
    'bug-analyzer-resolver': ':bug:',
    'general-purpose': ':robot_face:',
}
emoji = type_emoji.get(agent_type, ':gear:')

blocks = [
    {
        'type': 'header',
        'text': {'type': 'plain_text', 'text': emoji + ' 서브에이전트 작업 완료', 'emoji': True}
    },
    {
        'type': 'section',
        'fields': [
            {'type': 'mrkdwn', 'text': '*프로젝트*\n\`' + project + '\`'},
            {'type': 'mrkdwn', 'text': '*에이전트 타입*\n\`' + agent_type + '\`'}
        ]
    },
    {
        'type': 'section',
        'fields': [
            {'type': 'mrkdwn', 'text': '*에이전트 ID*\n\`' + (agent_id[:12] + '...' if len(agent_id) > 12 else agent_id) + '\`'},
            {'type': 'mrkdwn', 'text': '*완료 시간*\n' + completed_at}
        ]
    }
]

if last_message:
    blocks.append({
        'type': 'section',
        'text': {'type': 'mrkdwn', 'text': '*마지막 응답*\n>' + last_message.replace('\n', '\n>')}
    })

blocks.append({'type': 'divider'})

payload = {
    'text': '[' + project + '] 서브에이전트(' + agent_type + ') 작업이 완료되었습니다',
    'blocks': blocks
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
