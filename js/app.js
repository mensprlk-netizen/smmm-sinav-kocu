// app/js/app.js
import { parseRoute } from './router.js';
import { toast } from './ui.js';
import * as db from './db.js';
import * as data from './data.js';
import { registerSw } from './sw-register.js';

const view = document.getElementById('view');
let current = null;

function navigate(hash) { location.hash = hash; }

async function applySettings() {
  const theme = await db.getSetting('tema', 'system');
  document.documentElement.dataset.theme = theme === 'system' ? '' : theme;
  document.documentElement.dataset.fs = await db.getSetting('yaziBoyutu', 2);
}

async function route() {
  const { name, params } = parseRoute(location.hash);
  document.querySelectorAll('#tabs a').forEach(a => a.classList.toggle('active', a.dataset.tab === name));
  if (current?.destroy) { try { current.destroy(); } catch {} }
  view.innerHTML = '';
  const mod = await import(`./screens/${name}.js`);
  current = mod;
  try {
    await mod.render(view, params, { navigate, db, data });
  } catch (e) {
    console.error(e);
    view.innerHTML = '<p class="card">Ekran yüklenemedi.</p>';
  }
  window.scrollTo(0, 0);
}

async function start() {
  try { await db.open(); } catch { toast('İlerleme kaydedilemiyor, yedek alın.', 5000); }
  await applySettings();
  try { await data.loadIndex(); } catch { toast('Veri yüklenemedi, önbellekten devam ediliyor.'); }
  window.addEventListener('hashchange', route);
  window.addEventListener('settings-changed', applySettings);
  await route();
  registerSw();
}
start();
