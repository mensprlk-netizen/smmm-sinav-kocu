# İnceleme notları: 2026-2 Meslek Hukuku (2026-2-MH)

Kaynak: `tools/pdfs/2026_2_meslek-hukuku.pdf` (TÜRMOB SMMM 2026-2, “Muhasebecilik ve Mali Müşavirlik Meslek Hukuku”, A kitapçığı, 4 sayfa; soru sayfaları 15–17, 4. sayfa resmî cevap anahtarı), sayfa görüntüleri `app/img/originals/2026-2-MH-p1..p4.png`. Sınav tarihi 25/07/2026.

Resmî cevap: 4. sayfadaki “M. Ve M.M. Meslek Hukuku Cevap Anahtarı” tablosunun A kitapçığı sütunu: 1 A, 2 D, 3 D, 4 B, 5 D, 6 B, 7 A, 8 B, 9 C, 10 A, 11 E, 12 D, 13 A, 14 C, 15 B, 16 E, 17 A, 18 E, 19 C, 20 E. Tabloda İPTAL satırı yok; kitapçıktaki kırmızı şıkların 20’si ve ham `dogru` değerlerinin 20’si tabloyla aynı. `iptal` hepsinde `false`, `cevapNotu` hepsinde `null`, ham `notlar` hepsinde boş.

Yöntem: Her soru sayfa görüntüsünden yeniden yazıldı; 2, 9 ve 15 ayrıca 170 dpi kırpımla kontrol edildi (kalın/düz ayrımı, altı çizili ifadeler, boşluk çizgileri). Kökler ve şıklar HTML’den arındırılıp NFC’ye normalleştirildi ve betikle ham metinle (`tools/out/raw/2026-2-MH.json`) karşılaştırıldı (boşluklar hariç): 20 kökte ve 100 şıkta fark yok. Her soru önce birincil metinden (Kanun veya yönetmelik) bağımsız çözüldü, sonra anahtarla karşılaştırıldı: 20/20 eşleşme.

Genel biçim: Satır sonları birleştirildi; tire ile bölünmüş kelime yoktu. Tamamı kalın basılan kökler `<strong>` ile korundu. 2, 3, 4 ve 15’te giriş paragrafı düz, soru cümlesi kalın. 9 ve 18’de Roma rakamlı öncüller düz (`<ul class="madde">`), soru cümlesi kalın (9’da “Bir meslek mensubu;” girişi düz). Altı çizili ifadeler `<u>` ile işaretlendi: “yanlıştır” (01, 07, 09), “en geç” (02), “değildir” (06, 10, 14), “sayılmamıştır” (08), “en az” (19). 03, 04, 05, 11, 12, 13, 15, 16, 17, 18 ve 20’de altı çizili ifade yok. Boşluklar kitapçıktaki gibi “_____” (15’te “(i)_____” bitişik), 14’teki “özel şartları”ndan” tırnaklaması ve kitapçığın yazımları (“meslekî”, “imkanı”, “İşyeri”/“iş yeri”) aynen korundu.

## Konu etiketleri

2026-1-MH incelemesinde tanımlanan 12 etiketlik set aynen kullanıldı; yeni etiket eklenmedi. Kapsamlar, 2026-1 incelemesinde yapılan iki düzeltme işlenmiş hâliyle aşağıdadır (2026-1 notlarına dokunulmadı). `konuBaglantisi` her soruda `konu` ile aynıdır.

| Etiket | Kapsam (düzeltmeler işlenmiş) | 2026-2 soruları |
|---|---|---|
| Meslek mensubu olma şartları | 3568 md. 4, 5, 8, 9: genel ve özel şartlar, yabancılar, mesleğe kabul engelleri; ruhsat alma şartları | 14 |
| Staj ve sınav | 3568 md. 6, 7, 10; Staj Yönetmeliği, Sınav Yönetmeliği, TESMER | 07, 15 |
| Sürekli mesleki geliştirme | 3568 md. 44 (mesleki geliştirme eğitimi); Sürekli Mesleki Geliştirme Eğitimi Yönetmeliği | 16 |
| Ruhsat ve çalışma esasları | Çalışma Usul ve Esasları Yönetmeliği: meslek kütüğü ve çalışanlar listesi, büro ve büro tescili, iş kabulü ve reddi, ortaklık büroları ve şirketler, defter-belge saklama ve iadesi, çalışanlar listesinden silinme | 02, 03 |
| Ücret ve sözleşme | 3568 md. 46, Ücret Yönetmeliği ve tarife; meslek mensubu ile müşteri arasındaki sözleşme (yapılması, asgari içeriği, feshi; Çalışma Usul ve Esasları Yönetmeliği md. 24–26) | 01, 04 |
| Yasak haller | 3568 md. 43 (meslek sırları) ve md. 45 (yasaklar, reklam yasağı fıkrası); Çalışma Usul ve Esasları Yönetmeliği “Yasak Haller ve İstisnaları” bölümü | (yok) |
| Haksız rekabet ve reklam | Haksız Rekabet ve Reklam Yasağı Yönetmeliği | 08, 09 |
| Etik ilkeler | Etik İlkeler Yönetmeliği ve Ek-1 | 10, 11 |
| Disiplin cezaları ve usulü | 3568 md. 48–49, Disiplin Yönetmeliği | 12, 13, 18 |
| Odalar ve organları | 3568 md. 15–27, SMMM ve YMM Odaları Yönetmelikleri, Üye Aidatları Yönetmeliği (oda aidatları) | 05, 19, 20 |
| TÜRMOB ve organları | 3568 md. 28–40, TÜRMOB Yönetmeliği | 06, 17 |
| Mesleki sorumluluk ve VUK | 3568 md. 12 ve 47, meslek mensubunu bağlayan VUK hükümleri | (yok) |

Sınır notları: 04 (sözleşmenin feshinde defter ve belgelerin iadesi) Çalışma Usul ve Esasları Yönetmeliği md. 26’dan olduğu ve md. 24–26 açıkça “Ücret ve sözleşme” kapsamında sayıldığı için oradadır; “Ruhsat ve çalışma esasları”ndaki “defter-belge saklama ve iadesi” md. 27’yi (işin bitiminde saklama ve iade) karşılar. 13 cezası sorulan fiil ücretle ilgili olsa da disiplin cezasını sorduğu için “Disiplin cezaları ve usulü”ndedir (2026-1’deki kuralla aynı). 20 Kanun’daki oda genel kurulu görevini sorduğu için “Odalar ve organları”ndadır.

## Soru bazında tablo

| No | Durum | Ham çıkarıma göre düzeltme | Bağımsız cevap | Resmî anahtar | Eşleşme |
|----|-------|----------------------------|----------------|---------------|---------|
| 01 | ok | Satır birleştirme; kalın kök, altı çizili “yanlıştır” | A (Ücret Yön. md. 13) | A | evet |
| 02 | ok | Düz giriş + kalın soru cümlesi; altı çizili “en geç” | D (ÇUEY md. 14/1) | D | evet |
| 03 | ok | Düz giriş + kalın soru cümlesi | D (ÇUEY md. 23/4) | D | evet |
| 04 | ok | Düz giriş + kalın soru cümlesi | B (ÇUEY md. 26) | B | evet |
| 05 | ok | Kalın kök | D (Odalar Yön. md. 9/1; 3568 md. 20/1) | D | evet |
| 06 | ok | Kalın kök, altı çizili “değildir” | B (TÜRMOB Yön. md. 10; 3568 md. 31) | B | evet |
| 07 | ok (not) | Kalın kök, altı çizili “yanlıştır” | A (Staj Yön. md. 9/d-1: 3 ay) | A | evet |
| 08 | ok | Kalın kök, altı çizili “sayılmamıştır” | B (HRRY md. 7/1-g; A, C, D, E md. 6/1) | B | evet |
| 09 | ok | Düz giriş, Roma rakamlı öncüller `<ul class="madde">`, kalın soru cümlesi, altı çizili “yanlıştır” | C (HRRY md. 13/1–2, 19/1) | C | evet |
| 10 | ok | Kalın kök, altı çizili “değildir” | A (Ek-1 md. 3/1) | A | evet |
| 11 | ok | Kalın kök | E (Ek-1 md. 1/1-b) | E | evet |
| 12 | ok | Kalın kök | D (Disiplin Yön. md. 4/c; 3568 md. 48/c) | D | evet |
| 13 | ok | Kalın kök | A (Disiplin Yön. md. 6/g) | A | evet |
| 14 | ok | Kalın kök, altı çizili “değildir” | C (3568 md. 4/b; özel şartlar md. 5/A) | C | evet |
| 15 | ok | Düz giriş + kalın soru cümlesi | B (Sınav Yön. md. 16/b) | B | evet |
| 16 | ok | Kalın kök | E (SMG Yön. md. 11/1) | E | evet |
| 17 | ok | Kalın kök | A (3568 md. 35/1; TÜRMOB Yön. md. 21/1) | A | evet |
| 18 | ok | Roma rakamlı öncüller `<ul class="madde">`, kalın soru cümlesi | E (Disiplin Yön. md. 12/2) | E | evet |
| 19 | ok | Kalın kök, altı çizili “en az” | C (3568 md. 15/1) | C | evet |
| 20 | ok | Kalın kök | E (3568 md. 19/h) | E | evet |

Kısaltmalar (yalnız bu tabloda): ÇUEY = Çalışma Usul ve Esasları Yönetmeliği; HRRY = Haksız Rekabet ve Reklam Yasağı Yönetmeliği; Ek-1 = Etik İlkeler Yönetmeliği’nin eki; SMG = Sürekli Mesleki Geliştirme Eğitimi. Çözüm metinlerinde ÇUEY, HRRY ve SMG kısaltmaları kullanılmadı.

Ham çıkarım karakter düzeyinde doğruydu; düzeltmeler yalnız biçimseldir (satır birleştirme, kalın/düz ayrımı, altı çizili ifadeler, öncül listeleri).

## Anahtar çelişkisi

Yok. 20 sorunun hepsinde bağımsız çözüm resmî anahtarla aynıdır. `tools/allow-missing.txt` değiştirilmedi.

## Tartışmalı sorular

Yok. Değerlendirilen ama tartışmalı sayılmayan durum:

- **07 (geçiş hükmü):** Staj Yönetmeliği geçici md. 4’e göre 24/02/2025’ten önce staja giriş sınavını kazananlara md. 9’un eski hükmü uygulanır. Eski metin (TÜRMOB’un 2013 konsolide metni `YONETMELIKLER-2_4_2013/12_SMMM_SM_STAJ_YONET.pdf`; değişiklik metni RG 24/02/2025-32823, `20250224-3.htm`): yabancı dil eğitimi “6 ayı aşmamak üzere”, bilgisayar eğitimi 3 ayı aşmamak üzere (ikisinin toplamı 6 ay), lisansüstü eğitim diploma ve tez ibrazıyla 1 yıl, doktora 18 ay. Yabancı dilin bir yılı hiçbir sürümde sayılmadığı için A iki metne göre de yanlıştır. Eski metinde tezsiz ve uzaktan yüksek lisans hükmü olmadığı için C ve D de o metne göre sorunlu olurdu; bu, tek bir alternatif şık üretmez (soru eski metinle tek cevaplı değildir) ve soru yürürlükteki metni sorar. Çözümde “Not (geçiş hükmü)” olarak açıklandı.
- **18 (2026 değişikliği):** Disiplin Yönetmeliği md. 12/2’den 14/01/2026 tarihli RG ile internet sayfasında yayımlama ve yöresinde ilan ibaresi kaldırıldı; Bakanlığa duyuru ve Resmî Gazete ilanı yerinde. Cevabı etkilemez; çözümde Not olarak verildi.

## İptal edilen soru

Yok (cevap anahtarında İPTAL satırı ve sayfalarda iptal işareti yok).

## Baskı hataları, kitapçık notları ve kuşkular

- **02:** Kitapçık “bağlı olduğu odanın bilgisi dahilinde iş yeri açmak zorundadır” der. Bu ifade, 24/02/2025 değişikliğiyle SMMM Odaları Yönetmeliği md. 38’e konan cümlenin lafzıdır (RG metninde, `20250224-2.htm`, görüldü); o madde 14/01/2026 tarihli ve 33137 sayılı RG ile yürürlükten kaldırıldı (TÜRMOB konsolide metninde “Mülga madde”). Soruda adı geçen Çalışma Usul ve Esasları Yönetmeliği md. 14/1 “bağlı olduğu oda bilgisinde iş yeri açmak zorundadır” der. Anlam farkı yok; otuz günlük bildirim süresi iki metinde de aynı. Kitapçık yazımı korundu.
- **07:** Şıklar Yönetmeliği serbestçe aktarır: “Birlik” yerine “TÜRMOB”, “yapanların” yerine “mezunlarının”, alan listesi yerine “Yönetmelik’te sayılan alanlarda”; E doktora için diploma ve tez ibrazı şartını anmaz. Anlam ve sayılar değişmez.
- **08-A:** Şık md. 6/1-a’nın yalnız ilk yarısını aktarır (“mesleki faaliyetlerin yürütülmesinde gereken mesleki özeni göstermemek” kısmı yok); anlam değişmez.
- **11-E:** Şık Ek-1 md. 1/1-b’yi aktarır, yalnız “meslek mensuplarının” yerine “meslek mensubunun” der. “Yanlı veya önyargılı davranarak;” başlangıcı Yönetmeliğin kendi (devrik) ifadesidir; çözümde md. 8/1 ile anlamı açıklandı.
- **12:** Kitapçık Disiplin Yönetmeliği’nin “bir yıldan fazla” ifadesini kullanır; 3568 md. 48/c “bir yıldan çok” der. Anlam farkı yok.
- **15:** Kitapçık “Tezkiye (staj) not ortalaması” der; Yönetmelik “Yanında staj yapılan meslek mensubu tarafından verilen tezkiye not ortalaması” der. Anlam farkı yok.
- **Tuzaklar:** Mekanizması metinle doğrulanamayan yanlış şıklar için uydurma açıklama yazılmadı; “öngörülmüş bir süre/sayı değildir” denildi (02-A/C/E, 03-A/B, 04-C, 05-A, 17-D, 19-A/B/D). 02-B’deki 15 günün kaynağı (md. 14’te adres değişikliği bildirimi için 24/02/2025 öncesi süre, RG metninde “onbeş” → “otuz”), 05-E’nin kaynağı (3568 md. 34/1, Birlik Genel Kurulu eylül), 16-A/B/C’deki 15 ve 60’ın kaynağı (SMG Yön. md. 11/2), 17-C/E’nin kaynağı (3568 md. 21, oda yönetim kurulu büyüklükleri) ve 19-E’deki 250’nin kaynağı (3568 md. 15/1) metinde görüldü.

## Dayanak atıfları ve güven düzeyi

Kesin = hüküm metni bu çalışmada okunan konsolide metinde veya Resmî Gazete metninde kelime kelime görülerek yazıldı.

Kullanılan metinler (2026-1-MH çalışmasında 03/10/2026’da indirilen metinler yeniden kullanıldı; 2026-2 için ek indirmeler belirtildi):
- **3568 sayılı Kanun:** mevzuat.gov.tr `MevzuatMetin/1.5.3568.pdf`. İşlenmiş son değişiklikler 7546 sayılı Kanun (2025) ve Anayasa Mahkemesi’nin 12/2/2026 tarihli, E.2026/25 sayılı kararı (md. 10; yürürlük 23/6/2026). AYM kararı bu kitapçığın hiçbir sorusunun dayanağını etkilemez.
- **Yönetmelikler:** TÜRMOB konsolide metinleri, turmob.org.tr/Mevzuat/18/yonetmelikler. `2026Yonetm/` klasörü (14/01/2026 tarihli ve 33137 sayılı RG değişiklikleri işlenmiş): Çalışma Usul ve Esasları, SMMM Odaları, TÜRMOB, Disiplin, Sürekli Mesleki Geliştirme Eğitimi. `3568YASAYONETMELIK7NISAN2025/` klasörü (24/02/2025 değişiklikleri işlenmiş): Etik İlkeler, Haksız Rekabet ve Reklam Yasağı, Sınav, Staj, Ücret, Üye Aidatları. Liste sayfası 03/10/2026’da yeniden indirildi; 14/01/2026’dan sonraya ait yeni bir konsolide klasör yok.
- **Resmî Gazete metinleri:** 24/02/2025-32823 (resmigazete.gov.tr `20250224-1.htm` Çalışma Usul ve Esasları, `-2` SMMM Odaları, `-3` Staj, `-4` Haksız Rekabet ve Reklam Yasağı, `-6` Sınav değişiklikleri; 2026-2 için indirildi); 14/01/2026-33137 (değişiklik paketi, ismmmo.org.tr PDF’i). Staj Yönetmeliği md. 9/d’nin eski metni için TÜRMOB’un 2013 konsolide metni (`YONETMELIKLER-2_4_2013/12_SMMM_SM_STAJ_YONET.pdf`, 03/10/2026 indirildi).
- mevzuat.gov.tr’nin yönetmelik servisi kullanılamadı; yönetmelikler için TÜRMOB konsolide metinleri ve RG metinleri esas alındı. TÜRMOB metinleri her değişikliği RG tarih ve sayısıyla işaretler; atıf yapılan hükümlerin hiçbirinde 14/01/2026 sonrasına ait değişiklik notu yok. Ocak–Temmuz 2026 arası için yapılan sınırlı web taramasında bu yönetmeliklerde başka bir değişiklik bulunamadı (sınav takvimi ilanı dışında). Sınav tarihinde (25/07/2026) yürürlükteki metin bu metinlerdir.

Atıflar:
- **3568:** md. 4 (a–f), 5/A (a–d), 15/1 (250 ve 100), 17, 18, 19/h, 20/1 (ve “yılda bir defa” → “üç yılda bir” dipnotu), 21 (oda yönetim kurulu büyüklükleri), 31, 34/1, 35/1, 46, 48/c — kesin.
- **Ücret Yönetmeliği:** md. 11, 13, 15 — kesin.
- **Çalışma Usul ve Esasları Yönetmeliği:** md. 14 (açılış-kapanış 30 gün, adres değişikliği 30 gün, büro tescil 3 ay, vize 2 yıl, irtibat bürosu yasağı), 23/4, 26 — kesin. Odalar Yönetmeliği md. 38’in 2025 lafzı ve 2026’da yürürlükten kaldırılışı — kesin (RG metni ve konsolide metin).
- **SMMM Odaları Yönetmeliği:** md. 9/1 (ve 15 günlük çağrı cümlesi) — kesin.
- **TÜRMOB Yönetmeliği:** md. 10, 21/1 — kesin.
- **Staj Yönetmeliği:** md. 8 (3 yıl), 9/d-1, 2, 3, 27 (18 ay ek fıkrası), geçici md. 4; eski md. 9/d metni (2013 konsolide) — kesin.
- **Haksız Rekabet ve Reklam Yasağı Yönetmeliği:** md. 6/1 (a, d, f, h, i ve başlık), 7/1 (a, b, g ve başlık), 8 (başlık), 9, 10, 13/1–2, 19/1 — kesin.
- **Etik İlkeler Yönetmeliği Ek-1:** md. 1/1 (a–d), 3/1 (a–d), 8/1 — kesin.
- **Disiplin Yönetmeliği:** md. 4 (a–e), 5/a ve 5/i, 6/d ve 6/g, 12/2 (14/01/2026 değişikliği dahil) — kesin.
- **Sınav Yönetmeliği:** md. 16/a–b — kesin.
- **Sürekli Mesleki Geliştirme Eğitimi Yönetmeliği:** md. 11/1–5 — kesin.
- **Üye Aidatları ile Birlik Paylarının Tespitine Ait Yönetmelik:** md. 9 — kesin.
- Madde numarası verilmeden kural olarak yazılan hüküm yok. Olumsuz tespitler (ör. “7 asıl + 5 yedek diye bir yapı Kanunda yoktur”, “Oda Etik Kurulu bir oda organı değildir”, “Haksız Rekabet Kurulu bir Birlik organı değildir”) ilgili maddelerin (3568 md. 17, 21, 31, 35; TÜRMOB Yön. md. 10) tam metni okunarak yapıldı.

## Resmî sınav sonrası anahtar (TESMER, 20.08.2026)

Kaynak: `tools/pdfs/resmi-anahtar/2026-2_MH.pdf` (TESMER soru-cevap arşivi, `https://www2.tesmer.org.tr/files/ortak/soru_cevaplar/smmm/2026/2/07/smmm_2026_2_07.pdf`; A kitapçığı). Anahtar tablosu, sorulardaki kırmızı işaretli şıklar ve “Değerlendirme Dışı” damgaları okundu; tablo ile kırmızı işaretler 20 soruda birebir aynı. Uygulamadaki 20 soru metinle eşleştirildi: numara ve sıra aynı.

Sonuç: **fark yok.** 20 harfin hepsi uygulamadaki `dogru` alanıyla aynı; anahtarda İPTAL satırı yok.
