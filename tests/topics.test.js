import 'fake-indexeddb/auto';
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { setupDom } from './dom.js';
setupDom();
const db = await import('../app/js/db.js');
const data = await import('../app/js/data.js');
const topics = await import('../app/js/screens/topics.js');

const KOD = '10-maliyet-hacim-kar';
const TOPIC = {
  kod: KOD, sira: 10, baslik: 'Maliyet-Hacim-Kâr', amac: 'Başabaş analizi.',
  bolumler: [
    { baslik: 'Kavram', html: '<p>Bölüm bir.</p>' },
    { baslik: 'Grafik', html: '<p>Bölüm iki.</p>', gorsel: { tip: 'cvp-interactive', veri: { fiyat: 50, bdm: 30, sabit: 10000, maxMiktar: 1000 } } },
  ],
  sinavYaklasimi: ['İpucu bir'],
  ornekler: [{ soru: '<p>Örnek soru</p>', cozum: ['<p>Adım A</p>', '<p>Adım B</p>'] }],
  cikmisSorular: ['2026-1-MAL-07'],
  kartlar: [{ on: 'a', arka: 'b' }, { on: 'c', arka: 'd' }, { on: 'e', arka: 'f' }],
};
let konular, view, ctx;
const settle = async () => { for (let i = 0; i < 8; i++) { await new Promise(r => setTimeout(r, 0)); } };
const btn = (text) => [...view.querySelectorAll('button')].find(b => b.textContent.startsWith(text));

beforeEach(async () => {
  konular = [KOD];
  data.reset();
  data.setFetch(async (url) => {
    const u = String(url).replace(/^\.\//, '');
    let body;
    if (u === 'data/index.json') body = { surum: 1, donemler: [], dersler: [], konular };
    else if (u === `data/topics/maliyet/${KOD}.json`) body = TOPIC;
    return body === undefined ? { ok: false } : { ok: true, json: async () => body };
  });
  await db.open(new IDBFactory());
  document.body.innerHTML = '<div id="view"></div>';
  view = document.getElementById('view');
  ctx = { navigate: () => {}, db, data };
});
afterEach(() => { topics.destroy(); });

test('liste: bir kart ve çıkmış soru rozeti', async () => {
  await topics.render(view, {}, ctx); await settle();
  assert.equal(view.querySelectorAll('a.card').length, 1);
  assert.equal(view.querySelector('a.card').getAttribute('href'), '#/topics/' + KOD);
  assert.ok(view.querySelector('.badge').textContent.includes('1 çıkmış soru'));
});

test('konu sayfası: bölümler, kaydırıcı, çizim alanı, çözümü göster', async () => {
  await topics.render(view, { kod: KOD }, ctx); await settle();
  assert.ok(view.textContent.includes('Bölüm bir.') && view.textContent.includes('Bölüm iki.'));
  assert.ok(view.querySelector('input[data-key="sabit"]'));
  assert.ok(view.textContent.includes('Sınav yaklaşımı'));
  assert.equal(view.querySelectorAll('.ink-wrap').length, 1);
  const sol = view.querySelector('div[hidden]');
  assert.ok(sol && sol.textContent.includes('Adım A'));
  btn('Çözümü göster').click();
  assert.equal(sol.hidden, false);
  assert.equal(btn('Çözümü göster'), undefined);
});

test('çıkmış soru bağlantısı çalışma ekranının derin bağlantısıdır', async () => {
  await topics.render(view, { kod: KOD }, ctx); await settle();
  const a = [...view.querySelectorAll('a')].find(x => x.textContent.includes('2026-1-MAL-07'));
  assert.equal(a.getAttribute('href'), '#/study/q/2026-1-MAL-07');
  assert.ok(view.textContent.includes('Bu konudan çıkmış sorular'));
});

test('Konu kartlarını ekle 3 kart ekler, ikinci tıklama 0', async () => {
  await topics.render(view, { kod: KOD }, ctx); await settle();
  btn('Konu kartlarını ekle').click(); await settle();
  assert.equal((await db.allCards()).length, 3);
  assert.ok(document.body.textContent.includes('3 kart eklendi.'));
  btn('Konu kartlarını ekle').click(); await settle();
  assert.equal((await db.allCards()).length, 3);
  assert.ok(document.body.textContent.includes('Kartlar zaten ekli.'));
});

test('Okudum ayarı yazar ve liste Okundu gösterir', async () => {
  await topics.render(view, { kod: KOD }, ctx); await settle();
  btn('Okudum').click(); await settle();
  assert.equal(await db.getSetting('topic:read:' + KOD, false), true);
  view.innerHTML = '';
  await topics.render(view, {}, ctx); await settle();
  assert.equal(view.querySelector('.badge').textContent, 'Okundu');
});

test('bilinmeyen kod ve boş konu listesi', async () => {
  await topics.render(view, { kod: 'yok' }, ctx); await settle();
  assert.ok(view.textContent.includes('Konu bulunamadı.'));
  view.innerHTML = ''; konular = []; data.reset();
  await topics.render(view, {}, ctx); await settle();
  assert.ok(view.textContent.includes('Konu içeriği henüz eklenmedi.'));
});

test('destroy() bekleyen çizimi hemen kaydeder (ink destroy edildi)', async () => {
  await topics.render(view, { kod: KOD }, ctx); await settle();
  const canvas = view.querySelector('.ink-wrap canvas');
  const ev = (type, x) => canvas.dispatchEvent(new PointerEvent(type, { pointerId: 1, pointerType: 'mouse', clientX: x, clientY: x, bubbles: true, cancelable: true }));
  ev('pointerdown', 1); ev('pointermove', 5); ev('pointerup', 5);
  const key = `konu:${KOD}:ornek:0`;
  assert.deepEqual(await db.getInk(key), []); // debounce henüz dolmadı
  topics.destroy();
  await settle(); // 300 ms debounce süresinden çok önce
  assert.equal((await db.getInk(key)).length, 1);
});

test('render, ink getirilirken destroy edilirse hiçbir şey eklenmez', async () => {
  let release, pendingCalls = 0;
  const gate = new Promise(r => { release = r; });
  const deferred = { ...db, getInk: async (k) => { pendingCalls++; await gate; return db.getInk(k); } };
  const p = topics.render(view, { kod: KOD }, { ...ctx, db: deferred });
  for (let i = 0; i < 50 && !pendingCalls; i++) await new Promise(r => setTimeout(r, 0));
  assert.equal(pendingCalls, 1);
  topics.destroy();
  release(); await p; await settle();
  assert.equal(view.children.length, 0);
  assert.equal(view.querySelectorAll('.ink-wrap, canvas').length, 0);
});

test('render bitmeden destroy: sonradan ekleme ve ink yok', async () => {
  const p = topics.render(view, { kod: KOD }, ctx);
  topics.destroy();
  await p; await settle();
  assert.equal(view.children.length, 0);
  assert.equal(view.querySelectorAll('.ink-wrap').length, 0);
});

test('kayıt hatası toast gösterir, yakalanmamış ret yok', async () => {
  await topics.render(view, { kod: KOD }, ctx); await settle();
  const failing = { ...db, setSetting: async () => { throw new Error('x'); } };
  view.innerHTML = ''; topics.destroy();
  await topics.render(view, { kod: KOD }, { ...ctx, db: failing }); await settle();
  btn('Okudum').click(); await settle();
  assert.ok(document.body.textContent.includes('Kayıt yapılamadı'));
});
