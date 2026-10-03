# İnceleme notları: 2026-2 Sermaye Piyasası Mevzuatı (2026-2-SPK)

Kaynak: `tools/pdfs/2026_2_spk-mevzuati.pdf` (TÜRMOB SMMM 2026-2, “Sermaye Piyasası Mevzuatı”, A kitapçığı, 5 sayfa; sayfa no. 12–15 ve cevap anahtarı sayfası), sayfa görüntüleri `app/img/originals/2026-2-SPK-p1..p5.png`. Resmî cevap, 5. sayfadaki “Sermaye Piyasası Mevzuatı Cevap Anahtarı” tablosundan (A kitapçığı sütunu) alındı: D B D A D A E A B C E A E C A B C E D C. Tablodaki 20 harfin hepsi ham `dogru` değeriyle ve sayfalardaki kırmızı şıkla aynıdır. Tabloda İPTAL satırı yoktur; sayfalarda iptal işareti yoktur. `iptal` hepsinde `false`, `cevapNotu` hepsinde `null`, ham `notlar` hepsinde boş.

Yöntem: Her soru sayfa görüntüsünden yeniden okundu. Kalın/düz ayrımı PDF yazı tipi bilgisinden (span bazında “Bold”) betikle, altı çizili ifadeler PDF’teki çizgi nesnelerinden betikle tespit edildi; 10 çizginin tamamı görüntüdeki ifadelere denk geldi. Kökler ve şıklar HTML’den arındırılıp NFC’ye normalleştirildi, sonra betikle ham metinle (`tools/out/raw/2026-2-SPK.json`) karşılaştırıldı (boşluklar hariç): 20 kökte ve 100 şıkta fark yok; tire ile bölünmüş kelime yok. Her soru önce birincil metinden (6362 sayılı Kanun veya ilgili tebliğ) bağımsız çözüldü, sonra cevap anahtarıyla karşılaştırıldı: 20/20 eşleşme.

Genel biçim: Satır sonları birleştirildi. 01, 03, 07 ve 19’da Roma rakamlı öncüller düz (`<ul class="madde">`), soru cümlesi kalın; 19’da öncüllerden sonra gelen “ifade eder.” düz basıldığı için ayrı `<p>` içinde düz bırakıldı. 02’de giriş cümlesi (“6362 sayılı Sermaye Piyasası Kanunu’na göre;”) ve tırnak içindeki Kanun cümlesi düz, soru cümlesi kalın; üç ayrı `<p>`. Diğer 15 sorunun kökü tamamen kalındır. Altı çizili ifadeler `<u>` ile işaretlendi: “en geç” (04), “en az” (05), “yanlıştır” (06, 08, 09, 10, 12, 13), “yer almaz” (17), “değildir” (18). 01, 02, 03, 07, 11, 14, 15, 16, 19 ve 20’de altı çizili ifade yok.

Kitapçığın 1. sayfasındaki çerçeve notu (“Kanun: 6362 sayılı Sermaye Piyasası Kanunu’nu, Kurul: Sermaye Piyasası Kurulu’nu ifade eder.”) 2026-1’deki gibi `ortakBilgi` olarak eklenmedi; `ortakBilgi` hepsinde `null`.

## Konu etiketleri

2026-1 incelemesinde tanımlanan 12 etiketlik set aynen kullanıldı (yeni etiket eklenmedi). `konuBaglantisi` her soruda `konu` ile aynıdır. 2026-1 incelemesindeki 2026-2 önerilerinin hepsi uygulandı; **sapma yok**.

| Etiket | 2026-2 soruları |
|---|---|
| Temel kavramlar ve araçlar | 19 |
| İhraç, izahname ve halka arz | 01, 18 |
| Kamuyu aydınlatma ve sorumluluk | 09 |
| Halka açık ortaklıklar | 02, 04, 05, 15 |
| Kripto varlıklar ve kitle fonlaması | 06 |
| Yatırım kuruluşları | 03, 07 |
| Yatırım ortaklıkları | 08 |
| Yatırım fonları ve portföy yönetimi | (yok) |
| Borsalar ve piyasa kurumları | 13, 14, 20 |
| Denetim, tedbirler ve idari yaptırımlar | 10, 12, 17 |
| Sermaye piyasası suçları | 11, 16 |
| SPK’nın yapısı ve yetkileri | (yok) |

Sınır notları (öneriyle aynı sonuç, gerekçe): 03 bir tebliğ sorusu (III-37.1 yerindelik testi) olup yatırım hizmetlerine ilişkindir, “Yatırım kuruluşları”. 07 md. 46 (yatırım kuruluşları bölümü). 11 kripto varlık zimmetini sorar, ancak bir görev-yetki (görevli mahkeme) sorusudur ve md. 110/A–115/A suç hükümleridir; öncelik notu md. 35/A–35/C ve 99/A–99/B ile sınırlı olduğundan “Sermaye piyasası suçları”nda kaldı. 14 (md. 85) ve 20 (md. 77) Kanunun borsalar/diğer kurumlar kısmından, “Borsalar ve piyasa kurumları”. 17 md. 92 (Kurulun tedbirleri), “Denetim, tedbirler ve idari yaptırımlar”. 19 md. 3 tanımları (cüzdan ve platform tanımları dahil), “Temel kavramlar ve araçlar”.

## Soru bazında tablo

| No | Durum | Ham çıkarıma göre düzeltme | Bağımsız cevap | Resmî anahtar | Eşleşme |
|----|-------|----------------------------|----------------|---------------|---------|
| 01 | ok | Roma rakamlı öncüller `<ul class="madde">`, kalın soru cümlesi | D (SPKn md. 10/1–2) | D | evet |
| 02 | ok | Düz giriş + düz alıntı + kalın soru cümlesi (3 paragraf) | B (SPKn md. 18/2: en çok beş yıl) | B | evet |
| 03 | ok | Roma rakamlı öncüller, kalın soru cümlesi | D (III-37.1 md. 40/1, 48/1) | D | evet |
| 04 | ok | Satır birleştirme; kalın kök, altı çizili “en geç” | A (SPKn md. 16/2: iki yıl) | A | evet |
| 05 | ok | Satır birleştirme; kalın kök, altı çizili “en az” | D (SPKn md. 29/1: üç hafta) | D | evet |
| 06 | ok | Satır birleştirme; kalın kök, altı çizili “yanlıştır” | A (SPKn md. 35/A-1: bankacılık mevzuatı uygulanmaz) | A | evet |
| 07 | ok | Roma rakamlı öncüller, kalın soru cümlesi | E (SPKn md. 46/2, 5, 6, 7) | E | evet |
| 08 | ok | Satır birleştirme; kalın kök, altı çizili “yanlıştır” | A (SPKn md. 50/2) | A | evet |
| 09 | ok | Satır birleştirme; kalın kök, altı çizili “yanlıştır” | B (II-15.1 md. 6/2 son cümle) | B | evet |
| 10 | ok | Satır birleştirme; kalın kök, altı çizili “yanlıştır” | C (SPKn md. 89/3) | C | evet |
| 11 | ok | Satır birleştirme; kalın kök | E (SPKn md. 115/A-3) | E | evet |
| 12 | ok | Satır birleştirme; kalın kök, altı çizili “yanlıştır” | A (SPKn md. 105/1: otuz gün) | A | evet |
| 13 | ok | Satır birleştirme; kalın kök, altı çizili “yanlıştır” | E (SPKn md. 65/1 ve 65/7) | E | evet |
| 14 | ok | Satır birleştirme; kalın kök | C (SPKn md. 85/1: bir yıl) | C | evet |
| 15 | ok | Satır birleştirme; kalın kök | A (II-23.2 md. 4/1-n) | A | evet |
| 16 | ok | Satır birleştirme; kalın kök | B (SPKn md. 107/1) | B | evet |
| 17 | ok | Satır birleştirme; kalın kök, altı çizili “yer almaz” | C (SPKn md. 92/1; tedricî tasfiye md. 86/1) | C | evet |
| 18 | ok | Satır birleştirme; kalın kök, altı çizili “değildir” | E (II-5.2 md. 6/1, 13/1) | E | evet |
| 19 | ok | Roma rakamlı öncüller, düz “ifade eder.”, kalın soru cümlesi | D (SPKn md. 3/1-b, d, ö, s, aa, dd) | D | evet |
| 20 | ok | Satır birleştirme; kalın kök | C (SPKn md. 77/1) | C | evet |

Ham çıkarım karakter düzeyinde doğruydu; düzeltmeler yalnız biçimseldir (satır birleştirme, kalın/düz ayrımı, altı çizili ifadeler, öncül listeleri, 02 ve 19’daki paragraf ayrımı).

## Anahtar çelişkisi

Yok. 20 sorunun hepsinde bağımsız çözüm resmî anahtarla aynıdır. `tools/allow-missing.txt` değiştirilmedi.

## Tartışmalı sorular

Yok. Yakın okuma gerektiren yerler (çözümlerde açıklandı, cevabı değiştirmez):

- **12-B:** “Kabahatlerden birisinin işlenmesi suretiyle menfaat temin edilmesi hâlinde ceza menfaatin üç katından az olamaz.” Bu cümle md. 105/2’nin ikinci cümlesidir; Kanunda “bu kabahatin” ifadesiyle aynı fıkradaki tekrarlanan kabahate (karar verilinceye kadar birden çok işlenme) bağlıdır. Tek aykırılıkta alt sınır menfaatin iki katıdır (md. 103/1, 104/1). Şık bağlamı kısaltılmış bir Kanun cümlesidir; kesin aykırılık taşıyan tek şık süreyi otuz günden on beş güne indiren A’dır. B’yi de yanlış sayan bir okuma, resmî cevabı (A) çürütmez; soruyu en fazla iki yanlışlı hâle getirir. Bu nedenle “TARTIŞMALI” sayılmadı; çözümde “Yakın okuma (B)” notu ve `tuzaklar.B` bunu öğretir.
- **01-III:** Öncül md. 10/1’in ikinci kademesinden yalnız lider aracı kurumu anar ve “edilemeyeceğinin açıkça belli olması” hâlini yazmaz. 2026-1-SPK-07-III’teki gibi eksik sayım ifadeyi yanlış yapmaz. **01-IV** de md. 10/2’deki örneklerden yalnız bağımsız denetim kuruluşlarını anar.
- **07-IV:** md. 46/2’deki listeden (kredili işlemler, ödünç, açığa satış, diğer hizmetler) ikisini anar; eksik sayım.
- **13-C:** md. 65/12 “borsa başkanı ve yönetim kurulu üyeleri ve üst yönetimi” der; şık üst yönetimi yazmaz; eksik sayım.
- **17-E:** md. 92/1-c “ilgilileri” görevden almayı, durumun mahkeme kararıyla tespiti şartına bağlı olarak düzenler; şık yönetim kurulu üyelerini anar ve bu şartı yazmaz. Soru “yer almaz” diye sorduğu için E’nin tedbirler arasında yer aldığı açıktır.
- **11:** 2026-1-SPK-11 ile tutarlıdır: genel kural md. 116/1 (ihtisas asliye ceza), istisna md. 115/A-3 ((1) numaralı ağır ceza). 2026-2-11 doğrudan istisnayı sorar; cevap E. Çözüm, 2026-1-11 inceleme düzeltmesindeki anlatımla (5235 md. 11–12; md. 115/A-1 resen soruşturma) aynı çerçeveyi kullanır.

## İptal edilen soru

Yok (cevap anahtarı tablosunda İPTAL satırı ve sayfalarda iptal işareti yok).

## Baskı hataları ve kitapçık notları

- **02 kökü:** Alıntı açılışta tipografik (“), kapanışta düz (") tırnakla basılmış; aynen korundu. Alıntıda “6102 sayılı Türk Ticaret Kanununun” yazılmış (Kanun metni “6102 sayılı Kanunun”); anlamı etkilemez.
- **06-D:** “37. Maddesi” büyük harfle yazılmış; korundu. Kanun (md. 35/A-4) md. 37 ile birlikte md. 38’i de sayar; şıkkın yalnız md. 37’yi anması eksik sayımdır, ifadeyi yanlış yapmaz.
- **10 kökü:** “Kurul’da” (kesme işaretiyle) yazılmış; korundu.
- **17-C:** “Tedrici” şapkasız (Kanun “Tedricî”); korundu.
- **19-I ve 19-IV:** Tanımlar bilerek komşu kavramların adıyla eşleştirilmiş (başlangıç sermayesi → “çıkarılmış sermaye”, cüzdan → “platform”); bu sorunun kasıtlı yanlışlarıdır, baskı hatası değildir.
- **Tuzaklar:** Mekanizması metinle doğrulanamayan yanlış şıklar için uydurma açıklama yazılmadı; “md. X’te geçmez, süre şudur” denildi (02-A/C/E, 04-B/C/E, 05-A/B/E, 14-D/E). Kaynağı bulunan yanıltıcı sayılar açıklandı: 02-D (2 yıl = md. 16/2), 04-D (5 yıl = md. 18/2), 05-C (2 hafta = TTK md. 414/1), 14-A (3 ay = md. 82/1 ve 85/2), 14-B (6 ay = 3+3 ay, md. 85/2).

## Dayanak atıfları ve güven düzeyi

Kesin = hüküm metni bu çalışmada indirilen konsolide metinde kelime kelime görülerek yazıldı.

Kullanılan metinler:
- **6362 sayılı SPKn:** 2026-1 çalışmasında 03/10/2026’da mevzuat.gov.tr’den indirilen konsolide metin (`MevzuatMetin/1.5.6362.pdf`; son işlenmiş değişiklik 26/6/2024 tarihli ve 7518 sayılı Kanun; aynı gün alınan HTML ve SPK Mevzuat Sistemi sürümleri de 7518’de biter). 03/10/2026’da yapılan sınırlı web taramasında, 7518’den sonra 25/07/2026 sınav tarihine kadar 6362’ye işlenmiş bir değişiklik bulunamadı.
- **Tebliğler (SPK Mevzuat Sistemi, `mevzuat.spk.gov.tr/api/Mevzuat/File/<id>`, konsolide PDF, indirme 03/10/2026):** Özel Durumlar Tebliği (II-15.1; id 81; RG 23/1/2014-28891; son işlenmiş değişiklik II-15.1.c, RG 17/11/2018-30598), Birleşme ve Bölünme Tebliği (II-23.2; id 93; RG 28/12/2013-28865; son işlenmiş değişiklik II-23.2.b, RG 30/5/2020-31140), Sermaye Piyasası Araçlarının Satışı Tebliği (II-5.2; id 75; RG 28/6/2013-28691; son işlenmiş değişiklik II-5.2.a, RG 1/12/2017-30257). 2026-1 çalışmasında aynı sistemden indirilen III-37.1 (son işlenmiş değişiklik III-37.1.c, RG 7/4/2022-31802) ve III-39.1 (son işlenmiş değişiklik III-39.1.a, RG 14/1/2016) yeniden kullanıldı. SPK Mevzuat Sistemi listesi (Eylül 2026 kayıtlarını içeriyor) bu tebliğler için sınav tarihinden önce yürürlüğe girmiş ve metne işlenmemiş bir değişiklik göstermiyor.
- **6102 sayılı TTK:** mevzuat.gov.tr `MevzuatMetin/1.5.6102.pdf`, indirme 03/10/2026 (md. 159/1 ve 414/1 okundu).
- **5235 sayılı Kanun:** 2026-1 çalışmasındaki metin (mevzuat.gov.tr `MevzuatMetin/1.5.5235.pdf`, indirme 03/10/2026).
- **SPK Bülteni 2025/68** (31/12/2025; Kurul Karar Organı’nın 30/12/2025 tarih ve 68/2461 sayılı kararıyla yapılan duyuru): md. 84/5 satırı (100.000 TL → 2026 için 2.065.145 TL), PDF tablosundan okundu.

Atıflar:
- **6362 SPKn:** md. 3/1-b, d, e, h, l, ö, s, z, aa, dd; 10/1–2; 16/1–3; 18/1, 2, 6; 29/1–2; 35/A-1, 2, 4, 5, 6; 46/2, 4, 5, 6, 7; 50/1–3; 55/1; 65/1, 2, 4, 5, 7, 12; 77/1, 4; 78/1; 80/1; 81/1; 82/1; 83/1; 84/5; 85/1–2; 86/1; 88/1; 89/1–3; 92/1–3; 93/1; 103/1; 104/1; 105/1–4; 106/1; 107/1–2; 110/1–2; 110/A-1–3; 115/1; 115/A-1, 3; 116/1 — kesin.
- **III-37.1:** md. 40/1, 2, 4, 5, 6; 48/1; 59/3-b — kesin. **III-39.1:** md. 33/1 — kesin.
- **II-15.1:** md. 6/1–4 (6/3-c dahil), 9/2 — kesin.
- **II-23.2:** md. 4/1-ç, e, ı, k, n, ö — kesin.
- **II-5.2:** md. 4/1-ö, 6/1, 7/1, 13/1, 14/4, 15/1, 16/1 — kesin.
- **6102 TTK:** md. 159/1-a, 414/1 — kesin. **5235:** md. 11–12 — kesin.
- **SPK Bülteni 2025/68:** md. 84/5 satırı — kesin.

Madde numarası verilmeden kural olarak yazılanlar:
- 03: “Tebliğ genel saklama hizmeti için yerindelik testi öngörmez.” Olumsuz bir tespittir; III-37.1 metninde “yerindelik” kelimesi yalnız md. 40 ve 48’de geçtiği betikle doğrulandı.
- 15: “Tebliğ ‘tasfiyeli tam bölünme’ diye bir tür tanımlamaz.” II-23.2’de “tasfiye” kelimesinin yalnız birleşme tanımlarında (“tasfiyesiz sona erme”) ve md. 12’de geçtiği betikle doğrulandı.
- 11: “2017 Anayasa değişikliğiyle Hâkimler ve Savcılar Kurulu (HSK)” — genel bilgi (2026-1-SPK-11 ile aynı ifade); cevabı taşımaz.
- 13: “703 sayılı KHK ile ‘Bakanlar Kurulu’ yerine Cumhurbaşkanı” — 6362 konsolide metnindeki dipnottan (dipnot 5) alındı.
