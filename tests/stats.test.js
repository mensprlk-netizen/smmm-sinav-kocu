process.env.TZ = 'Europe/Istanbul';
import 'fake-indexeddb/auto';
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { setupDom } from './dom.js';
setupDom();
const db = await import('../app/js/db.js');
const data = await import('../app/js/data.js');
const screen = await import('../app/js/screens/stats.js');

const pad = (n) => String(n).padStart(2, '0');
const mkQ = (ders, no, konu, iptal = false) => ({
  id: `2026-1-${ders}-${pad(no)}`, donem: '2026-1', ders, no, konu, ortakBilgi: null,
  metin: `<p>Soru ${no}?</p>`, secenekler: { A: 'a', B: 'b', C: 'c', D: 'd', E: 'e' },
  dogru: 'C', iptal, cevapNotu: null, orijinal: { sayfa: 1, kutu: [0, 0, 10, 10] },
});
const M = (no) => `2026-1-MAL-${pad(no)}`, F = (no) => `2026-1-FM-${pad(no)}`;
const files = (topics = false) => ({
  'data/index.json': { surum: 1, donemler: ['2026-1'], dersler: ['FM', 'MAL'], konular: topics ? ['k2'] : [] },
  'data/questions/2026-1-MAL.json': [mkQ('MAL', 1, 'k1'), mkQ('MAL', 2, 'k1'), mkQ('MAL', 3, 'k1'), mkQ('MAL', 4, 'k2'), mkQ('MAL', 5, 'k2'), mkQ('MAL', 6, 'k3'), mkQ('MAL', 7, 'k1', true)],
  'data/questions/2026-1-FM.json': [mkQ('FM', 1, 'kf'), mkQ('FM', 2, 'kf'), mkQ('FM', 3, 'kf')],
  'data/topics/maliyet/k2.json': { kod: 'k2', baslik: 'Maliyet Konusu', sira: 1 },
});
const useFiles = (f) => {
  data.reset();
  data.setFetch(async (url) => { const b = f[String(url).replace(/^\.\//, '')]; return b === undefined ? { ok: false } : { ok: true, json: async () => b }; });
};
const ans = (soruId, dogruMu, tarih, sure, mod, cevap, hataEtiketi) => db.put('answers', { soruId, dogruMu, tarih, sure, mod, cevap, emin: true, denemeId: null, ...(hataEtiketi ? { hataEtiketi } : {}) });
// MAL: M1 yanlış sonra doğru; M2, M3 (sınav, süresiz), M5 yanlış; M4 doğru; M7 (iptal) yanlış. FM: F1, F2 doğru (sınav), F3 yanlış (tekrar).
const seedAnswers = async () => {
  await ans(M(1), false, 100, 60000, 'study', 'A', 'bilgi'); await ans(M(1), true, 200, 30000, 'study', 'C');
  await ans(M(2), false, 300, 90000, 'study', 'B', 'dikkat');
  await ans(M(3), false, 500, 0, 'exam', 'D');
  await ans(M(4), true, 150, 20000, 'study', 'C');
  await ans(M(5), false, 400, 30000, 'study', 'E', 'bilgi');
  await ans(M(7), false, 600, 99999, 'study', 'A', 'okuma');
  await ans(F(1), true, 700, 0, 'exam', 'C'); await ans(F(2), true, 710, 0, 'exam', 'C');
  await ans(F(3), false, 800, 0, 'review', 'B', 'sure');
};
const exam = (denemeId, over) => ({ denemeId, tur: 'ders', dersler: ['MAL'], soruIdler: [M(1)], dersOf: {}, cevaplar: {}, bayraklar: {}, baslangic: 1, sureMs: 60000, bitis: null, bittiMi: false, sonuc: null, ...over });

let view, ctx, navs;
const settle = async () => { for (let i = 0; i < 20; i++) await new Promise(r => setImmediate(r)); };
const cardOf = (t) => [...view.querySelectorAll('.card')].find(c => c.querySelector('h3')?.textContent === t);
const rows = (t) => [...cardOf(t).querySelectorAll('.stat-row')].map(r => [r.children[0].textContent, r.children[1].textContent]);
const rowTexts = (t) => rows(t).map(r => r.join(' | '));
const logIds = () => [...cardOf('Hata defteri').querySelectorAll('a.stat-row')].map(a => a.getAttribute('href').split('/').pop());
const kurBtn = () => [...document.querySelectorAll('button')].find(b => b.textContent === 'Bu listeden deneme kur');
const selects = () => cardOf('Hata defteri').querySelectorAll('select');
const pick = async (sel, v) => { sel.value = v; sel.dispatchEvent(new window.Event('change')); await settle(); };
const run = async () => { await screen.render(view, {}, ctx); await settle(); };

beforeEach(async () => {
  useFiles(files());
  await db.open(new IDBFactory());
  document.body.innerHTML = '<div id="view"></div>';
  view = document.getElementById('view');
  navs = [];
  ctx = { navigate: (u) => navs.push(u), db, data };
});
afterEach(() => screen.destroy());

test('boş veri tabanı: başlık, her kartın boş durumu, deneme düğmesi pasif', async () => {
  await run();
  assert.equal(view.querySelector('h1').textContent, 'İstatistik');
  assert.deepEqual([...view.querySelectorAll('.card h3')].map(e => e.textContent),
    ['Ders bazında', 'Konu bazında', 'Zayıf konular', 'Hata türleri', 'Deneme geçmişi', 'Hata defteri']);
  assert.deepEqual(rowTexts('Ders bazında'), [`${data.dersAdi('FM')} | 0/3 · — · —`, `${data.dersAdi('MAL')} | 0/6 · — · —`]);
  assert.match(cardOf('Konu bazında').textContent, /Henüz çözülen soru yok\./);
  assert.match(cardOf('Zayıf konular').textContent, /Bir konuda en az 3 soru çözünce burada görünür\./);
  assert.match(cardOf('Hata türleri').textContent, /Kayıt yok\./);
  assert.match(cardOf('Deneme geçmişi').textContent, /Henüz deneme yok\./);
  assert.match(cardOf('Hata defteri').textContent, /Kayıt yok\./);
  assert.equal(kurBtn().disabled, true);
});

test('ders bazında: gorulen/toplam, yüzde ve mm:ss; yalnız sınav satırı olan derste "—"', async () => {
  await seedAnswers(); await run();
  assert.deepEqual(rowTexts('Ders bazında'), [`${data.dersAdi('FM')} | 3/3 · 67% · —`, `${data.dersAdi('MAL')} | 5/6 · 40% · 00:46`]);
});

test('konu bazında: derse göre gruplu, zayıf önce, görülmeyen konu yok; konu adı dosyadan', async () => {
  await seedAnswers(); await run();
  assert.deepEqual([...cardOf('Konu bazında').children].slice(1).map(e => e.tagName + ':' + e.textContent),
    [`H4:${data.dersAdi('FM')}`, 'DIV:kf3 · 67% · —', `H4:${data.dersAdi('MAL')}`, 'DIV:k13 · 33% · 01:00', 'DIV:k22 · 50% · 00:25']);
  assert.ok(!cardOf('Konu bazında').textContent.includes('k3'));
  screen.destroy(); view.innerHTML = ''; useFiles(files(true)); await run();
  assert.deepEqual(rows('Konu bazında').map(r => r[0]), ['kf', 'k1', 'Maliyet Konusu']);
});

test('zayıf konular: 3+ görülen ve düşük doğruluk listelenir, 2 görülen listelenmez', async () => {
  await seedAnswers(); await run();
  assert.deepEqual(rowTexts('Zayıf konular'), [`${data.dersAdi('MAL')} · k1 | 33% · 01:00`, `${data.dersAdi('FM')} · kf | 67% · —`]);
});

test('hata türleri: etiket başına tam sayılar, doğrular sayılmaz', async () => {
  await seedAnswers(); await run();
  assert.deepEqual(rows('Hata türleri'), [['Bilgi eksiği', '2'], ['Dikkatsizlik', '1'], ['Süre', '1'], ['Yanlış okudum', '1'], ['Etiketsiz', '1']]);
});

test('deneme geçmişi: virgüllü puan, sonuç bağlantısı, bitmeyen yok, yeni önce', async () => {
  await db.saveExam(exam('e1', { bittiMi: true, bitis: new Date(2026, 8, 20, 10).getTime(), sonuc: { ortalama: 47.37 } }));
  await db.saveExam(exam('e2', { bittiMi: true, dersler: ['FM'], bitis: new Date(2026, 9, 1, 10).getTime(), sonuc: { ortalama: 60 } }));
  await db.saveExam(exam('e3'));
  await run();
  const links = [...cardOf('Deneme geçmişi').querySelectorAll('a.stat-row')];
  assert.deepEqual(links.map(a => a.getAttribute('href')), ['#/exam/result/e2', '#/exam/result/e1']);
  assert.equal(links[1].children[1].textContent, '47,37');
  assert.equal(links[0].children[1].textContent, '60');
  assert.equal(links[1].children[0].textContent, `20.09.2026 · ${data.dersAdi('MAL')}`);
});

test('hata defteri: yalnız son cevabı yanlışlar, yeni önce, filtreler, bağlantı', async () => {
  await seedAnswers(); await run();
  assert.deepEqual(logIds(), [F(3), M(7), M(3), M(5), M(2)]); // M(1) yanlış sonra doğru: yok
  const links = cardOf('Hata defteri').querySelectorAll('a.stat-row');
  assert.equal(links[0].getAttribute('href'), '#/study/q/' + F(3));
  assert.equal(links[0].children[1].textContent, 'B ✗ · Süre');
  assert.equal(links[2].children[1].textContent, 'D ✗ · —');
  await pick(selects()[0], 'MAL'); assert.deepEqual(logIds(), [M(7), M(3), M(5), M(2)]);
  await pick(selects()[0], 'FM'); assert.deepEqual(logIds(), [F(3)]);
  await pick(selects()[0], ''); await pick(selects()[1], 'bilgi'); assert.deepEqual(logIds(), [M(5)]);
  await pick(selects()[0], 'FM'); assert.deepEqual(logIds(), []);
  assert.equal(kurBtn().disabled, true);
});

test('deneme kur: süzülmüş, iptalsiz liste; tur ozel; süre; yönlendirme', async () => {
  await seedAnswers(); await run();
  await pick(selects()[0], 'MAL');
  kurBtn().click(); await settle();
  const exams = await db.allExams();
  assert.equal(exams.length, 1);
  assert.deepEqual(exams[0].soruIdler, [M(3), M(5), M(2)]); // M(7) iptal: sınava girmez
  assert.equal(exams[0].tur, 'ozel'); assert.equal(exams[0].sureMs, 10 * 60000);
  assert.deepEqual(navs, ['#/exam/run/' + exams[0].denemeId]);
});

test('deneme kur: yarım deneme var ve vazgeçilirse yeni kayıt yok', async () => {
  await seedAnswers(); await db.saveExam(exam('eski'));
  await run(); kurBtn().click(); await settle();
  assert.match(document.body.textContent, /Yarım kalan deneme silinip yenisi başlatılsın mı\?/);
  [...document.querySelectorAll('button')].find(b => b.textContent === 'Vazgeç').click(); await settle();
  assert.deepEqual((await db.allExams()).map(e => e.denemeId), ['eski']); assert.deepEqual(navs, []);
});

test('deneme kur: çift dokunuş tek deneme başlatır', async () => {
  await seedAnswers(); await run();
  const b = kurBtn(); b.click(); b.click(); await settle();
  assert.equal((await db.allExams()).length, 1); assert.equal(navs.length, 1);
});

test('deneme kur: yalnız iptal sorular varsa bulunamadı bildirimi, kayıt yok', async () => {
  await ans(M(7), false, 600, 1000, 'study', 'A'); await run();
  assert.equal(kurBtn().disabled, false);
  kurBtn().click(); await settle();
  assert.ok([...document.querySelectorAll('.toast')].some(t => t.textContent === 'Bu seçimle soru bulunamadı.'));
  assert.equal((await db.allExams()).length, 0);
});

test('destroy(): bekleyen render hiçbir şey eklemez', async () => {
  await seedAnswers();
  const p = screen.render(view, {}, ctx);
  screen.destroy();
  await p; await settle();
  assert.equal(view.children.length, 0);
});

test('hata defteri: Etiketsiz filtresi süzer ve deneme bu listeden kurulur', async () => {
  await seedAnswers(); await run();
  await pick(selects()[1], 'etiketsiz'); assert.deepEqual(logIds(), [M(3)]);
  kurBtn().click(); await settle();
  const exams = await db.allExams();
  assert.equal(exams.length, 1); assert.deepEqual(exams[0].soruIdler, [M(3)]);
});

test('aynı konu etiketi iki derste: Konu bazında ve Zayıf konular ayrı gösterir', async () => {
  const f = files();
  f['data/questions/2026-1-MAL.json'] = [mkQ('MAL', 1, 'genel'), mkQ('MAL', 2, 'genel'), mkQ('MAL', 3, 'genel')];
  f['data/questions/2026-1-FM.json'] = [mkQ('FM', 1, 'genel'), mkQ('FM', 2, 'genel'), mkQ('FM', 3, 'genel')];
  useFiles(f);
  for (const n of [1, 2, 3]) { await ans(F(n), true, 10 + n, 0, 'exam', 'C'); await ans(M(n), n === 1, 20 + n, 0, 'exam', 'C'); }
  await run();
  assert.deepEqual([...cardOf('Konu bazında').children].slice(1).map(e => e.tagName + ':' + e.textContent),
    [`H4:${data.dersAdi('FM')}`, 'DIV:genel3 · 100% · —', `H4:${data.dersAdi('MAL')}`, 'DIV:genel3 · 33% · —']);
  assert.deepEqual(rowTexts('Zayıf konular'), [`${data.dersAdi('MAL')} · genel | 33% · —`, `${data.dersAdi('FM')} · genel | 100% · —`]);
});
