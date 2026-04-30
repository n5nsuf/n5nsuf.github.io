# hanbe.click

AI 자동화·자동매매 시스템 개발자 한채범(HCB)의 개인 사이트.
GitHub Pages로 호스팅되는 정적 사이트 (`https://hanbe.click`).

## ⚠️ 작업 전 필독

이 사이트는 **Google AdSense (`pub-2692332478379651`) 등록 사이트**이다.
정책 위반 시 광고 게재 차단 / 계정 정지 위험이 있다.

> **모든 파일 변경(HTML 추가·수정, sitemap, robots, ads.txt, 광고 슬롯) 전에 [`ADSENSE_POLICY.md`](./ADSENSE_POLICY.md) 무조건 먼저 읽을 것.**

자세한 작업 규칙: [`CLAUDE-sub.md`](./CLAUDE-sub.md)

## 콘텐츠 정책 핵심

- ✅ 자체 작성 long-form 기술 가이드 (Agentic AI, MCP, LightHarness 등)
- ✅ 자체 프로젝트 소개 페이지
- ❌ **LLM/봇 자동 생성 콘텐츠 공개 호스팅 금지** (스케일된 콘텐츠 남용 — 2026-04-30 위반 이력 있음)
- ❌ 출처 미표기 외부 콘텐츠 재가공 금지

## 구조

```
hanbe.click/
├── index.html              # 홈 (포트폴리오 카드)
├── articles.html           # 아티클 허브
├── profile.html            # 프로필
├── *.html                  # 기술 가이드 (long-form 자체작성)
├── projects/*.html         # 프로젝트 소개
├── ads.txt                 # AdSense 검증
├── robots.txt              # 크롤러 허용
└── sitemap.xml             # 색인용 (실제 존재 페이지만 등재)
```

## 배포

`main` 브랜치 push → GitHub Pages 자동 배포 (1~2분).
