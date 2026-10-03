import { test, mock } from 'node:test';
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

// --- Düzeltme turu 1 ---
function ptr(el, type, init) {
  el.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: 10, clientY: 10, pressure: 0.6, pointerType: 'pen', ...init }));
}
function draw(c) { ptr(c, 'pointerdown'); ptr(c, 'pointermove', { clientX: 20, clientY: 20 }); ptr(c, 'pointerup', { clientX: 20, clientY: 20 }); }
function withTimers(fn) {
  return async () => {
    mock.timers.enable({ apis: ['setTimeout'] });
    try { await fn(); } finally { mock.timers.reset(); }
  };
}
function closeSheets() { document.querySelectorAll('.sheet .sheet-head button').forEach(b => b.click()); }
function role(v, r) { return v.el.querySelector(`[data-role="${r}"]`); }
const tagChips = v => v.el.querySelectorAll('[data-tag]').length;

test('çözüm yoksa mesaj gösterilir, kart düğmesi yok, orijinal var', () => {
  const v = createQuestionView({ question: q, mode: 'study', index: 0, total: 1, onAnswer: () => {} });
  opt(v, 'A').click();
  assert.ok(v.el.querySelector('.solution').textContent.includes('Bu soru için çözüm henüz eklenmedi.'));
  assert.equal(role(v, 'cards'), null);
  assert.ok(role(v, 'original'));
});

test('yanlış seçimle yeniden açılış: kilitli, renkli, çözüm ve etiketler var, onAnswer çağrılmaz', () => {
  let n = 0;
  const v = createQuestionView({ question: q, solution: sol, mode: 'review', index: 0, total: 1, selected: 'B', onTag: () => {}, onAnswer: () => { n++; } });
  assert.ok(opt(v, 'B').classList.contains('wrong'));
  assert.ok(opt(v, 'C').classList.contains('correct'));
  assert.ok(opt(v, 'A').hasAttribute('disabled'));
  assert.ok(v.el.querySelector('.solution'));
  assert.equal(tagChips(v), 4);
  assert.equal(n, 0);
});

test('doğru seçimle yeniden açılış: etiket yok', () => {
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, selected: 'C', onAnswer: () => {} });
  assert.ok(opt(v, 'C').classList.contains('correct'));
  assert.equal(tagChips(v), 0);
});

test('doğru cevaptan sonra hata etiketi yok', () => {
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: () => {} });
  opt(v, 'C').click();
  assert.equal(tagChips(v), 0);
});

test('reveal() seçimsiz: kilitler, doğruyu işaretler, yanlış ve etiket yok', () => {
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: () => {} });
  v.reveal();
  assert.ok(opt(v, 'A').hasAttribute('disabled'));
  assert.ok(opt(v, 'C').classList.contains('correct'));
  assert.equal(v.el.querySelectorAll('.opt.wrong').length, 0);
  assert.equal(tagChips(v), 0);
  assert.ok(v.el.querySelector('.solution'));
});

test('deneme modunda setSelected(null) seçimi temizler', () => {
  const v = createQuestionView({ question: q, mode: 'exam', index: 0, total: 1, onAnswer: () => {} });
  v.setSelected('B');
  assert.ok(opt(v, 'B').classList.contains('selected'));
  v.setSelected(null);
  assert.equal(v.el.querySelectorAll('.opt.selected').length, 0);
});

test('bayrak düğmesi simge değiştirir ve onFlag çağırır', () => {
  const calls = [];
  const v = createQuestionView({ question: q, mode: 'exam', index: 0, total: 1, onAnswer: () => {}, onFlag: b => calls.push(b) });
  assert.equal(role(v, 'flag').textContent, '⚐');
  role(v, 'flag').click();
  assert.equal(role(v, 'flag').textContent, '⚑');
  role(v, 'flag').click();
  assert.equal(role(v, 'flag').textContent, '⚐');
  assert.deepEqual(calls, [true, false]);
});

test('iptal soruda şık tıklaması onAnswer çağırmaz', () => {
  let n = 0;
  const v = createQuestionView({ question: { ...q, iptal: true }, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: () => { n++; } });
  opt(v, 'A').click();
  assert.equal(n, 0);
  assert.equal(v.el.querySelectorAll('.opt.wrong').length, 0);
});

test('onAnswer hata fırlatsa da çözüm görünür', () => {
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: () => { throw new Error('x'); } });
  const errors = [];
  const onErr = (e) => { errors.push(e.message); e.preventDefault(); };
  window.addEventListener('error', onErr);
  try { opt(v, 'A').click(); } finally { window.removeEventListener('error', onErr); }
  assert.equal(errors.length, 1);
  assert.ok(v.el.querySelector('.solution'));
});

test('emin değilim düğmesi cevaptan sonra devre dışı kalır ve değişmez', () => {
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: () => {} });
  opt(v, 'C').click();
  const b = role(v, 'emin');
  assert.ok(b.hasAttribute('disabled'));
  b.click();
  assert.ok(!b.classList.contains('on'));
  const v2 = createQuestionView({ question: q, solution: sol, mode: 'review', index: 0, total: 1, selected: 'A', onAnswer: () => {} });
  assert.ok(role(v2, 'emin').hasAttribute('disabled'));
});

test('kartları ekle tekrar basılınca bir kez çağrılır', () => {
  let n = 0;
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: () => {}, onCards: () => { n++; } });
  opt(v, 'A').click();
  role(v, 'cards').click(); role(v, 'cards').click();
  assert.equal(n, 1);
  assert.equal(role(v, 'cards').textContent, 'Kartlar eklendi');
  assert.ok(role(v, 'cards').hasAttribute('disabled'));
});

test('orijinali göster doğru görüntüyü açar', () => {
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: () => {} });
  opt(v, 'A').click();
  role(v, 'original').click();
  const img = document.querySelector('.sheet img');
  assert.ok(img);
  assert.ok(img.getAttribute('src').endsWith('img/originals/2026-1-MAL-p1.png'));
  closeSheets();
});

test('çözüm alanı iki kez açılınca tek ink örneği yeniden kullanılır, vuruşlar korunur', withTimers(() => {
  const got = [];
  const v = createQuestionView({ question: q, mode: 'exam', index: 0, total: 1, onAnswer: () => {}, onInk: s => got.push(s) });
  role(v, 'ink').click();
  const wrap1 = document.querySelector('.sheet .ink-wrap');
  draw(wrap1.querySelector('canvas'));
  closeSheets();
  assert.equal(document.querySelectorAll('.ink-wrap').length, 0);
  role(v, 'ink').click();
  const wrap2 = document.querySelector('.sheet .ink-wrap');
  assert.equal(wrap2, wrap1);
  assert.equal(document.querySelectorAll('.ink-wrap').length, 1);
  draw(wrap2.querySelector('canvas'));
  mock.timers.tick(300);
  assert.equal(got.length, 1);
  assert.equal(got[0].length, 2);
  closeSheets();
  v.destroy();
}));

test('destroy() açık ink alanlarındaki bekleyen değişikliği iletir', withTimers(() => {
  const ink = [], fey = [];
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: () => {}, onInk: s => ink.push(s), onFeynman: s => fey.push(s) });
  role(v, 'ink').click();
  draw(document.querySelector('.sheet .ink-wrap canvas'));
  closeSheets();
  opt(v, 'A').click();
  role(v, 'feynman').click();
  draw(document.querySelector('.sheet .ink-wrap canvas'));
  closeSheets();
  assert.equal(ink.length, 0);
  assert.equal(fey.length, 0);
  v.destroy();
  assert.equal(ink.length, 1);
  assert.equal(ink[0].length, 1);
  assert.equal(fey.length, 1);
  assert.equal(fey[0].length, 1);
}));

test('tuzak metinleri HTML olarak işlenir', () => {
  const s = { ...sol, tuzaklar: { A: 'Yalnız <em>net</em> tutar' } };
  const v = createQuestionView({ question: q, solution: s, mode: 'study', index: 0, total: 1, onAnswer: () => {} });
  opt(v, 'A').click();
  const li = v.el.querySelector('.solution ul li');
  assert.ok(li.querySelector('em'));
  assert.equal(li.textContent, 'A) Yalnız net tutar');
});

test('Boş geç yalnız çalışma modunda; kilitler, çözümü açar, null cevap bildirir', () => {
  const events = [];
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: e => events.push(e) });
  const b = v.el.querySelector('[data-role="bos"]');
  assert.equal(b.textContent, 'Boş geç');
  b.click();
  assert.deepEqual(events, [{ cevap: null, dogruMu: false, emin: false }]);
  assert.ok(v.el.querySelector('.solution'));
  assert.ok(opt(v, 'A').hasAttribute('disabled'));
  assert.ok(opt(v, 'C').classList.contains('correct'));
  assert.equal(v.el.querySelectorAll('.opt.wrong').length, 0);
  b.click(); assert.equal(events.length, 1);
  for (const mode of ['exam', 'review']) assert.equal(createQuestionView({ question: q, solution: sol, mode, index: 0, total: 1, onAnswer: () => {} }).el.querySelector('[data-role="bos"]'), null);
});

test('iptal soruda "İlk anahtar: X (iptal)" yazar', () => {
  const v = createQuestionView({ question: { ...q, iptal: true }, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: () => {} });
  assert.ok(v.el.textContent.includes('İlk anahtar: C (iptal)'));
  assert.ok(!v.el.textContent.includes('Doğru cevap'));
});

test('tekrar modunda Feynman çözümden önce erişilir (tek düğme)', () => {
  const v = createQuestionView({ question: q, solution: sol, mode: 'review', index: 0, total: 1, onAnswer: () => {}, onFeynman: () => {} });
  assert.equal(v.el.querySelector('.solution'), null);
  assert.equal(v.el.querySelectorAll('[data-role="feynman"]').length, 1);
  opt(v, 'A').click();
  assert.equal(v.el.querySelectorAll('[data-role="feynman"]').length, 1);
});

test('kontroller yalnız geri çağrısı varsa çizilir', () => {
  const v = createQuestionView({ question: q, solution: sol, mode: 'study', index: 0, total: 1, onAnswer: () => {} });
  opt(v, 'A').click();
  for (const r of ['flag', 'ink', 'cards', 'feynman']) assert.equal(v.el.querySelector(`[data-role="${r}"]`), null, r);
  assert.equal(v.el.querySelector('[data-tag]'), null);
});
