#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "[security-review] scanning tracked files for obvious secret leaks and risky patterns"

tracked_files="$(git ls-files)"
if [[ -z "$tracked_files" ]]; then
  echo "No tracked files found."
  exit 0
fi

patterns=(
  'AKIA[0-9A-Z]{16}'
  'AIza[0-9A-Za-z\-_]{35}'
  'ghp_[0-9A-Za-z]{36,}'
  'github_pat_[0-9A-Za-z_]{20,}'
  'xox[baprs]-[0-9A-Za-z-]{10,}'
  '-----BEGIN (RSA|DSA|EC|OPENSSH|PGP) PRIVATE KEY-----'
  'sk_live_[0-9A-Za-z]+'
  'SECRET_KEY\s*[:=]'
  'API_KEY\s*[:=]'
  'TOKEN\s*[:=]'
  'PASSWORD\s*[:=]'
)

ignore_globs=(
  ':!**/*.svg'
  ':!**/*.png'
  ':!**/*.jpg'
  ':!**/*.jpeg'
  ':!**/*.gif'
  ':!**/*.webp'
  ':!**/package-lock.json'
)

status=0
for pattern in "${patterns[@]}"; do
  if git grep -nEI "$pattern" -- $tracked_files "${ignore_globs[@]}"; then
    echo
    echo "[security-review] blocked by pattern: $pattern"
    status=1
  fi
done

if git ls-files | grep -Eq '(^|/)(\.env(\.|$)|id_rsa|id_ed25519|.*\.pem|.*\.p12|.*\.mobileprovision)$'; then
  echo "[security-review] blocked: tracked file list contains likely secret material"
  git ls-files | grep -E '(^|/)(\.env(\.|$)|id_rsa|id_ed25519|.*\.pem|.*\.p12|.*\.mobileprovision)$' || true
  status=1
fi

if git grep -nE '0\.0\.0\.0|--hostname 0\.0\.0\.0' -- web-estimate-app/package.json; then
  echo
  echo "[security-review] note: network-bind dev/start scripts exist. review exposure before use."
fi

if [[ $status -ne 0 ]]; then
  echo "[security-review] FAILED"
  exit $status
fi

echo "[security-review] passed"
