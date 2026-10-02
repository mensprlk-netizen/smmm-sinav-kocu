// app/js/screens/stats.js — istatistik ekranı ve hata defteri
import { h, fmtSure, fmtPuan } from '../ui.js';
import { DERSLER, dersAdi } from '../data.js';
import { konuIstatistikleri, hataDagilimi, zayifKonular, hataDefteri, dersOrtSure } from '../statistics.js';
import { dersIstatistikleri } from '../planner.js';
import { startExam } from '../examflow.js';

const ETIKET = { bilgi: 'Bilgi eksiği', dikkat: 'Dikkatsizlik', sure: 'Süre', okuma: 'Yanlış okudum', etiketsiz: 'Etiketsiz' };
const LIMIT_SATIR = 100, LIMIT_SORU = 40;

let epoch = 0; // destroy() artırır; eski render'ın bekleyen işi hiçbir şey eklemez
export function destroy() { epoch++; }

const yuzde = (d) => d === null || d === undefined ? '—' : Math.round(d * 100) + '%';
const sure = (ms) => ms > 0 ? fmtSure(ms) : '—';
const satir = (sol, sag, extra = {}) => h(extra.href ? 'a' : 'div', { class: 'stat-row', ...(extra.href ? { href: extra.href, style: 'text-decoration:none;color:inherit' } : {}) }, h('span', {}, sol), h(extra.strong ? 'strong' : 'span', extra.strong ? {} : (extra.muted ? { class: 'muted' } : {}), sag));
const bos = (metin) => h('p', { class: 'muted' }, metin);

export async function render(view, params, ctx) {
  const { db, data } = ctx;
  const ep = epoch;
  const questions = await data.loadAllQuestions();
  const answers = await db.allAnswers();
  const allExams = await db.allExams();
  const topics = await data.loadTopics();
  if (ep !== epoch) return;

  const exams = allExams.filter(e => e.bittiMi).sort((a, b) => b.bitis - a.bitis);
  const ders = dersIstatistikleri(questions, answers);
  const dersSure = dersOrtSure(questions, answers);
  const konu = konuIstatistikleri(questions, answers);
  const hata = hataDagilimi(answers);
  const konuAdi = (kod) => topics.find(t => t.kod === kod)?.baslik ?? kod;

  const konuKart = [];
  for (const d of DERSLER) {
    const rows = konu.filter(k => k.ders === d.kod && k.gorulen > 0).sort((a, b) => a.dogruluk - b.dogruluk);
    if (!rows.length) continue;
    konuKart.push(h('h4', {}, d.ad), ...rows.map(k => satir(konuAdi(k.konu), `${k.gorulen} · ${yuzde(k.dogruluk)} · ${sure(k.ortSureMs)}`)));
  }
  const zayif = zayifKonular(konu);
  const hataToplam = Object.values(hata).reduce((a, b) => a + b, 0);

  const filt = { ders: '', etiket: '' };
  let list = [];
  let starting = false;
  const defterList = h('div');
  const kurBtn = h('button', { class: 'btn btn-primary', style: 'margin-top:8px', onClick: async () => {
    if (starting) return;
    starting = true;
    try {
      const qs = list.map(x => x.question).filter(q => !q.iptal).slice(0, LIMIT_SORU);
      await startExam({ db, navigate: ctx.navigate, tur: 'ozel', sorular: qs, sureDk: Math.max(10, Math.round(qs.length * 2.25)), alive: () => ep === epoch });
    } finally { starting = false; }
  } }, 'Bu listeden deneme kur');
  function renderDefter() {
    list = hataDefteri(questions, answers, filt);
    defterList.innerHTML = '';
    if (!list.length) defterList.append(bos('Kayıt yok.'));
    for (const { question: q, answer: a } of list.slice(0, LIMIT_SATIR)) {
      defterList.append(satir(`${dersAdi(q.ders)} ${q.donem} · Soru ${q.no}`, `${a.cevap} ✗ · ${ETIKET[a.hataEtiketi] ?? '—'}`, { href: '#/study/q/' + q.id, muted: true }));
    }
    kurBtn.disabled = !list.length;
  }
  renderDefter();

  view.append(h('h1', {}, 'İstatistik'),
    h('div', { class: 'card' }, h('h3', {}, 'Ders bazında'),
      ders.length ? ders.map(d => satir(dersAdi(d.kod), `${d.gorulen}/${d.toplam} · ${yuzde(d.dogruluk)} · ${sure(dersSure[d.kod])}`)) : bos('Kayıt yok.')),
    h('div', { class: 'card' }, h('h3', {}, 'Konu bazında'),
      konuKart.length ? konuKart : bos('Henüz çözülen soru yok.')),
    h('div', { class: 'card' }, h('h3', {}, 'Zayıf konular'),
      zayif.length ? zayif.map(k => satir(`${dersAdi(k.ders)} · ${konuAdi(k.konu)}`, `${yuzde(k.dogruluk)} · ${sure(k.ortSureMs)}`)) : bos('Bir konuda en az 3 soru çözünce burada görünür.')),
    h('div', { class: 'card' }, h('h3', {}, 'Hata türleri'),
      hataToplam ? Object.entries(hata).map(([k, v]) => satir(ETIKET[k], String(v))) : bos('Kayıt yok.')),
    h('div', { class: 'card' }, h('h3', {}, 'Deneme geçmişi'),
      exams.length ? exams.slice(0, 20).map(e => satir(`${new Date(e.bitis).toLocaleDateString('tr-TR')} · ${(e.dersler ?? []).map(dersAdi).join(', ')}`, fmtPuan(e.sonuc?.ortalama ?? 0), { href: '#/exam/result/' + e.denemeId, strong: true })) : bos('Henüz deneme yok.')),
    h('div', { class: 'card' }, h('h3', {}, 'Hata defteri'),
      h('div', { class: 'row' },
        h('select', { 'aria-label': 'Ders', onChange: (e) => { filt.ders = e.target.value; renderDefter(); } }, h('option', { value: '' }, 'Tüm dersler'), ...DERSLER.map(d => h('option', { value: d.kod }, d.ad))),
        h('select', { 'aria-label': 'Hata türü', onChange: (e) => { filt.etiket = e.target.value; renderDefter(); } }, h('option', { value: '' }, 'Tüm etiketler'), ...Object.entries(ETIKET).filter(([k]) => k !== 'etiketsiz').map(([k, v]) => h('option', { value: k }, v)))),
      defterList, kurBtn));
}
