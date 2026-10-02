import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './dom.js';
setupDom();
const { createQuestionView } = await import('../app/js/screens/question-view.js');

const q = { id: '2026-1-MAL-01', donem: '2026-1', ders: 'MAL', no: 1, konu: '01-maliyet-kavramlari', ortakBilgi: null,
  metin: '<p>Soru?</p>', secenekler: { A: '<p>a</p>', B: '<p>b</p>', C: '<p>c</p>', D: '<p>d</p>', E: '<p>e</p>' },
  dogru: 'C', iptal: false, cevapNotu: null, orijinal: { sayfa: 1, kutu: [0, 0, 10, 10] } };
const sol = { id: q.id, sonuc: 'C', ozet: 'Özet.', adimlar: ['<p>Adım 1</p>'], dayanak: 'D', tuzaklar: { A: 'ta', B: 'tb' }, kartlar: [{ on: 'x', arka: 'y' }], konuBaglantisi: q.konu };

function opt(view, letter) { return view.el.querySelector(`button.opt[data-letter="${letter}"]`); }

test('çalışma modunda seçim sonrası kilitlenir, renklenir, çözüm açılır', () => {
  const events = [];
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: e => events.push(e) });
  opt(v, 'A').click();
  assert.deepEqual(events, [{ cevap: 'A', dogruMu: false, emin: true }]);
  assert.ok(opt(v, 'A').classList.contains('wrong'));
  assert.ok(opt(v, 'C').classList.contains('correct'));
  assert.ok(opt(v, 'B').hasAttribute('disabled'));
  assert.ok(v.el.querySelector('.solution'));
  assert.ok(v.el.textContent.includes('Adım 1'));
  opt(v, 'B').click();
  assert.equal(events.length, 1);
});

test('emin değilim anahtarı cevaba yansır', () => {
  const events = [];
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: e => events.push(e) });
  v.el.querySelector('[data-role="emin"]').click();
  opt(v, 'C').click();
  assert.deepEqual(events, [{ cevap: 'C', dogruMu: true, emin: false }]);
});

test('deneme modunda seçim değiştirilebilir, çözüm görünmez', () => {
  const events = [];
  const v = createQuestionView({ question: q, mode: 'exam', index: 0, total: 20, onAnswer: e => events.push(e) });
  opt(v, 'A').click(); opt(v, 'B').click();
  assert.equal(events.length, 2);
  assert.ok(opt(v, 'B').classList.contains('selected'));
  assert.ok(!opt(v, 'A').classList.contains('selected'));
  assert.equal(v.el.querySelector('.solution'), null);
  assert.equal(v.el.querySelector('.opt.correct'), null);
});

test('iptal soru kilitli ve rozetli', () => {
  const v = createQuestionView({ question: { ...q, iptal: true, cevapNotu: 'İPTAL' }, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: () => {} });
  assert.ok(v.el.textContent.includes('İPTAL'));
  assert.ok(opt(v, 'A').hasAttribute('disabled'));
});

test('hata etiketi ve kart ekleme geri çağrıları', () => {
  let tag = null, cards = null;
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: () => {}, onTag: t => { tag = t; }, onCards: c => { cards = c; } });
  opt(v, 'A').click();
  v.el.querySelector('[data-tag="dikkat"]').click();
  v.el.querySelector('[data-role="cards"]').click();
  assert.equal(tag, 'dikkat');
  assert.equal(cards.length, 1);
});
