# İnceleme notları: 2026-1 Muhasebe Denetimi (2026-1-DEN)

Kaynak: `tools/pdfs/2026_1_muhasebe-denetimi.pdf` (TÜRMOB-TESMER SMMM 2026-1, A kitapçığı, 5 sayfa; soru sayfaları no. 5–9), sayfa görüntüleri `app/img/originals/2026-1-DEN-p1..p5.png`. 2026-1 kitapçıklarında cevap anahtarı tablosu yoktur; resmi cevap, kırmızı basılmış şıktan okundu. Kırmızı şıkların 20’si de ham `dogru` değeriyle aynıdır.

Yöntem: Her soru sayfa görüntüsünden yeniden yazıldı. Kökler, HTML’den arındırılıp NFC’ye normalleştirildikten sonra ham metinle (`tools/out/raw/2026-1-DEN.json`) betikle karşılaştırıldı (boşluklar hariç): 20 kökte fark yok. Şıklar ham metnin satır sonları birleştirilerek alındı ve görüntüyle tek tek karşılaştırıldı; heceleme bölünmesi yoktu. Her soru önce kural metninden bağımsız çözüldü, sonra kırmızı şıkla karşılaştırıldı: 20/20 eşleşme. İptal işareti yok; `iptal` hepsinde `false`, `cevapNotu` hepsinde `null`.

Kural kontrolü: Bütün hükümler birincil metinden kelime kelime doğrulandı (ayrıntı en altta):
- Bağımsız Denetim Yönetmeliği (BDY): mevzuat.gov.tr konsolide metni (`MevzuatMetin/yonetmelik/7.5.16907.pdf`; RG 26/12/2012-28509, son değişiklik RG 15/6/2024-32577 ve Danıştay 13. D. 6/4/2026 tarihli iptal notu dahil). KGK sitesindeki “Bagimsiz_Denetim_Yonetmeligi_Guncel.pdf” daha eski (2017 değişikliklerine kadar) olduğu için esas alınmadı; sorulan maddelerde iki metin arasında anlam farkı görülmedi.
- KGK’nın yayımladığı Türkçe TDS metinleri (kgk.gov.tr `Portalv2Uploads/files/Duyurular/v2/TDS/`): BDS 200 (TDS_2024_Seti, “kys değişiklikleri işlenmiş”), KYS 1 (TDS_2024_Seti, “KYS_1_600_degisiklikleri”), BDS 210 ve BDS 500 (TDS_2021_Seti).

Genel: Satır sonları birleştirildi. Tamamı kalın basılan kökler (02, 04–07, 09–20) ve 01, 03, 08’in kalın soru cümlesi `<strong>` ile korundu; altı çizili “yanlıştır” (04, 10, 11, 13, 15) ve “değildir” (05, 07, 16, 20) `<u>` ile işaretlendi. 12’deki “doğru” kitapçıkta altı çizili değildir; öyle bırakıldı. Kitapçıktaki tırnak biçimleri (“…’’ karışık kullanım: 08, 11, 12) ve yazımlar (imkanı/imkânı, eşdeğerine/eş değerine, ilâve) aynen korundu.

## Konu etiketleri

Muhasebe Denetimi için tanımlanan set (11 etiket). 2026-2-DEN dosyası tam olarak bu etiketleri kullanacaktır; 2026-1’de kullanılmayan iki etiket 2026-2 için ayrılmıştır. `konuBaglantisi` her soruda `konu` ile aynıdır.

| Etiket | Kapsam | 2026-1 soruları |
|---|---|---|
| Denetim kavramı ve unsurları | BDY md. 5–10: denetimin amacı, konusu, tarafları, kıstası, kanıtı, raporu (tanım düzeyinde) | 01, 03 |
| Yetkilendirme ve denetçilik şartları | BDY md. 11–18: denetim yapmaya yetkililer, yetki belgeleri, kuruluş ve denetçi yetkilendirmesi, kendi adına denetim üstlenme, uygulamalı mesleki eğitim, sınav, sicil | 02, 04, 14 |
| Etik ilkeler ve bağımsızlık | BDY md. 21–24 (etik ilkeler, bağımsızlık, reklam yasağı, haksız rekabet), Bağımsız Denetçiler İçin Etik Kurallar | 06, 07, 08 |
| Denetim faaliyeti ve kısıtlamalar | BDY md. 19–20, 25–28, 32–37: sürekli eğitim, üstlenilemeyecek denetimler ve rotasyon, denetim ekipleri, sorumlu denetçi, ücret, bildirim ve şeffaflık yükümlülükleri | 13, 15 |
| Denetim sözleşmesi ve ön şartlar | BDY md. 29 (sözleşme), BDS 210 (sözleşme şartları, denetimin ön şartları, kapsam sınırlaması) | 16, 17, 20 |
| Kalite yönetimi | KYS 1, KYS 2, BDS 220 (Revize) | 05, 09 |
| Genel amaçlar ve ilkeler | BDS 200: makul güvence, mesleki muhakeme, mesleki şüphecilik, denetçinin genel amaçları | 12 |
| Denetim riski ve önemlilik | BDS 200 risk tanımları ve önemlilik, BDS 315/330 risk değerlendirmesi, BDS 320 | 11, 18, 19 |
| Denetim kanıtı | BDS 500 ve devamı (kanıt, teyit, analitik prosedürler, yazılı beyanlar), örnekleme (BDS 530), çalışma kâğıtları (BDS 230) | 10 |
| İç kontrol ve hile | BDS 240 (hile), BDS 265 (iç kontrol eksikliklerinin bildirilmesi), iç kontrolün anlaşılması | (yok; 2026-2 için) |
| Denetçi raporu ve görüş | BDY md. 30–31, BDS 700/705/706/701, bilanço sonrası olaylar (BDS 560), süreklilik (BDS 570) | (yok; 2026-2 için) |

Sınır notları: 01 ve 03 BDY tanım maddeleri (md. 8, 9) olduğu için “Denetim kavramı ve unsurları”dadır; 10 ise kanıt hakkında BDS 500 ağırlıklı olduğu için “Denetim kanıtı”ndadır. 11 önemlilik (BDS 200 parag. 6) olduğu için “Denetim riski ve önemlilik”tedir. 08 (haksız rekabet, md. 24) etik ve meslek kuralları bölümünde olduğu için “Etik ilkeler ve bağımsızlık”tadır. 16 BDY sözleşme maddesi, 17 ve 20 BDS 210 olduğu için üçü “Denetim sözleşmesi ve ön şartlar”dadır. 13 (sorumlu denetçi, md. 28) ve 15 (md. 26) faaliyet kuralları olduğu için “Denetim faaliyeti ve kısıtlamalar”dadır; 14 (uygulamalı eğitim, md. 15) ise denetçi olma şartı olduğu için “Yetkilendirme”dedir.

## Soru bazında tablo

| No | Durum | Ham çıkarıma göre düzeltme | Bağımsız cevap | Kırmızı şık | Eşleşme |
|----|-------|----------------------------|----------------|-------------|---------|
| 01 | ok | Satır birleştirme; giriş paragrafı ve kalın soru cümlesi ayrı `<p>` | A (BDY md. 8: TMS, TTK, KGK) | A | evet |
| 02 | ok | Satır birleştirme; NFC (kalın metinde ö/ü ayrık yazılmıştı); kök tamamen kalın | A (BDY md. 11/3) | A | evet |
| 03 | ok | Satır birleştirme; giriş + kalın soru cümlesi | C (BDY md. 9/1) | C | evet |
| 04 | ok | NFC; kalın kök, altı çizili “yanlıştır” | E (BDY md. 14/3-b ve -d: sorumlu denetçi şartı, kendisi hariç en az bir sorumlu denetçi) | E | evet |
| 05 | ok | NFC; kalın kök, altı çizili “değildir” | B (KYS 1 parag. 6) | B | evet |
| 06 | ok | NFC; kalın kök | A (BDY md. 21/1) | A | evet |
| 07 | ok | NFC; kalın kök, altı çizili “değildir” | C (BDY md. 23/2 broşür serbest; diğerleri md. 22/3 ve 22/5) | C | evet |
| 08 | ok | NFC; alıntı paragrafı + kalın soru cümlesi; kapanış tırnağı ’’ aynen | B (BDY md. 24/1) | B | evet |
| 09 | ok | NFC; kalın kök | D (KYS 1 parag. 20(a)) | D | evet |
| 10 | ok | NFC; kalın kök, altı çizili “yanlıştır” | E (BDS 500 parag. A8) | E | evet |
| 11 | ok | NFC; kalın kök, altı çizili “yanlıştır”; tırnak “…’’ aynen | A (BDS 200 parag. 6) | A | evet |
| 12 | ok | NFC; kalın kök; tırnak “…’’ aynen | B (BDS 200 parag. 13(f)) | B | evet |
| 13 | ok | NFC; kalın kök, altı çizili “yanlıştır” | E (BDY md. 28/1 kıdemli denetçi veya başdenetçi unvanına sahip olmayı aramaz; tecrübenin en az 3/2 yılı fiilen denetçi, kıdemli denetçi veya başdenetçi unvanıyla geçmeli) | E | evet |
| 14 | ok | NFC; kalın kök; şıklar tek satır | C (BDY md. 15/1: 3 yıl) | C | evet |
| 15 | ok | NFC; kalın kök, altı çizili “yanlıştır” | D (BDY md. 26/1-b “bağımsızlığı zedeleyecek”; “görünürde tarafsızlık” yok) | D | evet |
| 16 | ok | NFC; kalın kök, altı çizili “değildir” | D (BDY md. 29/1-i) | D | evet |
| 17 | ok | NFC; kalın kök | A (BDS 210 parag. 7) | A | evet |
| 18 | ok | NFC; kalın kök | D (BDS 200 parag. 13(h)(ii)) | D | evet |
| 19 | ok | NFC; kalın kök; E’nin büyük harfli öğeleri aynen | E (BDS 200 parag. A48) | E | evet |
| 20 | ok | NFC; kalın kök, altı çizili “değildir” | C (BDS 210 parag. 6(b); raporlama denetçinin işi, BDS 265) | C | evet |

Ham çıkarım karakter düzeyinde doğruydu. Tek teknik düzeltme: kalın basılmış metinlerde ö ve ü harfleri ham dosyada “o/u + birleşik iki nokta (U+0308)” biçiminde ayrık kodlanmıştı; çıktı NFC’ye normalleştirildi (görünüm aynı, arama ve karşılaştırma için gerekli).

## Anahtar çelişkisi

Yok. `tools/allow-missing.txt` değiştirilmedi.

## Tartışmalı soru

Yok. Değerlendirilen tek nokta:

- **15:** “Görünürde tarafsızlığı zedeleyecek denetimleri üstlenemezler” (D) ifadesi, BDY md. 26/1-b’deki “bağımsızlığı zedeleyecek denetimler” bendinin terimi değiştirilmiş hâlidir. Şekilde bağımsızlık (md. 22/1-b) görünüşe ilişkin olduğundan D’nin geniş yorumla “doğru” sayılabileceği düşünülebilir; ancak bu okuma başka bir şıkkı yanlış yapmaz (A, B, C, E sırasıyla md. 26/1-d, -c, -ç, -e’nin neredeyse kelimesi kelimesine aynısıdır), yani sorunun cevabı olarak başka bir şık üretmez. Resmi cevap D tek savunulabilir cevaptır; çözümde “Not” adımıyla açıklandı.

## İptal edilen soru

Yok (sayfalarda iptal işareti yok).

## Baskı hataları, kitapçık notları ve kuşkular

- **08:** Kitapçıktaki alıntı, BDY md. 24/1’deki “diğer düzenlemelerde yer alan **haksız rekabet** halleri” ibaresini “diğer düzenlemelerde yer alan haller” diye kısaltmıştır (cevabı ele vermemek için olduğu anlaşılıyor). Aynen korundu; çözümün 1. adımında belirtildi. Kapanış tırnağı ’’ (iki kesme) olarak basılmıştır; aynen.
- **07 E:** Kitapçık “tam tasdik” der; BDY md. 22/5 “3568 sayılı Kanun çerçevesinde tasdik” der. Anlam farkı yok; tuzak açıklamasında belirtildi.
- **07 B:** Şık md. 22/3-a’nın eşler ve hısımlara ilişkin kısmını atlamıştır; yine de bağımsızlığı zedeleyen hâldir.
- **09 D:** “eşdeğerine … eş değerine” karışık yazımı KYS 1 parag. 20(a)’nın Türkçe metninde de aynıdır; aynen.
- **10:** Kök “KGK düzenlemeleri ve TDS’ye göre” der; C şıkkı BDS’den değil BDY md. 9/1’in ikinci cümlesinden alınmıştır. Çözümde kaynak olarak BDY gösterildi.
- **12 B:** Şıktaki “bağımsız denetim standartları” ibaresi, BDS 200’ün 2024 metnindeki “BDS’ler” kısaltmasının açık yazılışıdır.
- **15 E:** Şık “denetim kuruluşları ve denetim üstlenen bağımsız denetçiler … yürütmeleri mümkün olmayan” der; md. 26/1-e “denetim kuruluşunun veya denetçinin mevcut iş yükü sebebiyle sağlıklı bir şekilde yürütülmesi mümkün olmayan” der. Anlam aynı.
- **20 C:** Şık iç kontrol sorumluluğunu yalnız “hile kaynaklı” yanlışlığa bağlar; BDS 210 parag. 6(b)(ii) “hata veya hile kaynaklı” der. Bu, C’nin yanlışlığını pekiştiren ikinci unsurdur; çözümde belirtildi.
- **04 E:** İki ayrı sapma içerir (“denetçi olabilme” yerine “sorumlu denetçi olabilme”; “en az iki” yerine “kendisi hariç en az bir”). Çözümde ikisi de gösterildi ve “en az iki sorumlu denetçi” şartının denetim kuruluşlarına ait olduğu (md. 13/1-ğ) belirtildi.
- **Tuzaklar:** Mekanizması metinle doğrulanamayan yanlış şıklar için uydurma açıklama yazılmadı; “standartta/yönetmelikte böyle bir kural yoktur” denildi (09-C/E, 14-A/B, 17-B/C/D/E, 19-A/B). 14-D için yazılan açıklama (4 yıl, md. 15/3’teki eğitim süresi üst sınırıdır) metindeki gerçek bir hükümdür; adayın hatasının kaynağı olduğu iddia edilmedi.

## Dayanak atıfları ve güven düzeyi

Kesin = hüküm metni bu çalışmada indirilen birincil metinde görülerek yazıldı (yukarıdaki kaynaklar).

- **Bağımsız Denetim Yönetmeliği** md. 4/1-l (KAYİK), 4/1-t (TDS), 4/1-u (TMS), 8/1–8/2, 9/1, 11/2, 11/3, 12, 13/1-e, 13/1-ğ, 13/1-ı, 13/6, 14/3 (a–ğ bentleri), 15/1–15/4, 21/1–21/2, 22/1, 22/3 (a–ç), 22/5, 23/1–23/3, 24/1–24/2, 26/1 (a–e), 26/2, 27/5, 28/1 (a–c), 29/1 (a–i), 29/3, 29/4 — kesin (mevzuat.gov.tr konsolide metni).
- **KYS 1** parag. 6 (sekiz unsur), 20(a)–(c), 21 — kesin (KGK TDS_2024_Seti).
- **KYS 2** parag. 9 (kaliteyi gözden geçiren kişi denetim ekibinin üyesi değildir), 13(a)–(b) — kesin (KGK TDS_2024_Seti, “KYS_2_600_degisiklikleri”; düzeltme turu 1’de indirildi).
- **BDS 200** parag. 6, 13(b), 13(c), 13(e), 13(f), 13(g), 13(h)(i)–(ii), 13(i), A30, A31, A32, A35, A39, A47, A48, A49 — kesin (KGK TDS_2024_Seti, KYS değişiklikleri işlenmiş metin; A-paragraf numaraları bu sürüme göredir).
- **BDS 500** parag. 5(ç), A5, A8, A9 — kesin (KGK TDS_2021_Seti).
- **BDS 210** parag. 6(b)(i)–(iii), 7, 8, 19 — kesin (KGK TDS_2021_Seti; yürürlük 1/1/2018 ve sonrası dönemler).
- Paragraf numarası olmadan, yalnız standart adıyla anılanlar (metin bu çalışmada indirilmedi; kural genel ve iyi bilinen niteliktedir):
  - BDS 315: denetlenen işletmenin iç kontrol sisteminin “önemli yanlışlık” risklerinin belirlenmesinde anlaşılması (05) — güven: yüksek.
  - BDS 220 (Revize): sorumlu denetçinin yürüttüğü denetimin kalitesinden sorumluluğu (09-B) — güven: yüksek.
  - BDS 265: denetçinin tespit ettiği önemli eksiklikleri yazılı olarak üst yönetimden sorumlu olanlara ve yönetime, yönetimin dikkatini gerektiren diğer eksiklikleri yönetime bildirmesi (20) — güven: yüksek.
  - BDS 320: önemliliğin ayrıntılı düzenlendiği standart (11; kural BDS 200 parag. 6’dan verildi) — güven: yüksek.
  - BDS 330: müteakip prosedürlerin değerlendirilen risklere karşılık verecek şekilde tasarlanması (19-A) — güven: yüksek.
  - TTK md. 397/4 ve 399/4: yalnız BDY md. 29/1-a ve 29/4’ün atıf yaptığı hükümler olarak anıldı; içerikleri ayrıca açıklanmadı.
- Ders kitabı modeli “Denetim riski = Yapısal risk × Kontrol riski × Tespit edememe riski” (18, 3. adım) öğretim modeli olarak verildi; BDS 200 parag. A39’un denetçinin bileşenler arası ilişkiyi matematiksel terimlerle ifade eden bir model kullanabileceği hükmü ve parag. A35’in risk değerlendirmesinin kesin ölçüm konusu olmadığı ifadesiyle birlikte sunuldu.

## Düzeltme turu 1 (bağımsız inceleme sonrası)

- 13 `adimlar[1]` son cümlesi ve `ozet`: “unvan şartı yoktur” genellemesi düzeltildi. Kıdemli denetçi veya başdenetçi unvanına sahip olma şartı yoktur; ancak mesleki tecrübenin en az 3 (KAYİK) / 2 (diğer) yılı fiilen denetçi, kıdemli denetçi veya başdenetçi unvanıyla denetimde geçmelidir (BDY md. 28/1-a, -b). Kartlar kontrol edildi; aynı genelleme yok.
- 09 `tuzaklar.C`: “denetim sürecinde görev almayan” denetçinin KYS 2’deki kaliteyi gözden geçiren kişiyi çağrıştırdığı, bu kişinin denetim ekibi üyesi olmadığı (KYS 2 parag. 9) ve tek bir denetimi değerlendirdiği (parag. 13(a)-(b)), sistemin nihai sorumlusu olmadığı yazıldı. KYS 2 metni indirilerek doğrulandı.
- 06 `tuzaklar.E`: “Gizlilik” ve “mesleki davranış”ın Bağımsız Denetçiler İçin Etik Kurallar’daki adlar olduğu (E’nin tanıdık gelme sebebi) eklendi; mevcut açıklama korundu.
- 12 `tuzaklar.A` (“başına” → “sonuna … denetçinin yargısıdır”) ve `tuzaklar.E` (“sorgulayıcı” yerine “bağımsız ve tarafsız” yazılmış) ifadeleri düzeltildi.
- 07 `kartlar[1].arka`: “olağan dışı” → metindeki “olağan ekonomik ilişkiler dışında borç veya alacak ilişkisi”.
- 20 `adimlar[1]` ve `kartlar[1].arka`: BDS 265 kapsamı daraltıldı: önemli eksiklikler yazılı olarak üst yönetimden sorumlu olanlara ve yönetime; yönetimin dikkatini gerektiren diğer eksiklikler yönetime.
- 17 `adimlar[1]`: BDS 210 parag. 8 özeti düzeltildi: denetçi önce yönetimle müzakere eder; ön şart kabul edilebilir bir çerçevenin <em>kullanılması</em>dır; 8(a)’daki parag. 19 istisnası (mevzuatla belirlenen çerçeve) eklendi. Parag. 19 metinde görüldü.
- 10 `dayanak`: BDS 200 parag. A32 eklendi (E’nin ilk cümlesi bu paragrafın ifadesini izler; metinde görüldü).
- 18 `adimlar[2]` ve `dayanak`: matematiksel risk modeli için BDS 200 parag. A39 eklendi (metinde görüldü).
