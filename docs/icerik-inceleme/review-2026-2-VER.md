# İnceleme notları: 2026-2 Vergi Mevzuatı ve Uygulaması (2026-2-VER)

Kaynak: `tools/pdfs/2026_2_vergi-mevzuati.pdf` (TÜRMOB SMMM 2026-2, A kitapçığı, 5 sayfa; soru sayfaları no. 11–14, 5. sayfa cevap anahtarı), sayfa görüntüleri `app/img/originals/2026-2-VER-p1..p5.png`. Resmi cevap hem kırmızı basılmış şıktan hem de 5. sayfadaki “Vergi Mevzuatı ve Uyg. Cevap Anahtarı” tablosundan okundu.

Yöntem: Her soru görüntüden yeniden yazıldı. HTML’den arındırılmış metin ile ham metin (`tools/out/raw/2026-2-VER.json`), 20 kök ve 100 şıkta (boşluk ve madde işaretleri hariç) betikle karşılaştırıldı: fark yok. Yani ham çıkarım karakter düzeyinde doğruydu; yapılan değişiklikler yalnız yapısaldır (aşağıda). Her soru önce bağımsız çözüldü, sonra kırmızı şık ve anahtar tablosuyla karşılaştırıldı. 20 sorunun hepsinde bağımsız çözüm = kırmızı şık = anahtar tablosu = ham `dogru`. İptal yok (anahtar tablosunda İPTAL kaydı yok); ham `iptal` hepsinde `false`.

Hukuki kontrol: Kurallar mevzuat.gov.tr’nin güncel (konsolide) kanun metinlerinden madde madde doğrulandı. GVK, KVK, KDVK, VUK, AATUHK, ÖTVK ve MTVK için 2026-1-VER uygulayıcısının indirdiği metinler (`scratchpad/c-2026-1-VER/laws/`) kullanıldı; başlıkları mevzuat.gov.tr düzenini (Kanun Numarası, Kabul Tarihi, Resmî Gazete, Düstur) gösteriyor ve 2026 değişikliklerini (ör. 7566, 7577, 7582, 7587 sayılı Kanunlar) içeriyor. Eksik olan Emlak Vergisi Kanunu (1319) ve 2576 sayılı Kanun mevzuat.gov.tr’den (`MevzuatMetin/1.5.1319.pdf`, `1.5.2576.pdf`) indirildi. Hesaplar kitapçıktaki 2025 tarifesi ve sorudaki tutarlarla yapıldı.

Genel: Satır sonları birleştirildi; ₺, binlik ayracı ve kitapçıktaki kesme işaretleri (’ ve ' karışık kullanım aynen) ile yazımlar (tâbi, dâhil, malûl, re’sen, Re'sen, tatbikı) korundu. Tamamı kalın basılan kökler (06, 07, 08, 09, 14, 16, 17, 18, 19) ve diğer soruların kalın soru cümlesi `<strong>` ile korundu; altı çizili “belirlenmez” (05), “değildir” (09, 16), “yanlıştır” (14), “sayılmaz” (17) `<u>` ile işaretlendi. 04 ve 15’teki “(KDV oranı %20 olarak alınacaktır.)” kalın olmayan ayrı paragraf.

## Konu etiketleri

2026-1-VER ile aynı etiket seti kullanıldı; yeni etiket eklenmedi.

- Gelir vergisi: kazanç ve iratlar: 03
- Gelir vergisi: beyan ve matrah: 01, 02, 14
- Kurumlar vergisi: 06, 10, 11, 12, 13
- KDV: 04, 15, 19
- ÖTV: 17
- Diğer vergiler: 16 (MTV), 20 (emlak vergisi)
- Vergi usulü: genel hükümler: (yok)
- Vergi usulü: değerleme: 05
- Vergi usulü: cezalar: 07, 18
- Vergi usulü: uyuşmazlık ve uzlaşma: (yok)
- Vergi icra: AATUHK: 08, 09

Notlar: 01 hem konut kira istisnası hem ücretin beyan sınırını sorar; soru “beyannameye dahil edilmelidir” üzerinden kurulduğu için “beyan ve matrah”ta. 03 bir matrah sorusu olsa da sınanan nokta hangi gelir unsurunun istisna veya beyan dışı olduğu (eurobond, emekli aylığı, mevduat faizi, ticari plaka) olduğu için “kazanç ve iratlar”da. 14 (geçici vergi) mahsup ve beyan esasına ilişkin olduğu için “beyan ve matrah”ta. 07 ceza kesme zamanaşımı (VUK md. 374, cezalar kısmı) olduğu için “cezalar”da.

## Soru bazında tablo

| No | Durum | Ham çıkarıma göre düzeltme | Bağımsız cevap | Kırmızı şık | Anahtar tablosu | Eşleşme |
|----|-------|----------------------------|----------------|-------------|-----------------|---------|
| 01 | düzeltildi | Ortak kutu (tarife + konut kira istisna tutarı) ham dosyada yoktu; `ortakBilgi` olarak `veri` tablosu + liste, 01-03’te aynı. Madde işaretleri `<ul>` | A (huzur hakkı ücret, 86/1-b ile beyan dışı; gayri safi toplam > 1.200.000, md. 21 istisnası yok; 360.000 × 0,85 = 306.000) | A | A | evet |
| 02 | düzeltildi | `ortakBilgi` tarife; madde işaretleri `<ul>`; `cevapNotu` eklendi (kitapçık notu + anahtar kaydı) | A (3.690.000 − 400.000 − 1.500.000 = 1.790.000) | A (güncellenmiş) | B --> A, “Şık Değ.” | evet |
| 03 | düzeltildi | `ortakBilgi` tarife; madde işaretleri `<ul>` | A (yalnız eurobond 1.000.000) | A | A | evet |
| 04 | düzeltildi | Madde işaretleri `<ul>`; KDV oranı notu ayrı paragraf | A (400.000 − 270.000 = 130.000) | A | A | evet |
| 05 | ok | Kalın soru cümlesi, altı çizili “belirlenmez” | E (KVK 13 yöntemi, VUK 267’de yok) | E | E | evet |
| 06 | ok | Kalın kök | B (KVK 17/2: 30 gün) | B | B | evet |
| 07 | ok | Kalın kök | C (VUK 374/1) | C | C | evet |
| 08 | ok | Kalın kök | C (6183 md. 58: 15 gün) | C | C | evet |
| 09 | ok | Kalın kök, altı çizili “değildir” | D (md. 104 durma hali) | D | D | evet |
| 10 | ok | Satır birleştirme | D (150.000.000 × %10; 5/1-h 32/C(2)’de yok) | D | D | evet |
| 11 | düzeltildi | Madde işaretleri `<ul>` | C (KVK 12/6-b) | C | C | evet |
| 12 | ok | Satır birleştirme; “A.Ş’nin” aynen | A (500.000 × 2/4 × %10 = 25.000) | A | A | evet |
| 13 | ok | Satır birleştirme | B (KVK 3/2) | B | B | evet |
| 14 | ok | Kalın kök, altı çizili “yanlıştır” | D (oran sabit %15) | D | D | evet |
| 15 | ok | KDV oranı notu ayrı paragraf | E (1.800.000 / min(1.800.000; 500.000)) | E | E | evet |
| 16 | ok | Kalın kök, altı çizili “değildir” | B (MTVK 4/b: fahri konsoloslar hariç) | B | B | evet |
| 17 | ok | Kalın kök, altı çizili “sayılmaz” | A (ÖTVK 2/1-b) | A | A | evet |
| 18 | ok | Kalın kök | B (VUK 370/a-2: %20) | B | B | evet |
| 19 | ok | Kalın kök | E (KDVK 6/b) | E | E | evet |
| 20 | ok | Satır birleştirme | E (EVK md. 9, 33/1) | E | E | evet |

## Soru 2 cevap güncellemesi

Kitapçık 1. sayfada (soru 2’nin altında) şu not basılıdır: “2. Sorunun doğru cevap şıkkı "B" şıkkı olarak yayınlanmış, "A" şıkkı olarak güncellenmiştir.” (“B” ve “A” kırmızı zeminli). A şıkkı (1.790.000) kırmızı basılmıştır. Cevap anahtarı tablosunda A kitapçığı 2. soru satırı yeşil işaretli, “Doğru Cevap Şıkkı” sütununda “B --> A”, yanında “Şık Değ.” yazılıdır (B kitapçığı 3, C kitapçığı 2, D kitapçığı 1. soru).

Uygulama: `dogru: "A"`, `iptal: false`, `cevapNotu` = kitapçıktaki cümle (basıldığı gibi, düz tırnaklarla) + “(Kitapçıktaki not; cevap anahtarı tablosunda da bu soru için “B --> A” ve “Şık Değ.” yazılıdır.)”.

Bağımsız çözüm A’yı verir: dünya geliri 10.000.000 ₺ → vergi 3.690.000 ₺; GVK md. 123 sınırı 3.690.000 × 2/10 = 738.000 ₺ > 400.000 ₺ → 400.000 ₺ tamamen mahsup; geçici vergi 1.500.000 ₺ mahsup → 1.790.000 ₺. (Marjinal yöntemle hesaplanan sınır da — 3.690.000 − 2.890.000 = 800.000 ₺ — 400.000 ₺’nin üzerinde; sonuç değişmez.) B’yi veren hesap (düzeltme turu 1, koordinatör kararı): GVK md. 123’teki oran (2/10) Türkiye’de hesaplanan vergiye değil Bulgaristan’da ödenen vergiye uygulanırsa 400.000 × 2/10 = 80.000 ₺ mahsup edilir ve 3.690.000 − 80.000 − 1.500.000 = 2.110.000 ₺ bulunur. Oysa oran Türkiye’de hesaplanan vergiye uygulanır ve mahsup sınırını verir (738.000 ₺). Güncellemenin resmi gerekçesi yayımlanmamıştır; çözümde “B’yi veren hesap” olarak verildi (tuzak B ve Not adımı).

## Anahtar çelişkisi

Yok. `tools/allow-missing.txt` değiştirilmedi.

## Tartışmalı soru

**03: tartışmalı (cevap değişmez).** Diğer nokta (19) resmi cevabı değiştiren ikinci bir okuma üretmez:

- **03 (eurobond), tartışmalı (cevap değişmez):** Soru ihraççıyı söylemez. Hazine eurobondu okumasında (terimin olağan anlamı) faiz geçici md. 67/2’deki parantez içi hüküm gereği (dönemsel getiri tahsilinde 67/1 altıncı paragraf da) geçici 67 tevkifatı dışındadır ve 86/1-c sınırını (330.000 ₺) aştığı için beyan edilir: A (resmi cevap). Yabancı ihraççı okumasında gelir tevkifata ve istisnaya konu olmayan MSİ’dir, 86/1-d sınırını aştığı için yine beyan edilir: A. Tam mükellef bir kurumun yurt dışında ihraç ettiği tahvil okumasında faiz geçici md. 67/2 kapsamında tevkifata tabi tutulur ve 67/7 gereği beyan edilmez; matrah 0 olur, şıklarda yoktur. Çözümde “Not (tartışmalı)” adımıyla verildi.
- **03 (yabancı emekli aylığı):** Tartışma yok. GVK md. 23/13 (3239 sayılı Kanun’la eklenen bent) yabancı ülkelerdeki sosyal güvenlik kurumlarınca ödenen emekli, malüliyet, dul ve yetim aylıklarını açıkça istisna eder. (İlk taslakta md. 23/11 ve İdare görüşü olarak yazılmıştı; kanun metninde 23/13 görülerek düzeltildi.)
- **19:** C ve D’de alıcı Türk firmasıdır. “Türkiye’de faydalanma” ölçütü geniş yorumlansaydı C veya D de konu içinde sayılabilirdi; ancak E her okumada KDV’nin konusundadır (Türkiye’de ifa). İdare, yurt dışında ifa edilip yurt dışında tüketilen hizmetleri konu dışı görür. Çözümde Not olarak açıklandı. Güven: E kesin; C’nin konu dışı oluşu, yurt dışındaki fuarlarda verilen stant kurulum ve montaj hizmetlerine ilişkin GİB özelgesiyle (21/07/2011 tarihli; web aramasında görüldü, metni ayrıca getirilmedi) ve KDVK md. 1 ve 6 yorumuyla uyumlu (yüksek); D aynı ilkeye dayanır (orta-yüksek).

## İptal edilen soru

Yok.

## Baskı hataları ve kuşkular

- **Ortak kutu (01-03):** Tarife tablosunun başlık satırından sonra boş bir satırı vardır; aktarılmadı. Oranlar kitapçıkta “%15” biçiminde; aynen korundu. Tarifedeki birikimli tutarlar betikle doğrulandı (23.700; 58.100; 185.000 / 293.000; 1.410.000 / 1.378.000).
- **01:** Huzur hakkı tutarının brüt olduğu varsayıldı (kitapçık “tamamı tevkif yoluyla vergilendirilmiş” der). 3.000.000 ₺ hem brüt hem net okumada 4.300.000 ₺’nin ve 1.200.000 ₺’nin aynı tarafında kalır; sonuç değişmez.
- **04:** Sorumlu sıfatıyla ödenen KDV’nin indirim dönemi (ödendiği dönemin 1 No.lu beyannamesi) KDV Genel Uygulama Tebliği’ne dayanır; KDVK md. 29/1-ç indirimin kendisini düzenler. Soru ödemeyi 28/12/2025’e koyarak Aralık’ı işaret ediyor.
- **06:** Tuzaklarda 15 günün KVK md. 26’daki özel beyan süresi olduğu bilgi olarak verildi; bunun cevaplayanın hatasının kaynağı olduğu iddia edilmedi. D (90) için açıklama yazılmadı.
- **10:** 7582 sayılı Kanun (21/5/2026) md. 32/C(2)’ye (d) bendini ekledi ve (b)’yi değiştirdi; 2025 dönemi ve bu soru için etkisizdir.
- **12:** Cumhurbaşkanı Kararı ile belirlenen %10 oranı ve “aşan kısım / toplam yabancı kaynak” dağıtım formülü tebliğ düzeyindedir; Karar sayısı ve tebliğ bölüm numarası yazılmadı. C (75.000) için mekanizma bulunamadı; açıklama yazılmadı.
- **16:** E’deki “yatırım izleme ve koordinasyon başkanlıkları” 7566 sayılı Kanun’la (4/12/2025) MTVK md. 4/a’ya eklenmiştir; 2026 sınavı için yürürlükte. Çözümde belirtildi.
- **18:** A (%10) ve C (%30) kanunda karşılığı olmayan oranlardır; uydurma mekanizma yazılmadı.
- **02:** B (2.110.000) mekanizması düzeltme turu 1’de eklendi (yukarıda).
- **Tuzaklar:** Mekanizması aritmetikle veya kanun metniyle doğrulanamayan şıklar için uydurma açıklama yazılmadı (06-D, 07-B ve 08-B/E, 12-C, 18-A/C için yalnız “kanunda böyle bir süre/oran yok” denildi ya da açıklama yazılmadı).

## Dayanak atıfları ve güven düzeyi

Kesin = madde metni mevzuat.gov.tr metninde görülerek yazıldı.

- GVK md. 3/1, 4/1, 21 (ikinci fıkra, 6322 ile), 22/3, 23/11, 23/13, 61 (ikinci fıkra; üçüncü fıkra 4 numaralı bent), 74 (götürü gider %15), 75/2-5, 75/2-7, mükerrer md. 80 (üçüncü fıkra, 7104 ile; son fıkra), geçici md. 94 (7587 sayılı Kanun, yürürlük 1/7/2026; gerçek usul ticari kazanç mükelleflerinin önceden sahip oldukları ticari plakaların satış kazancı istisnası), 86/1-b, 86/1-c, 86/1-d, 103, mükerrer md. 120, md. 123, geçici md. 67/1 (altıncı paragraf), 67/2, 67/4, 67/7 — kesin.
- KVK md. 3/1, 3/2, 3/3-a, 4, 5/1-h, 11/1-i, 12/1, 12/2, 12/3-b, 12/6-a, 12/6-b, 13/4-a, 14/3, 17/2, 22/1, 24, 25, 26, 30, 32/C (1), (2), (6) ve 2025’ten itibaren yürürlük (7524) — kesin.
- KDVK md. 1/1, 6/b, 11/1-a, 11/1-c, 24/c, 29/1-a, 29/1-ç (7491; 1/1/2024), 29/2 — kesin.
- VUK md. 267, 280, 344, 370 (a ve a-2; %20), 371, 374/1, 374/2 — kesin.
- 6183 sayılı AATUHK md. 58, 102, 103, 104 — kesin.
- 2576 sayılı Kanun md. 13 — kesin (bu turda indirilip görüldü).
- ÖTVK (4760) md. 1/1-b, 2/1-b, 2/1-d, 4/1-b — kesin.
- MTVK (197) md. 4/a (7566 ile eklenen ibare), 4/b, 4/c — kesin.
- Emlak Vergisi Kanunu (1319) md. 9, 23/a, 33/1 — kesin (bu turda indirildi).
- İYUK md. 7 (genel dava açma süresi 30 gün; 08 tuzak D) — kesin (kanun metni indirilmedi; 2026-1-VER’de de aynı şekilde kullanılan genel hüküm).
- Madde numarası olmadan, kural olarak yazılanlar (alt düzey düzenleme veya İdare görüşü):
  - 04: Sorumlu sıfatıyla ödenen KDV’nin ödendiği dönemde indirilmesi — KDV Genel Uygulama Tebliği (güven: yüksek).
  - 12: Finansman gider kısıtlaması oranının %10 olması — Cumhurbaşkanı Kararı (güven: yüksek); dağıtım formülü — KVK Genel Tebliği Seri No: 1 (güven: yüksek).
  - 15: Tecil edilecek KDV = tecil edilebilir ile ödenmesi gereken KDV’den küçük olanı — KDV Genel Uygulama Tebliği (güven: yüksek).
  - 19: Yurt dışında ifa edilip yurt dışında tüketilen hizmetlerin konu dışı oluşu (C ve D) — İdare özelgeleri (C için yüksek, D için orta-yüksek; cevap E’yi etkilemez).
- Değişiklik tarihleri metin dipnotlarından doğrulandı: GVK mük. 80 plaka ibaresi 7104 (2018); GVK 21 ikinci fıkra 6322 (2012); geçici vergi dönemleri: 4444 (1999) altı aylık yaptı, 5035 2004’ten itibaren üç aylığa döndürdü, 7338 2022’den itibaren dönemleri yılın ilk dokuz ayıyla sınırladı, 7566 bu sınırlamayı 2025 dönemlerinden itibaren kaldırdı (bağımsız incelemede dipnotlardan doğrulandı); KVK 32/C 7524 (2025 kazançları); KDVK 29/1-ç 7491 (1/1/2024); MTVK 4/a yatırım izleme ve koordinasyon başkanlıkları 7566 (4/12/2025); VUK 370 6728 ve 7194.

## Düzeltme turu 1 (bağımsız inceleme sonrası)

- 14 `tuzaklar.A`: 7338 sayılı Kanun’a yanlış atfedilen “altı aylıktan üç aylığa” geçişi kaldırıldı; doğru değişiklik tarihçesi yazıldı.
- 03 `kartlar[0].arka` ve 4. adım: GVK geçici md. 94 (7587 sayılı Kanun, yürürlük 1/7/2026) eklendi; 4. adımdaki parantez “2025 itibarıyla” diye sınırlandı.
- 03 Not adımı: “Not (tartışmalı)” oldu; üç ihraççı okuması ve verdikleri sonuç adlandırıldı.
- 02 `tuzaklar.B` ve Not adımı: B’yi veren hesap (oranın ödenen yabancı vergiye uygulanması: 400.000 × 2/10 = 80.000) yazıldı.
