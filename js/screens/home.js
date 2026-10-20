// app/js/screens/home.js — takvim yaprağı (sınava kalan gün, hafta, seri), bugünkü defter, dersler
import { h } from '../ui.js';
import { dersAdi } from '../data.js';
import { gunlukPlan, sinavaKalanGun, dersIstatistikleri, dailyCounter, todayKey, aktifGunler, seriHesapla, haftaOzeti } from '../planner.js';
import { examDateMs } from '../progress.js';

const tarihUzun = (ms) => new Date(ms).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
const gunAdi = (ms) => new Date(ms).toLocaleDateString('tr-TR', { weekday: 'long' });

function seriSatiri(seri, bugunCalisildi) {
  if (seri === 0) return h('p', { class: 'leaf-seri', 'data-role': 'seri' }, 'Henüz seri yok. Bugün başla.');
  const n = h('strong', {}, `${seri} gün`);
  return h('p', { class: 'leaf-seri', 'data-role': 'seri' }, bugunCalisildi ? [n, ' üst üste çalıştın.'] : ['Seri ', n, '; bugün sürdür.']);
}

// Defter satırı: etiket ···· değer, altında dolum çubuğu.
function cubukSatiri(label, val, max) {
  const pct = max ? Math.min(100, Math.round(val / max * 100)) : 0;
  return h('div', { class: 'satir satir-cubuk', 'data-row': label },
    h('span', {}, label),
    h('span', { class: 'deger', 'data-val': '' }, `${val} / ${max}`),
    h('div', { class: 'bar' }, h('span', { style: `width:${pct}%` })));
}

export async function render(view, params, ctx) {
  const { db, data } = ctx;
  const now = Date.now(), examDate = await examDateMs(db);
  const gun = sinavaKalanGun(now, examDate);
  const questions = await data.loadAllQuestions();
  const answers = await db.allAnswers();
  const cards = await db.allCards();
  const st = dersIstatistikleri(questions, answers);
  const reviewGun = await db.getSetting('review:gun', null);
  const counter = dailyCounter(reviewGun, todayKey(now));
  const plan = gunlukPlan({ hedefSaat: await db.getSetting('hedefSaat', 1.5), vadesiGelen: cards.filter(c => c.state !== 'new' && c.due <= now).length, sinavaKalanGun: gun, dersIstatistik: st, bugunYapilan: counter.sayac });
  const bugunYeni = new Set(answers.filter(a => a.mod === 'study' && todayKey(a.tarih) === todayKey(now)).map(a => a.soruId)).size;
  const saved = await db.getSetting('study:state', null);
  const unfinished = (await db.allExams()).find(e => !e.bittiMi);
  const gunler = aktifGunler(answers, reviewGun);
  const seri = seriHesapla(gunler, now), hafta = haftaOzeti(gunler, now);

  const leaf = h('section', { class: 'leaf', 'aria-label': 'Sınava kalan gün' },
    h('p', { class: 'leaf-ust' }, 'SMMM Yeterlilik Sınavı'),
    h('p', { class: 'leaf-tarih', 'data-role': 'sinav-tarihi' }, `${tarihUzun(examDate)}, ${gunAdi(examDate)}`),
    gun > 0
      ? [h('div', { class: 'leaf-gun', 'data-role': 'gun' }, String(gun)), h('p', { class: 'leaf-etiket' }, 'gün kaldı')]
      : h('div', { class: 'leaf-gun kelime', 'data-role': 'gun' }, gun === 0 ? 'Bugün' : 'Geçti'),
    h('p', { class: 'leaf-soz' }, plan.mesaj),
    h('div', { class: 'leaf-hafta', role: 'list', 'aria-label': 'Bu hafta' },
      ...hafta.map(g => h('span', { class: 'g' + (g.dolu ? ' dolu' : '') + (g.bugun ? ' bugun' : ''), role: 'listitem', 'aria-label': g.gun + (g.dolu ? ', çalışıldı' : '') }, h('i'), g.gun))),
    seriSatiri(seri, gunler.has(todayKey(now))));

  const defter = h('section', { class: 'defter', 'aria-label': 'Bugünkü defter' },
    h('div', { class: 'defter-baslik' }, h('span', {}, 'Bugünkü defter'), h('span', { class: 'muted' }, `${new Date(now).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}, ${gunAdi(now)}`)),
    cubukSatiri('Tekrar', counter.sayac, counter.sayac + plan.tekrarKotasi),
    cubukSatiri('Yeni soru', bugunYeni, plan.yeniSoruHedefi),
    h('div', { class: 'defter-eylem' },
      h('a', { class: 'btn', href: '#/review' }, 'Tekrara git'),
      h('a', { class: 'btn btn-primary', href: '#/study' }, saved?.ids?.length ? 'Devam et' : 'Çalışmaya başla')));

  const dersler = h('section', { class: 'defter', 'aria-label': 'Dersler' },
    h('div', { class: 'defter-baslik' }, h('span', {}, 'Dersler'), h('span', { class: 'muted' }, 'görülen / toplam, doğruluk')),
    ...st.map(s => {
      const oran = s.toplam ? (s.gorulen / s.toplam) * (s.dogruluk ?? 0) : 0;
      return h('div', { class: 'satir satir-cubuk', 'data-row': dersAdi(s.kod) },
        h('span', {}, dersAdi(s.kod), s.kod === plan.oneriDers ? h('span', { class: 'badge oneri' }, 'Öneri') : null),
        h('span', { class: 'deger' }, h('span', { class: 'alt', 'data-gorulen': '' }, `${s.gorulen}/${s.toplam}`), h('span', { 'data-oran': '' }, s.dogruluk === null ? '—' : Math.round(s.dogruluk * 100) + '%')),
        h('div', { class: 'bar' }, h('span', { style: `width:${Math.round(oran * 100)}%` })));
    }));

  view.append(...[
    leaf,
    unfinished ? h('a', { class: 'btn btn-primary btn-block devam', href: '#/exam/run/' + unfinished.denemeId }, 'Yarım kalan denemeye devam et') : null,
    defter,
    dersler,
  ].filter(Boolean));
}
