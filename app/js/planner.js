// app/js/planner.js
import { DERSLER } from './data.js';
import { lastAnswerMap } from './progress.js';
const DAY = 86400000;

export function sinavaKalanGun(now, examDate) {
  const n = new Date(now), e = new Date(examDate);
  const a = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  const b = new Date(e.getFullYear(), e.getMonth(), e.getDate());
  return Math.round((b - a) / DAY) || 0;
}

export function dailyCounter(prev, today) {
  return prev && prev.tarih === today ? { ...prev } : { tarih: today, sayac: 0 };
}
export const todayKey = (now = Date.now()) => {
  const d = new Date(now);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export function gunlukPlan({ hedefSaat = 1.5, vadesiGelen = 0, sinavaKalanGun: gun = 60, dersIstatistik = [], bugunYapilan = 0 }) {
  const sorted = [...dersIstatistik].sort((a, b) => {
    const da = a.dogruluk ?? -1, db_ = b.dogruluk ?? -1;
    return da - db_ || a.gorulen - b.gorulen;
  });
  const oneriDers = sorted[0]?.kod ?? null;
  if (gun <= 0) return { tekrarKotasi: 0, yeniSoruHedefi: 0, oneriDers, mesaj: gun === 0 ? 'Sınav günü. Başarılar!' : 'Sınav tarihi geçti; Ayarlar’dan yeni tarih gir.' };
  const gunlukTavan = Math.min(40, Math.round(hedefSaat * 25));
  const tekrarKotasi = Math.min(Math.max(0, gunlukTavan - bugunYapilan), vadesiGelen);
  const taban = gun <= 10 ? 10 : 20;
  const yeniSoruHedefi = Math.max(5, Math.round(taban * hedefSaat / 1.5));
  let mesaj;
  if (gun <= 7) mesaj = `Sınava ${gun} gün kaldı: bugün tam oturum denemesi yap, yanlışlarını tekrar et.`;
  else if (vadesiGelen > tekrarKotasi) mesaj = `Tekrar kuyruğu birikti (${vadesiGelen}); bugün ${tekrarKotasi} tekrar, sonra ${yeniSoruHedefi} yeni soru.`;
  else mesaj = `Bugün: ${tekrarKotasi} tekrar, ${yeniSoruHedefi} yeni soru.`;
  return { tekrarKotasi, yeniSoruHedefi, oneriDers, mesaj };
}

export function dersIstatistikleri(questions, answers) {
  const last = lastAnswerMap(answers);
  return DERSLER.filter(d => questions.some(q => q.ders === d.kod)).map(d => {
    const qs = questions.filter(q => q.ders === d.kod && !q.iptal);
    const seen = qs.filter(q => last.has(q.id));
    const dogru = seen.filter(q => last.get(q.id).dogruMu).length;
    return { kod: d.kod, gorulen: seen.length, toplam: qs.length, dogruluk: seen.length ? dogru / seen.length : null };
  });
}

// --- Çalışma serisi (ana ekran takvim yaprağı) ---
const GUN_ADI = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const gunBasi = (ms) => { const d = new Date(ms); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
const gunEkle = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

// Çalışılan günler: cevap satırlarının günleri + bugünkü tekrar sayacının günü (bilgi kartları cevap satırı yazmaz).
export function aktifGunler(answers, reviewGun) {
  const s = new Set((answers || []).map(a => todayKey(a.tarih)));
  if (reviewGun?.sayac > 0 && reviewGun.tarih) s.add(reviewGun.tarih);
  return s;
}

// Bugünden geriye (bugün boşsa dünden) ardışık çalışılan gün sayısı.
export function seriHesapla(gunler, now = Date.now()) {
  let d = gunBasi(now);
  if (!gunler.has(todayKey(d.getTime()))) d = gunEkle(d, -1);
  let n = 0;
  while (gunler.has(todayKey(d.getTime()))) { n++; d = gunEkle(d, -1); }
  return n;
}

// Pazartesi'den başlayan içinde bulunulan hafta: { gun, tarih, dolu, bugun }.
export function haftaOzeti(gunler, now = Date.now()) {
  const bugun = gunBasi(now);
  const pzt = gunEkle(bugun, -((bugun.getDay() + 6) % 7));
  return GUN_ADI.map((gun, i) => {
    const tarih = todayKey(gunEkle(pzt, i).getTime());
    return { gun, tarih, dolu: gunler.has(tarih), bugun: tarih === todayKey(bugun.getTime()) };
  });
}
