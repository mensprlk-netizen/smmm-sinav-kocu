// app/js/data.js
export const DERSLER = [
  { kod: 'FM', ad: 'Finansal Muhasebe', oturum: 1 },
  { kod: 'MAL', ad: 'Maliyet Muhasebesi', oturum: 1 },
  { kod: 'HUK', ad: 'Hukuk', oturum: 1 },
  { kod: 'SPK', ad: 'Sermaye Piyasası Mevzuatı', oturum: 1 },
  { kod: 'FTA', ad: 'Finansal Tablolar ve Analizi', oturum: 2 },
  { kod: 'DEN', ad: 'Muhasebe Denetimi', oturum: 2 },
  { kod: 'VER', ad: 'Vergi Mevzuatı ve Uygulaması', oturum: 2 },
  { kod: 'MH', ad: 'Meslek Hukuku', oturum: 2 },
];
export const DONEMLER = ['2026-1', '2026-2'];
export const dersAdi = (kod) => DERSLER.find(d => d.kod === kod)?.ad ?? kod;

let fetchFn = (url) => fetch(url);
export function setFetch(fn) { fetchFn = fn; }
let index = null;
const qCache = new Map(), sCache = new Map(), tCache = new Map();
export function reset() { index = null; qCache.clear(); sCache.clear(); tCache.clear(); }

async function getJson(path, fallback) {
  try { const r = await fetchFn('./' + path); if (!r.ok) return fallback; return await r.json(); } catch { return fallback; }
}

export async function loadIndex() {
  if (!index) index = await getJson('data/index.json', null);
  if (!index) throw new Error('index.json yüklenemedi');
  return index;
}

export async function loadQuestions(donem, ders) {
  const key = `${donem}-${ders}`;
  if (!qCache.has(key)) qCache.set(key, await getJson(`data/questions/${key}.json`, []));
  return qCache.get(key);
}
async function loadSolutions(donem, ders) {
  const key = `${donem}-${ders}`;
  if (!sCache.has(key)) sCache.set(key, await getJson(`data/solutions/${key}.json`, []));
  return sCache.get(key);
}

export async function loadAllQuestions() {
  const idx = await loadIndex(); const out = [];
  for (const d of idx.donemler) for (const k of idx.dersler) out.push(...await loadQuestions(d, k));
  return out;
}

function splitId(id) { const m = /^(\d{4}-\d)-([A-Z]+)-(\d{2})$/.exec(id); return m ? { donem: m[1], ders: m[2], no: +m[3] } : null; }

export async function getQuestion(id) {
  const p = splitId(id); if (!p) return undefined;
  return (await loadQuestions(p.donem, p.ders)).find(q => q.id === id);
}
export async function getSolution(id) {
  const p = splitId(id); if (!p) return undefined;
  return (await loadSolutions(p.donem, p.ders)).find(s => s.id === id);
}

export async function filterQuestions({ dersler, donemler, iptalHaric = true } = {}) {
  const idx = await loadIndex();
  const ds = dersler?.length ? dersler : idx.dersler, dn = donemler?.length ? donemler : idx.donemler;
  const out = [];
  for (const d of dn) for (const k of ds) out.push(...await loadQuestions(d, k));
  return iptalHaric ? out.filter(q => !q.iptal) : out;
}

export async function loadTopics() {
  const idx = await loadIndex(); const out = [];
  for (const kod of idx.konular ?? []) {
    if (!tCache.has(kod)) tCache.set(kod, await getJson(`data/topics/maliyet/${kod}.json`, null));
    if (tCache.get(kod)) out.push(tCache.get(kod));
  }
  return out.sort((a, b) => a.sira - b.sira);
}
export async function getTopic(kod) { return (await loadTopics()).find(t => t.kod === kod); }
