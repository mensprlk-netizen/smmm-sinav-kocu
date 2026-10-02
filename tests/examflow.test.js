import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './dom.js';
setupDom();
const { startExam } = await import('../app/js/examflow.js');

const mkQ = (id, iptal = false) => ({ id, ders: 'MAL', donem: '2026-1', no: 1, konu: 'k', iptal });
const fakeDb = (exams = [], failSave = false) => {
  const store = new Map(exams.map(e => [e.denemeId, e]));
  return { store,
    allExams: async () => [...store.values()],
    del: async (_s, k) => { store.delete(k); },
    saveExam: async (e) => { if (failSave) throw new Error('x'); store.set(e.denemeId, e); } };
};
const settle = async () => { for (let i = 0; i < 10; i++) await new Promise(r => setImmediate(r)); };
const toasts = () => [...document.querySelectorAll('.toast')].map(t => t.textContent);
const press = async (text) => { [...document.querySelectorAll('button')].find(b => b.textContent === text).click(); await settle(); };
let navs, navigate;
beforeEach(() => { document.body.innerHTML = ''; navs = []; navigate = (u) => navs.push(u); });

test('boş veya yalnız iptal liste: toast, false, kayıt yok', async () => {
  const db = fakeDb();
  assert.equal(await startExam({ db, navigate, tur: 'ozel', sorular: [], sureDk: 10 }), false);
  assert.equal(await startExam({ db, navigate, tur: 'ozel', sorular: [mkQ('a', true)], sureDk: 10 }), false);
  assert.deepEqual(toasts(), ['Bu seçimle soru bulunamadı.', 'Bu seçimle soru bulunamadı.']);
  assert.equal(db.store.size, 0); assert.deepEqual(navs, []);
});

test('yarım deneme yok: kaydedilir ve yönlendirilir', async () => {
  const db = fakeDb();
  assert.equal(await startExam({ db, navigate, tur: 'ozel', sorular: [mkQ('a'), mkQ('b', true)], sureDk: 10 }), true);
  const [s] = [...db.store.values()];
  assert.deepEqual(s.soruIdler, ['a']); assert.equal(s.tur, 'ozel'); assert.equal(s.sureMs, 600000);
  assert.deepEqual(navs, ['#/exam/run/' + s.denemeId]);
});

test('yarım deneme var, vazgeç: hiçbir şey değişmez', async () => {
  const db = fakeDb([{ denemeId: 'eski', bittiMi: false }]);
  const p = startExam({ db, navigate, tur: 'ozel', sorular: [mkQ('a')], sureDk: 10 });
  await settle();
  assert.match(document.body.textContent, /Yarım kalan deneme silinip yenisi başlatılsın mı\?/);
  await press('Vazgeç');
  assert.equal(await p, false);
  assert.deepEqual([...db.store.keys()], ['eski']); assert.deepEqual(navs, []);
});

test('yarım deneme var, kabul: eskisi silinir, yenisi kaydedilir', async () => {
  const db = fakeDb([{ denemeId: 'eski', bittiMi: false }, { denemeId: 'bitmis', bittiMi: true }]);
  const p = startExam({ db, navigate, tur: 'ozel', sorular: [mkQ('a')], sureDk: 10 });
  await settle(); await press('Evet');
  assert.equal(await p, true);
  assert.ok(!db.store.has('eski')); assert.ok(db.store.has('bitmis'));
  const yeni = [...db.store.keys()].find(k => k !== 'bitmis');
  assert.deepEqual(navs, ['#/exam/run/' + yeni]);
});

test('kayıt reddedilirse standart toast ve false', async () => {
  const db = fakeDb([], true);
  assert.equal(await startExam({ db, navigate, tur: 'ozel', sorular: [mkQ('a')], sureDk: 10 }), false);
  assert.deepEqual(toasts(), ['Kayıt yapılamadı, yedek almayı deneyin.']); assert.deepEqual(navs, []);
});

test('alive() false ise yönlendirme ve kayıt yapılmaz', async () => {
  const db = fakeDb();
  assert.equal(await startExam({ db, navigate, tur: 'ozel', sorular: [mkQ('a')], sureDk: 10, alive: () => false }), false);
  assert.equal(db.store.size, 0); assert.deepEqual(navs, []);
});
