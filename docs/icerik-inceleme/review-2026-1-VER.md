# İnceleme notları: 2026-1 Vergi Mevzuatı ve Uygulaması (2026-1-VER)

Kaynak: `tools/pdfs/2026_1_vergi-mevzuati.pdf` (TÜRMOB-TESMER SMMM 2026-1, A kitapçığı, 5 sayfa, sayfa no. 10–14), sayfa görüntüleri `app/img/originals/2026-1-VER-p1..p5.png`. 2026-1 kitapçıklarında cevap anahtarı tablosu yok; resmi cevap kırmızı basılmış şıktır.

Yöntem: Her soru görüntüden yeniden yazıldı ve ham çıkarımla (`tools/out/raw/2026-1-VER.json`) karşılaştırıldı. HTML’den arındırılmış metin ile ham metin, 20 kök ve 100 şıkta (boşluklar hariç) betikle karşılaştırıldı; kalan farkların hepsi aşağıdaki bilinçli yapı düzeltmeleridir (soru numarası, madde işaretleri, 19’daki sütun ayıracı). Her soru önce bağımsız çözüldü, sonra kırmızı şıkla karşılaştırıldı. Kırmızı şık ile ham `dogru` 20 sorunun hepsinde aynı. İptal işareti yok; ham `iptal` hepsinde `false`, `notlar` hepsinde boş.

Hukuki kontrol: Kurallar ezberden değil, mevzuat.gov.tr’den indirilen güncel kanun metinlerinden (GVK, KVK, KDVK, VUK, AATUHK, DVK, ÖTVK, VİVK, MTVK, 5510) madde madde doğrulandı. Hesaplar kitapçıktaki 2025 tarifesi ve sorudaki tutarlarla yapıldı.

Genel: Satır sonları birleştirildi; ₺, binlik ayracı, kesme işaretleri (’) ve kitapçıktaki yazımlar (kâğıt/kağıt, İktisadî, Millî, ikametgâhı, dâhil) korundu. Tamamı kalın basılan kökler (04, 05, 07, 08, 09, 10, 12, 16, 17) ve her sorunun kalın soru cümlesi `<strong>` ile korundu; altı çizili “değildir” (04, 05, 08, 12, 17), “yanlıştır” (07, 09, 16), “girmez” (10) ve “yanlış” (19) `<u>` ile işaretlendi.

## Konu etiketleri

Kısa, okunur etiket seti (11 etiket). 2026-2-VER aynı etiketleri kullanacak; bu dosyada kullanılmayan etiketler de sete dahildir.

- Gelir vergisi: kazanç ve iratlar (gelir unsurları, kazanç istisnaları): 01
- Gelir vergisi: beyan ve matrah (beyan esasları, beyan sınırları, indirimler, tarife, vergi indirimi, mahsup): 02, 03, 04
- Kurumlar vergisi: 12, 13, 14, 15
- KDV: 08, 09, 10, 11
- ÖTV: 16
- Diğer vergiler (damga vergisi, harçlar, veraset ve intikal, emlak, MTV): 07, 20
- Vergi usulü: genel hükümler (mükellefiyet, tarh, tebliğ, tahakkuk, zamanaşımı, defter-belge): (yok)
- Vergi usulü: değerleme: 19
- Vergi usulü: cezalar (suçlar, cezalar, pişmanlık, izaha davet): 17, 18
- Vergi usulü: uyuşmazlık ve uzlaşma: (yok)
- Vergi icra: AATUHK: 05, 06

Notlar: 01 bir matrah sorusu olsa da sınanan nokta GVK 18 telif istisnasının tutar sınırı ve kâr payı istisnası olduğu için “kazanç ve iratlar”da. 04 (vergiye uyumlu mükellef indirimi) gelir ve kurumlar vergisi beyannamesi üzerinden hesaplanan vergiden indirim olduğu için “beyan ve matrah”ta. 15 (binek otomobil KKEG ve MTV) kurum kazancının tespitine ilişkin olduğu için “Kurumlar vergisi”nde. 18 izaha davet ve pişmanlığı birlikte sorduğu için “cezalar”da.

## Soru bazında tablo

| No | Durum | Ham çıkarıma göre düzeltme | Bağımsız cevap | Resmi (kırmızı) | Eşleşme |
|----|-------|----------------------------|----------------|-----------------|---------|
| 01 | düzeltildi | Ham metin ortak kutuyu “ve 2. soruların” diye başlatıyor (“1.” düşmüş) ve tarifeyi kökle karıştırıyordu; tarife `ortakBilgi` olarak `veri` tablosuna alındı (01 ve 02’de aynı), kutu başlığı “1. ve 2. soruların …” kalın | D (4.500.000 > 4.300.000, telif istisnası yok; + 700.000/2 = 4.850.000) | D | evet |
| 02 | düzeltildi | Gelir tablosu `veri` tablosu (₺ sütunu); tarife `ortakBilgi` | C (ücretler 86/1-b ile beyan dışı; kira 420.000 > 330.000, 86/1-c) | C | evet |
| 03 | ok | Satır birleştirme | D ((2.000.000 − 100.000) × 0,90 = 1.710.000) | D | evet |
| 04 | ok | Kalın kök, altı çizili “değildir” | E (GVK mük. 121: düzeltme/pişmanlık beyannamesi ihlal sayılmaz) | E | evet |
| 05 | ok | Kalın kök, altı çizili “değildir” | A (muvazaalı teşebbüs md. 17/3 ihtiyati tahakkuk sebebi) | A | evet |
| 06 | ok | Satır birleştirme | B (6183 md. 15: 15/15) | B | evet |
| 07 | ok | Kalın kök, altı çizili “yanlıştır” | A (DVK md. 5: nispi vergide yalnız bir nüsha) | A | evet |
| 08 | ok | Kalın kök, altı çizili “değildir” | C (KDVK 1/3-b ve 23/a: şans oyunları vergiye tabi) | C | evet |
| 09 | ok | Kalın kök, altı çizili “yanlıştır” | C (KDVK 11/1-c: üç ay, altı ay değil) | C | evet |
| 10 | ok | Kalın kök, altı çizili “girmez” | A (KDVK 6/b: hizmet yurt dışında ifa edilip yurt dışında faydalanılıyor) | A | evet |
| 11 | düzeltildi | Beş kutulu veri tek sütunlu `veri` tablosu; “(İlaç teslimlerinde KDV oranı %10’dur.)” kalın olmayan ayrı paragraf | E (50.600 − 14.000 = 36.600) | E | evet |
| 12 | ok | Kalın kök, altı çizili “değildir” | B (kollektif şirket KVK 1-2’de yok) | B | evet |
| 13 | ok | Satır birleştirme | D (KVK 32/B-2 sırası: önce 800.000 enflasyon farkı, sonra 200.000 geçmiş yıl kârı) | D | evet |
| 14 | ok | Satır birleştirme | A (5.000.000 + 500.000 − 1.000.000 − 300.000 = 4.200.000) | A | evet |
| 15 | düzeltildi | Ham “•” madde işaretleri `<ul>` listesine çevrildi | E (580.000 × %30 + 20.000 MTV = 194.000) | E | evet |
| 16 | ok | Kalın kök, altı çizili “yanlıştır” | B (ÖTVK 5/1-b: serbest bölgeye teslim ihracat sayılmaz) | B | evet |
| 17 | ok | Kalın kök, altı çizili “değildir” | E (fatura vermemek VUK 353/1 özel usulsüzlük) | E | evet |
| 18 | düzeltildi | Roma rakamlı öncüller `<ul class="madde">` | C (I: 15 gün; IV: usulsüzlük kesilir) | C | evet |
| 19 | düzeltildi | Ham şıklar iki satıra bölünmüştü (“Hisse Senedi / Borsa Rayici”); sütun başlığı “İktisadi Kıymet – Değerleme Ölçüsü” kalın paragraf, şıklar “Kıymet – Ölçü” biçiminde tek satır; altı çizili “yanlış” | A (VUK 279: hisse senedi alış bedeli) | A | evet |
| 20 | ok | Satır birleştirme | D (VİVK md. 9/1-b: ölüm yurt dışında, mirasçılar Türkiye’de: 6 ay) | D | evet |

## Anahtar çelişkisi

Yok. 20 sorunun hepsinde bağımsız çözüm ile kırmızı işaretli şık aynı. `tools/allow-missing.txt` değiştirilmedi.

## Tartışmalı soru

Yok. Aşağıdaki iki nokta resmi cevabı değiştiren ikinci bir okuma üretmez; çözümlerde **Not** adımıyla açıklandı:

- **03:** Eğitim harcamasının %10 sınırı Bağ-Kur primi düşüldükten sonraki beyan edilen gelir (1.900.000 ₺) üzerinden alındı. Sınır 2.000.000 ₺ üzerinden alınsaydı sonuç 1.700.000 ₺ olurdu; bu tutar hiçbir şıkta yok, yani alternatif okuma başka bir şıkkı desteklemez.
- **11:** Vade farkı KDV hariç tutar sayıldı (6.000 × %10 = 600). KDV dahil sayılsaydı içindeki KDV ≈ 545 ₺ olur ve sonuç hiçbir şıkla eşleşmez.

## İptal edilen soru

Yok (hiçbir sayfada iptal işareti yok).

## Baskı hataları ve kuşkular

- **06:** Kök “ihtiyati haciz sebeplerine karşı dava … vergi mahkemesinde açılmalıdır” diyor; AATUHK md. 15’in metni hâlâ “vergi itiraz komisyonu nezdinde … itiraz” ifadesini kullanır. Bu komisyonların görevini bugün vergi mahkemeleri yürüttüğü için kökteki ifade uygulamaya uygun. Süre (15 gün) her iki ifadede aynı; cevap etkilenmez. Çözümde açıklandı.
- **01:** Tarife bu soruda vergi hesaplamak için değil, iki sınırı okumak için kullanılıyor (4. dilim 4.300.000 ₺; 2. dilim 330.000 ₺). Tarifedeki tutarlar aritmetik olarak tutarlı (23.700; 58.100; 185.000/293.000; 1.410.000/1.378.000 betikle doğrulandı). Tarife oranları kitapçıkta “15%” biçiminde yazılmış; aynen korundu.
- **01:** Senaryonun Kültür ve Turizm Bakanlığı’nca tescilli olması istisna kapsamındaki bir eser olduğunu gösterir; GVK 18’in 7194 sayılı Kanun’la eklenen fıkrası sınırı aşanların istisnadan “faydalanamayacağını” söyler ve tescilli eserler için ayrık tutmaz (güncel madde metninden doğrulandı).
- **02:** Ücretler kitapçıkta “Safi Ücret” olarak verilmiş; 86/1-b sınırları bu tutarlarla uygulandı. Kira geliri brüt 420.000 ₺; götürü gider sonrası 357.000 ₺ de 330.000 ₺’yi aştığı için brüt ya da safi esas alınması sonucu değiştirmez.
- **03:** Bağ-Kur priminin gelirden indirilmesi için madde numarası verilmedi (kural sözle anlatıldı). GVK 40 ve 89’da Bağ-Kur primlerine ilişkin açık bir bent bulunamadı; uygulama (fiilen ödenen primin ödendiği yılın gelirinden indirilmesi) 5510 sayılı Kanun ve İdare görüşlerine dayanır.
- **10:** D şıkkındaki “karma sanat eserleri” ifadesi aynen aktarıldı; cevap etkilenmez.
- **13:** “Sermayeye eklendiği tarih” olarak tescil tarihi (10.01.2024) alındı; genel kurul tarihi (29.12.2023) alınsa da azaltım tarihinde (07.05.2025) beş tam yıl dolmamıştır, sonuç değişmez.
- **15:** 60.000 (A) ve 78.000 (B) şıklarının aritmetiği (600.000 × %10; 580.000 × %10 + 20.000) tuzaklarda gösterildi; %10 oranının kaynağı olan bir kural bulunmadığı için “%30 yerine %10 alınmış” denmekle yetinildi, uydurma bir gerekçe yazılmadı.
- **16:** ÖTVK 5/1-b’deki “yurt içinden serbest bölgelere yapılan teslimler” ibaresi 7491 sayılı Kanun’la (27.12.2023) eklenmiştir; 2026 sınavı için yürürlükte. KDV ile farkı çözümde Not olarak verildi.
- **20:** Veraset ve İntikal Vergisi beyanname süreleri Kanun’un 9. maddesindedir (10. madde matrah ve değerlemedir).
- **Tuzaklar:** Mekanizması aritmetikle doğrulanamayan şıklar için uydurma açıklama yazılmadı. 20-B (3 ay) için açıklama yok; 20’de A, C, E açıklandı.

## Dayanak atıfları ve güven düzeyi

Madde numaraları, mevzuat.gov.tr’den indirilen güncel kanun metninde tek tek görülerek yazıldı (kesin):

- GVK md. 18 (7194 ile eklenen 4. dilim sınırı), md. 22/3, md. 40/5, md. 74, md. 86/1-b ve 1-c, md. 89/1-1 ve 89/1-2, md. 103, mükerrer md. 121 — kesin.
- KVK md. 1, md. 2, md. 5/1-a, md. 6, md. 9/1-a, md. 32/B — kesin. KVK md. 11 (kabul edilmeyen indirimler) yalnız dayanak listesinde genel atıf — kesin.
- KDVK md. 1/1, 1/2, 1/3-b, 1/3-c, 1/3-d, md. 2/5, md. 6/b, md. 11/1-c, md. 12/1, md. 17/4-a, d, e, g, md. 23/a, md. 24/c, md. 29, md. 30/c — kesin.
- VUK md. 274, 275, 278, 279, 281, 284, 285, mükerrer md. 298/A, md. 353/1, md. 359, md. 370, md. 371 — kesin.
- AATUHK (6183) md. 13, 15, 17, 18 — kesin; md. 58 (ödeme emrine karşı 15 gün, kartta) — kesin.
- DVK (488) md. 2, 3, 5, 6 — kesin.
- ÖTVK (4760) md. 5/1, 5/2 — kesin.
- VİVK (7338) md. 9 — kesin.
- MTVK (197) md. 14 — kesin.
- İYUK md. 7 (vergi mahkemelerinde genel dava açma süresi 30 gün; 06 tuzak E) — kesin (kanun metni indirilmedi, iyi bilinen genel hüküm).
- Madde numarası verilmeden kural olarak anlatılanlar: 03’te Bağ-Kur primlerinin gelirden indirilmesi; 06’da itiraz komisyonlarının görevinin vergi mahkemelerine geçmesi; 12’de kollektif şirket ortaklarının payının ticari kazanç olarak vergilendirilmesi.
- Değişiklik tarihleri: 6183 md. 15 süresi 7061 sayılı Kanun’la 1.1.2018’den itibaren 7 günden 15 güne çıktı; KVK 32/B 7420 sayılı Kanun’la eklendi; ÖTVK 5/1-b’deki serbest bölge ibaresi 7491 sayılı Kanun’la eklendi; DVK md. 5’in birinci cümlesi 6728 sayılı Kanun’la değişti; BES katkı paylarının GVK 89/1-1’den çıkarılması 6327 sayılı Kanun’la; eğitim-sağlık oranının %5’ten %10’a çıkarılması 5281 sayılı Kanun’la — hepsi kanun metnindeki dipnotlardan doğrulandı.
