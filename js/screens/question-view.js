// app/js/screens/question-view.js
import { h, sheet, toast } from '../ui.js';
import { createInk } from '../ink.js';
import { dersAdi } from '../data.js';

// Dokunsal geri bildirim (Android): doğru kısa, yanlış çift vuruş. Desteklenmiyorsa sessizce geçilir.
function titre(p) { try { navigator.vibrate?.(p); } catch { /* yok */ } }

const TAGS = [['bilgi', 'Bilgi eksiği'], ['dikkat', 'Dikkatsizlik'], ['sure', 'Süre'], ['okuma', 'Yanlış okudum']];

export function createQuestionView(o) {
  const q = o.question, mode = o.mode;
  let selected = o.selected ?? null, locked = mode !== 'exam' && selected !== null, emin = o.emin !== false;
  let flagged = !!o.flagged, skipped = false;
  let solveInk = null, feynmanInk = null;

  const head = h('div', { class: 'q-head' },
    h('span', {}, h('span', { class: 'q-ders' }, dersAdi(q.ders)), h('span', { class: 'q-meta' }, `${q.donem} dönemi, Soru ${q.no}`)),
    h('span', { class: 'q-sira' }, `${(o.index ?? 0) + 1} / ${o.total ?? 1}`),
    o.onFlag ? h('button', { class: 'btn-icon', 'aria-label': 'Bayrak', 'data-role': 'flag', onClick: () => { flagged = !flagged; flagBtn.textContent = flagged ? '⚑' : '⚐'; o.onFlag(flagged); } }, flagged ? '⚑' : '⚐') : null);
  const flagBtn = head.querySelector('[data-role="flag"]');

  const body = h('div', { class: 'q-text' },
    q.iptal ? h('p', {}, h('span', { class: 'badge badge-err' }, 'İPTAL'), ' ', h('span', { class: 'muted' }, 'Bu soru resmi olarak iptal edilmiştir; puanlamaya girmez.')) : null,
    q.ortakBilgi ? h('div', { class: 'muted', html: q.ortakBilgi }) : null,
    h('div', { html: q.metin }));

  const optEls = {};
  const opts = h('div', {}, ...Object.entries(q.secenekler).map(([L, html]) => {
    const b = h('button', { class: 'opt', 'data-letter': L, onClick: () => choose(L) },
      h('span', { class: 'letter', 'aria-hidden': 'true' }, L), h('span', { class: 'body', html }));
    optEls[L] = b; return b;
  }));

  const eminBtn = mode === 'exam' || q.iptal ? null : h('button', { class: 'chip' + (emin ? '' : ' on'), 'data-role': 'emin', onClick: () => { if (locked) return; emin = !emin; eminBtn.classList.toggle('on', !emin); } }, 'Emin değilim');

  const bosBtn = mode === 'study' && !q.iptal ? h('button', { class: 'chip', 'data-role': 'bos', onClick: skip }, 'Boş geç') : null;
  const feyBtn = mode === 'review' && o.onFeynman ? h('button', { class: 'btn btn-small', 'data-role': 'feynman', onClick: openFeynman }, 'Kendi cümlenle anlat') : null;
  const solWrap = h('div');
  const foot = h('div', { class: 'q-foot' },
    h('button', { class: 'btn', onClick: () => o.onPrev?.(), disabled: !o.onPrev }, '‹ Önceki'),
    o.onInk ? h('button', { class: 'btn', 'data-role': 'ink', onClick: openInk }, '✎ Çöz') : null,
    h('button', { class: 'btn btn-primary', onClick: () => o.onNext?.(), disabled: !o.onNext }, 'Sonraki ›'));

  const el = h('div', { class: 'question' }, head, body, opts, eminBtn ? h('div', { class: 'row', style: 'margin-bottom:10px' }, eminBtn, bosBtn) : null, feyBtn ? h('div', { class: 'row', style: 'margin-bottom:10px' }, feyBtn) : null, solWrap, foot);

  function paint() {
    if (bosBtn) { if (locked) bosBtn.setAttribute('disabled', ''); else bosBtn.removeAttribute('disabled'); }
    if (eminBtn) { if (locked) eminBtn.setAttribute('disabled', ''); else eminBtn.removeAttribute('disabled'); }
    for (const [L, b] of Object.entries(optEls)) {
      b.classList.toggle('selected', mode === 'exam' && selected === L);
      if (locked || q.iptal) b.setAttribute('disabled', ''); else b.removeAttribute('disabled');
      if (locked) { b.classList.toggle('correct', L === q.dogru); b.classList.toggle('wrong', L === selected && L !== q.dogru); }
    }
  }
  function choose(L) {
    if (q.iptal || (locked && mode !== 'exam')) return;
    selected = L;
    if (mode === 'exam') { titre(8); o.onAnswer?.({ cevap: L, dogruMu: L === q.dogru, emin: true }); paint(); return; }
    titre(L === q.dogru ? 12 : [18, 40, 18]);
    locked = true; paint();
    showSolution();
    o.onAnswer?.({ cevap: L, dogruMu: L === q.dogru, emin });
  }
  function skip() {
    if (locked || q.iptal) return;
    skipped = true; locked = true; paint();
    showSolution();
    o.onAnswer?.({ cevap: null, dogruMu: false, emin: false });
  }
  function showSolution() {
    const s = o.solution; solWrap.innerHTML = '';
    const wrong = (selected !== null || skipped) && selected !== q.dogru;
    const panel = h('div', { class: 'solution' },
      q.cevapNotu ? h('p', { class: 'badge' }, q.cevapNotu) : null,
      h('p', {}, h('strong', {}, q.iptal ? `İlk anahtar: ${q.dogru} (iptal).` : `Doğru cevap: ${q.dogru}.`), s ? ' ' + s.ozet : ''),
      s ? h('div', {}, ...s.adimlar.map(a => h('div', { class: 'step', html: a }))) : h('p', { class: 'muted' }, 'Bu soru için çözüm henüz eklenmedi.'),
      s?.dayanak ? h('p', { class: 'muted' }, 'Dayanak: ' + s.dayanak) : null,
      s && Object.keys(s.tuzaklar || {}).length ? h('div', {}, h('h2', {}, 'Tuzak şıklar'), h('ul', {}, ...Object.entries(s.tuzaklar).map(([L, t]) => h('li', {}, h('strong', {}, L + ') '), h('span', { html: t }))))) : null,
      wrong && o.onTag ? h('div', {}, h('h2', {}, 'Neden yanlış yaptım?'), h('div', { class: 'row' }, ...TAGS.map(([k, label]) => h('button', { class: 'chip', 'data-tag': k, onClick: (e) => { panel.querySelectorAll('[data-tag]').forEach(c => c.classList.remove('on')); e.currentTarget.classList.add('on'); o.onTag(k); } }, label)))) : null,
      h('div', { class: 'row', style: 'margin-top:10px' },
        s?.kartlar?.length && o.onCards ? h('button', { class: 'btn btn-small', 'data-role': 'cards', onClick: (e) => { const btn = e.currentTarget; if (btn.disabled) return; btn.disabled = true; btn.textContent = 'Kartlar eklendi'; o.onCards(s.kartlar); toast('Kartlar tekrar kuyruğuna eklendi.'); } }, `Kartları ekle (${s.kartlar.length})`) : null,
        h('button', { class: 'btn btn-small', 'data-role': 'original', onClick: showOriginal }, 'Orijinali göster'),
        mode !== 'review' && o.onFeynman ? h('button', { class: 'btn btn-small', 'data-role': 'feynman', onClick: openFeynman }, 'Kendi cümlenle anlat') : null));
    solWrap.append(panel);
  }
  function showOriginal() {
    const src = `img/originals/${q.donem}-${q.ders}-p${q.orijinal?.sayfa ?? 1}.png`;
    const img = h('img', { src, alt: 'Orijinal kitapçık sayfası', style: 'width:100%;height:auto' });
    const s = sheet({ title: `Orijinal sayfa ${q.orijinal?.sayfa ?? ''}`, content: img, full: true });
    if (q.orijinal?.kutu) img.addEventListener('load', () => { const scale = img.clientWidth / img.naturalWidth; s.el.querySelector('.sheet-body').scrollTop = Math.max(0, q.orijinal.kutu[1] * scale - 40); });
  }
  function openInk() {
    solveInk ??= createInk({ strokes: o.inkStrokes || [], height: Math.round((globalThis.innerHeight || 800) * 0.6), onChange: (s) => { o.inkStrokes = s; o.onInk?.(s); } });
    sheet({ title: 'Çözüm alanı', content: solveInk.el });
  }
  function openFeynman() {
    feynmanInk ??= createInk({ strokes: o.feynmanStrokes || [], height: 300, onChange: (s) => { o.feynmanStrokes = s; o.onFeynman?.(s); } });
    sheet({ title: 'Kendi cümlenle anlat', content: h('div', {}, h('p', { class: 'muted' }, 'Çözümü okuduktan sonra, kuralı birine öğretir gibi kendi sözlerinle yaz.'), feynmanInk.el) });
  }

  paint();
  if (locked && mode !== 'exam') showSolution();
  if (q.iptal && mode !== 'exam') showSolution();
  return { el, reveal() { locked = true; paint(); showSolution(); }, setSelected(L) { selected = L; paint(); }, destroy() { solveInk?.destroy(); feynmanInk?.destroy(); } };
}
