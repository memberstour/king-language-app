# 킹링고 (KingLingo)

매일 5분, 초등 수준 문장을 듣고 따라 말하며 익히는 **모바일 우선 학습 PWA**입니다.
한 저장소에서 **세 개의 앱**을 함께 배포합니다.

| 앱 | 주소 | 내용 |
| --- | --- | --- |
| **킹링고** | <https://memberstour.github.io/king-language-app/> | 영어 · 중국어 · 일본어 14일 코스 (문장 익히기 · 만들기 · 듣기 퀴즈 · 말하기) |
| **킹링고 입문** | <https://memberstour.github.io/king-language-app/beginner/> | 러시아어 · 스페인어 · 베트남어 **완전 처음** 과정 · 읽기·쓰기(문자/성조) + 손글씨 연습장 |
| **킹한자** | <https://memberstour.github.io/king-language-app/hanja/> | 기초 한자 70자 · 훈과 음 · 획수/부수 · 격자 연습장에 따라 쓰기 |

세 앱은 각각 독립된 PWA입니다. `manifest.json`, `sw.js`, 아이콘, `localStorage` 키가
서로 다르므로 한 홈 화면에 나란히 설치해도 기록이 섞이지 않습니다.

## 구성

```
index.html  manifest.json  sw.js            ← 앱 1 (영어·중국어·일본어)
css/styles.css  js/data.js  js/core.js  js/store.js  js/app.js
beginner/                                   ← 앱 2 (러시아어·스페인어·베트남어 입문)
  index.html  manifest.json  sw.js  css/  js/  icon-*.png
hanja/                                      ← 앱 3 (한자)
  index.html  manifest.json  sw.js  css/  js/  icon-*.png
tools/                                      ← 아이콘 생성, 헤드리스 점검, 배포
dist/kinglingo-standalone.html              ← 앱 1 단일 파일 빌드
```

프레임워크·CDN 없이 정적 파일만으로 동작하고, 모든 경로가 `./` 상대 경로라
GitHub Pages의 `/<저장소>/` 하위 경로에서도 그대로 실행됩니다.

## 앱 1 — 영어 · 중국어 · 일본어

| 탭 | 내용 |
| --- | --- |
| 오늘 | 오늘의 목표(30 XP) 링, 스트릭, 14일 코스, 하루 4개 수업, 오늘의 한 문장 |
| 문장 암기 | 탭해서 뒤집는 플래시카드(한국어 ↔ 영어/중국어+병음/일본어+히라가나) |
| 말하기 | 듣기(보통/천천히), 마이크 따라 말하기, 유사도 피드백, '직접 말해봤어요' 대체 버튼 |
| 진도 | 스트릭·XP·외운 문장·완료한 날, 14일 코스, 언어별 요약, 함께 쓰는 앱 링크, 설정 |

- 영어·중국어·일본어 각 14단원 × 5문장 = 210문장
- 중국어는 간체자 · 병음 · 뜻 · 발음 팁 · 단어 블록, 일본어는 가나 읽기 · 뜻 · 팁 · 단어 블록 제공
- 단어 블록은 언어별 띄어쓰기 규칙(중국어·일본어는 붙여 쓰기)에 맞춰 조립됩니다

## 앱 2 — 킹링고 입문 (러시아어 · 스페인어 · 베트남어)

| 탭 | 내용 |
| --- | --- |
| 오늘 | 14단원 × 5문장, 원어 발음 듣기(ru-RU / es-ES / vi-VN), 읽기 안내, 뜻, 발음 팁 |
| 읽기·쓰기 | 키릴 문자 33자 · 스페인어 알파벳 27자와 규칙 · 베트남어 29자와 6성조, 그리고 **손글씨 연습장**(캔버스) |
| 카드 | 뜻 → 문장 플래시카드 |
| 퀴즈 | 문장을 듣고 뜻 고르기 4지선다 |

연습장은 글자마다 따로 저장되고, 펜 굵기 3단계 · 펜 색 4가지 · 되돌리기 · 모두 지우기 ·
안내(워터마크·안내선) 보기를 지원합니다. 손가락 입력은 Pointer Event로 처리해
아이폰에서도 스크롤과 충돌하지 않습니다.

## 앱 3 — 킹한자

| 탭 | 내용 |
| --- | --- |
| 오늘 | 14단원 × 5자(70자), 한자 · 훈과 음 · 뜻 · 부수 · 획수 · 예시 낱말 · 읽기(ko-KR) |
| 따라 쓰기 | 田자 격자/米자 격자 위에 한자를 손으로 따라 쓰는 연습장 |
| 카드 | 훈·음 + 예시 낱말 → 한자 |
| 퀴즈 | 한자 → 훈·음 4지선다 |

## 개발

```bash
# 앱 1 자체 점검 (문법 + 콘텐츠 + 화면/수업 흐름)
python3 tools/run_selftest.py

# 앱 2·3 자체 점검 (데이터 무결성 + 화면 흐름 + 연습장/카드/퀴즈)
python3 tools/test_apps.py

# 아이콘 다시 만들기 (Pillow)
python3 tools/make_icons.py      # 앱 1
python3 tools/make_app_icons.py  # 앱 2·3

# 앱 1 단일 파일 + 전체 zip 빌드
python3 tools/build_standalone.py

# 배포 전에 각 sw.js의 CACHE_NAME을 올려 주세요 (예: v3 → v4).
# 올리지 않으면 이미 설치한 홈 화면 앱이 예전 파일을 계속 씁니다.
sw.js, beginner/sw.js, hanja/sw.js

# 배포 (main + gh-pages)
bash tools/deploy.sh
```

## 기록

각 앱은 `localStorage`에 자기 기록을 따로 저장합니다.

- 앱 1: `kinglingo.state.v1`
- 앱 2: `kinglingo.beginner.v1`
- 앱 3: `kinglingo.hanja.v1`

## PWA

- 각 앱이 자체 `manifest.json`(standalone, 테마 색)과 `sw.js`(앱 껍데기 프리캐시)를 가집니다
- 앱 1 서비스 워커는 `/beginner/`, `/hanja/` 요청을 건드리지 않습니다
- 아이폰: Safari → 공유 → **홈 화면에 추가** → 전체 화면 앱처럼 실행
