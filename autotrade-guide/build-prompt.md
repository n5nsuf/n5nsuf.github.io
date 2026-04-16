# 자동매매 봇 구축 프롬프트

> 이 문서 하나만으로 모의투자 자동매매 봇을 처음부터 구축할 수 있습니다.
> AI 코딩 어시스턴트(Claude, Cursor 등)에 단계별로 입력하세요.

---

## 사전 준비 (프롬프트 실행 전 완료)

### 1. 한국투자증권 계좌 개설 + API 발급

1. [한국투자증권](https://securities.koreainvestment.com) 계좌 개설 (비대면 가능)
2. [KIS Developers](https://apiportal.koreainvestment.com) 접속 → 회원가입
3. **모의투자 신청** → 모의투자 APP KEY/SECRET 발급
4. 발급된 값 메모:
   - `APP_KEY`: (32자리 영숫자)
   - `APP_SECRET`: (긴 영숫자+특수문자)
   - `ACCOUNT_NO`: (8자리 숫자)

### 2. 설치할 것

| 항목 | 설치 방법 |
|------|----------|
| Python 3.11+ | [python.org](https://www.python.org/downloads/) |
| Git | [git-scm.com](https://git-scm.com/) |
| 코드 에디터 | VS Code 권장 |
| PostgreSQL (선택) | [Neon](https://neon.tech) 무료 클라우드 DB 권장 |

### 3. KIS API 기본 정보

| 항목 | 모의투자 |
|------|---------|
| REST URL | `https://openapivts.koreainvestment.com:29443` |
| 토큰 발급 | `POST /oauth2/tokenP` |
| 현재가 조회 | `GET /uapi/domestic-stock/v1/quotations/inquire-price` (tr_id: FHKST01010100) |
| 잔고 조회 | `GET /uapi/domestic-stock/v1/trading/inquire-balance` (tr_id: VTTC8434R) |
| 매수 | `POST /uapi/domestic-stock/v1/trading/order-cash` (tr_id: VTTC0802U) |
| 매도 | `POST /uapi/domestic-stock/v1/trading/order-cash` (tr_id: VTTC0801U) |

---

## Step 1: 프로젝트 생성 + KIS 연결

아래를 AI에 입력하세요:

```
Python 자동매매 봇 프로젝트를 만들어줘.

폴더 구조:
autotrade/
├── main.py          # 진입점
├── kis_api.py       # KIS API 클라이언트
├── strategy.py      # 매매 전략
├── config.py        # 설정
├── requirements.txt
└── .env

config.py:
- .env에서 APP_KEY, APP_SECRET, ACCOUNT_NO 로드
- BASE_URL = "https://openapivts.koreainvestment.com:29443" (모의투자)

kis_api.py에 구현할 함수:
1. get_token() → POST /oauth2/tokenP로 토큰 발급, 메모리 캐시
2. get_price(symbol) → 현재가 조회, 숫자 반환
3. get_balance() → {cash: 현금, holdings: [{symbol, qty, avg_price}]}
4. buy(symbol, qty) → 매수 주문 (ord_dvsn="01" 시장가)
5. sell(symbol, qty) → 매도 주문

모든 API 호출에 공통 헤더:
{
  "authorization": "Bearer {token}",
  "appkey": APP_KEY,
  "appsecret": APP_SECRET,
  "tr_id": "{거래ID}",
  "custtype": "P",
  "content-type": "application/json"
}

잔고 조회 파라미터:
CANO={계좌번호}, ACNT_PRDT_CD="01", INQR_DVSN="01"

main.py:
- 토큰 발급 테스트
- 삼성전자(005930) 현재가 조회
- 잔고 조회
- 결과 출력

requirements.txt:
requests
python-dotenv

.env 예시:
APP_KEY=여기에_입력
APP_SECRET=여기에_입력
ACCOUNT_NO=여기에_입력
```

**확인:** `python main.py` 실행 → 삼성전자 현재가 + 잔고 출력되면 성공.

---

## Step 2: 기본 매매 전략

```
strategy.py에 간단한 매매 전략을 만들어줘.

RSI(14일) 기반 전략:
- RSI < 30 → 매수 (과매도)
- RSI > 70 → 매도 (과매수)
- 그 외 → 대기

구현할 함수:
1. calc_rsi(closes: list, period=14) → float
   - Wilder's RSI 계산
   - 데이터 부족 시 50.0 반환

2. decide(symbol, closes, holdings) → "BUY" | "SELL" | "HOLD"
   - RSI 계산
   - 매수: RSI < 30 AND 미보유
   - 매도: RSI > 70 AND 보유 중
   - 그 외: HOLD

일봉 데이터는 kis_api.py에 함수 추가:
get_daily_prices(symbol, days=30):
  → GET /uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice
  → tr_id: FHKST03010100
  → 종가 리스트 반환
```

---

## Step 3: 자동 실행 (스케줄러)

```
main.py에 스케줄러를 추가해서 자동으로 매매하게 만들어줘.

pip install apscheduler 추가.

동작:
1. 프로그램 시작 시 토큰 발급
2. 평일 09:05~15:25 사이, 5분마다 run_cycle() 실행
3. run_cycle():
   a. 매매 대상 종목 리스트 (예: ["005930", "035720", "000660"])
   b. 각 종목별 일봉 조회 → RSI 계산 → 매매 판단
   c. BUY → 잔고 확인 후 매수 (1주)
   d. SELL → 보유 중이면 매도
   e. 결과 로그 출력
4. 장 외 시간에는 실행 안 함

장 개장 판단:
- 평일(월~금) AND 09:00~15:30 사이
- 공휴일 체크는 생략 (교육용)

로그 형식:
[09:05] 005930 RSI=28.3 → BUY 1주 @ 72,300원
[09:05] 035720 RSI=55.1 → HOLD
```

**확인:** 모의투자 시간(평일 09:00~15:30) 내 실행 → 로그 출력되면 성공.

---

## Step 4: 리스크 관리

```
리스크 관리 모듈을 추가해줘. risk.py 파일로.

규칙:
1. 최대 보유 종목 수: 5개
2. 종목당 최대 투자 금액: 총자산의 20%
3. 손절: 매입가 대비 -3% 이하면 즉시 매도
4. 일일 손실 한도: 총자산의 -5% 이하면 당일 매매 중단

구현:
- can_buy(cash, holdings, max_positions=5) → bool
- calc_qty(price, cash, max_pct=0.2) → int (매수 가능 수량)
- check_stop_loss(holding, current_price, stop_pct=-0.03) → bool
- check_daily_limit(daily_pnl, total_assets, limit_pct=-0.05) → bool

run_cycle()에 적용:
- 매수 전: can_buy + calc_qty
- 매 사이클: 보유 종목 손절 체크
- 일일 한도 초과 시: 사이클 스킵
```

---

## Step 5: 데이터 저장 (DB)

```
거래 기록을 PostgreSQL에 저장해줘.

Neon DB 사용 (무료):
1. neon.tech 가입 → 프로젝트 생성 → Connection string 복사
2. .env에 DATABASE_URL 추가

pip install psycopg2-binary 추가.

db.py에 구현:
1. init_tables() — 테이블 생성:
   trades: id, ts, symbol, action(BUY/SELL), qty, price, pnl_amt
   balance_snapshot: id(1), cash, holdings(JSON), updated_at

2. log_trade(symbol, action, qty, price, pnl_amt=0)
3. save_balance(cash, holdings_list)
4. get_today_trades() → 오늘 거래 내역
5. get_today_pnl() → 오늘 총 손익

run_cycle()에서:
- 매수/매도 시 log_trade() 호출
- 사이클 끝에 save_balance() 호출
- 시작 시 init_tables() 호출
```

---

## Step 6: 알림

```
Telegram 알림을 추가해줘.

준비:
1. @BotFather에서 봇 생성 → BOT_TOKEN
2. 봇에 메시지 보내고 → /getUpdates로 CHAT_ID 확인
3. .env에 추가:
   TELEGRAM_BOT_TOKEN=...
   TELEGRAM_CHAT_ID=...

notify.py:
- send(message) → Telegram으로 메시지 전송

알림 시점:
- 매수 시: "🟢 [BUY] 005930 삼성전자 1주 @ 72,300원"
- 매도 시: "🔴 [SELL] 005930 삼성전자 1주 @ 74,100원 (+2.5%)"
- 봇 시작: "✅ 자동매매 시작 — 3종목"
- 에러 발생: "🚨 오류: {메시지}"
```

---

## Step 7: 모니터링 대시보드

```
간단한 웹 대시보드를 만들어줘. Python Flask 사용.

pip install flask 추가.

dashboard.py:
- GET / → HTML 페이지 (잔고 + 오늘 거래 + 손익)
- GET /api/status → JSON (잔고, 포지션, 오늘 PnL)

HTML 페이지 내용 (인라인 CSS, 단일 파일):
- 계좌 현황: 예수금, 보유평가, 총자산
- 보유 종목 테이블: 종목, 수량, 매입가, 현재가, 수익률
- 오늘 거래 내역: 시각, 종목, 매수/매도, 수량, 가격
- 30초마다 자동 새로고침

Flask 서버를 별도 스레드로 실행 (스케줄러와 병행):
- main.py에서 threading으로 시작
- 포트: 8080
```

---

## Step 8: 배포 (선택)

```
Railway에 봇을 배포해줘.

준비:
1. railway.com 가입
2. GitHub에 프로젝트 push
3. Railway에서 GitHub 레포 연결

필요한 파일:
- Procfile: "web: python main.py"
- runtime.txt: "python-3.11.x"

Railway 환경변수 설정:
- APP_KEY, APP_SECRET, ACCOUNT_NO
- DATABASE_URL (Neon)
- TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
- PORT=8080

배포 후 확인:
- Railway 로그에서 "자동매매 시작" 확인
- 대시보드 URL 접속
- Telegram 알림 수신
```

---

## 완성 후 확장 아이디어

| 단계 | 내용 |
|------|------|
| 전략 추가 | 이동평균 크로스, MACD, 볼린저 밴드 |
| ML 도입 | scikit-learn으로 매수/매도 확률 예측 |
| LLM 활용 | Gemini/Claude API로 뉴스 분석 → 매매 판단 보조 |
| 실시간 시세 | WebSocket으로 체결가 수신 |
| 단타 모드 | 5분봉 기반 변동성 돌파 전략 |
| 실전 전환 | 모의투자 검증 후 실전 URL/KEY로 교체 |

---

## 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| `EGW00001` | 일시적 서버 오류 | 3초 후 재시도 |
| `기간이 만료된 token` | 토큰 24시간 만료 | 토큰 재발급 |
| 잔고 0 | 모의투자 초기 자금 미설정 | KIS 홈페이지에서 모의투자 신청 확인 |
| 주문 실패 | 장 외 시간 | 09:00~15:30 확인 |
| RSI 50 고정 | 일봉 데이터 부족 | 15일 이상 데이터 필요 |

---

## .env 전체 예시

```
# KIS 모의투자
APP_KEY=PSxxxxxxxxxxxxxxxxxx
APP_SECRET=xxxxxxxxxxxxxxxxxxxx
ACCOUNT_NO=50xxxxxx

# PostgreSQL (Neon)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Telegram
TELEGRAM_BOT_TOKEN=123456:ABCxxxxx
TELEGRAM_CHAT_ID=123456789
```

---

*이 문서는 교육 목적입니다. 실전 투자 전 충분한 모의투자 검증을 권장합니다.*
