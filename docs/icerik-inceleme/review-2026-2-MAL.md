# İnceleme notları: 2026-2 Maliyet Muhasebesi (2026-2-MAL)

Kaynak: `tools/pdfs/2026_2_maliyet-muhasebesi.pdf` (TÜRMOB SMMM 2026-2, A kitapçığı, s. 5-8 ve cevap anahtarı sayfası), sayfa görüntüleri `app/img/originals/2026-2-MAL-p1..p5.png`.
Yöntem: Her soru görüntüden yeniden yazıldı ve ham çıkarımla (`tools/out/raw/2026-2-MAL.json`) karşılaştırıldı. Tablo ve madde işaretleri dışında, HTML'den arındırılmış metin ile ham metin karakter karakter aynıdır (boşluklar hariç; betikle denetlendi). Her soru bağımsız çözüldü, sonra hem kırmızı işaretli şıkla hem de p5'teki resmi "Maliyet Muhasebesi Cevap Anahtarı" tablosuyla (A kitapçığı sütunu) karşılaştırıldı. Kırmızı işaret ile anahtar tablosu 20 sorunun hepsinde aynı. Anahtarda "İPTAL" yok; ham `iptal` hepsinde `false`, `notlar` hepsinde boş.

Genel: Satır sonları birleştirildi; ₺, binlik ayracı ve kitapçıktaki kesme işaretleri (’) korundu. Kitapçık başındaki "Maliyet Muhasebesi sorularında KDV dikkate alınmayacaktır." notu hiçbir soruyu etkilemediği için `ortakBilgi` olarak eklenmedi (2026-1 ile aynı uygulama). Ortak veri bloğu paylaşan soru yok; tüm `ortakBilgi` alanları `null`.

| No | Durum | Ham çıkarıma göre düzeltme | Bağımsız cevap | Resmi cevap | Eşleşme |
|----|-------|----------------------------|----------------|-------------|---------|
| 01 | ok | Şıklarda satır birleştirme | C (elektrik, amortisman, sarf malzemesi) | C | evet |
| 02 | ok | Yalnız satır birleştirme | D (kusurlu mamul) | D | evet |
| 03 | ok | Satır birleştirme; veri paragrafı ile soru cümlesi ayrıldı | A (zaman 21.000 olumsuz; ücret 25.000 olumlu) | A | evet |
| 04 | düzeltildi | Kökteki altı çizili "yanlıştır" `<u>` ile işaretlendi | E | E | evet |
| 05 | ok | Yalnız satır birleştirme | B (30.000) | B | evet |
| 06 | düzeltildi | Altı çizili "yanlıştır" `<u>` ile işaretlendi | A | A | evet |
| 07 | ok | Veri paragrafı ayrı `<p>` | B (550.000 / 10.000 = 55) | B | evet |
| 08 | düzeltildi | I-V öncülleri `<ul class="madde">` listesine çevrildi; altı çizili "yer almaz" `<u>` ile işaretlendi | B (yalnız V) | B | evet |
| 09 | ok | Uzun şıklarda satır birleştirme | A | A | evet |
| 10 | ok | Uzun şıklarda satır birleştirme | E | E | evet |
| 11 | ok | Şıklarda satır birleştirme | D | D | evet |
| 12 | ok | Satır birleştirme; kitapçıkta kalın basılan ikinci paragraf `<strong>` | E (1.300.000) | E | evet |
| 13 | ok | Veri paragrafı ayrı `<p>` | E (840.000 / 100 = 8.400) | E | evet |
| 14 | ok | Veri paragrafı ayrı `<p>` | A (1.500.000 / 100.000 × 80.000 = 1.200.000) | A | evet |
| 15 | ok | Yalnız satır birleştirme | D (70 × 3 = 210) | D | evet |
| 16 | düzeltildi | Ham metinde iki sütunlu tablo hücre hücre ve satır etiketleri ikiye bölünmüş halde dağılmıştı ("Direkt ilk madde ve / 500.000 ₺ / 600.000 ₺ / malzeme gideri" gibi); görüntüden 8 satırlı `veri` tablosu kuruldu (Mayıs 2026 / Haziran 2026) | B (20.000 + 910.000 − 30.000 = 900.000) | B | evet |
| 17 | düzeltildi | Aynı biçimde dağılmış 7 satırlı tablo görüntüden `veri` tablosu olarak kuruldu (Mart 2026 / Nisan 2026) | C (2.060.000 + 450.000 − 300.000 = 2.210.000) | C | evet |
| 18 | ok | Üç paragraf görüntüdeki gibi ayrıldı | C (%40) | C | evet |
| 19 | düzeltildi | Madde işaretli (•) üç satır `<ul>` listesine çevrildi | E (46.600; 47.900; 47.900) | E | evet |
| 20 | ok | Şıklarda satır birleştirme | C | C | evet |

## Anahtar çelişkisi, iptal

Yok. 20 sorunun hepsinde bağımsız çözüm, kırmızı işaret ve cevap anahtarı tablosu aynı şıkkı veriyor. `tools/allow-missing.txt` değiştirilmedi.

## Tartışmalı soru: 2026-2-MAL-08

- **Okuma 1 (resmi anahtar, B "Yalnız V"):** Kapsam olarak gelir tablosunun "C. Satışların Maliyeti (−)" bölümü ve 62 grubu alınırsa bu bölüm dört kalemlidir: 620, 621, 622, 623 (Diğer Satışların Maliyeti dahil). I-IV bu kapsamdadır. Satış indirimleri (610-612) ayrı "B. Satış İndirimleri" bölümündedir. Yer almayan yalnız V'tir.
- **Okuma 2 (lafzi, D "IV ve V"):** MSUGT (1 Sıra No.lu) ek mali tablo "Satışların Maliyeti Tablosu" (Ek Tablo 5) örneği yalnız üç sonuç satırı içerir: Satılan Mamul Maliyeti, Satılan Ticari Mal Maliyeti, Satılan Hizmet Maliyeti. Toplamı "SATIŞLARIN MALİYETİ (I+II+III)" olarak verir; "Diğer Satışların Maliyeti" satırı yoktur. Tablo bu biçimde okunursa IV de yer almaz.
- **Karar (koordinatör):** Anahtar çelişkisi sayılmadı; sınavı hazırlayanların okuması savunulabilir. Çözüm `sonuc: "B"` ile yayımlandı. Çözümde ayrı bir **Not** adımı iki okumayı açıkça anlatır. `tuzaklar.D`, D'nin hangi okumaya dayandığını söyler; kartta tablonun üç satırlı biçimi belirtilir.

## Konu kodları

- 01, 07, 11 → `05-genel-uretim-giderleri-dagitim` (GÜG kapsamı; gider yerleri). 2026-1-MAL-12 ile aynı kodlama.
- 02 → `01-maliyet-kavramlari`: üretim kayıpları (fire, artık, bozuk, kusurlu mamul) için ayrı bir modül yok. Kavram sorusu olduğu için 01'e bağlandı; `07-safha-maliyeti` de savunulabilir.
- 05, 08, 09, 10, 14, 16, 20 → `02-maliyet-akisi-7a-7b`. 10 (732 hesabı) içerik olarak standart maliyet farklarıyla da ilgili, ancak soru 7/A hesap işleyişini sorduğu için 02'de.
- 03, 04 → `09-standart-maliyet-sapma`; 06, 13 → `01-maliyet-kavramlari`; 12 → `06-siparis-maliyeti`; 15 → `08-birlesik-yan-urun`; 17 → `03-direkt-ilk-madde-malzeme`; 18, 19 → `07-safha-maliyeti`.

## Kitapçık ifadeleri ve kuşkular

- Kitapçıkta açık bir baskı hatası bulunamadı.
- **03:** Standart süre "dönemde 2.400 DİS çalışılacağını ... planlamıştır" diye verilmiş; fiili üretime göre izin verilen standart süre olarak kabul edildi (sorunun tek tutarlı yorumu, şıklardaki 21.000 / 25.000 tutarları da bunu doğruluyor).
- **08:** Kitapçık "Satıştan İndirimler" diyor (Tekdüzen hesap planında grup adı "Satış İndirimleri"); aynen aktarıldı. İki okuma için yukarıdaki "Tartışmalı soru" bölümüne bakınız. I-V öncülleri `<ul class="madde">` olarak işaretlendi (madde imi gösterilmez).
- **11:** Çözümde gider yeri türleri "gibi" ile örnek olarak sayıldı. Tebliğdeki tam liste ve sıra burada aktarılmadı.
- **13:** "Memur ücret ve gideri" soruda açıkça "üretimle ilgili olarak katlanılan" maliyetler arasında, bu yüzden GÜG sayıldı.
- **20:** C şıkkında "borçlandığı tutarla" (tekil) yazıyor; aynen aktarıldı. Çözümde 782 Finansman Giderleri Fark Hesabı adı ve 66 grubuna (660/661) kapanış belirtildi.
- **Tuzaklar:** Hangi hatadan üretildiği bulunamayan şıklar için uydurma bir mekanizma yazılmadı, yalnızca "doğru yöntemle bulunamaz" denildi: 12-D, 13-D, 14-C, 15-B, 15-E, 16-E, 17-E, 19-C. 18-A ve 18-D için ise o oranla bulunan eşdeğer miktarın 11.000 br'yi tutmadığı gösterildi.

## Resmî sınav sonrası anahtar (TESMER, 20.08.2026)

Kaynak: `tools/pdfs/resmi-anahtar/2026-2_MAL.pdf` (TESMER soru-cevap arşivi, `https://www2.tesmer.org.tr/files/ortak/soru_cevaplar/smmm/2026/2/03/smmm_2026_2_03.pdf`; A kitapçığı). Anahtar tablosu, sorulardaki kırmızı işaretli şıklar ve “Değerlendirme Dışı” damgaları okundu; tablo ile kırmızı işaretler 20 soruda birebir aynı. Uygulamadaki 20 soru metinle eşleştirildi: numara ve sıra aynı.

Sonuç: **fark yok.** 20 harfin hepsi uygulamadaki `dogru` alanıyla aynı; anahtarda İPTAL satırı yok.
