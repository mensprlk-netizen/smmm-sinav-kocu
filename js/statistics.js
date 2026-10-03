// app/js/statistics.js — istatistik ve hata defteri (saf)
import { lastAnswerMap } from './progress.js';

// Ortalama süre hesabında tek satırın üst sınırı (10 dk): açık unutulan telefon ortalamayı bozmasın. Kayıtlı satırlar değişmez.
export const SURE_UST_MS = 600000;

export function konuIstatistikleri(questions, answers) {
  const last = lastAnswerMap(answers);
  const bySoru = new Map();
  for (const a of answers) { if (!bySoru.has(a.soruId)) bySoru.set(a.soruId, []); bySoru.get(a.soruId).push(a); }
  const groups = new Map();
  for (const q of questions) {
    if (q.iptal) continue;
    const konu = q.konu || 'diger';
    const key = q.ders + '/' + konu; // aynı etiket farklı derslerde ayrı grup
    if (!groups.has(key)) groups.set(key, { konu, ders: q.ders, gorulen: 0, dogru: 0, sureler: [] });
    const g = groups.get(key);
    if (last.has(q.id)) { g.gorulen++; if (last.get(q.id).dogruMu) g.dogru++; }
    for (const a of bySoru.get(q.id) || []) if (a.sure > 0) g.sureler.push(Math.min(a.sure, SURE_UST_MS));
  }
  return [...groups.values()].map(({ sureler, ...g }) => ({ ...g, dogruluk: g.gorulen ? g.dogru / g.gorulen : null, ortSureMs: sureler.length ? Math.round(sureler.reduce((a, b) => a + b, 0) / sureler.length) : 0 }));
}

// Ders başına ortalama süre (ms): iptal olmayan soruların sure > 0 olan tüm cevap satırlarının ortalaması.
// Süre satırı olmayan dersler sonuçta YOK (anahtar yok); ekran bunu "—" gösterir.
export function dersOrtSure(questions, answers) {
  const dersOf = new Map();
  for (const q of questions) if (!q.iptal) dersOf.set(q.id, q.ders);
  const acc = {};
  for (const a of answers) {
    const ders = dersOf.get(a.soruId);
    if (!ders || !(a.sure > 0)) continue;
    (acc[ders] ??= { t: 0, n: 0 }); acc[ders].t += Math.min(a.sure, SURE_UST_MS); acc[ders].n++;
  }
  return Object.fromEntries(Object.entries(acc).map(([k, v]) => [k, Math.round(v.t / v.n)]));
}

export function hataDagilimi(answers) {
  const d = { bilgi: 0, dikkat: 0, sure: 0, okuma: 0, etiketsiz: 0 };
  // Yalnızca çalışma satırları (deneme/tekrar satırları etiketlenemez, "Etiketsiz"i şişirir); açıkça etiketlenmiş her satır sayılır.
  for (const a of answers) if (!a.dogruMu && (a.mod === 'study' || a.hataEtiketi)) { if (a.hataEtiketi && a.hataEtiketi in d) d[a.hataEtiketi]++; else d.etiketsiz++; }
  return d;
}

export function zayifKonular(konuStats, n = 5) {
  return konuStats.filter(k => k.gorulen >= 3 && k.dogruluk !== null).sort((a, b) => a.dogruluk - b.dogruluk).slice(0, n);
}

export function hataDefteri(questions, answers, { ders, etiket } = {}) {
  const last = lastAnswerMap(answers);
  const out = [];
  for (const q of questions) {
    const a = last.get(q.id);
    if (!a || a.dogruMu) continue;
    if (ders && q.ders !== ders) continue;
    if (etiket === 'etiketsiz' ? a.hataEtiketi : (etiket && a.hataEtiketi !== etiket)) continue;
    out.push({ question: q, answer: a });
  }
  return out.sort((x, y) => y.answer.tarih - x.answer.tarih);
}
