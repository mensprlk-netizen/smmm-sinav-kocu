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
