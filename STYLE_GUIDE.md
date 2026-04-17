# n5nsuf.github.io — Style Guide

> Reference document for AI-assisted page generation (Claude Code, devprofile-admin).
> Read this file on every edit request. It describes the exact patterns already in use
> in `index.html`, `agentic_ai_intro.html`, `mcp_ecosystem.html`, `light_harness_guide.html`,
> `autotrade-guide/*.html`. Mirror those patterns precisely.

---

## 1. Site Structure

```
/                       # index.html — hub / landing (card-grid, no detailed content)
├── profile.html        # personal portfolio — DIFFERENT style (DM Mono/Syne). Do NOT touch.
├── agentic_ai_intro.html   # technical guide
├── mcp_ecosystem.html      # technical guide
├── light_harness_guide.html# technical guide
├── autotrade-guide/*.html  # sub-guides under a topic
└── projects/<slug>.html    # ← NEW. Project intro pages. Created by prompt.
```

### Landing vs Project separation
- **Landing (`index.html`)**: card-grid hub only. No long-form content. Lists sections of guides + projects.
- **Project page (`projects/<slug>.html`)**: full document, same visual language as guides.
- **Guide**: pre-existing technical writing. Do not merge with project pages.

---

## 2. Two Visual Modes — Do NOT Confuse Them

### Mode A — Document / Guide style (default for new content)
Used by: `index.html`, `agentic_ai_intro.html`, `mcp_ecosystem.html`, `light_harness_guide.html`, `autotrade-guide/*`, **and all new `projects/*.html`**.

- Fonts: Noto Sans KR + JetBrains Mono
- Palette: purple primary, teal/amber/blue/coral/red accents
- Background: `--bg: #FAFAF8`, page card white
- Max width: 860px

### Mode B — Portfolio style (profile.html only)
Used by: `profile.html`. Fonts: DM Mono + Syne. Different bg (`#f8f7f4`). Do not mix with Mode A.

**Every new page created by prompt uses Mode A** unless the prompt explicitly says "portfolio style".

---

## 3. Design Tokens (CSS `:root`) — Mode A

Every new page's `<style>` MUST include this block verbatim:

```css
:root {
  --purple:#534AB7;--purple-l:#EEEDFE;--purple-d:#3C3489;
  --teal:#0F6E56;--teal-l:#E1F5EE;
  --amber:#BA7517;--amber-l:#FAEEDA;
  --blue:#185FA5;--blue-l:#E6F1FB;
  --coral:#993C1D;--coral-l:#FAECE7;
  --red:#A32D2D;--red-l:#FCEBEB;
  --gray:#444441;--gray-l:#F1EFE8;
  --border:#D3D1C7;--text:#2C2C2A;--muted:#5F5E5A;--bg:#FAFAF8;
  --slate:#64748B;--slate-l:#F1F5F9;
}
```

**Accent selection**:
- `purple` — AI / default
- `teal` — trading / finance
- `amber` — tooling / frameworks
- `blue` — protocols / standards
- `coral` — writing / content
- `red` — alerts / critical info

Pick one accent per project page; use it for `doc-header` border, `h2`, meta-tags, and primary card color.

---

## 4. Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');
body { font-family: 'Noto Sans KR', sans-serif; font-size: 14px; line-height: 1.8; color: var(--text); background: var(--bg); }
code, .mono { font-family: 'JetBrains Mono', monospace; }
```

---

## 5. Common Navigation (MANDATORY on every sub-page)

Every page under `/projects/`, `/autotrade-guide/`, and top-level guide pages
(agentic_ai_intro / mcp_ecosystem / light_harness_guide) uses the **same nav-bar**:

```html
<div class="nav-bar">
  <a href="/" class="nav-home">← Home</a>
  <div class="nav-lang">
    <button class="lang-btn active" onclick="setLang('ko')" id="btn-ko">한국어</button>
    <button class="lang-btn" onclick="setLang('en')" id="btn-en">English</button>
  </div>
</div>
```

CSS for nav-bar:

```css
.nav-bar{position:sticky;top:0;z-index:100;background:rgba(250,250,248,.96);backdrop-filter:blur(6px);border-bottom:1px solid var(--border);padding:10px 24px;display:flex;justify-content:space-between;align-items:center}
.nav-home{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted);text-decoration:none;padding:4px 14px;border-radius:20px;border:1px solid var(--border);transition:all .15s}
.nav-home:hover{background:var(--purple-l);border-color:var(--purple);color:var(--purple)}
.nav-lang{display:flex;gap:6px}
.lang-btn{font-family:'JetBrains Mono',monospace;font-size:11px;padding:4px 14px;border-radius:20px;border:1px solid var(--border);background:white;color:var(--muted);cursor:pointer;transition:all .15s}
.lang-btn.active{background:var(--purple);color:white;border-color:var(--purple)}
```

Home page (`index.html`) uses `.lang-bar` (lang toggle only, no Home link) — do not change.

---

## 6. Multilingual Rule

Every user-facing text node has parallel ko/en versions using `lang-ko`/`lang-en` attributes:

```html
<h1 lang-ko>한국어 제목</h1>
<h1 lang-en>English Title</h1>

<p lang-ko>한국어 본문</p>
<p lang-en>English body</p>
```

CSS toggle:
```css
[lang-ko],[lang-en]{display:none}
body.lang-ko [lang-ko]{display:revert}
body.lang-en [lang-en]{display:revert}
```

JS (include at end of `<body>`):
```html
<script>
function setLang(lang) {
  document.body.className = 'lang-' + lang;
  document.getElementById('btn-ko').classList.toggle('active', lang === 'ko');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  try { localStorage.setItem('guide-lang', lang); } catch {}
}
(function() {
  try { var s = localStorage.getItem('guide-lang'); if (s) setLang(s); } catch {}
})();
</script>
```

---

## 7. Common Layout — Page Shell (Mode A)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><!-- page title --></title>
  <style>
    /* §3 tokens + §4 typography + §5 nav-bar + §6 lang toggle + §8 doc-* + §9 patterns */
  </style>
</head>
<body class="lang-ko">
  <!-- §5 nav-bar -->
  <div class="page">
    <!-- §8 doc-header -->
    <!-- optional doc-nav -->
    <!-- §9 content sections -->
    <!-- §8 doc-footer -->
  </div>
  <!-- §6 script -->
</body>
</html>
```

CSS for `.page`:
```css
*{box-sizing:border-box;margin:0;padding:0}
.page{max-width:860px;margin:0 auto;padding:48px 56px;background:white}
@media(max-width:640px){
  .page{padding:20px 16px 48px}
  .doc-header h1{font-size:21px}
  h2{font-size:15px;margin-top:32px}
  .doc-footer{flex-direction:column;gap:6px}
}
```

---

## 8. doc-header / doc-footer / doc-nav

### doc-header
```html
<div class="doc-header">
  <h1 lang-ko>페이지 제목</h1>
  <h1 lang-en>Page Title</h1>
  <div class="subtitle" lang-ko>한국어 부제</div>
  <div class="subtitle" lang-en>English subtitle</div>
  <div class="meta">
    <span class="meta-tag">YYYY-MM-DD</span>
    <span class="meta-tag" lang-ko>프로젝트</span>
    <span class="meta-tag" lang-en>Project</span>
  </div>
</div>
```

```css
.doc-header{border-bottom:2px solid var(--purple);padding-bottom:24px;margin-bottom:36px}
.doc-header h1{font-size:28px;font-weight:700;color:var(--purple);line-height:1.3}
.doc-header .subtitle{font-size:15px;color:var(--muted);margin-top:6px}
.doc-header .meta{font-size:12px;color:var(--muted);margin-top:10px;display:flex;gap:12px;flex-wrap:wrap}
.meta-tag{background:var(--purple-l);color:var(--purple-d);padding:2px 10px;border-radius:20px;font-size:11px;font-weight:500}
```

If accent is not purple, replace `--purple` / `--purple-l` / `--purple-d` in `.doc-header`, `.doc-header h1`, and `.meta-tag` with the chosen accent's tokens.

### doc-nav (optional, used for sibling pages)
```html
<div class="doc-nav">
  <a href="/">홈</a>
  <a href="projects/foo.html" class="current">Foo (현재)</a>
  <a href="projects/bar.html">Bar</a>
</div>
```

```css
.doc-nav{display:flex;gap:16px;margin-bottom:28px;font-size:12.5px;flex-wrap:wrap}
.doc-nav a{color:var(--purple);text-decoration:none;padding:4px 12px;border-radius:20px;border:1px solid var(--border);transition:all .15s}
.doc-nav a:hover{background:var(--purple-l);border-color:var(--purple)}
.doc-nav a.current{background:var(--purple);color:white;border-color:var(--purple);pointer-events:none}
```

### doc-footer
```html
<div class="doc-footer">
  <span><a href="https://github.com/n5nsuf" target="_blank">Github info</a> · <a href="/profile.html">Dev Profile</a></span>
  <span>Tech Guides & Projects · 2026</span>
</div>
```

```css
.doc-footer{border-top:1px solid var(--border);margin-top:48px;padding-top:16px;font-size:12px;color:var(--muted);display:flex;justify-content:space-between}
.doc-footer a{color:var(--purple);text-decoration:none}
.doc-footer a:hover{text-decoration:underline}
```

---

## 9. Content Patterns

Standard element styles (copy exact CSS from any guide page):

```css
h2{font-size:17px;font-weight:700;color:var(--purple);padding:6px 0 6px 12px;border-left:3px solid var(--purple);margin-bottom:16px;margin-top:42px}
h3{font-size:14px;font-weight:700;color:var(--gray);margin:20px 0 10px}
p{margin-bottom:12px;color:var(--text);font-size:13.5px}
ul,ol{margin-bottom:12px;padding-left:20px;font-size:13.5px}
li{margin-bottom:4px}

table{width:100%;border-collapse:collapse;margin-bottom:18px;font-size:13px}
thead tr{background:var(--purple)}
thead th{color:white;font-weight:600;padding:8px 12px;text-align:left;font-size:12px}
tbody tr:nth-child(even){background:var(--gray-l)}
tbody tr:hover{background:var(--purple-l)}
tbody td{padding:7px 12px;border-bottom:1px solid var(--border);vertical-align:top}
td code,p code{background:var(--gray-l);padding:1px 5px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:11.5px;color:var(--purple-d)}

pre{background:#1E1E2E;color:#CDD6F4;border-radius:8px;padding:16px 18px;font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.65;overflow-x:auto;margin-bottom:16px}

.callout{display:flex;gap:10px;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:13px}
.callout.warn{background:var(--amber-l);border-left:3px solid var(--amber)}
.callout.info{background:var(--blue-l);border-left:3px solid var(--blue)}
.callout.ok{background:var(--teal-l);border-left:3px solid var(--teal)}
.callout .icon{font-size:16px;flex-shrink:0;margin-top:1px}
.callout p{margin:0;color:var(--gray)}

.badge{display:inline-block;padding:1px 8px;border-radius:20px;font-size:11px;font-weight:600}
.badge.local{background:var(--gray-l);color:var(--gray)}
.badge.cloud{background:var(--purple-l);color:var(--purple-d)}
.badge.ok{background:var(--teal-l);color:var(--teal)}
```

### Callout usage
```html
<div class="callout info"><span class="icon">ℹ️</span><p lang-ko>정보</p><p lang-en>Info</p></div>
<div class="callout ok"><span class="icon">✅</span><p>Success message</p></div>
<div class="callout warn"><span class="icon">⚠️</span><p>Warning</p></div>
```

### Card-grid (used on `index.html` only — do not introduce elsewhere)
```css
.card-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:28px}
.card{border-radius:12px;padding:24px 20px;border:1px solid var(--border);background:white;text-decoration:none;color:var(--text);transition:all .2s;display:flex;flex-direction:column;gap:8px}
.card:hover{border-color:var(--purple);box-shadow:0 4px 16px rgba(83,74,183,.1);transform:translateY(-2px)}
.card .card-num{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;color:var(--muted)}
.card .card-title{font-size:16px;font-weight:700;color:var(--purple)}
.card .card-desc{font-size:12.5px;color:var(--muted);line-height:1.6}
.card.c-purple{background:var(--purple-l);border-color:rgba(83,74,183,.2)}
.card.c-teal{background:var(--teal-l);border-color:rgba(15,110,86,.2)}
.card.c-amber{background:var(--amber-l);border-color:rgba(186,117,23,.2)}
.card.c-blue{background:var(--blue-l);border-color:rgba(24,95,165,.2)}
```

---

## 10. Project Page (`projects/<slug>.html`) — Required Template

Every new project page MUST include these sections in this order:

1. `<div class="nav-bar">` (§5)
2. `<div class="page">` wrapping:
   - `<div class="doc-header">` with h1, subtitle, meta (date + "프로젝트 / Project" tag + optional status tag)
   - **Overview** (`<h2>`): 2-3 sentences ko/en
   - **Stack** (`<h2>`): table — Tech | Purpose (ko/en rows)
   - **Features** (`<h2>`): ul list, ko/en parallel
   - **Architecture** (`<h2>`, optional): description + optional SVG diagram
   - **Links** (`<h2>`): bullet list — Live URL, GitHub, Docs
   - `<div class="doc-footer">`
3. `<script>` (§6)

### Slug rules
- Lowercase kebab-case: `auto-trade`, `max-trans`, `subway-tracker`
- Max 30 chars, ASCII only
- Match existing GitHub repo naming where possible

### Home integration (MANDATORY when creating a new project page)

After creating `projects/<slug>.html`:

1. Open `index.html`.
2. Look for an existing `<h2>` section whose label is "프로젝트" / "Projects".
3. If the section exists:
   - Append a new `<a class="card c-{accent}">` to its `<div class="card-grid">`.
   - `href="projects/<slug>.html"`.
   - `card-num` = next sequential 2-digit number.
   - `card-title` = project name.
   - `card-desc` ko/en = 1-sentence summary.
4. If the section does NOT exist:
   - Insert a new section after the last existing section (just before `<div class="doc-footer">`):
     ```html
     <h2 style="font-size:15px;font-weight:700;color:var(--purple);padding:6px 0 6px 12px;border-left:3px solid var(--purple);margin-bottom:16px;margin-top:36px">
       <span lang-ko>프로젝트</span>
       <span lang-en>Projects</span>
     </h2>
     <div class="card-grid">
       <!-- first card -->
     </div>
     ```

---

## 11. Responsive Breakpoints

```css
@media(max-width:640px){
  .page{padding:20px 16px 48px}
  .doc-header h1{font-size:21px}
  h2{font-size:15px;margin-top:32px}
  .card-grid{grid-template-columns:1fr}
  .doc-footer{flex-direction:column;gap:6px}
}
@media print{
  body{background:white}
  .page{padding:20px 28px;max-width:100%}
  .lang-bar,.nav-bar{display:none}
  h2{page-break-after:avoid}
  table{page-break-inside:avoid}
  [lang-ko],[lang-en]{display:revert !important}
}
```

---

## 12. Do NOT

- Introduce new font families (Mode A only allows Noto Sans KR + JetBrains Mono).
- Add CSS/JS frameworks (Tailwind, Bootstrap, React, Vue).
- Use inline `style="..."` for reusable rules (add class instead). Inline is OK for one-off layouts.
- Modify `CLAUDE.md`, `STYLE_GUIDE.md`, `.github/`, `scripts/`, `profile.html`.
- Remove multilingual toggle from any page.
- Mix Mode A and Mode B styles on the same page.
- Delete existing pages without explicit instruction.
- Change the common nav-bar HTML structure (Home + lang toggle).

## 13. Files Off-Limits

| Path | Reason |
|---|---|
| `CLAUDE.md` | Global harness rules |
| `STYLE_GUIDE.md` | This file (only edit on explicit "update style guide" request) |
| `.github/workflows/` | Automation |
| `scripts/` | Automation |
| `profile.html` | Different style mode (Mode B), managed manually |
