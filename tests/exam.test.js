import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dersPuani, pickQuestions, createExam, answer, finish, remainingMs, toggleFlag } from '../app/js/exam.js';

const mk = (ders, n, iptal = false) => ({ id: `2026-1-${ders}-${String(n).padStart(2, '0')}`, ders, no: n, dogru: 'A', iptal });
const pool = (ders, iptalNo = null) => Array.from({ length: 20 }, (_, i) => mk(ders, i + 1, i + 1 === iptalNo));

test('resmi puan formülü', () => {
  assert.equal(dersPuani({ dogru: 16, yanlis: 4, gecerli: 20 }), 75);
  assert.equal(dersPuani({ dogru: 19, yanlis: 0, gecerli: 19 }), 100);
  assert.equal(dersPuani({ dogru: 10, yanlis: 9, gecerli: 19 }), 40.78);
  assert.equal(dersPuani({ dogru: 1, yanlis: 19, gecerli: 20 }), 0);
  assert.equal(dersPuani({ dogru: 0, yanlis: 0, gecerli: 0 }), 0);
});

test('puan iki ondalığa kırpılır, yuvarlanmaz', () => {
  assert.equal(dersPuani({ dogru: 2, yanlis: 0, gecerli: 19 }), 10.52); // ham 10,526
  assert.equal(dersPuani({ dogru: 19, yanlis: 1, gecerli: 20 }), 93.75);
  assert.equal(dersPuani({ dogru: 0, yanlis: 0, gecerli: 3 }), 0);
  assert.equal(dersPuani({ dogru: 49.99999, yanlis: 0, gecerli: 100 }), 49.99); // baraj 50'nin hemen altı
});

test('ortalama ham ders puanlarından hesaplanıp kırpılır', () => {
  const qs = [...pool('FM').slice(0, 18), ...pool('MAL').slice(0, 18)];
  const byId = Object.fromEntries(qs.map(q => [q.id, q]));
  let s = createExam({ tur: 'oturum', sorular: qs, sureDk: 180, now: 0, denemeId: 'k1' });
  for (let i = 1; i <= 10; i++) s = answer(s, `2026-1-FM-${String(i).padStart(2, '0')}`, 'A');
  for (let i = 1; i <= 11; i++) s = answer(s, `2026-1-MAL-${String(i).padStart(2, '0')}`, i === 11 ? 'B' : 'A');
  const f = finish(s, byId, 1);
  assert.equal(f.sonuc.dersler.FM.puan, 55.55);
  assert.equal(f.sonuc.dersler.MAL.puan, 54.16); // 10 doğru, 1 yanlış
  assert.equal(f.sonuc.ortalama, 54.86); // kırpılmış puanların ortalaması 54,85 olurdu
});

test('bitirme: sonradan iptal edilen soru sayılmaz', () => {
  const qs = pool('FM');
  let s = createExam({ tur: 'ders', sorular: qs, sureDk: 45, now: 0, denemeId: 'k2' });
  s = answer(s, qs[0].id, 'B');
  const byId = Object.fromEntries(qs.map(q => [q.id, q]));
  byId[qs[0].id] = { ...qs[0], iptal: true };
  const d = finish(s, byId, 1).sonuc.dersler.FM;
  assert.deepEqual([d.gecerli, d.yanlis, d.bos], [19, 0, 19]);
});

test('resmi set iptal sorusunu dışlar, sırayı korur', () => {
  const qs = pickQuestions(pool('FTA', 7), { mod: 'resmi' });
  assert.equal(qs.length, 19);
  assert.equal(qs[6].no, 8);
});

test('rastgele seçim adet kadar ve iptalsiz', () => {
  let s = 1; const rng = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const qs = pickQuestions([...pool('FM'), ...pool('FM', 3).map(q => ({ ...q, id: q.id.replace('2026-1', '2026-2') }))], { mod: 'rastgele', adet: 20, rng });
  assert.equal(qs.length, 20);
  assert.ok(qs.every(q => !q.iptal));
  assert.equal(new Set(qs.map(q => q.id)).size, 20);
});

test('oturum oluşturma, cevap, bayrak, kalan süre', () => {
  const now = 1000;
  const s = createExam({ tur: 'ders', sorular: pool('MAL'), sureDk: 45, now, denemeId: 'd1' });
  assert.deepEqual(s.dersler, ['MAL']);
  assert.equal(s.soruIdler.length, 20);
  assert.equal(s.sureMs, 45 * 60000);
  const s2 = answer(s, '2026-1-MAL-01', 'B');
  assert.equal(s.cevaplar['2026-1-MAL-01'], undefined);
  assert.equal(s2.cevaplar['2026-1-MAL-01'], 'B');
  const s3 = answer(s2, '2026-1-MAL-01', null);
  assert.equal(s3.cevaplar['2026-1-MAL-01'], undefined);
  assert.equal(toggleFlag(s3, 'x').bayraklar.x, true);
  assert.equal(remainingMs(s3, now + 10 * 60000), 35 * 60000);
  assert.equal(remainingMs(s3, now + 60 * 60000), 0);
});

test('bitirme: ders bazında sayım, puan ve baraj', () => {
  const qs = [...pool('FM'), ...pool('MAL', 20)];
  const byId = Object.fromEntries(qs.map(q => [q.id, q]));
  let s = createExam({ tur: 'oturum', sorular: qs, sureDk: 180, now: 0, denemeId: 'd2' });
  assert.equal(s.soruIdler.length, 39);
  for (let i = 1; i <= 15; i++) s = answer(s, `2026-1-FM-${String(i).padStart(2, '0')}`, 'A');
  for (let i = 16; i <= 20; i++) s = answer(s, `2026-1-FM-${String(i).padStart(2, '0')}`, 'B');
  for (let i = 1; i <= 9; i++) s = answer(s, `2026-1-MAL-${String(i).padStart(2, '0')}`, 'A');
  const f = finish(s, byId, 5000);
  assert.equal(f.bittiMi, true);
  assert.deepEqual(f.sonuc.dersler.FM, { dogru: 15, yanlis: 5, bos: 0, gecerli: 20, puan: 68.75, gecti: true });
  assert.deepEqual(f.sonuc.dersler.MAL, { dogru: 9, yanlis: 0, bos: 10, gecerli: 19, puan: 47.36, gecti: false });
  assert.equal(f.sonuc.ortalama, 58.05);
  assert.equal(f.sonuc.ortalamaGecti, false);
  assert.equal(f.sonuc.toplamBos, 10);
});
