// app/js/exam.js — deneme oturumu ve resmi puanlama (saf)
const r2 = (x) => Math.round(x * 100) / 100;

export function dersPuani({ dogru, yanlis, gecerli }) {
  if (!gecerli) return 0;
  return Math.max(0, r2((dogru - yanlis * 0.25) * (100 / gecerli)));
}

export function pickQuestions(pool, { mod = 'resmi', adet = 20, rng = Math.random } = {}) {
  const valid = pool.filter(q => !q.iptal);
  if (mod === 'resmi') return valid;
  const a = [...valid];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, adet);
}

export function createExam({ tur, sorular: girdi, sureDk, now = Date.now(), denemeId = String(now) }) {
  const sorular = girdi.filter(q => !q.iptal);
  const dersler = [...new Set(sorular.map(q => q.ders))];
  return { denemeId, tur, dersler, soruIdler: sorular.map(q => q.id), dersOf: Object.fromEntries(sorular.map(q => [q.id, q.ders])),
    cevaplar: {}, bayraklar: {}, baslangic: now, sureMs: sureDk * 60000, bitis: null, bittiMi: false, sonuc: null };
}

export function answer(session, soruId, cevap) {
  const cevaplar = { ...session.cevaplar };
  if (cevap === null || cevap === undefined) delete cevaplar[soruId]; else cevaplar[soruId] = cevap;
  return { ...session, cevaplar };
}

export function toggleFlag(session, soruId) {
  return { ...session, bayraklar: { ...session.bayraklar, [soruId]: !session.bayraklar[soruId] } };
}

export function remainingMs(session, now = Date.now()) {
  return Math.max(0, session.baslangic + session.sureMs - now);
}

export function finish(session, questionsById, now = Date.now()) {
  const dersler = {};
  for (const kod of session.dersler) dersler[kod] = { dogru: 0, yanlis: 0, bos: 0, gecerli: 0 };
  for (const id of session.soruIdler) {
    const q = questionsById[id]; const d = dersler[session.dersOf[id]];
    if (!q || !d) continue;
    d.gecerli++;
    const c = session.cevaplar[id];
    if (!c) d.bos++; else if (c === q.dogru) d.dogru++; else d.yanlis++;
  }
  let toplam = 0, toplamDogru = 0, toplamYanlis = 0, toplamBos = 0;
  for (const d of Object.values(dersler)) {
    d.puan = dersPuani(d); d.gecti = d.puan >= 50;
    toplam += d.puan; toplamDogru += d.dogru; toplamYanlis += d.yanlis; toplamBos += d.bos;
  }
  const n = Object.keys(dersler).length;
  const ortalama = n ? r2(toplam / n) : 0;
  return { ...session, bittiMi: true, bitis: now, sonuc: { dersler, ortalama, ortalamaGecti: ortalama >= 60, toplamDogru, toplamYanlis, toplamBos } };
}
