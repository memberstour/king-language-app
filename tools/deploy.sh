#!/usr/bin/env bash
# 킹링고를 GitHub Pages에 배포합니다. (2026-11-23 실제 배포 방식)
#   main 브랜치에 소스를 올리고, 같은 내용을 gh-pages 브랜치에도 올립니다.
#   Pages는 gh-pages 브랜치 루트에서 자동 배포됩니다
#   (Pickle의 GitHub 앱 토큰에는 Pages 설정 권한이 없어서 API로는 켤 수 없었고,
#    gh-pages 브랜치를 push하자 Pages가 자동으로 켜졌습니다).
# 사용: ./tools/deploy.sh [owner/repo]
set -euo pipefail

REPO_SLUG="${1:-memberstour/king-language-app}"
cd "$(dirname "$0")/.."

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "https://github.com/${REPO_SLUG}.git"
fi

git branch -M main
git push -u origin main

# Pages가 바라보는 gh-pages 브랜치를 main과 같은 내용으로 맞춥니다.
git branch -f gh-pages main
git push -f origin gh-pages

echo "사이트: https://${REPO_SLUG%/*}.github.io/${REPO_SLUG#*/}/"
echo "확인: curl -s -o /dev/null -w '%{http_code}\\n' https://${REPO_SLUG%/*}.github.io/${REPO_SLUG#*/}/"
