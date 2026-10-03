// app/js/screens/settings.js — ayarlar, yedekleme ve geri yükleme
import { h, toast, confirm, safe, kayitHatasi } from '../ui.js';
import { todayKey } from '../planner.js';

let epoch = 0; // destroy() artırır; bekleyen render hiçbir şey eklemez
export function destroy() { epoch++; }

const changed = () => window.dispatchEvent(new Event('settings-changed'));
const TANINMADI = 'Yedek dosyası tanınmadı.';

// Dosya indirme mekaniği tek yerde: test bu fonksiyonun çağırdıklarını gözleyebilir.
function indir(dosyaAdi, metin) {
  const url = URL.createObjectURL(new Blob([metin], { type: 'application/json' }));
  const a = h('a', { href: url, download: dosyaAdi });
  document.body.append(a);
  try { a.click(); } finally { a.remove(); setTimeout(() => URL.revokeObjectURL(url), 0); }
}

const readText = (f) => new Promise((resolve, reject) => {
  const r = new window.FileReader();
  r.onload = () => resolve(String(r.result));
  r.onerror = () => reject(r.error);
  r.readAsText(f);
});

const gecerliTarih = (s) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
};

const sonYedekMetni = (ts) => ts ? `Son yedek: ${new Date(ts).toLocaleString('tr-TR')}` : 'Henüz yedek alınmadı.';

async function depolamaDurumu() {
  try {
    const p = await navigator.storage?.persisted?.();
    return typeof p === 'boolean' ? p : null;
  } catch { return null; }
}

async function cevrimdisiHazir() {
  try {
    const sw = navigator.serviceWorker;
    if (!sw) return false;
    if (sw.controller) return true;
    const reg = await sw.getRegistration?.();
    return !!reg?.active;
  } catch { return false; }
}

export async function render(view, params, ctx) {
  const ep = epoch;
  const { db, data } = ctx;
  const idx = await data.loadIndex().catch(() => ({}));
  const tema = await db.getSetting('tema', 'system');
  const fs = await db.getSetting('yaziBoyutu', 2);
  const hedef = await db.getSetting('hedefSaat', 1.5);
  let tarih = await db.getSetting('sinavTarihi', '2026-11-28');
  const sonYedek = await db.getSetting('sonYedek', null);
  let kalici = await depolamaDurumu();
  const hazir = await cevrimdisiHazir();
  if (ep !== epoch) return;

  const yeniden = async () => { if (ep === epoch) await render(view, params, ctx); };

  const yaz = safe(async (key, value) => { await db.setSetting(key, value); return true; });

  const sel = (opts, val, key, parse) => {
    let onceki = String(val);
    const el = h('select', {}, ...opts.map(([v, t]) => h('option', { value: v }, t)));
    el.value = String(val);
    el.addEventListener('change', async () => {
      const yeni = el.value;
      if (await yaz(key, parse(yeni))) { onceki = yeni; changed(); } else el.value = onceki;
    });
    return el;
  };

  const tarihIn = h('input', { type: 'date' });
  tarihIn.value = tarih;
  tarihIn.addEventListener('change', async () => {
    const v = tarihIn.value;
    if (!v || !gecerliTarih(v)) { tarihIn.value = tarih; return; }
    if (await yaz('sinavTarihi', v)) { tarih = v; changed(); toast('Sınav tarihi güncellendi.'); } else tarihIn.value = tarih;
  });

  // Yedekle
  const sonYedekEl = h('p', { class: 'muted' }, sonYedekMetni(sonYedek));
  const yedekle = safe(async () => {
    const dump = await db.exportAll();
    indir(`smmm-koc-yedek-${todayKey()}.json`, JSON.stringify(dump));
    const simdi = Date.now();
    await db.setSetting('sonYedek', simdi);
    sonYedekEl.textContent = sonYedekMetni(simdi);
    toast('Yedek indirildi.');
  });

  // Geri yükle
  const fileIn = h('input', { type: 'file', accept: 'application/json', hidden: true });
  fileIn.addEventListener('change', async () => {
    const f = fileIn.files && fileIn.files[0];
    if (!f) return;
    try {
      let json;
      try { json = JSON.parse(await (typeof f.text === "function" ? f.text() : readText(f))); } catch { toast('Yedek dosyası okunamadı.'); return; }
      if (!json || json.surum !== 1 || !json.depolar || typeof json.depolar !== 'object') { toast(TANINMADI); return; }
      if (!await confirm('Mevcut tüm ilerleme bu yedekle değiştirilecek. Devam?')) return;
      try { await db.importAll(json); }
      catch (err) { if (err?.message === TANINMADI) toast(TANINMADI); else kayitHatasi(); return; }
      toast('Yedek geri yüklendi.');
      changed();
      await yeniden();
    } finally { try { fileIn.value = ''; } catch {} }
  });

  const sifirla = safe(async () => {
    if (!await confirm('Tüm ilerleme silinecek. Emin misin?', { ok: 'Sil' })) return;
    await db.resetAll();
    toast('Veriler sıfırlandı.');
    changed();
    await yeniden();
  });

  // Kalıcı depolama
  const kaliciYazi = h('span', {});
  const kaliciKutu = h('div', { class: 'row' });
  const kaliciGoster = () => {
    kaliciKutu.replaceChildren();
    if (kalici === null) { kaliciYazi.textContent = 'Kalıcı depolama: Bu tarayıcıda desteklenmiyor'; return; }
    kaliciYazi.textContent = `Kalıcı depolama: ${kalici ? 'Açık' : 'Kapalı'}`;
    if (!kalici) {
      kaliciKutu.append(h('button', { class: 'btn', onClick: async () => {
        let verildi = false;
        try { verildi = (await navigator.storage.persist()) === true; } catch { verildi = false; }
        if (ep !== epoch) return;
        if (verildi) { kalici = true; kaliciGoster(); toast('Kalıcı depolama açıldı.'); }
        else toast('Tarayıcı kalıcı depolamayı vermedi; düzenli yedek al.');
      } }, 'Kalıcı depolamayı iste'));
    }
  };
  kaliciGoster();

  const kaynaklar = Object.entries(idx.kaynaklar || {});
  view.replaceChildren(h('h1', {}, 'Ayarlar'),
    h('div', { class: 'card' },
      h('label', { class: 'field' }, 'Tema', sel([['system', 'Sistem'], ['light', 'Açık'], ['dark', 'Koyu']], tema, 'tema', String)),
      h('label', { class: 'field' }, 'Yazı boyutu', sel([[1, 'Küçük'], [2, 'Normal'], [3, 'Büyük'], [4, 'Çok büyük']], fs, 'yaziBoyutu', Number)),
      h('label', { class: 'field' }, 'Günlük hedef', sel([[0.5, '30 dakika'], [1, '1 saat'], [1.5, '1,5 saat'], [2, '2 saat'], [3, '3 saat'], [4, '4 saat']], hedef, 'hedefSaat', Number)),
      h('label', { class: 'field' }, 'Sınav tarihi', tarihIn)),
    h('div', { class: 'card' }, h('h3', {}, 'Yedek'),
      h('p', { class: 'muted' }, 'İlerleme, çizimler ve deneme sonuçları bu cihazda saklanır. Düzenli yedek al.'),
      sonYedekEl,
      h('p', { class: 'muted' }, kaliciYazi), kaliciKutu,
      h('p', { class: 'muted', 'data-offline': hazir ? 'hazir' : 'bekliyor' }, hazir ? 'Çevrimdışı kullanıma hazır' : 'Çevrimdışı kurulum bekleniyor'),
      h('div', { class: 'row' },
        h('button', { class: 'btn btn-primary', onClick: yedekle }, 'Yedekle'),
        h('button', { class: 'btn', onClick: () => fileIn.click() }, 'Geri yükle'), fileIn,
        h('button', { class: 'btn', style: 'color:var(--err)', onClick: sifirla }, 'Verileri sıfırla'))),
    h('div', { class: 'card' }, h('h3', {}, 'Hakkında'),
      h('p', { class: 'muted' }, `Veri sürümü: ${idx.surum ?? '—'}`),
      ...kaynaklar.map(([d, k]) => h('p', { class: 'muted' }, `${d}: ${k.aciklama} (${k.indirme})`)),
      h('p', { class: 'muted' }, 'Sorular TÜRMOB-TESMER resmi kitapçıklarından alınmıştır; çözümler bu uygulama için yazılmış ve resmi cevap anahtarıyla doğrulanmıştır.')));
}
