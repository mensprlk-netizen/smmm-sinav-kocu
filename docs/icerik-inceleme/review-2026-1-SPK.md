# İnceleme notları: 2026-1 Sermaye Piyasası Mevzuatı (2026-1-SPK)

Kaynak: `tools/pdfs/2026_1_spk-mevzuati.pdf` (TÜRMOB-TESMER SMMM 2026-1, “Sermaye Piyasası Mevzuatı”, A kitapçığı, 5 sayfa; sayfa no. 15–19), sayfa görüntüleri `app/img/originals/2026-1-SPK-p1..p5.png`. 2026-1 kitapçıklarında cevap anahtarı tablosu yoktur; resmî cevap kırmızı basılmış şıktır. Kırmızı şıkların 20’si de ham `dogru` değeriyle aynıdır.

Yöntem: Her soru sayfa görüntüsünden yeniden okundu. 03, 15 ve 16 ayrıca 200 dpi kırpımla kontrol edildi. Altı çizili ifadeler ayrıca PDF’teki çizgi nesnelerinden betikle tespit edildi; 12 çizginin tamamı görüntüdekiyle aynı ifadelere denk geldi. Kökler ve şıklar HTML’den arındırılıp NFC’ye normalleştirildi, sonra betikle ham metinle (`tools/out/raw/2026-1-SPK.json`) karşılaştırıldı (boşluklar hariç): 20 kökte ve 100 şıkta fark yok. Her soru önce birincil metinden (6362 sayılı Kanun veya ilgili tebliğ) bağımsız çözüldü, sonra kırmızı şıkla karşılaştırıldı: 20/20 eşleşme. İptal işareti yok; `iptal` hepsinde `false`, `cevapNotu` hepsinde `null`, ham `notlar` hepsinde boş.

Genel biçim: Satır sonları birleştirildi; tire ile bölünmüş kelime yoktu. 03, 07, 09 ve 16 dışında kökler tamamen kalın basılmıştır ve `<strong>` ile korundu. 03, 07, 09 ve 16’da Roma rakamlı öncüller düz (`<ul class="madde">`), soru cümlesi kalın. Altı çizili ifadeler `<u>` ile işaretlendi: “en az” (02), “yanlıştır” (04, 05, 08, 10, 12, 18), “değildir” (06), “girmez” (13), “en fazla” iki kez (15), “sayılmamıştır” (17). 01, 03, 07, 09, 11, 14, 16, 19 ve 20’de altı çizili ifade yok.

Kitapçığın 1. sayfasındaki çerçeve notu (“Sorular ve seçeneklerde geçen; Kanun: 6362 sayılı Sermaye Piyasası Kanunu’nu, Kurul: Sermaye Piyasası Kurulu’nu ifade eder.”) bir soruya ait olmadığı ve bütün kökler Kanunu adıyla andığı için `ortakBilgi` olarak eklenmedi; `ortakBilgi` hepsinde `null`.

## Konu etiketleri

Sermaye Piyasası Mevzuatı için tanımlanan set (12 etiket). 2026-2-SPK dosyası tam olarak bu etiketleri kullanacaktır; 2026-1’de kullanılmayan etiket (“SPK’nın yapısı ve yetkileri”) sonraki dönemler için ayrılmıştır. 2026-2 kitapçığının ham metni (`tools/out/raw/2026-2-SPK.json`) tarandı: 20 sorunun hepsi bu setle karşılanır (önerilen dağılım aşağıda). `konuBaglantisi` her soruda `konu` ile aynıdır.

| Etiket | Kapsam | 2026-1 soruları | 2026-2 (öneri) |
|---|---|---|---|
| Temel kavramlar ve araçlar | SPKn md. 1–3 (amaç, kapsam, tanımlar); sermaye piyasası araçları ve ihraççıları: borçlanma araçları, borçlanma aracı sahipleri kurulu (md. 31/A), teminatlı ihraç ve teminat yöneticisi (md. 31/B), kaydileştirme (md. 13), konut ve varlık finansmanı, ipotek finansmanı kuruluşları, ipotekli ve varlığa dayalı menkul kıymetler, kira sertifikası ve varlık kiralama şirketleri, gayrimenkul sertifikası (md. 57–61/A); ilgili tebliğler (VII-128.8, III-61.1, VII-128.2, III-58.1, III-59.1, II-31/B.1) | 04, 19 | 19 |
| İhraç, izahname ve halka arz | SPKn md. 4–12 (izahname ve ihraç belgesi, onay, yayım, değişiklikler, geçerlilik, izahnameden sorumluluk md. 10, satış); İzahname ve İhraç Belgesi Tebliği (II-5.1), Sermaye Piyasası Araçlarının Satışı Tebliği (II-5.2), Pay Tebliği (VII-128.1) | 01, 18 | 01, 18 |
| Kamuyu aydınlatma ve sorumluluk | SPKn md. 14–15 (finansal raporlama, özel durumlar), md. 32 (kamuyu aydınlatma belgelerinden doğan sorumluluk), md. 62–64 (bağımsız denetim, derecelendirme ve değerleme kuruluşları); Finansal Raporlama (II-14.1), Özel Durumlar (II-15.1), KAP (VII-128.6) tebliğleri | 05 | 09 |
| Halka açık ortaklıklar | SPKn md. 16–31: halka açık ortaklık statüsü ve borsaya başvuru, kurumsal yönetim, kayıtlı sermaye, kâr payı ve kâr payı avansı, bağış, örtülü kazanç aktarımı (md. 21), geri alım, önemli nitelikteki işlemler ve ayrılma hakkı, pay alım teklifi, ortaklıktan çıkarma ve satma hakları, genel kurul, vekâleten oy; ilgili tebliğler (II-17.1, II-18.1, II-19.1, II-22.1, II-23.2, II-23.3, II-26.1, II-27.3, II-30.1) | 02, 03, 07 | 02, 04, 05, 15 |
| Kripto varlıklar ve kitle fonlaması | SPKn md. 35/A (kitle fonlama platformları), 35/B–35/C (kripto varlık hizmet sağlayıcıları), 99/A–99/B; III-35/A.2, III-35/B.1, III-35/B.2 | 06 | 06 |
| Yatırım kuruluşları | SPKn md. 35–47: sermaye piyasası kurumları, yatırım hizmet ve faaliyetleri, yan hizmetler, faaliyet izni, yatırım kuruluşlarının yükümlülükleri ve müşteri varlıkları; III-37.1, III-39.1, III-45.1 | 09 | 03, 07 |
| Yatırım ortaklıkları | SPKn md. 48–51 (sabit ve değişken sermayeli yatırım ortaklıkları, kuruluş ve faaliyet şartları); III-48.1, III-48.3, III-48.5 | 08 | 08 |
| Yatırım fonları ve portföy yönetimi | SPKn md. 52–56 (yatırım fonları, fon mal varlığının ayrılığı, portföy yönetim şirketi, portföy saklama hizmeti); III-52.1, III-52.2, III-52.3, III-52.4, III-55.1, III-56.1 | 10, 12, 13, 15 | (yok) |
| Borsalar ve piyasa kurumları | SPKn md. 65–87: borsalar ve piyasa işleticileri, TSPB, TDUB, merkezî takas ve merkezî karşı taraf, merkezî saklama, MKK, Takasbank, Yatırımcı Tazmin Merkezi ve yatırımcıların tazmini (md. 82–86), veri depolama kuruluşları (md. 87) | 14, 20 | 13, 14, 20 |
| Denetim, tedbirler ve idari yaptırımlar | SPKn md. 88–105: denetim, arama ve el koyma, Kurulun tedbirleri (md. 92–102; md. 101 inceleme tedbirleri dahil), idari para cezaları (md. 103–105), piyasa bozucu eylemler (md. 104); V-101.1, VI-104.1 | 17 | 10, 12, 17 |
| Sermaye piyasası suçları | SPKn md. 106–116: bilgi suistimali, piyasa dolandırıcılığı, diğer suçlar, güveni kötüye kullanma ve sahtecilik, kripto varlık suçları, ortak hükümler, yazılı başvuru, görevli mahkeme | 11, 16 | 11, 16 |
| SPK’nın yapısı ve yetkileri | SPKn md. 117–135: Kurulun kuruluşu, bağımsızlığı, karar organı, görev ve yetkileri (md. 128), düzenleyici işlemler, bütçe ve personel | (yok) | (yok) |

Öncelik notu: “Kripto varlıklar ve kitle fonlaması” etiketi, md. 35/A–35/C ve 99/A–99/B için “Yatırım kuruluşları” (md. 35–47) ve “Denetim, tedbirler ve idari yaptırımlar” (md. 88–105) etiketlerinin madde aralıklarına önceliklidir.

Sınır notları: 02 örtülü kazanç aktarımını (md. 21) sorduğu için, aynı fiilin suç tipi md. 110’da olsa da “Halka açık ortaklıklar”dadır. 04 teminat yöneticisini (md. 31/B) sorar; teminatlı ihraç bir araç düzenlemesi olduğu için “Temel kavramlar ve araçlar”dadır. 13 portföy saklama hizmeti md. 56 bütün kolektif yatırım kuruluşlarına uygulanır, ama soru yatırım fonu kararıyla saklama işini ayırdığı için “Yatırım fonları ve portföy yönetimi”ndedir. 14 (Kurulun tazmin kararı, md. 82) ve 20 (veri depolama, md. 87) Kanunun “Diğer Kurumlar” bölümünden oldukları için “Borsalar ve piyasa kurumları”ndadır. 16 hem piyasa bozucu eylemi (md. 104, idari) hem iki suç tipini sorar; doğru-yanlış ayrımı suç tiplerinde olduğu için “Sermaye piyasası suçları”ndadır. 17 Kurulun inceleme tedbirlerini (md. 101) sorduğu için “Denetim, tedbirler ve idari yaptırımlar”dadır. 2026-2’de 11 (kripto varlık zimmet suçunda görevli mahkeme) bir görev-yetki sorusu olduğu için “Sermaye piyasası suçları”na, 15 (Birleşme ve Bölünme Tebliği) “Halka açık ortaklıklar”a, 19 (md. 3 tanımları) “Temel kavramlar ve araçlar”a önerilir.

## Soru bazında tablo

| No | Durum | Ham çıkarıma göre düzeltme | Bağımsız cevap | Kırmızı şık | Eşleşme |
|----|-------|----------------------------|----------------|-------------|---------|
| 01 | ok | Satır birleştirme; kalın kök | B (SPKn md. 8/4: iki iş günü) | B | evet |
| 02 | ok | Satır birleştirme; kalın kök, altı çizili “en az” | D (SPKn md. 21/3: en az sekiz yıl) | D | evet |
| 03 | ok | Roma rakamlı öncüller `<ul class="madde">`, kalın soru cümlesi | D (II-23.3 md. 15/1-c, ç, e, j) | D | evet |
| 04 | ok | Satır birleştirme; kalın kök, altı çizili “yanlıştır” | C (SPKn md. 31/B-5: izin aranmaz) | C | evet |
| 05 | ok | Satır birleştirme; kalın kök, altı çizili “yanlıştır” | E (SPKn md. 32/6: altı ay) | E | evet |
| 06 | ok | Satır birleştirme; kalın kök, altı çizili “değildir” | B (SPKn md. 35/B-3-b: mali güç hariç) | B | evet |
| 07 | ok | Roma rakamlı öncüller, kalın soru cümlesi | C (SPKn md. 20/1–2) | C | evet |
| 08 | ok | Satır birleştirme; kalın kök, altı çizili “yanlıştır” | A (SPKn md. 49/4: Kurul onayı şart) | A | evet |
| 09 | ok | Roma rakamlı öncüller, kalın soru cümlesi | B (III-37.1 md. 8/1-a) | B | evet |
| 10 | ok | Satır birleştirme; kalın kök, altı çizili “yanlıştır” | D (SPKn md. 52/5: fon adına tescil) | D | evet |
| 11 | ok | Satır birleştirme; kalın kök | E (SPKn md. 116/1) | E | evet |
| 12 | ok | Satır birleştirme; kalın kök, altı çizili “yanlıştır” | C (SPKn md. 53/2) | C | evet |
| 13 | ok | Satır birleştirme; kalın kök, altı çizili “girmez” | A (SPKn md. 56/1 a–f; md. 52/3, 55/1) | A | evet |
| 14 | ok | Satır birleştirme; kalın kök | B (SPKn md. 82/1: üç ay) | B | evet |
| 15 | ok | Satır birleştirme; kalın kök, iki altı çizili “en fazla” | E (III-52.1 md. 6/1-b) | E | evet |
| 16 | ok | Roma rakamlı öncüller, kalın soru cümlesi | A (SPKn md. 104/1; II → md. 107/2; III → md. 110/1-b) | A | evet |
| 17 | ok | Satır birleştirme; kalın kök, altı çizili “sayılmamıştır” | E (SPKn md. 101/1 a–f) | E | evet |
| 18 | ok | Satır birleştirme; kalın kök, altı çizili “yanlıştır” | C (II-5.1 md. 6/1-a: 250.000 TL; 2026 için 9.500.000 TL) | C | evet |
| 19 | ok | Satır birleştirme; kalın kök | A (SPKn md. 61/1) | A | evet |
| 20 | ok | Satır birleştirme; kalın kök | E (SPKn md. 87/1) | E | evet |

Ham çıkarım karakter düzeyinde doğruydu; düzeltmeler yalnız biçimseldir (satır birleştirme, kalın/düz ayrımı, altı çizili ifadeler, öncül listeleri).

## Anahtar çelişkisi

Yok. 20 sorunun hepsinde bağımsız çözüm kırmızı şıkla aynıdır. `tools/allow-missing.txt` değiştirilmedi.

## Tartışmalı sorular

Yok. Yakın okuma gerektiren tek yer 07-III’tür: öncül md. 20/2’deki sorumluları ve zarar görenleri eksik sayar (bağımsız denetimi yapanlar ve avansın kararlaştırıldığı veya ödendiği dönemde pay edinenler yazılmamış). Eksik sayım ifadeyi yanlış yapmaz; söylenen her şey Kanunla aynıdır. Öncülü yanlış sayan aday “Yalnız II” (B) seçer; çözümde 3. adım ve `tuzaklar.B` bunu açıklar.

## İptal edilen soru

Yok (sayfalarda iptal işareti yok).

## Baskı hataları, kitapçık notları ve kuşkular

- **12 kökü:** “yatırım fon mal varlığının” yazılmış (Kanun başlığı md. 53 “Fon mal varlığının ayrılığı”; beklenen “yatırım fonu”). Anlamı etkilemez; kitapçık yazımı korundu.
- **17 kökü:** “sermaye piyasası kurulunun” küçük harfle yazılmış; korundu.
- **14 şıkları:** “1 Ay … 12 Ay” büyük harfle; korundu. Kök Kanundaki cümleyi (md. 82/1) aynen alıntılar.
- **19 kökü:** “Kurul’ca” (Kanun “Kurulca”); korundu.
- **18-C:** Şıktaki “yüz bin TL” tebliğ metnindeki iki yüz elli bin TL’den ve 2026 için ilan edilen 9.500.000 TL’den farklıdır; bu, sorunun kasıtlı yanlış ifadesidir, baskı hatası değildir.
- **16-III:** Md. 110/1-b’deki “gibi” ibaresi Anayasa Mahkemesi kararıyla iptal edildiğinden metinde “(…)” vardır; öncül iptal sonrası metinle aynıdır.
- **Tuzaklar:** Mekanizması metinle doğrulanamayan yanlış şıklar için uydurma açıklama yazılmadı; “md. X’te geçmez, süre şudur” denildi (01-A/C/E, 02-A/C, 14-A/D). Kaynağı bulunan yanıltıcı sayılar açıklandı: 01-D (7 iş günü = md. 8/3 onay süresi), 14-C (6 ay = YTM ödeme süresi 3+3, md. 85/2), 14-E (1 yıl = tazmin talebi zamanaşımı, md. 85/1). 02-B ve 02-E’de 5 ve 10 yılın vergi ve ticaret mevzuatındaki genel saklama süreleri olduğu madde numarası verilmeden yazıldı.

## Dayanak atıfları ve güven düzeyi

Kesin = hüküm metni bu çalışmada indirilen konsolide metinde kelime kelime görülerek yazıldı.

Kullanılan metinler (indirme 03/10/2026):
- **6362 sayılı SPKn:** mevzuat.gov.tr `MevzuatMetin/1.5.6362.pdf` (PDF oluşturma 02/07/2024; son işlenmiş değişiklik 26/6/2024 tarihli ve 7518 sayılı Kanun). Aynı gün mevzuat.gov.tr’nin HTML sürümü de alındı: işlenmiş en son değişiklik yine 7518. SPK Mevzuat Sistemi’ndeki konsolide metin (mevzuat.spk.gov.tr, “Sermaye Piyasası Kanunu (6362)”) de 7518’de biter. Web taramasında 7518’den sonra, 25/04/2026’ya kadar 6362’ye işlenmiş bir değişiklik bulunamadı (sınırlı tarama). Çözümler bu metne göre yazıldı.
- **Tebliğler:** SPK Mevzuat Sistemi’nin (mevzuat.spk.gov.tr, `api/Mevzuat/File/<id>`) konsolide PDF’leri: Önemli Nitelikteki İşlemler ve Ayrılma Hakkı Tebliği (II-23.3; RG 27/6/2020-31168; değişiklik notu yok), Yatırım Hizmetleri ve Faaliyetleri ile Yan Hizmetlere İlişkin Esaslar Hakkında Tebliğ (III-37.1; son işlenmiş değişiklik RG 7/4/2022-31802), Yatırım Kuruluşlarının Kuruluş ve Faaliyet Esasları Hakkında Tebliğ (III-39.1; son işlenmiş değişiklik RG 14/1/2016), Yatırım Fonlarına İlişkin Esaslar Tebliği (III-52.1; son işlenmiş değişiklik III-52.1.e, RG 1/3/2024-32476), İzahname ve İhraç Belgesi Tebliği (II-5.1; RG 22/6/2013-28685), Kâr Payı Tebliği (II-19.1; RG 23/1/2014). SPK sistemi her değişikliği RG tarih ve sayısıyla listeler; atıf yapılan hükümlerde sınav tarihinden önce yürürlüğe girmiş ve metne işlenmemiş bir değişiklik bulunamadı (II-23.3 için “II-23.3.a” araması sonuçsuz). Yürürlükten kaldırılmış II-23.1 yalnız karşılaştırma için indirildi, atıf yapılmadı.
- **Yeniden değerlenmiş tutarlar:** SPK Bülteni 2025/68 (31/12/2025; Kurul Karar Organı’nın 30/12/2025 tarih ve 68/2461 sayılı kararıyla yapılan duyuru), spk.gov.tr’den PDF. 2026 için yeniden değerleme oranı %25,49 (585 sıra no.lu VUK Genel Tebliği). Kullanılan satırlar: II-5.1 md. 6 (250.000 → 9.500.000 TL; 5.000.000 → 142.500.000 TL), SPKn md. 104 (20.000–500.000 → 445.243,49–11.141.376,25 TL), SPKn md. 84/5 (100.000 → 2.065.145 TL).

Atıflar:
- **6362 SPKn:** md. 3/1-i ve z, 8/1–4, 18/6, 20/1–2, 21/1–4, 23/1, 24/1–4, 31/B-1, 2, 4, 5, 6, 8, 32/1–7, 35 (h bendi), 35/B-1, 2, 3-a (1)–(6), 3-b, 48/3, 49/1 (a–f), 49/3–5, 52/1–3, 52/5, 53/1–4, 55/1, 56/1 (a–f), 56/6, 57/1, 61/1–3, 61/A/1, 77/1, 80/1, 81/1, 82/1–2, 83/1, 84/5, 85/1–2, 87/1–4, 101/1 (a–f) ve 101/3, 103/1, 104/1, 105/4, 106/1, 107/1–2, 110/1-b ve c (AYM iptal dipnotu dahil), 115/1–4, 116/1 — kesin.
- **II-23.3:** md. 15/1-c, ç, e, j ve 15/2–3 — kesin.
- **III-37.1:** md. 8/1-a, b, c — kesin. **III-39.1:** md. 4/1-d, e, ğ — kesin.
- **III-52.1:** md. 5/4–5, 6/1 (a-4, b, ç, d, e-1) — kesin.
- **II-5.1:** md. 6/1-a, c; 6/2-c, ç, d (ve 6/2’nin tam listesi, kart 2); 6/4 — kesin.
- **II-19.1:** md. 9/1–2, 10/2, 10/4 — kesin.
- **SPK Bülteni 2025/68:** yukarıdaki üç satır — kesin (PDF tablosundan okundu).
- **5235 sayılı Kanun** (mevzuat.gov.tr `MevzuatMetin/1.5.5235.pdf`, indirme 03/10/2026): md. 11–12 (asliye ceza ve ağır ceza mahkemelerinin görevi; ağır ceza on yıldan fazla hapis gerektiren suçlar) — kesin. 6362 md. 110/A ve 115/A-1, 3 (7518 ile ek) — kesin.
- Madde numarası verilmeden kural olarak yazılanlar: 02-B’de defter ve belgeler için vergi mevzuatındaki (Vergi Usul Kanunu) beş yıllık, 02-E’de Türk Ticaret Kanunu’ndaki on yıllık genel saklama süresi (genel bilgi; bu çalışmada metinleri indirilmedi, cevabı taşımaz, cevap SPKn md. 21/3’e dayanır). 02 adım 3’te sekiz yıllık saklamanın amacı (yorum olarak işaretlendi).

## İnceleme düzeltmeleri (bağımsız inceleme sonrası)

- **11:** Çözüm md. 116/1 ve 115/1’i bütün SPKn suçlarını kapsar gibi sunuyordu. 7518 sayılı Kanunla eklenen istisnalar eklendi: kripto varlık hizmet sağlayıcılarda zimmet (md. 110/A) davaları fiilin işlendiği ilin (1) numaralı ağır ceza mahkemesinde görülür (md. 115/A-3); md. 110/A-3’teki suçta soruşturma Kurulun yazılı bildirimi üzerine veya gecikmesinde sakınca görülen hâllerde resen yapılır (md. 115/A-1). Adım 3 ve tuzak B yeniden yazıldı: genel kuralda (5235 md. 11–12) ağır ceza on yıldan fazla hapis gerektiren suçlara bakar; SPKn’nin üç-beş yıllık suçları zaten asliye cezanındır, üst sınırı on yılı aşan md. 110/A zimmeti md. 115/A-3 ile ağır cezaya gönderilmiştir. Kartlar kural ve istisnayı birlikte verir; dayanak md. 110/A, 115/A-1, 3 ve 5235 md. 11–12 ile genişletildi. Adım 1’de kanun ve kök ifadesi “Hâkimler ve Savcılar Yüksek Kurulu” korunup “(2017 Anayasa değişikliğiyle Hâkimler ve Savcılar Kurulu, HSK)” eklendi. Cevap E değişmedi (kök md. 116/1’i aynen alıntılar). 2026-2-SPK-11 bu istisnayı soruyor.
- **17:** 2. kart “md. 106–107 suçlarında” ile sınırlandı.
- **02:** Adım 3’teki saklama amacına ilişkin cümle yorum olarak işaretlendi (“kanaatimizce”).
- **05:** Not, md. 32/4’ün lafzına göre yeniden yazıldı (izahnamenin geçerlilik süresi; alım ve satım her iki yön).
- **Etiketler:** md. 62–64 “Kamuyu aydınlatma ve sorumluluk” kapsamına alındı; kripto/kitle fonlaması etiketinin önceliği yazıldı.
