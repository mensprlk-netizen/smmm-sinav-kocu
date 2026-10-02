import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildQueue } from '../app/js/reviewqueue.js';

const DAY = 86400000, now = 1000 * DAY;
const c = (id, due, state = 'review') => ({ kartId: id, due, state });

test('vadesi gelenler sıralı ve kotalı', () => {
  const q = buildQueue([c('a', now - 1), c('b', now - 5), c('c', now + 1), c('d', 0, 'new')], now, { kota: 1 });
  assert.deepEqual(q.map(x => x.kartId), ['b']);
  assert.equal(buildQueue([c('a', now - 1), c('b', now - 5)], now, { kota: 10 }).length, 2);
});

test('erken tekrar 3 gün ileriyi alır', () => {
  const q = buildQueue([c('a', now + 2 * DAY), c('b', now + 4 * DAY)], now, { kota: 10, erken: true });
  assert.deepEqual(q.map(x => x.kartId), ['a']);
});
