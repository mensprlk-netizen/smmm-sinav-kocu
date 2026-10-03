// app/js/app.js
import { createRouter } from './router.js';
import { toast, closeAllSheets } from './ui.js';
import * as db from './db.js';
import * as data from './data.js';
import { registerSw } from './sw-register.js';

const view = document.getElementById('view');

function navigate(hash) { location.hash = hash; }

async function applySettings() {
  const theme = await db.getSetting('tema', 'system');
  document.documentElement.dataset.theme = theme === 'system' ? '' : theme;
  document.documentElement.dataset.fs = await db.getSetting('yaziBoyutu', 2);
}

const route = createRouter({
  view, ctx: { navigate, db, data }, cleanup: closeAllSheets,
  load: (name) => import(`./screens/${name}.js`),
  onRoute: (name) => document.querySelectorAll('#tabs a').forEach(a => a.classList.toggle('active', a.dataset.tab === name)),
});

async function start() {
  try { await db.open(); } catch { toast('İlerleme kaydedilemiyor, yedek alın.', 5000); }
  await applySettings();
  try { await data.loadIndex(); } catch { toast('Veri yüklenemedi, önbellekten devam ediliyor.'); }
  window.addEventListener('hashchange', () => route(location.hash));
  window.addEventListener('settings-changed', applySettings);
  await route(location.hash);
  registerSw();
}
start();
