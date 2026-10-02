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
