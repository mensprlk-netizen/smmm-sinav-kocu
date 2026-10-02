// app/js/examflow.js — deneme başlatma akışı (ekran değil): tek yarım deneme kuralı
import { toast, confirm, kayitHatasi } from './ui.js';
import * as X from './exam.js';

// `alive` (isteğe bağlı): ekran yok edildiyse false döner; bekleyen adımlardan sonra durur.
export async function startExam({ db, navigate, tur, sorular, sureDk, alive = () => true }) {
  if (!sorular.some(q => !q.iptal)) { toast('Bu seçimle soru bulunamadı.'); return false; }
  let unf;
  try {
    unf = (await db.allExams()).find(e => !e.bittiMi);
    if (unf && !(await confirm('Yarım kalan deneme silinip yenisi başlatılsın mı?'))) return false;
  } catch { kayitHatasi(); return false; }
  const s = X.createExam({ tur, sorular, sureDk, denemeId: 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6) });
  // Önce yeni deneme kaydedilir; ancak başarılıysa eskisi silinir (hata halinde iki deneme de kaybolmaz).
  // Ekran yok edilse bile yazmalar tamamlanır; alive() yalnız yönlendirmeyi engeller (bu durumda false döner).
  try { await db.saveExam(s); } catch { kayitHatasi(); return false; }
  if (unf) { try { await db.del('exams', unf.denemeId); } catch { kayitHatasi(); } }
  if (!alive()) return false;
  navigate('#/exam/run/' + s.denemeId);
  return true;
}
