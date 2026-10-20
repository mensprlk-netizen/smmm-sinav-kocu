process.env.TZ = 'Europe/Istanbul';
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
const rowOf = (name) => view.querySelector(`[data-row="${name}"]`) ?? undefined;
const rowText = (name) => rowOf(name).querySelector('[data-val]').textContent;                 // Tekrar / Yeni soru: "5 / 8"
const dersText = (name) => { const r = rowOf(name); return `${r.querySelector('[data-gorulen]').textContent} ${r.querySelector('[data-oran]').textContent}`; }; // "2/2 50%"
const big = () => view.querySelector('[data-role="gun"]').textContent;
const label = () => view.querySelector('[data-role="sinav-tarihi"]').textContent;
const seri = () => view.querySelector('[data-role="seri"]').textContent;
const hafta = () => [...view.querySelectorAll('.leaf-hafta .g')].map(g => (g.classList.contains('dolu') ? '●' : '○') + (g.classList.contains('bugun') ? '!' : ''));
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
  assert.equal(big(), '10');
  assert.ok(view.textContent.includes('gün kaldı'));
  const plan = gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 0, sinavaKalanGun: 10, dersIstatistik: [] });
  assert.ok(view.textContent.includes(plan.mesaj));
  assert.equal(label(), '12 Ekim 2026, Pazartesi');
  await db.setSetting('sinavTarihi', '2026-11-28');
  view.innerHTML = ''; await run();
  assert.equal(label(), '28 Kasım 2026, Cumartesi');
  assert.equal(big(), '57');
});

test('cevap yokken ders kartı 0/toplam ve —; cevaplardan sonra güncellenir', async () => {
  await run();
  assert.equal(dersText('Finansal Muhasebe'), '0/2 —');
  assert.equal(dersText('Maliyet Muhasebesi'), '0/2 —');
  assert.equal(rowOf('Hukuk'), undefined);
  view.innerHTML = '';
  await db.addAnswer({ soruId: '2026-1-MAL-01', cevap: 'C', dogruMu: true, emin: true, sure: 5, mod: 'study', denemeId: null });
  await db.addAnswer({ soruId: '2026-1-MAL-02', cevap: 'A', dogruMu: false, emin: true, sure: 5, mod: 'study', denemeId: null });
  await run();
  assert.equal(dersText('Maliyet Muhasebesi'), '2/2 50%');
  assert.equal(dersText('Finansal Muhasebe'), '0/2 —');
  assert.ok(rowOf('Finansal Muhasebe').textContent.includes('Öneri')); // hiç görülmemiş ders önce önerilir
  assert.ok(!rowOf('Maliyet Muhasebesi').textContent.includes('Öneri'));
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
  assert.equal(label(), '2 Ekim 2026, Cuma');
});

test('sınav tarihi geçmişte: Geçti, çökmez', async () => {
  await db.setSetting('sinavTarihi', '2026-09-20');
  await run();
  assert.equal(big(), 'Geçti');
  assert.ok(view.textContent.includes('Sınav tarihi geçti'));
});

test('Yeni soru sayacı yerel güne göre: gece yarısından sonraki cevap sayılır, önceki gün sayılmaz', async () => {
  await db.setSetting('sinavTarihi', '2026-11-28');
  mock.timers.setTime(new Date(2026, 9, 1, 23, 30).getTime());
  await db.addAnswer({ soruId: '2026-1-MAL-01', cevap: 'C', dogruMu: true, emin: true, sure: 5, mod: 'study', denemeId: null });
  mock.timers.setTime(new Date(2026, 9, 2, 0, 45).getTime());
  await db.addAnswer({ soruId: '2026-1-MAL-02', cevap: 'C', dogruMu: true, emin: true, sure: 5, mod: 'study', denemeId: null });
  mock.timers.setTime(new Date(2026, 9, 2, 1, 30).getTime());
  await run();
  assert.equal(rowText('Yeni soru'), '1 / 20');
});

test('sınav günü sabah 08:00 de Bugün', async () => {
  mock.timers.setTime(new Date(2026, 9, 12, 8, 0).getTime());
  await run();
  assert.equal(big(), 'Bugün');
  assert.ok(view.textContent.includes('Sınav günü'));
});

test('sınavdan önceki akşam 23:00: 1 gün ve tam oturum önerisi', async () => {
  mock.timers.setTime(new Date(2026, 9, 11, 23, 0).getTime());
  await run();
  assert.equal(big(), '1');
  assert.ok(view.textContent.includes('tam oturum'));
});

test('sınavdan sonraki gün 00:30: Geçti', async () => {
  mock.timers.setTime(new Date(2026, 9, 13, 0, 30).getTime());
  await run();
  assert.equal(big(), 'Geçti');
});

test('eski günün tekrar sayacı bugün 0 / kota gösterir', async () => {
  await db.saveCard({ kartId: 'soru:2026-1-MAL-01', tur: 'soru', kaynakId: '2026-1-MAL-01', state: 'review', due: NOW - 1000 });
  await db.setSetting('review:gun', { tarih: '2026-10-01', sayac: 5 });
  await run();
  assert.equal(rowText('Tekrar'), '0 / 1');
});

test('aynı soru bugün iki kez çalışılınca Yeni soru 1 sayılır (ayrık soru)', async () => {
  await db.setSetting('sinavTarihi', '2026-11-28');
  for (let i = 0; i < 2; i++) await db.addAnswer({ soruId: '2026-1-MAL-01', cevap: 'C', dogruMu: true, emin: true, sure: 5, mod: 'study', denemeId: null });
  await run();
  assert.equal(rowText('Yeni soru'), '1 / 20');
});

test('Tekrar çubuğu bugünkü yapılan + kalan kotayı gösterir (5 / 8)', async () => {
  for (let i = 0; i < 3; i++) await db.saveCard({ kartId: `bilgi:k:${i}`, tur: 'bilgi', kaynakId: 'k', state: 'review', due: NOW - 1000 });
  await db.setSetting('review:gun', { tarih: '2026-10-02', sayac: 5 });
  await run();
  assert.equal(rowText('Tekrar'), '5 / 8');
});

test('veritabanı açılamadıysa Ana sayfa yine de çizilir (salt okunur mod)', async () => {
  await assert.rejects(() => db.open(null));
  view.innerHTML = '';
  await run();
  assert.equal(big(), '57'); // kayıtlı tarih okunamaz: varsayılan sınav tarihi
  assert.ok(view.textContent.length > 0);
});

test('takvim yaprağı: hafta noktaları ve seri; bugün çalışılmadıysa "sürdür", ilk günde "Henüz seri yok"', async () => {
  // 2 Ekim 2026 Cuma. Çarşamba ve Perşembe çalışılmış, bugün henüz değil.
  await run();
  assert.equal(seri(), 'Henüz seri yok. Bugün başla.');
  assert.deepEqual(hafta(), ['○', '○', '○', '○', '○!', '○', '○']);
  view.innerHTML = '';
  mock.timers.setTime(new Date(2026, 8, 30, 20, 0).getTime());
  await db.addAnswer({ soruId: '2026-1-MAL-01', cevap: 'C', dogruMu: true, emin: true, sure: 5, mod: 'study', denemeId: null });
  mock.timers.setTime(new Date(2026, 9, 1, 20, 0).getTime());
  await db.addAnswer({ soruId: '2026-1-MAL-02', cevap: 'C', dogruMu: true, emin: true, sure: 5, mod: 'study', denemeId: null });
  mock.timers.setTime(NOW);
  await run();
  assert.equal(seri(), 'Seri 2 gün; bugün sürdür.');
  assert.deepEqual(hafta(), ['○', '○', '●', '●', '○!', '○', '○']);
  view.innerHTML = '';
  await db.setSetting('review:gun', { tarih: '2026-10-02', sayac: 3 }); // bugün yalnız bilgi kartı tekrarı: yine çalışılmış sayılır
  await run();
  assert.equal(seri(), '3 gün üst üste çalıştın.');
  assert.deepEqual(hafta(), ['○', '○', '●', '●', '●!', '○', '○']);
});

test('yarım kalan deneme yokken ana ekrana "null" yazılmaz', async () => {
  await run();
  assert.ok(!view.textContent.includes('null'));
});
