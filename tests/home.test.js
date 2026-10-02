import 'fake-indexeddb/auto';
import { test, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { setupDom } from './dom.js';
setupDom();
const db = await import('../app/js/db.js');
const data = await import('../app/js/data.js');
const home = await import('../app/js/screens/home.js');
const { gunlukPlan } = await import('../app/js/planner.js');

const mkQ = (ders, no, extra = {}) => ({
  id: `2026-1-${ders}-0${no}`, donem: '2026-1', ders, no, konu: 'k', ortakBilgi: null,
  metin: `<p>Soru ${no}?</p>`, secenekler: { A: 'a', B: 'b', C: 'c', D: 'd', E: 'e' },
  dogru: 'C', iptal: false, cevapNotu: null, orijinal: { sayfa: 1, kutu: [0, 0, 10, 10] }, ...extra,
});
const FILES = {
  'data/index.json': { surum: 1, donemler: ['2026-1'], dersler: ['FM', 'MAL'], konular: [] },
  'data/questions/2026-1-FM.json': [mkQ('FM', 1), mkQ('FM', 2), mkQ('FM', 3, { iptal: true })],
  'data/questions/2026-1-MAL.json': [mkQ('MAL', 1), mkQ('MAL', 2), mkQ('MAL', 3, { iptal: true })],
};

// Sabit an: 2026-10-02 12:00 yerel saat. Sınav 09:00 yerel.
const NOW = new Date(2026, 9, 2, 12, 0, 0).getTime();
let view, ctx;
const settle = async () => { for (let i = 0; i < 8; i++) await new Promise(r => setTimeout(r, 0)); };
const rowOf = (name) => [...view.querySelectorAll('div')].find(d => d.firstElementChild?.tagName === 'SPAN' && d.firstElementChild.textContent === name && d.children.length === 2);
const rowText = (name) => rowOf(name).children[1].textContent;
const big = () => view.querySelector('div[style*="2.4em"]').textContent;
const label = () => view.querySelector('.muted').textContent;
const run = async () => { await home.render(view, {}, ctx); await settle(); };

beforeEach(async () => {
  mock.timers.enable({ apis: ['Date'], now: NOW });
  data.reset();
  data.setFetch(async (url) => {
    const body = FILES[String(url).replace(/^\.\//, '')];
    return body === undefined ? { ok: false } : { ok: true, json: async () => body };
  });
  await db.open(new IDBFactory());
  await db.setSetting('sinavTarihi', '2026-10-12'); // 12 Ekim 09:00 -> 9,875 gün -> 10
  document.body.innerHTML = '<div id="view"></div>';
  view = document.getElementById('view');
  ctx = { navigate: () => {}, db, data };
});
afterEach(() => { mock.timers.reset(); });

test('geri sayım, plan mesajı ve tarih etiketi', async () => {
  await run();
  assert.equal(big(), '10 gün');
  const plan = gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 0, sinavaKalanGun: 10, dersIstatistik: [] });
  assert.ok(view.textContent.includes(plan.mesaj));
  assert.equal(label(), 'SMMM Yeterlilik Sınavı · 12 Ekim 2026');
  await db.setSetting('sinavTarihi', '2026-11-28');
  view.innerHTML = ''; await run();
  assert.equal(label(), 'SMMM Yeterlilik Sınavı · 28 Kasım 2026');
  assert.equal(big(), '57 gün');
});

test('cevap yokken ders kartı 0/toplam ve —; cevaplardan sonra güncellenir', async () => {
  await run();
  assert.equal(rowText('Finansal Muhasebe'), '0/2 · —');
  assert.equal(rowText('Maliyet Muhasebesi'), '0/2 · —');
  assert.equal(rowOf('Hukuk'), undefined);
  view.innerHTML = '';
  await db.addAnswer({ soruId: '2026-1-MAL-01', cevap: 'C', dogruMu: true, emin: true, sure: 5, mod: 'study', denemeId: null });
  await db.addAnswer({ soruId: '2026-1-MAL-02', cevap: 'A', dogruMu: false, emin: true, sure: 5, mod: 'study', denemeId: null });
  await run();
  assert.equal(rowText('Maliyet Muhasebesi'), '2/2 · 50%');
  assert.equal(rowText('Finansal Muhasebe'), '0/2 · —');
});

test('vadesi geçmiş kart varken Tekrar çubuğu 0 / 1 gösterir', async () => {
  await db.saveCard({ kartId: 'soru:2026-1-MAL-01', tur: 'soru', kaynakId: '2026-1-MAL-01', state: 'review', due: NOW - 1000 });
  await run();
  assert.equal(rowText('Tekrar'), '0 / 1');
});

test('yarım kalan deneme bağlantısı', async () => {
  await run();
  assert.equal(view.querySelector('a[href="#/exam/run/d1"]'), null);
  view.innerHTML = '';
  await db.saveExam({ denemeId: 'd1', bittiMi: false, baslangic: NOW });
  await run();
  const a = view.querySelector('a[href="#/exam/run/d1"]');
  assert.ok(a);
  assert.equal(a.textContent, 'Yarım kalan denemeye devam et');
});

test('sınav günü: Bugün ve Sınav günü mesajı', async () => {
  await db.setSetting('sinavTarihi', '2026-10-02');
  await run();
  assert.equal(big(), 'Bugün');
  assert.ok(view.textContent.includes('Sınav günü'));
  assert.equal(label(), 'SMMM Yeterlilik Sınavı · 2 Ekim 2026');
});

test('sınav tarihi geçmişte: Geçti, çökmez', async () => {
  await db.setSetting('sinavTarihi', '2026-09-20');
  await run();
  assert.equal(big(), 'Geçti');
  assert.ok(view.textContent.includes('Sınav tarihi geçti'));
});
