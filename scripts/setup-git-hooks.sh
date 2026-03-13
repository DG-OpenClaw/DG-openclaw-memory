#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"

chmod +x scripts/security-review.sh scripts/setup-git-hooks.sh .githooks/pre-commit .githooks/pre-push
git config core.hooksPath .githooks

echo "Git hooks enabled via .githooks"
