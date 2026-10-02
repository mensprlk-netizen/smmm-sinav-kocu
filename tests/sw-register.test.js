import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerSw } from '../app/js/sw-register.js';

function target() {
  const l = {};
  return {
    addEventListener: (t, fn) => { (l[t] ||= []).push(fn); },
    emit: (t) => (l[t] || []).forEach((fn) => fn()),
  };
}
function worker(state = 'installing') {
  const w = target();
  w.state = state; w.posted = [];
  w.postMessage = (m) => w.posted.push(m);
  return w;
}
function setup({ controller = null, waiting = null } = {}) {
  const reg = target();
  reg.installing = null; reg.waiting = waiting;
  const sw = target();
  sw.controller = controller;
  sw.register = async (url) => { sw.url = url; return reg; };
  const bar = { hidden: true };
  const button = {};
  let reloads = 0;
  const opts = { sw, reload: () => { reloads++; }, bar, button, url: 'sw.js' };
  return { reg, sw, bar, button, opts, reloads: () => reloads };
}

test('serviceWorker desteği yoksa hata vermez', async () => {
  await registerSw({ sw: undefined, bar: {}, button: {} });
});

test('ilk kurulum: çubuk gizli kalır, controllerchange yeniden yüklemez', async () => {
  const t = setup({ controller: null });
  await registerSw(t.opts);
  assert.equal(t.sw.url, 'sw.js');
  const nw = worker();
  t.reg.installing = nw;
  t.reg.emit('updatefound');
  nw.state = 'installed';
  nw.emit('statechange');
  assert.equal(t.bar.hidden, true);
  t.sw.emit('controllerchange');
  assert.equal(t.reloads(), 0);
});

test('güncelleme: installed olunca çubuk görünür, düğme o işçiye SKIP_WAITING yollar, yeniden yükleme tek sefer', async () => {
  const t = setup({ controller: {} });
  await registerSw(t.opts);
  const nw = worker();
  t.reg.installing = nw;
  t.reg.emit('updatefound');
  assert.equal(t.bar.hidden, true);
  nw.state = 'installed';
  nw.emit('statechange');
  assert.equal(t.bar.hidden, false);
  t.button.onclick();
  assert.deepEqual(nw.posted, [{ type: 'SKIP_WAITING' }]);
  t.sw.emit('controllerchange');
  t.sw.emit('controllerchange');
  assert.equal(t.reloads(), 1);
});

test('installed dışındaki durumda çubuk görünmez', async () => {
  const t = setup({ controller: {} });
  await registerSw(t.opts);
  const nw = worker();
  t.reg.installing = nw;
  t.reg.emit('updatefound');
  nw.state = 'activating';
  nw.emit('statechange');
  assert.equal(t.bar.hidden, true);
});

test('açılışta bekleyen işçi ve controller varsa çubuk hemen görünür, düğme bekleyene yollar', async () => {
  const waiting = worker('installed');
  const t = setup({ controller: {}, waiting });
  await registerSw(t.opts);
  assert.equal(t.bar.hidden, false);
  t.button.onclick();
  assert.deepEqual(waiting.posted, [{ type: 'SKIP_WAITING' }]);
});

test('bekleyen işçi var ama controller yoksa çubuk görünmez', async () => {
  const t = setup({ controller: null, waiting: worker('installed') });
  await registerSw(t.opts);
  assert.equal(t.bar.hidden, true);
});

test('kayıt reddedilirse hata fırlatmaz', async () => {
  const t = setup();
  t.sw.register = async () => { throw new Error('SecurityError'); };
  await registerSw(t.opts);
  assert.equal(t.bar.hidden, true);
});
