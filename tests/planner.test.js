process.env.TZ = 'Europe/Istanbul';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gunlukPlan, sinavaKalanGun, dersIstatistikleri, dailyCounter, todayKey } from '../app/js/planner.js';

const DAY = 86400000;

test('kalan gün hesabı (yerel takvim günü)', () => {
  const exam = new Date(2026, 10, 28, 9, 0).getTime();
  const L = (...a) => new Date(...a).getTime();
  assert.equal(sinavaKalanGun(L(2026, 9, 2, 12, 0), exam), 57);
  assert.equal(sinavaKalanGun(L(2026, 10, 28, 0, 5), exam), 0);
  assert.equal(sinavaKalanGun(L(2026, 10, 28, 8, 0), exam), 0);
  assert.equal(sinavaKalanGun(L(2026, 10, 28, 23, 55), exam), 0);
  assert.equal(sinavaKalanGun(L(2026, 10, 27, 23, 0), exam), 1);
  assert.equal(sinavaKalanGun(L(2026, 10, 29, 0, 30), exam), -1);
  assert.equal(sinavaKalanGun(L(2026, 10, 30, 15, 0), exam), -2);
  assert.equal(sinavaKalanGun(L(2026, 10, 21, 9, 0), exam), 7);
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

test('todayKey yerel takvim gününü kullanır', () => {
  assert.equal(todayKey(new Date(2026, 9, 3, 1, 30).getTime()), '2026-10-03');
  assert.equal(todayKey(new Date(2026, 9, 3, 23, 59).getTime()), '2026-10-03');
  assert.equal(todayKey(new Date(2026, 0, 5, 0, 0).getTime()), '2026-01-05');
});

test('günlük kota bugünkü yapılan tekrarı düşer, vadesi gelen kartı aşmaz', () => {
  const k = (o) => gunlukPlan({ hedefSaat: 1.5, sinavaKalanGun: 40, dersIstatistik: [], ...o }).tekrarKotasi;
  assert.equal(k({ vadesiGelen: 10, bugunYapilan: 5 }), 10); // kalan hak 33, vadesi gelen 10
  assert.equal(k({ vadesiGelen: 5, bugunYapilan: 5 }), 5);
  assert.equal(k({ vadesiGelen: 40, bugunYapilan: 5 }), 33);
  assert.equal(k({ vadesiGelen: 100, bugunYapilan: 30 }), 8);
  assert.equal(k({ vadesiGelen: 100, bugunYapilan: 38 }), 0);
  assert.equal(k({ vadesiGelen: 100, bugunYapilan: 50 }), 0);
  assert.equal(k({ hedefSaat: 2, vadesiGelen: 100, bugunYapilan: 10 }), 30);
  assert.equal(k({ vadesiGelen: 12, bugunYapilan: 0 }), 12);
  assert.equal(k({ vadesiGelen: 12, bugunYapilan: 3, sinavaKalanGun: 0 }), 0);
});

// --- Seri ve hafta özeti (ana ekran takvim yaprağı) ---
const { aktifGunler, seriHesapla, haftaOzeti } = await import('../app/js/planner.js');
const L2 = (...a) => new Date(...a).getTime();

test('aktifGunler: cevap tarihleri ve bugünkü tekrar sayacı gün kümesine girer', () => {
  const s = aktifGunler([{ tarih: L2(2026, 9, 1, 23, 30) }, { tarih: L2(2026, 9, 2, 0, 45) }], { tarih: '2026-10-03', sayac: 2 });
  assert.deepEqual([...s].sort(), ['2026-10-01', '2026-10-02', '2026-10-03']);
  assert.equal(aktifGunler([], { tarih: '2026-10-03', sayac: 0 }).size, 0);
  assert.equal(aktifGunler([], null).size, 0);
});

test('seriHesapla: bugün dahil ardışık günler; bugün boşsa dünden sayar; boşluk seriyi keser', () => {
  const now = L2(2026, 9, 5, 12, 0); // Pazartesi 5 Ekim 2026
  assert.equal(seriHesapla(new Set(['2026-10-05', '2026-10-04', '2026-10-03']), now), 3);
  assert.equal(seriHesapla(new Set(['2026-10-04', '2026-10-03']), now), 2);
  assert.equal(seriHesapla(new Set(['2026-10-05', '2026-10-03']), now), 1);
  assert.equal(seriHesapla(new Set(['2026-10-03']), now), 0);
  assert.equal(seriHesapla(new Set(), now), 0);
});

test('haftaOzeti: Pazartesi başlar, bugün işaretli, dolu günler kümeden', () => {
  const h = haftaOzeti(new Set(['2026-10-05', '2026-10-07']), L2(2026, 9, 7, 9, 0)); // Çarşamba
  assert.deepEqual(h.map(g => g.gun), ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']);
  assert.deepEqual(h.map(g => g.tarih), ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09', '2026-10-10', '2026-10-11']);
  assert.deepEqual(h.map(g => g.dolu), [true, false, true, false, false, false, false]);
  assert.deepEqual(h.map(g => g.bugun), [false, false, true, false, false, false, false]);
  const p = haftaOzeti(new Set(), L2(2026, 9, 11, 9, 0)); // Pazar: hafta yine Pazartesi'den başlar
  assert.equal(p[0].tarih, '2026-10-05');
  assert.equal(p[6].bugun, true);
});
