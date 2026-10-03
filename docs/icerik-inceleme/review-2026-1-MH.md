# İnceleme notları: 2026-1 Meslek Hukuku (2026-1-MH)

Kaynak: `tools/pdfs/2026_1_meslek-hukuku.pdf` (TÜRMOB-TESMER SMMM 2026-1, “Muhasebecilik ve Mali Müşavirlik Meslek Hukuku”, A kitapçığı, 4 sayfa; sayfa no. 15–18), sayfa görüntüleri `app/img/originals/2026-1-MH-p1..p4.png`. 2026-1 kitapçıklarında cevap anahtarı tablosu yoktur; resmî cevap kırmızı basılmış şıktır. Kırmızı şıkların 20’si de ham `dogru` değeriyle aynıdır.

Yöntem: Her soru sayfa görüntüsünden yeniden yazıldı. 10, 11, 13 ve 14 ayrıca 170 dpi kırpımla kontrol edildi (kalın/düz ayrımı, tırnaklar, altı çizili ifadeler). Kökler ve şıklar HTML’den arındırılıp NFC’ye normalleştirildi, sonra betikle ham metinle (`tools/out/raw/2026-1-MH.json`) karşılaştırıldı (boşluklar hariç): 20 kökte ve 100 şıkta fark yok. Her soru önce birincil metinden (Kanun veya yönetmelik) bağımsız çözüldü, sonra kırmızı şıkla karşılaştırıldı: 20/20 eşleşme. İptal işareti yok; `iptal` hepsinde `false`, `cevapNotu` hepsinde `null`, ham `notlar` hepsinde boş.

Genel biçim: Satır sonları birleştirildi; tire ile bölünmüş kelime yoktu. Tamamı kalın basılan kökler `<strong>` ile korundu. 10’da açıklayıcı giriş düz, soru cümlesi kalın. 13 ve 14’te giriş ve Roma rakamlı öncüller düz (`<ul class="madde">`), soru cümlesi kalın. Altı çizili ifadeler `<u>` ile işaretlendi: “değildir” (01, 02, 03, 05, 06, 07, 08, 09, 10, 11, 12, 16), “yanlıştır” (14, 19), “en az” (18). 04, 13, 15, 17 ve 20’de altı çizili ifade yok. Kitapçığın yazımları aynen korundu: “Meslekî/meslekî” (02-E, 10), “Mesleki” (05-B/C), “ilâ” (20), 11’deki “genel şartları”ndan” tırnaklaması, 13’teki “----” boşlukları ve “alınmazlar”.

## Konu etiketleri

Meslek Hukuku için tanımlanan set (12 etiket). 2026-2-MH dosyası tam olarak bu etiketleri kullanacaktır; 2026-1’de kullanılmayan etiketler 2026-2 (ve sonraki dönemler) için ayrılmıştır. 2026-2 kitapçığının ham metni tarandı: 20 sorunun hepsi bu setle karşılanır (ücret yönetmeliği 1 → “Ücret ve sözleşme”, iş yeri açma 2 → “Ruhsat ve çalışma esasları”, staj 7 → “Staj ve sınav”, reklam ilkeleri 9 → “Haksız rekabet ve reklam” vb.). `konuBaglantisi` her soruda `konu` ile aynıdır.

| Etiket | Kapsam | 2026-1 soruları |
|---|---|---|
| Meslek mensubu olma şartları | 3568 md. 4, 5, 8, 9: genel ve özel şartlar, yabancılar, mesleğe kabul engelleri; ruhsat alma şartları | 11 |
| Staj ve sınav | Staj Yönetmeliği (staja giriş, staj süresi, stajdan sayılan hâller, tezkiye), Sınav Yönetmeliği (sınav konuları, başarı notu, süreler, itiraz), 3568 md. 6, 7, 10 ve TESMER | 13 |
| Sürekli mesleki geliştirme | 3568 md. 44 (mesleki geliştirme eğitimi), TÜRMOB Sürekli Mesleki Geliştirme Eğitimi Yönetmeliği: kredi yükümlülükleri, doğrulanabilir eğitim, diğer faaliyetler, yaptırım | 14 |
| Ruhsat ve çalışma esasları | Çalışma Usul ve Esasları Yönetmeliği: meslek kütüğü ve çalışanlar listesi, büro ve büro tescili, iş kabulü ve reddi, ortaklık büroları ve şirketler, defter-belge saklama ve iadesi, çalışanlar listesinden silinme, denetim çalışma esasları; kaşe ve tutulacak defterler yönetmelikleri | (yok) |
| Ücret ve sözleşme | 3568 md. 46, Ücret Yönetmeliği ve asgari ücret tarifesi; meslek mensubu ile müşteri arasındaki sözleşme (yapılması, asgari içeriği, feshi; Çalışma Usul ve Esasları Yönetmeliği md. 24–26) | 08 |
| Yasak haller | 3568 md. 43 (meslek sırları), md. 45 (yasaklar, reklam yasağı fıkrası) ve Çalışma Usul ve Esasları Yönetmeliği “Yasak Haller ve İstisnaları” bölümü (md. 42–47): meslekle bağdaşmayan hâller, ticari faaliyet yasağı, hizmet akdi yasağı, meslekle bağdaşan işler, YMM yakınlık yasakları | 02, 19 |
| Haksız rekabet ve reklam | Haksız Rekabet ve Reklam Yasağı Yönetmeliği: haksız rekabet hâlleri (md. 6–8), oda ve meslek mensubunun hakları, reklam ilke ve kuralları | 06, 12 |
| Etik ilkeler | Etik İlkeler Yönetmeliği ve Ek-1: temel ilkeler, kavramsal çerçeve, tehditler, önlemler, bağımsız ve bağımlı çalışanlar için özel durumlar, Etik Kurulu | 01, 05, 09, 10 |
| Disiplin cezaları ve usulü | 3568 md. 48–49, Disiplin Yönetmeliği: ceza türleri, cezayı gerektiren hâller, soruşturma ve kovuşturma, itiraz, kesinleşme ve ilan, zamanaşımı | 04, 15 |
| Odalar ve organları | 3568 md. 15–27, SMMM ve YMM Odaları Yönetmelikleri: kuruluş, gelirler, organlar, genel kurul, yönetim, disiplin ve denetleme kurulları, seçimler, aidatlar | 03, 07, 18, 20 |
| TÜRMOB ve organları | 3568 md. 28–40, TÜRMOB Yönetmeliği: Birliğin görevleri ve gelirleri, Birlik organları, mecburi meslek kararları, Birlik payı | 16, 17 |
| Mesleki sorumluluk ve VUK | 3568 md. 12 ve 47 (sorumluluk, görevle ilgili suçlar), VUK mükerrer 227, 340, 344, 359 gibi meslek mensubunu bağlayan vergi usul hükümleri, mesleki sorumluluk sigortası | (yok) |

Sınır notları: Oda ve Birlik gelirleri ilgili kuruluşun etiketine girer (03 → “Odalar ve organları”, 16 → “TÜRMOB ve organları”). 08 sözleşmenin asgari içeriğini sorduğu için, Çalışma Usul ve Esasları Yönetmeliği’nden olsa da “Ücret ve sözleşme”dedir. 02 ve 19 aynı yönetmeliğin “Yasak Haller ve İstisnaları” bölümünden oldukları için “Yasak haller”dedir. Disiplin cezasını soran sorular, cezası sorulan fiil başka bir alana ait olsa da (15’te aidat, reklam, ticari faaliyet) “Disiplin cezaları ve usulü”ndedir.

## Soru bazında tablo

| No | Durum | Ham çıkarıma göre düzeltme | Bağımsız cevap | Kırmızı şık | Eşleşme |
|----|-------|----------------------------|----------------|-------------|---------|
| 01 | ok | Satır birleştirme; kalın kök, altı çizili “değildir” | B (Ek-1 md. 21; hediye md. 24/1-ç yakınlık) | B | evet |
| 02 | ok | Satır birleştirme; kalın kök, altı çizili “değildir” | A (ÇUEY md. 42 a–e; A 3568 md. 46) | A | evet |
| 03 | ok | Kalın kök, altı çizili “değildir” | D (3568 md. 16; ruhsatname md. 30 Birlik geliri) | D | evet |
| 04 | ok | Kalın kök | B (Disiplin Yön. md. 28/1; 3568 md. 25) | B | evet |
| 05 | ok | Kalın kök, altı çizili “değildir” | D (Ek-1 md. 1/1: “Tarafsızlık”, “objektiflik” yok) | D | evet |
| 06 | ok | Satır birleştirme; kalın kök, altı çizili “değildir” | E (HRRY md. 8/1; E md. 6/1-f) | E | evet |
| 07 | ok | Kalın kök, altı çizili “değildir” | C (3568 md. 17) | C | evet |
| 08 | ok | Kalın kök, altı çizili “değildir” | C (ÇUEY md. 25) | C | evet |
| 09 | ok | Kalın kök, altı çizili “değildir” | A (Ek-1 md. 3/1; gizlilik temel ilke) | A | evet |
| 10 | ok | Düz giriş paragrafı + kalın soru cümlesi (ham metin tek blok); altı çizili “değildir” | E (Ek-1 md. 4/1) | E | evet |
| 11 | ok | Satır birleştirme; kalın kök, altı çizili “değildir” | D (3568 md. 4; sınav md. 5/A-c) | D | evet |
| 12 | ok | Satır birleştirme; kalın kök, altı çizili “değildir” | B (HRRY md. 7/1; B md. 6/1-d) | B | evet |
| 13 | tartışmalı | Düz giriş, Roma rakamlı öncüller `<ul class="madde">`, kalın soru cümlesi | C (Sınav Yön. md. 21/2–3); geçici md. 2 okumasıyla D | C | evet |
| 14 | ok | Düz giriş, Roma rakamlı öncüller `<ul class="madde">`, kalın soru cümlesi, altı çizili “yanlıştır” | C (SMG Yön. md. 11: 120 ve 60) | C | evet |
| 15 | ok | Satır birleştirme; kalın kök | A (Disiplin Yön. md. 5/h) | A | evet |
| 16 | ok | Satır birleştirme; kalın kök, altı çizili “değildir” | E (TÜRMOB Yön. md. 8/a: “brüt”) | E | evet |
| 17 | ok | Satır birleştirme; kalın kök | B (TÜRMOB Yön. md. 12/f; 3568 md. 33/f) | B | evet |
| 18 | ok | Kalın kök, altı çizili “en az” | E (Odalar Yön. md. 5; 3568 md. 15) | E | evet |
| 19 | ok | Satır birleştirme; kalın kök, altı çizili “yanlıştır” | A (ÇUEY md. 43, 47/b) | A | evet |
| 20 | ok | Kalın kök | C (Odalar Yön. md. 10; 3568 md. 21) | C | evet |

Kısaltmalar (yalnız bu tabloda): ÇUEY = Çalışma Usul ve Esasları Yönetmeliği; HRRY = Haksız Rekabet ve Reklam Yasağı Yönetmeliği; Ek-1 = Etik İlkeler Yönetmeliği’nin eki. Çözüm metinlerinde kısaltma kullanılmadı.

Ham çıkarım karakter düzeyinde doğruydu; düzeltmeler yalnız biçimseldir (satır birleştirme, kalın/düz ayrımı, altı çizili ifadeler, öncül listeleri).

## Anahtar çelişkisi

Yok. 20 sorunun hepsinde bağımsız çözüm kırmızı şıkla aynıdır. `tools/allow-missing.txt` değiştirilmedi.

## Tartışmalı sorular

- **13 (resmî C; diğer okuma D):** Sınav Yönetmeliği md. 21/2’deki SMMM sınav süresi 24/02/2025 tarihli ve 32823 sayılı RG ile “3 yıl”dan “2 yıl”a indirildi (değişiklik yönetmeliği md. 9, RG metninde görüldü). Aynı değişiklikle eklenen geçici md. 2’ye göre, bu tarihten önce oda nezdinde staj dosyası açtırmış ve staja giriş sınavını kazanmış olanlar hakkında md. 21/2’nin eski hükmü uygulanmaya devam eder. Bu adaylar için boşluklar 3, 3, 6 olur, yani D. TESMER’in açıklama notu da bunu teyit eder: “Sinav-Yonetmeligi-Degisikligi-Hakkinda-Aciklamalar-ve-Uygulama-Degisiklikleri.pdf”, madde 10. Altı aylık bekleme (md. 21/3) ve yılda 3 sınav değişmedi. Soru kökü md. 21’in yürürlükteki metnini aktardığı için resmî cevap C’dir. 2026 sınavlarına girenlerin önemli bir kısmının geçiş hükmü kapsamında olması beklendiğinden D’yi seçen aday savunulabilir bir okuma yapmış olur. Çözüm C’yi izler; 4. adım “Not (tartışmalı)” D’yi ve gerekçesini yazar, `tuzaklar.D` aynı noktaya gönderir.

## İptal edilen soru

Yok (sayfalarda iptal işareti yok).

## Baskı hataları, kitapçık notları ve kuşkular

- **13-III:** Kitapçık “alınmazlar” der, Yönetmelik md. 21/3 “alınamazlar” der. Anlam farkı yok; kitapçık yazımı korundu.
- **14:** Kitapçık “3 yıl” (rakam) yazar, Yönetmelik “üç yıl” der; anlam farkı yok. I ve II’deki 90 ve 45’in nereden geldiği (ör. md. 11’in 29/03/2023 öncesi metni) araştırılmadı; çözüm yalnız yürürlükteki 120 ve 60 ile karşılaştırır.
- **16-E:** Şık Birlik payını odaların “net” gelirlerine bağlar. TÜRMOB Yönetmeliği md. 8/a’daki ifade 16/05/2015 tarihli ve 29357 sayılı RG ile “gelir bütçelerinin” yerine “brüt gelirlerinin” olmuştur (RG metninde görüldü). “Net” ifadesi hiçbir sürümde yok. Şık bu yüzden yanlış aktarımdır ve cevaptır; A–D md. 8’in b, g, d, c bentlerinin aynısıdır.
- **01:** Ek-1 md. 46/1, müşteriden hediye kabul edilmesinin “objektiflik ilkesine yönelik kişisel çıkar tehdidi” oluşturabileceğini söyler. Soru md. 21’de “örnek olarak” sayılan durumları soruyor. A, C, D ve E md. 21’in aynısı, B ise md. 24/1-ç’de (yakınlık) sayılı olduğundan başka bir şık cevap olamaz; çözümde Not olarak açıklandı.
- **05:** Ek-1 md. 46/1 bir kez “objektiflik ilkesi” ifadesini kullanır; md. 1’deki beş temel ilkenin adı ise “Tarafsızlık”tır. A, B, C, E md. 1’deki adların aynısı olduğundan tek cevap D’dir. IESBA’daki “objectivity” karşılığı bilgisi madde numarası verilmeden, genel bilgi olarak yazıldı.
- **02:** A’daki fiil (asgari ücretin altında iş kabulü) 3568 md. 46’ya göre kanunen yasak olduğu için md. 42/d’nin genel ifadesine girdiği düşünülebilir. Soru md. 42’de “sayılan” hâlleri soruyor; B–E bentlerin aynısıdır. Çözümde Not olarak açıklandı.
- **12-C/D:** Şıklar md. 7/1-ç ve e’yi kısaltarak aktarır (“veya fatura”, “veya vaat etmek” yok); anlam değişmez.
- **19:** Md. 43’e 14/01/2026 tarihli ve 33137 sayılı RG ile limited şirket müdürlüğü ve anonim şirket yönetim kurulu üyeliği cümlesi (değişik) ve bağımsız yönetim kurulu üyeliği fıkrası (ek) geldi. İkisi de sınavdan (25/04/2026) önce yürürlüktedir ve cevabı etkilemez; çözümde Not olarak verildi.
- **Tuzaklar:** Mekanizması metinle doğrulanamayan yanlış şıklar için uydurma açıklama yazılmadı; “mevzuatta öngörülmüş bir sayı/süre değildir” denildi (04-C, 18-B/C/D, 20-E). 04-A’daki 15 günün kaynağı (3568 md. 24, istifa etmiş sayılma kararına itiraz) ve 20-A’daki 3’ün kaynağı (3568 md. 25, küçük odalarda disiplin kurulu) metinde görüldü. Adayın yanılgısının bunlardan kaynaklandığı iddia edilmedi, yalnız sayıların mevzuatta nerede geçtiği yazıldı.

## Dayanak atıfları ve güven düzeyi

Kesin = hüküm metni bu çalışmada indirilen konsolide metinde kelime kelime görülerek yazıldı.

Kullanılan metinler:
- **3568 sayılı Kanun:** mevzuat.gov.tr `MevzuatMetin/1.5.3568.pdf` (indirme 03/10/2026). Son işlenmiş değişiklik 27/3/2025 tarihli ve 7546 sayılı Kanun; dipnotlarda 2026 asgari ücret tarifesine atıf var.
- **Yönetmelikler:** TÜRMOB’un konsolide metinleri, turmob.org.tr/Mevzuat/18/yonetmelikler (indirme 03/10/2026):
  - `2026Yonetm/` klasöründen (14/01/2026 tarihli ve 33137 sayılı RG değişiklikleri işlenmiş): Çalışma Usul ve Esasları, SMMM Odaları, TÜRMOB, Disiplin, Sürekli Mesleki Geliştirme Eğitimi yönetmelikleri.
  - `3568YASAYONETMELIK7NISAN2025/` klasöründen (24/02/2025 tarihli ve 32823 sayılı RG değişiklikleri işlenmiş): Etik İlkeler, Haksız Rekabet ve Reklam Yasağı, Sınav, Staj, Ücret, Üye Aidatları ve Birlik Payları yönetmelikleri.
- **Resmî Gazete metinleri:** 14/01/2026-33137 (değişiklik paketi; ismmmo.org.tr’deki PDF), 24/02/2025-32823 (Sınav Yönetmeliği değişikliği, resmigazete.gov.tr `20250224-6.htm`), 16/05/2015-29357 (TÜRMOB Yönetmeliği değişikliği, `20150516-3.htm`). TESMER’in 2025 Sınav Yönetmeliği açıklama notu da okundu.
- mevzuat.gov.tr’nin yönetmelik arama servisi bu ortamdan yanıt vermedi; yönetmeliklerin mevzuat.gov.tr sürümleriyle ayrıca karşılaştırma yapılamadı. TÜRMOB metinleri her değişikliği RG tarih ve sayısıyla işaretler; atıf yapılan hükümlerin hiçbirinde 14/01/2026 sonrasına ait bir değişiklik notu yok. alomaliye.com’un 2026 Resmî Gazete özetlerinde Nisan–Temmuz 2026 arasında bu yönetmeliklere ait bir değişiklik bulunamadı (sınırlı tarama). Sınav tarihinde (25/04/2026) yürürlükteki metin bu metinlerdir.

Atıflar:
- **3568:** md. 4 (a–f), 5/A (a–d ve c’nin istisna paragrafı), 15/1, 16 (a–d ve indirim fıkrası), 17, 21, 24 (15 günlük itiraz cümlesi), 25 (3/5 üye; 30 günlük itiraz cümlesi), 30, 31, 33/d ve f, 38 (itirazların reddinin Bakanlık tasdikiyle kesinleşmesi), 45, 46, 48 (ceza türleri ve 7546 sayılı Kanun’la eklenen ruhsat kullandırma fıkrası) — kesin.
- **Etik İlkeler Yönetmeliği Ek-1:** md. 1/1 (a–d), 3/1 (a–d), 4/1 (a 1–6, b), 21/1 (a–f), 22–25 (başlık konuları), 24/1-ç, 46/1 — kesin. Ek-1’in kendi madde numarası vardır; kısım ve bölüm yapısı metinden doğrulandı.
- **Çalışma Usul ve Esasları Yönetmeliği:** md. 23, 24, 25 (a–e), 42 (a–e), 43 (14/01/2026 değişiklikleri dahil), 47/b — kesin.
- **Disiplin Yönetmeliği:** md. 4, 5/h, 6/b, d, f, g, r, t, 7/e, 21, 28/1 (14/01/2026 değişikliği dahil) — kesin.
- **Haksız Rekabet ve Reklam Yasağı Yönetmeliği:** md. 6/1-d ve f, 7/1 (a–ğ), 8/1 (a–f) — kesin.
- **Sınav Yönetmeliği:** md. 21/2–4, geçici md. 2; değişiklik yönetmeliği (RG 24/02/2025-32823) md. 9 ve 11 — kesin.
- **SMG Eğitimi Yönetmeliği:** md. 11/1–5, 13/1 — kesin.
- **TÜRMOB Yönetmeliği:** md. 8 (a–g; 16/05/2015 değişikliği RG metninde görüldü), 12 (a–h), 23/d, h, j, k, l — kesin.
- **SMMM Odaları Yönetmeliği:** md. 5, 6, 10 — kesin.
- **Üye Aidatları ile Birlik Paylarının Tespitine Ait Yönetmelik:** md. 8 — kesin.
- Madde numarası verilmeden kural olarak yazılanlar: 05’te IESBA’nın beş temel ilkesindeki “objectivity”nin bu Yönetmelikte “Tarafsızlık” adıyla yer alması (genel bilgi; cevabı taşımaz, cevap md. 1’in lafzına dayanır). 19’da komanditer ortağın sorumluluğunun koyduğu sermayeyle sınırlı, komandite ortağın sınırsız olduğu bilgisi (TTK genel bilgisi, madde numarası verilmedi; cevap ÇUEY md. 43 ve 47/b’ye dayanır).
