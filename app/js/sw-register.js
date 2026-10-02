// Service worker kaydı ve güncelleme akışı.
// Yeni sürüm yalnızca kullanıcı "Yenile"ye basınca devreye girer.
export async function registerSw({
  sw = typeof navigator !== 'undefined' ? navigator.serviceWorker : undefined,
  reload = () => location.reload(),
  bar = typeof document !== 'undefined' ? document.getElementById('update-bar') : null,
  button = typeof document !== 'undefined' ? document.getElementById('update-btn') : null,
  url = 'sw.js',
} = {}) {
  if (!sw) return;
  try {
    // Başlangıçta controller yoksa ilk controllerchange clients.claim() kaynaklıdır: yenilenmez.
    // Ondan sonra sayfa kontrollü sayılır; sonraki her değişim (kullanıcı "Yenile"ye bastı) bir kez yeniler.
    let claimed = !!sw.controller;
    let reloading = false;
    sw.addEventListener('controllerchange', () => {
      if (!claimed) { claimed = true; return; }
      if (reloading) return;
      reloading = true;
      reload();
    });
    const offer = (worker) => {
      if (bar) bar.hidden = false;
      if (button) button.onclick = () => worker.postMessage({ type: 'SKIP_WAITING' });
    };
    const reg = await sw.register(url);
    if (reg.waiting && sw.controller) offer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      if (!nw) return;
      nw.addEventListener('statechange', () => {
        if (nw.state === 'installed' && sw.controller) offer(nw);
      });
    });
  } catch { /* kayıt başarısızsa uygulama yine de çalışır */ }
}
