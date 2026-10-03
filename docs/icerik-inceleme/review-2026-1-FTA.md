# İnceleme notları: 2026-1 Finansal Tablolar ve Analizi (2026-1-FTA)

Kaynak: `tools/pdfs/2026_1_finansal-tablolar-analizi.pdf` (TÜRMOB-TESMER SMMM 2026-1, A kitapçığı, 4 sayfa), sayfa görüntüleri `app/img/originals/2026-1-FTA-p1..p4.png`. Kitapçıkta cevap anahtarı tablosu yok; resmi cevap, etiketi kırmızı basılmış şıktır. Kırmızı işaret hem görüntüden hem PDF'teki metin rengi (0xff0000) taranarak 20 soruda teyit edildi: ACBDBDCDBCBEECACDAEA (ham `dogru` ile aynı).

Yöntem: Her soru görüntüden yeniden yazıldı ve ham çıkarımla (`tools/out/raw/2026-1-FTA.json`) karşılaştırıldı. HTML'den arındırılmış metin 20 kök ve 100 şıkta ham metinle (boşluklar hariç) karakter karakter aynıdır; tek farklar aşağıdaki tabloda yazılı iki bilinçli düzenlemedir (06-E'ye karışmış ortak veri bloğu, 18'deki grafik). Bilanço ve gelir tablosu görüntü olarak basıldığı için rakamlar 220 dpi kırpımdan okundu; ortak bilgi bloğunun arındırılmış metni hamdaki blokla karakter karakter aynıdır. Bilançonun bütün ara toplamları (dönen/duran varlık, KVYK, öz kaynak, aktif = pasif) ve gelir tablosunun satış, brüt kâr ve faaliyet kârı satırları betikle sağlandı. Her soru kırmızı işarete bakılmadan çözüldü, sonra işaretle karşılaştırıldı.

Genel: 1-15. soruların ortak verisi (talimat kutusu + bilanço + gelir tablosu) her sorunun `ortakBilgi` alanına aynen kopyalandı; kitapçıktaki kalın ve kalın-italik satırlar `<strong>` / `<strong><em>` ile korundu. 1-15 ve 19'da kök tamamen kalın; 16, 17, 18, 20'de yalnız soru cümlesi kalın. 19'daki altı çizili "yer almaz" `<u>` ile işaretlendi. ₺, kesme işareti (’) ve kitapçığın yazımı ("itibariyle", "arttırdığı", "Dikey yüzde analiz yöntemine") aynen korundu. İptal edilen soru yok; `cevapNotu` hepsinde `null`.

## Konu etiketleri

Bu ders için tanımlanan 11 etiket (2026-2-FTA dosyası aynı etiketleri kullanacaktır):

- İşletme sermayesi: 01
- Likidite oranları: 02, 03, 17
- Mali yapı oranları: (yok)
- Faaliyet oranları: 04, 05, 06, 16
- Kârlılık oranları: 07, 08, 09
- Dikey analiz: 10, 11
- Karşılaştırmalı tablolar analizi: 15
- Trend analizi: 12, 13, 18
- Nakit akış tablosu: 14
- Fon akım tablosu: (yok)
- Finansal tablo sunumu: 19, 20

Notlar: "Karşılaştırmalı tablolar analizi" kitapçığın yatay analiz için kullandığı addır (2026-2'de 19 ve 20 de bu adla soruluyor). "Trend analizi" eğilim yüzdeleri ve grafik üzerinden eğilim yorumunu kapsar; 18 (net satış ve satışların maliyeti grafiği) bu nedenle burada. 16 (hedef tahsilat süresinden dönem sonu alacak) devir hızı formülüne dayandığı için "Faaliyet oranları"nda; 17 (hedef likidite oranından stok) "Likidite oranları"nda. "Finansal tablo sunumu" TMS 1 (ve gerektiğinde MSUGT) sunum kurallarını ve tanımlarını kapsar. "Mali yapı oranları" (kaldıraç, öz kaynak/aktif, devamlı sermaye oranları) ve "Fon akım tablosu" bu kitapçıkta kullanılmadı; 2026-2'de kaldıraç sorusu için gereklidir.

## Soru bazında tablo

| No | Durum | Ham çıkarıma göre düzeltme | Bağımsız cevap | Resmi (kırmızı) | Eşleşme |
|----|-------|----------------------------|----------------|-----------------|---------|
| 01 | düzeltildi | Ham çıkarımda ortak veri 06-E şıkkına karışmıştı; talimat kutusu, bilanço ve gelir tablosu görüntüden iki `veri` tablosu olarak kuruldu ve 01-15'in `ortakBilgi` alanına kondu | A (900.000 − 1.000.000 = −100.000) | A | evet |
| 02 | ok | Ortak bilgi (01 gibi) | C (900.000 / 1.000.000 = 0,900) | C | evet |
| 03 | ok | Ortak bilgi | B ((900.000 − 500.000) / 1.000.000 = 0,400) | B | evet |
| 04 | ok | Ortak bilgi | D (3.600.000 / 400.000 = 9 → 40 gün) | D | evet |
| 05 | ok | Ortak bilgi; satır birleştirme | B (4.500.000 / 400.000 = 11,25 → 32,00 gün) | B | evet |
| 06 | düzeltildi | E şıkkının sonuna yapışmış ortak veri bloğu (talimat + iki tablo) şıktan ayrıldı; E = "42,00" | D (3.600.000 / 400.000 = 9 → 40,00 gün) | D | evet |
| 07 | ok | Satır birleştirme | C (900.000 / 4.500.000 = %20,00) | C | evet |
| 08 | ok | Satır birleştirme | D (150.000 / 2.500.000 = %6,00) | D | evet |
| 09 | ok | Satır birleştirme | B (35.450 / 1.542.000 = %2,299; kitapçık %2,29) | B | evet |
| 10 | ok | Satır birleştirme | C (2.540.000 / 2.500.000 = %101,60) | C | evet |
| 11 | ok | Satır birleştirme | B (400.000 / 1.542.000 = %25,94) | B | evet |
| 12 | ok | Satır birleştirme | E (900.000 / 600.000 = %150) | E | evet |
| 13 | ok | Satır birleştirme | E (4.500.000 / 2.500.000 = %180) | E | evet |
| 14 | ok | Satır birleştirme | C (4.500.000 + 420.000 − 380.000 = 4.540.000) | C | evet |
| 15 | ok | Satır birleştirme | A ((30.000 − 20.000) / 20.000 = %50,00) | A | evet |
| 16 | düzeltildi | Düz satırlara dağılmış veri `veri` tablosu olarak kuruldu (iki başlık satırı Gerçek/Gerçek/Öngörü ve 2024/2025/2026; 2026 ticari alacak hücresi kitapçıktaki gibi boş); kalın soru cümlesi ve parantezli talimat ayrı paragraflar | C (360/60 = 6; 600.000/6 = 100.000; X = 80.000) | C | evet |
| 17 | ok | Veri paragrafı ile kalın soru cümlesi ayrıldı | D (150.000 − 0,6 × 100.000 = 90.000) | D | evet |
| 18 | düzeltildi | Ham çıkarımda grafik yoktu. Grafik bir görüntüdür; altındaki veri tablosu (2021-2025, Satışların Maliyeti ve Net Satışlar, ₺ ile) `veri` tablosu olarak eklendi ve önüne grafiği tarif eden köşeli parantezli, italik bir not kondu (kesikli = satışların maliyeti, düz = net satışlar, eksen 0-6.000.000 ₺, kesikli çizgi düz çizginin üzerinde; ayrıntı için orijinal sayfa) | A (göreli okuma; brüt kâr marjı %30 → %15) | A | evet (tartışmalı) |
| 19 | düzeltildi | Altı çizili "yer almaz" `<u>`; tamamı kalın kök | E (TMS 1 par. 10) | E | evet |
| 20 | ok | Tanım paragrafı ile kalın soru cümlesi ayrıldı | A (TMS 1 par. 7) | A | evet |

20/20 eşleşme.

## Anahtar çelişkisi

Yok. `tools/allow-missing.txt` değiştirilmedi.

## Tartışmalı soru: 2026-1-FTA-18

- **Okuma 1 (resmi anahtar, A):** "Brüt satış kârı azalma eğilimindedir" brüt kârlılık (brüt kâr marjı) anlamında okunur. Marj her yıl düşer: %30,0 / %25,0 / %21,0 / %19,0 / %15,0. "Artış" karşılaştırması da göreli yapılır: 2021 = 100 alınınca net satışların eğilim yüzdesi 2025'te 560, satışların maliyetininki 680; maliyet daha hızlı artmıştır, bu yüzden D yanlıştır. Sonuç A.
- **Okuma 2 (tutar):** Brüt satış kârı TL olarak her yıl artar: 150.000 → 200.000 → 315.000 → 399.000 → 420.000 ₺; A yanlış olur. 2021-2025 arasında net satışlar 2.300.000 ₺, satışların maliyeti 2.030.000 ₺ artmıştır ve her yılın TL artışı da net satışlarda daha büyüktür (300/250, 700/585, 600/516, 700/679 bin ₺); D doğru olur. Bu okumada cevap **D**.
- **Grafik:** Grafik yığılmış çizgi olarak çizilmiş görünüyor: kesikli çizgi (etiketi "Satışların Maliyeti") tablo değerini değil net satışlar + satışların maliyeti toplamını izliyor (2021 ≈ 850.000; 2022 ≈ 1.400.000; 2025 ≈ 5.180.000 ₺). Görsel olarak "maliyet satışların üzerinde ve fark açılıyor" izlenimi verir ve bu da A'yı destekler; ancak veri tablosuyla çelişir.
- **Karar:** Resmi cevap A, trend analizindeki göreli (yüzde) okuma ile savunulabilir; anahtar çelişkisi sayılmadı, çözüm A'ya göre yazıldı. Çözümdeki "Not (tartışmalı)" adımı tutar okumasında A'nın yanlış, D'nin doğru olacağını ve grafiğin yığılmış çizildiğini açıkça söyler; `tuzaklar.D` de Not'a yönlendirir.

## Tartışma gerektirmeyen ama not düşülen yorumlar

- **06 (borç devir hızının payı):** Pay olarak satışların maliyeti kullanıldı (40 gün). Alışlar tahminiyle (3.600.000 + 500.000 − 300.000 = 3.800.000) 37,89 gün çıkar; şıklarda yok. Çözümde Not adımı var.
- **07 ("satışların kârlılığı"):** Bu başlık brüt, faaliyet ve net kâr marjlarını kapsar. Faaliyet ve net kâr marjı (%1,00), vergi öncesi kâr marjı (%1,34) şıklarda yok; yalnız brüt kâr marjı (%20,00) bir şıkla örtüşür. Çözümün 3. adımı bunu açıklar.
- **09 (pay, payda, yuvarlama):** Pay gelir tablosundaki net kâr (35.450), payda yıl sonu aktif toplamı (1.542.000); ortalama talimatı yalnız devir hızları içindir (ortalama aktifle %2,42, şıklarda yok). Sonuç %2,2990; kurala göre %2,30 olur, kitapçık keserek %2,29 yazmış (11-A'daki %23,34 = 23,346 da kesilmiştir). Bilançodaki tutarsız net kâr (31.000) kullanılırsa %2,01 çıkar; hiçbir şıkla tam örtüşmez, en yakını A (%2,00). Gelir tablosunun kendi zinciri de tutarsızdır (aşağıya bakınız); yeniden hesaplanan net kârla %2,56 çıkar, o da şıklarda yoktur. Bu ikinci okumanın bir şıkkı tam olarak vermediği için TARTIŞMALI sayılmadı; çözümde Not adımı ve `tuzaklar.A` bunu söyler. İnceleyenin dikkatine.
- **12, 13 (baz yıl):** Baz yıl belirtilmemiş; eğilim yüzdelerinde serinin ilk yılı (2023) baz alındı. 2024 baz alınsa 12'de %120 (D), 13'te %125 (C) çıkar; bunlar tuzak olarak açıklandı.
- **03 (likidite oranı payı):** Dönen varlıklar yalnız hazır değerler, ticari alacaklar ve stoklardan oluştuğu için "dönen varlıklar − stoklar" ile "hazır değerler + ticari alacaklar" aynı sonucu verir; tanım farkı sonucu etkilemez.

## İptal edilen soru

Yok; kitapçıkta iptal işareti yok.

## Baskı hataları ve kuşkular

- **Talimat kutusu:** "1-15. soruları cevaplandırılmasında" (doğrusu "soruların"). Aynen aktarıldı.
- **Bilanço ile gelir tablosu tutarsız:** Bilançodaki "Dönem Net Karı(Zararı)" 23.000 / 31.000 / 40.000 ₺; gelir tablosundaki "Dönem Net Kârı veya Zararı" 22.500 / 35.450 / 45.120 ₺. Yalnız 09'u etkiler (gelir tablosu rakamı kullanıldı; Not adımı var).
- **Gelir tablosunda iç tutarsızlık:** Faaliyet kârı − finansman giderleri 2023'te 30.000 ✓, ancak 2024'te 180.000 − 125.000 = 55.000 (tabloda Dönem kârı 51.000), 2025'te 45.000 − 100.000 = −55.000 (tabloda +60.160). Arada gösterilmeyen başka gelir/gider kalemleri olabilir. 09'un resmi cevabı (B) bu tutarsız zincirin sonundaki basılı 35.450'ye dayanır (51.000 − 15.550); zincir yeniden hesaplanırsa net kâr 55.000 − 15.550 = 39.450 ve oran %2,56 çıkar, şıklarda yoktur. 09'un Not adımı her iki tutarsızlığı açıklar. 09-C (%3,31) tablodaki 51.000 ile hesaplanmıştır.
- **Gelir tablosu başlıkları:** Dönem tablosu olmasına rağmen sütunlar "31 Aralık 2023/2024/2025" diye başlıklanmış (doğrusu "2023 yılı" ya da "1 Ocak–31 Aralık"). Aynen aktarıldı.
- **18 grafiği:** Yukarıda açıklandığı gibi kesikli çizgi yığılmış çizilmiş; rakamlar veri tablosundan alındı. Grafiğin kendisi soru metnine görüntü olarak eklenmedi; metindeki tarif notu ve veri tablosu soruyu tek başına cevaplanabilir kılar, orijinal sayfa uygulamada görüntülenebilir.
- **Yuvarlama:** Kitapçık yüzdeleri yuvarlamak yerine kesiyor (09-B %2,29 = 2,2990; 11-A %23,34 = 23,346). Doğru şıkların seçimini etkilemez.
- **Tuzaklar:** Mekanizması bulunamayan şıklar için uydurma açıklama yazılmadı; yalnız neden yanlış olduğu söylendi: 03-C, 04-C, 05-C, 06-B, 06-E, 07-D, 08-B, 09-A, 15-C, 15-D; 16 ve 17'de yanlış şıklar için bu tutarla çıkacak süre/oran gösterildi. Bulunan mekanizmaların hepsi betikle hesaplandı.
- **Dayanak atıfları:** TMS 1 par. 7 (toplam kapsamlı gelir tanımı) ve par. 10 (tam finansal tablo seti) verildi; TMS 7 için paragraf numarası verilmedi.
