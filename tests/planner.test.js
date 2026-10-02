import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gunlukPlan, sinavaKalanGun, dersIstatistikleri, dailyCounter } from '../app/js/planner.js';

const DAY = 86400000;

test('kalan gün hesabı', () => {
  const exam = Date.UTC(2026, 10, 28, 9);
  assert.equal(sinavaKalanGun(Date.UTC(2026, 9, 2, 12), exam), 57);
  assert.equal(sinavaKalanGun(exam - 1000, exam), 1);
  assert.equal(sinavaKalanGun(exam + 1000, exam), 0);
  assert.equal(sinavaKalanGun(exam + 2 * DAY, exam), -2);
});

test('normal gün: kota ve yeni soru hedefi', () => {
  const p = gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 12, sinavaKalanGun: 40, dersIstatistik: [] });
  assert.equal(p.tekrarKotasi, 12);
  assert.equal(p.yeniSoruHedefi, 20);
  assert.ok(p.mesaj.includes('12 tekrar'));
});

test('kota 40 ile sınırlı, 1 saatte daha az', () => {
  assert.equal(gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 90, sinavaKalanGun: 40, dersIstatistik: [] }).tekrarKotasi, 38);
  assert.equal(gunlukPlan({ hedefSaat: 2, vadesiGelen: 90, sinavaKalanGun: 40, dersIstatistik: [] }).tekrarKotasi, 40);
  assert.equal(gunlukPlan({ hedefSaat: 1, vadesiGelen: 90, sinavaKalanGun: 40, dersIstatistik: [] }).yeniSoruHedefi, 13);
});

test('son 10 gün yeni soru azalır, son 7 gün tam oturum önerisi', () => {
  const p = gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 0, sinavaKalanGun: 5, dersIstatistik: [] });
  assert.equal(p.yeniSoruHedefi, 10);
  assert.ok(p.mesaj.includes('tam oturum'));
});

test('sınav günü ve sonrası çökmez', () => {
  const p0 = gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 30, sinavaKalanGun: 0, dersIstatistik: [] });
  assert.equal(p0.tekrarKotasi, 0); assert.equal(p0.yeniSoruHedefi, 0); assert.ok(p0.mesaj.includes('Sınav günü'));
  const p1 = gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 30, sinavaKalanGun: -3, dersIstatistik: [] });
  assert.equal(p1.tekrarKotasi, 0);
});

test('öneri dersi: en düşük doğruluk, eşitlikte en az görülen; görülmemiş ders önce', () => {
  const st = [{ kod: 'FM', gorulen: 10, toplam: 40, dogruluk: 0.8 }, { kod: 'MAL', gorulen: 5, toplam: 40, dogruluk: 0.5 }, { kod: 'HUK', gorulen: 0, toplam: 40, dogruluk: null }];
  assert.equal(gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 0, sinavaKalanGun: 30, dersIstatistik: st }).oneriDers, 'HUK');
  assert.equal(gunlukPlan({ hedefSaat: 1.5, vadesiGelen: 0, sinavaKalanGun: 30, dersIstatistik: st.slice(0, 2) }).oneriDers, 'MAL');
});

test('günlük sayaç gün değişince sıfırlanır', () => {
  assert.deepEqual(dailyCounter({ tarih: '2026-10-01', sayac: 7 }, '2026-10-02'), { tarih: '2026-10-02', sayac: 0 });
  assert.deepEqual(dailyCounter({ tarih: '2026-10-02', sayac: 7 }, '2026-10-02'), { tarih: '2026-10-02', sayac: 7 });
  assert.deepEqual(dailyCounter(null, '2026-10-02'), { tarih: '2026-10-02', sayac: 0 });
});

test('ders istatistikleri son cevaba göre', () => {
  const qs = [{ id: 'a', ders: 'FM', iptal: false }, { id: 'b', ders: 'FM', iptal: false }, { id: 'c', ders: 'MAL', iptal: false }, { id: 'd', ders: 'MAL', iptal: true }];
  const ans = [{ soruId: 'a', dogruMu: false, tarih: 1 }, { soruId: 'a', dogruMu: true, tarih: 2 }, { soruId: 'b', dogruMu: false, tarih: 1 }];
  const st = dersIstatistikleri(qs, ans);
  assert.deepEqual(st.find(s => s.kod === 'FM'), { kod: 'FM', gorulen: 2, toplam: 2, dogruluk: 0.5 });
  assert.deepEqual(st.find(s => s.kod === 'MAL'), { kod: 'MAL', gorulen: 0, toplam: 1, dogruluk: null });
});
