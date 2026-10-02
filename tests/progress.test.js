import 'fake-indexeddb/auto';
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory } from 'fake-indexeddb';
import * as db from '../app/js/db.js';
import * as fsrs from '../app/js/fsrs.js';
import { recordAnswer, addInfoCards, lastAnswerMap, kartIdSoru } from '../app/js/progress.js';

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
