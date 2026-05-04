# CLAUDE.md — Sool Project (술이술술 / Jumak)

## 프로젝트 개요

**Jumak(주막)** — 외국인을 위한 한국 전통주 가이드 웹앱.
술이술술 프로젝트의 프론트엔드로, 전통주 탐색·추천·장소 찾기·콘텐츠 큐레이션을 제공한다.

- **라이브 URL**: https://sool-project.vercel.app
- **GitHub**: https://github.com/minsuk21106894-creator/sool-project
- **Vercel 프로젝트**: `sool-project` (팀: `minsuk21106894-8560s-projects`)
- **YouTube 채널**: [@soolysoolsool](https://www.youtube.com/@soolysoolsool) — Team Jumak (`UCAcW8lIs0fXtlc0cHH0INIg`)

## 기술 스택

- **순수 HTML/CSS/JS** — 프레임워크 없음, 빌드 단계 없음
- **데이터**: 정적 JSON (`/data/*.json`), 클라이언트에서 `fetch()`로 로드 + 인메모리 캐시
- **배포**: Vercel (push → 자동 배포 권장)
- **애널리틱스**: Amplitude Browser SDK 2.0 (`autocapture: true`)
- **자동화**: GitHub Actions (매주 일요일 YouTube 영상 자동 갱신)

## 파일 구조

```
sool-project/
├── index.html          # Home 탭 (Today's Sool x3, Today's Spots x5, CTA, Explore, Feedback)
├── sool-guide.html     # List 탭 (🍶 Sool / 📍 Places 서브탭)
├── contents.html       # Contents 탭 (YouTube 최신 영상 가로 스크롤 + Sool Stories)
├── korean-tips.html    # Tips 탭 (한국어 표현 & 음주 에티켓)
├── sool-finder.html    # 전통주 추천 퀴즈 (4문항 → 상위 3종)
├── place-finder.html   # 장소 추천 퀴즈 (5문항 → 1곳 + 유사 1곳)
├── sool-detail.html    # 개별 술 상세 (?id=xxx)
├── shared.js           # 공통 유틸 (데이터 로더, 탭바, 헬퍼)
├── shared.css          # 디자인 시스템 (CSS 변수, 컴포넌트)
├── vercel.json         # Vercel 정적 사이트 설정 (캐시 헤더 포함)
├── data/
│   ├── sools.json          # 56종 전통주 (items[])
│   ├── places.json         # 30곳 서울 스팟 (places[])
│   ├── todays-picks.json   # 큐레이션 카드
│   ├── order-phrases.json  # 한국어 회화 (categories[])
│   ├── sool-images.json    # 이미지 URL & 폴백
│   ├── videos.json         # YouTube 영상 메타 (자동 갱신됨)
│   └── stories.json        # 한국 술 역사·스토리 카드
└── .github/
    ├── workflows/
    │   └── update-videos.yml   # 매주 일요일 YouTube 영상 자동 갱신
    └── scripts/
        └── update_videos.py    # YouTube RSS → videos.json 업데이트
```

## 탭 구조

하단 탭 바 (`shared.js` `renderTabBar()`): **Home · List · Contents · Tips** 4개.

## 디자인 시스템 (`shared.css`)

CSS 변수로 컬러·타이포그래피 관리:
- `--dancheong`: 단청 레드 (포인트 컬러) `#C4463A`
- `--celadon`: 청자 그린 `#7BA68C`
- `--onggi`: 옹기 브라운 `#A67C52`
- `--buncheong`: 분청 그레이 `#9B9590`
- `--charcoal-900`: 다크 배경 `#2D2926`
- `--cream-*`: 크림 계열 배경
- 폰트: `Playfair Display` (제목), `Inter` (본문), `Noto Sans KR` (한국어)

## 캐시 정책 (`vercel.json`)

| 자원 | 캐시 정책 | 의도 |
|------|-----------|------|
| `*.html`, `*.js`, `*.css`, `/` | `max-age=0, must-revalidate` | 코드 변경 즉시 반영 |
| `/data/*` | `max-age=600, stale-while-revalidate=86400` | 자동 영상 갱신 후 ~10분 내 노출 |
| 그 외 (이미지 등) | `max-age=300, stale-while-revalidate=86400` | 정적 자원 적당한 캐시 |

## 애널리틱스

Amplitude가 모든 HTML 파일 `<head>`에 삽입돼 있다 (`shared.css` 다음 줄):

```html
<script src="https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz"></script>
<script>
  window.amplitude.init("5c9108f6f1aeab52f56dad94c7fa81e8", { autocapture: true });
</script>
```

- API Key: `5c9108f6f1aeab52f56dad94c7fa81e8` (legacy, 클라이언트 키)
- autocapture로 페이지뷰·클릭·세션 자동 수집

## 데이터 소스

마스터 데이터는 로컬 Excel 파일에서 관리하고 `data/*.json`으로 동기화:
- **`C:/Users/tim12/OneDrive/바탕 화면/sools-master-v2-final.xlsx`**
- 시트: `Sool List`, `Today's Picks`, `Finder Categories`, `Finder Questions`, `Finder Scoring Sim`, `Places`, `Place Finder Logic` 등
- 데이터 추가 시 Excel과 JSON을 함께 갱신

## YouTube 영상 자동 갱신

`.github/workflows/update-videos.yml` — 매주 일요일 09:05 KST (= 00:05 UTC) 실행:
1. 채널 RSS (`https://www.youtube.com/feeds/videos.xml?channel_id=UCAcW8lIs0fXtlc0cHH0INIg`) fetch
2. 최신 6개 영상 파싱 (id, 제목, 게시일) — 트레일링 해시태그는 자동 제거
3. `data/videos.json`과 다를 때만 commit & push
4. push 트리거로 Vercel 자동 배포

수동 실행: GitHub → Actions → "Update YouTube videos" → "Run workflow"

비용: GitHub Actions Public 레포 무제한 무료. 작업당 약 30초 소요.

## 배포 방법

```bash
# 1) git push 방식 (권장 — Vercel git 연동 시 자동 배포)
git add .
git commit -m "변경 내용"
git push

# 2) CLI 직접 배포 (긴급 시)
npx vercel --prod --yes
```

## 작업 히스토리 요약

- 순수 HTML/CSS/JS로 모바일 퍼스트 UI 구현
- `sools-master-v2-final.xlsx` 데이터 기반 콘텐츠 구성
- Amplitude Analytics 연결 (2026-04-23)
- 정적 JSON 데이터 레이어 도입 (sools/places/picks/phrases/images)
- Sool Finder · Place Finder · Sool Detail 페이지 추가
- Contents 탭 추가 — YouTube 영상 + Sool Stories (2026-05-04)
- 캐시 헤더 정비 (HTML/JS는 즉시 갱신, 데이터는 10분 SWR)
- GitHub Actions로 매주 일요일 YouTube 영상 자동 갱신 (2026-05-04)
