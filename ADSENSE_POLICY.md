# AdSense 정책 컴플라이언스 — hanbe.click

> 이 사이트는 Google AdSense (Publisher ID: `pub-2692332478379651`)에 등록되어 있다.
> **모든 콘텐츠/구조 변경은 이 문서 기준을 통과해야 한다.**

원본 정책 허브: https://support.google.com/adsense/answer/10502938

---

## 🔴 절대 금지 (즉시 거부 사유)

| # | 금지 항목 | 구체 패턴 |
|---|---|---|
| 1 | **LLM/AI 자동 생성 콘텐츠 공개 호스팅** | GemsWriter, ChatGPT, Gemini, Claude 등으로 일괄 생성한 글을 사이트에 공개 게시. 사람 편집·검증 없이 그대로 게시 = **스케일된 콘텐츠 남용** |
| 2 | **출처 미표기 뉴스/외부 콘텐츠 재가공** | 타사 기사·블로그를 LLM으로 재서술. 원 출처 링크 없으면 저작권 + 사기 행위 동시 위반 |
| 3 | **사실 검증 부재 금융/건강/정치/선거 콘텐츠** | 특히 한국 선거·종목 추천·의료 정보. AdSense 가장 민감한 카테고리 |
| 4 | **저작권 침해 자료** | 이미지·동영상·텍스트 무단 사용. unsplash/pexels 등 license-free만 사용. 직접 촬영/생성한 자료는 OK |
| 5 | **음란물·도박·폭력·증오** | 아동 보호, 위험 콘텐츠 카테고리 위반 |
| 6 | **사용자 기만/오해 표현** | 가짜 다운로드 버튼, 광고를 콘텐츠처럼 위장, 클릭베이트 헤드라인 |
| 7 | **광고 클릭/노출 조작** | 자기 광고 클릭, "광고를 클릭하세요" 유도, 광고 위에 투명 레이어 |

---

## ✅ 필수 요구

| 항목 | 상태 (2026-04-30 갱신) | 검증 방법 |
|---|---|---|
| Privacy Policy 페이지 + 모든 페이지 footer 링크 | ✅ `/privacy.html` 작성, `assets/site-footer.js`로 모든 페이지 자동 footer | `curl https://hanbe.click/privacy.html` |
| HTTPS | ✅ GitHub Pages 기본 | `curl -sI https://hanbe.click` |
| ads.txt | ✅ 정상 | `cat ads.txt` → `google.com, pub-2692332478379651, DIRECT, f08c47fec0942fa0` |
| Mobile viewport | ✅ 모든 페이지 | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| sitemap.xml — 404 URL 0개 | ✅ 정리됨 (404 6개 제거, 누락 페이지 3개 추가) | `curl -sI <url>` sitemap 전 entry |
| robots.txt — Mediapartners-Google 차단 X | ✅ 정상 | AdSense 크롤러는 광고 적합성 검사 차단 시 게재 거부 |
| 쿠키 동의 배너 (informational) | ✅ `assets/cookie-banner.js` (모든 페이지 inject). EEA 완전 준수는 AdSense Funding Choices 활성화 별도 필요 | localStorage 동의 후 silent |

---

## 🟡 강력 권장

- 자체 작성 long-form 콘텐츠 (각 페이지 ~1000자 이상 본문 텍스트)
- 일관된 헤더/푸터 nav (모든 페이지 동일 패턴)
- 광고 < 본문 비율 (광고 영역 50% 이하)
- thin landing 페이지에 광고 슬롯 다수 배치 금지
- 쿠키 동의 배너 (EEA/UK 사용자 노출 시 GDPR 필수 — Google Funding Choices 권장)
- Schema.org Author/Article 메타데이터 (현재 ✅)
- Contact 페이지 또는 명확한 연락 수단

---

## 📋 작업 시 체크리스트

### 새 HTML 페이지 추가 전
- [ ] 자체 작성인가? LLM 보조면 사실 검증 + 출처 인용 + (선택) "AI 보조 작성" 표기
- [ ] 본문 텍스트 ~1000자 이상인가? thin이면 보강
- [ ] 푸터에 Privacy Policy 링크 포함됐나?
- [ ] sitemap.xml에 추가했나?
- [ ] AdSense 슬롯이 본문 대비 과다하지 않나? (페이지당 2개 이하 권장)

### sitemap.xml 수정 시
- [ ] 등재 URL이 실제 파일로 200 응답하나? (404 0개)
- [ ] 삭제된 페이지의 URL은 sitemap에서도 제거
- [ ] 신규 페이지 등재

### robots.txt 수정 시
- [ ] Mediapartners-Google 차단 안 함
- [ ] 정책 회피 목적 Disallow 금지 (의심 콘텐츠는 차단이 아닌 삭제)

### 광고 슬롯 추가/수정 시
- [ ] 페이지 본문 분량 충분한가?
- [ ] 광고가 콘텐츠처럼 보이는 디자인인가? (위반)
- [ ] 광고끼리 너무 가깝나? (페이지 첫 화면에 광고 3개 이상 비추)

### LLM/자동화 도구 출력을 사이트에 게시할 때
- [ ] 사람이 편집·검증했나?
- [ ] 출처 인용했나?
- [ ] 사실 검증했나?
- [ ] **검증·편집 없이 전량 자동 게시 = 즉시 정책 위반**

---

## 📜 위반 이력 (재발 방지용)

### 2026-04-20 ~ 2026-04-30: GemsWriter 자동 생성 브리핑 공개 호스팅

**위반**: 평일 매일 GemsWriter (Gemini/Claude 기반) 가 자동 생성한 일일 트렌드 브리핑 5건을 `/briefs/{date}/article_*.txt` 로 hanbe.click에 공개 배포. 사람 편집·검증 없이 그대로 노출.

**해당 정책**: 스케일된 콘텐츠 남용 + 가치 낮은 콘텐츠 + 출처 미표기 + (금융 토픽) 신뢰 불가 주장.

**해결**: `/briefs/` 통째 삭제 (커밋 `6a5e07d`), GemsWriter는 Notion DB(본인 비공개 워크스페이스) + Telegram 메시지만 출력으로 환원 (커밋 `8930c85`). 백업: `vault/projects/hanbe/backup-briefs-2026-04-30/`.

**교훈**: AI 출력은 본인만 보는 채널(Notion private, Slack, Telegram DM) 또는 사람 편집·검증·인용 후에만 공개.

---

## 🔄 정책 변경 이력

| 날짜 | 변경 |
|---|---|
| 2026-04-30 | 최초 작성. GemsWriter 위반 사례 + 신청 전 필수 체크리스트 |
