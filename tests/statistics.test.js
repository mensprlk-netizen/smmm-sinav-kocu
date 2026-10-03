import { test } from 'node:test';
import assert from 'node:assert/strict';
import { konuIstatistikleri, hataDagilimi, zayifKonular, hataDefteri, dersOrtSure } from '../app/js/statistics.js';

const qs = [
  { id: 'a', ders: 'MAL', konu: 'k1', iptal: false }, { id: 'b', ders: 'MAL', konu: 'k1', iptal: false },
  { id: 'c', ders: 'MAL', konu: 'k2', iptal: false }, { id: 'd', ders: 'FM', konu: 'x', iptal: false }];
const ans = [
  { soruId: 'a', mod: 'study', dogruMu: false, tarih: 1, sure: 1000, hataEtiketi: 'bilgi' }, { soruId: 'a', dogruMu: true, tarih: 2, sure: 3000 },
  { soruId: 'b', mod: 'study', dogruMu: false, tarih: 3, sure: 2000 }, { soruId: 'd', dogruMu: false, tarih: 4, sure: 500, hataEtiketi: 'dikkat' }];

test('konu istatistikleri', () => {
  const k1 = konuIstatistikleri(qs, ans).find(k => k.konu === 'k1');
  assert.deepEqual(k1, { konu: 'k1', ders: 'MAL', gorulen: 2, dogru: 1, dogruluk: 0.5, ortSureMs: 2000 });
  assert.equal(konuIstatistikleri(qs, ans).find(k => k.konu === 'k2').dogruluk, null);
});

test('hata dağılımı yalnızca yanlışları sayar', () => {
  assert.deepEqual(hataDagilimi(ans), { bilgi: 1, dikkat: 1, sure: 0, okuma: 0, etiketsiz: 1 });
});

test('zayıf konular en az 3 görülen ister', () => {
  const st = [{ konu: 'a', gorulen: 3, dogruluk: 0.9 }, { konu: 'b', gorulen: 5, dogruluk: 0.2 }, { konu: 'c', gorulen: 1, dogruluk: 0 }];
  assert.deepEqual(zayifKonular(st, 5).map(s => s.konu), ['b', 'a']);
});

test('hata defteri filtreli ve tarih azalan', () => {
  const list = hataDefteri(qs, ans, {});
  assert.deepEqual(list.map(x => x.question.id), ['d', 'b']);
  assert.deepEqual(hataDefteri(qs, ans, { ders: 'MAL' }).map(x => x.question.id), ['b']);
  assert.deepEqual(hataDefteri(qs, ans, { etiket: 'dikkat' }).map(x => x.question.id), ['d']);
});

test('dersOrtSure: süresi olan satırların ortalaması; süresiz ders yok sayılır', () => {
  const q2 = [...qs, { id: 'e', ders: 'MAL', konu: 'k2', iptal: true }, { id: 'f', ders: 'HUK', konu: 'h', iptal: false }];
  const a2 = [...ans, { soruId: 'e', dogruMu: true, tarih: 5, sure: 90000 }, { soruId: 'c', dogruMu: true, tarih: 6, sure: 0, mod: 'exam' },
    { soruId: 'f', dogruMu: true, tarih: 7, sure: 0, mod: 'exam' }];
  // MAL: 1000, 3000, 2000 -> 2000 (iptal soru ve sure 0 satırı sayılmaz); FM: 500; HUK: yalnız sure 0 -> anahtar yok
  assert.deepEqual(dersOrtSure(q2, a2), { MAL: 2000, FM: 500 });
});

test('aynı konu etiketi iki derste ayrı gruplanır', () => {
  const q = [{ id: 'p', ders: 'FM', konu: 'genel' }, { id: 'q', ders: 'FM', konu: 'genel' }, { id: 'r', ders: 'DEN', konu: 'genel' }];
  const a = [{ soruId: 'p', dogruMu: true, tarih: 1, sure: 0 }, { soruId: 'q', dogruMu: false, tarih: 2, sure: 0 }, { soruId: 'r', dogruMu: false, tarih: 3, sure: 0 }];
  const st = konuIstatistikleri(q, a).filter(k => k.konu === 'genel');
  assert.deepEqual(st.map(k => [k.ders, k.gorulen, k.dogru, k.dogruluk]), [['FM', 2, 1, 0.5], ['DEN', 1, 0, 0]]);
});

test('ortalama süre: satır başına 10 dk üst sınır (konu ve ders)', () => {
  const q = [{ id: 'a', ders: 'MAL', konu: 'k' }];
  const a = [30000, 60000, 3600000].map((sure, i) => ({ soruId: 'a', dogruMu: true, tarih: i + 1, sure }));
  assert.equal(konuIstatistikleri(q, a)[0].ortSureMs, 230000);
  assert.equal(dersOrtSure(q, a).MAL, 230000);
});

test('hata defteri: etiketsiz filtresi yalnız etiketsiz yanlışları verir', () => {
  assert.deepEqual(hataDefteri(qs, ans, { etiket: 'etiketsiz' }).map(x => x.question.id), ['b']);
});

test('hata dağılımı: deneme/tekrar satırları Etiketsiz şişirmez; etiketli olan sayılır; null cevap yanlış sayılır', () => {
  const rows = [{ soruId: 'a', mod: 'exam', dogruMu: false }, { soruId: 'b', mod: 'review', dogruMu: false }, { soruId: 'c', mod: 'review', dogruMu: false, hataEtiketi: 'sure' },
    { soruId: 'd', mod: 'study', dogruMu: false, cevap: null }];
  assert.deepEqual(hataDagilimi(rows), { bilgi: 0, dikkat: 0, sure: 1, okuma: 0, etiketsiz: 1 });
});
