// app/js/screens/topics.js
import { h, toast, safe } from '../ui.js';
import { renderVisual } from '../visuals.js';
import { createInk } from '../ink.js';
import * as fsrs from '../fsrs.js';
import { addInfoCards, examDateMs } from '../progress.js';

const inks = [];
let epoch = 0;   // destroy() bumps it; in-flight renders from an older epoch stop
export function destroy() { epoch++; inks.splice(0).forEach(i => i.destroy()); }

export async function render(view, params, ctx) {
  const { db, data } = ctx;
  const ep = epoch;
  const topics = await data.loadTopics();
  if (ep !== epoch) return;
  if (!params.kod) {
    const items = [];
    for (const t of topics) {
      const okundu = await db.getSetting('topic:read:' + t.kod, false);
      items.push(h('a', { class: 'card', href: '#/topics/' + t.kod, style: 'display:block;text-decoration:none;color:inherit' },
        h('div', { class: 'row', style: 'justify-content:space-between' }, h('strong', {}, `${t.sira}. ${t.baslik}`), h('span', { class: 'badge' }, okundu ? 'Okundu' : `${(t.cikmisSorular || []).length} çıkmış soru`)),
        h('p', { class: 'muted', style: 'margin:4px 0 0' }, t.amac)));
    }
    if (ep !== epoch) return;
    view.append(h('h1', {}, 'Maliyet Muhasebesi'), h('p', { class: 'muted' }, 'Sınav odaklı 14 konu. Her konunun sonunda çıkmış sorular ve bilgi kartları var.'), ...items);
    if (!topics.length) view.append(h('p', { class: 'card' }, 'Konu içeriği henüz eklenmedi.'));
    return;
  }
  const t = topics.find(x => x.kod === params.kod);
  if (!t) { view.append(h('p', { class: 'card' }, 'Konu bulunamadı.')); return; }
  const examDate = await examDateMs(db);
  const strokes = [];
  for (let i = 0; i < (t.ornekler || []).length; i++) strokes.push(await db.getInk(`konu:${t.kod}:ornek:${i}`));
  if (ep !== epoch) return;
  view.append(h('a', { href: '#/topics', class: 'muted' }, '‹ Konular'), h('h1', {}, `${t.sira}. ${t.baslik}`), h('p', {}, h('em', {}, t.amac)));
  for (const b of t.bolumler) {
    view.append(h('div', { class: 'card' }, h('h3', {}, b.baslik), h('div', { html: b.html }), b.gorsel ? renderVisual(b.gorsel) : null));
  }
  if (t.sinavYaklasimi?.length) view.append(h('div', { class: 'card', style: 'border-color:var(--accent)' }, h('h3', {}, 'Sınav yaklaşımı'), h('ul', {}, ...t.sinavYaklasimi.map(s => h('li', {}, s)))));
  for (let i = 0; i < (t.ornekler || []).length; i++) {
    const o = t.ornekler[i]; const key = `konu:${t.kod}:ornek:${i}`;
    const ink = createInk({ strokes: strokes[i], height: 260, onChange: safe((s) => db.saveInk(key, s)) }); inks.push(ink);
    const sol = h('div', { hidden: true }, ...o.cozum.map(c => h('div', { class: 'step', html: c })));
    view.append(h('div', { class: 'card' }, h('h3', {}, `Örnek ${i + 1}`), h('div', { html: o.soru }), h('p', { class: 'muted' }, 'Önce kendin çöz:'), ink.el,
      h('button', { class: 'btn btn-small', style: 'margin-top:8px', onClick: (e) => { sol.hidden = false; e.currentTarget.remove(); } }, 'Çözümü göster'), sol));
  }
  if (t.cikmisSorular?.length) view.append(h('div', { class: 'card' }, h('h3', {}, 'Bu konudan çıkmış sorular'),
    ...t.cikmisSorular.map(id => h('a', { class: 'stat-row', href: '#/study/q/' + id, style: 'text-decoration:none;color:inherit' }, h('span', {}, id), h('span', { class: 'muted' }, 'Çöz ›')))));
  view.append(h('div', { class: 'row', style: 'margin:12px 0 24px' },
    h('button', { class: 'btn btn-primary', onClick: safe(async () => { const n = await addInfoCards({ db, fsrs, kaynakId: 'konu:' + t.kod, kartlar: t.kartlar || [], examDate }); toast(n ? `${n} kart eklendi.` : 'Kartlar zaten ekli.'); }) }, `Konu kartlarını ekle (${(t.kartlar || []).length})`),
    h('button', { class: 'btn', onClick: safe(async () => { await db.setSetting('topic:read:' + t.kod, true); toast('Okundu olarak işaretlendi.'); }) }, 'Okudum')));
}
