import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './dom.js';
setupDom();
const { safe, KAYIT_HATASI } = await import('../app/js/ui.js');

const toasts = () => [...document.querySelectorAll('.toast')].filter(t => t.textContent === KAYIT_HATASI);
beforeEach(() => { document.body.innerHTML = ''; });

test('safe: eşzamanlı hata tek toast verir ve dışarı fırlatmaz', () => {
  const f = safe(() => { throw new Error('x'); });
  assert.doesNotThrow(() => f());
  assert.equal(toasts().length, 1);
});

test('safe: reddedilen söz tek toast verir, işlenmeyen ret bırakmaz', async () => {
  let unhandled = 0;
  const on = () => { unhandled++; };
  process.on('unhandledRejection', on);
  try {
    await safe(async () => { throw new Error('x'); })();
    await new Promise(r => setTimeout(r, 10));
  } finally { process.off('unhandledRejection', on); }
  assert.equal(unhandled, 0);
  assert.equal(toasts().length, 1);
});

test('safe: başarıda toast yok, değer geçer', async () => {
  assert.equal(safe((a, b) => a + b)(2, 3), 5);
  assert.equal(await safe(async () => 'ok')(), 'ok');
  assert.equal(toasts().length, 0);
});
