/**
 * cookie-banner.js — 쿠키/광고 사용 알림 배너 (GDPR informational notice).
 *
 * 사용:
 *   <script src="/assets/cookie-banner.js" defer></script>
 *
 * 동작:
 *   - 첫 방문 시 페이지 하단에 배너 표시
 *   - "동의 / OK" 클릭 시 localStorage 저장 → 다시 표시 안 함
 *   - "정책 보기" → /privacy.html
 *
 * 주의 (GDPR 완전 준수용):
 *   - EEA/UK 사용자에게 광고 노출하려면 AdSense 콘솔의
 *     "Privacy & messaging → European regulations message" (Funding Choices)
 *     활성화가 추가로 필요. 이 배너는 informational notice 역할만.
 */
(function () {
  const STORAGE_KEY = "hanbe-cookie-ack";
  if (localStorage.getItem(STORAGE_KEY) === "1") return;

  function showBanner() {
    const lang = document.documentElement.lang === "en" || document.body.classList.contains("lang-en") ? "en" : "ko";
    const text = lang === "en"
      ? 'This site uses cookies for analytics and Google AdSense advertising. By continuing, you accept this. <a href="/privacy.html" style="color:#fff;text-decoration:underline">Privacy Policy</a>'
      : '이 사이트는 분석 및 Google AdSense 광고를 위해 쿠키를 사용합니다. 계속 이용 시 동의로 간주됩니다. <a href="/privacy.html" style="color:#fff;text-decoration:underline">개인정보 처리방침</a>';
    const btn = lang === "en" ? "OK" : "동의";

    const bar = document.createElement("div");
    bar.id = "cookie-banner";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-live", "polite");
    bar.style.cssText = [
      "position:fixed",
      "bottom:0",
      "left:0",
      "right:0",
      "background:#2C2C2A",
      "color:#fff",
      "padding:14px 20px",
      "font-size:13px",
      "line-height:1.6",
      "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Pretendard','Noto Sans KR',sans-serif",
      "z-index:99999",
      "display:flex",
      "gap:14px",
      "align-items:center",
      "justify-content:center",
      "flex-wrap:wrap",
      "box-shadow:0 -2px 12px rgba(0,0,0,.2)",
    ].join(";");
    bar.innerHTML =
      `<span style="max-width:640px">${text}</span>` +
      `<button type="button" id="cookie-ack" style="background:#534AB7;color:#fff;border:none;padding:8px 22px;border-radius:6px;font-size:13px;cursor:pointer;font-weight:600">${btn}</button>`;
    document.body.appendChild(bar);

    document.getElementById("cookie-ack").addEventListener("click", function () {
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch (_) {}
      bar.remove();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showBanner);
  } else {
    showBanner();
  }
})();
