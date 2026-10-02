// app/js/reviewqueue.js
const DAY = 86400000;
export function buildQueue(cards, now, { kota = 40, erken = false } = {}) {
  const limit = erken ? now + 3 * DAY : now;
  return cards.filter(c => c.state !== 'new' && c.due <= limit).sort((a, b) => a.due - b.due).slice(0, kota);
}
