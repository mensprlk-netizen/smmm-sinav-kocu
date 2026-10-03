# İnceleme notları: 2026-2 Hukuk (2026-2-HUK)

Kaynak: `tools/pdfs/2026_2_hukuk.pdf` (TÜRMOB SMMM 2026-2, A kitapçığı, 4 sayfa; soru sayfaları no. 9–11, son sayfa “Hukuk Cevap Anahtarı” tablosu), sayfa görüntüleri `app/img/originals/2026-2-HUK-p1..p4.png`. Resmî cevap, kitapçığın son sayfasındaki cevap anahtarı tablosundan alındı (A kitapçığı sütunu): 1A 2C 3B 4E 5D 6A 7B 8D 9E 10A 11C 12B 13D 14E 15A 16C 17A 18E 19D 20C. 3. satır kırmızıyla “İPTAL” işaretlidir (doğru cevap sütununda B). Kitapçıkta kırmızı basılmış şıkların 20’si de tabloyla ve ham `dogru` değeriyle aynıdır; 3. soru kitapçıkta “Değerlendirme Dışı” damgalıdır.

Yöntem: Her soru sayfa görüntüsünden yeniden yazıldı. Kalın/düz ayrımı ve altı çizili kelimeler ayrıca PDF’ten (pymupdf: yazı tipi bayrakları ve alt çizgi çizimleri) betikle doğrulandı. Kökler ve şıklar HTML’den arındırılıp NFC’ye normalleştirildikten sonra betikle ham metinle (`tools/out/raw/2026-2-HUK.json`) karşılaştırıldı (boşluklar hariç): 20 kökte ve 100 şıkta fark yok. Her soru önce birincil kanun metninden bağımsız çözüldü, sonra anahtarla karşılaştırıldı: iptal edilmeyen 19 sorunun 19’unda eşleşme; iptal edilen 03’te bağımsız çözüm işaretli B’yi doğrular ama C’yi de yanlış ifade olarak bulur (bkz. “İptal edilen soru”).

Hukuki kontrol: Bütün kurallar mevzuat.gov.tr’nin güncel konsolide metinlerinden (`MevzuatMetin/1.5.<no>.pdf`; 2026-1-HUK çalışmasında indirilen, 2026 değişikliklerini içeren metinler) madde madde ve kelime kelime doğrulandı: 4857 İş K., 6098 TBK, 6102 TTK, 5510 SSGSS K., 2577 İYUK. Metinlerdeki 2026 değişiklikleri tarandı: İş K. (7573, 23/1/2026: geçici md. 12; 7578, 22/4/2026: md. 74), TBK (7589, 16/7/2026: md. 55’e eklenen fıkralar), 5510 (7577, 2/4/2026: md. 80; 7590, 24/7/2026: md. 81’de bir fıkra), İYUK (7588, 2/7/2026: md. 28/1’e cümle; 7589, 16/7/2026: md. 45–46). TTK’da 2026 değişikliği yok. Bu sorularda kullanılan maddelerden (İş K. 27, 41, 60, 63, 64, 76; TBK 30–32, 39, 72, 85, 87, 146–149, 162–163; TTK 54–55, 647–649, 831–832, 855, 1525–1526; 5510 md. 3, 4, 6; İYUK 6, 7, 20/A, 20/B, 28, 45, 46) yalnız İYUK md. 28/1 2026’da değişmiştir (7588: belirli personel gruplarına ilişkin kararların kesinleşmeden sonra uygulanması); 30 günlük kural ve 19’un cevabı etkilenmez, çözümde Not olarak verildi. Sınav tarihinde (25 Temmuz 2026) yürürlükteki metin ile bugünkü metin bu sorular bakımından aynıdır.

Genel: Satır sonları birleştirildi; tire ile bölünmüş kelime yoktu. Tamamı kalın basılan kökler (11 ve 18 dışındakiler) `<strong>` ile korundu. 11 ve 18’de giriş paragrafı düz, soru cümlesi kalın basılmıştır; ham metinde tek blok olan bu kökler iki `<p>` olarak yazıldı. Altı çizili “yanlıştır” (01, 03), “en fazla” (02), “değildir” (05, 12, 15, 16), “sayılmaz” (06) ve “yoktur” (09) `<u>` ile işaretlendi. 17 ve 19’daki “doğrudur”, 14’teki “sayılır” kitapçıkta altı çizili değildir; öyle bırakıldı. Kitapçığın yazımları (“imkanı”, “halükârda”, “hâlde”, “halinde”, “malûller”, “sanatkâr”, “Millî”, “merkezî”, “Kanun’da”, 13’teki “(a) ve (c) bendinde” ve “madde 3/12 bendi”) aynen korundu.

## Konu etiketleri

2026-1-HUK’ta tanımlanan 13 etiketlik set aynen kullanıldı; yeni etiket eklenmedi. 2026-1’de bu dosyanın 11. sorusu için ayrılan “Taşıma ve sigorta hukuku” etiketi kullanıldı. `konuBaglantisi` her çözümde `konu` ile aynıdır.

| Etiket | 2026-2 soruları |
|---|---|
| Ticari işletme ve tacir | 12 |
| Ticaret unvanı ve sicil | (yok) |
| Taşıma ve sigorta hukuku | 11 |
| Ticaret şirketleri: genel hükümler | (yok) |
| Şahıs şirketleri | (yok) |
| Anonim şirket | (yok) |
| Limited şirket | (yok) |
| Kıymetli evrak | 09, 10 |
| Borçlar: genel hükümler | 05, 06, 07, 08 |
| Borçlar: sözleşmeler | (yok) |
| İş hukuku | 01, 02, 03, 04 |
| Sosyal güvenlik | 13, 14, 15, 16 |
| İdari yargı | 17, 18, 19, 20 |

Sınır notları: 09’un dayanağı TTK md. 1526 “Son Hükümler” bölümündedir ve şıklarda fatura, sigorta poliçesi, makbuzlar da vardır; ancak sorunun öğrettiği kural kambiyo senetlerinin (poliçe, bono, çek) elektronik imzayla düzenlenemeyeceğidir, bu yüzden “Kıymetli evrak”tadır. 12 (haksız rekabet, TTK md. 54–55) etiketin kapsam tanımına göre “Ticari işletme ve tacir”dedir. 05 bir eser sözleşmesi alacağını da şık olarak içerse de TBK md. 146–147 Genel Hükümler kısmında olduğundan “Borçlar: genel hükümler”dedir.

## Soru bazında tablo

| No | Durum | Ham çıkarıma göre düzeltme | Bağımsız cevap | Resmî anahtar | Eşleşme |
|----|-------|----------------------------|----------------|---------------|---------|
| 01 | ok | Kalın kök, altı çizili “yanlıştır”; şıklarda satır birleştirme | A (İş K. md. 27/2: ücret ödenir) | A | evet |
| 02 | ok | Kalın kök, altı çizili “en fazla” | C (İş K. md. 63/1: 45 − 5 × 8 = 5) | C | evet |
| 03 | iptal | Kalın kök, altı çizili “yanlıştır”; `iptal: true`, `cevapNotu` yazıldı | B yanlış (md. 64/2: “yaptırılamaz”); C de yanlış (md. 64/1: “bu süre” dört aylık telafi süresidir) | B (İPTAL) | B ile uyumlu; soru iki cevaplı (çözüm yayımlandı) |
| 04 | ok | Kalın kök | E (İş K. md. 60, 63/3, 76) | E | evet |
| 05 | ok | Kalın kök, altı çizili “değildir”; şıklarda satır birleştirme | D (TBK md. 147’de yok → md. 146) | D | evet |
| 06 | ok | Kalın kök, altı çizili “sayılmaz”; şıklarda satır birleştirme | A (TBK md. 31/2) | A | evet |
| 07 | ok | Kalın kök, alıntı tırnakları aynen | B (TBK md. 162/1) | B | evet |
| 08 | ok | Kalın kök | D (TBK md. 146) | D | evet |
| 09 | ok | Kalın kök, altı çizili “yoktur”; “imkanı” aynen | E (TTK md. 1526/1) | E | evet |
| 10 | ok | Kalın kök | A (TTK md. 647/2, 648/2) | A | evet |
| 11 | ok | Düz giriş cümlesi + kalın soru cümlesi (ham metin tek blok) | C (TTK md. 855/5-a) | C | evet |
| 12 | ok | Kalın kök, altı çizili “değildir”; şıklarda satır birleştirme | B (TTK md. 55/1-a-10: “belirtmemek”) | B | evet |
| 13 | ok | Kalın kök; şıklarda satır birleştirme | D (5510 md. 3/1-12) | D | evet |
| 14 | ok | Kalın kök; şıklarda satır birleştirme | E (5510 md. 4/2-a; diğerleri md. 6/1-a, d, g, m) | E | evet |
| 15 | ok | Kalın kök, altı çizili “değildir”; şıklarda satır birleştirme | A (5510 md. 4/1-b-2; diğerleri md. 4/2-b, c, d, g) | A | evet |
| 16 | ok | Kalın kök, altı çizili “değildir” | C (5510 md. 3/1-4, 3/1-5) | C | evet |
| 17 | ok | Kalın kök; şıklarda satır birleştirme | A (İYUK md. 7/1) | A | evet |
| 18 | ok | Düz giriş paragrafı + kalın soru cümlesi (ham metin tek blok) | E (İYUK md. 6/5) | E | evet |
| 19 | ok | Kalın kök; şıklarda satır birleştirme | D (İYUK md. 28/1) | D | evet |
| 20 | ok | Kalın kök | C (İYUK md. 20/B/1-a) | C | evet |

Ham çıkarım karakter düzeyinde doğruydu; düzeltmeler yalnız biçimseldir (satır birleştirme, kalın/düz ayrımı, altı çizili ifadeler).

## İptal edilen soru

**03 (Telafi çalışması, İş K. md. 64).** Cevap anahtarı tablosunda 3. satır kırmızıyla “İPTAL” işaretli, doğru cevap sütununda “B” yazılı; kitapçıkta B kırmızı ve soru “Değerlendirme Dışı” damgalı. `iptal: true`, `dogru: "B"`, `cevapNotu` iptali ve muhtemel gerekçeyi açıklar.

Bağımsız çözüm (İş K. md. 64, konsolide metin; 1. fıkra 7226 sayılı Kanun’la değişik, dipnot 19: “iki” → “dört”):
- A: md. 64/2 (“günlük en çok çalışma süresini aşmamak koşulu ile günde üç saatten fazla olamaz”). Doğru.
- B: md. 64/2 “Tatil günlerinde telafi çalışması yaptırılamaz.” Şık “yaptırılabilir” der. **Yanlış.**
- C: md. 64/1 “Cumhurbaşkanı bu süreyi iki katına kadar artırmaya yetkilidir.” “Bu süre”, hemen önceki cümledeki “dört ay içinde” ifadesindeki telafi süresidir. Şık yetkiyi “çalışılmayan süreyi” artırmak diye aktarır. **Yanlış** (kanunun lafzına ve anlamına aykırı).
- D: md. 64/1 (işçinin talebiyle izin; dört ay). Doğru.
- E: md. 64/1 son cümle (fazla çalışma veya fazla sürelerle çalışma sayılmaz). Doğru.

Sonuç: Bağımsız çözüm işaretli B ile uyumludur (B açıkça yanlış ifadedir), ancak C de yanlıştır; soru iki cevaplıdır. Muhtemel iptal gerekçesi budur (resmî gerekçe yayımlanmadı). 2026-2-FTA-06 örneğindeki gibi çözüm yayımlandı: `sonuc: "B"`, özet iptali söyler, 1. adım iptali, 3. adım her şıkkı, 4. adım muhtemel gerekçeyi açıklar; `tuzaklar.C` C’nin de yanlış olduğunu yazar. `tools/allow-missing.txt` değiştirilmedi.

## Anahtar çelişkisi

Yok. İptal edilmeyen 19 sorunun hepsinde bağımsız çözüm resmî anahtarla aynıdır.

## Tartışmalı sorular

Yok. 18’de E şıkkının iki aşamayı birleştirmesi (aşağıda) ikinci bir savunulabilir cevap doğurmaz; diğer dört şıkkın sonucu md. 6/5’te hiç yer almaz.

## Baskı hataları, kitapçık notları ve kuşkular

- **18 E:** “Dosya işlemden kaldırılır, dava açılmamış sayılır.” md. 6/5’i kısaltır: önce bildirim bir kez daha tekrarlanır; süresinde tamamlanmazsa dosya işlemden kaldırılır; dava açılmamış sayılma kararı ancak işlemden kaldırma kararının tebliğinden itibaren üç ay içinde yenileme istenmezse verilir. Çözümde “Not (şıkkın kısaltması)” adımıyla açıklandı; md. 6/4 (eksik harç/posta ücretiyle açılan dava: doğrudan açılmamış sayılma) ile farkı ayrı adımda verildi.
- **11 kök:** Kanun (md. 855/5) pervasızlık için “böyle bir zararın meydana gelmesi ihtimalinin bilinciyle” davranılmasını da arar; kök bu unsuru yazmaz. Soru bu hükmü hedeflediği için cevap etkilenmez; çözümde Not olarak belirtildi.
- **09 kök:** “elektronik imza” der; kanun terimi “güvenli elektronik imza”dır (md. 1526/1). “imkanı” şapkasız basılmış, aynen korundu. Şıklardaki “tahsilat/tediye makbuzu”, md. 1526/1’deki “makbuz senedi” (umumi mağaza senedi, md. 831–832) ile karıştırılmaması için çözümde ayrı adım yazıldı.
- **12 A ve D:** Şıklar md. 55/1-a-7 ve a-3’ü kısaltarak aktarır (A: kanunda “sunumun gerçek değeri”, şıkta “ürünün”; D: kanunda “sahipmişçesine hareket ederek müstesna yeteneğe malik bulunduğu zannını uyandırmaya çalışmak”, şıkta “sahipmişçesine göstermek”). Anlam aynıdır; ikisi de haksız rekabet hâlidir.
- **14 A:** md. 6/1-m’yi kısaltır (kanun, görevlendirmenin Gençlik ve Spor Bakanlığı, Spor Genel Müdürlüğü, TFF veya bağımsız spor federasyonlarınca yapılan faaliyetlerde olmasını arar). Çözümde tam metin verildi; cevabı etkilemez.
- **15 B:** md. 4/2-b’yi kısaltır (“film, tiyatro, sahne, gösteri, ses ve saz sanatçıları” yerine “sanatçılar”). Cevabı etkilemez.
- **13 kök:** “(a) ve (c) bendinde” ve “madde 3/12 bendi” yazımı kitapçıktaki gibi korundu (kanunda md. 3/1-12, “(a) ve (c) bendi kapsamında”).
- **07 D:** “Müşterek borç” TBK’da düzenlenmiş bir borç türü değildir (TBK metninde “müşterek” kelimesi borç türü olarak geçmez; betikle arandı). Tuzak açıklamasında öğretiye ilişkin bir tanım uydurulmadı; yalnız kökteki tanımın md. 162/1’e ait olduğu söylendi.
- **Tuzaklar:** Mekanizması metinle doğrulanamayan yanlış şıklar için “kanunda böyle bir süre/kural yoktur” denildi (02-A/B, 08-B/E, 11-B/D, 18-D).

## Dayanak atıfları ve güven düzeyi

Kesin = hüküm metni mevzuat.gov.tr konsolide metninde kelime kelime görülerek yazıldı. Fıkra numaraları PDF’deki paragraf girintilerinden sayıldı.

- **İş K. (4857):** md. 27/1–3, 41/1, 60, 63/1–3, 64/1–2 (dipnot 19: 7226 sayılı Kanun’la “iki” → “dört”), 76/1–2 — kesin.
- **TBK (6098):** md. 30, 31/1 (1–5) ve 31/2, 32, 39, 72/1, 85/2, 87, 146, 147 (1–6), 148, 149, 162/1–2, 163 — kesin. TBK’da “müşterek” ve “bölünebilir” kelimelerinin borç türü olarak geçmediği metin taramasıyla doğrulandı.
- **TTK (6102):** md. 54/2, 55/1 (a-3, a-4, a-7, a-10, c-1 ve a–f başlıkları), 647/1–2, 648/2, 649, 831/2, 832/1, 855/1, 855/2, 855/5, 1525/1, 1526/1–3; md. 855’in Dördüncü Kitapta, md. 1526’nın “Son Hükümler”de olduğu — kesin.
- **5510:** md. 3/1-3, 3/1-4, 3/1-5, 3/1-8, 3/1-12, 3/1-13, 4/1 (a, b-2, c), 4/2 (a–g ve İŞKUR’un işveren sayılmaması), 6/1-a, d, g, k, m ve son cümle — kesin.
- **İYUK (2577):** md. 6/4, 6/5, 6/6, 7/1–2, 20/A/2-a, 20/B/1 (a, c, ç, e, f, ğ, ı) ve 20/B/2, 28/1 (7588 sayılı Kanun’la eklenen cümle dahil), 28/3, 28/4, 45/1, 46/1 — kesin. İYUK’taki dava açma sürelerinin (md. 7: 60/30, md. 20/A: 30, md. 20/B: 10) taranması metin aramasıyla yapıldı.
- Madde numarası verilmeden kural olarak anlatılanlar: 16’da işsizlik sigortasının 4447 sayılı İşsizlik Sigortası Kanunu’nda düzenlenmesi (kanun adı; madde verilmedi); 04 tuzaklarında sendikaların toplu iş sözleşmesine taraf olması ve diğer kurumların genel görev alanları; 18 tuzaklarında esastan ret ve yürütmenin durdurulmasının genel tanımları; 03’te “bu süre”nin dört aylık telafi süresini ifade ettiği yorumu (lafız: md. 64/1’in ardışık cümleleri; resmî gerekçe ayrıca indirilmedi). Hiçbiri bir cevabı tek başına taşımaz; 03’teki yorum iptal gerekçesi açıklamasıdır.
