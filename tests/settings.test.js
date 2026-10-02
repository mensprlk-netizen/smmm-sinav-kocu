process.env.TZ = 'Europe/Istanbul';
import 'fake-indexeddb/auto';
import { test, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { setupDom } from './dom.js';
const win = setupDom();
const db = await import('../app/js/db.js');
const data = await import('../app/js/data.js');
const screen = await import('../app/js/screens/settings.js');

const INDEX = { surum: 7, donemler: ['2026-1', '2026-2'], dersler: [], konular: [],
  kaynaklar: { '2026-1': { url: 'u1', aciklama: 'Birinci dönem kitapçığı', indirme: '2026-03-01' }, '2026-2': { url: 'u2', aciklama: 'İkinci dönem kitapçığı', indirme: '2026-04-02' } } };
// 2026-10-03 01:30 yerel = 2026-10-02 22:30 UTC: toISOString tarihi bir gün geri kalırdı
const NOW = new Date(2026, 9, 3, 1, 30, 0).getTime();
let view, ctx, events, indexOk;
const settle = async () => { for (let i = 0; i < 10; i++) await new Promise(r => setTimeout(r, 0)); };
const run = async () => { await screen.render(view, {}, ctx); await settle(); };
const toasts = () => [...document.querySelectorAll('.toast')].map(t => t.textContent);
const clearToasts = () => document.querySelectorAll('.toast').forEach(t => t.remove());
const selects = () => [...view.querySelectorAll('select')];
const selTema = () => selects()[0], selFs = () => selects()[1], selHedef = () => selects()[2];
const dateIn = () => view.querySelector('input[type=date]');
const btn = (text, root = document) => [...root.querySelectorAll('button')].find(b => b.textContent === text);
const change = async (el, v) => { el.value = v; el.dispatchEvent(new win.Event('change', { bubbles: true })); await settle(); };
const sheetBtn = (text) => btn(text, document.querySelector('.sheet'));
const setStorage = (v) => Object.defineProperty(navigator, 'storage', { value: v, configurable: true });
const pickFile = async (content) => {
  const input = view.querySelector('input[type=file]');
  const file = new win.File([content], 'yedek.json', { type: 'application/json' });
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  input.dispatchEvent(new win.Event('change', { bubbles: true }));
  await settle();
  return input;
};
const seed = async () => {
  await db.setSetting('tema', 'dark'); await db.setSetting('yaziBoyutu', 3);
  await db.setSetting('hedefSaat', 2); await db.setSetting('sinavTarihi', '2026-11-28');
};
const onSettings = () => { events++; };

beforeEach(async () => {
  mock.timers.enable({ apis: ['Date'], now: NOW });
  indexOk = true;
  data.reset();
  data.setFetch(async (url) => (String(url).endsWith('data/index.json') && indexOk)
    ? { ok: true, json: async () => INDEX } : { ok: false });
  await db.open(new IDBFactory());
  document.body.innerHTML = '<div id="view"></div>';
  view = document.getElementById('view');
  ctx = { navigate: () => {}, db, data };
  events = 0;
  window.addEventListener('settings-changed', onSettings);
  setStorage(undefined);
});
afterEach(() => {
  window.removeEventListener('settings-changed', onSettings);
  screen.destroy();
  mock.timers.reset();
  mock.restoreAll();
});

const stubDownload = () => {
  const dl = { names: [], blobs: [], revoked: [] };
  mock.method(URL, 'createObjectURL', (b) => { dl.blobs.push(b); return 'blob:test'; });
  mock.method(URL, 'revokeObjectURL', (u) => { dl.revoked.push(u); });
  mock.method(win.HTMLAnchorElement.prototype, 'click', function () { dl.names.push(this.download); });
  return dl;
};
const fillData = async () => {
  await seed();
  await db.addAnswer({ soruId: 'q1', secilen: 'A', dogruMu: true, sureMs: 1000 });
  await db.addAnswer({ soruId: 'q2', secilen: 'B', dogruMu: false, sureMs: 1000 });
};

test('kayıtlı değerler seçili gelir, boşken varsayılanlar', async () => {
  await seed(); await run();
  assert.equal(view.querySelector('h1').textContent, 'Ayarlar');
  assert.equal(selTema().value, 'dark'); assert.equal(selFs().value, '3');
  assert.equal(selHedef().value, '2'); assert.equal(dateIn().value, '2026-11-28');
  await db.resetAll(); await run();
  assert.equal(selTema().value, 'system'); assert.equal(selFs().value, '2');
  assert.equal(selHedef().value, '1.5'); assert.equal(dateIn().value, '2026-11-28');
});

test('tema, yazı boyutu ve günlük hedef sayı olarak saklanır', async () => {
  await run();
  await change(selTema(), 'light');
  assert.equal(await db.getSetting('tema'), 'light'); assert.equal(events, 1);
  await change(selFs(), '4');
  assert.strictEqual(await db.getSetting('yaziBoyutu'), 4);
  await change(selHedef(), '1'); assert.strictEqual(await db.getSetting('hedefSaat'), 1);
  await change(selHedef(), '0.5'); assert.strictEqual(await db.getSetting('hedefSaat'), 0.5);
  assert.equal(events, 4);
  assert.equal([...selTema().options].find(o => o.value === 'light').textContent, 'Açık');
});

test('sınav tarihi: geçerli kaydedilir, boş yok sayılır', async () => {
  await seed(); await run();
  await change(dateIn(), '2026-12-05');
  assert.equal(await db.getSetting('sinavTarihi'), '2026-12-05');
  assert.ok(toasts().includes('Sınav tarihi güncellendi.')); assert.equal(events, 1);
  clearToasts();
  await change(dateIn(), '');
  assert.equal(await db.getSetting('sinavTarihi'), '2026-12-05');
  assert.equal(dateIn().value, '2026-12-05'); assert.equal(events, 1); assert.deepEqual(toasts(), []);
});

test('Yedekle: dosya adı yerel tarih, içerik, sonYedek, URL iptali', async () => {
  await fillData(); await run();
  assert.ok(view.textContent.includes('Henüz yedek alınmadı.'));
  const dl = stubDownload();
  btn('Yedekle').click(); await settle();
  assert.deepEqual(dl.names, ['smmm-koc-yedek-2026-10-03.json']);
  const json = JSON.parse(await dl.blobs[0].text());
  assert.equal(json.surum, 1);
  assert.deepEqual(Object.keys(json.depolar).sort(), ['answers', 'cards', 'exams', 'flags', 'ink', 'settings']);
  assert.equal(json.depolar.answers.length, 2);
  assert.equal(json.depolar.settings.find(s => s.anahtar === 'tema').deger, 'dark');
  assert.equal(await db.getSetting('sonYedek'), NOW);
  assert.ok(view.textContent.includes(`Son yedek: ${new Date(NOW).toLocaleString('tr-TR')}`));
  assert.deepEqual(dl.revoked, ['blob:test']);
  assert.ok(toasts().includes('Yedek indirildi.'));
});

test('geri yükleme gidiş-dönüş', async () => {
  await fillData(); await run();
  const dl = stubDownload();
  btn('Yedekle').click(); await settle();
  const yedek = await dl.blobs[0].text();
  await db.resetAll(); await run();
  assert.equal((await db.allAnswers()).length, 0); assert.equal(selTema().value, 'system');
  events = 0;
  const input = await pickFile(yedek);
  assert.ok(document.querySelector('.sheet').textContent.includes('Mevcut tüm ilerleme bu yedekle değiştirilecek. Devam?'));
  sheetBtn('Evet').click(); await settle();
  assert.equal((await db.allAnswers()).length, 2);
  assert.equal(await db.getSetting('tema'), 'dark');
  assert.equal(events, 1);
  assert.equal(selTema().selectedOptions[0].textContent, 'Koyu');
  assert.equal(selFs().value, '3');
  assert.ok(toasts().includes('Yedek geri yüklendi.'));
  assert.equal(input.value, '');
});

test('geri yükleme onayda vazgeçilirse hiçbir şey değişmez', async () => {
  await fillData(); await run();
  const dl = stubDownload();
  btn('Yedekle').click(); await settle();
  const yedek = await dl.blobs[0].text();
  await db.setSetting('tema', 'light'); await db.addAnswer({ soruId: 'q3', secilen: 'C', dogruMu: true, sureMs: 1 });
  events = 0;
  await pickFile(yedek);
  sheetBtn('Vazgeç').click(); await settle();
  assert.equal((await db.allAnswers()).length, 3); assert.equal(await db.getSetting('tema'), 'light');
  assert.equal(events, 0);
});

test('geçersiz yedek dosyaları veriyi bozmaz', async () => {
  await fillData(); await run();
  await pickFile('bu json değil');
  assert.ok(toasts().includes('Yedek dosyası okunamadı.'));
  assert.equal(document.querySelector('.sheet'), null);
  clearToasts();
  await pickFile('{ "foo": 1 }');
  assert.ok(toasts().includes('Yedek dosyası tanınmadı.'));
  assert.equal(document.querySelector('.sheet'), null);
  // yapısı doğru görünen ama içeriği bozuk yedek: onaydan sonra reddedilir
  clearToasts();
  const bozuk = { surum: 1, depolar: { answers: [], cards: [{ x: 1 }], ink: [], exams: [], settings: [], flags: [] } };
  await pickFile(JSON.stringify(bozuk)); sheetBtn('Evet').click(); await settle();
  assert.ok(toasts().includes('Yedek dosyası tanınmadı.'));
  assert.equal((await db.allAnswers()).length, 2); assert.equal(await db.getSetting('tema'), 'dark');
  assert.equal(events, 0);
});

test('sıfırlama: vazgeç korur, onay siler ve varsayılanları gösterir', async () => {
  await fillData(); await run();
  btn('Verileri sıfırla').click(); await settle();
  assert.ok(document.querySelector('.sheet').textContent.includes('Tüm ilerleme silinecek. Emin misin?'));
  sheetBtn('Vazgeç').click(); await settle();
  assert.equal((await db.allAnswers()).length, 2); assert.equal(events, 0);
  btn('Verileri sıfırla').click(); await settle();
  sheetBtn('Sil').click(); await settle();
  assert.equal((await db.allAnswers()).length, 0); assert.equal(await db.getSetting('tema', 'system'), 'system');
  assert.equal(events, 1);
  assert.equal(selTema().value, 'system'); assert.equal(selFs().value, '2');
  assert.equal(selHedef().value, '1.5'); assert.equal(dateIn().value, '2026-11-28');
});

test('kalıcı depolama satırı', async () => {
  await run();
  assert.ok(view.textContent.includes('Kalıcı depolama: Bu tarayıcıda desteklenmiyor'));
  assert.equal(btn('Kalıcı depolamayı iste'), undefined);

  let persist = async () => true;
  setStorage({ persisted: async () => false, persist: () => persist() });
  await run();
  assert.ok(view.textContent.includes('Kalıcı depolama: Kapalı'));
  persist = async () => false;
  btn('Kalıcı depolamayı iste').click(); await settle();
  assert.ok(toasts().includes('Tarayıcı kalıcı depolamayı vermedi; düzenli yedek al.'));
  assert.ok(view.textContent.includes('Kalıcı depolama: Kapalı'));
  persist = async () => { throw new Error('x'); };
  btn('Kalıcı depolamayı iste').click(); await settle();
  assert.ok(view.textContent.includes('Kalıcı depolama: Kapalı'));
  persist = async () => true;
  btn('Kalıcı depolamayı iste').click(); await settle();
  assert.ok(view.textContent.includes('Kalıcı depolama: Açık'));
  assert.ok(toasts().includes('Kalıcı depolama açıldı.'));
  assert.equal(btn('Kalıcı depolamayı iste'), undefined);
});

test('persisted() zaten açıksa düğme yok', async () => {
  setStorage({ persisted: async () => true, persist: async () => true });
  await run();
  assert.ok(view.textContent.includes('Kalıcı depolama: Açık')); assert.equal(btn('Kalıcı depolamayı iste'), undefined);
});

test('yazma hatasında standart toast, olay yok', async () => {
  await run();
  ctx = { ...ctx, db: { ...db, setSetting: async () => { throw new Error('disk'); } } };
  await run();
  await change(selTema(), 'light');
  assert.ok(toasts().includes('Kayıt yapılamadı, yedek almayı deneyin.'));
  assert.equal(events, 0); assert.equal(selTema().value, 'system');
});

test('Hakkında: sürüm ve dönem satırları; dizin yüklenemezse de açılır', async () => {
  await run();
  const t = view.textContent;
  assert.ok(t.includes('Veri sürümü: 7'));
  assert.ok(t.includes('2026-1: Birinci dönem kitapçığı (2026-03-01)'));
  assert.ok(t.includes('2026-2: İkinci dönem kitapçığı (2026-04-02)'));
  indexOk = false; data.reset(); view.innerHTML = '';
  await run();
  assert.ok(view.textContent.includes('Veri sürümü: —')); assert.equal(view.querySelector('h1').textContent, 'Ayarlar');
});

test('destroy() bekleyen render sırasında hiçbir şey eklemez', async () => {
  const p = screen.render(view, {}, ctx);
  screen.destroy();
  await p; await settle();
  assert.equal(view.children.length, 0);
});
