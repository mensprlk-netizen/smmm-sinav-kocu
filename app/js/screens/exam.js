// app/js/screens/exam.js
import { h, toast, confirm, fmtSure, fmtPuan, sheet, safe, kayitHatasi } from '../ui.js';
import { createQuestionView } from './question-view.js';
import * as X from '../exam.js';
import { startExam } from '../examflow.js';
import * as fsrs from '../fsrs.js';
import { DERSLER, DONEMLER, dersAdi } from '../data.js';
import { examDateMs, scheduleForReview, addInfoCards, tagLastAnswer } from '../progress.js';

let timer = null, qv = null;
let epoch = 0;   // destroy() bumps it; in-flight work from an older epoch stops
let seq = 0;     // each show() bumps it; only the newest transition may attach a view
export function destroy() { epoch++; seq++; clearInterval(timer); timer = null; qv?.destroy(); qv = null; }

export async function render(view, params, ctx) {
  if (params.stage === 'run') return runExam(view, params.id, ctx);
  if (params.stage === 'result') return showResult(view, params.id, ctx);
  if (params.stage === 'review') return reviewWrong(view, params.id, ctx);
  return setup(view, ctx);
}

const clampInt = (v, lo, hi, def) => { const n = parseInt(v, 10); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : def; };

// One answer row per answered question; blank questions write none.
function examRows(s, byId, id) {
  const rows = [];
  for (const qid of s.soruIdler) {
    const q = byId[qid]; const c = s.cevaplar[qid];
    if (c && q) rows.push({ soruId: qid, cevap: c, dogruMu: c === q.dogru, emin: true, sure: 0, mod: 'exam', denemeId: id });
  }
  return rows;
}

const notFound = (view) => view.append(h('p', { class: 'card' }, 'Deneme bulunamadı.'));

async function setup(view, ctx) {
  const { db, data } = ctx;
  const ep = epoch;
  const unfinished = (await db.allExams()).find(e => !e.bittiMi);
  if (ep !== epoch) return;
  if (unfinished) view.append(h('div', { class: 'card' }, h('h3', {}, 'Yarım kalan deneme var'), h('div', { class: 'row' },
    h('a', { class: 'btn btn-primary', href: '#/exam/run/' + unfinished.denemeId }, 'Devam et'),
    h('button', { class: 'btn', onClick: safe(async () => {
      if (!(await confirm('Yarım kalan deneme silinsin mi?'))) return;
      await db.del('exams', unfinished.denemeId);
      if (ep !== epoch) return;
      view.innerHTML = '';
      await setup(view, ctx);
    }) }, 'Sil'))));

  const dersSel = h('select', {}, ...DERSLER.map(d => h('option', { value: d.kod }, d.ad)));
  const donemSel = h('select', {}, h('option', { value: 'karisik' }, 'İki dönemden rastgele 20'), ...DONEMLER.map(d => h('option', { value: d }, d + ' resmi seti')));
  const oturumSel = h('select', {}, h('option', { value: '1' }, '1. oturum: FM, MAL, HUK, SPK'), h('option', { value: '2' }, '2. oturum: FTA, DEN, VER, MH'));
  const ozelDers = DERSLER.map(d => h('label', { class: 'chip' }, h('input', { type: 'checkbox', value: d.kod, style: 'margin-right:6px' }), d.ad));
  const adetIn = h('input', { type: 'number', value: 20, min: 5, max: 160 });
  const sureIn = h('input', { type: 'number', value: 45, min: 5, max: 240 });

  let starting = false; // a start is in progress; ignore double taps
  // pick() loads and selects the questions; start() then creates and saves the exam.
  const go = (tur, sureDk, pick) => async () => {
    if (starting) return;
    starting = true;
    try {
      let sorular;
      try { sorular = await pick(); } catch { if (ep === epoch) toast('Sorular yüklenemedi.'); return; }
      if (ep !== epoch) return;
      await startExam({ db, navigate: ctx.navigate, tur, sorular, sureDk, alive: () => ep === epoch });
    } finally { starting = false; }
  };

  view.append(h('h1', {}, 'Deneme'),
    h('div', { class: 'card' }, h('h3', {}, 'Tek ders'), h('p', { class: 'muted' }, '20 soru, 45 dakika, 5 şık. Her yanlış 0,25 doğruyu götürür.'),
      h('label', { class: 'field' }, 'Ders', dersSel), h('label', { class: 'field' }, 'Soru seti', donemSel),
      h('button', { class: 'btn btn-primary btn-block', onClick: go('ders', 45, async () => {
        const kod = dersSel.value, dn = donemSel.value;
        const pool = await data.filterQuestions({ dersler: [kod], donemler: dn === 'karisik' ? [] : [dn], iptalHaric: false });
        return X.pickQuestions(pool, { mod: dn === 'karisik' ? 'rastgele' : 'resmi', adet: 20 });
      }) }, 'Başla')),
    h('div', { class: 'card' }, h('h3', {}, 'Tam oturum'), h('p', { class: 'muted' }, '4 ders × 20 soru, 180 dakika.'),
      h('label', { class: 'field' }, 'Oturum', oturumSel),
      h('button', { class: 'btn btn-primary btn-block', onClick: go('oturum', 180, async () => {
        const dersler = DERSLER.filter(d => d.oturum === +oturumSel.value).map(d => d.kod); const qs = [];
        for (const kod of dersler) qs.push(...X.pickQuestions(await data.filterQuestions({ dersler: [kod], iptalHaric: false }), { mod: 'rastgele', adet: 20 }));
        return qs;
      }) }, 'Başla')),
    h('div', { class: 'card' }, h('h3', {}, 'Özel'), h('div', { class: 'row' }, ...ozelDers),
      h('label', { class: 'field' }, 'Toplam soru', adetIn), h('label', { class: 'field' }, 'Süre (dk)', sureIn),
      h('button', { class: 'btn btn-primary btn-block', onClick: () => {
        const dersler = ozelDers.map(l => l.querySelector('input')).filter(i => i.checked).map(i => i.value);
        if (!dersler.length) return toast('En az bir ders seç.');
        const adet = clampInt(adetIn.value, 5, 160, 20);
        return go('ozel', clampInt(sureIn.value, 5, 240, 45), async () => {
          const pool = await data.filterQuestions({ dersler, iptalHaric: false });
          return X.pickQuestions(pool, { mod: 'rastgele', adet });
        })();
      } }, 'Başla')));
}

async function runExam(view, id, ctx) {
  const { db, data } = ctx;
  const ep = epoch;
  let s = await db.getExam(id);
  if (ep !== epoch) return;
  if (!s) return notFound(view);
  if (s.bittiMi) return ctx.navigate('#/exam/result/' + id);
  let i = 0, finishing = false;
  const timerEl = h('span', { class: 'timer' });
  const sheets = []; // sheets this screen opened
  const save = safe(() => db.saveExam(s)); // s is read synchronously; a failed save keeps the in-memory answer

  if (X.remainingMs(s) <= 0) { await end(); return; }

  const mapBtn = h('button', { class: 'btn btn-small', onClick: openMap }, 'Soru haritası');
  const endBtn = h('button', { class: 'btn btn-small', onClick: async () => {
    if (finishing) return;
    const bos = s.soruIdler.filter(q => !s.cevaplar[q]).length;
    if (await confirm(`Sınavı bitirmek istiyor musun? Boş: ${bos}`)) end();
  } }, 'Bitir');
  const top = h('div', { class: 'q-head' }, timerEl, h('span', { class: 'row' }, mapBtn, endBtn));
  const holder = h('div');
  view.append(top, holder);
  tick(); timer = setInterval(tick, 1000);

  function tick() {
    if (ep !== epoch || finishing) return;
    const r = X.remainingMs(s);
    timerEl.textContent = fmtSure(r); timerEl.classList.toggle('low', r < 5 * 60000);
    if (r <= 0) end();
  }
  async function show(k) {
    const my = ++seq;
    const stale = () => ep !== epoch || my !== seq;
    try {
      const qid = s.soruIdler[k]; const q = await data.getQuestion(qid);
      const inkStrokes = await db.getInk('deneme:' + id + ':' + qid);
      if (stale() || !q) return;
      qv?.destroy(); holder.innerHTML = '';
      i = k;
      qv = createQuestionView({ question: q, mode: 'exam', index: k, total: s.soruIdler.length, selected: s.cevaplar[qid] ?? null, flagged: !!s.bayraklar[qid], inkStrokes,
        onAnswer: ({ cevap }) => { if (finishing) return; s = X.answer(s, qid, cevap); save(); },
        onFlag: () => { if (finishing) return; s = X.toggleFlag(s, qid); save(); },
        onInk: safe((strokes) => db.saveInk('deneme:' + id + ':' + qid, strokes)),
        onPrev: k > 0 ? () => show(k - 1) : null, onNext: k < s.soruIdler.length - 1 ? () => show(k + 1) : () => openMap() });
      const cur = qv;
      holder.append(qv.el, h('button', { class: 'btn btn-small', style: 'margin-top:8px', onClick: () => {
        if (finishing || cur !== qv) return;
        s = X.answer(s, qid, null); save(); qv.setSelected(null);
      } }, 'Boş bırak'));
    } catch { if (!stale()) kayitHatasi(); }
  }
  function openMap() {
    if (finishing) return;
    const grid = h('div', { class: 'grid-map' }, ...s.soruIdler.map((qid, k) => h('button', { class: (s.cevaplar[qid] ? 'answered ' : '') + (s.bayraklar[qid] ? 'flagged ' : '') + (k === i ? 'current' : ''), onClick: () => { sh.close(); show(k); } }, String(k + 1))));
    const sh = sheet({ title: 'Soru haritası', content: h('div', {}, h('p', { class: 'muted' }, `Cevaplı: ${Object.keys(s.cevaplar).length} / ${s.soruIdler.length}`), grid) });
    sheets.push(sh);
  }
  // Single-shot: the timer and the "Bitir" confirmation may race; only the first call finishes the exam.
  async function end() {
    if (finishing || ep !== epoch) return;
    finishing = true;
    clearInterval(timer); timer = null;
    let fin, byId = {};
    try {
      const cur = await db.getExam(id); // a stale session must not finish an exam that is already finished
      if (ep !== epoch) { finishing = false; return; }
      if (cur?.bittiMi) { sheets.forEach(x => x.close()); ctx.navigate('#/exam/result/' + id); return; }
      for (const qid of s.soruIdler) byId[qid] = await data.getQuestion(qid);
      if (ep !== epoch) { finishing = false; return; }
      fin = { ...X.finish(s, byId, Math.min(Date.now(), s.baslangic + s.sureMs)), satirlarYazildi: false };
      await db.saveExam(fin);
    } catch { kayitHatasi(); finishing = false; if (ep === epoch && X.remainingMs(s) > 0 && !timer) timer = setInterval(tick, 1000); return; }
    s = fin;
    sheets.forEach(x => x.close());
    try {
      await db.addAnswers(examRows(s, byId, id));
      s = { ...s, satirlarYazildi: true };
      await db.saveExam(s);
    } catch { kayitHatasi(); } // the result screen retries the (atomic) row write once
    if (ep !== epoch) return;
    ctx.navigate('#/exam/result/' + id);
  }
  const firstOpen = s.soruIdler.findIndex(q => !s.cevaplar[q]);
  await show(firstOpen === -1 ? s.soruIdler.length - 1 : firstOpen);
}

async function showResult(view, id, ctx) {
  const { db, data } = ctx;
  const ep = epoch;
  let s = await db.getExam(id);
  if (ep !== epoch) return;
  if (!s) return notFound(view);
  if (!s.bittiMi || !s.sonuc) return ctx.navigate('#/exam/run/' + id);
  if (s.satirlarYazildi !== true) { // the row batch failed when finishing; retry once (atomic, so no duplicates)
    try {
      const have = (await db.allAnswers()).some(a => a.mod === 'exam' && a.denemeId === id);
      if (!have) {
        const byId = {}; for (const qid of s.soruIdler) byId[qid] = await data.getQuestion(qid);
        await db.addAnswers(examRows(s, byId, id));
      }
      s = { ...s, satirlarYazildi: true };
      await db.saveExam(s);
    } catch { kayitHatasi(); }
    if (ep !== epoch) return;
  }
  const r = s.sonuc;
  const tekrarBtn = h('button', { class: 'btn btn-primary', disabled: !!s.tekrarEklendi, onClick: async () => {
    if (tekrarBtn.disabled) return;
    tekrarBtn.disabled = true;
    try {
      const examDate = await examDateMs(db); let n = 0;
      for (const qid of s.soruIdler) {
        const q = await data.getQuestion(qid); const c = s.cevaplar[qid];
        if (q && (!c || c !== q.dogru) && await scheduleForReview({ db, fsrs, question: q, examDate })) n++;
      }
      if (!n) { toast('Tekrara eklenecek soru yok.'); tekrarBtn.disabled = false; return; }
      s = { ...s, tekrarEklendi: true };
      await db.saveExam(s);
      tekrarBtn.textContent = 'Tekrara eklendi';
      toast(`${n} soru tekrar kuyruğuna eklendi.`);
    } catch { kayitHatasi(); tekrarBtn.disabled = false; }
  } }, s.tekrarEklendi ? 'Tekrara eklendi' : 'Yanlışları tekrara ekle');
  const mesaj = s.dersler.length > 1
    ? (r.ortalamaGecti ? 'Ortalama barajı (60) geçildi' : 'Ortalama 60 altında')
    : (r.dersler[s.dersler[0]]?.gecti ? 'Ders barajı (50) geçildi' : 'Ders barajı 50 altında');
  view.append(h('h1', {}, 'Deneme sonucu'),
    h('div', { class: 'card', style: 'text-align:center' }, h('div', { style: 'font-size:2.2em;font-weight:700' }, fmtPuan(r.ortalama)), h('div', { class: 'muted' }, mesaj),
      h('p', { class: 'muted' }, `Doğru ${r.toplamDogru} · Yanlış ${r.toplamYanlis} · Boş ${r.toplamBos} · Süre ${fmtSure(s.bitis - s.baslangic)}`)),
    ...Object.entries(r.dersler).map(([kod, d]) => h('div', { class: 'stat-row' }, h('span', {}, dersAdi(kod)), h('span', {}, `${d.dogru}D ${d.yanlis}Y ${d.bos}B → `, h('strong', { style: `color:${d.gecti ? 'var(--ok)' : 'var(--err)'}` }, fmtPuan(d.puan))))),
    h('div', { class: 'row', style: 'margin-top:12px' }, tekrarBtn,
      h('a', { class: 'btn', href: '#/exam/review/' + id }, 'Yanlışları gözden geçir'),
      h('a', { class: 'btn', href: '#/exam' }, 'Yeni deneme')));
}

async function reviewWrong(view, id, ctx) {
  const { db, data } = ctx;
  const ep = epoch;
  const s = await db.getExam(id);
  const examDate = await examDateMs(db);
  if (ep !== epoch) return;
  if (!s) return notFound(view);
  const wrong = [];
  for (const qid of s.soruIdler) { const q = await data.getQuestion(qid); if (q && !q.iptal && (!s.cevaplar[qid] || s.cevaplar[qid] !== q.dogru)) wrong.push(qid); }
  if (ep !== epoch) return;
  if (!wrong.length) { view.append(h('p', { class: 'card' }, 'Yanlış veya boş soru yok.')); return; }
  let i = 0;
  async function show() {
    const my = ++seq;
    const stale = () => ep !== epoch || my !== seq;
    try {
      const at = i;
      const q = await data.getQuestion(wrong[at]); const sol = await data.getSolution(q.id);
      const inkStrokes = await db.getInk('deneme:' + id + ':' + q.id), feynmanStrokes = await db.getInk('feynman:' + q.id);
      const flag = await db.getFlag(q.id);
      if (stale()) return;
      qv?.destroy(); view.innerHTML = '';
      qv = createQuestionView({ question: q, solution: sol, mode: 'review', index: at, total: wrong.length, selected: s.cevaplar[q.id] ?? null, emin: true,
        inkStrokes, feynmanStrokes, flagged: !!flag?.bayrak, onAnswer: () => {}, onInk: safe((st) => db.saveInk('deneme:' + id + ':' + q.id, st)),
        onFlag: safe((b) => db.setFlag(q.id, { bayrak: b })),
        onTag: safe((t) => tagLastAnswer(db, q.id, t, id)),
        onCards: safe((kartlar) => addInfoCards({ db, fsrs, kaynakId: q.id, kartlar, examDate })),
        onFeynman: safe((st) => db.saveInk('feynman:' + q.id, st)),
        onPrev: at > 0 ? () => { i = at - 1; show(); } : null, onNext: at < wrong.length - 1 ? () => { i = at + 1; show(); } : () => ctx.navigate('#/exam/result/' + id) });
      view.append(qv.el);
      qv.reveal();
    } catch { if (!stale()) kayitHatasi(); }
  }
  await show();
}
