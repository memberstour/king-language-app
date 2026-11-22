#!/usr/bin/env bash
# 저장소가 준비된 뒤 한 번에 배포합니다.
#   1) main 브랜치 푸시  2) GitHub Pages 활성화(main 브랜치 루트)  3) 상태 확인
# 사용: ./tools/deploy.sh [owner/repo]
set -euo pipefail

REPO_SLUG="${1:-memberstour/king-language-app}"
cd "$(dirname "$0")/.."

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "https://github.com/${REPO_SLUG}.git"
fi

git branch -M main
git push -u origin main

if gh api "repos/${REPO_SLUG}/pages" >/dev/null 2>&1; then
  gh api -X PUT "repos/${REPO_SLUG}/pages" \
    -f 'source[branch]=main' -f 'source[path]=/' >/dev/null
else
  gh api -X POST "repos/${REPO_SLUG}/pages" \
    -f 'source[branch]=main' -f 'source[path]=/' >/dev/null
fi

echo "Pages URL: $(gh api "repos/${REPO_SLUG}/pages" --jq .html_url)"
echo "확인: https://${REPO_SLUG%/*}.github.io/${REPO_SLUG#*/}/"
