import 'fake-indexeddb/auto';
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { setupDom } from './dom.js';
setupDom();
const db = await import('../app/js/db.js');
const data = await import('../app/js/data.js');
const study = await import('../app/js/screens/study.js');

const mkQ = (no, extra = {}) => ({
  id: `2026-1-MAL-0${no}`, donem: '2026-1', ders: 'MAL', no, konu: '01-maliyet-kavramlari', ortakBilgi: null,
  metin: `<p>Soru ${no}?</p>`, secenekler: { A: '<p>a</p>', B: '<p>b</p>', C: '<p>c</p>', D: '<p>d</p>', E: '<p>e</p>' },
  dogru: 'C', iptal: false, cevapNotu: null, orijinal: { sayfa: 1, kutu: [0, 0, 10, 10] }, ...extra,
});
const sol = (no) => ({ id: `2026-1-MAL-0${no}`, sonuc: 'C', ozet: 'Özet.', adimlar: ['<p>Adım 1</p>'], dayanak: 'D', tuzaklar: {}, kartlar: [{ on: 'x', arka: 'y' }], konuBaglantisi: '01-maliyet-kavramlari' });
const FILES = {
  'data/index.json': { surum: 1, donemler: ['2026-1'], dersler: ['MAL'], konular: [] },
  'data/questions/2026-1-MAL.json': [mkQ(1), mkQ(2), mkQ(3, { iptal: true })],
  'data/solutions/2026-1-MAL.json': [sol(1), sol(2)],
};
const IDS = ['2026-1-MAL-01', '2026-1-MAL-02', '2026-1-MAL-03'];

let view, navigated, ctx;
const settle = async () => { for (let i = 0; i < 8; i++) { await new Promise(r => setTimeout(r, 0)); } };
const btn = (text) => [...view.querySelectorAll('button')].find(b => b.textContent === text);
const opts = () => view.querySelectorAll('button.opt');

beforeEach(async () => {
  data.reset();
  data.setFetch(async (url) => {
    const body = FILES[String(url).replace(/^\.\//, '')];
    return body === undefined ? { ok: false } : { ok: true, json: async () => body };
  });
  await db.open(new IDBFactory());
  await db.setSetting('study:filtre', { dersler: [], donemler: [], kapsam: 'hepsi', sira: 'sirali' });
  document.body.innerHTML = '<div id="view"></div>';
  view = document.getElementById('view');
  navigated = [];
  ctx = { navigate: (hash) => navigated.push(hash), db, data };
});
afterEach(() => { study.destroy(); });

test('filtre paneli görünür, Başla soruyu açar ve konumu kaydeder', async () => {
  await study.render(view, {}, ctx); await settle();
  assert.equal(view.querySelector('h1').textContent, 'Çalış');
  assert.ok(btn('Başla'));
  btn('Başla').click(); await settle();
  assert.equal(opts().length, 5);
  assert.ok(view.textContent.includes('Soru 1'));
  const st = await db.getSetting('study:state', null);
  assert.deepEqual(st.ids, IDS);
  assert.equal(st.idx, 0);
});

test('yanlış cevap yazılır, kart learning olur, çözüm paneli açılır; Sonraki ilerler', async () => {
  await study.render(view, {}, ctx); await settle();
  btn('Başla').click(); await settle();
  view.querySelector('button.opt[data-letter="A"]').click(); await settle();
  const answers = await db.allAnswers();
  assert.equal(answers.length, 1);
  assert.equal(answers[0].dogruMu, false);
  assert.equal(answers[0].mod, 'study');
  const card = await db.getCard('soru:' + IDS[0]);
  assert.equal(card.state, 'learning');
  assert.ok(view.querySelector('.solution'));
  btn('Sonraki ›').click(); await settle();
  assert.ok(view.textContent.includes('Soru 2'));
  assert.equal((await db.getSetting('study:state', null)).idx, 1);
});

test('params.id tek soruyu açar', async () => {
  await study.render(view, { id: IDS[1] }, ctx); await settle();
  assert.equal(opts().length, 5);
  assert.ok(view.textContent.includes('Soru 2'));
  assert.ok(view.textContent.includes('1 / 1'));
});

test('kayıtlı konum varsa Devam et gösterilir ve kayıtlı soruyu açar', async () => {
  await db.setSetting('study:state', { ids: IDS, idx: 1, filtre: null });
  await study.render(view, {}, ctx); await settle();
  assert.ok(view.textContent.includes('Kaldığın yerden devam'));
  assert.ok(view.textContent.includes('2 / 3 soru'));
  btn('Devam et').click(); await settle();
  assert.equal(opts().length, 5);
  assert.ok(view.textContent.includes('Soru 2'));
});

test('görülmemişler kapsamı cevaplanan soruyu dışarıda bırakır', async () => {
  await db.addAnswer({ soruId: IDS[0], cevap: 'C', dogruMu: true, emin: true, sure: 1, mod: 'study', denemeId: null });
  await study.render(view, {}, ctx); await settle();
  const sel = [...view.querySelectorAll('select')][0];
  sel.value = 'gorulmemis';
  btn('Başla').click(); await settle();
  const st = await db.getSetting('study:state', null);
  assert.deepEqual(st.ids, [IDS[1], IDS[2]]);
});

test('son sorudaki Sonraki filtre ekranını açar ve konumu siler', async () => {
  await db.setSetting('study:state', { ids: [IDS[0], IDS[1]], idx: 1, filtre: null });
  await study.render(view, {}, ctx); await settle();
  btn('Devam et').click(); await settle();
  assert.ok(view.textContent.includes('Soru 2'));
  btn('Sonraki ›').click(); await settle();
  assert.ok(btn('Başla'));
  assert.equal(view.querySelectorAll('button.opt').length, 0);
  assert.equal(await db.getSetting('study:state', 'yok'), null);
});

test('derin bağlantı kayıtlı konumu ezmez', async () => {
  const seeded = { ids: IDS, idx: 1, filtre: null };
  await db.setSetting('study:state', seeded);
  await study.render(view, { id: IDS[0] }, ctx); await settle();
  assert.equal(opts().length, 5);
  assert.ok(view.textContent.includes('Soru 1'));
  assert.deepEqual(await db.getSetting('study:state', null), seeded);
});

test('çift dokunuşta ikinci Sonraki yok sayılır', async () => {
  await study.render(view, {}, ctx); await settle();
  btn('Başla').click(); await settle();
  const next = btn('Sonraki ›');
  next.click(); next.click(); await settle();
  assert.equal(view.querySelectorAll('.question').length, 1);
  assert.ok(view.textContent.includes('Soru 2'));
  assert.equal((await db.getSetting('study:state', null)).idx, 1);
});

test('bekleyen show sırasında destroy soru görünümü bırakmaz', async () => {
  await study.render(view, {}, ctx); await settle();
  btn('Başla').click();
  study.destroy();
  await settle();
  assert.equal(view.querySelectorAll('.question').length, 0);
});

test('bilinmeyen kimlik Soru bulunamadı gösterir ve konum yazmaz', async () => {
  await study.render(view, { id: '2026-1-MAL-99' }, ctx); await settle();
  assert.ok(view.textContent.includes('Soru bulunamadı.'));
  assert.equal(await db.getSetting('study:state', 'yok'), 'yok');
});

test('hata etiketi son cevaba yazılır', async () => {
  await study.render(view, {}, ctx); await settle();
  btn('Başla').click(); await settle();
  view.querySelector('button.opt[data-letter="A"]').click(); await settle();
  view.querySelector('[data-tag="dikkat"]').click(); await settle();
  const list = await db.answersFor(IDS[0]);
  assert.equal(list.length, 1);
  assert.equal(list[0].hataEtiketi, 'dikkat');
});

test('yazma hatası tek cümlelik toast gösterir', async () => {
  ctx.db = { ...db, addAnswer: () => Promise.reject(new Error('x')) };
  await study.render(view, { id: IDS[0] }, ctx); await settle();
  view.querySelector('button.opt[data-letter="A"]').click(); await settle();
  const toasts = [...document.querySelectorAll('.toast')].map(t => t.textContent);
  assert.deepEqual(toasts, ['Kayıt yapılamadı, yedek almayı deneyin.']);
});
