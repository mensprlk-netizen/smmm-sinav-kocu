// app/js/screens/study.js
import { h, toast, safe, kayitHatasi } from '../ui.js';
import { createQuestionView } from './question-view.js';
import * as fsrs from '../fsrs.js';
import { recordAnswer, addInfoCards, tagLastAnswer, lastAnswerMap, examDateMs } from '../progress.js';
import { DERSLER, DONEMLER } from '../data.js';

let qv = null;
let epoch = 0;   // destroy() bumps it; in-flight work from an older epoch stops
let seq = 0;     // each show() bumps it; only the newest transition may attach a view
let busy = false;
export function destroy() { epoch++; seq++; busy = false; qv?.destroy(); qv = null; }

export async function render(view, params, ctx) {
  const { db } = ctx;
  const ep = epoch;
  if (params.id) { return showList(view, ctx, [params.id], 0, null, false); }
  const saved = await db.getSetting('study:state', null);
  if (ep !== epoch) return;
  if (saved?.ids?.length && saved.idx < saved.ids.length && !params.yeni) {
    view.append(h('div', { class: 'card' },
      h('h3', {}, 'Kaldığın yerden devam'),
      h('p', { class: 'muted' }, `${saved.idx + 1} / ${saved.ids.length} soru`),
      h('div', { class: 'row' },
        h('button', { class: 'btn btn-primary', onClick: () => { view.innerHTML = ''; showList(view, ctx, saved.ids, saved.idx, saved.filtre, true); } }, 'Devam et'),
        h('button', { class: 'btn', onClick: () => { view.innerHTML = ''; showFilters(view, ctx); } }, 'Yeni liste'))));
    return;
  }
  showFilters(view, ctx);
}

async function showFilters(view, ctx) {
  const { db, data } = ctx;
  const ep = epoch;
  const f = (await db.getSetting('study:filtre', null)) || { dersler: [], donemler: [], kapsam: 'hepsi', sira: 'karisik' };
  if (ep !== epoch) return;
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
    if (ep !== epoch) return;
    if (f.kapsam === 'gorulmemis') qs = qs.filter(q => !last.has(q.id));
    if (f.kapsam === 'yanlis') qs = qs.filter(q => last.get(q.id)?.dogruMu === false);
    if (f.kapsam === 'bayrak') { const flags = new Set((await db.allFlags()).filter(x => x.bayrak).map(x => x.soruId)); if (ep !== epoch) return; qs = qs.filter(q => flags.has(q.id)); }
    if (!qs.length) { toast('Bu filtreyle soru bulunamadı.'); return; }
    let ids = qs.map(q => q.id);
    if (f.sira === 'karisik') for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    view.innerHTML = '';
    showList(view, ctx, ids, 0, f, true);
  }
}

async function showList(view, ctx, ids, idx, filtre, persist) {
  const { db, data } = ctx;
  const ep = epoch;
  const examDate = await examDateMs(db);
  if (ep !== epoch) return;
  let startedAt = Date.now();

  async function finish() {
    if (busy) return;
    busy = true;
    const my = ++seq;
    try {
      await db.setSetting('study:state', null);
      if (ep !== epoch || my !== seq) return;
      qv?.destroy(); qv = null; view.innerHTML = '';
      showFilters(view, ctx);
    } catch { kayitHatasi(); } finally { if (my === seq) busy = false; }
  }

  // A single deep-linked question has no list to finish: go back and leave study:state alone.
  function leave() { if (globalThis.history?.length > 1) history.back(); else ctx.navigate('#/'); }

  async function show(i) {
    if (busy) return;
    busy = true;
    const my = ++seq;
    const stale = () => ep !== epoch || my !== seq;
    try {
      qv?.destroy(); qv = null; view.innerHTML = ''; startedAt = Date.now();
      const q = await data.getQuestion(ids[i]);
      if (stale()) return;
      if (!q) { view.append(h('p', { class: 'card' }, 'Soru bulunamadı.')); return; }
      if (persist) { await db.setSetting('study:state', { ids, idx: i, filtre }); if (stale()) return; }
      const sol = await data.getSolution(q.id);
      if (stale()) return;
      const flag = await db.getFlag(q.id);
      const inkStrokes = await db.getInk('soru:' + q.id), feynmanStrokes = await db.getInk('feynman:' + q.id);
      if (stale()) return;
      qv = createQuestionView({
        question: q, solution: sol, mode: 'study', index: i, total: ids.length, flagged: !!flag?.bayrak, inkStrokes, feynmanStrokes,
        onAnswer: safe(({ cevap, dogruMu, emin }) => recordAnswer({ db, fsrs, question: q, cevap, dogruMu, emin, sure: Date.now() - startedAt, mod: 'study', examDate })),
        onFlag: safe((b) => db.setFlag(q.id, { bayrak: b })),
        onTag: safe((t) => tagLastAnswer(db, q.id, t)),
        onCards: safe((kartlar) => addInfoCards({ db, fsrs, kaynakId: q.id, kartlar, examDate })),
        onInk: safe((s) => db.saveInk('soru:' + q.id, s)),
        onFeynman: safe((s) => db.saveInk('feynman:' + q.id, s)),
        onPrev: i > 0 ? () => show(i - 1) : null,
        onNext: i < ids.length - 1 ? () => show(i + 1) : persist ? finish : leave,
      });
      view.append(qv.el);
    } catch { kayitHatasi(); } finally { if (my === seq) busy = false; }
  }
  await show(idx);
}
