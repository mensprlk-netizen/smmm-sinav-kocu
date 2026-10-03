import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from './dom.js';
setupDom();
const { renderVisual, bepHesapla } = await import('../app/js/visuals.js');

test('başabaş hesabı', () => {
  assert.deepEqual(bepHesapla({ fiyat: 50, bdm: 30, sabit: 10000 }), { birim: 500, tutar: 25000 });
  assert.equal(bepHesapla({ fiyat: 30, bdm: 30, sabit: 10000 }), null);
});

test('flow düğüm ve ok çizer', () => {
  const el = renderVisual({ tip: 'flow', veri: { w: 300, h: 100, dugumler: [{ id: 'a', etiket: '150 İlk Madde', x: 10, y: 10 }, { id: 'b', etiket: '710 DİMM', x: 160, y: 10 }], oklar: [{ from: 'a', to: 'b', etiket: 'tüketim' }] } });
  assert.equal(el.querySelectorAll('svg rect').length, 2);
  assert.equal(el.querySelectorAll('svg line').length, 1);
  assert.ok(el.textContent.includes('tüketim'));
});

test('cvp etkileşimli: kaydırıcı değişince metin güncellenir', () => {
  const el = renderVisual({ tip: 'cvp-interactive', veri: { fiyat: 50, bdm: 30, sabit: 10000, maxMiktar: 1000 } });
  assert.ok(el.textContent.includes('500 birim'));
  const sabit = el.querySelector('input[data-key="sabit"]');
  sabit.value = '20000'; sabit.dispatchEvent(new Event('input', { bubbles: true }));
  assert.ok(el.textContent.includes('1.000 birim'));
});

test('allocation-table adım adım vurgular', () => {
  const el = renderVisual({ tip: 'allocation-table', veri: { basliklar: ['', 'A', 'B'], satirlar: [['GÜG', '100', '200']], adimlar: [{ hucreler: [[0, 1]], aciklama: 'A payı' }, { hucreler: [[0, 2]], aciklama: 'B payı' }] } });
  const btn = el.querySelector('button');
  btn.click();
  assert.ok(el.querySelector('td.vurgu').textContent.includes('100'));
  assert.ok(el.textContent.includes('A payı'));
  btn.click();
  assert.ok(el.querySelector('td.vurgu').textContent.includes('200'));
});

test('variance-tree iç içe kutular', () => {
  const el = renderVisual({ tip: 'variance-tree', veri: { etiket: 'Toplam DİMM sapması', deger: '−500 (A)', cocuklar: [{ etiket: 'Fiyat', deger: '−800 (A)' }, { etiket: 'Miktar', deger: '+300 (O)' }] } });
  assert.equal(el.querySelectorAll('.vt-node').length, 3);
  assert.ok(el.querySelector('.vt-node.olumlu'));
});

test('bilinmeyen tip boş değil, çökmez', () => {
  assert.ok(renderVisual({ tip: 'yok', veri: {} }).textContent.length > 0);
});

test('iki flow şeması farklı ok işareti kimliği kullanır', () => {
  const veri = { w: 300, h: 100, dugumler: [{ id: 'a', etiket: 'A', x: 10, y: 10 }, { id: 'b', etiket: 'B', x: 160, y: 10 }], oklar: [{ from: 'a', to: 'b' }] };
  const ids = [renderVisual({ tip: 'flow', veri }), renderVisual({ tip: 'flow', veri })].map(el => el.querySelector('marker').id);
  assert.notEqual(ids[0], ids[1]);
  for (const el of [renderVisual({ tip: 'flow', veri })]) assert.ok(el.querySelector('line').getAttribute('marker-end').includes(el.querySelector('marker').id));
});

test('flow etiketleri okunur boyutta, uzun etiket kutuya sıkıştırılır', () => {
  const el = renderVisual({ tip: 'flow', veri: { w: 300, h: 100, dugumler: [{ id: 'a', etiket: '150 İlk Madde ve Malzeme Stokları', x: 10, y: 10, w: 120 }, { id: 'b', etiket: '710', x: 160, y: 10 }], oklar: [] } });
  const [uzun, kisa] = el.querySelectorAll('text');
  assert.equal(uzun.getAttribute('font-size'), '14');
  assert.equal(uzun.getAttribute('textLength'), '112');
  assert.equal(kisa.getAttribute('textLength'), null);
});

test('allocation-table bozuk adımda çökmez', () => {
  const el = renderVisual({ tip: 'allocation-table', veri: { basliklar: ['', 'A'], satirlar: [['x', '1']], adimlar: [{}, { hucreler: [[9, 9]], aciklama: 'yok' }] } });
  const btn = el.querySelector('button');
  btn.click(); btn.click();
  assert.ok(el.textContent.includes('2/2: yok'));
});

test('cvp: fiyat ≤ bdm metni ve geçersiz veri geri dönüşü', () => {
  const el = renderVisual({ tip: 'cvp-interactive', veri: { fiyat: 30, bdm: 30, sabit: 10000 } });
  assert.ok(el.textContent.includes('başabaş noktası yok'));
  assert.ok(renderVisual({ tip: 'cvp-interactive', veri: { fiyat: 'x' } }).textContent.includes('Görsel gösterilemiyor.'));
});
