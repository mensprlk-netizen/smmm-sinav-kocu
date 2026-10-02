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
