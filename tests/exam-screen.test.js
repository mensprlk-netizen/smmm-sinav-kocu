process.env.TZ = 'Europe/Istanbul';
import 'fake-indexeddb/auto';
import { test, beforeEach, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import { setupDom } from './dom.js';
setupDom();
const db = await import('../app/js/db.js');
const data = await import('../app/js/data.js');
const X = await import('../app/js/exam.js');
const screen = await import('../app/js/screens/exam.js');

const pad = (n) => String(n).padStart(2, '0');
const mkQ = (donem, ders, no, iptal = false) => ({
  id: `${donem}-${ders}-${pad(no)}`, donem, ders, no, konu: 'k', ortakBilgi: null,
  metin: `<p>Soru ${no}?</p>`, secenekler: { A: 'a', B: 'b', C: 'c', D: 'd', E: 'e' },
  dogru: 'C', iptal: iptal && no === 7, cevapNotu: null, orijinal: { sayfa: 1, kutu: [0, 0, 10, 10] },
});
const set = (donem, ders, iptal = false) => Array.from({ length: 20 }, (_, i) => mkQ(donem, ders, i + 1, iptal));
const sol = (q) => ({ id: q.id, sonuc: 'C', ozet: 'Özet.', adimlar: ['<p>Adım</p>'], dayanak: 'D', tuzaklar: {}, kartlar: [], konuBaglantisi: 'k' });
const FILES = {
  'data/index.json': { surum: 1, donemler: ['2026-1', '2026-2'], dersler: ['FM', 'MAL'], konular: [] },
  'data/questions/2026-1-MAL.json': set('2026-1', 'MAL', true),
  'data/questions/2026-2-MAL.json': set('2026-2', 'MAL'),
  'data/questions/2026-1-FM.json': set('2026-1', 'FM'),
  'data/solutions/2026-1-MAL.json': set('2026-1', 'MAL', true).slice(0, 15).map(sol),
};

const NOW = new Date(2026, 9, 2, 12, 0, 0).getTime();
const MIN = 60000;
let view, ctx, navs;
const settle = async () => { for (let i = 0; i < 20; i++) await new Promise(r => setImmediate(r)); };
const allBtns = (text) => [...document.querySelectorAll('button')].filter(b => b.textContent === text);
const click = async (text) => { allBtns(text)[0].click(); await settle(); };
const opt = (L) => view.querySelector(`button.opt[data-letter="${L}"]`);
const tick = async (ms) => { mock.timers.tick(ms); await settle(); };
const cardOf = (title) => [...view.querySelectorAll('.card')].find(c => c.querySelector('h3')?.textContent === title);
const startBtn = (title) => cardOf(title).querySelector('button.btn-primary');
const toastText = () => [...document.querySelectorAll('.toast')].map(t => t.textContent);

const run = async (stage, id) => { await screen.render(view, { stage, id }, ctx); await settle(); };
const malPool = async () => X.pickQuestions(await data.filterQuestions({ dersler: ['MAL'], donemler: ['2026-1'], iptalHaric: false }), { mod: 'resmi' });
const seed = async (over = {}) => {
  const qs = await malPool();
  const s = { ...X.createExam({ tur: 'ders', sorular: qs, sureDk: 45, now: NOW, denemeId: 'd1' }), ...over };
  await db.saveExam(s); return s;
};
// 10 correct, 4 wrong, 5 blank
const pattern = (s) => {
  const cevaplar = {};
  s.soruIdler.forEach((id, k) => { if (k < 10) cevaplar[id] = 'C'; else if (k < 14) cevaplar[id] = 'A'; });
  return cevaplar;
};
const seedFinished = async () => {
  const s0 = await seed(); const s1 = { ...s0, cevaplar: pattern(s0) };
  const byId = Object.fromEntries((await malPool()).map(q => [q.id, q]));
  const fin = { ...X.finish(s1, byId, NOW + 20 * MIN), satirlarYazildi: true }; await db.saveExam(fin); return fin;
};

beforeEach(async () => {
  mock.timers.enable({ apis: ['Date', 'setInterval', 'setTimeout'], now: NOW });
  data.reset();
  data.setFetch(async (url) => {
    const body = FILES[String(url).replace(/^\.\//, '')];
    return body === undefined ? { ok: false } : { ok: true, json: async () => body };
  });
  await db.open(new IDBFactory());
  document.body.innerHTML = '<div id="view"></div>';
  view = document.getElementById('view');
  navs = [];
  ctx = { navigate: (h) => { navs.push(h); }, db, data };
});
afterEach(() => { screen.destroy(); mock.timers.reset(); });

test('kurulum: Deneme başlığı ve üç kart', async () => {
  await run();
  assert.equal(view.querySelector('h1').textContent, 'Deneme');
  assert.deepEqual([...view.querySelectorAll('.card h3')].map(e => e.textContent), ['Tek ders', 'Tam oturum', 'Özel']);
  assert.ok(!view.textContent.includes('Yarım kalan deneme var'));
});

test('tek ders resmi set: iptal elenir, 45 dk, tur ders, run yoluna gider', async () => {
  await run();
  const c = cardOf('Tek ders'); const [dersSel, donemSel] = c.querySelectorAll('select');
  dersSel.value = 'MAL'; donemSel.value = '2026-1';
  startBtn('Tek ders').click(); await settle();
  assert.equal(navs.length, 1);
  assert.match(navs[0], /^#\/exam\/run\/d/);
  const s = await db.getExam(navs[0].split('/').pop());
  assert.equal(s.soruIdler.length, 19);
  assert.ok(!s.soruIdler.includes('2026-1-MAL-07'));
  assert.equal(s.sureMs, 45 * MIN);
  assert.equal(s.tur, 'ders');
});

test('sınav ekranı: sayaç, cevap değiştirme, Boş bırak, ipucu yok', async () => {
  await seed(); await run('run', 'd1');
  assert.equal(view.querySelector('.timer').textContent, '45:00');
  await tick(1000);
  assert.equal(view.querySelector('.timer').textContent, '44:59');
  opt('C').click(); await settle();
  assert.equal((await db.getExam('d1')).cevaplar['2026-1-MAL-01'], 'C');
  opt('D').click(); await settle();
  assert.equal((await db.getExam('d1')).cevaplar['2026-1-MAL-01'], 'D');
  assert.ok(opt('D').classList.contains('selected'));
  assert.ok(!opt('C').classList.contains('selected'));
  assert.equal(view.querySelectorAll('.correct, .wrong, .solution').length, 0);
  await click('Boş bırak');
  assert.equal((await db.getExam('d1')).cevaplar['2026-1-MAL-01'], undefined);
  assert.ok(!opt('D').classList.contains('selected'));
  assert.equal(view.querySelectorAll('.correct, .wrong, .solution').length, 0);
});

test('sayaç 5 dakikanın altında low sınıfı alır', async () => {
  await seed({ baslangic: NOW - 41 * MIN }); await run('run', 'd1');
  assert.equal(view.querySelector('.timer').textContent, '04:00');
  assert.ok(view.querySelector('.timer').classList.contains('low'));
});

test('soru haritası: 19 düğme, cevaplılar answered, numaraya tıklayınca atlar', async () => {
  await seed(); await run('run', 'd1');
  opt('C').click(); await settle();
  await click('Soru haritası');
  const btns = [...document.querySelectorAll('.grid-map button')];
  assert.equal(btns.length, 19);
  assert.ok(btns[0].classList.contains('answered'));
  assert.ok(!btns[1].classList.contains('answered'));
  btns[4].click(); await settle();
  assert.equal(view.querySelectorAll('.question').length, 1);
  assert.ok(view.querySelector('.question').textContent.includes('Soru 5'));
  assert.ok(view.querySelector('.question').textContent.includes('5 / 19'));
  assert.equal(document.querySelectorAll('.grid-map').length, 0);
});

test('Bitir: onay ister, bir cevap satırı/cevaplı soru, kart yok, sonuca gider', async () => {
  await seed(); await run('run', 'd1');
  opt('C').click(); await settle();
  await click('Sonraki ›');
  opt('A').click(); await settle();
  await click('Bitir');
  assert.ok(document.body.textContent.includes('Sınavı bitirmek istiyor musun? Boş: 17'));
  assert.equal(navs.length, 0);
  assert.equal((await db.getExam('d1')).bittiMi, false);
  await click('Evet');
  const s = await db.getExam('d1');
  assert.equal(s.bittiMi, true);
  assert.ok(s.sonuc);
  assert.equal(s.sonuc.toplamDogru, 1); assert.equal(s.sonuc.toplamYanlis, 1);
  const rows = (await db.allAnswers()).filter(a => a.mod === 'exam');
  assert.equal(rows.length, 2);
  assert.ok(rows.every(a => a.denemeId === 'd1'));
  assert.deepEqual(rows.map(a => a.dogruMu).sort(), [false, true]);
  assert.equal((await db.allCards()).length, 0);
  assert.deepEqual(navs, ['#/exam/result/d1']);
});

test('sonuç: 10 doğru 4 yanlış 5 boş → 47,37 ve baraj altı mesajı', async () => {
  await seedFinished(); await run('result', 'd1');
  const t = view.textContent;
  assert.ok(t.includes('47,37'));
  assert.ok(t.includes('Doğru 10 · Yanlış 4 · Boş 5'));
  assert.ok(t.includes('Ders barajı 50 altında'));
  assert.ok(t.includes('10D 4Y 5B'));
  assert.ok(t.includes('Süre 20:00'));
  assert.equal(view.querySelector('a[href="#/exam/review/d1"]').textContent, 'Yanlışları gözden geçir');
  assert.equal(view.querySelector('a[href="#/exam"]').textContent, 'Yeni deneme');
});

test('süre dolunca bir kez biter', async () => {
  await seed(); await run('run', 'd1');
  opt('C').click(); await settle();
  await tick(45 * MIN + 1000);
  const s = await db.getExam('d1');
  assert.equal(s.bittiMi, true);
  assert.equal(s.bitis, NOW + 45 * MIN);
  assert.equal((await db.allAnswers()).filter(a => a.mod === 'exam').length, 1);
  assert.deepEqual(navs, ['#/exam/result/d1']);
});

test('süre dolması ile Bitir onayı aynı anda: tek sonuç, tek cevap satırı', async () => {
  await seed(); await run('run', 'd1');
  opt('C').click(); await settle();
  await click('Bitir');
  allBtns('Evet')[0].click();
  mock.timers.tick(45 * MIN + 1000);
  await settle();
  assert.equal((await db.allAnswers()).filter(a => a.mod === 'exam').length, 1);
  assert.deepEqual(navs, ['#/exam/result/d1']);
});

test('devam: kurulumda Yarım kalan deneme var + Devam et; sınavda cevap ve gerçek kalan süre', async () => {
  const s0 = await seed();
  await db.saveExam({ ...s0, cevaplar: { ...Object.fromEntries(s0.soruIdler.map(id => [id, 'C'])), '2026-1-MAL-20': 'B' } });
  mock.timers.tick(10 * MIN);
  await run();
  assert.ok(view.textContent.includes('Yarım kalan deneme var'));
  const a = [...view.querySelectorAll('a')].find(x => x.textContent === 'Devam et');
  assert.equal(a.getAttribute('href'), '#/exam/run/d1');
  view.innerHTML = '';
  await run('run', 'd1');
  assert.ok(opt('B').classList.contains('selected'));
  assert.equal(view.querySelector('.timer').textContent, '35:00');
});

test('süresi dolmuş oturum açılınca doğrudan biter; biten sonuca; bilinmeyen bulunamadı', async () => {
  const s0 = await seed({ baslangic: NOW - 46 * MIN, cevaplar: { '2026-1-MAL-01': 'C' } });
  await run('run', 'd1');
  const s = await db.getExam('d1');
  assert.equal(s.bittiMi, true);
  assert.equal(s.sonuc.toplamDogru, 1);
  assert.equal(s.bitis, s0.baslangic + 45 * MIN);
  assert.equal((await db.allAnswers()).filter(a => a.mod === 'exam').length, 1);
  assert.deepEqual(navs, ['#/exam/result/d1']);
  await run('run', 'd1');
  assert.deepEqual(navs, ['#/exam/result/d1', '#/exam/result/d1']);
  assert.equal((await db.allAnswers()).length, 1);
  view.innerHTML = '';
  await run('run', 'yok');
  assert.ok(view.textContent.includes('Deneme bulunamadı.'));
});

test('yeni deneme başlatırken yarım kalan varsa onay istenir', async () => {
  await seed(); await run();
  const [dersSel, donemSel] = cardOf('Tek ders').querySelectorAll('select');
  dersSel.value = 'MAL'; donemSel.value = '2026-1';
  startBtn('Tek ders').click(); await settle();
  assert.ok(document.body.textContent.includes('Yarım kalan deneme silinip yenisi başlatılsın mı?'));
  await click('Vazgeç');
  assert.deepEqual((await db.allExams()).map(e => e.denemeId), ['d1']);
  assert.equal(navs.length, 0);
  startBtn('Tek ders').click(); await settle();
  await click('Evet');
  const ids = (await db.allExams()).map(e => e.denemeId);
  assert.equal(ids.length, 1);
  assert.notEqual(ids[0], 'd1');
  assert.deepEqual(navs, ['#/exam/run/' + ids[0]]);
});

test('yarım kalanı Sil: yerinde yeniden çizer', async () => {
  await seed(); await run();
  await click('Sil'); await click('Evet');
  assert.equal((await db.allExams()).length, 0);
  assert.ok(!view.textContent.includes('Yarım kalan deneme var'));
  assert.equal(view.querySelectorAll('h1').length, 1);
});

test('Yanlışları tekrara ekle: yanlış/boş başına bir learning kartı, cevap satırı yok, bir kez', async () => {
  await seedFinished(); await run('result', 'd1');
  await click('Yanlışları tekrara ekle');
  const cards = await db.allCards();
  assert.equal(cards.length, 9);
  assert.ok(cards.every(c => c.state === 'learning' && c.tur === 'soru'));
  assert.equal((await db.allAnswers()).length, 0);
  assert.equal((await db.getExam('d1')).tekrarEklendi, true);
  const b = allBtns('Tekrara eklendi')[0];
  assert.ok(b && b.disabled);
  assert.ok(toastText().includes('9 soru tekrar kuyruğuna eklendi.'));
  b.click(); await settle();
  assert.equal((await db.allCards()).length, 9);
  view.innerHTML = '';
  await run('result', 'd1');
  const b2 = allBtns('Tekrara eklendi')[0];
  assert.ok(b2 && b2.disabled);
  assert.equal(allBtns('Yanlışları tekrara ekle').length, 0);
});

test('Yanlışları gözden geçir: yanlış şık wrong, doğru correct, çözüm var; Sonraki ilerler', async () => {
  const fin = await seedFinished(); await run('review', 'd1');
  const no = (id) => +id.slice(-2);
  assert.equal(view.querySelectorAll('.question').length, 1);
  assert.ok(view.querySelector('.question').textContent.includes('1 / 9'));
  assert.ok(view.querySelector('.question').textContent.includes('Soru ' + no(fin.soruIdler[10])));
  assert.ok(opt('A').classList.contains('wrong'));
  assert.ok(opt('C').classList.contains('correct'));
  assert.ok(view.querySelector('.solution'));
  await click('Sonraki ›');
  assert.ok(view.querySelector('.question').textContent.includes('2 / 9'));
  assert.ok(view.querySelector('.question').textContent.includes('Soru ' + no(fin.soruIdler[11])));
  assert.equal(view.querySelectorAll('.question').length, 1);
  // double tap advances one step only
  allBtns('Sonraki ›')[0].click(); allBtns('Sonraki ›')[0].click(); await settle();
  assert.ok(view.querySelector('.question').textContent.includes('3 / 9'));
  // a blank question: no wrong option, the correct one is shown
  for (let k = 0; k < 2; k++) await click('Sonraki ›');
  assert.ok(view.querySelector('.question').textContent.includes('5 / 9'));
  assert.equal(view.querySelectorAll('.wrong').length, 0);
  assert.ok(opt('C').classList.contains('correct'));
});

test('boş seçim (verisi olmayan ders): tek cümlelik toast, gezinme yok', async () => {
  await run();
  const [dersSel] = cardOf('Tek ders').querySelectorAll('select');
  dersSel.value = 'HUK';
  startBtn('Tek ders').click(); await settle();
  assert.ok(toastText().includes('Bu seçimle soru bulunamadı.'));
  assert.equal(navs.length, 0);
  assert.equal((await db.allExams()).length, 0);
  startBtn('Özel').click(); await settle();
  assert.ok(toastText().includes('En az bir ders seç.'));
});

test('tam oturum: yalnız verisi olan 1. oturum dersleri, DERSLER sırasıyla, 180 dk', async () => {
  await run();
  startBtn('Tam oturum').click(); await settle();
  const s = await db.getExam(navs[0].split('/').pop());
  assert.equal(s.tur, 'oturum');
  assert.equal(s.sureMs, 180 * MIN);
  assert.deepEqual(s.dersler, ['FM', 'MAL']);
  assert.equal(s.soruIdler.length, 40);
  assert.ok(s.soruIdler.slice(0, 20).every(id => id.includes('-FM-')));
  assert.ok(s.soruIdler.slice(20).every(id => id.includes('-MAL-')));
  assert.ok(!s.soruIdler.includes('2026-1-MAL-07'));
});

test('destroy: sayaç durur, saat ilerlemesi hiçbir şey yazmaz; çift Sonraki tek soru', async () => {
  await seed(); await run('run', 'd1');
  allBtns('Sonraki ›')[0].click(); allBtns('Sonraki ›')[0].click(); await settle();
  assert.equal(view.querySelectorAll('.question').length, 1);
  assert.ok(view.querySelector('.question').textContent.includes('Soru 2'));
  const before = JSON.stringify(await db.getExam('d1'));
  screen.destroy();
  const text = view.querySelector('.timer').textContent;
  await tick(60 * MIN);
  assert.equal(view.querySelector('.timer').textContent, text);
  assert.equal(JSON.stringify(await db.getExam('d1')), before);
  assert.equal((await db.allAnswers()).length, 0);
  assert.equal(navs.length, 0);
});

test('destroy: bekleyen render sonrasında görünüme bir şey eklenmez', async () => {
  await seed();
  const p = screen.render(view, { stage: 'run', id: 'd1' }, ctx);
  screen.destroy();
  await p; await settle();
  assert.equal(view.children.length, 0);
});

test('saveExam reddedilirse standart toast görünür, seçim ekranda kalır', async () => {
  await seed();
  ctx = { navigate: () => {}, data, db: { ...db, saveExam: async () => { throw new Error('boom'); } } };
  await run('run', 'd1');
  opt('C').click(); await settle();
  assert.ok(toastText().includes('Kayıt yapılamadı, yedek almayı deneyin.'));
  assert.ok(opt('C').classList.contains('selected'));
  await click('Sonraki ›'); await click('‹ Önceki');
  assert.ok(opt('C').classList.contains('selected'));
});

test('satır yazımı başarısız: bitmiş, satirlarYazildi false, satır yok, toast, sonuca gider; sonuç yeniden dener', async () => {
  await seed();
  ctx = { navigate: (h) => { navs.push(h); }, data, db: { ...db, addAnswers: async () => { throw new Error('boom'); } } };
  await run('run', 'd1');
  opt('C').click(); await settle();
  await click('Sonraki ›'); opt('A').click(); await settle();
  await click('Bitir'); await click('Evet');
  const s = await db.getExam('d1');
  assert.equal(s.bittiMi, true);
  assert.equal(s.satirlarYazildi, false);
  assert.equal((await db.allAnswers()).filter(a => a.mod === 'exam').length, 0);
  assert.ok(toastText().includes('Kayıt yapılamadı, yedek almayı deneyin.'));
  assert.deepEqual(navs, ['#/exam/result/d1']);
  ctx = { navigate: (h) => { navs.push(h); }, db, data };
  view.innerHTML = '';
  await run('result', 'd1');
  assert.equal((await db.allAnswers()).filter(a => a.mod === 'exam').length, 2);
  assert.equal((await db.getExam('d1')).satirlarYazildi, true);
  view.innerHTML = '';
  await run('result', 'd1');
  assert.equal((await db.allAnswers()).filter(a => a.mod === 'exam').length, 2);
});

test('bayat oturum: kayıtlı sınav başka yerde bitmişse yeniden bitirmez', async () => {
  await seed(); await run('run', 'd1');
  opt('C').click(); await settle();
  const fin = await seedFinished();
  const sonuc = JSON.stringify(fin.sonuc);
  const before = (await db.allAnswers()).length;
  await click('Bitir'); await click('Evet');
  assert.equal((await db.allAnswers()).length, before);
  assert.equal(JSON.stringify((await db.getExam('d1')).sonuc), sonuc);
  assert.deepEqual(navs, ['#/exam/result/d1']);
});

test('Özel: süre ve soru sayısı sınırlanır', async () => {
  const mk = async (adet, sure, dersler = ['MAL']) => {
    await db.resetAll(); view.innerHTML = ''; navs.length = 0;
    await run();
    const c = cardOf('Özel');
    c.querySelectorAll('input[type=checkbox]').forEach(i => { i.checked = dersler.includes(i.value); });
    const [a, s] = [...c.querySelectorAll('input[type=number]')];
    a.value = adet; s.value = sure;
    startBtn('Özel').click(); await settle();
    return db.getExam(navs[0].split('/').pop());
  };
  assert.equal((await mk('20', '-10')).sureMs, 5 * MIN);
  assert.equal((await mk('20', '9999')).sureMs, 240 * MIN);
  assert.equal((await mk('-3', '45')).soruIdler.length, 5);
  assert.equal((await mk('1000', '45', ['MAL', 'FM'])).soruIdler.length, 59);
  const e = await mk('', '');
  assert.equal(e.soruIdler.length, 20);
  assert.equal(e.sureMs, 45 * MIN);
});

test('devam: ilk cevapsız soruda açılır', async () => {
  const s0 = await seed();
  await db.saveExam({ ...s0, cevaplar: Object.fromEntries(s0.soruIdler.slice(0, 3).map(id => [id, 'C'])) });
  await run('run', 'd1');
  assert.ok(view.querySelector('.question').textContent.includes('4 / 19'));
});

test('onay arka plana tıklanarak kapatılırsa Başla yeniden çalışır', async () => {
  await seed(); await run();
  const [dersSel, donemSel] = cardOf('Tek ders').querySelectorAll('select');
  dersSel.value = 'MAL'; donemSel.value = '2026-1';
  startBtn('Tek ders').click(); await settle();
  document.querySelector('.sheet-backdrop').click(); await settle();
  assert.equal(navs.length, 0);
  startBtn('Tek ders').click(); await settle();
  assert.ok(document.body.textContent.includes('silinip yenisi başlatılsın mı?'));
  await click('Evet');
  assert.equal(navs.length, 1);
});

test('gözden geçir: Kartları ekle kart yazar, etiket deneme satırına, bayrak ve Feynman mürekkebi kaydedilir', async () => {
  data.reset();
  data.setFetch(async (url) => {
    let b = FILES[String(url).replace(/^\.\//, '')];
    if (b && String(url).includes('solutions')) b = b.map(x => ({ ...x, kartlar: [{ on: 'ön', arka: 'arka' }] }));
    return b === undefined ? { ok: false } : { ok: true, json: async () => b };
  });
  const fin = await seedFinished(); const qid = fin.soruIdler[10];
  await db.addAnswer({ soruId: qid, cevap: 'A', dogruMu: false, emin: true, sure: 0, mod: 'exam', denemeId: 'd1' });
  await run('review', 'd1');
  const before = (await db.allCards()).length;
  view.querySelector('[data-role="cards"]').click(); await settle();
  assert.equal((await db.allCards()).length, before + 1);
  view.querySelector('[data-tag="dikkat"]').click(); await settle();
  assert.equal((await db.answersFor(qid))[0].hataEtiketi, 'dikkat');
  view.querySelector('[data-role="flag"]').click(); await settle();
  assert.equal((await db.getFlag(qid)).bayrak, true);
  view.querySelector('[data-role="feynman"]').click();
  const cv = document.querySelector('.sheet canvas');
  const ev = (t, x, y) => cv.dispatchEvent(new PointerEvent(t, { clientX: x, clientY: y, pointerType: 'pen', pressure: 0.6, bubbles: true }));
  ev('pointerdown', 5, 5); ev('pointermove', 20, 20); ev('pointerup', 20, 20);
  await tick(400);
  assert.ok((await db.getInk('feynman:' + qid))?.length >= 1);
});
