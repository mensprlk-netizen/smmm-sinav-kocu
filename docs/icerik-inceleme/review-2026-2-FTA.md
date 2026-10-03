# İnceleme notları: 2026-2 Finansal Tablolar ve Analizi (2026-2-FTA)

Kaynak: `tools/pdfs/2026_2_finansal-tablolar-analizi.pdf` (TÜRMOB SMMM 2026-2, A kitapçığı, 5 soru sayfası + 1 cevap anahtarı sayfası), sayfa görüntüleri `app/img/originals/2026-2-FTA-p1..p6.png`. Resmi cevap iki yerden okundu: kitapçıkta kırmızı basılmış şık ve 6. sayfadaki "Finansal Tablolar ve Analizi Cevap Anahtarı" tablosu (A kitapçığı sütunu). İkisi 20 soruda aynıdır: BDDDCEACCEBBCDBADBAE (ham `dogru` ile aynı). Tabloda 6 ve 7. sorular "İPTAL" olarak işaretli; kitapçıkta bu iki soru "Değerlendirme Dışı" damgalıdır.

Yöntem: Her soru görüntüden yeniden yazıldı ve ham çıkarımla (`tools/out/raw/2026-2-FTA.json`) karşılaştırıldı. HTML'den arındırılmış metin 20 kökte (tablo ve grafik notu dışında) ve 100 şıkta ham metinle boşluklar hariç karakter karakter aynıdır; 8-11 ve 12-20'nin ortak bilgi blokları da ham çıkarımda şıklara karışmış bloklarla karakter karakter aynıdır. Ham çıkarımda bulunmayan 1-2 ortak tablosu PDF metin katmanından ve 300 dpi kırpımdan, 3. sorunun tablosu (görüntü) 250 dpi kırpımdan, 6-7 grafik veri tabloları (görüntü) 220 dpi kırpımdan okundu. Bütün ara toplamlar betikle sağlandı (aşağıya bakınız). Her soru kırmızı işarete ve anahtar tablosuna bakılmadan çözüldü, sonra ikisiyle karşılaştırıldı.

Genel: Ortak veriler ilgili her sorunun `ortakBilgi` alanına aynen kopyalandı (1-2: tablo; 8-11: talimat + üretim/stok tablosu; 12-20: talimat + bilanço + gelir tablosu). Kitapçıktaki kalın ve kalın-italik satırlar `<strong>` / `<strong><em>` ile, italik talimat metinleri `<em>` ile korundu. 1-2 ve 8-20'de kök tamamen kalın; 3, 4, 5, 6, 7'de yalnız soru cümlesi kalın. ₺, kesme işareti (’), "itibari ile", 12-A'daki "– 6.000" (uzun tire ve boşluk) aynen korundu. 12-20 bilançosundaki "Diğer  Alacaklar" çift boşluğu tek boşluğa indirildi (HTML'de görünüm aynı). Bilançoda AKTİF TOPLAMI ile KAYNAKLAR arasındaki boş ayraç satırı, 2026-1 dosyasındaki gibi atlanıp KAYNAKLAR başlık satırı olarak verildi.

## Konu etiketleri

2026-1-FTA ile aynı etiket kümesi kullanıldı; yeni etiket eklenmedi.

- İşletme sermayesi: 12
- Likidite oranları: 13
- Mali yapı oranları: 04
- Faaliyet oranları: 03, 08, 09, 10, 11, 14
- Kârlılık oranları: 15
- Dikey analiz: 05, 16, 17, 18
- Karşılaştırmalı tablolar analizi: 19, 20
- Trend analizi: 01, 02, 06, 07
- Nakit akış tablosu: (yok)
- Fon akım tablosu: (yok)
- Finansal tablo sunumu: (yok)

Notlar: 06 ve 07 (grafikle "trend ilişkisi" yorumu) 2026-1-FTA-18'deki gibi "Trend analizi"nde; 07'nin şıkları likidite oranlarıyla ilgilidir ama soru eğilim grafiği üzerinden sorulmuştur. 03 (hedef borç ödeme süresinden dönem sonu borç) devir hızı formülüne dayandığı için "Faaliyet oranları"nda. 05 (dikey yüzdelerden faaliyet kârı) "Dikey analiz"de. 04 kaldıraç / devamlı sermaye oranları nedeniyle "Mali yapı oranları"nda (2026-1 notunda öngörüldüğü gibi).

## Soru bazında tablo

| No | Durum | Ham çıkarıma göre düzeltme | Bağımsız cevap | Kırmızı işaret | Anahtar tablosu | Eşleşme |
|----|-------|----------------------------|----------------|----------------|-----------------|---------|
| 01 | düzeltildi | Ham çıkarımda 1-2 ortak tablosu yoktu; PDF metin katmanından `veri` tablosu kuruldu ve 01-02 `ortakBilgi` alanına kondu | B (113.400 / 140.000 = 81,00) | B | B | evet |
| 02 | düzeltildi | Ortak tablo (01 gibi) | D (396.060 / 322.000 = 123,00) | D | D | evet |
| 03 | düzeltildi | Ham çıkarımda tablo (görüntü) yoktu; kırpımdan `veri` tablosu kuruldu (30 Haziran 2026 ticari borç hücresi kitapçıktaki gibi boş); kalın soru cümlesi ve italik parantezli talimat ayrı paragraflar | D (180 / 36 = 5; 190.000 / 5 = 38.000; X = 42.000) | D | D | evet |
| 04 | ok | Tanım paragrafı ile kalın soru cümlesi ayrıldı | D (100 − 60 + 10 = 50) | D | D | evet |
| 05 | ok | Veri paragrafı ile kalın soru cümlesi ayrıldı | C (510.000 / 1,02 × 0,15 = 75.000) | C | C | evet |
| 06 | düzeltildi | Grafik (görüntü) ham çıkarımda yoktu; veri tablosu (kitapçıktaki gibi 2022, 2023, 2024, 2024, 2025 başlıklarıyla) ve köşeli parantezli italik tarif notu eklendi; `iptal: true`, `cevapNotu` yazıldı | E (tahsilat süresi 72 → ≈173 gün) | E | E (İPTAL) | evet |
| 07 | düzeltildi | E şıkkına yapışmış 8-11 ortak bloğu şıktan ayrıldı; grafik veri tablosu ve tarif notu eklendi; `iptal: true`, `cevapNotu` yazıldı | A (cari oran 1,50 → 2,00; likidite oranı 0,75 → 1,31) | A | A (İPTAL) | evet |
| 08 | düzeltildi | 8-11 ortak bloğu (talimat + tablo) `veri` tablosu olarak kuruldu ve 08-11 `ortakBilgi` alanına kondu | C (43.750 / 35.000 = 1,25; 90 / 1,25 = 72) | C | C | evet |
| 09 | ok | Ortak bilgi (08 gibi) | C (150.000 / 25.000 = 6; 90 / 6 = 15) | C | C | evet |
| 10 | ok | Ortak bilgi | E (380.000 / 19.000 = 20) | E | E | evet |
| 11 | düzeltildi | E şıkkına yapışmış 12-20 ortak bloğu (talimat + bilanço + gelir tablosu) şıktan ayrıldı; E = "72" | B (150.000 / 30.000 = 5; 90 / 5 = 18) | B | B | evet |
| 12 | düzeltildi | 12-20 ortak bloğu iki `veri` tablosu olarak kuruldu ve 12-20 `ortakBilgi` alanına kondu | B (dönen varlıklar 18.000) | B | B | evet |
| 13 | ok | Ortak bilgi | C (18.000 / 24.000 = 0,750) | C | C | evet |
| 14 | ok | Ortak bilgi | D (12.000 / 8.000 = 1,5; 90 / 1,5 = 60) | D | D | evet |
| 15 | ok | Ortak bilgi | B (3.000 / 12.000 = %25,00) | B | B | evet |
| 16 | ok | Ortak bilgi | A (1.659 / 42.000 = %3,95) | A | A | evet |
| 17 | ok | Ortak bilgi | D ((17.100 + 12.300) / 60.000 = %49,00) | D | D | evet |
| 18 | ok | Ortak bilgi | B (300 / 12.000 = %2,50) | B | B | evet |
| 19 | ok | Ortak bilgi | A ((4.900 − 7.000) / 7.000 = −%30,00) | A | A | evet |
| 20 | ok | Ortak bilgi | E ((24.200 − 20.000) / 20.000 = %21,00) | E | E | evet |

20/20 eşleşme (iki iptal soru dahil).

## İptal edilen sorular

Her ikisi için `iptal: true`, `dogru` = kitapçıkta işaretli şık, `cevapNotu` = "Bu soru TESMER cevap anahtarında İPTAL edilmiştir (kitapçıkta soru “Değerlendirme Dışı” damgalıdır); kitapçıkta işaretli şık: X." Bağımsız çözüm işaretli şıkla uyuştuğu için iki sorunun da çözümü yazıldı; `ozet` iptali söyler ve 4. adım muhtemel gerekçeyi açıklar. `tools/allow-missing.txt` değiştirilmedi. Resmî iptal gerekçesi yayımlanmamıştır; aşağıdakiler çıkarımdır.

- **06 (işaretli E, "Ortalama tahsilat süreleri uzamaktadır"):** Veriyle E doğrudur: alacakların eğilim yüzdesi 625, net satışlarınki 260; tahsilat süresi dönem sonu alacakla 72 / 180 / 170,5 / 172,2 / 173,1 gün, ortalama alacakla 115,7 / 151,6 / 156,5 / 162,7 gün. A (brüt kârlılık; maliyet verisi yok), B ve D (kısalma), C (değişmeme) yanlıştır. Muhtemel gerekçe: (a) grafiğin yatay ekseninde "2024" iki kez yazılmıştır (2022, 2023, 2024, 2024, 2025): dört yıla beş gözlem düşer; kök de "2022 ve 2025 yıllarına ait" der. Aynı hata 07'de de var ve iki soru birlikte iptal edildi; en güçlü aday budur. (b) Dönem sonu alacakla hesaplanan süre 2023'te 180 güne çıkıp sonraki dönemde 170,5'e iner; "uzamaktadır" yalnız genel eğilim olarak doğrudur.
- **07 (işaretli A, "Likidite gücü iyileşmektedir"):** Veriyle A doğrudur: cari oran 1,50 / 1,58 / 1,90 / 1,92 / 2,00; likidite oranı 0,75 / 0,82 / 1,07 / 1,23 / 1,31; net işletme sermayesi 4.000 → 16.000. C, D, E yanlıştır (stokların eğilim yüzdesi 183,3, dönen varlıklarınki 266,7). Muhtemel gerekçe: (a) 06 ile aynı eksen etiketi hatası ve "2022 ve 2025" ifadesi; (b) B ("Likidite sorunu yaşanmaktadır") geleneksel ölçütlere göre ilk yıllar için savunulabilir (2022 likidite oranı 0,75 < 1; cari oran 2022-2024 arasında 2'nin altında), ama son dönemde iki ölçüt de sağlanmıştır.

## Anahtar çelişkisi

Yok. `tools/allow-missing.txt` değiştirilmedi.

## Tartışmalı soru

Yok. Aşağıdaki 15 notu inceleyenin dikkatine sunulur.

## Tartışma gerektirmeyen ama not düşülen yorumlar

- **15 ("brüt satışların kârlılığı"):** Kelimesi kelimesine okunup brüt satışlar payda yapılırsa 3.000 / 12.300 = %24,39 (A) çıkar. "Satışların kârlılığı" brüt / faaliyet / net kâr marjı ailesinin adıdır (2026-1-FTA-07'de de böyle kullanıldı) ve bu oranlarda payda net satışlardır; aynı kitapçığın 18. sorusunda brüt satış paydasıyla çıkan %2,44 de yanlış şık olarak konmuştur. Resmi B (%25,00) standart tanımla tek doğru sonuçtur; TARTIŞMALI sayılmadı. Çözümde "Not (ifade)" adımı ve `tuzaklar.A` bunu açıklar.
- **03 (dönem uzunluğu ve pay):** 190.000 ₺ altı aylık (1 Ocak – 30 Haziran 2026) satışların maliyetidir; talimat gereği 180 gün kullanıldı (yıllıklandırma ile aynı sonuç). Alış tutarı verilmediği için borç devir hızının payı satışların maliyetidir. 190.000 yıllık sayılırsa A (4.000) çıkar.
- **08-11, 14 (çeyrek dönem):** "31 Mart 2026" sütunları 1 Ocak – 31 Mart 2026 üç aylık akışlardır; talimata göre 90 gün kullanıldı. 360 günle çalışan yanlış şıklar her soruda var (08-E 288, 09-D 60, 11-E 72, 14-B 240).
- **08, 09 (pay):** DİMM devir hızında pay kullanılan DİMM (DİMM giderleri 43.750); yarı mamulde dönemin toplam üretim maliyeti (150.000). Yarı mamulde üretim giderleri toplamı (144.000) alınsa 15,63 gün çıkar, şıklarda yok.
- **13 (bakiye oranı):** Cari oranda 31 Mart 2026 bakiyeleri kullanıldı; ortalama talimatı yalnız devir hızları içindir.
- **16 ("dönem kârı veya zararı"):** Vergi öncesi "Dönem Kârı Veya Zararı" satırı (1.659) kullanıldı; net kârla %2,96 çıkar, şıklarda yok.

## Tutarlılık denetimi, baskı hataları ve kuşkular

- **Bilanço iç tutarlılığı (12-20):** Üç tarihte de dönen varlık, duran varlık, aktif, KVYK, UVYK, öz kaynak ve pasif toplamları kalemlerle tutuyor; aktif = pasif (58.000 / 69.000 / 60.000).
- **Gelir tablosu iç tutarlılığı (12-20):** Üç sütunda da zincir tutuyor (brüt satış − indirim = net satış; − SMM = brüt kâr; − faaliyet gideri = faaliyet kârı; − finansman gideri = dönem kârı; − vergi = net kâr). 2026-1'deki gibi bir iç tutarsızlık yok.
- **Bilanço ile gelir tablosu tutarsız:** Bilançodaki "Dönem Net Karı(Zararı)" 800 / 1.200 / 500; gelir tablosundaki "Dönem Net Kârı veya Zararı" 895 / 1.244 / 540. Hiçbir soru bu kalemi kullanmıyor (16 gelir tablosundaki vergi öncesi kârı kullanır); yalnız kayıt için not edildi.
- **8-11 üretim tablosu:** Üretim giderleri toplamı, toplam üretim maliyeti ve satılan mamul maliyeti iki sütunda da tutuyor (128.000 + 120.000 + 140.000 = 388.000; 388.000 + 22.000 − 28.000 = 382.000; 382.000 + 18.000 − 20.000 = 380.000; 43.750 + 63.250 + 37.000 = 144.000; 144.000 + 28.000 − 22.000 = 150.000; 150.000 + 20.000 − 18.000 = 152.000). 31 Mart 2026 dönem başı stokları 31 Aralık 2025 dönem sonu stoklarıyla aynı (yarı mamul 28.000, mamul 20.000, ticari mal 40.000) ✓. Ticari mal alışları verilmemiş (zımni: 2025'te 420.000, 2026 1. çeyrekte 130.000); hiçbir soru gerektirmiyor.
- **Sütun başlıkları:** Gelir tablosu ve üretim tablosu akış tabloları olduğu hâlde sütunlar tarih olarak ("31 Aralık 2024", "31 Mart 2026") başlıklanmış; "31 Mart 2026" sütunu üç aylık dönemdir. Aynen aktarıldı; çözümler bunu açıklar.
- **06-07 grafikleri:** Yatay eksende "2024" iki kez yazılı; kök "2022 ve 2025 yıllarına ait" diyor (muhtemelen "2022-2025"). 07 grafiğinde 2025 stok etiketinin (11.000) yanında küçük bir çizgi işareti var. Grafiklerde ₺ işareti yok; veri tablolarına da eklenmedi. Grafiklerin kendisi metne görüntü olarak eklenmedi; tarif notu ve veri tablosu soruyu tek başına cevaplanabilir kılar.
- **Tuzaklar:** Mekanizması bulunamayan şıklar için uydurma açıklama yazılmadı, yalnız neden yanlış olduğu söylendi: 05-A, B, D, E; 08-A; 09-A; 13-A, E; 16-C, D, E; 20-C, D. Bulunan mekanizmaların hepsi betikle hesaplandı.
