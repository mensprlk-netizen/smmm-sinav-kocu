// app/js/progress.js
export const kartIdSoru = (soruId) => 'soru:' + soruId;
export const kartIdBilgi = (kaynakId, i) => `bilgi:${kaynakId}:${i}`;

export async function recordAnswer({ db, fsrs, question, cevap, dogruMu, emin, sure, mod, denemeId, now = Date.now(), examDate }) {
  await db.addAnswer({ soruId: question.id, cevap, dogruMu, emin, sure, mod, denemeId: denemeId ?? null });
  if (question.iptal) return null;
  const id = kartIdSoru(question.id);
  const card = (await db.getCard(id)) || fsrs.newCard(id, 'soru', question.id);
  const rating = dogruMu && emin ? fsrs.Rating.GOOD : fsrs.Rating.AGAIN;
  const next = fsrs.review(card, rating, now, { examDate });
  await db.saveCard(next);
  return next;
}

export async function addInfoCards({ db, fsrs, kaynakId, kartlar, now = Date.now(), examDate }) {
  let n = 0;
  for (let i = 0; i < kartlar.length; i++) {
    const id = kartIdBilgi(kaynakId, i);
    if (await db.getCard(id)) continue;
    const card = fsrs.review(fsrs.newCard(id, 'bilgi', kaynakId), fsrs.Rating.GOOD, now, { examDate });
    card.on = kartlar[i].on; card.arka = kartlar[i].arka;
    await db.saveCard(card); n++;
  }
  return n;
}

export function lastAnswerMap(answers) {
  const m = new Map();
  for (const a of answers) { const p = m.get(a.soruId); if (!p || a.tarih > p.tarih) m.set(a.soruId, a); }
  return m;
}

export async function examDateMs(db) {
  const s = await db.getSetting('sinavTarihi', '2026-11-28');
  return new Date(s + 'T09:00:00').getTime();
}

// Puts a question on the review queue (rating AGAIN) without writing an answer row.
export async function scheduleForReview({ db, fsrs, question, now = Date.now(), examDate }) {
  if (question.iptal) return null;
  const id = kartIdSoru(question.id);
  const card = (await db.getCard(id)) || fsrs.newCard(id, 'soru', question.id);
  const next = fsrs.review(card, fsrs.Rating.AGAIN, now, { examDate });
  await db.saveCard(next);
  return next;
}

// Tags the newest answer row of a question with a mistake reason: rows of one exam (denemeId) or, outside exams, rows of one mode (mod).
export async function tagLastAnswer(db, soruId, etiket, denemeId, mod) {
  const list = (await db.answersFor(soruId)).filter(a => denemeId !== undefined ? a.denemeId === denemeId : (a.denemeId === undefined && (mod === undefined || a.mod === mod)));
  const a = list.sort((x, y) => y.tarih - x.tarih)[0];
  if (a) { a.hataEtiketi = etiket; await db.put('answers', a); }
}
