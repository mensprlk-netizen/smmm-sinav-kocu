# SMMM Sınav Koçu — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Samsung Galaxy S23 Ultra'da offline çalışan, 2026/1 ve 2026/2 SMMM Yeterlilik sınavlarının 320 resmi test sorusunu doğrulanmış çözümlerle sunan, aralıklı tekrar, deneme, S Pen çözüm alanı ve Maliyet Muhasebesi konu modülü içeren PWA.

**Architecture:** Derlemesiz saf web uygulaması (`app/`): ES modülleri, hash yönlendirme, IndexedDB kalıcılık, service worker ile tam önbellek. İçerik `app/data/` altında JSON; Python araçları (`tools/`) resmi PDF kitapçıklardan ham veri çıkarır, sayfa görüntüsü üretir ve yayın öncesi veriyi doğrular. Saf mantık modülleri (FSRS, puanlama, planlayıcı, yönlendirme, ayrıştırıcı) birim testli; ekranlar jsdom ile duman testli.

**Tech Stack:** HTML/CSS/JavaScript (ES2022, bağımlılıksız çalışma zamanı), IndexedDB, Service Worker, Pointer Events; geliştirme: Node 24 (`node --test`, dev bağımlılığı `fake-indexeddb`, `jsdom`), Python 3.13 (`pymupdf`, `pytest`), git, GitHub Pages (`gh-pages` dalı).

**Spec:** `docs/superpowers/specs/2026-10-02-smmm-sinav-kocu-design.md`

## Global Constraints

- Çalışma zamanında hiçbir npm/CDN bağımlılığı yok; `app/` klasörü tek başına statik sunulabilir olmalı (spec §4).
- Tüm kullanıcıya görünen metinler Türkçe, hata mesajları tek cümle (spec §11).
- Ders kodları: FM, MAL, HUK, SPK (1. oturum); FTA, DEN, VER, MH (2. oturum). Dönem kodları `2026-1`, `2026-2`. Soru id biçimi `<donem>-<ders>-<NN>` (iki haneli, örn. `2026-1-MAL-07`) (spec §5.1).
- Puan = (doğru − yanlış × 0,25) × (100 / geçerli soru sayısı); negatif sonuç 0'a sabitlenir; tama iblağ yok (spec §2).
- İptal (`iptal: true`) sorular denemeye ve tekrara girmez, çalışma ekranında "İPTAL" rozetiyle gösterilir (spec §5.2).
- Her çözümün `sonuc` alanı sorunun `dogru` alanıyla eşleşmeli; `validate.py` geçmeden veri yayınlanmaz (spec §7).
- Dokunma hedefleri en az 44 px; yazı boyutu 4 kademe; açık/koyu tema (spec §8).
- S Pen: yalnızca `pointerType === "pen"` ve `"mouse"` çizer, `"touch"` kaydırır (spec §9).
- Sınav tarihi varsayılanı 2026-11-28; FSRS aralıkları sınav tarihini aşamaz (spec §6.1).
- IndexedDB adı `smmm-koc`, sürüm 1, depolar: answers, cards, ink, exams, settings, flags (spec §5.5).
- Commit mesajları Türkçe, sonunda `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` satırı.

## Review Focus

1. **Deneme sırasında uygulama kapanması:** Kullanıcı sınav ortasında başka uygulamaya geçer veya tarayıcı sekmeyi öldürür; tekrar açınca "Denemeye devam et" sorulmalı ve sayaç gerçek geçen süreyi düşmeli. (Test: Task 13 `remainingMs` duvar saati testi; Task 14 kurulum ekranındaki "Yarım kalan deneme" akışı.)
2. **İptal soru içeren resmi set:** 2026-2 FTA ve HUK'ta iptal sorular var; "Tek ders, resmi set" seçildiğinde 19 soru gelmeli ve her soru 100/19 puan olmalı. (Test: Task 13 `dersPuani` iptal testi ve `createExam` iptal dışlama testi.)
3. **Yedek geri yükleme hatalı dosyayla:** Kullanıcı yanlış bir JSON seçerse veri silinmemeli, tek cümle hata görmeli. (Test: Task 2 `importAll` sürüm/şema reddi testi.)
4. **Sınava kalan gün sıfır veya negatif:** Sınav günü ve sonrasında planlayıcı çökmemeli; "Sınav günü" mesajı ve tekrar kotası 0 olmalı. (Test: Task 11 `gunlukPlan` sınav günü testi.)
5. **Avuç teması S Pen alanında:** Elini ekrana koyan kullanıcının avucu çizgi oluşturmamalı. (Test: Task 9 `touch` pointer olayının vuruş üretmediği testi.)

---

## Dosya yapısı

```
package.json                 "type":"module", test betikleri, dev bağımlılıkları
app/
  index.html                 kabuk: #app, #view, alt sekme çubuğu, güncelleme şeridi
  manifest.json
  sw.js                      service worker (önbellek öncelikli)
  sw-manifest.js             build_sw_manifest.py üretir: self.__PRECACHE, self.__VERSION
  css/base.css               tema değişkenleri, tipografi, yazı boyutu ölçekleri
  css/components.css         düğme, kart, sekme, alt panel, soru haritası, tablolar
  js/app.js                  başlangıç, yönlendirme, SW kaydı, güncelleme şeridi
  js/router.js               parseRoute(hash) saf fonksiyon
  js/db.js                   IndexedDB katmanı + yedek dışa/içe aktarma
  js/data.js                 JSON yükleme ve bellek indeksi
  js/fsrs.js                 FSRS-4.5
  js/exam.js                 deneme oturumu ve puanlama (saf)
  js/planner.js              günlük plan (saf)
  js/ink.js                  S Pen canvas bileşeni
  js/visuals.js              konu görselleri (svg-static, flow, cvp-interactive, allocation-table, variance-tree)
  js/ui.js                   küçük DOM yardımcıları: h(), toast(), sheet(), confirm()
  js/screens/question-view.js
  js/screens/home.js study.js exam.js review.js topics.js stats.js settings.js
  data/index.json
  data/questions/<donem>-<ders>.json   (16)
  data/solutions/<donem>-<ders>.json   (16)
  data/topics/maliyet/<nn>-<slug>.json (14)
  img/originals/<donem>-<ders>-p<n>.png
  img/icon-192.png img/icon-512.png
tools/
  extract_questions.py  render_pages.py  validate.py  build_sw_manifest.py  deploy.sh
  pdfs/                 16 kaynak PDF (depoya girer; kaynak kaydı)
  out/raw/*.json        ham çıkarım (gitignore)
  out/review-*.md       elle doğrulama notları
tests/
  router.test.js db.test.js data.test.js fsrs.test.js exam.test.js planner.test.js
  ink.test.js question-view.test.js visuals.test.js
  test_extract.py test_validate.py
```

---

## Faz A — İskelet

### Task 1: Proje iskeleti, yönlendirme ve kabuk

**Files:**
- Create: `package.json`, `app/index.html`, `app/css/base.css`, `app/css/components.css`, `app/js/router.js`, `app/js/ui.js`, `app/js/app.js`, `app/manifest.json`, `app/img/icon-192.png`, `app/img/icon-512.png`, `app/js/screens/home.js` (geçici yer tutucu), `tests/router.test.js`

**Interfaces:**
- Produces: `parseRoute(hash) → {name, params}`; `ui.h(tag, attrs, ...children) → Element`; `ui.toast(msg)`; `ui.sheet({title, content}) → {close}`; `ui.confirm(msg) → Promise<boolean>`; ekran sözleşmesi: her `screens/*.js` `export async function render(view, params, ctx)` ve isteğe bağlı `export function destroy()`; `ctx = {navigate(hash), db, data}`.

- [ ] **Step 1: package.json ve dev bağımlılıkları**

```json
{
  "name": "smmm-sinav-kocu",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/",
    "test:py": "python -m pytest tools -q",
    "serve": "python -m http.server 8080 --directory app",
    "manifest": "python tools/build_sw_manifest.py",
    "validate": "python tools/validate.py"
  },
  "devDependencies": {
    "fake-indexeddb": "^6.0.0",
    "jsdom": "^25.0.0"
  }
}
```

Run: `npm install`
Expected: `node_modules/` oluşur, hata yok.

- [ ] **Step 2: Yönlendirme testi (başarısız olmalı)**

`tests/router.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute } from '../app/js/router.js';

test('boş hash ana sayfaya gider', () => {
  assert.deepEqual(parseRoute(''), { name: 'home', params: {} });
  assert.deepEqual(parseRoute('#/'), { name: 'home', params: {} });
});

test('çalış ekranı ve soru id', () => {
  assert.deepEqual(parseRoute('#/study'), { name: 'study', params: {} });
  assert.deepEqual(parseRoute('#/study/q/2026-1-MAL-07'), { name: 'study', params: { id: '2026-1-MAL-07' } });
});

test('deneme alt yolları', () => {
  assert.deepEqual(parseRoute('#/exam/run/abc'), { name: 'exam', params: { stage: 'run', id: 'abc' } });
  assert.deepEqual(parseRoute('#/exam/result/abc'), { name: 'exam', params: { stage: 'result', id: 'abc' } });
});

test('konu kodu', () => {
  assert.deepEqual(parseRoute('#/topics/mhk-analizi'), { name: 'topics', params: { kod: 'mhk-analizi' } });
});

test('bilinmeyen yol ana sayfa', () => {
  assert.deepEqual(parseRoute('#/yok'), { name: 'home', params: {} });
});
```

Run: `npm test -- tests/router.test.js`
Expected: FAIL, "Cannot find module '../app/js/router.js'".

- [ ] **Step 3: router.js**

```js
// app/js/router.js
const SCREENS = ['home', 'study', 'exam', 'review', 'topics', 'stats', 'settings'];

export function parseRoute(hash) {
  const parts = (hash || '').replace(/^#\/?/, '').split('/').filter(Boolean);
  const name = parts[0];
  if (!SCREENS.includes(name)) return { name: 'home', params: {} };
  const params = {};
  if (name === 'study' && parts[1] === 'q' && parts[2]) params.id = parts[2];
  if (name === 'exam' && parts[1]) { params.stage = parts[1]; if (parts[2]) params.id = parts[2]; }
  if (name === 'topics' && parts[1]) params.kod = parts[1];
  return { name, params };
}
```

Run: `npm test -- tests/router.test.js`
Expected: 5 PASS.

- [ ] **Step 4: ui.js yardımcıları**

```js
// app/js/ui.js
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else if (v !== null && v !== undefined && v !== false) el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

export function toast(msg, ms = 2500) {
  const t = h('div', { class: 'toast', role: 'status' }, msg);
  document.body.append(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, ms);
}

export function sheet({ title, content, full = false }) {
  const backdrop = h('div', { class: 'sheet-backdrop' });
  const box = h('div', { class: 'sheet' + (full ? ' sheet-full' : ''), role: 'dialog', 'aria-label': title },
    h('div', { class: 'sheet-head' }, h('strong', {}, title), h('button', { class: 'btn-icon', 'aria-label': 'Kapat', onClick: close }, '✕')),
    h('div', { class: 'sheet-body' }, content));
  function close() { backdrop.remove(); box.remove(); }
  backdrop.addEventListener('click', close);
  document.body.append(backdrop, box);
  requestAnimationFrame(() => box.classList.add('open'));
  return { close, el: box };
}

export function confirm(msg, { ok = 'Evet', cancel = 'Vazgeç' } = {}) {
  return new Promise((resolve) => {
    const s = sheet({
      title: 'Onay',
      content: h('div', {}, h('p', {}, msg),
        h('div', { class: 'row' },
          h('button', { class: 'btn', onClick: () => { s.close(); resolve(false); } }, cancel),
          h('button', { class: 'btn btn-primary', onClick: () => { s.close(); resolve(true); } }, ok)))
    });
  });
}

export function fmtSure(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60), r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}
```

- [ ] **Step 5: index.html kabuğu**

```html
<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#1b4965">
<title>SMMM Sınav Koçu</title>
<link rel="manifest" href="manifest.json">
<link rel="icon" href="img/icon-192.png">
<link rel="apple-touch-icon" href="img/icon-192.png">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/components.css">
</head>
<body>
<div id="app">
  <header id="topbar">
    <span id="title">SMMM Sınav Koçu</span>
    <a href="#/settings" class="btn-icon" aria-label="Ayarlar">⚙</a>
  </header>
  <div id="update-bar" hidden>Yeni sürüm hazır. <button id="update-btn" class="btn btn-small">Yenile</button></div>
  <main id="view" aria-live="polite"></main>
  <nav id="tabs">
    <a href="#/" data-tab="home">Ana</a>
    <a href="#/study" data-tab="study">Çalış</a>
    <a href="#/exam" data-tab="exam">Deneme</a>
    <a href="#/review" data-tab="review">Tekrar</a>
    <a href="#/topics" data-tab="topics">Konular</a>
    <a href="#/stats" data-tab="stats">İstatistik</a>
  </nav>
</div>
<script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 6: base.css ve components.css**

`app/css/base.css`:

```css
:root {
  --bg: #f6f7f9; --surface: #ffffff; --text: #16202a; --muted: #5b6b7a; --border: #d9e0e7;
  --primary: #1b4965; --primary-text: #ffffff; --accent: #ffb703;
  --ok: #2a9d3f; --err: #d62828; --warn: #e07a00; --sel: #dbe9f5;
  --fs: 1rem; --radius: 12px; --tab-h: 60px; --top-h: 52px;
}
:root[data-theme="dark"] {
  --bg: #0f151b; --surface: #1a222b; --text: #e8edf2; --muted: #9fb0bf; --border: #2c3845;
  --primary: #5fa8d3; --primary-text: #0f151b; --sel: #24384a;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0f151b; --surface: #1a222b; --text: #e8edf2; --muted: #9fb0bf; --border: #2c3845;
    --primary: #5fa8d3; --primary-text: #0f151b; --sel: #24384a;
  }
}
:root[data-fs="1"] { --fs: 0.95rem; } :root[data-fs="2"] { --fs: 1.05rem; }
:root[data-fs="3"] { --fs: 1.2rem; }  :root[data-fs="4"] { --fs: 1.35rem; }
* { box-sizing: border-box; }
html, body { margin: 0; background: var(--bg); color: var(--text); font: var(--fs)/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; -webkit-text-size-adjust: 100%; }
#app { min-height: 100dvh; display: flex; flex-direction: column; }
#topbar { height: var(--top-h); display: flex; align-items: center; justify-content: space-between; padding: 0 16px; background: var(--primary); color: var(--primary-text); position: sticky; top: 0; z-index: 5; }
#topbar #title { font-weight: 600; }
#topbar .btn-icon { color: inherit; text-decoration: none; }
#update-bar { background: var(--accent); color: #16202a; padding: 8px 16px; display: flex; gap: 12px; align-items: center; justify-content: center; }
#view { flex: 1; padding: 16px 16px calc(var(--tab-h) + 24px); max-width: 820px; width: 100%; margin: 0 auto; }
#tabs { position: fixed; bottom: 0; left: 0; right: 0; height: calc(var(--tab-h) + env(safe-area-inset-bottom)); padding-bottom: env(safe-area-inset-bottom); display: grid; grid-template-columns: repeat(6, 1fr); background: var(--surface); border-top: 1px solid var(--border); z-index: 5; }
#tabs a { display: flex; align-items: center; justify-content: center; text-decoration: none; color: var(--muted); font-size: 0.85em; min-height: 44px; }
#tabs a.active { color: var(--primary); font-weight: 600; }
h1 { font-size: 1.35em; margin: 0 0 12px; } h2 { font-size: 1.15em; margin: 16px 0 8px; } p { margin: 0 0 8px; }
.muted { color: var(--muted); } .row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
```

`app/css/components.css`:

```css
.btn { min-height: 44px; padding: 10px 16px; border-radius: var(--radius); border: 1px solid var(--border); background: var(--surface); color: var(--text); font: inherit; cursor: pointer; }
.btn-primary { background: var(--primary); color: var(--primary-text); border-color: var(--primary); }
.btn-small { min-height: 36px; padding: 6px 12px; font-size: 0.9em; }
.btn-icon { min-width: 44px; min-height: 44px; border: 0; background: transparent; font: inherit; font-size: 1.2em; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
.btn-block { width: 100%; }
.btn[disabled] { opacity: 0.5; cursor: default; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; margin-bottom: 12px; }
.card h3 { margin: 0 0 6px; font-size: 1.05em; }
.bar { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
.bar > span { display: block; height: 100%; background: var(--primary); }
.chip { display: inline-flex; align-items: center; min-height: 36px; padding: 4px 12px; border-radius: 18px; border: 1px solid var(--border); background: var(--surface); font-size: 0.9em; cursor: pointer; }
.chip.on { background: var(--primary); color: var(--primary-text); border-color: var(--primary); }
.badge { display: inline-block; padding: 2px 8px; border-radius: 8px; font-size: 0.8em; background: var(--sel); }
.badge-err { background: var(--err); color: #fff; }
.toast { position: fixed; left: 50%; bottom: calc(var(--tab-h) + 24px); transform: translate(-50%, 20px); background: var(--text); color: var(--bg); padding: 10px 16px; border-radius: 8px; opacity: 0; transition: .25s; z-index: 50; }
.toast.show { opacity: 1; transform: translate(-50%, 0); }
.sheet-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 20; }
.sheet { position: fixed; left: 0; right: 0; bottom: 0; max-height: 85dvh; background: var(--surface); border-radius: 16px 16px 0 0; transform: translateY(100%); transition: transform .25s; z-index: 21; display: flex; flex-direction: column; }
.sheet.open { transform: translateY(0); } .sheet-full { max-height: 100dvh; height: 100dvh; border-radius: 0; }
@media (orientation: landscape) and (min-width: 700px) { .sheet { left: 50%; top: 0; max-height: 100dvh; border-radius: 0; transform: translateX(100%); } .sheet.open { transform: translateX(0); } }
.sheet-head { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid var(--border); }
.sheet-body { overflow: auto; padding: 16px; }
/* Soru görünümü */
.q-head { display: flex; justify-content: space-between; align-items: center; font-size: 0.85em; color: var(--muted); margin-bottom: 8px; }
.q-text { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; margin-bottom: 12px; }
.q-text table, .opt table { border-collapse: collapse; width: 100%; font-size: 0.92em; margin: 6px 0; }
table.veri td, table.veri th { border: 1px solid var(--border); padding: 4px 6px; text-align: left; vertical-align: top; }
table.veri td.n, table.veri th.n { text-align: right; white-space: nowrap; }
table.yevmiye td { padding: 2px 6px; vertical-align: top; } table.yevmiye td.alacak { padding-left: 28px; }
table.yevmiye td.n { text-align: right; white-space: nowrap; width: 1%; }
.opt { display: flex; gap: 10px; width: 100%; text-align: left; min-height: 48px; padding: 10px 12px; margin-bottom: 8px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text); font: inherit; cursor: pointer; }
.opt .letter { font-weight: 700; min-width: 22px; } .opt .body { flex: 1; }
.opt.selected { background: var(--sel); border-color: var(--primary); }
.opt.correct { border-color: var(--ok); background: color-mix(in srgb, var(--ok) 15%, var(--surface)); }
.opt.wrong { border-color: var(--err); background: color-mix(in srgb, var(--err) 15%, var(--surface)); }
.opt[disabled] { cursor: default; }
.q-foot { position: sticky; bottom: calc(var(--tab-h) + 8px); display: flex; gap: 8px; background: var(--bg); padding: 8px 0; }
.q-foot .btn { flex: 1; }
.solution { border-top: 2px solid var(--primary); margin-top: 12px; padding-top: 12px; }
.solution .step { margin-bottom: 8px; }
.grid-map { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.grid-map button { min-height: 44px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); font: inherit; }
.grid-map button.answered { background: var(--sel); } .grid-map button.flagged { border-color: var(--accent); border-width: 2px; }
.grid-map button.current { outline: 2px solid var(--primary); }
.timer { font-variant-numeric: tabular-nums; font-weight: 600; } .timer.low { color: var(--err); }
.ink-wrap { position: relative; touch-action: pan-y; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.ink-wrap canvas { display: block; width: 100%; touch-action: none; }
.ink-tools { display: flex; gap: 4px; padding: 6px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
.ink-tools .btn-icon.on { background: var(--sel); border-radius: 8px; }
.stat-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); }
.visual { margin: 10px 0; } .visual svg { width: 100%; height: auto; }
.visual input[type=range] { width: 100%; }
label.field { display: block; margin-bottom: 10px; } label.field select, label.field input { width: 100%; min-height: 44px; font: inherit; padding: 6px 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); color: var(--text); }
```

- [ ] **Step 7: app.js ve geçici home.js**

```js
// app/js/app.js
import { parseRoute } from './router.js';
import { toast } from './ui.js';
import * as db from './db.js';
import * as data from './data.js';

const view = document.getElementById('view');
let current = null;

function navigate(hash) { location.hash = hash; }

async function applySettings() {
  const theme = await db.getSetting('tema', 'system');
  document.documentElement.dataset.theme = theme === 'system' ? '' : theme;
  document.documentElement.dataset.fs = await db.getSetting('yaziBoyutu', 2);
}

async function route() {
  const { name, params } = parseRoute(location.hash);
  document.querySelectorAll('#tabs a').forEach(a => a.classList.toggle('active', a.dataset.tab === name));
  if (current?.destroy) { try { current.destroy(); } catch {} }
  view.innerHTML = '';
  const mod = await import(`./screens/${name}.js`);
  current = mod;
  try {
    await mod.render(view, params, { navigate, db, data });
  } catch (e) {
    console.error(e);
    view.innerHTML = '<p class="card">Ekran yüklenemedi.</p>';
  }
  window.scrollTo(0, 0);
}

function registerSw() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw?.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) {
          const bar = document.getElementById('update-bar');
          bar.hidden = false;
          document.getElementById('update-btn').onclick = () => nw.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    });
  }).catch(() => {});
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (!refreshing) { refreshing = true; location.reload(); } });
}

async function start() {
  try { await db.open(); } catch { toast('İlerleme kaydedilemiyor, yedek alın.', 5000); }
  await applySettings();
  try { await data.loadIndex(); } catch { toast('Veri yüklenemedi, önbellekten devam ediliyor.'); }
  window.addEventListener('hashchange', route);
  window.addEventListener('settings-changed', applySettings);
  await route();
  registerSw();
}
start();
```

Geçici `app/js/screens/home.js` (Task 12'de gerçek sürümü yazılır):

```js
import { h } from '../ui.js';
export async function render(view) { view.append(h('h1', {}, 'SMMM Sınav Koçu'), h('p', { class: 'muted' }, 'Kurulum devam ediyor.')); }
```

`db.js` ve `data.js` Task 2 ve 3'te yazılır; bu adımda `app.js` içe aktarma hatası vermesin diye boş modüller oluştur:

```js
// app/js/db.js (geçici)
export async function open() {}
export async function getSetting(k, d) { return d; }
```
```js
// app/js/data.js (geçici)
export async function loadIndex() { return { dersler: [], donemler: [] }; }
```

- [ ] **Step 8: manifest.json ve ikonlar**

```json
{
  "name": "SMMM Sınav Koçu",
  "short_name": "SMMM Koç",
  "start_url": "./index.html",
  "scope": "./",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#f6f7f9",
  "theme_color": "#1b4965",
  "lang": "tr",
  "icons": [
    { "src": "img/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "img/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

İkonları Python ile üret (pymupdf kurulu):

```python
# tools/make_icons.py
import pymupdf
for size in (192, 512):
    doc = pymupdf.open(); page = doc.new_page(width=size, height=size)
    page.draw_rect(page.rect, color=None, fill=(0.106, 0.286, 0.396))
    page.insert_textbox(pymupdf.Rect(0, size*0.28, size, size*0.8), "SMMM", fontsize=size*0.3, fontname="helv", color=(1,1,1), align=1)
    page.get_pixmap(dpi=72).save(f"app/img/icon-{size}.png")
```

Run: `python tools/make_icons.py`
Expected: `app/img/icon-192.png` ve `icon-512.png` oluşur.

- [ ] **Step 9: Tarayıcıda duman testi**

Run: `npm run serve` ve Chrome'da `http://localhost:8080` aç; cihaz emülasyonu 412×915.
Expected: Üst çubuk, "SMMM Sınav Koçu" başlığı, alt sekmeler; sekmeye dokununca konsolda `screens/<ad>.js` bulunamadı hatası dışında çökme yok (diğer ekranlar sonraki görevlerde gelir). Ekran yüklenemediğinde "Ekran yüklenemedi." kartı görünür.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json app tests tools/make_icons.py
git commit -m "İskelet: kabuk, yönlendirme, tema, ikonlar" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 2: IndexedDB katmanı ve yedekleme

**Files:**
- Create: `app/js/db.js` (geçiciyi değiştir), `tests/db.test.js`

**Interfaces:**
- Produces:
  - `open(factory = globalThis.indexedDB) → Promise<void>`
  - `put(store, value) → Promise<key>`, `get(store, key) → Promise<value|undefined>`, `getAll(store) → Promise<value[]>`, `del(store, key)`, `clear(store)`
  - `getSetting(anahtar, varsayilan)`, `setSetting(anahtar, deger)`
  - `addAnswer({soruId, cevap, dogruMu, emin, sure, mod, denemeId, hataEtiketi}) → Promise<number>` (tarih otomatik)
  - `answersFor(soruId) → Promise<answer[]>`, `allAnswers()`
  - `saveCard(card)`, `getCard(kartId)`, `dueCards(now) → Promise<card[]>` (due ≤ now, state ≠ 'new'), `allCards()`
  - `saveInk(hedefId, vuruslar)`, `getInk(hedefId) → vuruslar|[]`
  - `saveExam(exam)`, `getExam(denemeId)`, `allExams()`
  - `setFlag(soruId, {bayrak, not})`, `getFlag(soruId)`, `allFlags()`
  - `exportAll() → Promise<{surum:1, tarih, depolar:{answers,cards,ink,exams,settings,flags}}>`
  - `importAll(json) → Promise<void>` (geçersizse `Error('Yedek dosyası tanınmadı.')` fırlatır, mevcut veri korunur)
  - `resetAll()`

- [ ] **Step 1: Testler**

`tests/db.test.js`:

```js
import 'fake-indexeddb/auto';
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import * as db from '../app/js/db.js';

beforeEach(async () => { await db.open(new IDBFactory()); });

test('ayar yaz/oku ve varsayılan', async () => {
  assert.equal(await db.getSetting('tema', 'system'), 'system');
  await db.setSetting('tema', 'dark');
  assert.equal(await db.getSetting('tema', 'system'), 'dark');
});

test('cevap ekleme tarih atar ve soruya göre listelenir', async () => {
  const id = await db.addAnswer({ soruId: '2026-1-MAL-01', cevap: 'C', dogruMu: true, emin: true, sure: 42000, mod: 'study' });
  assert.ok(id >= 1);
  const list = await db.answersFor('2026-1-MAL-01');
  assert.equal(list.length, 1);
  assert.ok(list[0].tarih > 0);
});

test('vadesi gelen kartlar', async () => {
  const now = Date.now();
  await db.saveCard({ kartId: 'soru:a', tur: 'soru', kaynakId: 'a', state: 'review', due: now - 1000, stability: 1, difficulty: 5, reps: 1, lapses: 0, lastReview: now - 86400000 });
  await db.saveCard({ kartId: 'soru:b', tur: 'soru', kaynakId: 'b', state: 'review', due: now + 1000, stability: 1, difficulty: 5, reps: 1, lapses: 0, lastReview: now - 86400000 });
  await db.saveCard({ kartId: 'soru:c', tur: 'soru', kaynakId: 'c', state: 'new', due: 0, stability: 0, difficulty: 0, reps: 0, lapses: 0, lastReview: 0 });
  const due = await db.dueCards(now);
  assert.deepEqual(due.map(c => c.kartId), ['soru:a']);
});

test('ink kaydet/oku', async () => {
  assert.deepEqual(await db.getInk('x'), []);
  await db.saveInk('x', [{ p: [[1, 2, 0.5]], renk: '#000', kalinlik: 2, silgi: false }]);
  assert.equal((await db.getInk('x')).length, 1);
});

test('yedek dışa/içe aktarma döngüsü', async () => {
  await db.setSetting('tema', 'dark');
  await db.addAnswer({ soruId: 'q', cevap: 'A', dogruMu: false, emin: false, sure: 1, mod: 'study' });
  const dump = await db.exportAll();
  assert.equal(dump.surum, 1);
  await db.open(new IDBFactory());
  assert.equal(await db.getSetting('tema', 'system'), 'system');
  await db.importAll(dump);
  assert.equal(await db.getSetting('tema', 'system'), 'dark');
  assert.equal((await db.allAnswers()).length, 1);
});

test('geçersiz yedek reddedilir ve veri korunur', async () => {
  await db.setSetting('tema', 'dark');
  await assert.rejects(() => db.importAll({ foo: 1 }), /Yedek dosyası tanınmadı/);
  await assert.rejects(() => db.importAll({ surum: 99, depolar: {} }), /Yedek dosyası tanınmadı/);
  assert.equal(await db.getSetting('tema', 'system'), 'dark');
});

test('resetAll her şeyi siler', async () => {
  await db.setSetting('tema', 'dark');
  await db.resetAll();
  assert.equal(await db.getSetting('tema', 'system'), 'system');
});
```

Run: `npm test -- tests/db.test.js`
Expected: FAIL (fonksiyonlar yok).

- [ ] **Step 2: db.js**

```js
// app/js/db.js
const NAME = 'smmm-koc', VERSION = 1;
const STORES = ['answers', 'cards', 'ink', 'exams', 'settings', 'flags'];
let dbp = null;

export function open(factory = globalThis.indexedDB) {
  if (!factory) return Promise.reject(new Error('IndexedDB yok'));
  dbp = new Promise((resolve, reject) => {
    const req = factory.open(NAME, VERSION);
    req.onupgradeneeded = () => {
      const d = req.result;
      const a = d.createObjectStore('answers', { keyPath: 'id', autoIncrement: true });
      a.createIndex('soruId', 'soruId'); a.createIndex('denemeId', 'denemeId');
      const c = d.createObjectStore('cards', { keyPath: 'kartId' });
      c.createIndex('due', 'due');
      d.createObjectStore('ink', { keyPath: 'hedefId' });
      d.createObjectStore('exams', { keyPath: 'denemeId' });
      d.createObjectStore('settings', { keyPath: 'anahtar' });
      d.createObjectStore('flags', { keyPath: 'soruId' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbp.then(() => undefined);
}

function tx(store, mode, fn) {
  return dbp.then(d => new Promise((resolve, reject) => {
    const t = d.transaction(store, mode);
    const r = fn(t.objectStore(store));
    if (r && 'onsuccess' in r) { r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); }
    else { t.oncomplete = () => resolve(r); t.onerror = () => reject(t.error); }
  }));
}

export const put = (s, v) => tx(s, 'readwrite', o => o.put(v));
export const get = (s, k) => tx(s, 'readonly', o => o.get(k));
export const getAll = (s) => tx(s, 'readonly', o => o.getAll());
export const del = (s, k) => tx(s, 'readwrite', o => o.delete(k));
export const clear = (s) => tx(s, 'readwrite', o => o.clear());

export async function getSetting(anahtar, varsayilan) {
  if (!dbp) return varsayilan;
  try { const r = await get('settings', anahtar); return r ? r.deger : varsayilan; } catch { return varsayilan; }
}
export const setSetting = (anahtar, deger) => put('settings', { anahtar, deger });

export function addAnswer(a) { return put('answers', { ...a, tarih: Date.now() }); }
export function answersFor(soruId) {
  return tx('answers', 'readonly', o => o.index('soruId').getAll(soruId));
}
export const allAnswers = () => getAll('answers');

export const saveCard = (card) => put('cards', card);
export const getCard = (kartId) => get('cards', kartId);
export const allCards = () => getAll('cards');
export async function dueCards(now) {
  const all = await tx('cards', 'readonly', o => o.index('due').getAll(IDBKeyRange.upperBound(now)));
  return all.filter(c => c.state !== 'new');
}

export async function getInk(hedefId) { const r = await get('ink', hedefId); return r ? r.vuruslar : []; }
export const saveInk = (hedefId, vuruslar) => put('ink', { hedefId, vuruslar, guncelleme: Date.now() });

export const saveExam = (e) => put('exams', e);
export const getExam = (id) => get('exams', id);
export const allExams = () => getAll('exams');

export const setFlag = (soruId, v) => put('flags', { soruId, ...v });
export const getFlag = (soruId) => get('flags', soruId);
export const allFlags = () => getAll('flags');

export async function exportAll() {
  const depolar = {};
  for (const s of STORES) depolar[s] = await getAll(s);
  return { surum: VERSION, tarih: new Date().toISOString(), depolar };
}

export async function importAll(json) {
  if (!json || json.surum !== VERSION || typeof json.depolar !== 'object' || !STORES.every(s => Array.isArray(json.depolar[s]))) {
    throw new Error('Yedek dosyası tanınmadı.');
  }
  const d = await dbp;
  await new Promise((resolve, reject) => {
    const t = d.transaction(STORES, 'readwrite');
    for (const s of STORES) { const o = t.objectStore(s); o.clear(); for (const v of json.depolar[s]) o.put(v); }
    t.oncomplete = resolve; t.onerror = () => reject(t.error);
  });
}

export async function resetAll() { for (const s of STORES) await clear(s); }
```

Run: `npm test -- tests/db.test.js`
Expected: 7 PASS.

- [ ] **Step 3: Commit**

```bash
git add app/js/db.js tests/db.test.js
git commit -m "IndexedDB katmanı ve yedekleme" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 3: Veri yükleyici ve index.json

**Files:**
- Create: `app/js/data.js` (geçiciyi değiştir), `app/data/index.json`, `tests/data.test.js`

**Interfaces:**
- Produces:
  - `DERSLER` = `[{kod:'FM', ad:'Finansal Muhasebe', oturum:1}, {kod:'MAL', ad:'Maliyet Muhasebesi', oturum:1}, {kod:'HUK', ad:'Hukuk', oturum:1}, {kod:'SPK', ad:'Sermaye Piyasası Mevzuatı', oturum:1}, {kod:'FTA', ad:'Finansal Tablolar ve Analizi', oturum:2}, {kod:'DEN', ad:'Muhasebe Denetimi', oturum:2}, {kod:'VER', ad:'Vergi Mevzuatı ve Uygulaması', oturum:2}, {kod:'MH', ad:'Meslek Hukuku', oturum:2}]`
  - `DONEMLER = ['2026-1','2026-2']`, `dersAdi(kod)`
  - `loadIndex() → Promise<index>`; `loadQuestions(donem, ders) → Promise<Question[]>`; `loadAllQuestions() → Promise<Question[]>`
  - `getQuestion(id) → Promise<Question|undefined>`; `getSolution(id) → Promise<Solution|undefined>`
  - `filterQuestions({dersler, donemler, iptalHaric=true}) → Promise<Question[]>`
  - `loadTopics() → Promise<Topic[]>` (sıraya göre), `getTopic(kod)`
  - `setFetch(fn)` test için.

- [ ] **Step 1: index.json**

```json
{
  "surum": 1,
  "donemler": ["2026-1", "2026-2"],
  "dersler": ["FM", "MAL", "HUK", "SPK", "FTA", "DEN", "VER", "MH"],
  "konular": ["01-maliyet-kavramlari", "02-maliyet-akisi-7a-7b", "03-direkt-ilk-madde-malzeme", "04-direkt-iscilik", "05-genel-uretim-giderleri-dagitim", "06-siparis-maliyeti", "07-safha-maliyeti", "08-birlesik-yan-urun", "09-standart-maliyet-sapma", "10-maliyet-hacim-kar", "11-maliyet-yontemleri", "12-butceleme-esnek-butce", "13-karar-verme-ilgili-maliyet", "14-faaliyet-tabanli-maliyetleme"],
  "kaynaklar": {
    "2026-1": { "url": "https://smmmonline.com/yeterlilik-cikmis-sorular/2026-1", "aciklama": "TÜRMOB-TESMER SMMM 2026-1 resmi soru kitapçıkları", "indirme": "2026-10-02" },
    "2026-2": { "url": "https://smmmonline.com/yeterlilik-cikmis-sorular/2026-2", "aciklama": "TÜRMOB SMMM 2026-2 resmi soru kitapçıkları (TESMER 27.07.2026 yayını)", "indirme": "2026-10-02" }
  }
}
```

- [ ] **Step 2: Test**

`tests/data.test.js`:

```js
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as data from '../app/js/data.js';

const files = {
  'data/index.json': { surum: 1, donemler: ['2026-1'], dersler: ['MAL'], konular: ['10-maliyet-hacim-kar'] },
  'data/questions/2026-1-MAL.json': [
    { id: '2026-1-MAL-01', donem: '2026-1', ders: 'MAL', no: 1, konu: '10-maliyet-hacim-kar', metin: '<p>a</p>', secenekler: { A: 'a', B: 'b', C: 'c', D: 'd', E: 'e' }, dogru: 'A', iptal: false },
    { id: '2026-1-MAL-02', donem: '2026-1', ders: 'MAL', no: 2, konu: '10-maliyet-hacim-kar', metin: '<p>b</p>', secenekler: { A: 'a', B: 'b', C: 'c', D: 'd', E: 'e' }, dogru: 'B', iptal: true }
  ],
  'data/solutions/2026-1-MAL.json': [{ id: '2026-1-MAL-01', sonuc: 'A', ozet: 'x', adimlar: [], dayanak: '', tuzaklar: {}, kartlar: [] }],
  'data/topics/maliyet/10-maliyet-hacim-kar.json': { kod: '10-maliyet-hacim-kar', sira: 10, baslik: 'MHK', bolumler: [], ornekler: [], cikmisSorular: [], kartlar: [] }
};

beforeEach(() => {
  data.reset();
  data.setFetch(async (url) => {
    const key = url.replace(/^\.\//, '');
    if (!(key in files)) return { ok: false, status: 404 };
    return { ok: true, json: async () => structuredClone(files[key]) };
  });
});

test('index yüklenir ve ders adı çözülür', async () => {
  const idx = await data.loadIndex();
  assert.equal(idx.surum, 1);
  assert.equal(data.dersAdi('MAL'), 'Maliyet Muhasebesi');
});

test('soru ve çözüm id ile bulunur', async () => {
  await data.loadIndex();
  const q = await data.getQuestion('2026-1-MAL-02');
  assert.equal(q.no, 2);
  const s = await data.getSolution('2026-1-MAL-01');
  assert.equal(s.sonuc, 'A');
  assert.equal(await data.getSolution('yok'), undefined);
});

test('filtre iptalleri dışlar', async () => {
  await data.loadIndex();
  const qs = await data.filterQuestions({ dersler: ['MAL'], donemler: ['2026-1'] });
  assert.deepEqual(qs.map(q => q.id), ['2026-1-MAL-01']);
  const all = await data.filterQuestions({ dersler: ['MAL'], donemler: ['2026-1'], iptalHaric: false });
  assert.equal(all.length, 2);
});

test('eksik dosya boş liste döner, çökmez', async () => {
  await data.loadIndex();
  assert.deepEqual(await data.loadQuestions('2026-1', 'FM'), []);
});

test('konular sıraya göre gelir', async () => {
  await data.loadIndex();
  const t = await data.loadTopics();
  assert.equal(t[0].baslik, 'MHK');
});
```

Run: `npm test -- tests/data.test.js`
Expected: FAIL.

- [ ] **Step 3: data.js**

```js
// app/js/data.js
export const DERSLER = [
  { kod: 'FM', ad: 'Finansal Muhasebe', oturum: 1 },
  { kod: 'MAL', ad: 'Maliyet Muhasebesi', oturum: 1 },
  { kod: 'HUK', ad: 'Hukuk', oturum: 1 },
  { kod: 'SPK', ad: 'Sermaye Piyasası Mevzuatı', oturum: 1 },
  { kod: 'FTA', ad: 'Finansal Tablolar ve Analizi', oturum: 2 },
  { kod: 'DEN', ad: 'Muhasebe Denetimi', oturum: 2 },
  { kod: 'VER', ad: 'Vergi Mevzuatı ve Uygulaması', oturum: 2 },
  { kod: 'MH', ad: 'Meslek Hukuku', oturum: 2 },
];
export const DONEMLER = ['2026-1', '2026-2'];
export const dersAdi = (kod) => DERSLER.find(d => d.kod === kod)?.ad ?? kod;

let fetchFn = (url) => fetch(url);
export function setFetch(fn) { fetchFn = fn; }
let index = null;
const qCache = new Map(), sCache = new Map(), tCache = new Map();
export function reset() { index = null; qCache.clear(); sCache.clear(); tCache.clear(); }

async function getJson(path, fallback) {
  try { const r = await fetchFn('./' + path); if (!r.ok) return fallback; return await r.json(); } catch { return fallback; }
}

export async function loadIndex() {
  if (!index) index = await getJson('data/index.json', null);
  if (!index) throw new Error('index.json yüklenemedi');
  return index;
}

export async function loadQuestions(donem, ders) {
  const key = `${donem}-${ders}`;
  if (!qCache.has(key)) qCache.set(key, await getJson(`data/questions/${key}.json`, []));
  return qCache.get(key);
}
async function loadSolutions(donem, ders) {
  const key = `${donem}-${ders}`;
  if (!sCache.has(key)) sCache.set(key, await getJson(`data/solutions/${key}.json`, []));
  return sCache.get(key);
}

export async function loadAllQuestions() {
  const idx = await loadIndex(); const out = [];
  for (const d of idx.donemler) for (const k of idx.dersler) out.push(...await loadQuestions(d, k));
  return out;
}

function splitId(id) { const m = /^(\d{4}-\d)-([A-Z]+)-(\d{2})$/.exec(id); return m ? { donem: m[1], ders: m[2], no: +m[3] } : null; }

export async function getQuestion(id) {
  const p = splitId(id); if (!p) return undefined;
  return (await loadQuestions(p.donem, p.ders)).find(q => q.id === id);
}
export async function getSolution(id) {
  const p = splitId(id); if (!p) return undefined;
  return (await loadSolutions(p.donem, p.ders)).find(s => s.id === id);
}

export async function filterQuestions({ dersler, donemler, iptalHaric = true } = {}) {
  const idx = await loadIndex();
  const ds = dersler?.length ? dersler : idx.dersler, dn = donemler?.length ? donemler : idx.donemler;
  const out = [];
  for (const d of dn) for (const k of ds) out.push(...await loadQuestions(d, k));
  return iptalHaric ? out.filter(q => !q.iptal) : out;
}

export async function loadTopics() {
  const idx = await loadIndex(); const out = [];
  for (const kod of idx.konular ?? []) {
    if (!tCache.has(kod)) tCache.set(kod, await getJson(`data/topics/maliyet/${kod}.json`, null));
    if (tCache.get(kod)) out.push(tCache.get(kod));
  }
  return out.sort((a, b) => a.sira - b.sira);
}
export async function getTopic(kod) { return (await loadTopics()).find(t => t.kod === kod); }
```

Run: `npm test`
Expected: router, db, data testleri PASS.

- [ ] **Step 4: Commit**

```bash
git add app/js/data.js app/data/index.json tests/data.test.js
git commit -m "Veri yükleyici ve index.json" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Faz B — İçerik araçları

### Task 4: PDF'den ham soru çıkarımı ve sayfa görüntüleri

**Files:**
- Create: `tools/extract_questions.py`, `tools/render_pages.py`, `tools/test_extract.py`, `tools/pdfs/` (16 PDF, scratchpad'den kopyalanır)

**Interfaces:**
- Produces: `extract(pdf_path, donem, ders, dpi=150) → list[dict]` her öğe `{id, donem, ders, no, sayfa, kutu:[x,y,w,h], metin_raw, secenekler_raw:{A..E}, dogru, iptal, notlar:[str]}`; CLI: `python tools/extract_questions.py tools/pdfs/2026_1_maliyet-muhasebesi.pdf 2026-1 MAL` → `tools/out/raw/2026-1-MAL.json`.
- `render_pages.py`: CLI `python tools/render_pages.py tools/pdfs/2026_1_maliyet-muhasebesi.pdf 2026-1 MAL` → `app/img/originals/2026-1-MAL-p1.png …` (150 dpi).

- [ ] **Step 1: PDF'leri depoya kopyala**

```bash
mkdir -p tools/pdfs tools/out/raw
cp "/c/Users/Pc/AppData/Local/Temp/claude/c--SMMM-S-nav-Ko-u/d16d366b-6b95-4d2e-921b-a1a480159649/scratchpad/pdfs/"*.pdf tools/pdfs/
ls tools/pdfs | wc -l
```
Expected: 16.

Scratchpad silinmişse yeniden indir: `https://smmmonline.com/yeterlilik-cikmis-sorular/pdf/YETERLILIK_<2026_1|2026_2>_<slug>.pdf`; slug değerleri: finansal-muhasebe, maliyet-muhasebesi, finansal-tablolar-analizi, muhasebe-denetimi, vergi-mevzuati, hukuk, meslek-hukuku, spk-mevzuati. `curl -sL -A "Mozilla/5.0"` ile; hedef ad `tools/pdfs/<2026_1>_<slug>.pdf`.

- [ ] **Step 2: Test (başarısız olmalı)**

`tools/test_extract.py`:

```python
import json, pathlib, pytest
from extract_questions import extract

PDF = pathlib.Path(__file__).parent / "pdfs"

def test_maliyet_2026_1_yirmi_soru():
    qs = extract(PDF / "2026_1_maliyet-muhasebesi.pdf", "2026-1", "MAL")
    assert [q["no"] for q in qs] == list(range(1, 21))
    assert qs[0]["id"] == "2026-1-MAL-01"
    assert qs[0]["metin_raw"].startswith("Büro mobilyası üreten")
    for q in qs:
        assert set(q["secenekler_raw"]) == set("ABCDE"), q["id"]
        assert q["dogru"] in "ABCDE", q["id"]
        assert q["kutu"][2] > 0 and q["kutu"][3] > 0

def test_hukuk_2026_2_sirali_numaralama_ve_iptal():
    qs = extract(PDF / "2026_2_hukuk.pdf", "2026-2", "HUK")
    assert [q["no"] for q in qs] == list(range(1, 21))
    assert any(q["iptal"] for q in qs)

def test_vergi_2026_2_cevap_guncelleme():
    qs = extract(PDF / "2026_2_vergi-mevzuati.pdf", "2026-2", "VER")
    q2 = qs[1]
    assert q2["dogru"] == "A"
    assert any("güncellen" in n for n in q2["notlar"])

def test_fta_2026_2_iptal_var():
    qs = extract(PDF / "2026_2_finansal-tablolar-analizi.pdf", "2026-2", "FTA")
    assert sum(q["iptal"] for q in qs) >= 1
```

Run: `cd tools && python -m pytest test_extract.py -q`
Expected: ImportError.

- [ ] **Step 3: extract_questions.py**

```python
"""Resmi TÜRMOB-TESMER SMMM kitapçığından ham soru çıkarımı.

Kullanım: python tools/extract_questions.py <pdf> <donem> <ders>
Çıktı: tools/out/raw/<donem>-<ders>.json
"""
import json, re, sys, pathlib
import pymupdf

Q_RE = re.compile(r"^\s*(\d{1,2})\.\s+\S")
OPT_RE = re.compile(r"^\s*([A-E])\)\s*(.*)$")
SKIP_RE = re.compile(r"^(TÜRMOB(-TESMER)? SMMM|20\d\d-\d|Diğer sayfaya geçiniz\.?|\d{1,2})$")
GUNCEL_RE = re.compile(r'"([A-E])"\s*şıkkı olarak güncellen')

def _is_red(color):
    r, g, b = (color >> 16) & 255, (color >> 8) & 255, color & 255
    return r >= 180 and g <= 80 and b <= 80

def _lines(doc):
    """Sayfa, sütun, y, x sırasına göre satırlar."""
    out = []
    for pno, page in enumerate(doc):
        mid = page.rect.width / 2
        for b in page.get_text("dict")["blocks"]:
            for l in b.get("lines", []):
                text = "".join(s["text"] for s in l["spans"]).strip()
                if not text:
                    continue
                red = any(_is_red(s["color"]) and re.match(r"^\s*[A-E]\)", s["text"]) for s in l["spans"])
                x0, y0, x1, y1 = l["bbox"]
                col = 0 if x0 < mid - 15 else 1
                out.append({"page": pno, "col": col, "y": round(y0, 1), "x": x0, "bbox": l["bbox"], "text": text, "red": red})
    out.sort(key=lambda L: (L["page"], L["col"], L["y"], L["x"]))
    return out

def extract(pdf_path, donem, ders, dpi=150):
    doc = pymupdf.open(str(pdf_path))
    scale = dpi / 72
    lines = _lines(doc)
    first_q = next((i for i, L in enumerate(lines) if Q_RE.match(L["text"]) and L["text"].lstrip().startswith("1.")), 0)
    headers = {L["text"] for L in lines[:first_q]}  # sayfa başlıkları (kurum, dönem, ders adı) her sayfada tekrar eder
    questions, cur, expected = [], None, 1
    for L in lines:
        t = L["text"]
        if SKIP_RE.match(t) or t in headers:
            continue
        m = Q_RE.match(t)
        if m and int(m.group(1)) == expected:
            cur = {"no": expected, "sayfa": L["page"] + 1, "lines": [], "boxes": []}
            questions.append(cur)
            expected += 1
            t = t[m.end() - 1:].strip()
        if cur is None:
            continue
        cur["lines"].append({"text": t, "red": L["red"], "page": L["page"]})
        if L["page"] + 1 == cur["sayfa"]:
            cur["boxes"].append(L["bbox"])
    out = []
    for q in questions:
        metin, opts, dogru, notlar, iptal, key = [], {}, None, [], False, None
        for ln in q["lines"]:
            t = ln["text"]
            if "İPTAL" in t.upper():
                iptal = True; notlar.append(t); continue
            if "güncellen" in t or "yayınlanmış" in t:
                notlar.append(t); continue
            om = OPT_RE.match(t)
            if om:
                key = om.group(1); opts[key] = om.group(2).strip()
                if ln["red"] and dogru is None:
                    dogru = key
                continue
            if key is None:
                metin.append(t)
            else:
                opts[key] = (opts[key] + "\n" + t).strip()
        gm = GUNCEL_RE.search(" ".join(notlar))
        if gm:
            dogru = gm.group(1)
        xs = [b[0] for b in q["boxes"]] or [0]; ys = [b[1] for b in q["boxes"]] or [0]
        xe = [b[2] for b in q["boxes"]] or [0]; ye = [b[3] for b in q["boxes"]] or [0]
        kutu = [round(min(xs) * scale), round(min(ys) * scale), round((max(xe) - min(xs)) * scale), round((max(ye) - min(ys)) * scale)]
        out.append({
            "id": f"{donem}-{ders}-{q['no']:02d}", "donem": donem, "ders": ders, "no": q["no"],
            "sayfa": q["sayfa"], "kutu": kutu,
            "metin_raw": "\n".join(metin).strip(), "secenekler_raw": opts,
            "dogru": dogru, "iptal": iptal, "notlar": notlar,
        })
    return out

if __name__ == "__main__":
    pdf, donem, ders = sys.argv[1:4]
    qs = extract(pdf, donem, ders)
    dest = pathlib.Path(__file__).parent / "out" / "raw" / f"{donem}-{ders}.json"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(qs, ensure_ascii=False, indent=1), encoding="utf-8")
    eksik = [q["id"] for q in qs if q["dogru"] is None or len(q["secenekler_raw"]) != 5]
    print(f"{dest}: {len(qs)} soru; eksik/şüpheli: {eksik}")
```

Run: `cd tools && python -m pytest test_extract.py -q`
Expected: 4 PASS. Başarısız olursa ilgili kitapçığın satırlarını dök:

```bash
cd tools && python -c "from extract_questions import _lines; import pymupdf; [print(L['page'], L['col'], L['y'], L['red'], L['text']) for L in _lines(pymupdf.open('pdfs/2026_2_hukuk.pdf'))]"
```

ve regex'i düzelt. Soru numaralarının sıralı eşleşmesi (`expected`) "63. madde" gibi yanlış eşleşmeleri engeller.

- [ ] **Step 4: render_pages.py**

```python
"""Kitapçık sayfalarını PNG olarak üretir. Kullanım: python tools/render_pages.py <pdf> <donem> <ders>"""
import sys, pathlib, pymupdf

def render(pdf_path, donem, ders, dpi=150, dest_dir=None):
    dest_dir = pathlib.Path(dest_dir or pathlib.Path(__file__).parent.parent / "app" / "img" / "originals")
    dest_dir.mkdir(parents=True, exist_ok=True)
    doc = pymupdf.open(str(pdf_path)); paths = []
    for i, page in enumerate(doc):
        p = dest_dir / f"{donem}-{ders}-p{i + 1}.png"
        page.get_pixmap(dpi=dpi).save(str(p)); paths.append(p)
    return paths

if __name__ == "__main__":
    for p in render(*sys.argv[1:4]):
        print(p, p.stat().st_size // 1024, "KB")
```

Run: `python tools/render_pages.py tools/pdfs/2026_1_maliyet-muhasebesi.pdf 2026-1 MAL`
Expected: 5 PNG, her biri 500 KB altında. Daha büyükse `dpi=130` kullan.

- [ ] **Step 5: Commit**

```bash
git add tools/extract_questions.py tools/render_pages.py tools/test_extract.py tools/pdfs app/img/originals/2026-1-MAL-*.png
git commit -m "PDF çıkarım ve sayfa görüntüsü araçları" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 5: Veri doğrulayıcı (validate.py)

**Files:**
- Create: `tools/validate.py`, `tools/test_validate.py`

**Interfaces:**
- Produces: `validate(app_dir) → list[str]` (hata listesi; boşsa geçerli). CLI çıkış kodu 1 hata varsa. Kurallar spec §7.4.

- [ ] **Step 1: Test**

`tools/test_validate.py`:

```python
import json, pathlib
from validate import validate

def _q(no, **kw):
    d = {"id": f"2026-1-MAL-{no:02d}", "donem": "2026-1", "ders": "MAL", "no": no, "konu": "10-maliyet-hacim-kar",
         "ortakBilgi": None, "metin": "<p>s</p>", "secenekler": {k: "<p>x</p>" for k in "ABCDE"},
         "dogru": "A", "iptal": False, "cevapNotu": None, "orijinal": {"sayfa": 1, "kutu": [0, 0, 1, 1]}}
    d.update(kw); return d

def _s(no, **kw):
    d = {"id": f"2026-1-MAL-{no:02d}", "sonuc": "A", "ozet": "o", "adimlar": ["<p>1</p>"], "dayanak": "d",
         "tuzaklar": {"B": "b", "C": "c"}, "kartlar": [], "konuBaglantisi": "10-maliyet-hacim-kar"}
    d.update(kw); return d

def _write(tmp, qs, ss, konular=None):
    (tmp / "data/questions").mkdir(parents=True); (tmp / "data/solutions").mkdir(parents=True)
    (tmp / "data/topics/maliyet").mkdir(parents=True)
    (tmp / "data/index.json").write_text(json.dumps({"surum": 1, "donemler": ["2026-1"], "dersler": ["MAL"],
        "konular": ["10-maliyet-hacim-kar"]}), encoding="utf-8")
    (tmp / "data/questions/2026-1-MAL.json").write_text(json.dumps(qs), encoding="utf-8")
    (tmp / "data/solutions/2026-1-MAL.json").write_text(json.dumps(ss), encoding="utf-8")
    for k in (konular or []):
        (tmp / f"data/topics/maliyet/{k['kod']}.json").write_text(json.dumps(k), encoding="utf-8")

def test_gecerli_veri(tmp_path):
    _write(tmp_path, [_q(i) for i in range(1, 21)], [_s(i) for i in range(1, 21)])
    errs = validate(tmp_path)
    assert [e for e in errs if "MAL" in e] == []

def test_eksik_soru_ve_anahtar_uyumsuzlugu(tmp_path):
    qs = [_q(i) for i in range(1, 20)]
    ss = [_s(i) for i in range(1, 20)]; ss[0]["sonuc"] = "B"
    _write(tmp_path, qs, ss)
    errs = validate(tmp_path)
    assert any("20 soru" in e for e in errs)
    assert any("2026-1-MAL-01" in e and "sonuc" in e for e in errs)

def test_html_ve_konu_kontrolu(tmp_path):
    qs = [_q(i) for i in range(1, 21)]; qs[2]["metin"] = "<p>açık"; qs[3]["konu"] = "yok"
    _write(tmp_path, qs, [_s(i) for i in range(1, 21)])
    errs = validate(tmp_path)
    assert any("2026-1-MAL-03" in e and "HTML" in e for e in errs)
    assert any("2026-1-MAL-04" in e and "konu" in e for e in errs)

def test_konu_cikmis_soru_referansi(tmp_path):
    konu = {"kod": "10-maliyet-hacim-kar", "sira": 10, "baslik": "MHK", "amac": "a", "bolumler": [{"baslik": "b", "html": "<p>x</p>"}],
            "sinavYaklasimi": [], "ornekler": [], "cikmisSorular": ["2026-1-MAL-99"], "kartlar": []}
    _write(tmp_path, [_q(i) for i in range(1, 21)], [_s(i) for i in range(1, 21)], [konu])
    errs = validate(tmp_path)
    assert any("2026-1-MAL-99" in e for e in errs)
```

Run: `cd tools && python -m pytest test_validate.py -q`
Expected: ImportError.

- [ ] **Step 2: validate.py**

```python
"""Yayın öncesi veri doğrulama. Kullanım: python tools/validate.py [app_dir]"""
import json, pathlib, sys
from html.parser import HTMLParser

VOID = {"br", "hr", "img", "input", "col"}

class _Checker(HTMLParser):
    def __init__(self):
        super().__init__(); self.stack = []; self.bad = False
    def handle_starttag(self, tag, attrs):
        if tag not in VOID: self.stack.append(tag)
    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1] != tag: self.bad = True
        else: self.stack.pop()

def html_ok(s):
    if not isinstance(s, str) or not s.strip(): return False
    c = _Checker(); c.feed(s); c.close()
    return not c.bad and not c.stack

def validate(app_dir):
    app = pathlib.Path(app_dir); errs = []
    idx = json.loads((app / "data/index.json").read_text(encoding="utf-8"))
    konular = set(idx.get("konular", []))
    all_ids = set()
    for donem in idx["donemler"]:
        for ders in idx["dersler"]:
            key = f"{donem}-{ders}"
            qp = app / f"data/questions/{key}.json"; sp = app / f"data/solutions/{key}.json"
            if not qp.exists():
                errs.append(f"{key}: soru dosyası yok"); continue
            qs = json.loads(qp.read_text(encoding="utf-8"))
            ss = {s["id"]: s for s in json.loads(sp.read_text(encoding="utf-8"))} if sp.exists() else {}
            if [q["no"] for q in qs] != list(range(1, 21)):
                errs.append(f"{key}: 20 soru 1..20 sırayla olmalı")
            for q in qs:
                qid = q.get("id", "?"); all_ids.add(qid)
                if qid != f"{donem}-{ders}-{q.get('no', 0):02d}": errs.append(f"{qid}: id biçimi")
                if set(q.get("secenekler", {})) != set("ABCDE"): errs.append(f"{qid}: 5 seçenek yok")
                if q.get("dogru") not in list("ABCDE"): errs.append(f"{qid}: dogru A-E değil")
                if not html_ok(q.get("metin")): errs.append(f"{qid}: metin HTML geçersiz veya boş")
                for k, v in q.get("secenekler", {}).items():
                    if not html_ok(v): errs.append(f"{qid}: seçenek {k} HTML geçersiz veya boş")
                if q.get("ortakBilgi") is not None and not html_ok(q["ortakBilgi"]): errs.append(f"{qid}: ortakBilgi HTML geçersiz")
                if ders == "MAL" and q.get("konu") not in konular: errs.append(f"{qid}: konu kodu tanımsız")
                s = ss.get(qid)
                if not s:
                    errs.append(f"{qid}: çözüm yok"); continue
                if s.get("sonuc") != q.get("dogru"): errs.append(f"{qid}: çözüm sonuc ({s.get('sonuc')}) anahtarla ({q.get('dogru')}) uyuşmuyor")
                if not s.get("ozet") or not s.get("adimlar"): errs.append(f"{qid}: çözüm özet/adımlar boş")
                for a in s.get("adimlar", []):
                    if not html_ok(a): errs.append(f"{qid}: çözüm adımı HTML geçersiz")
                if len(s.get("tuzaklar", {})) < 2 and not q.get("iptal"): errs.append(f"{qid}: en az iki tuzak açıklaması gerekli")
    for kod in idx.get("konular", []):
        tp = app / f"data/topics/maliyet/{kod}.json"
        if not tp.exists():
            errs.append(f"konu {kod}: dosya yok"); continue
        t = json.loads(tp.read_text(encoding="utf-8"))
        if t.get("kod") != kod: errs.append(f"konu {kod}: kod alanı uyuşmuyor")
        for b in t.get("bolumler", []):
            if not html_ok(b.get("html")): errs.append(f"konu {kod}: bölüm '{b.get('baslik')}' HTML geçersiz")
        for ref in t.get("cikmisSorular", []):
            if ref not in all_ids: errs.append(f"konu {kod}: çıkmış soru {ref} bulunamadı")
    return errs

if __name__ == "__main__":
    app_dir = sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).parent.parent / "app"
    errs = validate(app_dir)
    for e in errs: print("HATA:", e)
    print("Doğrulama:", "GEÇTİ" if not errs else f"{len(errs)} hata")
    sys.exit(1 if errs else 0)
```

Run: `cd tools && python -m pytest -q`
Expected: tüm Python testleri PASS.

- [ ] **Step 3: Commit**

```bash
git add tools/validate.py tools/test_validate.py
git commit -m "Veri doğrulayıcı" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 6: İlk içerik: 2026-1 Maliyet Muhasebesi soruları ve çözümleri

Bu görev içerik üretim hattının uçtan uca ilk uygulamasıdır; aynı yöntem Task 19 ve 20'de 16 dosyanın tamamına uygulanır.

**Files:**
- Create: `app/data/questions/2026-1-MAL.json`, `app/data/solutions/2026-1-MAL.json`, `tools/out/review-2026-1-MAL.md`

**Interfaces:**
- Consumes: `tools/out/raw/2026-1-MAL.json` (Task 4), `app/img/originals/2026-1-MAL-p*.png` (Task 4).
- Produces: spec §5.2 ve §5.3 biçiminde 20 soru + 20 çözüm; `validate.py` bu dosya için hatasız.

- [ ] **Step 1: Ham çıkarımı üret**

```bash
python tools/extract_questions.py tools/pdfs/2026_1_maliyet-muhasebesi.pdf 2026-1 MAL
```
Expected: "20 soru; eksik/şüpheli: []".

- [ ] **Step 2: Soru dosyasını yaz (elle doğrulama)**

Her soru için: sayfa PNG'sini Read aracıyla aç (görüntü gösterilir), ham metni orijinalle karşılaştır, HTML'e çevir. Dönüştürme kuralları:

- Paragraflar `<p>`; soru kökündeki asıl soru cümlesi ayrı `<p>` içinde ve `<strong>` ile.
- Veri tabloları:

```html
<table class="veri"><tr><th></th><th class="n">Değişken GÜG</th><th class="n">Sabit GÜG</th><th class="n">Toplam</th></tr>
<tr><td>Yüklenen (Standart) GÜG</td><td class="n">567.368 ₺</td><td class="n">611.840 ₺</td><td class="n">1.179.208 ₺</td></tr></table>
```

- Yevmiye kaydı şıkları:

```html
<table class="yevmiye">
<tr><td>620 SATILAN MAMULLER MALİYETİ</td><td class="n">2.000</td><td class="n"></td></tr>
<tr><td class="alacak">741 HİZMET ÜRETİM MALİYETİ YANSITMA HS.</td><td class="n"></td><td class="n">2.000</td></tr>
</table>
```

- Liste halinde veriler `<ul>`; para birimi ₺ korunur; binlik ayracı nokta, ondalık virgül (kitapçıktaki gibi).
- `konu`: 14 koddan en uygunu (index.json `konular`).
- `orijinal`: `{"sayfa": raw.sayfa, "kutu": raw.kutu}`.
- `dogru`: ham `dogru`; görüntüdeki kırmızı işaretle teyit et.
- `cevapNotu`: ham `notlar` varsa tek metin olarak birleştir; yoksa `null`. `iptal`: ham değer; görüntüde "İPTAL" teyit et.

`tools/out/review-2026-1-MAL.md` içine her soru için bir satır: `| 07 | ok | tablo elle düzenlendi |`.

- [ ] **Step 3: Çözümleri yaz**

Her çözüm: `ozet` (tek cümle), `adimlar` (hesaplı sorularda her ara sonuç; kavramsal sorularda tanım, kural, uygulama), `dayanak` (örn. "Tekdüzen Muhasebe Sistemi Uygulama Genel Tebliği, 7/A seçeneği", "Safha maliyeti, ağırlıklı ortalama yöntemi"), `tuzaklar` (en az iki yanlış şık için neden yanlış), `kartlar` (1-3 soru/cevap çifti), `konuBaglantisi` (sorunun `konu` değeri).

Hesaplı sorularda hesabı anahtara bakmadan yap, sonucu şıkla eşleştir. Eşleşmezse `sonuc` alanına anahtardaki harfi yazıp geçme: soruyu `review` dosyasına "ANAHTAR ÇELİŞKİSİ" diye not et, çözümü dosyaya ekleme ve görev sonunda kullanıcıya soru id'siyle raporla.

Örnek (2026-1-MAL-01, ilk ve dönüşüm maliyeti):

```json
{
  "id": "2026-1-MAL-01", "sonuc": "C",
  "ozet": "İlk maliyet = DİMM + Dİ = 138.750 ₺; dönüşüm maliyeti = Dİ + GÜG = 79.000 ₺.",
  "adimlar": [
    "<p><strong>1. Tanımlar.</strong> İlk (asal) maliyet, mamule doğrudan yüklenebilen giderlerin toplamıdır: Direkt İlk Madde ve Malzeme + Direkt İşçilik. Dönüşüm (şekillendirme) maliyeti, hammaddeyi mamule dönüştürmenin maliyetidir: Direkt İşçilik + Genel Üretim Giderleri.</p>",
    "<p><strong>2. İlk maliyet.</strong> 107.750 + 31.000 = <strong>138.750 ₺</strong></p>",
    "<p><strong>3. Dönüşüm maliyeti.</strong> 31.000 + 48.000 = <strong>79.000 ₺</strong></p>"
  ],
  "dayanak": "Maliyet unsurlarının sınıflandırılması: ilk (asal) maliyet ve dönüşüm maliyeti tanımları.",
  "tuzaklar": {
    "B": "186.750 üç unsurun toplamıdır (toplam üretim maliyeti), dönüşüm maliyeti değil.",
    "D": "155.750 = DİMM + GÜG; bu ne ilk ne dönüşüm maliyetidir.",
    "E": "İlk maliyete GÜG eklenmiş; GÜG direkt gider değildir."
  },
  "kartlar": [
    { "on": "İlk (asal) maliyet = ?", "arka": "Direkt İlk Madde ve Malzeme + Direkt İşçilik" },
    { "on": "Dönüşüm (şekillendirme) maliyeti = ?", "arka": "Direkt İşçilik + Genel Üretim Giderleri" }
  ],
  "konuBaglantisi": "01-maliyet-kavramlari"
}
```

- [ ] **Step 4: Doğrula**

Run: `python tools/validate.py | grep MAL`
Expected: boş çıktı (diğer 15 dosya henüz yokken "soru dosyası yok" hataları normaldir).

- [ ] **Step 5: Commit**

```bash
git add app/data/questions/2026-1-MAL.json app/data/solutions/2026-1-MAL.json tools/out/review-2026-1-MAL.md
git commit -m "İçerik: 2026-1 Maliyet Muhasebesi soru ve çözümleri" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Faz C — Öğrenme çekirdeği ve soru ekranı

### Task 7: FSRS aralıklı tekrar algoritması

**Files:**
- Create: `app/js/fsrs.js`, `tests/fsrs.test.js`

**Interfaces:**
- Produces: `Rating = {AGAIN:1, HARD:2, GOOD:3, EASY:4}`; `newCard(kartId, tur, kaynakId) → card`; `review(card, rating, now, {examDate}) → card` (saf, girdiyi değiştirmez); `retrievability(card, now) → 0..1`; `intervalDays(stability) → gün`. Kart alanları spec §5.5 `cards` deposuyla aynı.

- [ ] **Step 1: Test**

`tests/fsrs.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newCard, review, Rating, intervalDays, retrievability } from '../app/js/fsrs.js';

const DAY = 86400000, now = Date.UTC(2026, 9, 2);

test('yeni kart İyi: yaklaşık 3 gün sonra', () => {
  const c = review(newCard('soru:x', 'soru', 'x'), Rating.GOOD, now);
  assert.equal(c.state, 'review');
  assert.equal(c.reps, 1);
  assert.equal(Math.round((c.due - now) / DAY), 3);
});

test('yeni kart Kolay daha uzun, Zor daha kısa', () => {
  const easy = review(newCard('a', 'soru', 'a'), Rating.EASY, now);
  const hard = review(newCard('b', 'soru', 'b'), Rating.HARD, now);
  const good = review(newCard('c', 'soru', 'c'), Rating.GOOD, now);
  assert.ok(easy.due > good.due && good.due > hard.due);
  assert.equal(Math.round((easy.due - now) / DAY), 15);
});

test('Tekrar: 10 dakika sonra, öğrenme durumunda, yeni kartta lapse yok', () => {
  const c = review(newCard('a', 'soru', 'a'), Rating.AGAIN, now);
  assert.equal(c.state, 'learning');
  assert.equal(c.due, now + 10 * 60000);
  assert.equal(c.lapses, 0);
});

test('tekrar durumundaki kartta Tekrar lapse sayar ve stabiliteyi düşürür', () => {
  const c1 = review(newCard('a', 'soru', 'a'), Rating.GOOD, now);
  const c2 = review(c1, Rating.AGAIN, now + 3 * DAY);
  assert.equal(c2.lapses, 1);
  assert.ok(c2.stability < c1.stability);
});

test('ardışık İyi cevaplar aralığı uzatır', () => {
  const c1 = review(newCard('a', 'soru', 'a'), Rating.GOOD, now);
  const c2 = review(c1, Rating.GOOD, c1.due);
  const c3 = review(c2, Rating.GOOD, c2.due);
  assert.ok(c2.due - c1.due > c1.due - now);
  assert.ok(c3.due - c2.due > c2.due - c1.due);
});

test('sınav tarihi aralığı sınırlar', () => {
  const examDate = now + 5 * DAY;
  const c = review(newCard('a', 'soru', 'a'), Rating.EASY, now, { examDate });
  assert.ok(c.due <= examDate - DAY);
  assert.ok(c.due >= now + DAY);
});

test('girdi değişmez ve hatırlama olasılığı zamanla düşer', () => {
  const c0 = newCard('a', 'soru', 'a');
  const c1 = review(c0, Rating.GOOD, now);
  assert.equal(c0.state, 'new');
  assert.ok(retrievability(c1, now + DAY) > retrievability(c1, now + 10 * DAY));
  assert.equal(intervalDays(10), 10);
});
```

Run: `npm test -- tests/fsrs.test.js`
Expected: FAIL.

- [ ] **Step 2: fsrs.js**

```js
// app/js/fsrs.js — FSRS-4.5, varsayılan parametreler
export const W = [0.4072, 1.1829, 3.1262, 15.4722, 7.2102, 0.5316, 1.0651, 0.0234, 1.616, 0.1544, 1.0824, 1.9813, 0.0953, 0.2975, 2.2042, 0.2407, 2.9466];
const DECAY = -0.5, FACTOR = 19 / 81, DESIRED_R = 0.9, DAY = 86400000;
export const Rating = { AGAIN: 1, HARD: 2, GOOD: 3, EASY: 4 };
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

export function newCard(kartId, tur, kaynakId) {
  return { kartId, tur, kaynakId, state: 'new', stability: 0, difficulty: 0, due: 0, reps: 0, lapses: 0, lastReview: 0 };
}

export function retrievability(card, now) {
  if (card.state === 'new' || !card.lastReview || card.stability <= 0) return 0;
  const t = Math.max(0, (now - card.lastReview) / DAY);
  return Math.pow(1 + FACTOR * t / card.stability, DECAY);
}

const initDifficulty = (g) => clamp(W[4] - Math.exp(W[5] * (g - 1)) + 1, 1, 10);
const nextDifficulty = (d, g) => clamp(W[7] * initDifficulty(4) + (1 - W[7]) * (d - W[6] * (g - 3)), 1, 10);
const recallStability = (d, s, r, g) =>
  s * (Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * (g === 2 ? W[15] : 1) * (g === 4 ? W[16] : 1) + 1);
const forgetStability = (d, s, r) =>
  Math.min(W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)), s);

export function intervalDays(stability, r = DESIRED_R) {
  return Math.max(1, Math.round(stability / FACTOR * (Math.pow(r, 1 / DECAY) - 1)));
}

export function review(card, rating, now, { examDate } = {}) {
  const c = { ...card };
  const r = retrievability(card, now);
  if (card.state === 'new') {
    c.stability = W[rating - 1]; c.difficulty = initDifficulty(rating);
  } else if (rating === Rating.AGAIN) {
    c.stability = forgetStability(card.difficulty, card.stability, r);
    c.difficulty = nextDifficulty(card.difficulty, rating);
    if (card.state === 'review') c.lapses++;
  } else {
    c.stability = recallStability(card.difficulty, card.stability, r, rating);
    c.difficulty = nextDifficulty(card.difficulty, rating);
  }
  c.reps++; c.lastReview = now;
  if (rating === Rating.AGAIN) { c.state = 'learning'; c.due = now + 10 * 60000; }
  else {
    c.state = 'review';
    let due = now + intervalDays(c.stability) * DAY;
    if (examDate && due > examDate - DAY) due = Math.max(now + DAY, examDate - DAY);
    c.due = due;
  }
  return c;
}
```

Run: `npm test -- tests/fsrs.test.js`
Expected: 7 PASS.

- [ ] **Step 3: Commit**

```bash
git add app/js/fsrs.js tests/fsrs.test.js
git commit -m "FSRS aralıklı tekrar algoritması" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 8: S Pen çizim bileşeni (ink.js)

**Files:**
- Create: `app/js/ink.js`, `tests/dom.js` (jsdom kurulum yardımcısı), `tests/ink.test.js`
- Modify: `app/css/components.css` (`.ink-wrap canvas { touch-action: pan-y; }` olarak değiştir)

**Interfaces:**
- Produces: `createInk({ strokes = [], onChange, height = 320 }) → { el, getStrokes(), setStrokes(strokes), undo(), redo(), clear(), setTool('pen'|'eraser'), setColor(hex), destroy() }`. Vuruş biçimi: `{ p: [[x, y, basinc], …], renk, kalinlik, silgi }` (x, y CSS piksel, canvas sol üst köşesine göre). `onChange(strokes)` her vuruş sonunda 300 ms gecikmeli çağrılır.

- [ ] **Step 1: jsdom yardımcısı**

`tests/dom.js`:

```js
import { JSDOM } from 'jsdom';
export function setupDom() {
  const dom = new JSDOM('<!doctype html><html><body><div id="view"></div></body></html>', { pretendToBeVisual: true });
  const w = dom.window;
  for (const k of ['window', 'document', 'Node', 'HTMLElement', 'Element', 'MouseEvent', 'Event', 'CustomEvent', 'requestAnimationFrame', 'getComputedStyle', 'navigator', 'location']) {
    try { globalThis[k] = w[k]; } catch {}
  }
  if (!w.PointerEvent) {
    w.PointerEvent = class PointerEvent extends w.MouseEvent {
      constructor(type, init = {}) { super(type, init); this.pointerType = init.pointerType ?? 'mouse'; this.pressure = init.pressure ?? 0.5; this.pointerId = init.pointerId ?? 1; }
    };
  }
  globalThis.PointerEvent = w.PointerEvent;
  w.HTMLCanvasElement.prototype.getContext = () => null;
  w.HTMLElement.prototype.setPointerCapture = () => {};
  w.HTMLElement.prototype.releasePointerCapture = () => {};
  return w;
}
```

- [ ] **Step 2: Test**

`tests/ink.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './dom.js';
setupDom();
const { createInk } = await import('../app/js/ink.js');

function ptr(el, type, init) {
  el.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: 10, clientY: 10, pressure: 0.6, pointerType: 'pen', ...init }));
}
function canvasOf(ink) { return ink.el.querySelector('canvas'); }

test('kalem vuruşu kaydedilir, basınç saklanır', () => {
  const ink = createInk();
  const c = canvasOf(ink);
  ptr(c, 'pointerdown'); ptr(c, 'pointermove', { clientX: 20, clientY: 15 }); ptr(c, 'pointerup', { clientX: 20, clientY: 15 });
  const s = ink.getStrokes();
  assert.equal(s.length, 1);
  assert.ok(s[0].p.length >= 2);
  assert.equal(s[0].p[0][2], 0.6);
  assert.equal(s[0].silgi, false);
});

test('parmak (touch) vuruş üretmez', () => {
  const ink = createInk();
  const c = canvasOf(ink);
  ptr(c, 'pointerdown', { pointerType: 'touch' }); ptr(c, 'pointermove', { pointerType: 'touch', clientX: 30 }); ptr(c, 'pointerup', { pointerType: 'touch' });
  assert.equal(ink.getStrokes().length, 0);
});

test('silgi aracı ve geri al/ileri al', () => {
  const ink = createInk();
  const c = canvasOf(ink);
  ptr(c, 'pointerdown'); ptr(c, 'pointerup');
  ink.setTool('eraser');
  ptr(c, 'pointerdown'); ptr(c, 'pointerup');
  assert.equal(ink.getStrokes()[1].silgi, true);
  ink.undo(); assert.equal(ink.getStrokes().length, 1);
  ink.redo(); assert.equal(ink.getStrokes().length, 2);
  ink.clear(); assert.equal(ink.getStrokes().length, 0);
  ink.undo(); assert.equal(ink.getStrokes().length, 2);
});

test('onChange gecikmeli çağrılır ve setStrokes yükler', async () => {
  let got = null;
  const ink = createInk({ onChange: (s) => { got = s; } });
  const c = canvasOf(ink);
  ptr(c, 'pointerdown'); ptr(c, 'pointerup');
  assert.equal(got, null);
  await new Promise(r => setTimeout(r, 350));
  assert.equal(got.length, 1);
  const ink2 = createInk({ strokes: got });
  assert.equal(ink2.getStrokes().length, 1);
});
```

Run: `npm test -- tests/ink.test.js`
Expected: FAIL.

- [ ] **Step 3: ink.js**

```js
// app/js/ink.js — S Pen / kalem çizim alanı
import { h } from './ui.js';

const COLORS = ['#16202a', '#1b4965', '#d62828'];

export function createInk({ strokes = [], onChange, height = 320 } = {}) {
  let list = strokes.map(s => ({ ...s, p: s.p.map(pt => [...pt]) }));
  let redoStack = [], tool = 'pen', color = COLORS[0], base = 2.2, cur = null, timer = null, undoSnapshots = [];
  const canvas = h('canvas', { height, 'aria-label': 'Çizim alanı' });
  const ctx = canvas.getContext && canvas.getContext('2d');
  const dpr = (globalThis.devicePixelRatio || 1);

  const toolBtn = (label, name, title) => h('button', { class: 'btn-icon' + (tool === name ? ' on' : ''), title, 'aria-label': title, onClick: () => setTool(name) }, label);
  const tools = h('div', { class: 'ink-tools' });
  function renderTools() {
    tools.innerHTML = '';
    tools.append(
      toolBtn('✎', 'pen', 'Kalem'), toolBtn('◻', 'eraser', 'Silgi'),
      ...COLORS.map(c => h('button', { class: 'btn-icon', 'aria-label': 'Renk ' + c, style: `color:${c}`, onClick: () => setColor(c) }, color === c ? '●' : '○')),
      h('button', { class: 'btn-icon', 'aria-label': 'Geri al', onClick: undo }, '↶'),
      h('button', { class: 'btn-icon', 'aria-label': 'İleri al', onClick: redo }, '↷'),
      h('button', { class: 'btn-icon', 'aria-label': 'Temizle', onClick: clear }, '🗑'),
    );
  }
  const el = h('div', { class: 'ink-wrap' }, tools, canvas);

  function resize() {
    const w = el.clientWidth || 360;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(height * dpr);
    canvas.style.height = height + 'px';
    redraw();
  }
  function drawStroke(s) {
    if (!ctx || s.p.length === 0) return;
    ctx.save();
    ctx.globalCompositeOperation = s.silgi ? 'destination-out' : 'source-over';
    ctx.strokeStyle = s.renk; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let i = 1; i < s.p.length; i++) {
      const [x0, y0] = s.p[i - 1], [x1, y1, pr] = s.p[i];
      ctx.lineWidth = (s.silgi ? s.kalinlik * 6 : s.kalinlik * (0.5 + pr)) * dpr;
      ctx.beginPath(); ctx.moveTo(x0 * dpr, y0 * dpr); ctx.lineTo(x1 * dpr, y1 * dpr); ctx.stroke();
    }
    if (s.p.length === 1) {
      const [x, y, pr] = s.p[0];
      ctx.fillStyle = s.renk; ctx.beginPath(); ctx.arc(x * dpr, y * dpr, s.kalinlik * (0.5 + pr) * dpr / 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  function redraw() { if (!ctx) return; ctx.clearRect(0, 0, canvas.width, canvas.height); list.forEach(drawStroke); }
  function changed() { redoStack = []; clearTimeout(timer); timer = setTimeout(() => onChange && onChange(getStrokes()), 300); }

  function pos(e) { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top, e.pressure || 0.5]; }
  function isEraser(e) { return tool === 'eraser' || e.button === 5 || (e.buttons & 32) === 32; }
  function down(e) {
    if (e.pointerType === 'touch') return;
    e.preventDefault(); canvas.setPointerCapture?.(e.pointerId);
    cur = { p: [pos(e)], renk: color, kalinlik: base, silgi: isEraser(e) };
    list.push(cur); drawStroke(cur);
  }
  function move(e) {
    if (!cur || e.pointerType === 'touch') return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of (evs.length ? evs : [e])) cur.p.push(pos(ev));
    const tail = { ...cur, p: cur.p.slice(-Math.max(2, evs.length + 1)) }; drawStroke(tail);
  }
  function up(e) { if (!cur) return; cur = null; undoSnapshots = []; changed(); }
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);

  function undo() {
    if (undoSnapshots.length) { redoStack.push(list); list = undoSnapshots.pop(); }
    else if (list.length) { redoStack.push(list); list = list.slice(0, -1); }
    else return;
    redraw(); clearTimeout(timer); timer = setTimeout(() => onChange && onChange(getStrokes()), 300);
  }
  function redo() { if (!redoStack.length) return; undoSnapshots = []; list = redoStack.pop(); redraw(); onChange && onChange(getStrokes()); }
  function clear() { if (!list.length) return; undoSnapshots.push(list); list = []; redraw(); onChange && onChange(getStrokes()); }
  function setTool(t) { tool = t; renderTools(); }
  function setColor(c) { color = c; tool = 'pen'; renderTools(); }
  function getStrokes() { return list.map(s => ({ ...s, p: s.p.map(pt => [Math.round(pt[0] * 10) / 10, Math.round(pt[1] * 10) / 10, Math.round(pt[2] * 100) / 100]) })); }
  function setStrokes(s) { list = s.map(x => ({ ...x, p: x.p.map(pt => [...pt]) })); redoStack = []; redraw(); }

  let ro = null;
  if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(resize); ro.observe(el); }
  else setTimeout(resize, 0);
  renderTools();
  return { el, getStrokes, setStrokes, undo, redo, clear, setTool, setColor, destroy() { ro?.disconnect(); clearTimeout(timer); } };
}
```

Not: `undo()` içinde `clear()` sonrası geri alma için `undoSnapshots` kullanılır; testteki "temizle sonra geri al" bu yolla 2 vuruşu geri getirir.

Run: `npm test -- tests/ink.test.js`
Expected: 4 PASS.

- [ ] **Step 4: Gerçek cihaz kontrol listesi (not olarak kaydet)**

`docs/cihaz-kontrol.md` dosyasına ekle:

```
- [ ] S Pen ile çizgi kalınlığı basınca göre değişiyor
- [ ] Avuç/parmak teması çizgi oluşturmuyor, sayfa kaydırıyor
- [ ] S Pen yan düğmesiyle silme çalışıyor
- [ ] Uygulama kapatılıp açılınca çizim geri geliyor
```

- [ ] **Step 5: Commit**

```bash
git add app/js/ink.js app/css/components.css tests/dom.js tests/ink.test.js docs/cihaz-kontrol.md
git commit -m "S Pen çizim bileşeni" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 9: Soru görünümü bileşeni (question-view.js)

**Files:**
- Create: `app/js/screens/question-view.js`, `tests/question-view.test.js`

**Interfaces:**
- Consumes: `h`, `sheet` (ui.js); `createInk` (ink.js); `dersAdi` (data.js).
- Produces: `createQuestionView(opts) → { el, reveal(), setSelected(cevap), destroy() }` where

```
opts = {
  question, solution,            // veri nesneleri (solution çalışma/tekrar modunda gerekir)
  mode: 'study' | 'exam' | 'review',
  index, total,                  // "3 / 20" göstergesi
  selected: null | 'A'..'E',     // önceden verilmiş cevap (deneme modunda geri dönünce)
  flagged: boolean,
  emin: boolean,                 // "Emin değilim" anahtarının başlangıcı (ters)
  inkStrokes, feynmanStrokes,    // kayıtlı çizimler
  onAnswer({cevap, dogruMu, emin}),   // seçim yapıldığında (exam: her seçimde, study/review: ilk seçimde)
  onFlag(bool), onTag(etiket), onCards(kartlar), onInk(strokes), onFeynman(strokes),
  onPrev(), onNext()
}
```
  - `mode === 'exam'`: seçim yalnızca `.selected` sınıfı; çözüm yok; yeniden seçilebilir.
  - `study`/`review`: ilk seçimde şıklar kilitlenir, doğru/yanlış renklenir, çözüm paneli eklenir.
  - İptal soru: "İPTAL" rozeti, şıklar kilitli, çözüm paneli yalnızca `cevapNotu` ve varsa çözümü gösterir.

- [ ] **Step 1: Test**

`tests/question-view.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './dom.js';
setupDom();
const { createQuestionView } = await import('../app/js/screens/question-view.js');

const q = { id: '2026-1-MAL-01', donem: '2026-1', ders: 'MAL', no: 1, konu: '01-maliyet-kavramlari', ortakBilgi: null,
  metin: '<p>Soru?</p>', secenekler: { A: '<p>a</p>', B: '<p>b</p>', C: '<p>c</p>', D: '<p>d</p>', E: '<p>e</p>' },
  dogru: 'C', iptal: false, cevapNotu: null, orijinal: { sayfa: 1, kutu: [0, 0, 10, 10] } };
const sol = { id: q.id, sonuc: 'C', ozet: 'Özet.', adimlar: ['<p>Adım 1</p>'], dayanak: 'D', tuzaklar: { A: 'ta', B: 'tb' }, kartlar: [{ on: 'x', arka: 'y' }], konuBaglantisi: q.konu };

function opt(view, letter) { return view.el.querySelector(`button.opt[data-letter="${letter}"]`); }

test('çalışma modunda seçim sonrası kilitlenir, renklenir, çözüm açılır', () => {
  const events = [];
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: e => events.push(e) });
  opt(v, 'A').click();
  assert.deepEqual(events, [{ cevap: 'A', dogruMu: false, emin: true }]);
  assert.ok(opt(v, 'A').classList.contains('wrong'));
  assert.ok(opt(v, 'C').classList.contains('correct'));
  assert.ok(opt(v, 'B').hasAttribute('disabled'));
  assert.ok(v.el.querySelector('.solution'));
  assert.ok(v.el.textContent.includes('Adım 1'));
  opt(v, 'B').click();
  assert.equal(events.length, 1);
});

test('emin değilim anahtarı cevaba yansır', () => {
  const events = [];
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: e => events.push(e) });
  v.el.querySelector('[data-role="emin"]').click();
  opt(v, 'C').click();
  assert.deepEqual(events, [{ cevap: 'C', dogruMu: true, emin: false }]);
});

test('deneme modunda seçim değiştirilebilir, çözüm görünmez', () => {
  const events = [];
  const v = createQuestionView({ question: q, mode: 'exam', index: 0, total: 20, onAnswer: e => events.push(e) });
  opt(v, 'A').click(); opt(v, 'B').click();
  assert.equal(events.length, 2);
  assert.ok(opt(v, 'B').classList.contains('selected'));
  assert.ok(!opt(v, 'A').classList.contains('selected'));
  assert.equal(v.el.querySelector('.solution'), null);
  assert.equal(v.el.querySelector('.opt.correct'), null);
});

test('iptal soru kilitli ve rozetli', () => {
  const v = createQuestionView({ question: { ...q, iptal: true, cevapNotu: 'İPTAL' }, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: () => {} });
  assert.ok(v.el.textContent.includes('İPTAL'));
  assert.ok(opt(v, 'A').hasAttribute('disabled'));
});

test('hata etiketi ve kart ekleme geri çağrıları', () => {
  let tag = null, cards = null;
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: () => {}, onTag: t => { tag = t; }, onCards: c => { cards = c; } });
  opt(v, 'A').click();
  v.el.querySelector('[data-tag="dikkat"]').click();
  v.el.querySelector('[data-role="cards"]').click();
  assert.equal(tag, 'dikkat');
  assert.equal(cards.length, 1);
});
```

Run: `npm test -- tests/question-view.test.js`
Expected: FAIL.

- [ ] **Step 2: question-view.js**

```js
// app/js/screens/question-view.js
import { h, sheet, toast } from '../ui.js';
import { createInk } from '../ink.js';
import { dersAdi } from '../data.js';

const TAGS = [['bilgi', 'Bilgi eksiği'], ['dikkat', 'Dikkatsizlik'], ['sure', 'Süre'], ['okuma', 'Yanlış okudum']];

export function createQuestionView(o) {
  const q = o.question, mode = o.mode;
  let selected = o.selected ?? null, locked = mode !== 'exam' && selected !== null, emin = o.emin !== false;
  let flagged = !!o.flagged;
  const inks = [];

  const head = h('div', { class: 'q-head' },
    h('span', {}, `${dersAdi(q.ders)} · ${q.donem} · Soru ${q.no}`),
    h('span', {}, `${(o.index ?? 0) + 1} / ${o.total ?? 1}`),
    h('button', { class: 'btn-icon', 'aria-label': 'Bayrak', 'data-role': 'flag', onClick: () => { flagged = !flagged; flagBtn.textContent = flagged ? '⚑' : '⚐'; o.onFlag?.(flagged); } }, flagged ? '⚑' : '⚐'));
  const flagBtn = head.querySelector('[data-role="flag"]');

  const body = h('div', { class: 'q-text' },
    q.iptal ? h('p', {}, h('span', { class: 'badge badge-err' }, 'İPTAL'), ' ', h('span', { class: 'muted' }, 'Bu soru resmi olarak iptal edilmiştir; puanlamaya girmez.')) : null,
    q.ortakBilgi ? h('div', { class: 'muted', html: q.ortakBilgi }) : null,
    h('div', { html: q.metin }));

  const optEls = {};
  const opts = h('div', {}, ...Object.entries(q.secenekler).map(([L, html]) => {
    const b = h('button', { class: 'opt', 'data-letter': L, onClick: () => choose(L) },
      h('span', { class: 'letter' }, L + ')'), h('span', { class: 'body', html }));
    optEls[L] = b; return b;
  }));

  const eminBtn = mode === 'exam' || q.iptal ? null : h('button', { class: 'chip' + (emin ? '' : ' on'), 'data-role': 'emin', onClick: () => { emin = !emin; eminBtn.classList.toggle('on', !emin); } }, 'Emin değilim');

  const solWrap = h('div');
  const foot = h('div', { class: 'q-foot' },
    h('button', { class: 'btn', onClick: () => o.onPrev?.(), disabled: !o.onPrev }, '‹ Önceki'),
    h('button', { class: 'btn', 'data-role': 'ink', onClick: openInk }, '✎ Çöz'),
    h('button', { class: 'btn btn-primary', onClick: () => o.onNext?.(), disabled: !o.onNext }, 'Sonraki ›'));

  const el = h('div', { class: 'question' }, head, body, opts, eminBtn ? h('div', { class: 'row', style: 'margin-bottom:10px' }, eminBtn) : null, solWrap, foot);

  function paint() {
    for (const [L, b] of Object.entries(optEls)) {
      b.classList.toggle('selected', mode === 'exam' && selected === L);
      if (locked || q.iptal) b.setAttribute('disabled', ''); else b.removeAttribute('disabled');
      if (locked) { b.classList.toggle('correct', L === q.dogru); b.classList.toggle('wrong', L === selected && L !== q.dogru); }
    }
  }
  function choose(L) {
    if (q.iptal || (locked && mode !== 'exam')) return;
    selected = L;
    if (mode === 'exam') { o.onAnswer?.({ cevap: L, dogruMu: L === q.dogru, emin: true }); paint(); return; }
    locked = true; paint();
    o.onAnswer?.({ cevap: L, dogruMu: L === q.dogru, emin });
    showSolution();
  }
  function showSolution() {
    const s = o.solution; solWrap.innerHTML = '';
    const wrong = selected !== null && selected !== q.dogru;
    const panel = h('div', { class: 'solution' },
      q.cevapNotu ? h('p', { class: 'badge' }, q.cevapNotu) : null,
      h('p', {}, h('strong', {}, `Doğru cevap: ${q.dogru}`), s ? ' — ' + s.ozet : ''),
      s ? h('div', {}, ...s.adimlar.map(a => h('div', { class: 'step', html: a }))) : h('p', { class: 'muted' }, 'Bu soru için çözüm henüz eklenmedi.'),
      s?.dayanak ? h('p', { class: 'muted' }, 'Dayanak: ' + s.dayanak) : null,
      s && Object.keys(s.tuzaklar || {}).length ? h('div', {}, h('h2', {}, 'Tuzak şıklar'), h('ul', {}, ...Object.entries(s.tuzaklar).map(([L, t]) => h('li', {}, h('strong', {}, L + ') '), t)))) : null,
      wrong ? h('div', {}, h('h2', {}, 'Neden yanlış yaptım?'), h('div', { class: 'row' }, ...TAGS.map(([k, label]) => h('button', { class: 'chip', 'data-tag': k, onClick: (e) => { panel.querySelectorAll('[data-tag]').forEach(c => c.classList.remove('on')); e.currentTarget.classList.add('on'); o.onTag?.(k); } }, label)))) : null,
      h('div', { class: 'row', style: 'margin-top:10px' },
        s?.kartlar?.length ? h('button', { class: 'btn btn-small', 'data-role': 'cards', onClick: () => { o.onCards?.(s.kartlar); toast('Kartlar tekrar kuyruğuna eklendi.'); } }, `Kartları ekle (${s.kartlar.length})`) : null,
        h('button', { class: 'btn btn-small', 'data-role': 'original', onClick: showOriginal }, 'Orijinali göster'),
        h('button', { class: 'btn btn-small', 'data-role': 'feynman', onClick: openFeynman }, 'Kendi cümlenle anlat')));
    solWrap.append(panel);
  }
  function showOriginal() {
    const src = `img/originals/${q.donem}-${q.ders}-p${q.orijinal?.sayfa ?? 1}.png`;
    const img = h('img', { src, alt: 'Orijinal kitapçık sayfası', style: 'width:100%;height:auto' });
    const s = sheet({ title: `Orijinal sayfa ${q.orijinal?.sayfa ?? ''}`, content: img, full: true });
    if (q.orijinal?.kutu) img.addEventListener('load', () => { const scale = img.clientWidth / img.naturalWidth; s.el.querySelector('.sheet-body').scrollTop = Math.max(0, q.orijinal.kutu[1] * scale - 40); });
  }
  function openInk() {
    const ink = createInk({ strokes: o.inkStrokes || [], height: Math.round((globalThis.innerHeight || 800) * 0.6), onChange: (s) => { o.inkStrokes = s; o.onInk?.(s); } });
    inks.push(ink);
    sheet({ title: 'Çözüm alanı', content: ink.el });
  }
  function openFeynman() {
    const ink = createInk({ strokes: o.feynmanStrokes || [], height: 300, onChange: (s) => { o.feynmanStrokes = s; o.onFeynman?.(s); } });
    inks.push(ink);
    sheet({ title: 'Kendi cümlenle anlat', content: h('div', {}, h('p', { class: 'muted' }, 'Çözümü okuduktan sonra, kuralı birine öğretir gibi kendi sözlerinle yaz.'), ink.el) });
  }

  paint();
  if (locked && mode !== 'exam') showSolution();
  if (q.iptal && mode !== 'exam') showSolution();
  return { el, reveal() { locked = true; paint(); showSolution(); }, setSelected(L) { selected = L; paint(); }, destroy() { inks.forEach(i => i.destroy()); } };
}
```

Run: `npm test -- tests/question-view.test.js`
Expected: 5 PASS.

- [ ] **Step 3: Commit**

```bash
git add app/js/screens/question-view.js tests/question-view.test.js
git commit -m "Soru görünümü bileşeni" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 10: Çalış ekranı (study.js)

**Files:**
- Create: `app/js/screens/study.js`, `app/js/progress.js`, `tests/progress.test.js`

**Interfaces:**
- `progress.js` (saf yardımcılar, ekranlar ortak kullanır):
  - `kartIdSoru(soruId) → 'soru:' + soruId`; `kartIdBilgi(kaynakId, i) → 'bilgi:' + kaynakId + ':' + i`
  - `recordAnswer({db, fsrs, question, cevap, dogruMu, emin, sure, mod, denemeId, now, examDate}) → Promise<card>`: cevabı `db.addAnswer` ile yazar; soru kartını okur/oluşturur ve `fsrs.review` ile derecelendirir (yanlış veya emin değil → AGAIN; doğru ve emin → GOOD), `db.saveCard` ile kaydeder; iptal soruda kart oluşturmaz.
  - `addInfoCards({db, fsrs, kaynakId, kartlar, now}) → Promise<number>`: her bilgi kartı için yoksa `newCard` + `review(GOOD)`; eklenen sayıyı döner.
  - `lastAnswerMap(answers) → Map<soruId, {dogruMu, tarih}>` (her soru için en son cevap).
- `study.js`: `render(view, params, ctx)`; `params.id` verilirse o soru açılır (tek soruluk liste, konu modülünden gelir); yoksa filtre paneli ve liste. Konum `settings['study:state'] = {filtre, ids, idx}` olarak saklanır.

- [ ] **Step 1: progress testi**

`tests/progress.test.js`:

```js
import 'fake-indexeddb/auto';
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import * as db from '../app/js/db.js';
import * as fsrs from '../app/js/fsrs.js';
import { recordAnswer, addInfoCards, lastAnswerMap, kartIdSoru } from '../app/js/progress.js';

const q = { id: '2026-1-MAL-01', dogru: 'C', iptal: false };
const now = Date.UTC(2026, 9, 2);
beforeEach(async () => { await db.open(new IDBFactory()); });

test('yanlış cevap kartı Tekrar ile oluşturur', async () => {
  const card = await recordAnswer({ db, fsrs, question: q, cevap: 'A', dogruMu: false, emin: true, sure: 5000, mod: 'study', now });
  assert.equal(card.kartId, kartIdSoru(q.id));
  assert.equal(card.state, 'learning');
  assert.equal((await db.answersFor(q.id)).length, 1);
});

test('doğru ve emin cevap kartı İyi ile oluşturur; emin değilse Tekrar', async () => {
  const c1 = await recordAnswer({ db, fsrs, question: q, cevap: 'C', dogruMu: true, emin: true, sure: 1, mod: 'study', now });
  assert.equal(c1.state, 'review');
  const c2 = await recordAnswer({ db, fsrs, question: { ...q, id: 'x' }, cevap: 'C', dogruMu: true, emin: false, sure: 1, mod: 'study', now });
  assert.equal(c2.state, 'learning');
});

test('iptal soruda kart oluşmaz ama cevap yazılır', async () => {
  const c = await recordAnswer({ db, fsrs, question: { ...q, iptal: true }, cevap: 'A', dogruMu: false, emin: true, sure: 1, mod: 'study', now });
  assert.equal(c, null);
  assert.equal((await db.allAnswers()).length, 1);
});

test('bilgi kartları bir kez eklenir', async () => {
  const kartlar = [{ on: 'a', arka: 'b' }, { on: 'c', arka: 'd' }];
  assert.equal(await addInfoCards({ db, fsrs, kaynakId: q.id, kartlar, now }), 2);
  assert.equal(await addInfoCards({ db, fsrs, kaynakId: q.id, kartlar, now }), 0);
  assert.equal((await db.allCards()).length, 2);
});

test('son cevap haritası', () => {
  const m = lastAnswerMap([{ soruId: 'a', dogruMu: false, tarih: 1 }, { soruId: 'a', dogruMu: true, tarih: 2 }, { soruId: 'b', dogruMu: false, tarih: 1 }]);
  assert.equal(m.get('a').dogruMu, true);
  assert.equal(m.get('b').dogruMu, false);
});
```

Run: `npm test -- tests/progress.test.js`
Expected: FAIL.

- [ ] **Step 2: progress.js**

```js
// app/js/progress.js
export const kartIdSoru = (soruId) => 'soru:' + soruId;
export const kartIdBilgi = (kaynakId, i) => `bilgi:${kaynakId}:${i}`;

export async function recordAnswer({ db, fsrs, question, cevap, dogruMu, emin, sure, mod, denemeId, now = Date.now(), examDate }) {
  await db.addAnswer({ soruId: question.id, cevap, dogruMu, emin, sure, mod, denemeId: denemeId ?? null });
  if (question.iptal) return null;
  const id = kartIdSoru(question.id);
  const card = (await db.getCard(id)) || fsrs.newCard(id, 'soru', question.id);
  const rating = dogruMu && emin ? fsrs.Rating.GOOD : fsrs.Rating.AGAIN;
  const next = fsrs.review(card, rating, now, { examDate });
  await db.saveCard(next);
  return next;
}

export async function addInfoCards({ db, fsrs, kaynakId, kartlar, now = Date.now(), examDate }) {
  let n = 0;
  for (let i = 0; i < kartlar.length; i++) {
    const id = kartIdBilgi(kaynakId, i);
    if (await db.getCard(id)) continue;
    const card = fsrs.review(fsrs.newCard(id, 'bilgi', kaynakId), fsrs.Rating.GOOD, now, { examDate });
    card.on = kartlar[i].on; card.arka = kartlar[i].arka;
    await db.saveCard(card); n++;
  }
  return n;
}

export function lastAnswerMap(answers) {
  const m = new Map();
  for (const a of answers) { const p = m.get(a.soruId); if (!p || a.tarih > p.tarih) m.set(a.soruId, a); }
  return m;
}

export async function examDateMs(db) {
  const s = await db.getSetting('sinavTarihi', '2026-11-28');
  return new Date(s + 'T09:00:00').getTime();
}
```

Run: `npm test -- tests/progress.test.js`
Expected: 5 PASS.

- [ ] **Step 3: study.js**

```js
// app/js/screens/study.js
import { h, toast } from '../ui.js';
import { createQuestionView } from './question-view.js';
import * as fsrs from '../fsrs.js';
import { recordAnswer, addInfoCards, lastAnswerMap, examDateMs } from '../progress.js';
import { DERSLER, DONEMLER } from '../data.js';

let qv = null;
export function destroy() { qv?.destroy(); qv = null; }

export async function render(view, params, ctx) {
  const { db, data } = ctx;
  if (params.id) { return showList(view, ctx, [params.id], 0, null); }
  const saved = await db.getSetting('study:state', null);
  if (saved?.ids?.length && saved.idx < saved.ids.length && !params.yeni) {
    view.append(h('div', { class: 'card' },
      h('h3', {}, 'Kaldığın yerden devam'),
      h('p', { class: 'muted' }, `${saved.idx + 1} / ${saved.ids.length} soru`),
      h('div', { class: 'row' },
        h('button', { class: 'btn btn-primary', onClick: () => { view.innerHTML = ''; showList(view, ctx, saved.ids, saved.idx, saved.filtre); } }, 'Devam et'),
        h('button', { class: 'btn', onClick: () => { view.innerHTML = ''; showFilters(view, ctx); } }, 'Yeni liste'))));
    return;
  }
  showFilters(view, ctx);
}

async function showFilters(view, ctx) {
  const { db, data } = ctx;
  const f = (await db.getSetting('study:filtre', null)) || { dersler: [], donemler: [], kapsam: 'hepsi', sira: 'karisik' };
  const chip = (label, on, cb) => h('button', { class: 'chip' + (on ? ' on' : ''), onClick: (e) => { cb(); e.currentTarget.classList.toggle('on'); } }, label);
  const toggle = (arr, v) => { const i = arr.indexOf(v); i >= 0 ? arr.splice(i, 1) : arr.push(v); };
  const kapsamSel = h('select', {}, ...[['hepsi', 'Tüm sorular'], ['gorulmemis', 'Sadece görülmemişler'], ['yanlis', 'Sadece yanlış yaptıklarım'], ['bayrak', 'Sadece bayraklılar']].map(([v, t]) => h('option', { value: v, selected: f.kapsam === v }, t)));
  const siraSel = h('select', {}, h('option', { value: 'karisik', selected: f.sira === 'karisik' }, 'Karışık'), h('option', { value: 'sirali', selected: f.sira === 'sirali' }, 'Sıralı'));
  view.append(
    h('h1', {}, 'Çalış'),
    h('div', { class: 'card' }, h('h3', {}, 'Dersler'), h('p', { class: 'muted' }, 'Hiçbiri seçili değilse tüm dersler.'),
      h('div', { class: 'row' }, ...DERSLER.map(d => chip(d.ad, f.dersler.includes(d.kod), () => toggle(f.dersler, d.kod))))),
    h('div', { class: 'card' }, h('h3', {}, 'Dönem'), h('div', { class: 'row' }, ...DONEMLER.map(d => chip(d, f.donemler.includes(d), () => toggle(f.donemler, d))))),
    h('div', { class: 'card' }, h('label', { class: 'field' }, 'Kapsam', kapsamSel), h('label', { class: 'field' }, 'Sıra', siraSel)),
    h('button', { class: 'btn btn-primary btn-block', onClick: start }, 'Başla'));

  async function start() {
    f.kapsam = kapsamSel.value; f.sira = siraSel.value;
    await db.setSetting('study:filtre', f);
    let qs = await data.filterQuestions({ dersler: f.dersler, donemler: f.donemler, iptalHaric: false });
    const last = lastAnswerMap(await db.allAnswers());
    if (f.kapsam === 'gorulmemis') qs = qs.filter(q => !last.has(q.id));
    if (f.kapsam === 'yanlis') qs = qs.filter(q => last.get(q.id)?.dogruMu === false);
    if (f.kapsam === 'bayrak') { const flags = new Set((await db.allFlags()).filter(x => x.bayrak).map(x => x.soruId)); qs = qs.filter(q => flags.has(q.id)); }
    if (!qs.length) { toast('Bu filtreyle soru bulunamadı.'); return; }
    let ids = qs.map(q => q.id);
    if (f.sira === 'karisik') for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    view.innerHTML = '';
    showList(view, ctx, ids, 0, f);
  }
}

async function showList(view, ctx, ids, idx, filtre) {
  const { db, data } = ctx;
  const examDate = await examDateMs(db);
  let startedAt = Date.now();

  async function show(i) {
    qv?.destroy(); view.innerHTML = ''; startedAt = Date.now();
    await db.setSetting('study:state', { ids, idx: i, filtre });
    const q = await data.getQuestion(ids[i]);
    if (!q) { view.append(h('p', { class: 'card' }, 'Soru bulunamadı.')); return; }
    const sol = await data.getSolution(q.id);
    const flag = await db.getFlag(q.id);
    const inkStrokes = await db.getInk('soru:' + q.id), feynmanStrokes = await db.getInk('feynman:' + q.id);
    qv = createQuestionView({
      question: q, solution: sol, mode: 'study', index: i, total: ids.length, flagged: !!flag?.bayrak, inkStrokes, feynmanStrokes,
      onAnswer: ({ cevap, dogruMu, emin }) => recordAnswer({ db, fsrs, question: q, cevap, dogruMu, emin, sure: Date.now() - startedAt, mod: 'study', examDate }),
      onFlag: (b) => db.setFlag(q.id, { bayrak: b }),
      onTag: async (t) => { const list = await db.answersFor(q.id); const a = list.sort((x, y) => y.tarih - x.tarih)[0]; if (a) { a.hataEtiketi = t; await db.put('answers', a); } },
      onCards: (kartlar) => addInfoCards({ db, fsrs, kaynakId: q.id, kartlar, examDate }),
      onInk: (s) => db.saveInk('soru:' + q.id, s),
      onFeynman: (s) => db.saveInk('feynman:' + q.id, s),
      onPrev: i > 0 ? () => show(i - 1) : null,
      onNext: i < ids.length - 1 ? () => show(i + 1) : () => { toast('Liste bitti.'); db.setSetting('study:state', null); ctx.navigate('#/study'); },
    });
    view.append(qv.el);
  }
  await show(idx);
}
```

- [ ] **Step 4: Tarayıcı duman testi**

Run: `npm run serve`; `#/study` aç.
Expected: filtre kartları, "Başla" ile 2026-1 Maliyet soruları gelir (Task 6 verisi), şık seçince çözüm paneli açılır, "✎ Çöz" alt panelde çizim alanı açar, "Orijinali göster" sayfa görüntüsünü açar, "Sonraki" ilerler, sekmeden çıkıp dönünce "Kaldığın yerden devam" görünür.

- [ ] **Step 5: Commit**

```bash
git add app/js/screens/study.js app/js/progress.js tests/progress.test.js
git commit -m "Çalış ekranı ve ilerleme kaydı" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Faz D — Tekrar, plan, ana sayfa

### Task 11: Günlük planlayıcı ve Ana Sayfa

**Files:**
- Create: `app/js/planner.js`, `tests/planner.test.js`, `app/js/screens/home.js` (geçiciyi değiştir)

**Interfaces:**
- `sinavaKalanGun(now, examDate) → tam sayı` (gün, yukarı yuvarlanır; sınav günü 0, geçmişse negatif).
- `gunlukPlan({ hedefSaat, vadesiGelen, sinavaKalanGun, dersIstatistik }) → { tekrarKotasi, yeniSoruHedefi, oneriDers, mesaj }`; `dersIstatistik = [{ kod, gorulen, toplam, dogruluk }]` (`dogruluk` 0..1 veya `null`).
- `dersIstatistikleri(questions, answers) → dersIstatistik[]` (saf; `lastAnswerMap` kullanır).
- `dailyCounter(prev, today) → {tarih, sayac}` (gün değişince sıfırlar); `todayKey(now) → 'YYYY-MM-DD'`.

- [ ] **Step 1: Test**

`tests/planner.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gunlukPlan, sinavaKalanGun, dersIstatistikleri, dailyCounter } from '../app/js/planner.js';

const DAY = 86400000;

test('kalan gün hesabı', () => {
  const exam = Date.UTC(2026, 10, 28, 9);
  assert.equal(sinavaKalanGun(Date.UTC(2026, 9, 2, 12), exam), 57);
  assert.equal(sinavaKalanGun(exam - 1000, exam), 1);
  assert.equal(sinavaKalanGun(exam + 1000, exam), 0);
  assert.equal(sinavaKalanGun(exam + 2 * DAY, exam), -2);
});

test('normal gün: kota ve yeni soru hedefi', () => {
  const p = gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 12, sinavaKalanGun: 40, dersIstatistik: [] });
  assert.equal(p.tekrarKotasi, 12);
  assert.equal(p.yeniSoruHedefi, 20);
  assert.ok(p.mesaj.includes('12 tekrar'));
});

test('kota 40 ile sınırlı, 1 saatte daha az', () => {
  assert.equal(gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 90, sinavaKalanGun: 40, dersIstatistik: [] }).tekrarKotasi, 38);
  assert.equal(gunlukPlan({ hedefSaat: 2, vadesiGelen: 90, sinavaKalanGun: 40, dersIstatistik: [] }).tekrarKotasi, 40);
  assert.equal(gunlukPlan({ hedefSaat: 1, vadesiGelen: 90, sinavaKalanGun: 40, dersIstatistik: [] }).yeniSoruHedefi, 13);
});

test('son 10 gün yeni soru azalır, son 7 gün tam oturum önerisi', () => {
  const p = gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 0, sinavaKalanGun: 5, dersIstatistik: [] });
  assert.equal(p.yeniSoruHedefi, 10);
  assert.ok(p.mesaj.includes('tam oturum'));
});

test('sınav günü ve sonrası çökmez', () => {
  const p0 = gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 30, sinavaKalanGun: 0, dersIstatistik: [] });
  assert.equal(p0.tekrarKotasi, 0); assert.equal(p0.yeniSoruHedefi, 0); assert.ok(p0.mesaj.includes('Sınav günü'));
  const p1 = gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 30, sinavaKalanGun: -3, dersIstatistik: [] });
  assert.equal(p1.tekrarKotasi, 0);
});

test('öneri dersi: en düşük doğruluk, eşitlikte en az görülen; görülmemiş ders önce', () => {
  const st = [{ kod: 'FM', gorulen: 10, toplam: 40, dogruluk: 0.8 }, { kod: 'MAL', gorulen: 5, toplam: 40, dogruluk: 0.5 }, { kod: 'HUK', gorulen: 0, toplam: 40, dogruluk: null }];
  assert.equal(gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 0, sinavaKalanGun: 30, dersIstatistik: st }).oneriDers, 'HUK');
  assert.equal(gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 0, sinavaKalanGun: 30, dersIstatistik: st.slice(0, 2) }).oneriDers, 'MAL');
});

test('günlük sayaç gün değişince sıfırlanır', () => {
  assert.deepEqual(dailyCounter({ tarih: '2026-10-01', sayac: 7 }, '2026-10-02'), { tarih: '2026-10-02', sayac: 0 });
  assert.deepEqual(dailyCounter({ tarih: '2026-10-02', sayac: 7 }, '2026-10-02'), { tarih: '2026-10-02', sayac: 7 });
  assert.deepEqual(dailyCounter(null, '2026-10-02'), { tarih: '2026-10-02', sayac: 0 });
});

test('ders istatistikleri son cevaba göre', () => {
  const qs = [{ id: 'a', ders: 'FM', iptal: false }, { id: 'b', ders: 'FM', iptal: false }, { id: 'c', ders: 'MAL', iptal: false }, { id: 'd', ders: 'MAL', iptal: true }];
  const ans = [{ soruId: 'a', dogruMu: false, tarih: 1 }, { soruId: 'a', dogruMu: true, tarih: 2 }, { soruId: 'b', dogruMu: false, tarih: 1 }];
  const st = dersIstatistikleri(qs, ans);
  assert.deepEqual(st.find(s => s.kod === 'FM'), { kod: 'FM', gorulen: 2, toplam: 2, dogruluk: 0.5 });
  assert.deepEqual(st.find(s => s.kod === 'MAL'), { kod: 'MAL', gorulen: 0, toplam: 1, dogruluk: null });
});
```

Run: `npm test -- tests/planner.test.js`
Expected: FAIL.

- [ ] **Step 2: planner.js**

```js
// app/js/planner.js
import { DERSLER } from './data.js';
import { lastAnswerMap } from './progress.js';
const DAY = 86400000;

export function sinavaKalanGun(now, examDate) {
  const diff = examDate - now;
  if (diff <= 0) return -Math.floor(-diff / DAY) || 0;
  return Math.ceil(diff / DAY);
}

export function dailyCounter(prev, today) {
  return prev && prev.tarih === today ? { ...prev } : { tarih: today, sayac: 0 };
}
export const todayKey = (now = Date.now()) => new Date(now).toISOString().slice(0, 10);

export function gunlukPlan({ hedefSaat = 1.5, vadesiGelen = 0, sinavaKalanGun: gun = 60, dersIstatistik = [] }) {
  const sorted = [...dersIstatistik].sort((a, b) => {
    const da = a.dogruluk ?? -1, db_ = b.dogruluk ?? -1;
    return da - db_ || a.gorulen - b.gorulen;
  });
  const oneriDers = sorted[0]?.kod ?? null;
  if (gun <= 0) return { tekrarKotasi: 0, yeniSoruHedefi: 0, oneriDers, mesaj: gun === 0 ? 'Sınav günü. Başarılar!' : 'Sınav tarihi geçti; Ayarlar’dan yeni tarih gir.' };
  const tekrarKotasi = Math.min(40, vadesiGelen, Math.round(hedefSaat * 25));
  const taban = gun <= 10 ? 10 : 20;
  const yeniSoruHedefi = Math.max(5, Math.round(taban * hedefSaat / 1.5));
  let mesaj;
  if (gun <= 7) mesaj = `Sınava ${gun} gün kaldı: bugün tam oturum denemesi yap, yanlışlarını tekrar et.`;
  else if (vadesiGelen > tekrarKotasi) mesaj = `Tekrar kuyruğu birikti (${vadesiGelen}); bugün ${tekrarKotasi} tekrar, sonra ${yeniSoruHedefi} yeni soru.`;
  else mesaj = `Bugün: ${tekrarKotasi} tekrar, ${yeniSoruHedefi} yeni soru.`;
  return { tekrarKotasi, yeniSoruHedefi, oneriDers, mesaj };
}

export function dersIstatistikleri(questions, answers) {
  const last = lastAnswerMap(answers);
  return DERSLER.filter(d => questions.some(q => q.ders === d.kod)).map(d => {
    const qs = questions.filter(q => q.ders === d.kod && !q.iptal);
    const seen = qs.filter(q => last.has(q.id));
    const dogru = seen.filter(q => last.get(q.id).dogruMu).length;
    return { kod: d.kod, gorulen: seen.length, toplam: qs.length, dogruluk: seen.length ? dogru / seen.length : null };
  });
}
```

Run: `npm test -- tests/planner.test.js`
Expected: 8 PASS.

- [ ] **Step 3: home.js**

```js
// app/js/screens/home.js
import { h } from '../ui.js';
import { dersAdi } from '../data.js';
import { gunlukPlan, sinavaKalanGun, dersIstatistikleri, dailyCounter, todayKey } from '../planner.js';
import { examDateMs } from '../progress.js';

export async function render(view, params, ctx) {
  const { db, data } = ctx;
  const now = Date.now(), examDate = await examDateMs(db);
  const gun = sinavaKalanGun(now, examDate);
  const questions = await data.loadAllQuestions();
  const answers = await db.allAnswers();
  const cards = await db.allCards();
  const st = dersIstatistikleri(questions, answers);
  const plan = gunlukPlan({ hedefSaat: await db.getSetting('hedefSaat', 1.5), vadesiGelen: cards.filter(c => c.state !== 'new' && c.due <= now).length, sinavaKalanGun: gun, dersIstatistik: st });
  const counter = dailyCounter(await db.getSetting('review:gun', null), todayKey(now));
  const bugunYeni = answers.filter(a => a.mod === 'study' && todayKey(a.tarih) === todayKey(now)).length;
  const saved = await db.getSetting('study:state', null);
  const unfinished = (await db.allExams()).find(e => !e.bittiMi);

  view.append(
    h('div', { class: 'card', style: 'text-align:center' },
      h('div', { class: 'muted' }, 'SMMM Yeterlilik Sınavı · 28 Kasım 2026'),
      h('div', { style: 'font-size:2.4em;font-weight:700' }, gun > 0 ? `${gun} gün` : gun === 0 ? 'Bugün' : 'Geçti'),
      h('p', {}, plan.mesaj)),
    unfinished ? h('a', { class: 'btn btn-primary btn-block', href: '#/exam/run/' + unfinished.denemeId }, 'Yarım kalan denemeye devam et') : null,
    h('div', { class: 'card' }, h('h3', {}, 'Bugünkü plan'),
      bar('Tekrar', counter.sayac, plan.tekrarKotasi), bar('Yeni soru', bugunYeni, plan.yeniSoruHedefi),
      h('div', { class: 'row', style: 'margin-top:10px' },
        h('a', { class: 'btn', href: '#/review' }, 'Tekrara git'),
        h('a', { class: 'btn btn-primary', href: saved?.ids?.length ? '#/study' : '#/study' }, saved?.ids?.length ? 'Devam et' : 'Çalışmaya başla'),
        plan.oneriDers ? h('span', { class: 'muted' }, 'Öneri: ' + dersAdi(plan.oneriDers)) : null)),
    h('div', { class: 'card' }, h('h3', {}, 'Ders bazında hazırlık'),
      ...st.map(s => { const oran = s.toplam ? (s.gorulen / s.toplam) * (s.dogruluk ?? 0) : 0; return h('div', { style: 'margin-bottom:8px' }, h('div', { class: 'row', style: 'justify-content:space-between' }, h('span', {}, dersAdi(s.kod)), h('span', { class: 'muted' }, `${s.gorulen}/${s.toplam} · ${s.dogruluk === null ? '—' : Math.round(s.dogruluk * 100) + '%'}`)), h('div', { class: 'bar' }, h('span', { style: `width:${Math.round(oran * 100)}%` }))); })));

  function bar(label, val, max) {
    const pct = max ? Math.min(100, Math.round(val / max * 100)) : 0;
    return h('div', { style: 'margin-bottom:8px' }, h('div', { class: 'row', style: 'justify-content:space-between' }, h('span', {}, label), h('span', { class: 'muted' }, `${val} / ${max}`)), h('div', { class: 'bar' }, h('span', { style: `width:${pct}%` })));
  }
}
```

- [ ] **Step 4: Tarayıcı duman testi**

Expected: Ana sayfada kalan gün (bugün için 57), plan mesajı, ders çubukları (yalnızca veri olan dersler), "Çalışmaya başla".

- [ ] **Step 5: Commit**

```bash
git add app/js/planner.js tests/planner.test.js app/js/screens/home.js
git commit -m "Günlük planlayıcı ve ana sayfa" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 12: Tekrar ekranı (review.js)

**Files:**
- Create: `app/js/screens/review.js`, `app/js/reviewqueue.js`, `tests/reviewqueue.test.js`
- Depends on: Task 11 (`planner.js`)

**Interfaces:**
- `reviewqueue.js` (saf): `buildQueue(cards, now, { kota, erken = false }) → card[]`: `due ≤ now` (erken ise `due ≤ now + 3 gün`) ve `state !== 'new'` kartlar, `due` artan sırada, en fazla `kota`.
- Consumes: `gunlukPlan`, `sinavaKalanGun`, `dailyCounter`, `todayKey` (Task 11 `planner.js`).
- `review.js`: `render(view, params, ctx)`.

- [ ] **Step 1: Test**

`tests/reviewqueue.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildQueue } from '../app/js/reviewqueue.js';

const DAY = 86400000, now = 1000 * DAY;
const c = (id, due, state = 'review') => ({ kartId: id, due, state });

test('vadesi gelenler sıralı ve kotalı', () => {
  const q = buildQueue([c('a', now - 1), c('b', now - 5), c('c', now + 1), c('d', 0, 'new')], now, { kota: 1 });
  assert.deepEqual(q.map(x => x.kartId), ['b']);
  assert.equal(buildQueue([c('a', now - 1), c('b', now - 5)], now, { kota: 10 }).length, 2);
});

test('erken tekrar 3 gün ileriyi alır', () => {
  const q = buildQueue([c('a', now + 2 * DAY), c('b', now + 4 * DAY)], now, { kota: 10, erken: true });
  assert.deepEqual(q.map(x => x.kartId), ['a']);
});
```

Run: `npm test -- tests/reviewqueue.test.js`
Expected: FAIL.

- [ ] **Step 2: reviewqueue.js**

```js
// app/js/reviewqueue.js
const DAY = 86400000;
export function buildQueue(cards, now, { kota = 40, erken = false } = {}) {
  const limit = erken ? now + 3 * DAY : now;
  return cards.filter(c => c.state !== 'new' && c.due <= limit).sort((a, b) => a.due - b.due).slice(0, kota);
}
```

Run: `npm test -- tests/reviewqueue.test.js`
Expected: 2 PASS.

- [ ] **Step 3: review.js**

```js
// app/js/screens/review.js
import { h, toast } from '../ui.js';
import { createQuestionView } from './question-view.js';
import * as fsrs from '../fsrs.js';
import { buildQueue } from '../reviewqueue.js';
import { examDateMs } from '../progress.js';
import { gunlukPlan, sinavaKalanGun, dailyCounter, todayKey } from '../planner.js';

let qv = null;
export function destroy() { qv?.destroy(); qv = null; }

export async function render(view, params, ctx) {
  const { db, data } = ctx;
  const now = Date.now(), examDate = await examDateMs(db);
  const hedefSaat = await db.getSetting('hedefSaat', 1.5);
  const cards = await db.allCards();
  const counter = dailyCounter(await db.getSetting('review:gun', null), todayKey(now));
  const plan = gunlukPlan({ hedefSaat, vadesiGelen: cards.filter(c => c.state !== 'new' && c.due <= now).length, sinavaKalanGun: sinavaKalanGun(now, examDate), dersIstatistik: [] });
  const kalan = Math.max(0, plan.tekrarKotasi - counter.sayac);
  let queue = buildQueue(cards, now, { kota: kalan || 0 });

  if (!queue.length) {
    const erken = buildQueue(cards, now, { kota: 20, erken: true });
    view.append(h('h1', {}, 'Tekrar'),
      h('div', { class: 'card' }, h('h3', {}, kalan === 0 && counter.sayac > 0 ? 'Günlük tekrar hedefi tamam.' : 'Vadesi gelen kart yok.'),
        h('p', { class: 'muted' }, `Bugün ${counter.sayac} kart tekrar ettin.`),
        erken.length ? h('button', { class: 'btn', onClick: () => { view.innerHTML = ''; run(erken); } }, `Erken tekrar (${erken.length})`) : null));
    return;
  }
  run(queue);

  async function run(list) {
    let i = 0;
    async function rate(card, rating) {
      await db.saveCard(fsrs.review(card, rating, Date.now(), { examDate }));
      const c = dailyCounter(await db.getSetting('review:gun', null), todayKey()); c.sayac++; await db.setSetting('review:gun', c);
      i++; show();
    }
    const ratingRow = (card) => h('div', { class: 'row', style: 'margin-top:12px' },
      ...[[1, 'Tekrar'], [2, 'Zor'], [3, 'İyi'], [4, 'Kolay']].map(([r, t]) => h('button', { class: 'btn' + (r === 3 ? ' btn-primary' : ''), style: 'flex:1', onClick: () => rate(card, r) }, t)));
    async function show() {
      qv?.destroy(); view.innerHTML = '';
      if (i >= list.length) { view.append(h('div', { class: 'card' }, h('h3', {}, 'Tekrar bitti.'), h('a', { class: 'btn btn-primary', href: '#/' }, 'Ana sayfa'))); return; }
      const card = list[i];
      view.append(h('div', { class: 'q-head' }, h('span', {}, 'Tekrar'), h('span', {}, `${i + 1} / ${list.length}`)));
      if (card.tur === 'soru') {
        const q = await data.getQuestion(card.kaynakId);
        if (!q) { i++; return show(); }
        const sol = await data.getSolution(q.id);
        const holder = h('div');
        qv = createQuestionView({ question: q, solution: sol, mode: 'review', index: i, total: list.length,
          inkStrokes: await db.getInk('soru:' + q.id), feynmanStrokes: await db.getInk('feynman:' + q.id),
          onAnswer: async ({ cevap, dogruMu, emin }) => { await db.addAnswer({ soruId: q.id, cevap, dogruMu, emin, sure: 0, mod: 'review' }); holder.append(h('p', { class: 'muted' }, dogruMu ? 'Doğru. Ne kadar kolaydı?' : 'Yanlış. Çözümü oku, sonra derecelendir.'), ratingRow(card)); },
          onInk: (s) => db.saveInk('soru:' + q.id, s), onFeynman: (s) => db.saveInk('feynman:' + q.id, s) });
        view.append(qv.el, holder);
      } else {
        const back = h('div', { class: 'card', hidden: true }, h('p', {}, card.arka), ratingRow(card));
        view.append(h('div', { class: 'card' }, h('p', { class: 'muted' }, 'Bilgi kartı'), h('p', {}, h('strong', {}, card.on)),
          h('button', { class: 'btn btn-primary', onClick: (e) => { back.hidden = false; e.currentTarget.remove(); } }, 'Cevabı göster')), back);
      }
    }
    show();
  }
}
```

- [ ] **Step 4: Tarayıcı duman testi**

`#/study`'de birkaç soruyu yanlış cevapla, `#/review` aç.
Expected: 10 dakika geçmeden "Vadesi gelen kart yok" ve "Erken tekrar"; erken tekrarda soru gelir, cevap sonrası dört derece düğmesi; derecelendirince sonraki kart; bilgi kartı "Cevabı göster" ile çevrilir.

- [ ] **Step 5: Commit**

```bash
git add app/js/screens/review.js app/js/reviewqueue.js tests/reviewqueue.test.js
git commit -m "Tekrar ekranı ve kuyruk" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Faz E — Deneme

### Task 13: Deneme motoru (exam.js)

**Files:**
- Create: `app/js/exam.js`, `tests/exam.test.js`

**Interfaces:**
- `dersPuani({ dogru, yanlis, gecerli }) → number` (2 ondalık, 0 altı 0).
- `pickQuestions(pool, { mod: 'resmi' | 'rastgele', adet, rng = Math.random }) → Question[]`: iptal dışlanır; `resmi` sırayı korur; `rastgele` karıştırıp `adet` alır.
- `createExam({ tur, sorular, sureDk, now, denemeId }) → session` (iptal sorular dışlanır):
  `{ denemeId, tur, dersler, soruIdler, dersOf, cevaplar: {}, bayraklar: {}, baslangic: now, sureMs, bitis: null, bittiMi: false, sonuc: null }`.
- `answer(session, soruId, cevap | null) → session` (yeni nesne).
- `toggleFlag(session, soruId) → session`.
- `remainingMs(session, now) → ms` (0 altı 0).
- `finish(session, questionsById, now) → session` (`bittiMi: true`, `bitis`, `sonuc: { dersler: { kod: { dogru, yanlis, bos, gecerli, puan, gecti } }, ortalama, ortalamaGecti, toplamDogru, toplamYanlis, toplamBos }`).

- [ ] **Step 1: Test**

`tests/exam.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dersPuani, pickQuestions, createExam, answer, finish, remainingMs, toggleFlag } from '../app/js/exam.js';

const mk = (ders, n, iptal = false) => ({ id: `2026-1-${ders}-${String(n).padStart(2, '0')}`, ders, no: n, dogru: 'A', iptal });
const pool = (ders, iptalNo = null) => Array.from({ length: 20 }, (_, i) => mk(ders, i + 1, i + 1 === iptalNo));

test('resmi puan formülü', () => {
  assert.equal(dersPuani({ dogru: 16, yanlis: 4, gecerli: 20 }), 75);
  assert.equal(dersPuani({ dogru: 19, yanlis: 0, gecerli: 19 }), 100);
  assert.equal(dersPuani({ dogru: 10, yanlis: 9, gecerli: 19 }), 40.79);
  assert.equal(dersPuani({ dogru: 1, yanlis: 19, gecerli: 20 }), 0);
  assert.equal(dersPuani({ dogru: 0, yanlis: 0, gecerli: 0 }), 0);
});

test('resmi set iptal sorusunu dışlar, sırayı korur', () => {
  const qs = pickQuestions(pool('FTA', 7), { mod: 'resmi' });
  assert.equal(qs.length, 19);
  assert.equal(qs[6].no, 8);
});

test('rastgele seçim adet kadar ve iptalsiz', () => {
  let s = 1; const rng = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const qs = pickQuestions([...pool('FM'), ...pool('FM', 3).map(q => ({ ...q, id: q.id.replace('2026-1', '2026-2') }))], { mod: 'rastgele', adet: 20, rng });
  assert.equal(qs.length, 20);
  assert.ok(qs.every(q => !q.iptal));
  assert.equal(new Set(qs.map(q => q.id)).size, 20);
});

test('oturum oluşturma, cevap, bayrak, kalan süre', () => {
  const now = 1000;
  const s = createExam({ tur: 'ders', sorular: pool('MAL'), sureDk: 45, now, denemeId: 'd1' });
  assert.deepEqual(s.dersler, ['MAL']);
  assert.equal(s.soruIdler.length, 20);
  assert.equal(s.sureMs, 45 * 60000);
  const s2 = answer(s, '2026-1-MAL-01', 'B');
  assert.equal(s.cevaplar['2026-1-MAL-01'], undefined);
  assert.equal(s2.cevaplar['2026-1-MAL-01'], 'B');
  const s3 = answer(s2, '2026-1-MAL-01', null);
  assert.equal(s3.cevaplar['2026-1-MAL-01'], undefined);
  assert.equal(toggleFlag(s3, 'x').bayraklar.x, true);
  assert.equal(remainingMs(s3, now + 10 * 60000), 35 * 60000);
  assert.equal(remainingMs(s3, now + 60 * 60000), 0);
});

test('bitirme: ders bazında sayım, puan ve baraj', () => {
  const qs = [...pool('FM'), ...pool('MAL', 20)];
  const byId = Object.fromEntries(qs.map(q => [q.id, q]));
  let s = createExam({ tur: 'oturum', sorular: qs, sureDk: 180, now: 0, denemeId: 'd2' });
  assert.equal(s.soruIdler.length, 39);
  for (let i = 1; i <= 15; i++) s = answer(s, `2026-1-FM-${String(i).padStart(2, '0')}`, 'A');
  for (let i = 16; i <= 20; i++) s = answer(s, `2026-1-FM-${String(i).padStart(2, '0')}`, 'B');
  for (let i = 1; i <= 9; i++) s = answer(s, `2026-1-MAL-${String(i).padStart(2, '0')}`, 'A');
  const f = finish(s, byId, 5000);
  assert.equal(f.bittiMi, true);
  assert.deepEqual(f.sonuc.dersler.FM, { dogru: 15, yanlis: 5, bos: 0, gecerli: 20, puan: 68.75, gecti: true });
  assert.deepEqual(f.sonuc.dersler.MAL, { dogru: 9, yanlis: 0, bos: 10, gecerli: 19, puan: 47.37, gecti: false });
  assert.equal(f.sonuc.ortalama, 58.06);
  assert.equal(f.sonuc.ortalamaGecti, false);
  assert.equal(f.sonuc.toplamBos, 10);
});
```

Run: `npm test -- tests/exam.test.js`
Expected: FAIL.

- [ ] **Step 2: exam.js**

```js
// app/js/exam.js — deneme oturumu ve resmi puanlama (saf)
const r2 = (x) => Math.round(x * 100) / 100;

export function dersPuani({ dogru, yanlis, gecerli }) {
  if (!gecerli) return 0;
  return Math.max(0, r2((dogru - yanlis * 0.25) * (100 / gecerli)));
}

export function pickQuestions(pool, { mod = 'resmi', adet = 20, rng = Math.random } = {}) {
  const valid = pool.filter(q => !q.iptal);
  if (mod === 'resmi') return valid;
  const a = [...valid];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, adet);
}

export function createExam({ tur, sorular: girdi, sureDk, now = Date.now(), denemeId = String(now) }) {
  const sorular = girdi.filter(q => !q.iptal);
  const dersler = [...new Set(sorular.map(q => q.ders))];
  return { denemeId, tur, dersler, soruIdler: sorular.map(q => q.id), dersOf: Object.fromEntries(sorular.map(q => [q.id, q.ders])),
    cevaplar: {}, bayraklar: {}, baslangic: now, sureMs: sureDk * 60000, bitis: null, bittiMi: false, sonuc: null };
}

export function answer(session, soruId, cevap) {
  const cevaplar = { ...session.cevaplar };
  if (cevap === null || cevap === undefined) delete cevaplar[soruId]; else cevaplar[soruId] = cevap;
  return { ...session, cevaplar };
}

export function toggleFlag(session, soruId) {
  return { ...session, bayraklar: { ...session.bayraklar, [soruId]: !session.bayraklar[soruId] } };
}

export function remainingMs(session, now = Date.now()) {
  return Math.max(0, session.baslangic + session.sureMs - now);
}

export function finish(session, questionsById, now = Date.now()) {
  const dersler = {};
  for (const kod of session.dersler) dersler[kod] = { dogru: 0, yanlis: 0, bos: 0, gecerli: 0 };
  for (const id of session.soruIdler) {
    const q = questionsById[id]; const d = dersler[session.dersOf[id]];
    if (!q || !d) continue;
    d.gecerli++;
    const c = session.cevaplar[id];
    if (!c) d.bos++; else if (c === q.dogru) d.dogru++; else d.yanlis++;
  }
  let toplam = 0, toplamDogru = 0, toplamYanlis = 0, toplamBos = 0;
  for (const d of Object.values(dersler)) {
    d.puan = dersPuani(d); d.gecti = d.puan >= 50;
    toplam += d.puan; toplamDogru += d.dogru; toplamYanlis += d.yanlis; toplamBos += d.bos;
  }
  const n = Object.keys(dersler).length;
  const ortalama = n ? r2(toplam / n) : 0;
  return { ...session, bittiMi: true, bitis: now, sonuc: { dersler, ortalama, ortalamaGecti: ortalama >= 60, toplamDogru, toplamYanlis, toplamBos } };
}
```

Run: `npm test -- tests/exam.test.js`
Expected: 5 PASS.

- [ ] **Step 3: Commit**

```bash
git add app/js/exam.js tests/exam.test.js
git commit -m "Deneme motoru ve resmi puanlama" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 14: Deneme ekranları (kurulum, sınav, sonuç)

**Files:**
- Create: `app/js/screens/exam.js`

**Interfaces:**
- Consumes: Task 13 `exam.js` fonksiyonları; `createQuestionView` (mode `'exam'`); `db.saveExam/getExam/allExams`; `data.filterQuestions/getQuestion`; `recordAnswer` (sonuçta yanlışları tekrara eklemek için); `ui.fmtSure/confirm/sheet`.
- Yollar: `#/exam` kurulum; `#/exam/run/<id>` sınav; `#/exam/result/<id>` sonuç; `#/exam/review/<id>` yanlışları çalışma modunda gözden geçirme.

- [ ] **Step 1: exam.js ekranı**

```js
// app/js/screens/exam.js
import { h, toast, confirm, fmtSure, sheet } from '../ui.js';
import { createQuestionView } from './question-view.js';
import * as X from '../exam.js';
import * as fsrs from '../fsrs.js';
import { DERSLER, DONEMLER, dersAdi } from '../data.js';
import { recordAnswer, examDateMs } from '../progress.js';

let timer = null, qv = null;
export function destroy() { clearInterval(timer); timer = null; qv?.destroy(); qv = null; }

export async function render(view, params, ctx) {
  if (params.stage === 'run') return runExam(view, params.id, ctx);
  if (params.stage === 'result') return showResult(view, params.id, ctx);
  if (params.stage === 'review') return reviewWrong(view, params.id, ctx);
  return setup(view, ctx);
}

async function setup(view, ctx) {
  const { db, data } = ctx;
  const unfinished = (await db.allExams()).find(e => !e.bittiMi);
  if (unfinished) view.append(h('div', { class: 'card' }, h('h3', {}, 'Yarım kalan deneme var'), h('div', { class: 'row' },
    h('a', { class: 'btn btn-primary', href: '#/exam/run/' + unfinished.denemeId }, 'Devam et'),
    h('button', { class: 'btn', onClick: async () => { if (await confirm('Yarım kalan deneme silinsin mi?')) { await db.del('exams', unfinished.denemeId); location.reload(); } } }, 'Sil'))));

  const dersSel = h('select', {}, ...DERSLER.map(d => h('option', { value: d.kod }, d.ad)));
  const donemSel = h('select', {}, h('option', { value: 'karisik' }, 'İki dönemden rastgele 20'), ...DONEMLER.map(d => h('option', { value: d }, d + ' resmi seti')));
  const oturumSel = h('select', {}, h('option', { value: '1' }, '1. oturum: FM, MAL, HUK, SPK'), h('option', { value: '2' }, '2. oturum: FTA, DEN, VER, MH'));
  const ozelDers = DERSLER.map(d => h('label', { class: 'chip' }, h('input', { type: 'checkbox', value: d.kod, style: 'margin-right:6px' }), d.ad));
  const adetIn = h('input', { type: 'number', value: 20, min: 5, max: 160 });
  const sureIn = h('input', { type: 'number', value: 45, min: 5, max: 240 });

  view.append(h('h1', {}, 'Deneme'),
    h('div', { class: 'card' }, h('h3', {}, 'Tek ders'), h('p', { class: 'muted' }, '20 soru, 45 dakika, 5 şık. Her yanlış 0,25 doğruyu götürür.'),
      h('label', { class: 'field' }, 'Ders', dersSel), h('label', { class: 'field' }, 'Soru seti', donemSel),
      h('button', { class: 'btn btn-primary btn-block', onClick: async () => {
        const kod = dersSel.value, dn = donemSel.value;
        const pool = await data.filterQuestions({ dersler: [kod], donemler: dn === 'karisik' ? [] : [dn], iptalHaric: false });
        const qs = X.pickQuestions(pool, { mod: dn === 'karisik' ? 'rastgele' : 'resmi', adet: 20 });
        start({ tur: 'ders', sorular: qs, sureDk: 45 });
      } }, 'Başla')),
    h('div', { class: 'card' }, h('h3', {}, 'Tam oturum'), h('p', { class: 'muted' }, '4 ders × 20 soru, 180 dakika.'),
      h('label', { class: 'field' }, 'Oturum', oturumSel),
      h('button', { class: 'btn btn-primary btn-block', onClick: async () => {
        const dersler = DERSLER.filter(d => d.oturum === +oturumSel.value).map(d => d.kod); const qs = [];
        for (const kod of dersler) qs.push(...X.pickQuestions(await data.filterQuestions({ dersler: [kod], iptalHaric: false }), { mod: 'rastgele', adet: 20 }));
        start({ tur: 'oturum', sorular: qs, sureDk: 180 });
      } }, 'Başla')),
    h('div', { class: 'card' }, h('h3', {}, 'Özel'), h('div', { class: 'row' }, ...ozelDers),
      h('label', { class: 'field' }, 'Toplam soru', adetIn), h('label', { class: 'field' }, 'Süre (dk)', sureIn),
      h('button', { class: 'btn btn-primary btn-block', onClick: async () => {
        const dersler = ozelDers.map(l => l.querySelector('input')).filter(i => i.checked).map(i => i.value);
        if (!dersler.length) return toast('En az bir ders seç.');
        const pool = await data.filterQuestions({ dersler, iptalHaric: false });
        const qs = X.pickQuestions(pool, { mod: 'rastgele', adet: +adetIn.value || 20 });
        start({ tur: 'ozel', sorular: qs, sureDk: +sureIn.value || 45 });
      } }, 'Başla')));

  async function start({ tur, sorular, sureDk }) {
    if (!sorular.length) return toast('Bu seçimle soru bulunamadı.');
    const s = X.createExam({ tur, sorular, sureDk, denemeId: 'd' + Date.now() });
    await db.saveExam(s);
    ctx.navigate('#/exam/run/' + s.denemeId);
  }
}

async function runExam(view, id, ctx) {
  const { db, data } = ctx;
  let s = await db.getExam(id);
  if (!s) { view.append(h('p', { class: 'card' }, 'Deneme bulunamadı.')); return; }
  if (s.bittiMi) return ctx.navigate('#/exam/result/' + id);
  if (X.remainingMs(s) <= 0) { await end(); return; }
  let i = 0;
  const timerEl = h('span', { class: 'timer' });
  const mapBtn = h('button', { class: 'btn btn-small', onClick: openMap }, 'Soru haritası');
  const endBtn = h('button', { class: 'btn btn-small', onClick: async () => { const bos = s.soruIdler.filter(q => !s.cevaplar[q]).length; if (await confirm(`Sınavı bitirmek istiyor musun? Boş: ${bos}`)) end(); } }, 'Bitir');
  const top = h('div', { class: 'q-head' }, timerEl, h('span', { class: 'row' }, mapBtn, endBtn));
  const holder = h('div');
  view.append(top, holder);
  tick(); timer = setInterval(tick, 1000);

  function tick() { const r = X.remainingMs(s); timerEl.textContent = fmtSure(r); timerEl.classList.toggle('low', r < 5 * 60000); if (r <= 0) end(); }
  async function save() { await db.saveExam(s); }
  async function show(k) {
    i = k; qv?.destroy(); holder.innerHTML = '';
    const qid = s.soruIdler[i]; const q = await data.getQuestion(qid);
    qv = createQuestionView({ question: q, mode: 'exam', index: i, total: s.soruIdler.length, selected: s.cevaplar[qid] ?? null, flagged: !!s.bayraklar[qid],
      inkStrokes: await db.getInk('deneme:' + id + ':' + qid),
      onAnswer: ({ cevap }) => { s = X.answer(s, qid, cevap); save(); },
      onFlag: () => { s = X.toggleFlag(s, qid); save(); },
      onInk: (strokes) => db.saveInk('deneme:' + id + ':' + qid, strokes),
      onPrev: i > 0 ? () => show(i - 1) : null, onNext: i < s.soruIdler.length - 1 ? () => show(i + 1) : () => openMap() });
    holder.append(qv.el, h('button', { class: 'btn btn-small', style: 'margin-top:8px', onClick: () => { s = X.answer(s, qid, null); save(); qv.setSelected(null); } }, 'Boş bırak'));
  }
  function openMap() {
    const grid = h('div', { class: 'grid-map' }, ...s.soruIdler.map((qid, k) => h('button', { class: (s.cevaplar[qid] ? 'answered ' : '') + (s.bayraklar[qid] ? 'flagged ' : '') + (k === i ? 'current' : ''), onClick: () => { sh.close(); show(k); } }, String(k + 1))));
    const sh = sheet({ title: 'Soru haritası', content: h('div', {}, h('p', { class: 'muted' }, `Cevaplı: ${Object.keys(s.cevaplar).length} / ${s.soruIdler.length}`), grid) });
  }
  async function end() {
    clearInterval(timer); timer = null;
    const byId = {}; for (const qid of s.soruIdler) byId[qid] = await data.getQuestion(qid);
    s = X.finish(s, byId); await db.saveExam(s);
    const examDate = await examDateMs(db);
    for (const qid of s.soruIdler) { const q = byId[qid]; const c = s.cevaplar[qid]; if (c) await db.addAnswer({ soruId: qid, cevap: c, dogruMu: c === q.dogru, emin: true, sure: 0, mod: 'exam', denemeId: id }); }
    ctx.navigate('#/exam/result/' + id);
  }
  await show(0);
}

async function showResult(view, id, ctx) {
  const { db, data } = ctx;
  const s = await db.getExam(id);
  if (!s?.sonuc) { view.append(h('p', { class: 'card' }, 'Sonuç bulunamadı.')); return; }
  const r = s.sonuc;
  view.append(h('h1', {}, 'Deneme sonucu'),
    h('div', { class: 'card', style: 'text-align:center' }, h('div', { style: 'font-size:2.2em;font-weight:700' }, r.ortalama), h('div', { class: 'muted' }, s.dersler.length > 1 ? (r.ortalamaGecti ? 'Ortalama barajı (60) geçildi' : 'Ortalama 60 altında') : (r.dersler[s.dersler[0]].gecti ? 'Ders barajı (50) geçildi' : 'Ders barajı 50 altında')),
      h('p', { class: 'muted' }, `Doğru ${r.toplamDogru} · Yanlış ${r.toplamYanlis} · Boş ${r.toplamBos} · Süre ${fmtSure(s.bitis - s.baslangic)}`)),
    ...Object.entries(r.dersler).map(([kod, d]) => h('div', { class: 'stat-row' }, h('span', {}, dersAdi(kod)), h('span', {}, `${d.dogru}D ${d.yanlis}Y ${d.bos}B → `, h('strong', { style: `color:${d.gecti ? 'var(--ok)' : 'var(--err)'}` }, d.puan)))),
    h('div', { class: 'row', style: 'margin-top:12px' },
      h('button', { class: 'btn btn-primary', onClick: async () => {
        const examDate = await examDateMs(db); let n = 0;
        for (const qid of s.soruIdler) { const q = await data.getQuestion(qid); const c = s.cevaplar[qid]; if (!c || c !== q.dogru) { await recordAnswer({ db, fsrs, question: q, cevap: c ?? '-', dogruMu: false, emin: false, sure: 0, mod: 'exam-review', denemeId: id, examDate }); n++; } }
        toast(`${n} soru tekrar kuyruğuna eklendi.`);
      } }, 'Yanlışları tekrara ekle'),
      h('a', { class: 'btn', href: '#/exam/review/' + id }, 'Yanlışları gözden geçir'),
      h('a', { class: 'btn', href: '#/exam' }, 'Yeni deneme')));
}

async function reviewWrong(view, id, ctx) {
  const { db, data } = ctx;
  const s = await db.getExam(id);
  if (!s) { view.append(h('p', { class: 'card' }, 'Deneme bulunamadı.')); return; }
  const wrong = [];
  for (const qid of s.soruIdler) { const q = await data.getQuestion(qid); if (!s.cevaplar[qid] || s.cevaplar[qid] !== q.dogru) wrong.push(qid); }
  if (!wrong.length) { view.append(h('p', { class: 'card' }, 'Yanlış veya boş soru yok.')); return; }
  let i = 0;
  async function show() {
    qv?.destroy(); view.innerHTML = '';
    const q = await data.getQuestion(wrong[i]); const sol = await data.getSolution(q.id);
    qv = createQuestionView({ question: q, solution: sol, mode: 'review', index: i, total: wrong.length, selected: s.cevaplar[q.id] ?? null, emin: true,
      inkStrokes: await db.getInk('deneme:' + id + ':' + q.id), onAnswer: () => {}, onInk: (st) => db.saveInk('deneme:' + id + ':' + q.id, st),
      onPrev: i > 0 ? () => { i--; show(); } : null, onNext: i < wrong.length - 1 ? () => { i++; show(); } : () => ctx.navigate('#/exam/result/' + id) });
    view.append(qv.el);
    qv.reveal();
  }
  show();
}
```

- [ ] **Step 2: Tarayıcı duman testi**

Senaryo: Tek ders, Maliyet, 2026-1 resmi seti → sayaç 45:00'dan düşer, şık seçimi değiştirilebilir, "Boş bırak" seçimi kaldırır, soru haritası cevaplıları renkler, sekmeyi kapatıp `#/exam` açınca "Yarım kalan deneme var", "Bitir" sonuç ekranını getirir (puan ve baraj), "Yanlışları gözden geçir" çözümleri açar, "Yanlışları tekrara ekle" kart ekler.

- [ ] **Step 3: Commit**

```bash
git add app/js/screens/exam.js
git commit -m "Deneme ekranları" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Faz F — İstatistik ve ayarlar

### Task 15: İstatistik ekranı ve hata defteri

**Files:**
- Create: `app/js/statistics.js`, `tests/statistics.test.js`, `app/js/screens/stats.js`

**Interfaces:**
- `statistics.js` (saf): `konuIstatistikleri(questions, answers) → [{ konu, ders, gorulen, dogru, dogruluk, ortSureMs }]` (son cevaba göre doğruluk, tüm cevaplara göre ortalama süre); `hataDagilimi(answers) → { bilgi, dikkat, sure, okuma, etiketsiz }`; `zayifKonular(konuStats, n = 5) → konuStats[]` (en az 3 görülen, doğruluk artan); `hataDefteri(questions, answers, { ders, etiket }) → [{ question, answer }]` (son cevabı yanlış olanlar, filtreli, tarih azalan).

- [ ] **Step 1: Test**

`tests/statistics.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { konuIstatistikleri, hataDagilimi, zayifKonular, hataDefteri } from '../app/js/statistics.js';

const qs = [
  { id: 'a', ders: 'MAL', konu: 'k1', iptal: false }, { id: 'b', ders: 'MAL', konu: 'k1', iptal: false },
  { id: 'c', ders: 'MAL', konu: 'k2', iptal: false }, { id: 'd', ders: 'FM', konu: 'x', iptal: false }];
const ans = [
  { soruId: 'a', dogruMu: false, tarih: 1, sure: 1000, hataEtiketi: 'bilgi' }, { soruId: 'a', dogruMu: true, tarih: 2, sure: 3000 },
  { soruId: 'b', dogruMu: false, tarih: 3, sure: 2000 }, { soruId: 'd', dogruMu: false, tarih: 4, sure: 500, hataEtiketi: 'dikkat' }];

test('konu istatistikleri', () => {
  const k1 = konuIstatistikleri(qs, ans).find(k => k.konu === 'k1');
  assert.deepEqual(k1, { konu: 'k1', ders: 'MAL', gorulen: 2, dogru: 1, dogruluk: 0.5, ortSureMs: 2000 });
  assert.equal(konuIstatistikleri(qs, ans).find(k => k.konu === 'k2').dogruluk, null);
});

test('hata dağılımı yalnızca yanlışları sayar', () => {
  assert.deepEqual(hataDagilimi(ans), { bilgi: 1, dikkat: 1, sure: 0, okuma: 0, etiketsiz: 1 });
});

test('zayıf konular en az 3 görülen ister', () => {
  const st = [{ konu: 'a', gorulen: 3, dogruluk: 0.9 }, { konu: 'b', gorulen: 5, dogruluk: 0.2 }, { konu: 'c', gorulen: 1, dogruluk: 0 }];
  assert.deepEqual(zayifKonular(st, 5).map(s => s.konu), ['b', 'a']);
});

test('hata defteri filtreli ve tarih azalan', () => {
  const list = hataDefteri(qs, ans, {});
  assert.deepEqual(list.map(x => x.question.id), ['d', 'b']);
  assert.deepEqual(hataDefteri(qs, ans, { ders: 'MAL' }).map(x => x.question.id), ['b']);
  assert.deepEqual(hataDefteri(qs, ans, { etiket: 'dikkat' }).map(x => x.question.id), ['d']);
});
```

Run: `npm test -- tests/statistics.test.js`
Expected: FAIL.

- [ ] **Step 2: statistics.js**

```js
// app/js/statistics.js
import { lastAnswerMap } from './progress.js';

export function konuIstatistikleri(questions, answers) {
  const last = lastAnswerMap(answers);
  const bySoru = new Map();
  for (const a of answers) { if (!bySoru.has(a.soruId)) bySoru.set(a.soruId, []); bySoru.get(a.soruId).push(a); }
  const groups = new Map();
  for (const q of questions) {
    if (q.iptal) continue;
    const key = q.konu || 'diger';
    if (!groups.has(key)) groups.set(key, { konu: key, ders: q.ders, gorulen: 0, dogru: 0, sureler: [] });
    const g = groups.get(key);
    if (last.has(q.id)) { g.gorulen++; if (last.get(q.id).dogruMu) g.dogru++; }
    for (const a of bySoru.get(q.id) || []) if (a.sure > 0) g.sureler.push(a.sure);
  }
  return [...groups.values()].map(({ sureler, ...g }) => ({ ...g, dogruluk: g.gorulen ? g.dogru / g.gorulen : null, ortSureMs: sureler.length ? Math.round(sureler.reduce((a, b) => a + b, 0) / sureler.length) : 0 }));
}

export function hataDagilimi(answers) {
  const d = { bilgi: 0, dikkat: 0, sure: 0, okuma: 0, etiketsiz: 0 };
  for (const a of answers) if (!a.dogruMu) { if (a.hataEtiketi && a.hataEtiketi in d) d[a.hataEtiketi]++; else d.etiketsiz++; }
  return d;
}

export function zayifKonular(konuStats, n = 5) {
  return konuStats.filter(k => k.gorulen >= 3 && k.dogruluk !== null).sort((a, b) => a.dogruluk - b.dogruluk).slice(0, n);
}

export function hataDefteri(questions, answers, { ders, etiket } = {}) {
  const last = lastAnswerMap(answers);
  const out = [];
  for (const q of questions) {
    const a = last.get(q.id);
    if (!a || a.dogruMu) continue;
    if (ders && q.ders !== ders) continue;
    if (etiket && a.hataEtiketi !== etiket) continue;
    out.push({ question: q, answer: a });
  }
  return out.sort((x, y) => y.answer.tarih - x.answer.tarih);
}
```

Run: `npm test -- tests/statistics.test.js`
Expected: 4 PASS.

- [ ] **Step 3: stats.js ekranı**

```js
// app/js/screens/stats.js
import { h, fmtSure, toast } from '../ui.js';
import { DERSLER, dersAdi } from '../data.js';
import { konuIstatistikleri, hataDagilimi, zayifKonular, hataDefteri } from '../statistics.js';
import { dersIstatistikleri } from '../planner.js';
import * as X from '../exam.js';

const ETIKET = { bilgi: 'Bilgi eksiği', dikkat: 'Dikkatsizlik', sure: 'Süre', okuma: 'Yanlış okudum', etiketsiz: 'Etiketsiz' };

export async function render(view, params, ctx) {
  const { db, data } = ctx;
  const questions = await data.loadAllQuestions();
  const answers = await db.allAnswers();
  const exams = (await db.allExams()).filter(e => e.bittiMi).sort((a, b) => b.bitis - a.bitis);
  const ders = dersIstatistikleri(questions, answers);
  const konu = konuIstatistikleri(questions, answers);
  const hata = hataDagilimi(answers);
  const topics = await data.loadTopics();
  const konuAdi = (kod) => topics.find(t => t.kod === kod)?.baslik ?? kod;

  const filt = { ders: '', etiket: '' };
  const defterList = h('div');
  function renderDefter() {
    defterList.innerHTML = '';
    const list = hataDefteri(questions, answers, filt);
    if (!list.length) defterList.append(h('p', { class: 'muted' }, 'Kayıt yok.'));
    for (const { question: q, answer: a } of list.slice(0, 100)) {
      defterList.append(h('a', { class: 'stat-row', href: '#/study/q/' + q.id, style: 'text-decoration:none;color:inherit' },
        h('span', {}, `${dersAdi(q.ders)} ${q.donem} · Soru ${q.no}`), h('span', { class: 'muted' }, `${a.cevap} ✗ · ${ETIKET[a.hataEtiketi] ?? '—'}`)));
    }
    defterList.append(h('button', { class: 'btn btn-primary', style: 'margin-top:8px', disabled: !list.length, onClick: async () => {
      const qs = list.map(x => x.question).filter(q => !q.iptal).slice(0, 40);
      const s = X.createExam({ tur: 'ozel', sorular: qs, sureDk: Math.max(10, Math.round(qs.length * 2.25)), denemeId: 'd' + Date.now() });
      await db.saveExam(s); ctx.navigate('#/exam/run/' + s.denemeId);
    } }, 'Bu listeden deneme kur'));
  }
  renderDefter();

  view.append(h('h1', {}, 'İstatistik'),
    h('div', { class: 'card' }, h('h3', {}, 'Ders bazında'),
      ...ders.map(d => h('div', { class: 'stat-row' }, h('span', {}, dersAdi(d.kod)), h('span', {}, `${d.gorulen}/${d.toplam} · ${d.dogruluk === null ? '—' : Math.round(d.dogruluk * 100) + '%'}`)))),
    h('div', { class: 'card' }, h('h3', {}, 'Zayıf konular'),
      ...(zayifKonular(konu).map(k => h('div', { class: 'stat-row' }, h('span', {}, `${dersAdi(k.ders)} · ${konuAdi(k.konu)}`), h('span', {}, `${Math.round(k.dogruluk * 100)}% · ${fmtSure(k.ortSureMs)}`))) || []),
      zayifKonular(konu).length ? null : h('p', { class: 'muted' }, 'Bir konuda en az 3 soru çözünce burada görünür.')),
    h('div', { class: 'card' }, h('h3', {}, 'Hata türleri'),
      ...Object.entries(hata).map(([k, v]) => h('div', { class: 'stat-row' }, h('span', {}, ETIKET[k]), h('span', {}, v)))),
    h('div', { class: 'card' }, h('h3', {}, 'Deneme geçmişi'),
      exams.length ? exams.slice(0, 20).map(e => h('a', { class: 'stat-row', href: '#/exam/result/' + e.denemeId, style: 'text-decoration:none;color:inherit' },
        h('span', {}, `${new Date(e.bitis).toLocaleDateString('tr-TR')} · ${e.dersler.map(dersAdi).join(', ')}`), h('strong', {}, e.sonuc.ortalama))) : h('p', { class: 'muted' }, 'Henüz deneme yok.')),
    h('div', { class: 'card' }, h('h3', {}, 'Hata defteri'),
      h('div', { class: 'row' },
        h('select', { onChange: (e) => { filt.ders = e.target.value; renderDefter(); } }, h('option', { value: '' }, 'Tüm dersler'), ...DERSLER.map(d => h('option', { value: d.kod }, d.ad))),
        h('select', { onChange: (e) => { filt.etiket = e.target.value; renderDefter(); } }, h('option', { value: '' }, 'Tüm etiketler'), ...Object.entries(ETIKET).filter(([k]) => k !== 'etiketsiz').map(([k, v]) => h('option', { value: k }, v)))),
      defterList));
}
```

- [ ] **Step 4: Tarayıcı duman testi**

Expected: Ders tablosu, hata türleri, deneme geçmişi, hata defteri satırına dokununca soru çalışma modunda açılır, "Bu listeden deneme kur" denemeyi başlatır.

- [ ] **Step 5: Commit**

```bash
git add app/js/statistics.js tests/statistics.test.js app/js/screens/stats.js
git commit -m "İstatistik ekranı ve hata defteri" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 16: Ayarlar ekranı, yedekleme ve geri yükleme

**Files:**
- Create: `app/js/screens/settings.js`

**Interfaces:**
- Ayar anahtarları: `tema` ('system'|'light'|'dark'), `yaziBoyutu` (1..4), `hedefSaat` (0.5..6), `sinavTarihi` ('YYYY-MM-DD'). Değişince `window.dispatchEvent(new Event('settings-changed'))`.
- Yedek dosya adı `smmm-koc-yedek-YYYY-MM-DD.json`.

- [ ] **Step 1: settings.js**

```js
// app/js/screens/settings.js
import { h, toast, confirm } from '../ui.js';

export async function render(view, params, ctx) {
  const { db, data } = ctx;
  const idx = await data.loadIndex().catch(() => ({}));
  const tema = await db.getSetting('tema', 'system'), fs = await db.getSetting('yaziBoyutu', 2);
  const hedef = await db.getSetting('hedefSaat', 1.5), tarih = await db.getSetting('sinavTarihi', '2026-11-28');
  const changed = () => window.dispatchEvent(new Event('settings-changed'));
  const sel = (opts, val, key) => h('select', { onChange: async (e) => { await db.setSetting(key, isNaN(e.target.value) ? e.target.value : +e.target.value); changed(); } },
    ...opts.map(([v, t]) => h('option', { value: v, selected: String(v) === String(val) }, t)));
  const fileIn = h('input', { type: 'file', accept: 'application/json', hidden: true, onChange: async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const json = JSON.parse(await f.text());
      if (!await confirm('Mevcut tüm ilerleme bu yedekle değiştirilecek. Devam?')) return;
      await db.importAll(json); toast('Yedek geri yüklendi.'); changed();
    } catch (err) { toast(err.message.includes('Yedek') ? err.message : 'Yedek dosyası okunamadı.'); }
    e.target.value = '';
  } });

  view.append(h('h1', {}, 'Ayarlar'),
    h('div', { class: 'card' },
      h('label', { class: 'field' }, 'Tema', sel([['system', 'Sistem'], ['light', 'Açık'], ['dark', 'Koyu']], tema, 'tema')),
      h('label', { class: 'field' }, 'Yazı boyutu', sel([[1, 'Küçük'], [2, 'Normal'], [3, 'Büyük'], [4, 'Çok büyük']], fs, 'yaziBoyutu')),
      h('label', { class: 'field' }, 'Günlük hedef', sel([[0.5, '30 dakika'], [1, '1 saat'], [1.5, '1,5 saat'], [2, '2 saat'], [3, '3 saat'], [4, '4 saat']], hedef, 'hedefSaat')),
      h('label', { class: 'field' }, 'Sınav tarihi', h('input', { type: 'date', value: tarih, onChange: async (e) => { if (e.target.value) { await db.setSetting('sinavTarihi', e.target.value); changed(); toast('Sınav tarihi güncellendi.'); } } }))),
    h('div', { class: 'card' }, h('h3', {}, 'Yedek'),
      h('p', { class: 'muted' }, 'İlerleme, çizimler ve deneme sonuçları bu cihazda saklanır. Düzenli yedek al.'),
      h('div', { class: 'row' },
        h('button', { class: 'btn btn-primary', onClick: async () => {
          const dump = await db.exportAll();
          const blob = new Blob([JSON.stringify(dump)], { type: 'application/json' });
          const a = h('a', { href: URL.createObjectURL(blob), download: `smmm-koc-yedek-${new Date().toISOString().slice(0, 10)}.json` });
          document.body.append(a); a.click(); a.remove(); toast('Yedek indirildi.');
        } }, 'Yedekle'),
        h('button', { class: 'btn', onClick: () => fileIn.click() }, 'Geri yükle'), fileIn,
        h('button', { class: 'btn', style: 'color:var(--err)', onClick: async () => { if (await confirm('Tüm ilerleme silinecek. Emin misin?', { ok: 'Sil' })) { await db.resetAll(); toast('Veriler sıfırlandı.'); changed(); } } }, 'Verileri sıfırla'))),
    h('div', { class: 'card' }, h('h3', {}, 'Hakkında'),
      h('p', { class: 'muted' }, `Veri sürümü: ${idx.surum ?? '—'}`),
      ...Object.entries(idx.kaynaklar || {}).map(([d, k]) => h('p', { class: 'muted' }, `${d}: ${k.aciklama} (${k.indirme})`)),
      h('p', { class: 'muted' }, 'Sorular TÜRMOB-TESMER resmi kitapçıklarından alınmıştır; çözümler bu uygulama için yazılmış ve resmi cevap anahtarıyla doğrulanmıştır.')));
}
```

- [ ] **Step 2: Tarayıcı duman testi**

Expected: Tema değişince anında uygulanır; yazı boyutu soru ekranında büyür; "Yedekle" JSON indirir; "Geri yükle" ile aynı dosya seçilince onay sonrası yüklenir; yanlış dosya seçilince "Yedek dosyası tanınmadı." görünür ve veri kalır.

- [ ] **Step 3: Commit**

```bash
git add app/js/screens/settings.js
git commit -m "Ayarlar, yedekleme ve geri yükleme" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Faz G — Offline (PWA)

### Task 17: Service worker ve önbellek listesi

**Files:**
- Create: `app/sw.js`, `tools/build_sw_manifest.py`, `app/sw-manifest.js` (üretilir, depoya girer)

**Interfaces:**
- `sw-manifest.js`: `self.__VERSION = '<12 hex>'; self.__PRECACHE = ['./', './index.html', …]` (app/ altındaki tüm dosyalar; `sw.js` ve `sw-manifest.js` hariç).
- `app.js` (Task 1) `SKIP_WAITING` mesajını gönderir; `sw.js` alır.

- [ ] **Step 1: build_sw_manifest.py**

```python
"""app/ içeriğinden sw-manifest.js üretir. Kullanım: python tools/build_sw_manifest.py"""
import hashlib, json, pathlib

APP = pathlib.Path(__file__).parent.parent / "app"
EXCLUDE = {"sw.js", "sw-manifest.js"}

def build():
    files, h = [], hashlib.sha256()
    for p in sorted(APP.rglob("*")):
        if p.is_file() and p.name not in EXCLUDE and not p.name.startswith("."):
            rel = "./" + p.relative_to(APP).as_posix()
            files.append(rel); h.update(rel.encode()); h.update(p.read_bytes())
    version = h.hexdigest()[:12]
    (APP / "sw-manifest.js").write_text(f"self.__VERSION = '{version}';\nself.__PRECACHE = {json.dumps(files, ensure_ascii=False)};\n", encoding="utf-8")
    return version, len(files)

if __name__ == "__main__":
    v, n = build(); print(f"sürüm {v}, {n} dosya")
```

Run: `python tools/build_sw_manifest.py`
Expected: "sürüm …, N dosya"; `app/sw-manifest.js` oluşur ve `./index.html`, `./data/index.json` içerir.

- [ ] **Step 2: sw.js**

```js
// app/sw.js
importScripts('sw-manifest.js');
const CACHE = 'smmm-koc-' + self.__VERSION;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(self.__PRECACHE)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => { if (e.data?.type === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(e.request, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(e.request);
      if (res.ok) cache.put(e.request, res.clone());
      return res;
    } catch {
      if (e.request.mode === 'navigate') return cache.match('./index.html');
      return new Response('', { status: 503 });
    }
  })());
});
```

- [ ] **Step 3: Offline testi**

Run: `npm run serve`; Chrome'da aç, DevTools → Application → Service Workers: "activated" olmalı; Network → Offline işaretle; sayfayı yenile.
Expected: Uygulama açılır, `#/study` soruları yükler, sayfa görüntüsü açılır. Bir dosyayı değiştirip `python tools/build_sw_manifest.py` çalıştırınca ve sayfayı yenileyince "Yeni sürüm hazır. Yenile" şeridi görünür; "Yenile" sonrası yeni içerik gelir.

- [ ] **Step 4: Commit**

```bash
git add app/sw.js app/sw-manifest.js tools/build_sw_manifest.py
git commit -m "Service worker ve önbellek listesi" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

## Faz H — İçerik: 16 kitapçığın tamamı

### Task 18: Tüm kitapçıkların ham çıkarımı ve sayfa görüntüleri

**Files:**
- Create: `tools/extract_all.py`, `tools/out/raw/*.json` (16, gitignore), `app/img/originals/*.png` (tümü)

- [ ] **Step 1: extract_all.py**

```python
"""16 kitapçığı tek seferde çıkarır ve sayfa görüntülerini üretir."""
import pathlib, subprocess, sys
from extract_questions import extract
from render_pages import render
import json

SLUG = {"finansal-muhasebe": "FM", "maliyet-muhasebesi": "MAL", "hukuk": "HUK", "spk-mevzuati": "SPK",
        "finansal-tablolar-analizi": "FTA", "muhasebe-denetimi": "DEN", "vergi-mevzuati": "VER", "meslek-hukuku": "MH"}
HERE = pathlib.Path(__file__).parent

if __name__ == "__main__":
    total = 0
    for pdf in sorted((HERE / "pdfs").glob("*.pdf")):
        donem = pdf.stem[:6].replace("_", "-"); ders = SLUG[pdf.stem[7:]]
        qs = extract(pdf, donem, ders)
        dest = HERE / "out" / "raw" / f"{donem}-{ders}.json"; dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(json.dumps(qs, ensure_ascii=False, indent=1), encoding="utf-8")
        pages = render(pdf, donem, ders)
        eksik = [q["id"] for q in qs if q["dogru"] is None or len(q["secenekler_raw"]) != 5]
        print(f"{donem}-{ders}: {len(qs)} soru, {len(pages)} sayfa, şüpheli: {eksik}")
        total += len(qs)
    print("toplam", total)
```

Run: `cd tools && python extract_all.py`
Expected: 16 satır, her biri 20 soru; "toplam 320"; şüpheli listeleri boş (boş değilse elle doğrulama sırasında dikkat edilecek sorular olarak not al). `du -sh app/img/originals` 40 MB altında.

- [ ] **Step 2: Commit**

```bash
git add tools/extract_all.py app/img/originals
git commit -m "Tüm kitapçıkların sayfa görüntüleri" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 19: 15 soru dosyasının elle doğrulanması

**Files:**
- Create: `app/data/questions/<donem>-<ders>.json` (15 dosya) ve `tools/out/review-<donem>-<ders>.md` (15)

Yöntem Task 6 Step 2 ile aynıdır; her dosya için ayrı ayrı uygula ve ayrı commit at. Dosya başına: ham JSON'u aç, her sorunun sayfa PNG'sini Read ile görüntüle, HTML'e çevir, `dogru`/`iptal`/`cevapNotu` teyit et, `konu` etiketi ver (MAL dışındaki derslerde serbest, kısa, kebab-case etiket: örn. VER için `gelir-vergisi`, `kdv`, `vuk-degerleme`; HUK için `ticaret-sirketler`, `kiymetli-evrak`, `borclar-genel`, `is-hukuku`, `sgk`, `idari-yargi`).

Ders özel notlar:
- **VER 2026-2**: Soru 1-3 için ortak tarife tablosu `ortakBilgi` olarak üçüne de kopyalanır; soru 2 `cevapNotu` = "Doğru cevap şıkkı B olarak yayınlanmış, A olarak güncellenmiştir.", `dogru: "A"`.
- **FTA 2026-2, HUK 2026-2**: İPTAL soruları `iptal: true`; `dogru` kitapçıktaki işaretli şık (yoksa "A") olarak kalır ama puanlamaya girmez.
- **FM**: Yevmiye kayıtlı şıklar `table.yevmiye`; hesap kodu ve adı aynen (örn. "191 İNDİRİLECEK KDV").
- **DEN, MH, SPK, HUK**: Uzun şıklar; satır sonu kesmelerini birleştir, tire ile bölünmüş kelimeleri düzelt.

- [ ] 2026-1-FM  - [ ] 2026-1-FTA  - [ ] 2026-1-HUK  - [ ] 2026-1-MH  - [ ] 2026-1-DEN  - [ ] 2026-1-SPK  - [ ] 2026-1-VER
- [ ] 2026-2-FM  - [ ] 2026-2-MAL  - [ ] 2026-2-FTA  - [ ] 2026-2-HUK  - [ ] 2026-2-MH  - [ ] 2026-2-DEN  - [ ] 2026-2-SPK  - [ ] 2026-2-VER

Her dosya sonrası: `python tools/validate.py | grep <donem>-<ders>` yalnızca "çözüm yok" hataları vermeli (çözümler Task 20'de); ardından commit: `git commit -m "İçerik: <donem> <ders> soruları"`.

### Task 20: 15 çözüm dosyasının yazılması

**Files:**
- Create: `app/data/solutions/<donem>-<ders>.json` (15 dosya)

Yöntem Task 6 Step 3 ile aynıdır. Dayanak yazım kuralları (ders bazında):
- **FM**: Tekdüzen Hesap Planı hesap kodları ve işleyiş kuralı; ilgili TMS/TFRS (örn. TMS 2 Stoklar, TMS 16 Maddi Duran Varlıklar) sadece soru standarda dayanıyorsa.
- **MAL**: yöntem adı ve formül (Task 6 örneği gibi); konu modülü kodu `konuBaglantisi`.
- **FTA**: oran formülü açıkça (örn. "Cari oran = Dönen varlıklar / KVYK"), analiz tekniği adı.
- **DEN**: BDS numarası ve konusu (örn. "BDS 700 Görüş Oluşturma"), Bağımsız Denetim Yönetmeliği maddesi biliniyorsa.
- **VER**: Kanun ve madde (GVK, KVK, KDVK, VUK, AATUHK, ÖTVK…); tarife ve istisna tutarları sorudaki verilere göre; hesap adımları tam.
- **HUK**: TTK, TBK, İş Kanunu, 5510, İYUK; madde numarası kesin biliniyorsa yazılır, değilse kurum adı ve kural.
- **MH**: 3568 sayılı Kanun, Disiplin Yönetmeliği, Çalışma Usul ve Esasları Yönetmeliği, Staj Yönetmeliği.
- **SPK**: 6362 sayılı SPKn ve ilgili tebliğ (II-, III- serisi) adı.

Anahtarla çelişki protokolü: çözüm hesabı/muhakemesi resmi anahtardan farklı sonuç veriyorsa, önce kendi çözümünü iki kez kontrol et; yine farklıysa `review` dosyasına "ANAHTAR ÇELİŞKİSİ: <gerekçe>" yaz, çözümü `sonuc` resmi anahtar olacak şekilde yazma, dosyaya ekleme ve kullanıcıya raporla. `validate.py` o soruyu "çözüm yok" diye işaretleyecektir. Kullanıcı kararına kadar yayın yapılabilmesi için `tools/validate.py`'ye şu değişikliği ekle: `validate(app_dir, allow_missing=())` imzası; `if not s:` dalında `qid in allow_missing` ise hata yerine `warns` listesine yaz; `__main__` bölümünde `--allow-missing id1,id2` argümanını `sys.argv`'den oku, uyarıları "UYARI:" önekiyle yazdır, çıkış kodunu yalnızca hatalara göre ver. Uygulama tarafında `question-view.js` çözümü olmayan soruda zaten "Bu soru için çözüm henüz eklenmedi." gösterir.

- [ ] 2026-1-FM  - [ ] 2026-1-FTA  - [ ] 2026-1-HUK  - [ ] 2026-1-MH  - [ ] 2026-1-DEN  - [ ] 2026-1-SPK  - [ ] 2026-1-VER
- [ ] 2026-2-FM  - [ ] 2026-2-MAL  - [ ] 2026-2-FTA  - [ ] 2026-2-HUK  - [ ] 2026-2-MH  - [ ] 2026-2-DEN  - [ ] 2026-2-SPK  - [ ] 2026-2-VER

Her dosya sonrası: `python tools/validate.py | grep <donem>-<ders>` boş; commit `git commit -m "İçerik: <donem> <ders> çözümleri"`. Tamamlanınca `python tools/validate.py` yalnızca konu dosyası hataları vermeli (Task 23'e kadar).

---

## Faz I — Maliyet Muhasebesi konu modülü

### Task 21: Görsel bileşenleri (visuals.js)

**Files:**
- Create: `app/js/visuals.js`, `tests/visuals.test.js`

**Interfaces:**
- `renderVisual(gorsel) → HTMLElement` (`div.visual`). `gorsel = { tip, veri }`:
  - `svg-static`: `veri.svg` (inline `<svg …>` metni, `viewBox` zorunlu) → aynen eklenir.
  - `flow`: `veri = { w, h, dugumler: [{ id, etiket, x, y, w?, h? }], oklar: [{ from, to, etiket? }] }` → kutular ve oklar (SVG).
  - `cvp-interactive`: `veri = { fiyat, bdm, sabit, maxMiktar }` → üç kaydırıcı (fiyat, birim değişken maliyet, sabit maliyet), toplam gelir ve toplam maliyet doğruları, başabaş noktası işaretli; altında metin: "Başabaş = Sabit / (Fiyat − BDM) = … birim; … ₺".
  - `allocation-table`: `veri = { basliklar: [..], satirlar: [[..]], adimlar: [{ hucreler: [[r, c], …], aciklama }] }` → tablo + "Sonraki adım" düğmesi; her adımda ilgili hücreler vurgulanır ve açıklama gösterilir.
  - `variance-tree`: `veri = { etiket, deger, cocuklar: [...] }` (özyinelemeli) → iç içe kutular (HTML), olumlu/olumsuz renk (`deger` "(O)"/"(A)" sonekine veya işaretine göre).
- `bepHesapla({ fiyat, bdm, sabit }) → { birim, tutar }` (saf; fiyat ≤ bdm ise `null`).

- [ ] **Step 1: Test**

`tests/visuals.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './dom.js';
setupDom();
const { renderVisual, bepHesapla } = await import('../app/js/visuals.js');

test('başabaş hesabı', () => {
  assert.deepEqual(bepHesapla({ fiyat: 50, bdm: 30, sabit: 10000 }), { birim: 500, tutar: 25000 });
  assert.equal(bepHesapla({ fiyat: 30, bdm: 30, sabit: 10000 }), null);
});

test('flow düğüm ve ok çizer', () => {
  const el = renderVisual({ tip: 'flow', veri: { w: 300, h: 100, dugumler: [{ id: 'a', etiket: '150 İlk Madde', x: 10, y: 10 }, { id: 'b', etiket: '710 DİMM', x: 160, y: 10 }], oklar: [{ from: 'a', to: 'b', etiket: 'tüketim' }] } });
  assert.equal(el.querySelectorAll('svg rect').length, 2);
  assert.equal(el.querySelectorAll('svg line').length, 1);
  assert.ok(el.textContent.includes('tüketim'));
});

test('cvp etkileşimli: kaydırıcı değişince metin güncellenir', () => {
  const el = renderVisual({ tip: 'cvp-interactive', veri: { fiyat: 50, bdm: 30, sabit: 10000, maxMiktar: 1000 } });
  assert.ok(el.textContent.includes('500 birim'));
  const sabit = el.querySelector('input[data-key="sabit"]');
  sabit.value = '20000'; sabit.dispatchEvent(new Event('input', { bubbles: true }));
  assert.ok(el.textContent.includes('1.000 birim'));
});

test('allocation-table adım adım vurgular', () => {
  const el = renderVisual({ tip: 'allocation-table', veri: { basliklar: ['', 'A', 'B'], satirlar: [['GÜG', '100', '200']], adimlar: [{ hucreler: [[0, 1]], aciklama: 'A payı' }, { hucreler: [[0, 2]], aciklama: 'B payı' }] } });
  const btn = el.querySelector('button');
  btn.click();
  assert.ok(el.querySelector('td.vurgu').textContent.includes('100'));
  assert.ok(el.textContent.includes('A payı'));
  btn.click();
  assert.ok(el.querySelector('td.vurgu').textContent.includes('200'));
});

test('variance-tree iç içe kutular', () => {
  const el = renderVisual({ tip: 'variance-tree', veri: { etiket: 'Toplam DİMM sapması', deger: '−500 (A)', cocuklar: [{ etiket: 'Fiyat', deger: '−800 (A)' }, { etiket: 'Miktar', deger: '+300 (O)' }] } });
  assert.equal(el.querySelectorAll('.vt-node').length, 3);
  assert.ok(el.querySelector('.vt-node.olumlu'));
});

test('bilinmeyen tip boş değil, çökmez', () => {
  assert.ok(renderVisual({ tip: 'yok', veri: {} }).textContent.length > 0);
});
```

Run: `npm test -- tests/visuals.test.js`
Expected: FAIL.

- [ ] **Step 2: visuals.js**

```js
// app/js/visuals.js — konu görselleri
import { h } from './ui.js';
const NS = 'http://www.w3.org/2000/svg';
const fmt = (n) => Math.round(n).toLocaleString('tr-TR');
function svgEl(tag, attrs = {}, text) { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (text !== undefined) e.textContent = text; return e; }

export function bepHesapla({ fiyat, bdm, sabit }) {
  if (fiyat <= bdm) return null;
  const birim = sabit / (fiyat - bdm);
  return { birim: Math.round(birim * 100) / 100, tutar: Math.round(birim * fiyat * 100) / 100 };
}

function flow({ w = 600, h = 300, dugumler = [], oklar = [] }) {
  const svg = svgEl('svg', { viewBox: `0 0 ${w} ${h}`, role: 'img' });
  const defs = svgEl('defs'); const m = svgEl('marker', { id: 'arr', viewBox: '0 0 10 10', refX: 10, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto-start-reverse' });
  m.append(svgEl('path', { d: 'M0,0 L10,5 L0,10 z', fill: 'currentColor' })); defs.append(m); svg.append(defs);
  const pos = {};
  for (const d of dugumler) {
    const bw = d.w ?? 130, bh = d.h ?? 44; pos[d.id] = { cx: d.x + bw / 2, cy: d.y + bh / 2, bw, bh };
    svg.append(svgEl('rect', { x: d.x, y: d.y, width: bw, height: bh, rx: 8, fill: 'var(--surface)', stroke: 'var(--primary)', 'stroke-width': 1.5 }));
    svg.append(svgEl('text', { x: d.x + bw / 2, y: d.y + bh / 2 + 4, 'text-anchor': 'middle', 'font-size': 12, fill: 'var(--text)' }, d.etiket));
  }
  for (const o of oklar) {
    const a = pos[o.from], b = pos[o.to]; if (!a || !b) continue;
    const dx = b.cx - a.cx, dy = b.cy - a.cy;
    const x1 = a.cx + Math.sign(dx) * (Math.abs(dx) > Math.abs(dy) ? a.bw / 2 : 0), y1 = a.cy + Math.sign(dy) * (Math.abs(dx) > Math.abs(dy) ? 0 : a.bh / 2);
    const x2 = b.cx - Math.sign(dx) * (Math.abs(dx) > Math.abs(dy) ? b.bw / 2 : 0), y2 = b.cy - Math.sign(dy) * (Math.abs(dx) > Math.abs(dy) ? 0 : b.bh / 2);
    svg.append(svgEl('line', { x1, y1, x2, y2, stroke: 'currentColor', 'stroke-width': 1.5, 'marker-end': 'url(#arr)' }));
    if (o.etiket) svg.append(svgEl('text', { x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 6, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--muted)' }, o.etiket));
  }
  return svg;
}

function cvp(veri) {
  const st = { fiyat: veri.fiyat, bdm: veri.bdm, sabit: veri.sabit }, max = veri.maxMiktar || 1000;
  const W = 600, H = 320, L = 50, B = 280;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}` });
  const out = h('p', {});
  const slider = (key, label, min, mx, step) => h('label', { class: 'field' }, `${label}: `, h('strong', { 'data-out': key }, fmt(st[key])), h('input', { type: 'range', 'data-key': key, min, max: mx, step, value: st[key], onInput: (e) => { st[key] = +e.target.value; draw(); } }));
  function draw() {
    svg.innerHTML = '';
    const maxY = Math.max(st.fiyat * max, st.sabit + st.bdm * max) || 1;
    const X = (q) => L + (q / max) * (W - L - 10), Y = (v) => B - (v / maxY) * (B - 20);
    svg.append(svgEl('line', { x1: L, y1: B, x2: W - 10, y2: B, stroke: 'currentColor' }), svgEl('line', { x1: L, y1: 20, x2: L, y2: B, stroke: 'currentColor' }));
    svg.append(svgEl('line', { x1: X(0), y1: Y(0), x2: X(max), y2: Y(st.fiyat * max), stroke: 'var(--ok)', 'stroke-width': 2 }));
    svg.append(svgEl('line', { x1: X(0), y1: Y(st.sabit), x2: X(max), y2: Y(st.sabit + st.bdm * max), stroke: 'var(--err)', 'stroke-width': 2 }));
    svg.append(svgEl('line', { x1: X(0), y1: Y(st.sabit), x2: X(max), y2: Y(st.sabit), stroke: 'var(--muted)', 'stroke-dasharray': '4 4' }));
    svg.append(svgEl('text', { x: X(max) - 4, y: Y(st.fiyat * max) - 6, 'text-anchor': 'end', 'font-size': 11, fill: 'var(--ok)' }, 'Toplam gelir'));
    svg.append(svgEl('text', { x: X(max) - 4, y: Y(st.sabit + st.bdm * max) + 14, 'text-anchor': 'end', 'font-size': 11, fill: 'var(--err)' }, 'Toplam maliyet'));
    svg.append(svgEl('text', { x: L + 4, y: Y(st.sabit) - 4, 'font-size': 11, fill: 'var(--muted)' }, 'Sabit maliyet'));
    const bep = bepHesapla(st);
    if (bep && bep.birim <= max) {
      svg.append(svgEl('circle', { cx: X(bep.birim), cy: Y(bep.tutar), r: 6, fill: 'var(--accent)', stroke: 'currentColor' }));
      svg.append(svgEl('text', { x: X(bep.birim) + 8, y: Y(bep.tutar) - 8, 'font-size': 12, fill: 'var(--text)' }, 'Başabaş'));
    }
    svg.append(svgEl('text', { x: W / 2, y: H - 4, 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--muted)' }, 'Miktar (birim)'));
    for (const k of Object.keys(st)) { const o = wrap.querySelector(`[data-out="${k}"]`); if (o) o.textContent = fmt(st[k]); }
    out.textContent = bep ? `Başabaş = Sabit / (Fiyat − BDM) = ${fmt(st.sabit)} / (${fmt(st.fiyat)} − ${fmt(st.bdm)}) = ${fmt(bep.birim)} birim; ${fmt(bep.tutar)} ₺ satış tutarı.` : 'Fiyat birim değişken maliyeti aşmıyor: katkı payı yok, başabaş noktası yok.';
  }
  const wrap = h('div', {}, svg, slider('fiyat', 'Satış fiyatı', 1, veri.fiyat * 3, 1), slider('bdm', 'Birim değişken maliyet', 0, veri.fiyat * 3, 1), slider('sabit', 'Sabit maliyet', 0, veri.sabit * 4, Math.max(1, Math.round(veri.sabit / 100))), out);
  draw();
  return wrap;
}

function allocation({ basliklar = [], satirlar = [], adimlar = [] }) {
  let i = -1;
  const table = h('table', { class: 'veri' }, h('tr', {}, ...basliklar.map(b => h('th', { class: 'n' }, b))), ...satirlar.map(r => h('tr', {}, ...r.map((c, ci) => h('td', { class: ci ? 'n' : '' }, c)))));
  const note = h('p', { class: 'muted' }, adimlar.length ? 'Adımları görmek için "Sonraki adım"a dokun.' : '');
  const btn = h('button', { class: 'btn btn-small', onClick: () => {
    i = (i + 1) % adimlar.length;
    table.querySelectorAll('td.vurgu').forEach(td => td.classList.remove('vurgu'));
    for (const [r, c] of adimlar[i].hucreler) table.rows[r + 1]?.cells[c]?.classList.add('vurgu');
    note.textContent = `${i + 1}/${adimlar.length}: ${adimlar[i].aciklama}`;
  } }, 'Sonraki adım');
  return h('div', {}, table, adimlar.length ? btn : null, note);
}

function tree(node) {
  const neg = /\(A\)|^[−-]/.test(String(node.deger ?? '')), pos = /\(O\)|^\+/.test(String(node.deger ?? ''));
  return h('div', { class: 'vt-node' + (neg ? ' olumsuz' : pos ? ' olumlu' : '') },
    h('div', { class: 'vt-box' }, h('strong', {}, node.etiket), node.deger !== undefined ? h('div', {}, String(node.deger)) : null),
    node.cocuklar?.length ? h('div', { class: 'vt-children' }, ...node.cocuklar.map(tree)) : null);
}

export function renderVisual(gorsel) {
  const wrap = h('div', { class: 'visual' });
  try {
    const { tip, veri = {} } = gorsel || {};
    if (tip === 'svg-static') wrap.innerHTML = veri.svg || '';
    else if (tip === 'flow') wrap.append(flow(veri));
    else if (tip === 'cvp-interactive') wrap.append(cvp(veri));
    else if (tip === 'allocation-table') wrap.append(allocation(veri));
    else if (tip === 'variance-tree') wrap.append(tree(veri));
    else wrap.append(h('p', { class: 'muted' }, 'Görsel gösterilemiyor.'));
  } catch { wrap.append(h('p', { class: 'muted' }, 'Görsel gösterilemiyor.')); }
  return wrap;
}
```

`app/css/components.css` sonuna ekle:

```css
td.vurgu { background: color-mix(in srgb, var(--accent) 35%, var(--surface)); font-weight: 600; }
.vt-node { margin: 6px 0; } .vt-box { display: inline-block; border: 1px solid var(--border); border-radius: 8px; padding: 6px 10px; background: var(--surface); }
.vt-node.olumlu > .vt-box { border-color: var(--ok); } .vt-node.olumsuz > .vt-box { border-color: var(--err); }
.vt-children { margin-left: 18px; padding-left: 12px; border-left: 2px solid var(--border); }
```

Run: `npm test -- tests/visuals.test.js`
Expected: 6 PASS.

- [ ] **Step 3: Commit**

```bash
git add app/js/visuals.js tests/visuals.test.js app/css/components.css
git commit -m "Konu görselleri" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 22: Konular ekranı (topics.js)

**Files:**
- Create: `app/js/screens/topics.js`

**Interfaces:**
- `#/topics`: 14 konu listesi; okunmuş işareti `settings['topic:read:<kod>'] = true`.
- `#/topics/<kod>`: konu sayfası. Örneklerde S Pen alanı `ink` anahtarı `konu:<kod>:ornek:<i>`; "Konu kartlarını ekle" → `addInfoCards({ kaynakId: 'konu:' + kod, kartlar })`.

- [ ] **Step 1: topics.js**

```js
// app/js/screens/topics.js
import { h, toast } from '../ui.js';
import { renderVisual } from '../visuals.js';
import { createInk } from '../ink.js';
import * as fsrs from '../fsrs.js';
import { addInfoCards, examDateMs } from '../progress.js';

const inks = [];
export function destroy() { inks.splice(0).forEach(i => i.destroy()); }

export async function render(view, params, ctx) {
  const { db, data } = ctx;
  const topics = await data.loadTopics();
  if (!params.kod) {
    view.append(h('h1', {}, 'Maliyet Muhasebesi'), h('p', { class: 'muted' }, 'Sınav odaklı 14 konu. Her konunun sonunda çıkmış sorular ve bilgi kartları var.'));
    for (const t of topics) {
      const okundu = await db.getSetting('topic:read:' + t.kod, false);
      view.append(h('a', { class: 'card', href: '#/topics/' + t.kod, style: 'display:block;text-decoration:none;color:inherit' },
        h('div', { class: 'row', style: 'justify-content:space-between' }, h('strong', {}, `${t.sira}. ${t.baslik}`), h('span', { class: 'badge' }, okundu ? 'Okundu' : `${t.cikmisSorular.length} çıkmış soru`)),
        h('p', { class: 'muted', style: 'margin:4px 0 0' }, t.amac)));
    }
    if (!topics.length) view.append(h('p', { class: 'card' }, 'Konu içeriği henüz eklenmedi.'));
    return;
  }
  const t = topics.find(x => x.kod === params.kod);
  if (!t) { view.append(h('p', { class: 'card' }, 'Konu bulunamadı.')); return; }
  const examDate = await examDateMs(db);
  view.append(h('a', { href: '#/topics', class: 'muted' }, '‹ Konular'), h('h1', {}, `${t.sira}. ${t.baslik}`), h('p', {}, h('em', {}, t.amac)));
  for (const b of t.bolumler) {
    view.append(h('div', { class: 'card' }, h('h3', {}, b.baslik), h('div', { html: b.html }), b.gorsel ? renderVisual(b.gorsel) : null));
  }
  if (t.sinavYaklasimi?.length) view.append(h('div', { class: 'card', style: 'border-color:var(--accent)' }, h('h3', {}, 'Sınav yaklaşımı'), h('ul', {}, ...t.sinavYaklasimi.map(s => h('li', {}, s)))));
  for (let i = 0; i < (t.ornekler || []).length; i++) {
    const o = t.ornekler[i]; const key = `konu:${t.kod}:ornek:${i}`;
    const ink = createInk({ strokes: await db.getInk(key), height: 260, onChange: (s) => db.saveInk(key, s) }); inks.push(ink);
    const sol = h('div', { hidden: true }, ...o.cozum.map(c => h('div', { class: 'step', html: c })));
    view.append(h('div', { class: 'card' }, h('h3', {}, `Örnek ${i + 1}`), h('div', { html: o.soru }), h('p', { class: 'muted' }, 'Önce kendin çöz:'), ink.el,
      h('button', { class: 'btn btn-small', style: 'margin-top:8px', onClick: (e) => { sol.hidden = false; e.currentTarget.remove(); } }, 'Çözümü göster'), sol));
  }
  if (t.cikmisSorular?.length) view.append(h('div', { class: 'card' }, h('h3', {}, 'Bu konudan çıkmış sorular'),
    ...t.cikmisSorular.map(id => h('a', { class: 'stat-row', href: '#/study/q/' + id, style: 'text-decoration:none;color:inherit' }, h('span', {}, id), h('span', { class: 'muted' }, 'Çöz ›')))));
  view.append(h('div', { class: 'row', style: 'margin:12px 0 24px' },
    h('button', { class: 'btn btn-primary', onClick: async () => { const n = await addInfoCards({ db, fsrs, kaynakId: 'konu:' + t.kod, kartlar: t.kartlar || [], examDate }); toast(n ? `${n} kart eklendi.` : 'Kartlar zaten ekli.'); } }, `Konu kartlarını ekle (${(t.kartlar || []).length})`),
    h('button', { class: 'btn', onClick: async () => { await db.setSetting('topic:read:' + t.kod, true); toast('Okundu olarak işaretlendi.'); } }, 'Okudum')));
}
```

- [ ] **Step 2: Örnek konu dosyasıyla duman testi**

Task 23 Step 1'deki `10-maliyet-hacim-kar.json` dosyasını önce yaz (etkileşimli grafik içerir), `#/topics/10-maliyet-hacim-kar` aç.
Expected: bölümler, kaydırıcılı başabaş grafiği, örnekte çizim alanı, çıkmış soru bağlantısı çalışma ekranına gider, "Konu kartlarını ekle" kart ekler.

- [ ] **Step 3: Commit**

```bash
git add app/js/screens/topics.js
git commit -m "Konular ekranı" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

### Task 23: 14 konu içeriği

**Files:**
- Create: `app/data/topics/maliyet/<kod>.json` (14)

Her dosya spec §5.4 biçimindedir. Doğruluk kuralı: her konudaki yöntem, o konuya etiketli resmi sorular (`app/data/questions/2026-*-MAL.json` içinde `konu` eşleşenler) üzerinde çalıştırılır; sonuç anahtarla eşleşmiyorsa anlatım düzeltilir, yine eşleşmiyorsa `sinavYaklasimi` kutusunda açıkça yazılır. `cikmisSorular` listesi bu kontrolün kaydıdır ve boş bırakılmaz (bir konuya hiç soru düşmediyse en yakın konudan soru bağlanır ve bu durum `sinavYaklasimi`'nda belirtilir). Her konu: 3-6 bölüm, en az 1 görsel, 1-2 örnek (çözüm adımları tam sayısal), 3-5 kart. Konu başına 600-1200 kelime; tanımlar kesin, formüller ayrı satırda `<p><strong>…</strong></p>` içinde.

Konu bazında zorunlu içerik ve görsel:

- [ ] **01-maliyet-kavramlari** — Harcama / maliyet / gider / zarar ayrımı; üretim maliyeti unsurları (DİMM, Dİ, GÜG); ilk maliyet ve dönüşüm maliyeti; davranışa göre sabit / değişken / karma (yarı değişken, yarı sabit) ve ilgili aralık; kontrol edilebilirlik; fırsat maliyeti, batık maliyet. Görsel `svg-static`: maliyet davranış grafikleri (dört küçük panel). Örnek: ilk ve dönüşüm maliyeti hesabı. Kartlar: 4.
- [ ] **02-maliyet-akisi-7a-7b** — Maliyet akışı (150 → 710 → 711 → 151 → 152 → 620); 7/A seçeneği: fonksiyon esaslı gider hesapları (710, 720, 730, 740, 750, 760, 770, 780), yansıtma hesapları (711, 721, 731, 741…), dönem sonu kapatma; 7/B seçeneği: gider çeşitleri (790-797) ve 798 Gider Çeşitleri Yansıtma, 799 Üretim Maliyet Hesabı; eş zamanlı kayıt yöntemi. Görsel `flow`: hesaplar arası akış şeması (düğümler: 150, 710, 711, 720, 721, 730, 731, 151, 152, 620). Örnek: dönem sonu yansıtma ve kapatma kayıtları. Kartlar: 5.
- [ ] **03-direkt-ilk-madde-malzeme** — Stok hareketleri, stok değerleme yöntemleri (FIFO, ağırlıklı ortalama, hareketli ortalama; LIFO'nun VUK'ta kullanılmaması), fire ve kayıplar (normal: maliyete; anormal: 689 Diğer Olağan Dışı Gider ve Zarar), üretime sevk kaydı. Görsel `allocation-table`: hareketli ortalama stok kartı adım adım. Örnek: FIFO ve ağırlıklı ortalamayla tüketim maliyeti. Kartlar: 4.
- [ ] **04-direkt-iscilik** — Direkt / endirekt işçilik; normal ücret, fazla mesai primi (direkt mi GÜG mü: belirli siparişten kaynaklanıyorsa direkt, genel yoğunluktan kaynaklanıyorsa GÜG), boşa geçen zaman (GÜG; anormal ise dönem gideri), izin ve ikramiye karşılıkları, işveren SGK payı. Görsel `svg-static`: işçilik ücretinin dağılım ağacı. Örnek: fazla mesaili bordro dağılımı. Kartlar: 4.
- [ ] **05-genel-uretim-giderleri-dagitim** — GÜG kapsamı; gider yerleri (esas üretim, yardımcı üretim, yardımcı hizmet, üretim yerleri yönetimi); 1. dağıtım (gider türlerinin gider yerlerine), 2. dağıtım (yardımcı gider yerlerinin esas gider yerlerine: doğrudan, kademeli, matematiksel/karşılıklı), 3. dağıtım (mamullere yükleme: yükleme oranı = bütçelenmiş GÜG / bütçelenmiş faaliyet hacmi); kapasite kavramları (teorik, pratik, normal, beklenen); eksik/fazla yükleme ve kapatılması. Görsel `allocation-table`: kademeli dağıtım tablosu adım adım. Örnek: yükleme oranı ve eksik/fazla yükleme hesabı (2026-1-MAL-02 benzeri). Kartlar: 5.
- [ ] **06-siparis-maliyeti** — Sipariş maliyet kartı, DİMM ve Dİ'nin siparişe doğrudan, GÜG'ün yükleme oranıyla yüklenmesi; tamamlanan siparişlerin 152'ye devri; birim maliyet. Görsel `flow`: sipariş kartına üç unsurun akışı. Örnek: iki siparişli dönem; mamul maliyeti ve dönem sonu yarı mamul. Kartlar: 3.
- [ ] **07-safha-maliyeti** — Safha kavramı, miktar dengesi (üretime giren = tamamlanan + dönem sonu yarı mamul + fire), eşdeğer birim (ağırlıklı ortalama ve FIFO), birim maliyet, maliyet dağılımı (tamamlanan ve devredilen / dönem sonu yarı mamul), normal fire (tamamlananlara ve yarı mamullere yüklenir; sınav kitapçıklarında çoğunlukla sadece sağlam mamullere) ve anormal fire (dönem gideri); kademeli safhada önceki safhadan devralınan maliyet. Görsel `svg-static`: miktar dengesi ve eşdeğer birim tablosu şeması. Örnek: ağırlıklı ortalama yöntemiyle tam çözüm (miktar dengesi, eşdeğer birim, birim maliyet, dağılım). `sinavYaklasimi`: fire yüklemesinde kullanılan yaklaşım ve FIFO/ortalama farkı. Kartlar: 5.
- [ ] **08-birlesik-yan-urun** — Birleşik (ortak) maliyet, ayrılma noktası, ortak maliyetin dağıtımı: fiziksel ölçü, satış değeri (ayrılma noktasında), net gerçekleşebilir değer, sabit brüt kâr oranı; yan ürün muhasebesi (satış geliri ortak maliyetten düşülür / diğer gelir). Görsel `allocation-table`: satış değeri yöntemi dağıtımı adım adım (2026-1-MAL-05 verisi). Örnek: aynı veri ile NGD yöntemi. Kartlar: 4.
- [ ] **09-standart-maliyet-sapma** — Standart maliyet kavramı; DİMM fiyat ve miktar sapması; Dİ ücret ve verimlilik (süre) sapması; GÜG sapmaları: iki sapma (kontrol edilebilir, hacim), üç sapma (bütçe/harcama, verimlilik, kapasite), dört sapma (değişken harcama, değişken verimlilik, sabit harcama, hacim); olumlu/olumsuz işareti. Görsel `variance-tree`: toplam sapma ağacı (DİMM, Dİ, GÜG dört sapma). Örnek: DİMM ve Dİ sapmaları tam hesap. `sinavYaklasimi`: sapma formüllerinde (standart − fiili) işaret kuralı. Kartlar: 5.
- [ ] **10-maliyet-hacim-kar** — Katkı payı, katkı oranı, başabaş noktası (birim ve tutar), hedef kâr için satış, güvenlik marjı ve oranı, faaliyet kaldıracı derecesi, çoklu mamulde ağırlıklı katkı payı; MHK varsayımları (2026-1-MAL-07). Görsel `cvp-interactive` (`veri: { fiyat: 50, bdm: 30, sabit: 10000, maxMiktar: 1000 }`). Örnek: başabaş, hedef kâr, güvenlik marjı. Kartlar: 5.
- [ ] **11-maliyet-yontemleri** — Kapsama göre: tam (full), normal, değişken (direkt), asal maliyet yöntemi; stok değerinde ve dönem kârında fark (üretim ≠ satış durumunda); sabit GÜG'ün dönem gideri/ürün maliyeti ayrımı; normal maliyette kapasite sapması. Görsel `allocation-table`: aynı veriyle dört yöntemde birim maliyet karşılaştırması. Örnek: tam ve değişken maliyet kârı farkı = sabit GÜG × stok değişimi. Kartlar: 4.
- [ ] **12-butceleme-esnek-butce** — Bütçe türleri (satış, üretim, DİMM, Dİ, GÜG, nakit, proforma tablolar); statik ve esnek bütçe; esnek bütçe sapması ve satış hacmi sapması; üretim bütçesi = satış + dönem sonu stok − dönem başı stok. Görsel `allocation-table`: esnek bütçe üç hacim düzeyi. Örnek: üretim ve DİMM alım bütçesi hesabı. Kartlar: 4.
- [ ] **13-karar-verme-ilgili-maliyet** — İlgili (geçerli) maliyet, batık maliyet, fırsat maliyeti; üret/satın al, özel sipariş kabulü (atıl kapasite varsa katkı payı), bir mamulü/bölümü kapatma (kaçınılabilir sabit maliyet), kısıtlı kaynakta kısıt birimi başına katkı payı, ek işleme/sat kararı. Görsel `svg-static`: karar ağacı (özel sipariş). Örnek: kısıtlı makine saatinde ürün sıralaması. Kartlar: 4.
- [ ] **14-faaliyet-tabanli-maliyetleme** — Faaliyet, maliyet havuzu, maliyet etkeni (sürücü); faaliyet oranı = havuz maliyeti / etken miktarı; geleneksel yöntemle fark; faaliyet hiyerarşisi (birim, parti, mamul, tesis düzeyi). Görsel `flow`: kaynaklar → faaliyetler → mamuller. Örnek: 2026-1-MAL-04 verisiyle yükleme oranları ve bir mamule yükleme. Kartlar: 4.

Her konu sonrası: `python tools/validate.py | grep "konu <kod>"` boş; `#/topics/<kod>` tarayıcıda açılır; commit `git commit -m "Konu: <kod>"`.

---

## Faz J — Yayın

### Task 24: GitHub Pages yayını ve cihaz testi

**Files:**
- Create: `tools/deploy.sh`, `README.md`
- Modify: `docs/cihaz-kontrol.md`

- [ ] **Step 1: gh kurulumu ve oturum**

```powershell
winget install --id GitHub.cli -e --accept-source-agreements --accept-package-agreements
gh auth login --web --git-protocol https
gh auth status
```
Expected: "Logged in to github.com". (Kullanıcının tarayıcıda kodu onaylaması gerekir; bu adım kullanıcıyla birlikte yapılır.)

- [ ] **Step 2: Depo oluştur ve ana dalı gönder**

```bash
gh repo create smmm-sinav-kocu --public --source . --remote origin --push
```
Expected: `https://github.com/<kullanici>/smmm-sinav-kocu` oluşur. Not: GitHub Pages ücretsiz planda yalnızca herkese açık depoda çalışır; sorular zaten kamuya açık resmi kitapçıklardır.

- [ ] **Step 3: deploy.sh**

```bash
#!/usr/bin/env bash
# Doğrula, önbellek listesini üret, test et, gh-pages dalına yayınla.
set -euo pipefail
cd "$(dirname "$0")/.."
python tools/validate.py
python tools/build_sw_manifest.py
npm test
git add -A
git commit -qm "Yayın: $(date +%F)" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" || true
git push origin main
git subtree split --prefix app -b gh-pages-tmp
git push -f origin gh-pages-tmp:gh-pages
git branch -D gh-pages-tmp
echo "Yayınlandı: https://$(gh api user -q .login).github.io/smmm-sinav-kocu/"
```

Run: `bash tools/deploy.sh` ardından Pages kaynağını ayarla:

```bash
gh api -X POST repos/{owner}/smmm-sinav-kocu/pages -f build_type=legacy -f "source[branch]=gh-pages" -f "source[path]=/" 
```
(Zaten ayarlıysa `-X PUT` ile aynı gövde.) 1-2 dakika sonra `https://<kullanici>.github.io/smmm-sinav-kocu/` açılır.

- [ ] **Step 4: README.md**

```markdown
# SMMM Sınav Koçu

28 Kasım 2026 SMMM Yeterlilik Sınavı için offline çalışan PWA. 2026/1 ve 2026/2 resmi test soruları, doğrulanmış çözümler, FSRS aralıklı tekrar, deneme simülasyonu, S Pen çözüm alanı, Maliyet Muhasebesi konu modülü.

## Kurulum (telefon)
1. Chrome'da yayın adresini aç.
2. Menü → "Ana ekrana ekle".
3. İlk açılış internetle; sonrası internetsiz çalışır.

## Geliştirme
- `npm install && npm test` (JS testleri), `python -m pytest tools -q` (Python testleri)
- `npm run serve` → http://localhost:8080
- İçerik doğrulama: `python tools/validate.py`
- Yayın: `bash tools/deploy.sh`

## Kaynak
Sorular TÜRMOB-TESMER resmi soru kitapçıklarından (bkz. `app/data/index.json` → kaynaklar). Çözümler bu proje için yazılmış ve resmi cevap anahtarıyla doğrulanmıştır.
```

- [ ] **Step 5: Cihaz testi**

`docs/cihaz-kontrol.md` listesini Galaxy S23 Ultra'da uygula ve işaretle:

```
- [ ] Ana ekrana ekle çalıştı, tam ekran açılıyor
- [ ] Uçak modunda açılıyor; soru, görüntü ve konu sayfaları yükleniyor
- [ ] S Pen basınç, avuç reddi, yan düğme silgi
- [ ] Deneme sırasında uygulamadan çıkıp dönünce sayaç doğru
- [ ] Yedekle dosyayı indiriyor, geri yükle çalışıyor
- [ ] Yazı boyutu "Çok büyük" ile yevmiye tabloları taşmıyor (yatay kaydırma yok)
- [ ] Koyu tema okunaklı
```

- [ ] **Step 6: Commit**

```bash
git add tools/deploy.sh README.md docs/cihaz-kontrol.md
git commit -m "Yayın betiği ve belgeler" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
git push origin main
```
