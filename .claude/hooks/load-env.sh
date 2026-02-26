#!/usr/bin/env bash
# SessionStart 훅: SLACK_WEBHOOK_URL을 세션 환경변수로 주입

if [ -n "$CLAUDE_ENV_FILE" ] && [ -n "$SLACK_WEBHOOK_URL" ]; then
  echo "export SLACK_WEBHOOK_URL=\"$SLACK_WEBHOOK_URL\"" >> "$CLAUDE_ENV_FILE"
fi

exit 0
