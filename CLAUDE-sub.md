# hanbe.click — Project Quick Reference

## 🚨 작업 시작 전 필수 (예외 없음)

**이 repo의 어떤 파일이든 변경 전 [`ADSENSE_POLICY.md`](./ADSENSE_POLICY.md)를 먼저 읽을 것.**

이 사이트는 Google AdSense 등록 사이트(`pub-2692332478379651`)이며, 정책 위반 시 광고 게재 차단·계정 정지 위험이 있다. 과거 LLM 자동 생성 브리핑(`/briefs/`) 공개 호스팅으로 정책 위반 통보를 받은 이력이 있다 — 동일 패턴 재발 절대 금지.

### 다음 작업이면 ADSENSE_POLICY.md 무조건 참조

| 작업 | 추가 점검 |
|---|---|
| 새 HTML 페이지 추가 | thin content / 출처 / 광고 슬롯 수 / sitemap 등재 |
| 기존 페이지 콘텐츠 수정 | LLM 보조 비율 / 사실 검증 / 출처 |
| sitemap.xml 수정 | 등재 URL 실제 200 응답 검증 (404 0개) |
| robots.txt 수정 | Mediapartners-Google 차단 X |
| ads.txt 수정 | Publisher ID 매칭 |
| 광고 슬롯 추가/이동 | 본문 비율 / thin 페이지 다중 슬롯 금지 |
| GemsWriter / 자동 생성 도구 출력 게시 | **공개 게시 금지 — Notion/Slack/Telegram private만** |

### 자동 생성 콘텐츠 게시 정책

LLM/봇이 만든 글은 **공개 sitemap에 등재되는 페이지에 그대로 올리지 말 것.** 반드시 다음 중 하나:
1. **사람 편집·검증·출처 인용** 후 게시 (그래도 "AI 보조 작성" 표기 권장)
2. 비공개 채널 (Notion private workspace, Slack DM, Telegram bot) 로만 출력
3. 사이트에 호스팅하더라도 **인증 게이트** 뒤에 배치 (Cloudflare Access 등)

---

## Site Structure

| 영역 | 파일 |
|---|---|
| 홈 | `index.html` |
| 아티클 허브 | `articles.html` |
| 기술 가이드 (long-form 자체 작성) | `agentic_ai_intro.html`, `light_harness_guide.html`, `mcp_ecosystem.html`, `claude_web_memory.html`, `structured_programming.html` |
| 프로필 | `profile.html` |
| 프로젝트 소개 | `projects/*.html` |
| AdSense | `ads.txt` |
| 크롤러 | `robots.txt`, `sitemap.xml` |

---

## Deployment

GitHub Pages auto-deploy on push to `main`. URL: https://hanbe.click

빌드/배포 파이프라인 추가 도구 없음 (정적 호스팅).

---

## Commit Convention

CLAUDE.md(글로벌) 규칙 따름. 추가:
- AdSense 정책 영향 변경 시 commit 본문에 정책 항목 명시 (예: "스케일된 콘텐츠 남용 회피 — /briefs/ 제거")
