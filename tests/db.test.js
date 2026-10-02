import 'fake-indexeddb/auto';
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import * as db from '../app/js/db.js';

beforeEach(async () => { await db.open(new IDBFactory()); });

test('ayar yaz/oku ve varsayılan', async () => {
  assert.equal(await db.getSetting('tema', 'system'), 'system');
  await db.setSetting('tema', 'dark');
  assert.equal(await db.getSetting('tema', 'system'), 'dark');
});

test('cevap ekleme tarih atar ve soruya göre listelenir', async () => {
  const id = await db.addAnswer({ soruId: '2026-1-MAL-01', cevap: 'C', dogruMu: true, emin: true, sure: 42000, mod: 'study' });
  assert.ok(id >= 1);
  const list = await db.answersFor('2026-1-MAL-01');
  assert.equal(list.length, 1);
  assert.ok(list[0].tarih > 0);
});

test('vadesi gelen kartlar', async () => {
  const now = Date.now();
  await db.saveCard({ kartId: 'soru:a', tur: 'soru', kaynakId: 'a', state: 'review', due: now - 1000, stability: 1, difficulty: 5, reps: 1, lapses: 0, lastReview: now - 86400000 });
  await db.saveCard({ kartId: 'soru:b', tur: 'soru', kaynakId: 'b', state: 'review', due: now + 1000, stability: 1, difficulty: 5, reps: 1, lapses: 0, lastReview: now - 86400000 });
  await db.saveCard({ kartId: 'soru:c', tur: 'soru', kaynakId: 'c', state: 'new', due: 0, stability: 0, difficulty: 0, reps: 0, lapses: 0, lastReview: 0 });
  const due = await db.dueCards(now);
  assert.deepEqual(due.map(c => c.kartId), ['soru:a']);
});

test('ink kaydet/oku', async () => {
  assert.deepEqual(await db.getInk('x'), []);
  await db.saveInk('x', [{ p: [[1, 2, 0.5]], renk: '#000', kalinlik: 2, silgi: false }]);
  assert.equal((await db.getInk('x')).length, 1);
});

test('yedek dışa/içe aktarma döngüsü', async () => {
  await db.setSetting('tema', 'dark');
  await db.addAnswer({ soruId: 'q', cevap: 'A', dogruMu: false, emin: false, sure: 1, mod: 'study' });
  const dump = await db.exportAll();
  assert.equal(dump.surum, 1);
  await db.open(new IDBFactory());
  assert.equal(await db.getSetting('tema', 'system'), 'system');
  await db.importAll(dump);
  assert.equal(await db.getSetting('tema', 'system'), 'dark');
  assert.equal((await db.allAnswers()).length, 1);
});

test('geçersiz yedek reddedilir ve veri korunur', async () => {
  await db.setSetting('tema', 'dark');
  await assert.rejects(() => db.importAll({ foo: 1 }), /Yedek dosyası tanınmadı/);
  await assert.rejects(() => db.importAll({ surum: 99, depolar: {} }), /Yedek dosyası tanınmadı/);
  assert.equal(await db.getSetting('tema', 'system'), 'dark');
});

test('resetAll her şeyi siler', async () => {
  await db.setSetting('tema', 'dark');
  await db.resetAll();
  assert.equal(await db.getSetting('tema', 'system'), 'system');
});
