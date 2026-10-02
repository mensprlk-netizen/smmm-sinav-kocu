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
