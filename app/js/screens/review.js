// app/js/screens/review.js
import { h, safe, kayitHatasi } from '../ui.js';
import { createQuestionView } from './question-view.js';
import * as fsrs from '../fsrs.js';
import { buildQueue } from '../reviewqueue.js';
import { examDateMs } from '../progress.js';
import { gunlukPlan, sinavaKalanGun, dailyCounter, todayKey } from '../planner.js';

let qv = null;
let epoch = 0;   // destroy() bumps it; in-flight work from an older epoch stops
let seq = 0;     // each show() bumps it; only the newest transition may attach a view
export function destroy() { epoch++; seq++; qv?.destroy(); qv = null; }

export async function render(view, params, ctx) {
  const { db, data } = ctx;
  const ep = epoch;
  const now = Date.now(), examDate = await examDateMs(db);
  const hedefSaat = await db.getSetting('hedefSaat', 1.5);
  const cards = await db.allCards();
  const counter = dailyCounter(await db.getSetting('review:gun', null), todayKey(now));
  if (ep !== epoch) return;
  const vadesiGelen = cards.filter(c => c.state !== 'new' && c.due <= now).length;
  const plan = gunlukPlan({ hedefSaat, vadesiGelen, sinavaKalanGun: sinavaKalanGun(now, examDate), dersIstatistik: [], bugunYapilan: counter.sayac });
  // Drop question cards whose question is missing or cancelled; info cards are always kept.
  const usable = async (list) => {
    const out = [];
    for (const c of list) {
      if (c.tur === 'soru') { const q = await data.getQuestion(c.kaynakId); if (!q || q.iptal) continue; }
      out.push(c);
    }
    return out;
  };
  const raw = buildQueue(cards, now, { kota: plan.tekrarKotasi });
  const queue = await usable(raw);
  if (ep !== epoch) return;

  if (!queue.length) {
    const erken = await usable(buildQueue(cards, now, { kota: 20, erken: true }));
    if (ep !== epoch) return;
    const baslik = raw.length ? 'Vadesi gelen kart yok.' : vadesiGelen > 0 && counter.sayac > 0 ? 'Günlük tekrar hedefi tamam.' : (vadesiGelen === 0 ? 'Vadesi gelen kart yok.' : plan.mesaj);
    view.append(h('h1', {}, 'Tekrar'),
      h('div', { class: 'card' }, h('h3', {}, baslik),
        h('p', { class: 'muted' }, `Bugün ${counter.sayac} kart tekrar ettin.`),
        erken.length ? h('button', { class: 'btn', onClick: () => { view.innerHTML = ''; run(erken); } }, `Erken tekrar (${erken.length})`) : null));
    return;
  }
  run(queue);

  function run(list) {
    let i = 0;
    let busy = false; // a rating is being saved; ignore further taps
    async function rate(card, rating) {
      if (busy || ep !== epoch) return;
      busy = true;
      try {
        await db.saveCard(fsrs.review(card, rating, Date.now(), { examDate }));
        const c = dailyCounter(await db.getSetting('review:gun', null), todayKey()); c.sayac++;
        await db.setSetting('review:gun', c);
      } catch { kayitHatasi(); busy = false; return; }
      busy = false;
      if (ep !== epoch) return;
      i++; show();
    }
    const ratingRow = (card) => h('div', { class: 'row', style: 'margin-top:12px' },
      ...[[1, 'Tekrar'], [2, 'Zor'], [3, 'İyi'], [4, 'Kolay']].map(([r, t]) => h('button', { class: 'btn' + (r === 3 ? ' btn-primary' : ''), style: 'flex:1', onClick: () => rate(card, r) }, t)));
    async function show() {
      const my = ++seq;
      const stale = () => ep !== epoch || my !== seq;
      try {
        qv?.destroy(); qv = null; view.innerHTML = '';
        if (i >= list.length) { view.append(h('div', { class: 'card' }, h('h3', {}, 'Tekrar bitti.'), h('a', { class: 'btn btn-primary', href: '#/' }, 'Ana sayfa'))); return; }
        const card = list[i];
        if (card.tur === 'soru') {
          const q = await data.getQuestion(card.kaynakId);
          if (stale()) return;
          if (!q || q.iptal) { i++; return show(); }
          const sol = await data.getSolution(q.id);
          const inkStrokes = await db.getInk('soru:' + q.id), feynmanStrokes = await db.getInk('feynman:' + q.id);
          if (stale()) return;
          const holder = h('div');
          qv = createQuestionView({ question: q, solution: sol, mode: 'review', index: i, total: list.length, inkStrokes, feynmanStrokes,
            onAnswer: safe(async ({ cevap, dogruMu, emin }) => {
              try { await db.addAnswer({ soruId: q.id, cevap, dogruMu, emin, sure: 0, mod: 'review' }); } catch { kayitHatasi(); }
              if (stale()) return;
              holder.append(h('p', { class: 'muted' }, dogruMu ? 'Doğru. Ne kadar kolaydı?' : 'Yanlış. Çözümü oku, sonra derecelendir.'), ratingRow(card));
            }),
            onInk: safe((s) => db.saveInk('soru:' + q.id, s)), onFeynman: safe((s) => db.saveInk('feynman:' + q.id, s)) });
          view.append(qv.el, holder);
        } else {
          const back = h('div', { class: 'card', hidden: true }, h('p', {}, card.arka), ratingRow(card));
          view.append(h('div', { class: 'q-head' }, h('span', {}, 'Tekrar'), h('span', {}, `${i + 1} / ${list.length}`)),
            h('div', { class: 'card' }, h('p', { class: 'muted' }, 'Bilgi kartı'), h('p', {}, h('strong', {}, card.on)),
              h('button', { class: 'btn btn-primary', onClick: (e) => { back.hidden = false; e.currentTarget.remove(); } }, 'Cevabı göster')), back);
        }
      } catch { if (!stale()) kayitHatasi(); }
    }
    show();
  }
}
