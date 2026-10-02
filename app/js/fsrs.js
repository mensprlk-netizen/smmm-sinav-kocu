// app/js/fsrs.js — FSRS-4.5, varsayılan parametreler
export const W = [0.4072, 1.1829, 3.1262, 15.4722, 7.2102, 0.5316, 1.0651, 0.0234, 1.616, 0.1544, 1.0824, 1.9813, 0.0953, 0.2975, 2.2042, 0.2407, 2.9466];
const DECAY = -0.5, FACTOR = 19 / 81, DESIRED_R = 0.9, DAY = 86400000;
export const Rating = { AGAIN: 1, HARD: 2, GOOD: 3, EASY: 4 };
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

export function newCard(kartId, tur, kaynakId) {
  return { kartId, tur, kaynakId, state: 'new', stability: 0, difficulty: 0, due: 0, reps: 0, lapses: 0, lastReview: 0 };
}

export function retrievability(card, now) {
  if (card.state === 'new' || !card.lastReview || card.stability <= 0) return 0;
  const t = Math.max(0, (now - card.lastReview) / DAY);
  return Math.pow(1 + FACTOR * t / card.stability, DECAY);
}

const initDifficulty = (g) => clamp(W[4] - Math.exp(W[5] * (g - 1)) + 1, 1, 10);
const nextDifficulty = (d, g) => clamp(W[7] * initDifficulty(4) + (1 - W[7]) * (d - W[6] * (g - 3)), 1, 10);
const recallStability = (d, s, r, g) =>
  s * (Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp(W[10] * (1 - r)) - 1) * (g === 2 ? W[15] : 1) * (g === 4 ? W[16] : 1) + 1);
const forgetStability = (d, s, r) =>
  Math.min(W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp(W[14] * (1 - r)), s);

export function intervalDays(stability, r = DESIRED_R) {
  return Math.max(1, Math.round(stability / FACTOR * (Math.pow(r, 1 / DECAY) - 1)));
}

export function review(card, rating, now, { examDate } = {}) {
  const c = { ...card };
  const r = retrievability(card, now);
  if (card.state === 'new') {
    c.stability = W[rating - 1]; c.difficulty = initDifficulty(rating);
  } else if (rating === Rating.AGAIN) {
    c.stability = forgetStability(card.difficulty, card.stability, r);
    c.difficulty = nextDifficulty(card.difficulty, rating);
    if (card.state === 'review') c.lapses++;
  } else {
    c.stability = recallStability(card.difficulty, card.stability, r, rating);
    c.difficulty = nextDifficulty(card.difficulty, rating);
  }
  c.reps++; c.lastReview = now;
  if (rating === Rating.AGAIN) { c.state = 'learning'; c.due = now + 10 * 60000; }
  else {
    c.state = 'review';
    let due = now + intervalDays(c.stability) * DAY;
    if (examDate && due > examDate - DAY) due = Math.max(now + DAY, examDate - DAY);
    c.due = due;
  }
  return c;
}
