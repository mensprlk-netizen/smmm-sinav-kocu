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
