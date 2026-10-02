// app/js/examflow.js — deneme başlatma akışı (ekran değil): tek yarım deneme kuralı
import { toast, confirm, kayitHatasi } from './ui.js';
import * as X from './exam.js';

// `alive` (isteğe bağlı): ekran yok edildiyse false döner; bekleyen adımlardan sonra durur.
export async function startExam({ db, navigate, tur, sorular, sureDk, alive = () => true }) {
  if (!sorular.some(q => !q.iptal)) { toast('Bu seçimle soru bulunamadı.'); return false; }
  try {
    const unf = (await db.allExams()).find(e => !e.bittiMi);
    if (unf) {
      if (!(await confirm('Yarım kalan deneme silinip yenisi başlatılsın mı?'))) return false;
      if (!alive()) return false;
      await db.del('exams', unf.denemeId);
    }
    if (!alive()) return false;
    const s = X.createExam({ tur, sorular, sureDk, denemeId: 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6) });
    await db.saveExam(s);
    if (!alive()) return false;
    navigate('#/exam/run/' + s.denemeId);
    return true;
  } catch { kayitHatasi(); return false; }
}
