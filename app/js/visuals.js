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
