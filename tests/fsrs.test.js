import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newCard, review, Rating, intervalDays, retrievability } from '../app/js/fsrs.js';

const DAY = 86400000, now = Date.UTC(2026, 9, 2);

test('yeni kart İyi: yaklaşık 3 gün sonra', () => {
  const c = review(newCard('soru:x', 'soru', 'x'), Rating.GOOD, now);
  assert.equal(c.state, 'review');
  assert.equal(c.reps, 1);
  assert.equal(Math.round((c.due - now) / DAY), 3);
});

test('yeni kart Kolay daha uzun, Zor daha kısa', () => {
  const easy = review(newCard('a', 'soru', 'a'), Rating.EASY, now);
  const hard = review(newCard('b', 'soru', 'b'), Rating.HARD, now);
  const good = review(newCard('c', 'soru', 'c'), Rating.GOOD, now);
  assert.ok(easy.due > good.due && good.due > hard.due);
  assert.equal(Math.round((easy.due - now) / DAY), 15);
});

test('Tekrar: 10 dakika sonra, öğrenme durumunda, yeni kartta lapse yok', () => {
  const c = review(newCard('a', 'soru', 'a'), Rating.AGAIN, now);
  assert.equal(c.state, 'learning');
  assert.equal(c.due, now + 10 * 60000);
  assert.equal(c.lapses, 0);
});

test('tekrar durumundaki kartta Tekrar lapse sayar ve stabiliteyi düşürür', () => {
  const c1 = review(newCard('a', 'soru', 'a'), Rating.GOOD, now);
  const c2 = review(c1, Rating.AGAIN, now + 3 * DAY);
  assert.equal(c2.lapses, 1);
  assert.ok(c2.stability < c1.stability);
});

test('ardışık İyi cevaplar aralığı uzatır', () => {
  const c1 = review(newCard('a', 'soru', 'a'), Rating.GOOD, now);
  const c2 = review(c1, Rating.GOOD, c1.due);
  const c3 = review(c2, Rating.GOOD, c2.due);
  assert.ok(c2.due - c1.due > c1.due - now);
  assert.ok(c3.due - c2.due > c2.due - c1.due);
});

test('sınav tarihi aralığı sınırlar', () => {
  const examDate = now + 5 * DAY;
  const c = review(newCard('a', 'soru', 'a'), Rating.EASY, now, { examDate });
  assert.ok(c.due <= examDate - DAY);
  assert.ok(c.due >= now + DAY);
});

test('girdi değişmez ve hatırlama olasılığı zamanla düşer', () => {
  const c0 = newCard('a', 'soru', 'a');
  const c1 = review(c0, Rating.GOOD, now);
  assert.equal(c0.state, 'new');
  assert.ok(retrievability(c1, now + DAY) > retrievability(c1, now + 10 * DAY));
  assert.equal(intervalDays(10), 10);
});
