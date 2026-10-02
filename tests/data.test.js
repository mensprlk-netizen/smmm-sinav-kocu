import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import * as data from '../app/js/data.js';

const files = {
  'data/index.json': { surum: 1, donemler: ['2026-1'], dersler: ['MAL'], konular: ['10-maliyet-hacim-kar'] },
  'data/questions/2026-1-MAL.json': [
    { id: '2026-1-MAL-01', donem: '2026-1', ders: 'MAL', no: 1, konu: '10-maliyet-hacim-kar', metin: '<p>a</p>', secenekler: { A: 'a', B: 'b', C: 'c', D: 'd', E: 'e' }, dogru: 'A', iptal: false },
    { id: '2026-1-MAL-02', donem: '2026-1', ders: 'MAL', no: 2, konu: '10-maliyet-hacim-kar', metin: '<p>b</p>', secenekler: { A: 'a', B: 'b', C: 'c', D: 'd', E: 'e' }, dogru: 'B', iptal: true }
  ],
  'data/solutions/2026-1-MAL.json': [{ id: '2026-1-MAL-01', sonuc: 'A', ozet: 'x', adimlar: [], dayanak: '', tuzaklar: {}, kartlar: [] }],
  'data/topics/maliyet/10-maliyet-hacim-kar.json': { kod: '10-maliyet-hacim-kar', sira: 10, baslik: 'MHK', bolumler: [], ornekler: [], cikmisSorular: [], kartlar: [] }
};

beforeEach(() => {
  data.reset();
  data.setFetch(async (url) => {
    const key = url.replace(/^\.\//, '');
    if (!(key in files)) return { ok: false, status: 404 };
    return { ok: true, json: async () => structuredClone(files[key]) };
  });
});

test('index yüklenir ve ders adı çözülür', async () => {
  const idx = await data.loadIndex();
  assert.equal(idx.surum, 1);
  assert.equal(data.dersAdi('MAL'), 'Maliyet Muhasebesi');
});

test('soru ve çözüm id ile bulunur', async () => {
  await data.loadIndex();
  const q = await data.getQuestion('2026-1-MAL-02');
  assert.equal(q.no, 2);
  const s = await data.getSolution('2026-1-MAL-01');
  assert.equal(s.sonuc, 'A');
  assert.equal(await data.getSolution('yok'), undefined);
});

test('filtre iptalleri dışlar', async () => {
  await data.loadIndex();
  const qs = await data.filterQuestions({ dersler: ['MAL'], donemler: ['2026-1'] });
  assert.deepEqual(qs.map(q => q.id), ['2026-1-MAL-01']);
  const all = await data.filterQuestions({ dersler: ['MAL'], donemler: ['2026-1'], iptalHaric: false });
  assert.equal(all.length, 2);
});

test('eksik dosya boş liste döner, çökmez', async () => {
  await data.loadIndex();
  assert.deepEqual(await data.loadQuestions('2026-1', 'FM'), []);
});

test('konular sıraya göre gelir', async () => {
  await data.loadIndex();
  const t = await data.loadTopics();
  assert.equal(t[0].baslik, 'MHK');
});
