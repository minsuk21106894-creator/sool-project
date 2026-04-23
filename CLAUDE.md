# CLAUDE.md — Sool Project (술이술술 / Jumak)

## 프로젝트 개요

**Jumak(주막)** — 외국인을 위한 한국 전통주 가이드 웹앱.
술이술술 프로젝트의 프론트엔드로, 전통주 탐색·추천·장소 찾기 기능을 제공한다.

- **라이브 URL**: https://sool-project.vercel.app
- **GitHub**: https://github.com/minsuk21106894-creator/sool-project
- **Vercel 프로젝트**: `sool-project` (팀: `minsuk21106894-8560s-projects`)

## 기술 스택

- **순수 HTML/CSS/JS** — 프레임워크 없음, 빌드 단계 없음
- **배포**: Vercel (GitHub 연동, push 시 자동 배포)
- **애널리틱스**: Amplitude Browser SDK 2.0 (`autocapture: true`)

## 파일 구조

```
sool-project/
├── index.html          # 메인 홈 (Jumak 랜딩)
├── sool-guide.html     # 전통주 목록·상세 (탭: Sool, Places, Tips)
├── sool-finder.html    # 전통주 추천 Finder (취향 기반 퀴즈)
├── place-finder.html   # 바/포차 장소 추천
├── korean-tips.html    # 한국어 표현 & 음주 에티켓
└── shared.css          # 공통 디자인 시스템 (CSS 변수, 컴포넌트)
```

## 디자인 시스템 (`shared.css`)

CSS 변수로 컬러·타이포그래피 관리:
- `--dancheong`: 단청 레드 (포인트 컬러)
- `--celadon`: 청자 그린
- `--buncheong`: 분청 그레이
- `--charcoal-900`: 다크 배경
- `--cream-*`: 크림 계열 배경
- 폰트: `Playfair Display` (제목), 시스템 sans-serif (본문)

## 애널리틱스

Amplitude가 모든 HTML 파일 `<head>`에 삽입되어 있다:

```html
<script src="https://cdn.amplitude.com/libs/analytics-browser-2.11.1-min.js.gz"></script>
<script>
  window.amplitude.init("5c9108f6f1aeab52f56dad94c7fa81e8", { autocapture: true });
</script>
```

- API Key: `5c9108f6f1aeab52f56dad94c7fa81e8` (Legacy key)
- autocapture로 페이지뷰·클릭·세션 자동 수집

## 데이터 소스

마스터 데이터는 로컬 Excel 파일로 관리:
- **`C:/Users/tim12/OneDrive/바탕 화면/sools-master-v2-final.xlsx`**
- 시트: `Sool List` (57개 전통주, 37컬럼), `Today's Picks`, `Finder Categories`, `Finder Questions`, `Finder Scoring Sim`, `Places` 등
- HTML에 데이터가 하드코딩되어 있음 (별도 API 없음)

## 배포 방법

```bash
# 로컬 파일 수정 후
cd C:/Users/tim12/sool-project
git add .
git commit -m "변경 내용"
git push  # → Vercel 자동 배포
```

GitHub 미연결 상황에서 수동 배포:
```bash
vercel --token [VERCEL_TOKEN] --prod --yes --scope minsuk21106894-8560s-projects
```

## 작업 히스토리 요약

- 순수 HTML/CSS/JS로 모바일 퍼스트 UI 구현
- `sools-master-v2-final.xlsx` 데이터 기반으로 콘텐츠 구성
- Amplitude Analytics 연결 (2026-04-23)
- GitHub(`minsuk21106894-creator`) 및 Vercel 연동 완료
