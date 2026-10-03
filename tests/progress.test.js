import 'fake-indexeddb/auto';
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import * as db from '../app/js/db.js';
import * as fsrs from '../app/js/fsrs.js';
import { recordAnswer, scheduleForReview, addInfoCards, lastAnswerMap, kartIdSoru } from '../app/js/progress.js';

const q = { id: '2026-1-MAL-01', dogru: 'C', iptal: false };
const now = Date.UTC(2026, 9, 2);
beforeEach(async () => { await db.open(new IDBFactory()); });

test('yanlış cevap kartı Tekrar ile oluşturur', async () => {
  const card = await recordAnswer({ db, fsrs, question: q, cevap: 'A', dogruMu: false, emin: true, sure: 5000, mod: 'study', now });
  assert.equal(card.kartId, kartIdSoru(q.id));
  assert.equal(card.state, 'learning');
  assert.equal((await db.answersFor(q.id)).length, 1);
});

test('doğru ve emin cevap kartı İyi ile oluşturur; emin değilse Tekrar', async () => {
  const c1 = await recordAnswer({ db, fsrs, question: q, cevap: 'C', dogruMu: true, emin: true, sure: 1, mod: 'study', now });
  assert.equal(c1.state, 'review');
  const c2 = await recordAnswer({ db, fsrs, question: { ...q, id: 'x' }, cevap: 'C', dogruMu: true, emin: false, sure: 1, mod: 'study', now });
  assert.equal(c2.state, 'learning');
});

test('iptal soruda kart oluşmaz ama cevap yazılır', async () => {
  const c = await recordAnswer({ db, fsrs, question: { ...q, iptal: true }, cevap: 'A', dogruMu: false, emin: true, sure: 1, mod: 'study', now });
  assert.equal(c, null);
  assert.equal((await db.allAnswers()).length, 1);
});

test('bilgi kartları bir kez eklenir', async () => {
  const kartlar = [{ on: 'a', arka: 'b' }, { on: 'c', arka: 'd' }];
  assert.equal(await addInfoCards({ db, fsrs, kaynakId: q.id, kartlar, now }), 2);
  assert.equal(await addInfoCards({ db, fsrs, kaynakId: q.id, kartlar, now }), 0);
  assert.equal((await db.allCards()).length, 2);
});

test('son cevap haritası', () => {
  const m = lastAnswerMap([{ soruId: 'a', dogruMu: false, tarih: 1 }, { soruId: 'a', dogruMu: true, tarih: 2 }, { soruId: 'b', dogruMu: false, tarih: 1 }]);
  assert.equal(m.get('a').dogruMu, true);
  assert.equal(m.get('b').dogruMu, false);
});

test('scheduleForReview: yeni learning kartı oluşturur, cevap satırı yazmaz', async () => {
  const card = await scheduleForReview({ db, fsrs, question: q, now });
  assert.equal(card.kartId, kartIdSoru(q.id));
  assert.equal(card.state, 'learning');
  assert.equal((await db.allCards()).length, 1);
  assert.equal((await db.allAnswers()).length, 0);
});

test('scheduleForReview: var olan kartı günceller, ikinci kart oluşturmaz', async () => {
  const c1 = await scheduleForReview({ db, fsrs, question: q, now });
  const c2 = await scheduleForReview({ db, fsrs, question: q, now: now + 3600000 });
  assert.equal((await db.allCards()).length, 1);
  assert.equal(c2.reps, c1.reps + 1);
  assert.equal((await db.allAnswers()).length, 0);
});

test('scheduleForReview: iptal soruda null döner, kart ve cevap yazılmaz', async () => {
  const c = await scheduleForReview({ db, fsrs, question: { ...q, iptal: true }, now });
  assert.equal(c, null);
  assert.equal((await db.allCards()).length, 0);
  assert.equal((await db.allAnswers()).length, 0);
});

test('cevap null (boş geç): satır cevap null, kart Tekrar', async () => {
  const card = await recordAnswer({ db, fsrs, question: q, cevap: null, dogruMu: false, emin: false, sure: 1, mod: 'study', now });
  assert.equal(card.state, 'learning');
  const [a] = await db.answersFor(q.id);
  assert.equal(a.cevap, null); assert.equal(a.dogruMu, false);
});

test('tagLastAnswer: deneme satırı denemeId ile, diğerleri mod ile seçilir', async () => {
  const { tagLastAnswer } = await import('../app/js/progress.js');
  await db.addAnswer({ soruId: 'q1', cevap: 'A', dogruMu: false, emin: true, sure: 0, mod: 'study', tarih: 1 });
  await db.addAnswer({ soruId: 'q1', cevap: 'B', dogruMu: false, emin: true, sure: 0, mod: 'exam', denemeId: 'd1', tarih: 2 });
  await db.addAnswer({ soruId: 'q1', cevap: 'C', dogruMu: false, emin: true, sure: 0, mod: 'review', tarih: 3 });
  await tagLastAnswer(db, 'q1', 'dikkat', undefined, 'study');
  await tagLastAnswer(db, 'q1', 'bilgi', 'd1');
  const rows = (await db.answersFor('q1')).sort((a, b) => a.tarih - b.tarih);
  assert.deepEqual(rows.map(r => r.hataEtiketi), ['dikkat', 'bilgi', undefined]);
});
