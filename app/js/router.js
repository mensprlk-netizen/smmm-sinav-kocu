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

// Route runner. A token guards against overlapping navigations: after every await a newer route aborts the older one.
export function createRouter({ view, load, ctx, cleanup = () => {}, onRoute = () => {} }) {
  let current = null, token = 0;
  return async function route(hash) {
    const my = ++token;
    const { name, params } = parseRoute(hash);
    onRoute(name);
    if (current?.destroy) { try { current.destroy(); } catch {} }
    current = null;
    cleanup();
    view.innerHTML = '';
    try {
      const mod = await load(name);
      if (my !== token) return;
      current = mod;
      await mod.render(view, params, ctx);
    } catch (e) {
      if (my !== token) return;
      console.error(e);
      view.innerHTML = '<p class="card">Ekran yüklenemedi.</p>';
    }
    if (my === token) globalThis.scrollTo?.(0, 0);
  };
}
