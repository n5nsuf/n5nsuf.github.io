/**
 * site-footer.js — 모든 페이지에 일관된 footer + Privacy 링크 + AI 사용 표기 자동 삽입.
 *
 * 사용:
 *   페이지 </body> 직전에 <script src="/assets/site-footer.js" defer></script>
 *
 * 동작:
 *   - <footer> 태그가 이미 있으면 Privacy 링크 + AI 표기 보강
 *   - 없으면 표준 footer 블록을 body 끝에 append
 *   - 스타일은 inline (페이지별 CSS 충돌 회피)
 *
 * AI 표기 (AdSense 정책 준수):
 *   콘텐츠 본문은 사람(HCB)이 작성/검토. AI는 점검·디버그에만 보조 사용.
 */
(function () {
  const FOOTER_LINKS = [
    { href: "/", label_ko: "홈", label_en: "Home" },
    { href: "/articles.html", label_ko: "아티클", label_en: "Articles" },
    { href: "/profile.html", label_ko: "이력", label_en: "Resume" },
    { href: "/privacy.html", label_ko: "개인정보 처리방침", label_en: "Privacy" },
    { href: "https://github.com/n5nsuf", label_ko: "GitHub", label_en: "GitHub", external: true },
  ];

  const AI_NOTE_KO = "출처: 본인(HCB) 직접 작성. AI는 점검·디버그에만 사용했습니다.";
  const AI_NOTE_EN = "Source: original work by HCB. AI used only for review/debugging.";

  function detectLang() {
    return document.documentElement.lang || (document.body.classList.contains("lang-en") ? "en" : "ko");
  }

  function buildLinks() {
    const lang = detectLang();
    return FOOTER_LINKS
      .map((l) => {
        const text = lang === "en" ? l.label_en : l.label_ko;
        const ext = l.external ? ' target="_blank" rel="noopener"' : "";
        return `<a href="${l.href}"${ext} style="color:#534AB7;text-decoration:none;margin:0 6px;font-size:12.5px">${text}</a>`;
      })
      .join("·");
  }

  function buildAiNote() {
    return `<div data-ai-note="1" style="margin-top:6px;font-size:11px;color:#777">${AI_NOTE_KO} · ${AI_NOTE_EN}</div>`;
  }

  function ensurePrivacyLinkInExistingFooter(existingFooter) {
    if (!existingFooter.innerHTML.includes("privacy.html")) {
      // 기존 footer 끝에 Privacy 링크 추가
      const privacyLink = document.createElement("span");
      privacyLink.innerHTML = ' &middot; <a href="/privacy.html" style="color:inherit">Privacy</a>';
      const firstSpan = existingFooter.querySelector("span");
      if (firstSpan) {
        firstSpan.appendChild(privacyLink);
      } else {
        existingFooter.appendChild(privacyLink);
      }
    }
    // AI 표기 보강 (중복 방지)
    if (!existingFooter.querySelector('[data-ai-note]')) {
      const note = document.createElement("div");
      note.setAttribute("data-ai-note", "1");
      note.style.cssText = "margin-top:6px;font-size:11px;color:#777";
      note.textContent = `${AI_NOTE_KO} · ${AI_NOTE_EN}`;
      existingFooter.appendChild(note);
    }
  }

  function injectStandardFooter() {
    const f = document.createElement("footer");
    f.setAttribute("data-site-footer", "auto");
    f.style.cssText = [
      "border-top:1px solid #D3D1C7",
      "max-width:780px",
      "margin:64px auto 32px",
      "padding:24px",
      "color:#5F5E5A",
      "font-size:12px",
      "text-align:center",
      "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Pretendard','Noto Sans KR',sans-serif",
    ].join(";");
    f.innerHTML =
      `<div>${buildLinks()}</div>` +
      `<div style="margin-top:8px;font-size:11px">hanbe.click · 2026 HCB · 1인 실험 사이트</div>` +
      buildAiNote();
    document.body.appendChild(f);
  }

  function run() {
    const existing = document.querySelector("footer");
    if (existing) {
      ensurePrivacyLinkInExistingFooter(existing);
    } else {
      injectStandardFooter();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
