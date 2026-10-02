// app/js/db.js
const NAME = 'smmm-koc', VERSION = 1;
const STORES = ['answers', 'cards', 'ink', 'exams', 'settings', 'flags'];
let dbp = null;

export function open(factory = globalThis.indexedDB) {
  if (!factory) return Promise.reject(new Error('IndexedDB yok'));
  dbp = new Promise((resolve, reject) => {
    const req = factory.open(NAME, VERSION);
    req.onupgradeneeded = () => {
      const d = req.result;
      const a = d.createObjectStore('answers', { keyPath: 'id', autoIncrement: true });
      a.createIndex('soruId', 'soruId'); a.createIndex('denemeId', 'denemeId');
      const c = d.createObjectStore('cards', { keyPath: 'kartId' });
      c.createIndex('due', 'due');
      d.createObjectStore('ink', { keyPath: 'hedefId' });
      d.createObjectStore('exams', { keyPath: 'denemeId' });
      d.createObjectStore('settings', { keyPath: 'anahtar' });
      d.createObjectStore('flags', { keyPath: 'soruId' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbp.then(() => undefined);
}

function tx(store, mode, fn) {
  return dbp.then(d => new Promise((resolve, reject) => {
    const t = d.transaction(store, mode);
    const r = fn(t.objectStore(store));
    if (r && 'onsuccess' in r) { r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); }
    else { t.oncomplete = () => resolve(r); t.onerror = () => reject(t.error); }
    t.onabort = () => reject(t.error || new Error('İşlem iptal edildi.'));
  }));
}

export const put = (s, v) => tx(s, 'readwrite', o => o.put(v));
export const get = (s, k) => tx(s, 'readonly', o => o.get(k));
export const getAll = (s) => tx(s, 'readonly', o => o.getAll());
export const del = (s, k) => tx(s, 'readwrite', o => o.delete(k));
export const clear = (s) => tx(s, 'readwrite', o => o.clear());

export async function getSetting(anahtar, varsayilan) {
  if (!dbp) return varsayilan;
  try { const r = await get('settings', anahtar); return r ? r.deger : varsayilan; } catch { return varsayilan; }
}
export const setSetting = (anahtar, deger) => put('settings', { anahtar, deger });

export function addAnswer(a) { return put('answers', { ...a, tarih: Date.now() }); }
export function answersFor(soruId) {
  return tx('answers', 'readonly', o => o.index('soruId').getAll(soruId));
}
export const allAnswers = () => getAll('answers');

export const saveCard = (card) => put('cards', card);
export const getCard = (kartId) => get('cards', kartId);
export const allCards = () => getAll('cards');
export async function dueCards(now) {
  const all = await tx('cards', 'readonly', o => o.index('due').getAll(IDBKeyRange.upperBound(now)));
  return all.filter(c => c.state !== 'new');
}

export async function getInk(hedefId) { const r = await get('ink', hedefId); return r ? r.vuruslar : []; }
export const saveInk = (hedefId, vuruslar) => put('ink', { hedefId, vuruslar, guncelleme: Date.now() });

export const saveExam = (e) => put('exams', e);
export const getExam = (id) => get('exams', id);
export const allExams = () => getAll('exams');

export const setFlag = (soruId, v) => put('flags', { soruId, ...v });
export const getFlag = (soruId) => get('flags', soruId);
export const allFlags = () => getAll('flags');

export async function exportAll() {
  const depolar = {};
  for (const s of STORES) depolar[s] = await getAll(s);
  return { surum: VERSION, tarih: new Date().toISOString(), depolar };
}

function validateBackupElement(store, v) {
  if (v === null || typeof v !== 'object') return false;
  if (store === 'answers') return true;
  if (store === 'cards') return 'kartId' in v;
  if (store === 'ink') return 'hedefId' in v;
  if (store === 'exams') return 'denemeId' in v;
  if (store === 'settings') return 'anahtar' in v;
  if (store === 'flags') return 'soruId' in v;
  return false;
}

export async function importAll(json) {
  if (!json || json.surum !== VERSION || !json.depolar || typeof json.depolar !== 'object' || !STORES.every(s => Array.isArray(json.depolar[s]))) {
    throw new Error('Yedek dosyası tanınmadı.');
  }
  for (const s of STORES) {
    if (!json.depolar[s].every(v => validateBackupElement(s, v))) {
      throw new Error('Yedek dosyası tanınmadı.');
    }
  }
  const d = await dbp;
  await new Promise((resolve, reject) => {
    const t = d.transaction(STORES, 'readwrite');
    try {
      for (const s of STORES) { const o = t.objectStore(s); o.clear(); for (const v of json.depolar[s]) o.put(v); }
      t.oncomplete = resolve; t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error || new Error('İşlem iptal edildi.'));
    } catch (e) {
      t.abort();
      reject(new Error('Yedek dosyası tanınmadı.'));
    }
  });
}

export async function resetAll() { for (const s of STORES) await clear(s); }
