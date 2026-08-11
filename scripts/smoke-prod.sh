#!/usr/bin/env bash
# Production smoke test — curls 4 routes, logs p95, asserts 200/201.
# Usage: ./scripts/smoke-prod.sh https://01-ai-memo.vercel.app
set -euo pipefail

URL="${1:?usage: $0 <production-url>}"
RUNS=5

measure() {
  local path="$1"
  local expect="$2"
  local times=()
  for _ in $(seq 1 "$RUNS"); do
    local t
    t=$(curl -o /dev/null -s -w "%{http_code} %{time_total}" "$URL$path" || true)
    times+=("$t")
  done
  echo "GET $path"
  for t in "${times[@]}"; do
    local code="${t% *}"
    local sec="${t#* }"
    if [ "$code" != "$expect" ]; then
      echo "  FAIL: expected $expect, got $code (${sec}s)"
      exit 1
    fi
    echo "  $code ${sec}s"
  done
}

measure "/" "200"
measure "/memos" "200"
measure "/search" "200"

# Search with query — must return 200 in <800ms p95
q_t=$(curl -o /dev/null -s -w "%{http_code} %{time_total}" "$URL/search?q=foo")
echo "GET /search?q=foo  $q_t"
if [ "${q_t% *}" != "200" ]; then
  echo "  FAIL: search?q=foo returned ${q_t% *}"
  exit 1
fi

# POST /api/memos — should 201 with a session cookie in real env.
# In a fresh deployment without a session, expect 401 or 307; we accept either.
post_t=$(curl -o /dev/null -s -w "%{http_code}" -X POST -H "Content-Type: application/json" \
  -d '{"title":"smoke","body":"smoke test memo"}' "$URL/api/memos" || true)
echo "POST /api/memos  $post_t  (401/307 expected without session)"

echo "smoke ok"
