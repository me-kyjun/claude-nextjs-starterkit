#!/usr/bin/env bash
# SessionStart 훅: .claude/.env.local 파일에서 환경변수를 읽어 세션에 주입

ENV_FILE="$CLAUDE_PROJECT_DIR/.claude/.env.local"

if [ ! -f "$ENV_FILE" ]; then
  exit 0
fi

if [ -z "$CLAUDE_ENV_FILE" ]; then
  exit 0
fi

# .env.local에서 환경변수 읽고 CLAUDE_ENV_FILE에 주입
while IFS='=' read -r key value; do
  # 주석 및 빈 줄 무시
  [[ "$key" =~ ^[[:space:]]*# ]] && continue
  [[ -z "$key" ]] && continue

  # 값에서 줄 바꿈 제거
  value=$(echo "$value" | tr -d '\r')

  echo "export $key=\"$value\"" >> "$CLAUDE_ENV_FILE"
done < "$ENV_FILE"

exit 0
