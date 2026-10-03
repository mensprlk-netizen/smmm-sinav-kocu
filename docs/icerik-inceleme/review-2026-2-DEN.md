# İnceleme notları: 2026-2 Muhasebe Denetimi (2026-2-DEN)

Kaynak: `tools/pdfs/2026_2_muhasebe-denetimi.pdf` (TÜRMOB SMMM 2026-2, A kitapçığı, 6 sayfa; soru sayfaları no. 6–10, son sayfa resmî “Muhasebe Denetimi Cevap Anahtarı” tablosu), sayfa görüntüleri `app/img/originals/2026-2-DEN-p1..p6.png`. Resmî cevap, kitapçığın son sayfasındaki cevap anahtarı tablosundan okundu (A kitapçığı sütunu): 1-A, 2-C, 3-D, 4-B, 5-E, 6-B, 7-D, 8-A, 9-D, 10-B, 11-A (İPTAL), 12-C, 13-E, 14-B, 15-D, 16-E, 17-A, 18-E, 19-A, 20-C. Kırmızı basılmış şıklar ve ham `dogru` değerleri tabloyla 20/20 aynıdır. Belirsiz noktalar (11’in damgalı kökü, 20’nin ilk satırı, 6/9/11’deki “doğrudur”un altı çizili olup olmadığı) pymupdf ile 200 dpi kırpılarak ayrıca kontrol edildi.

Yöntem: Her soru sayfa görüntüsünden yeniden yazıldı; kökler ve şıklar HTML’den arındırılıp NFC’ye normalleştirildikten sonra betikle ham metinle (`tools/out/raw/2026-2-DEN.json`) karşılaştırıldı (boşluklar hariç): 20 kökte ve 100 şıkta fark yok. Her soru önce birincil kural metninden bağımsız çözüldü, sonra anahtarla karşılaştırıldı: iptal edilmeyen 19 sorunun 19’unda eşleşme. 11 için bkz. “İptal edilen soru”.

Kural kontrolü: Bütün hükümler birincil metinden kelime kelime doğrulandı (ayrıntı en altta):
- Bağımsız Denetim Yönetmeliği (BDY): mevzuat.gov.tr konsolide metni (2026-1-DEN çalışmasında indirilen `bdy_mev.pdf`; RG 26/12/2012-28509, son değişiklik RG 15/6/2024-32577 ve Danıştay 13. D. 6/4/2026 tarihli iptal notu dahil). md. 36/5 (beş yıl) KGK sitesindeki eski güncel metinde de aynıdır.
- KGK’nın yayımladığı Türkçe TDS metinleri, “TDS 2025 Seti” dosyaları (kgk.gov.tr `Portalv2Uploads/files/Duyurular/v2/TDS/TDS_2025_Seti/`; KGK sitesinde “TDS 2026 Seti” sayfası da aynı dosyaları gösterir): Bağımsız Denetçiler İçin Etik Kurallar (11.08.2025), KYS 2, BDS 200, BDS 210, BDS 240, BDS 265, BDS 580. Paragraf numaraları bu metne göredir. (Not: 2026-1-DEN dosyası BDS 200’ü 2024 setinden aldı; bağımsız incelemeye göre parag. 5, 6, 12, 17, A35–A37 ve A39 2024 ve 2025 metinlerinde aynı numara ve içeriktedir.)

Genel: Satır sonları birleştirildi; heceleme bölünmesi yoktu. Tamamı kalın basılan kökler `<strong>` ile, giriş paragrafı düz basılan kökler (03, 05, 07, 13, 14, 20) ayrı `<p>` + kalın soru cümlesi olarak yazıldı; 10’da kalın giriş, düz alıntı ve kalın soru cümlesi üç ayrı `<p>`. Altı çizili “yanlıştır” (02, 03, 04, 08, 12, 17, 19), “değildir” (16) ve “en uygun” (14) `<u>` ile işaretlendi. 06, 09, 11 ve 18’deki “doğrudur”, 20’deki “en iyi” kitapçıkta altı çizili değildir; öyle bırakıldı. 18’in dört öncülü `<ul class="madde">` listesidir. Kitapçıktaki tırnak biçimleri (01 “…”; 10 “…’’), yazımlar (plânlama, dâhil/dahil, arzeden, nispî, kağıdı) aynen korundu.

## Konu etiketleri

2026-1-DEN’de tanımlanan 11 etiketlik set aynen kullanıldı; yeni etiket eklenmedi. 2026-1’de 2026-2 için ayrılan iki etiket (“İç kontrol ve hile”, “Denetçi raporu ve görüş”) bu dosyada kullanıldı. `konuBaglantisi` her çözümde `konu` ile aynıdır.

| Etiket | 2026-2 soruları |
|---|---|
| Denetim kavramı ve unsurları | 01, 02, 03, 07 |
| Yetkilendirme ve denetçilik şartları | 04, 05, 06, 08 |
| Etik ilkeler ve bağımsızlık | 13, 14 |
| Denetim faaliyeti ve kısıtlamalar | 09, 11 |
| Denetim sözleşmesi ve ön şartlar | 16 |
| Kalite yönetimi | 12 |
| Genel amaçlar ve ilkeler | 15 |
| Denetim riski ve önemlilik | 17 |
| Denetim kanıtı | 18 |
| İç kontrol ve hile | 19, 20 |
| Denetçi raporu ve görüş | 10 |

Sınır notları: 01 (kilit yönetici, BDY md. 4/1-m) bir BDY tanım maddesi olduğundan “Denetim kavramı ve unsurları”na kondu; bu etiketin belgelenen kapsamı (review-2026-1-DEN.md) md. 4–10 olarak güncellendi (yeni etiket açılmadı). 07 (denetim raporu tanımı, md. 10) kapsam tablosunda md. 4–10 aralığında olduğu için “Denetim kavramı ve unsurları”ndadır; 10 ise görüş türlerini (md. 30) sorduğu için “Denetçi raporu ve görüş”tedir. 08 (sicil, md. 17) etiket kapsamındaki “sicil” nedeniyle “Yetkilendirme”dedir. 09 (denetim ekipleri, md. 27) ve 11 (şeffaflık raporu, md. 36) faaliyet ve şeffaflık yükümlülükleri olduğu için “Denetim faaliyeti ve kısıtlamalar”dadır. 18 (yazılı beyanlar, BDS 580) etiket kapsamındaki “yazılı beyanlar” nedeniyle “Denetim kanıtı”ndadır. 20 (iç kontrol eksikliği, BDS 265) ve 19 (BDS 240) “İç kontrol ve hile”dedir.

## Soru bazında tablo

| No | Durum | Ham çıkarıma göre düzeltme | Bağımsız cevap | Resmî anahtar | Eşleşme |
|----|-------|----------------------------|----------------|---------------|---------|
| 01 | ok | Satır birleştirme; kök tamamen kalın | A (BDY md. 4/1-m) | A | evet |
| 02 | ok | Satır birleştirme; kalın kök, altı çizili “yanlıştır” | C (BDY md. 5/2: makul, “tam” değil) | C | evet |
| 03 | ok | Düz giriş + kalın soru cümlesi, altı çizili “yanlıştır” | D (BDY md. 8/1: TMS ve TTK) | D | evet |
| 04 | ok | Kalın kök, altı çizili “yanlıştır” | B (BDY md. 14/3-b: sorumlu denetçi olabilme şartı) | B | evet |
| 05 | ok | Düz paragraf (boşluklar “(i)_____” aynen) + kalın soru cümlesi | E (BDY md. 15/1–2) | E | evet |
| 06 | ok | Kalın kök | B (BDY md. 15/3) | B | evet |
| 07 | ok | Düz paragraf + kalın soru cümlesi | D (BDY md. 10) | D | evet |
| 08 | ok | Kalın kök, altı çizili “yanlıştır” | A (BDY md. 17/3: gayri faal, silinmez) | A | evet |
| 09 | ok | Kalın kök; C’deki çift boşluk (“ilgili  aşamalarında”) teke indirildi | D (BDY md. 27/3) | D | evet |
| 10 | ok | Kalın giriş + düz alıntı (“…’’ aynen) + kalın soru cümlesi | B (BDY md. 30/2-ç) | B | evet |
| 11 | iptal | Kalın kök; `iptal: true`, `cevapNotu` yazıldı | Yazıldığı hâliyle tek cevap yok: A yanlış (md. 36/5 beş yıl), B–E doğru; kök “yanlıştır” olsaydı A | A (İPTAL) | — (çözüm yayımlanmadı) |
| 12 | ok | Kalın kök, altı çizili “yanlıştır” | C (KYS 2 parag. 8, 13) | C | evet |
| 13 | ok | Düz giriş cümlesi + kalın soru cümlesi | E (Etik Kurallar parag. 100.1) | E | evet |
| 14 | ok | Düz paragraf + kalın soru cümlesi, altı çizili “en uygun” | B (Etik Kurallar parag. 111.1 U1) | B | evet |
| 15 | ok | Kalın kök | D (BDS 200 parag. 5, 13, 17) | D | evet |
| 16 | ok | Kalın kök, altı çizili “değildir” | E (BDS 210 parag. 6(b); iç denetçiler parag. A26) | E | evet |
| 17 | ok | Kalın kök, altı çizili “yanlıştır” | A (BDS 200 parag. A35) | A | evet |
| 18 | ok | Dört öncül `ul.madde` + kalın soru cümlesi | E (BDS 580 parag. 3, 4, 7) | E | evet |
| 19 | ok | Kalın kök, altı çizili “yanlıştır” | A (BDS 240 parag. 8) | A | evet |
| 20 | ok | Düz paragraf + kalın soru cümlesi | C (BDS 265 parag. 6) | C | evet |

Ham çıkarım karakter düzeyinde doğruydu; düzeltmeler yalnız biçimseldir (satır birleştirme, paragraf/kalın/altı çizili ayrımı, öncül listesi, 09-C’deki çift boşluk).

## İptal edilen soru

**11 (Şeffaflık raporu, BDY md. 36).** Cevap anahtarı tablosunda 11. satır kırmızıyla “İPTAL” işaretli, doğru cevap sütununda “A” yazılı; kitapçıkta A kırmızı ve soru “Değerlendirme Dışı” damgalı. `iptal: true`, `dogru: "A"`, `cevapNotu` iptali ve muhtemel gerekçeyi açıklar.

Bağımsız çözüm (BDY md. 36, mevzuat.gov.tr konsolide metni; KGK’nın eski güncel metninde de aynı):
- A: “… ayrı ayrı **dört** yıl süreyle kamunun erişimine açık tutulur.” → md. 36/5 “**beş** yıl” der. **Yanlış.**
- B: md. 36/1’in ilk kısmı (takvim yılını / hesap dönemi kapanışını müteakip dördüncü ayın sonuna kadar KGK’ya bildirim). Doğru (yayımlama yükümlülüğünü söylemese de yanlış bir şey söylemez).
- C: md. 36/1’in son kısmı (kendi internet sitelerinde yayımlar). Doğru.
- D: md. 36/2 (yönetim organı başkanı imzalar). Doğru.
- E: md. 36/4’ün aynısı. Doğru.

Kök “doğrudur” diye sorduğu hâlde dört doğru ifade vardır ve anahtardaki A tek yanlış ifadedir. Muhtemel gerekçe (resmî gerekçe yayımlanmadı): kökün “yanlıştır” olması amaçlanmış ama “doğrudur” basılmıştır; “yanlıştır” okunuşunda cevap A’dır. Bağımsız çözüm, yazıldığı hâliyle işaretli harfi (A) vermediği için, görev kuralı gereği çözüm **yayımlanmadı** ve `2026-2-DEN-11` açıklama satırıyla `tools/allow-missing.txt`’ye eklendi (validator “UYARI: çözüm yok (izinli istisna)” verir). Öğretici içerik `cevapNotu`’nda yer alır (uygulamada rozet olarak görünür). Kullanıcı isterse, “kök yanlıştır diye okunursa” çerçevesiyle A’yı açıklayan bir çözüm eklenebilir.

## Anahtar çelişkisi

Yok (iptal edilmeyen 19 soruda 19/19 eşleşme).

## Tartışmalı soru

Yok. Değerlendirilen noktalar:
- **06 D ve C:** D, md. 15/4’ün ikinci cümlesinin yapısını korur ama “denetçi yardımcısı” yerine “denetçi” der; C de eğitim alanları “denetçi” diye anar. Terim değişikliği esaslıdır: uygulamalı eğitimi tamamlamak denetçi olmanın şartıdır (md. 14/1-d), eğitim alan kişi henüz denetçi değildir. B ise md. 15/3’ün iki cümlesinin aynısıdır. Başka bir okuma başka bir şık üretmez.
- **13 B:** “Denetçi etik kurallara uymak zorundadır” genel olarak doğrudur, ama kökün sorduğu (mevzuat daha kısıtlayıcıysa) durumda parag. 100.1 açıkça mevzuata uymayı ister; E bu kuralın aynısıdır.
- **11 B:** Yayımlama yükümlülüğünü atladığı için eksiktir ama yanlış değildir (iptal tartışmasında B’yi “yanlış” sayan bir okumayla bile soru en az üç doğru şık içerir).

## Baskı hataları, kitapçık notları ve kuşkular

- **11:** Kök “doğrudur” der; dört doğru şık vardır, anahtardaki A tek yanlış ifadedir (bkz. yukarı). Soru iptal edildi.
- **05:** Kökte iki boşluk ((i), (ii)) varken soru cümlesi “bu ifadedeki boşluğu” (tekil) der. Ayrıca kitapçık “aynı Kanunda yer alan kamu kurum ve kuruluşları” der; md. 15/1 “aynı Kanunun 6 ncı maddesinin ikinci fıkrasında yer alan” der. Anlam farkı yok; aynen korundu.
- **03 A ve C:** “Türk Ticaret Kanunu ve ilgili mevzuat dışında diğer mevzuat” ibaresi md. 8’deki “diğer mevzuat”ın açıklamasıdır; çözümde belirtildi.
- **07:** Kök “Kurum düzenlemelerine” yerine “KGK düzenlemelerine” der; anlam aynı.
- **08 C:** Şık “Resmi Kayıt Sicili” der; yönetmelikteki ad “Bağımsız Denetim Resmi Sicili”dir (dördüncü bölüm başlığı). Tuzak açıklamasında belirtildi.
- **09 C:** “ilgili  aşamalarında” çift boşluk; HTML’de teke indirildi. Şık ayrıca md. 27/3’teki “herhangi bir aşamasında” ibaresini “ilgili aşamalarında” diye değiştirmiştir.
- **09 E:** “baş denetçi” (iki kelime) kitapçıktaki gibi; yönetmelikte “başdenetçi”.
- **15 C:** “arzeden” bitişik yazım aynen.
- **20:** İlk satır (“Bağımsız Denetim Standartları kapsamında;”) sonrasında boşluk çizgisinin alt satıra geçmesi satır kaydırmasıdır; tek paragrafta birleştirildi.
- **Tuzaklar:** Mekanizması metinle doğrulanamayan yanlış şıklar için uydurma açıklama yazılmadı; “tanımda yoktur”, “BDS’lerde tanımlanmış bir terim değildir” denildi (01-C/D, 13-C, 14-C, 20-B/D). 13-A için verilen açıklama (düzenleyici kuruma danışmanın Etik Kurallar parag. 100.6 U3’te başka bir durum için önerilmesi) metinde görülen gerçek bir hükümdür. 05-B ve 05-D’de 10 yılın md. 28/1-b’deki sorumlu denetçi tecrübesi olduğu bir hüküm olarak belirtildi; adayın hatasının kaynağı olduğu iddia edilmedi.

## Dayanak atıfları ve güven düzeyi

Kesin = hüküm metni bu çalışmada indirilen (veya 2026-1-DEN çalışmasında indirilip yeniden açılan) birincil metinde görülerek yazıldı.

- **Bağımsız Denetim Yönetmeliği** md. 4/1-m, 4/1-t, 4/1-u, 4/1-y, 5/1–5/4, 8/1–8/2, 10/1, 11/2, 13/1-ğ, 13/1-i, 14/1-d, 14/3 (a–ğ), 15/1–15/4, 17/1–17/4, 21/1, 22/3-a, 26/3, 27/1, 27/3–27/6, 28/1, 29/1, 30/2 (a–ç), 35/3, 36/1, 36/2, 36/4, 36/5 — kesin (mevzuat.gov.tr konsolide metni).
- **Bağımsız Denetçiler İçin Etik Kurallar** (KGK, 11.08.2025 metni) parag. 100.1, 100.6 U3, 100.7 U1, 110.1 U1, 111.1 U1–U2; “Bağımsızlık Standartları”nın ayrı düzenlendiği (A100.8’deki atıf) — kesin.
- **KYS 2** (TDS 2025 Seti) parag. 8, 9, 13 — kesin.
- **BDS 200** (TDS 2025 Seti) parag. 4, 5, 6, 12, 13 (“ön kabul”, makul güvence, denetim riski, kontrol riski, önemli yanlışlık riski bileşenleri, üst yönetimden sorumlu olanlar tanımları), 17, A35, A36, A37 — kesin.
- **BDS 210** (TDS 2025 Seti) parag. 6(b)(i)–(iii), A26 — kesin.
- **BDS 240** (TDS 2025 Seti; 1/1/2018 ve sonrası dönemler için yürürlükteki metin) parag. 5, 6, 7, 8, 32 — kesin.
- **BDS 265** (TDS 2025 Seti) parag. 6, 9, 10, A20 — kesin.
- **BDS 580** (TDS 2025 Seti) parag. 3, 4, 7 — kesin.
- Paragraf numarası olmadan, yalnız standart adıyla anılanlar:
  - BDS 230 (Bağımsız Denetimin Belgelendirilmesi) ve BDS 300 (Finansal Tabloların Bağımsız Denetiminin Planlanması): 07’de çalışma kâğıtları ile denetim planı/programının hangi standardın konusu olduğunu söylemek için; adlar KGK TDS seti listesinde görüldü, içerikten hüküm aktarılmadı — güven: yüksek.
  - “Denetim programı” ve “denetim planı”nın iç planlama belgeleri olduğu (07-A, 07-C): ders kitabı düzeyinde genel bilgi — güven: yüksek.

## Düzeltme turu 1 (bağımsız inceleme sonrası)

- 20 `adimlar[1]` ve `kartlar[1].arka` (önemli): BDS 265 parag. 10 eksiksiz yazıldı: uygun yönetim kademesine, o kademeye doğrudan bildirilmesi uygun olmayanlar dışında önemli eksiklikler zamanında ve yazılı olarak; yönetimin dikkatini gerektiren ve diğer taraflarca yönetime bildirilmemiş diğer eksiklikler zamanında bildirilir. İstisnaya örnek olarak parag. A20 (yönetimin dürüstlüğü veya yeterliği konusunda soru işareti) eklendi; `dayanak`a A20 eklendi. Metin indirilen BDS 265’te görüldü.
- 09 `adimlar[0]` ve `kartlar[0]`: md. 27/1’in “Denetime tabi işletmelerin özellikleri itibarıyla, Kurum tarafından farklı asgari denetçi ve yedek denetçi sayıları belirlenebilir.” cümlesi eklendi.
- 04 `adimlar[1]`: sorumlu denetçilerin “Kurumun onayı alınmak suretiyle” görevlendirildiği (md. 28/1) eklendi. `adimlar[2]`: “bir şart kümesi değil” ifadesi kaldırıldı; md. 14/3-b’nin md. 28/1 şartlarını aradığı, kıdemli denetçinin md. 27/5’te düzenlenen ve bu bentte aranmayan bir unvan olduğu yazıldı.
- 12 `adimlar[2]`: kanıt toplamama kuralına dayanan son çıkarım cümlesi silindi.
- 16 `dayanak`: BDS 200 parag. 13 (“ön kabul” tanımı) ve parag. 4 eklendi; ikisi de indirilen 2025 metninde görüldü.
- Bu dosyadaki BDS 200 sürüm notu düzeltildi (A39 ve parag. 5, 6, 12, 17, A35–A37 2024 ve 2025 sürümlerinde aynıdır); `review-2026-1-DEN.md`’de “Denetim kavramı ve unsurları” kapsamı “md. 5–10” → “md. 4–10” yapıldı (yalnız bu ifade).
