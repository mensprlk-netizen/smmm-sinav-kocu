# İnceleme notları: 2026-1 Finansal Muhasebe (2026-1-FM)

Kaynak: `tools/pdfs/2026_1_finansal-muhasebe.pdf` (TÜRMOB-TESMER SMMM 2026-1, A kitapçığı), sayfa görüntüleri `app/img/originals/2026-1-FM-p1..p6.png`. 2026-1 kitapçıklarında cevap anahtarı tablosu yoktur; resmi cevap, şık harfi kırmızı basılan şıktır.

Yöntem: Soru dosyası (`app/data/questions/2026-1-FM.json`) önceki bir oturumda yazılmış, denetimi bitmeden kalmıştı. Her soru sayfa görüntüsüyle tek tek karşılaştırıldı: metin, sayılar, hesap kodları ve adları, yevmiye şıklarında satırların borç/alacak tarafı ve tutar sütunu, kalın yazılar, kırmızı işaretli şık. Ayrıca HTML'den arındırılmış metin ile ham çıkarım (`tools/out/raw/2026-1-FM.json`) betikle karşılaştırıldı: 20 sorunun kökü ve 100 şıkkın hepsi (boşluklar hariç) karakter karakter aynı; `dogru`, `iptal`, `orijinal` alanları hamla aynı, ham `notlar` hepsinde boş. Yevmiye şıkları satır satır (taraf, hesap, borç, alacak) dökülüp görüntüyle karşılaştırıldı. Sonuç: soru dosyasında düzeltme gerekmedi. Her soru önce bağımsız çözüldü, sonra kırmızı işaretli şıkla karşılaştırıldı.

Genel: Kitapçıkta tamamı kalın basılan kökler (2, 8'in iki paragrafı, 20) `<strong>` ile korundu. Ortak veri bloğu paylaşan soru yok; tüm `ortakBilgi` alanları `null`. İPTAL edilen soru yok.

## Konu etiketleri

2026/2 Finansal Muhasebe dosyası da tam olarak bu etiketleri kullanacaktır (11 etiket, devralınan dosyadaki gibi; değişiklik yapılmadı):

- Alacaklar ve senetler: 02, 07, 13
- Dönem sonu işlemleri: 11, 17
- Hazır değerler: 14
- KDV işlemleri: 08
- Maddi duran varlıklar: 03, 18
- Maddi olmayan duran varlıklar: 20
- Mali duran varlıklar: 04
- Menkul kıymetler: 05, 15
- Stoklar: 01, 12, 16, 19
- Yabancı kaynaklar: 06, 10
- Özkaynaklar: 09

Not: 01 (satıcı adına ödenen alış taşıma gideri) kayıt olarak 320 Satıcılar'ı etkiler, ancak soru ticari mal alışına ilişkin giderin kime ait olduğunu sınadığı için "Stoklar"da bırakıldı. 13 (ileri tarihli çek) 101 Alınan Çekler'den 121 Alacak Senetleri'ne aktarımı sınadığı için "Alacaklar ve senetler"de.

## Soru bazında tablo

| No | Durum | Devralınan dosyaya göre düzeltme | Bağımsız cevap | Resmi (kırmızı) | Eşleşme |
|----|-------|----------------------------------|----------------|-----------------|---------|
| 01 | ok | yok | A (320 Satıcılar 4.800 / 100 Kasa 4.800) | A | evet |
| 02 | ok | yok | C (121 3.200 / 121 3.000, 642 200) | C | evet |
| 03 | ok | yok | D (760 3.000 + 549 7.000 / 257 10.000) | D | evet |
| 04 | ok | yok | A (132 / 640 13.000) | A | evet |
| 05 | ok | yok | B (102 50.000 + 112 12.500 / 110 60.000, 644 2.500) | B | evet |
| 06 | ok | yok | B (102 92.600 + 780 1.000 + 308 6.400 / 305 100.000) | B | evet |
| 07 | ok | yok | A (129 7.000 + 689 5.000 / 128 12.000) | A | evet |
| 08 | ok | yok | D (fark 360 Ödenecek Vergi ve Fonlar) | D | evet |
| 09 | ok | yok | D (102 400.000 / 501 80.000, 520 320.000) | D | evet |
| 10 | ok | yok | E (326 / 120 15.000) | E | evet |
| 11 | ok | yok | C (181 Gelir Tahakkukları borç) | C | evet |
| 12 | ok | yok | C (FIFO: 6.000 + 14.000 + 22.000 = 42.000) | C | evet |
| 13 | ok | yok | E (121 borç / 101 alacak) | E | evet |
| 14 | ok | yok | A (320 / 100 1.000) | A | evet |
| 15 | ok | yok | E (110 10.000 / 102 10.000) | E | evet |
| 16 | ok | yok | C (621 / 153 2.000) | C | evet |
| 17 | ok | yok | B (760 60.000 / 180 60.000; 180'de 20.000 kalır) | B | evet |
| 18 | ok | yok | D (254 25.000 / 257 10.000, 522 15.000) | D | evet |
| 19 | ok | yok | B (NGD 29.000; 1.000 karşılık) | B | evet |
| 20 | ok | yok (kitapçıktaki "TMS 36" aynen bırakıldı) | A | A | evet |

## Anahtar çelişkisi

Yok. 20 sorunun hepsinde bağımsız çözüm kırmızı işaretli şıkla aynı. `tools/allow-missing.txt` değiştirilmedi.

## Tartışmalı soru

Yok. Aşağıdaki "kuşkular" bölümündeki 06 ve 07, resmi cevabı değiştirecek ikinci bir okuma olarak değil, öğretici açıklama gerektiren noktalar olarak not edildi.

## Baskı hataları ve kuşkular

- **20 (baskı hatası):** Kökte "TMS 36 Maddi Olmayan Duran Varlıklar" yazıyor. TMS 36 Varlıklarda Değer Düşüklüğü standardıdır; Maddi Olmayan Duran Varlıklar TMS 38'dir. Soru metni kitapçıktaki gibi bırakıldı; çözümün ilk adımı ve bir kart bunu açıkça belirtir. Cevap etkilenmez. "Geliştirme giderleri aktifleştirilir" ifadesi koşula bağlıdır (TMS 38 par. 57); çözüm bunu söyler, diğer dört şık kesin yanlış olduğu için cevap tartışmalı değildir.
- **06:** Resmi cevap (B) Tekdüzen işleyişine dayanır: 308 yalnız nominal değer ile satış bedeli farkını (6.400) izler, işlem masrafı 780'e yazılır. TFRS 9'a göre raporlayan bir işletmede işlem maliyeti borcun ilk ölçümünden düşülüp etkin faizle vadeye yayılır; bu bakışla A'daki 7.400 ekonomik olarak savunulabilir. Soru TFRS'ye atıf yapmıyor (TMS'ye dayanan 18, 19, 20 bunu açıkça yazıyor), bu yüzden Tekdüzen okuması esas alındı. Çözümde ayrı bir **Not** adımı bu farkı açıklar.
- **07:** Karşılık ayrılmamış 5.000 ₺ için resmi cevap 689 Diğer Olağandışı Gider ve Zararlar'dır; bu, değersiz alacaklar için yaygın ders kitabı ve sınav uygulamasıdır. Bazı kaynaklar bu kısmı 654 Karşılık Giderleri üzerinden de gösterir, ancak 654 şıklarda yok. D'deki 659 için tuzak açıklaması hesap sınıfı farkını söyler.
- **05:** Resmi cevap net gösterime dayanır (bedel − net değer = 2.500 ₺ → 644). Karşılığın tamamını 644'e kapatıp 10.000 ₺'yi 655'e yazan brüt gösterim şıklarda yer almadığı için çözümde **Not** olarak anlatıldı; net etki aynıdır.
- **02:** Soru KDV vermiyor; vade farkı uygulamada KDV matrahına girer, ancak çözüm sorudaki veriyle 200 ₺'nin tamamını faiz geliri olarak alır ve bunu parantez içinde belirtir.
- **03:** Dönem içi alış tarihi verilmediği için tam yıl amortisman (50.000 / 5 = 10.000) hesaplandı; kamyonet binek otomobil olmadığından kıst amortisman sorunu yoktur. Yenileme fonunun tamamı (7.000) ilk yıl amortismanına (10.000) sığdığı için tek kayıtta mahsup edildi.
- **Tuzaklar:** Mekanizması bulunamayan şıklar için uydurma açıklama yazılmadı: 18-A ("20.000 ₺ doğru yöntemle bulunamaz") ve 19-E ("11.000 ₺ doğru yöntemle bulunamaz"). 12-B (1.700 × 20) ve 12-D (1.700 × 25, birim maliyetlerin basit ortalaması), 05-D (50.000 − 35.000) ve 05-E (60.000 − 35.000) aritmetikle doğrulandı.
- **Dayanak atıfları:** Madde/paragraf numarası yalnız kesin bilinenlerde verildi: VUK md. 328 (yenileme fonu), VUK md. 322 ve 323 (değersiz ve şüpheli alacaklar), TMS 38 par. 54 ve 57. TMS 16 ve TMS 2 için paragraf numarası verilmedi.

## Resmî sınav sonrası anahtar (TESMER, 11.06.2026)

Kaynak: `tools/pdfs/resmi-anahtar/2026-1_FM.pdf` (TESMER soru-cevap arşivi, `https://www2.tesmer.org.tr/files/ortak/soru_cevaplar/smmm/2026/1/01/smmm_2026_1_01.pdf`; A kitapçığı). Anahtar tablosu, sorulardaki kırmızı işaretli şıklar ve “Değerlendirme Dışı” damgaları okundu; tablo ile kırmızı işaretler 20 soruda birebir aynı. Uygulamadaki 20 soru metinle eşleştirildi: numara ve sıra aynı.

Sonuç: 20 harfin hepsi uygulamadaki `dogru` alanıyla aynı; fark yalnız iptal işaretinde:
- **14: İPTAL** (işaretli A). Uygulamada iptal değildi; `iptal: true` yapıldı, `dogru` (A) korundu, `cevapNotu` eklendi; mevcut çözüm işaretli şıkkı esas aldığı için korundu.
