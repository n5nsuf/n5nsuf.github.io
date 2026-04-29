/**
 * AdSense loader — reads /assets/adsense.json and injects ad units into
 * <aside class="adsense-slot" data-ad-page="landing|articles"> placeholders.
 *
 * Edit /assets/adsense.json to toggle (enabled:false) or change slot IDs
 * without touching HTML pages.
 *
 * Usage on page:
 *   <aside class="adsense-slot" data-ad-page="landing"></aside>
 *   <script src="/assets/adsense.js" defer></script>
 */
(function () {
  "use strict";

  function loadConfig() {
    return fetch("/assets/adsense.json", { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("adsense config " + r.status); return r.json(); });
  }

  function injectAdSenseScript(publisherId) {
    if (document.querySelector('script[data-adsense-loader="1"]')) return;
    var s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(publisherId);
    s.dataset.adsenseLoader = "1";
    document.head.appendChild(s);
  }

  function renderSlot(node, publisherId, slotId) {
    var ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.dataset.adClient = publisherId;
    if (slotId) {
      ins.dataset.adSlot = slotId;
      ins.dataset.adFormat = "auto";
      ins.dataset.fullWidthResponsive = "true";
    } else {
      // Auto ads (no specific slot ID) — relies on AdSense site-level auto ad config.
      ins.dataset.adFormat = "auto";
      ins.dataset.fullWidthResponsive = "true";
    }
    node.appendChild(ins);
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { /* swallow */ }
  }

  function init() {
    var slots = document.querySelectorAll("aside.adsense-slot[data-ad-page]");
    if (!slots.length) return;

    loadConfig().then(function (cfg) {
      if (!cfg || !cfg.enabled) {
        slots.forEach(function (n) { n.remove(); });
        return;
      }
      if (!cfg.publisher_id) return;
      injectAdSenseScript(cfg.publisher_id);
      slots.forEach(function (node) {
        var page = node.getAttribute("data-ad-page");
        var slotId = (cfg.slots && cfg.slots[page]) || "";
        renderSlot(node, cfg.publisher_id, slotId);
      });
    }).catch(function (err) {
      // On config fetch failure, hide placeholders to avoid empty boxes
      slots.forEach(function (n) { n.remove(); });
      if (window.console) console.warn("[adsense] disabled:", err.message);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
