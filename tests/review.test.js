process.env.TZ = 'Europe/Istanbul';
import 'fake-indexeddb/auto';
import { test, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { setupDom } from './dom.js';
setupDom();
const db = await import('../app/js/db.js');
const data = await import('../app/js/data.js');
const review = await import('../app/js/screens/review.js');
const { todayKey } = await import('../app/js/planner.js');

const DAY = 86400000;
const mkQ = (no) => ({
  id: `2026-1-FM-0${no}`, donem: '2026-1', ders: 'FM', no, konu: 'k', ortakBilgi: null,
  metin: `<p>Soru ${no}?</p>`, secenekler: { A: 'a', B: 'b', C: 'c', D: 'd', E: 'e' },
  dogru: 'C', iptal: false, cevapNotu: null, orijinal: { sayfa: 1, kutu: [0, 0, 10, 10] },
});
const sol = (no) => ({ id: `2026-1-FM-0${no}`, sonuc: 'C', ozet: 'Özet.', adimlar: ['<p>Adım</p>'], dayanak: 'D', tuzaklar: {}, kartlar: [], konuBaglantisi: 'k' });
const FILES = {
  'data/index.json': { surum: 1, donemler: ['2026-1'], dersler: ['FM'], konular: [] },
  'data/questions/2026-1-FM.json': [mkQ(1), mkQ(2), mkQ(3)],
  'data/solutions/2026-1-FM.json': [sol(1), sol(2), sol(3)],
};

const NOW = new Date(2026, 9, 2, 12, 0, 0).getTime();
const TODAY = todayKey(NOW);
let view, ctx;
const settle = async () => { for (let i = 0; i < 10; i++) await new Promise(r => setTimeout(r, 0)); };
const btns = (text) => [...view.querySelectorAll('button')].filter(b => b.textContent === text);
const btn = (text) => btns(text)[0];
const erkenBtns = () => [...view.querySelectorAll('button')].filter(b => b.textContent.startsWith('Erken tekrar'));
const opts = () => view.querySelectorAll('button.opt');
const run = async () => { await review.render(view, {}, ctx); await settle(); };
const click = async (text) => { btn(text).click(); await settle(); };

const base = { state: 'review', stability: 3, difficulty: 5, reps: 2, lapses: 0, lastReview: NOW - 3 * DAY };
const qCard = (no, due) => ({ ...base, kartId: `soru:2026-1-FM-0${no}`, tur: 'soru', kaynakId: `2026-1-FM-0${no}`, due });
const iCard = (n, due) => ({ ...base, kartId: `bilgi:k:${n}`, tur: 'bilgi', kaynakId: 'k', on: `Ön ${n}`, arka: `Arka ${n}`, due });
const putAll = async (cards) => { for (const c of cards) await db.saveCard(c); };
const infos = (n) => Array.from({ length: n }, (_, i) => iCard(i, NOW - 5000 + i));
const RATINGS = ['Tekrar', 'Zor', 'İyi', 'Kolay'];

beforeEach(async () => {
  mock.timers.enable({ apis: ['Date'], now: NOW });
  data.reset();
  data.setFetch(async (url) => {
    const body = FILES[String(url).replace(/^\.\//, '')];
    return body === undefined ? { ok: false } : { ok: true, json: async () => body };
  });
  await db.open(new IDBFactory());
  document.body.innerHTML = '<div id="view"></div>';
  view = document.getElementById('view');
  ctx = { navigate: () => {}, db, data };
});
afterEach(() => { review.destroy(); mock.timers.reset(); });

test('kart yokken Tekrar başlığı, "Vadesi gelen kart yok." ve Erken tekrar yok', async () => {
  await run();
  assert.equal(view.querySelector('h1').textContent, 'Tekrar');
  assert.ok(view.textContent.includes('Vadesi gelen kart yok.'));
  assert.equal(erkenBtns().length, 0);
});

test('vadesi gelen soru kartı: derece düğmeleri cevaptan sonra, İyi kaydeder ve bitirir', async () => {
  await putAll([qCard(1, NOW - 1000)]);
  await run();
  assert.equal(opts().length, 5);
  for (const t of RATINGS) assert.equal(btns(t).length, 0);
  view.querySelector('button.opt[data-letter="C"]').click(); await settle();
  for (const t of RATINGS) assert.equal(btns(t).length, 1);
  const answers = await db.allAnswers();
  assert.equal(answers.length, 1);
  assert.equal(answers[0].mod, 'review');
  await click('İyi');
  const card = await db.getCard('soru:2026-1-FM-01');
  assert.ok(card.due > NOW);
  assert.equal(card.state, 'review');
  assert.equal(card.reps, 3);
  assert.deepEqual(await db.getSetting('review:gun', null), { tarih: TODAY, sayac: 1 });
  assert.ok(view.textContent.includes('Tekrar bitti.'));
});

test('bilgi kartı: arka yüz tıklamadan önce gizli; Tekrar 10 dakika sonrasına learning', async () => {
  await putAll([iCard(0, NOW - 1000)]);
  await run();
  assert.ok(view.textContent.includes('Ön 0'));
  const back = [...view.querySelectorAll('div.card')].find(d => d.textContent.includes('Arka 0'));
  assert.equal(back.hidden, true);
  assert.ok(btn('Cevabı göster'));
  await click('Cevabı göster');
  assert.equal(back.hidden, false);
  assert.equal(btn('Cevabı göster'), undefined);
  for (const t of RATINGS) assert.equal(btns(t).length, 1);
  await click('Tekrar');
  const card = await db.getCard('bilgi:k:0');
  assert.equal(card.state, 'learning');
  assert.equal(card.due, NOW + 10 * 60000);
});

test('iki kart: ilk derecelendirilince ikinci gelir ve 2 / 2 yazar', async () => {
  await putAll(infos(2));
  await run();
  assert.ok(view.textContent.includes('1 / 2'));
  await click('Cevabı göster'); await click('İyi');
  assert.ok(view.textContent.includes('Ön 1'));
  assert.ok(view.textContent.includes('2 / 2'));
});

test('derece düğmesine çift dokunma kartı bir kez derecelendirir', async () => {
  await putAll(infos(2));
  await run();
  await click('Cevabı göster');
  const good = btn('İyi');
  good.click(); good.click(); await settle();
  assert.equal((await db.getSetting('review:gun', null)).sayac, 1);
  assert.equal((await db.getCard('bilgi:k:0')).reps, 3);
  assert.ok(view.textContent.includes('2 / 2'));
});

test('günlük hedef oturumlar arası korunur: sayac 38 -> hedef tamam; sayac 36 -> 2 kart', async () => {
  await putAll(infos(5));
  await db.setSetting('hedefSaat', 1.5);
  await db.setSetting('review:gun', { tarih: TODAY, sayac: 38 });
  await run();
  assert.ok(view.textContent.includes('Günlük tekrar hedefi tamam.'));
  assert.equal(opts().length, 0);
  assert.equal(btn('Cevabı göster'), undefined);
  view.innerHTML = '';
  await db.setSetting('review:gun', { tarih: TODAY, sayac: 36 });
  await run();
  assert.ok(view.textContent.includes('1 / 2'));
});

test('kota gün içinde küçülmez: sayac 5, 10 kart vadesi gelmiş -> 1 / 10', async () => {
  await putAll(infos(10));
  await db.setSetting('review:gun', { tarih: TODAY, sayac: 5 });
  await run();
  assert.ok(view.textContent.includes('1 / 10'));
});

test('eski günün sayacı bugünü etkilemez', async () => {
  await putAll(infos(3));
  await db.setSetting('review:gun', { tarih: '2026-10-01', sayac: 38 });
  await run();
  assert.ok(view.textContent.includes('1 / 3'));
});

test('Erken tekrar: 2 gün sonraki kart sunulur, 5 gün sonraki sunulmaz', async () => {
  await putAll([iCard(0, NOW + 2 * DAY)]);
  await run();
  assert.ok(view.textContent.includes('Vadesi gelen kart yok.'));
  assert.ok(btn('Erken tekrar (1)'));
  await click('Erken tekrar (1)');
  assert.ok(view.textContent.includes('Ön 0'));
  await click('Cevabı göster'); await click('İyi');
  assert.equal((await db.getSetting('review:gun', null)).sayac, 1);
  view.innerHTML = '';
  await db.saveCard(iCard(0, NOW + 5 * DAY));
  await run();
  assert.equal(erkenBtns().length, 0);
});

test('verisi olmayan soru kartı atlanır, sıradaki kart gösterilir', async () => {
  await putAll([{ ...qCard(9, NOW - 5000), kartId: 'soru:yok-99', kaynakId: 'yok-99' }, iCard(0, NOW - 1000)]);
  await run();
  assert.ok(view.textContent.includes('Ön 0'));
  assert.equal(opts().length, 0);
  assert.ok(view.textContent.includes('1 / 1'));
});

test('eksik soru toplamdan düşer: üç karttan biri yoksa 1 / 2 ve 2 / 2', async () => {
  await putAll([{ ...qCard(9, NOW - 9000), kartId: 'soru:yok-99', kaynakId: 'yok-99' }, iCard(0, NOW - 5000), iCard(1, NOW - 4000)]);
  await run();
  assert.ok(view.textContent.includes('1 / 2'));
  await click('Cevabı göster'); await click('İyi');
  assert.ok(view.textContent.includes('2 / 2'));
  assert.equal((await db.getSetting('review:gun', null)).sayac, 1);
});

test('iptal edilmiş sorunun kartı sunulmaz; tek kartsa "Vadesi gelen kart yok." ve sayaç yazılmaz', async () => {
  FILES['data/questions/2026-1-FM.json'] = [mkQ(1), mkQ(2), { ...mkQ(3), iptal: true }];
  try {
    await putAll([qCard(3, NOW - 1000)]);
    await run();
    assert.equal(opts().length, 0);
    assert.ok(view.textContent.includes('Vadesi gelen kart yok.'));
    assert.equal(await db.getSetting('review:gun', null), null);
  } finally { FILES['data/questions/2026-1-FM.json'] = [mkQ(1), mkQ(2), mkQ(3)]; }
});

test('addAnswer reddedilse de toast çıkar ve derece düğmeleri bir kez görünür; İyi kaydeder', async () => {
  await putAll([qCard(1, NOW - 1000)]);
  const failing = { ...db, addAnswer: async () => { throw new Error('boom'); } };
  await review.render(view, {}, { ...ctx, db: failing }); await settle();
  view.querySelector('button.opt[data-letter="C"]').click(); await settle();
  assert.ok(document.body.textContent.includes('Kayıt yapılamadı, yedek almayı deneyin.'));
  for (const t of RATINGS) assert.equal(btns(t).length, 1);
  await click('İyi');
  assert.equal((await db.getCard('soru:2026-1-FM-01')).reps, 3);
  assert.ok(view.textContent.includes('Tekrar bitti.'));
});

test('oturum ortasında destroy: hata yok, geç gelen adım görünüme eleman eklemez', async () => {
  await putAll([qCard(1, NOW - 1000)]);
  let gate;
  const slow = { ...data, getQuestion: () => new Promise((r) => { gate = r; }), getSolution: data.getSolution };
  const p = review.render(view, {}, { ...ctx, data: slow }); await settle();
  review.destroy();
  gate(mkQ(1)); await p; await settle();
  assert.equal(view.children.length, 0);
  assert.doesNotThrow(() => review.destroy());
});

test('sınav günü: kota 0, soru gösterilmez, çökmez', async () => {
  await db.setSetting('sinavTarihi', '2026-10-02');
  await putAll([qCard(1, NOW - 1000)]);
  await run();
  assert.equal(opts().length, 0);
  assert.ok(view.textContent.includes('Sınav günü'));
  assert.equal(erkenBtns().length, 1); // mevcut davranış: vadesi gelen kart erken tekrar olarak sunulur
});

test('kayıt hatası sessiz değil: toast gösterilir, kart ilerlemez, işlenmeyen ret yok', async () => {
  await putAll(infos(2));
  const failing = { ...db, saveCard: async () => { throw new Error('boom'); } };
  await review.render(view, {}, { ...ctx, db: failing }); await settle();
  await click('Cevabı göster'); await click('İyi');
  assert.ok(document.body.textContent.includes('Kayıt yapılamadı, yedek almayı deneyin.'));
  assert.ok(view.textContent.includes('1 / 2'));
  assert.equal((await db.getCard('bilgi:k:0')).reps, 2);
});

test('show aşamasında destroy: geç gelen soru görünüme eklenmez', async () => {
  await putAll([qCard(1, NOW - 1000)]);
  let gate, n = 0;
  const slow = { ...data, getQuestion: (id) => (++n === 1 ? data.getQuestion(id) : new Promise((r) => { gate = r; })), getSolution: data.getSolution };
  await review.render(view, {}, { ...ctx, data: slow }); await settle();
  review.destroy();
  gate(mkQ(1)); await settle();
  assert.equal(view.children.length, 0);
});
