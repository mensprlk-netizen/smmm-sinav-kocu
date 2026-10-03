import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute } from '../app/js/router.js';

test('boş hash ana sayfaya gider', () => {
  assert.deepEqual(parseRoute(''), { name: 'home', params: {} });
  assert.deepEqual(parseRoute('#/'), { name: 'home', params: {} });
});

test('çalış ekranı ve soru id', () => {
  assert.deepEqual(parseRoute('#/study'), { name: 'study', params: {} });
  assert.deepEqual(parseRoute('#/study/q/2026-1-MAL-07'), { name: 'study', params: { id: '2026-1-MAL-07' } });
});

test('deneme alt yolları', () => {
  assert.deepEqual(parseRoute('#/exam/run/abc'), { name: 'exam', params: { stage: 'run', id: 'abc' } });
  assert.deepEqual(parseRoute('#/exam/result/abc'), { name: 'exam', params: { stage: 'result', id: 'abc' } });
});

test('konu kodu', () => {
  assert.deepEqual(parseRoute('#/topics/mhk-analizi'), { name: 'topics', params: { kod: 'mhk-analizi' } });
});

test('bilinmeyen yol ana sayfa', () => {
  assert.deepEqual(parseRoute('#/yok'), { name: 'home', params: {} });
});

import { createRouter } from '../app/js/router.js';

const mkView = () => ({ innerHTML: 'x' });
const gate = () => { let go; const p = new Promise(r => { go = r; }); return { p, go }; };

test('createRouter: her gezinmede cleanup çalışır, eski ekran yok edilir', async () => {
  const log = [];
  const mod = (n) => ({ destroy: () => log.push('destroy ' + n), render: async () => { log.push('render ' + n); } });
  const route = createRouter({ view: mkView(), ctx: {}, cleanup: () => log.push('cleanup'), load: async (n) => mod(n) });
  await route('#/study'); await route('#/exam');
  assert.deepEqual(log, ['cleanup', 'render study', 'destroy study', 'cleanup', 'render exam']);
});

test('createRouter: ilk yüklemede iki hızlı gezinme yalnız sonuncuyu çizer', async () => {
  const g = gate(); const rendered = [];
  const mod = (n) => ({ render: async () => { rendered.push(n); } });
  const route = createRouter({ view: mkView(), ctx: {}, load: async (n) => { if (n === 'study') await g.p; return mod(n); } });
  const first = route('#/study');
  const second = route('#/exam');
  await second; g.go(); await first;
  assert.deepEqual(rendered, ['exam']);
});
