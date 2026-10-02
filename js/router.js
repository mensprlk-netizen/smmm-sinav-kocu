// app/js/router.js
const SCREENS = ['home', 'study', 'exam', 'review', 'topics', 'stats', 'settings'];

export function parseRoute(hash) {
  const parts = (hash || '').replace(/^#\/?/, '').split('/').filter(Boolean);
  const name = parts[0];
  if (!SCREENS.includes(name)) return { name: 'home', params: {} };
  const params = {};
  if (name === 'study' && parts[1] === 'q' && parts[2]) params.id = parts[2];
  if (name === 'exam' && parts[1]) { params.stage = parts[1]; if (parts[2]) params.id = parts[2]; }
  if (name === 'topics' && parts[1]) params.kod = parts[1];
  return { name, params };
}
