// app/js/screens/home.js
import { h } from '../ui.js';
import { dersAdi } from '../data.js';
import { gunlukPlan, sinavaKalanGun, dersIstatistikleri, dailyCounter, todayKey } from '../planner.js';
import { examDateMs } from '../progress.js';

export async function render(view, params, ctx) {
  const { db, data } = ctx;
  const now = Date.now(), examDate = await examDateMs(db);
  const gun = sinavaKalanGun(now, examDate);
  const questions = await data.loadAllQuestions();
  const answers = await db.allAnswers();
  const cards = await db.allCards();
  const st = dersIstatistikleri(questions, answers);
  const plan = gunlukPlan({ hedefSaat: await db.getSetting('hedefSaat', 1.5), vadesiGelen: cards.filter(c => c.state !== 'new' && c.due <= now).length, sinavaKalanGun: gun, dersIstatistik: st });
  const counter = dailyCounter(await db.getSetting('review:gun', null), todayKey(now));
  const bugunYeni = answers.filter(a => a.mod === 'study' && todayKey(a.tarih) === todayKey(now)).length;
  const saved = await db.getSetting('study:state', null);
  const unfinished = (await db.allExams()).find(e => !e.bittiMi);
  const tarihEtiketi = new Date(examDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

  view.append(
    h('div', { class: 'card', style: 'text-align:center' },
      h('div', { class: 'muted' }, 'SMMM Yeterlilik Sınavı · ' + tarihEtiketi),
      h('div', { style: 'font-size:2.4em;font-weight:700' }, gun > 0 ? `${gun} gün` : gun === 0 ? 'Bugün' : 'Geçti'),
      h('p', {}, plan.mesaj)),
    unfinished ? h('a', { class: 'btn btn-primary btn-block', href: '#/exam/run/' + unfinished.denemeId }, 'Yarım kalan denemeye devam et') : null,
    h('div', { class: 'card' }, h('h3', {}, 'Bugünkü plan'),
      bar('Tekrar', counter.sayac, plan.tekrarKotasi), bar('Yeni soru', bugunYeni, plan.yeniSoruHedefi),
      h('div', { class: 'row', style: 'margin-top:10px' },
        h('a', { class: 'btn', href: '#/review' }, 'Tekrara git'),
        h('a', { class: 'btn btn-primary', href: saved?.ids?.length ? '#/study' : '#/study' }, saved?.ids?.length ? 'Devam et' : 'Çalışmaya başla'),
        plan.oneriDers ? h('span', { class: 'muted' }, 'Öneri: ' + dersAdi(plan.oneriDers)) : null)),
    h('div', { class: 'card' }, h('h3', {}, 'Ders bazında hazırlık'),
      ...st.map(s => { const oran = s.toplam ? (s.gorulen / s.toplam) * (s.dogruluk ?? 0) : 0; return h('div', { style: 'margin-bottom:8px' }, h('div', { class: 'row', style: 'justify-content:space-between' }, h('span', {}, dersAdi(s.kod)), h('span', { class: 'muted' }, `${s.gorulen}/${s.toplam} · ${s.dogruluk === null ? '—' : Math.round(s.dogruluk * 100) + '%'}`)), h('div', { class: 'bar' }, h('span', { style: `width:${Math.round(oran * 100)}%` }))); })));

  function bar(label, val, max) {
    const pct = max ? Math.min(100, Math.round(val / max * 100)) : 0;
    return h('div', { style: 'margin-bottom:8px' }, h('div', { class: 'row', style: 'justify-content:space-between' }, h('span', {}, label), h('span', { class: 'muted' }, `${val} / ${max}`)), h('div', { class: 'bar' }, h('span', { style: `width:${pct}%` })));
  }
}
