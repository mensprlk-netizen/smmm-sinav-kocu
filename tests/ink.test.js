import { test, mock } from 'node:test';
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

// --- Düzeltme turu 1 ---
function withTimers(fn) {
  return async () => {
    mock.timers.enable({ apis: ['setTimeout'] });
    try { await fn(); } finally { mock.timers.reset(); }
  };
}
function draw(c, x = 10, init = {}) {
  ptr(c, 'pointerdown', { clientX: x, ...init }); ptr(c, 'pointermove', { clientX: x + 5, clientY: 20, ...init }); ptr(c, 'pointerup', { clientX: x + 5, clientY: 20, ...init });
}

test('aktif kalem vuruşunu touch pointerup/pointercancel bitirmez', () => {
  const ink = createInk(); const c = canvasOf(ink);
  ptr(c, 'pointerdown', { pointerId: 1 });
  ptr(c, 'pointerdown', { pointerType: 'touch', pointerId: 2 });
  ptr(c, 'pointerup', { pointerType: 'touch', pointerId: 2 });
  ptr(c, 'pointercancel', { pointerType: 'touch', pointerId: 2 });
  ptr(c, 'pointermove', { pointerId: 1, clientX: 30 });
  ptr(c, 'pointerup', { pointerId: 1, clientX: 30 });
  const s = ink.getStrokes();
  assert.equal(s.length, 1);
  assert.equal(s[0].p.at(-1)[0], 30);
});

test('vuruş sürerken ikinci işaretçinin pointerdown olayı yok sayılır', () => {
  const ink = createInk(); const c = canvasOf(ink);
  ptr(c, 'pointerdown', { pointerId: 1 });
  ptr(c, 'pointerdown', { pointerType: 'mouse', pointerId: 2, clientX: 50 });
  ptr(c, 'pointermove', { pointerType: 'mouse', pointerId: 2, clientX: 55 });
  ptr(c, 'pointerup', { pointerType: 'mouse', pointerId: 2, clientX: 55 });
  ptr(c, 'pointermove', { pointerId: 1, clientX: 12 });
  ptr(c, 'pointerup', { pointerId: 1, clientX: 12 });
  const s = ink.getStrokes();
  assert.equal(s.length, 1);
  assert.deepEqual(s[0].p.map(pt => pt[0]), [10, 12]);
});

test('kalem yan düğmesi (button 5 / buttons 32) siler', () => {
  const ink = createInk(); const c = canvasOf(ink);
  draw(c, 10, { button: 5 }); draw(c, 10, { buttons: 32 }); draw(c, 10);
  assert.deepEqual(ink.getStrokes().map(s => s.silgi), [true, true, false]);
});

test('bilinmeyen pointerType çizmez', () => {
  const ink = createInk(); const c = canvasOf(ink);
  draw(c, 10, { pointerType: 'foo' });
  assert.equal(ink.getStrokes().length, 0);
});

test('geri al / ileri al / temizle dizileri tutarlı', () => {
  const n = (f) => { const ink = createInk(); const c = canvasOf(ink); f(ink, c); return ink.getStrokes().length; };
  assert.equal(n((i, c) => { draw(c); draw(c); i.undo(); i.undo(); i.redo(); i.redo(); }), 2);
  assert.equal(n((i, c) => { draw(c); i.clear(); i.undo(); }), 1);
  assert.equal(n((i, c) => { draw(c); i.clear(); i.undo(); i.redo(); }), 0);
  assert.equal(n((i, c) => { draw(c); draw(c); i.undo(); i.clear(); i.redo(); }), 0);
  assert.equal(n((i, c) => { draw(c); i.undo(); draw(c); i.redo(); }), 1);
});

test('onChange geri al, ileri al ve temizle sonrası bir kez çağrılır', withTimers(() => {
  let n = 0;
  const ink = createInk({ onChange: () => { n++; } }); const c = canvasOf(ink);
  draw(c); mock.timers.tick(300); assert.equal(n, 1);
  ink.undo(); ink.undo(); mock.timers.tick(300); assert.equal(n, 2);
  ink.redo(); mock.timers.tick(300); assert.equal(n, 3);
  ink.clear(); mock.timers.tick(300); assert.equal(n, 4);
  mock.timers.tick(1000); assert.equal(n, 4);
}));

test('getStrokes kopya döndürür', () => {
  const ink = createInk(); draw(canvasOf(ink));
  const a = ink.getStrokes();
  a[0].p[0][0] = 999; a[0].renk = 'x'; a.push({});
  const b = ink.getStrokes();
  assert.equal(b.length, 1); assert.notEqual(b[0].p[0][0], 999); assert.notEqual(b[0].renk, 'x');
});

test('destroy bekleyen onChange çağrısını bir kez boşaltır', withTimers(() => {
  let n = 0;
  const ink = createInk({ onChange: () => { n++; } });
  draw(canvasOf(ink));
  assert.equal(n, 0);
  ink.destroy(); assert.equal(n, 1);
  mock.timers.tick(1000); assert.equal(n, 1);
  const ink2 = createInk({ onChange: () => { n++; } });
  ink2.destroy(); assert.equal(n, 1);
}));

test('parmakla sürükleme sayfayı kaydırır, vuruş üretmez', () => {
  const calls = [];
  const orig = window.scrollBy; window.scrollBy = (x, y) => calls.push([x, y]);
  try {
    const ink = createInk(); const c = canvasOf(ink);
    ptr(c, 'pointerdown', { pointerType: 'touch', pointerId: 3, clientY: 100 });
    ptr(c, 'pointermove', { pointerType: 'touch', pointerId: 3, clientY: 70 });
    ptr(c, 'pointerup', { pointerType: 'touch', pointerId: 3, clientY: 70 });
    assert.deepEqual(calls, [[0, 30]]);
    assert.equal(ink.getStrokes().length, 0);
  } finally { window.scrollBy = orig; }
});

test('parmakla sürükleme kaydırılabilir üst öğeyi kaydırır', () => {
  const ink = createInk(); const c = canvasOf(ink);
  const box = document.createElement('div'); box.style.overflowY = 'auto';
  Object.defineProperty(box, 'scrollHeight', { value: 1000 }); Object.defineProperty(box, 'clientHeight', { value: 400 });
  box.append(ink.el); document.body.append(box);
  ptr(c, 'pointerdown', { pointerType: 'touch', pointerId: 3, clientY: 100 });
  ptr(c, 'pointermove', { pointerType: 'touch', pointerId: 3, clientY: 60 });
  assert.equal(box.scrollTop, 40);
  box.remove();
});

test('silgi vuruşu destination-out kullanır ve yeniden çizim sırayı korur', () => {
  const ink = createInk(); const c = canvasOf(ink); const ctx = c.getContext('2d');
  draw(c, 10);
  ink.setTool('eraser'); draw(c, 50);
  assert.ok(ctx.calls.some(k => k[0] === 'stroke' && k[1] === 'destination-out'));
  assert.ok(ctx.calls.some(k => k[0] === 'stroke' && k[1] === 'source-over'));
  ctx.calls.length = 0;
  ink.undo(); ink.redo();
  const last = ctx.calls.map(k => k[0]).lastIndexOf('clearRect');
  const after = ctx.calls.slice(last);
  assert.deepEqual(after.filter(k => k[0] === 'moveTo').map(k => k[1]), [10, 50]);
  const strokes = after.filter(k => k[0] === 'stroke').map(k => k[1]);
  assert.deepEqual(strokes, ['source-over', 'destination-out']);
});
