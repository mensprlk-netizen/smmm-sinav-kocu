# İnceleme notları: 2026-2 Finansal Muhasebe (2026-2-FM)

Kaynak: `tools/pdfs/2026_2_finansal-muhasebe.pdf` (TÜRMOB SMMM 2026-2, A kitapçığı, 4 soru sayfası ve cevap anahtarı sayfası), sayfa görüntüleri `app/img/originals/2026-2-FM-p1..p5.png`.

Yöntem: Her soru görüntüden yeniden yazıldı ve ham çıkarımla (`tools/out/raw/2026-2-FM.json`) karşılaştırıldı. HTML'den arındırılmış metin ile ham metin, 20 kök ve 100 şıkkın hepsinde (boşluklar hariç) karakter karakter aynıdır (betikle denetlendi). Yevmiye tablolarında her satırın tarafı (borç/alacak) ve tutar sütunu görüntüden alındı; şıklardaki her kaydın borç ve alacak toplamlarının eşit olduğu betikle doğrulandı. Her soru önce bağımsız çözüldü, sonra hem kırmızı işaretli şıkla hem de p5'teki resmi "Finansal Muhasebe Cevap Anahtarı" tablosuyla (A kitapçığı sütunu) karşılaştırıldı. Kırmızı işaret ile anahtar tablosu 20 sorunun hepsinde aynı. Anahtarda "İPTAL" yok; ham `iptal` hepsinde `false`, `notlar` hepsinde boş.

Genel: Satır sonları birleştirildi; ₺, binlik ayracı ve kitapçıktaki kesme işaretleri (’) korundu. Kitapçıkta tamamı kalın basılan kökler (01, 02, 03, 11) ve her sorunun kalın soru cümlesi `<strong>` ile korundu; altı çizili "yanlıştır" (07) ve "kullanılmaz" (09) `<u>` ile işaretlendi. Kitapçık başındaki "Soru kökünde aksi belirtilmediği sürece soruları Tekdüzen Muhasebe Sistemi Uygulama Genel Tebliğlerini esas alarak cevaplayınız." notu `ortakBilgi` olarak eklenmedi (2026-1-FM ve MAL dosyalarıyla aynı uygulama); çözümler bu nota göre Tekdüzen işleyişini esas alır, TMS'ye açıkça atıf yapan 18, 19, 20 dışında. Ortak veri bloğu paylaşan soru yok; tüm `ortakBilgi` alanları `null`.

## Konu etiketleri

2026-1-FM'deki 11 etiket aynen kullanıldı; yeni etiket eklenmedi.

- Alacaklar ve senetler: (yok)
- Dönem sonu işlemleri: 04, 14, 16, 17
- Hazır değerler: 05
- KDV işlemleri: (yok)
- Maddi duran varlıklar: 01, 13, 18, 20
- Maddi olmayan duran varlıklar: (yok)
- Mali duran varlıklar: 12
- Menkul kıymetler: 10
- Stoklar: 08, 09, 15, 19
- Yabancı kaynaklar: 02, 06, 11
- Özkaynaklar: 03, 07

Notlar: 04 (borç senedi reeskontu) raporlama tarihindeki değerleme işlemi olduğu için "Dönem sonu işlemleri"nde; 16 (373 Maliyet Giderleri Karşılığı) ara dönem tahakkuku olduğu için yine orada. 13 (kamyonet avansı) 259 Verilen Avanslar 25 Maddi Duran Varlıklar grubunda olduğu için "Maddi duran varlıklar"da. 15 (erken ödeme iskontosu) KDV düzeltmesi içerse de sınanan nokta iskontonun 153 Ticari Mallar maliyetinden düşülmesi olduğu için "Stoklar"da. 18 (TMS 40 transferi) için ayrı bir yatırım amaçlı gayrimenkul etiketi yok; arsa 250 Arazi ve Arsalar'dan aktarıldığı için "Maddi duran varlıklar"da. 05 (mevduat faizi ve stopaj) "Hazır değerler"de.

## Soru bazında tablo

| No | Durum | Ham çıkarıma göre düzeltme | Bağımsız cevap | Resmi (kırmızı = anahtar) | Eşleşme |
|----|-------|----------------------------|----------------|---------------------------|---------|
| 01 | ok | Satır birleştirme; tamamı kalın kök `<strong>` | A (252 Binalar; değer artırıcı harcama) | A | evet |
| 02 | ok | Satır birleştirme; kalın kök | E (405 Çıkarılmış Tahviller) | E | evet |
| 03 | ok | Satır birleştirme; kalın kök | E (520 Hisse Senedi İhraç Primleri) | E | evet |
| 04 | ok | Veri paragrafı ile kalın soru cümlesi ayrıldı | A (322 / 647 1.000) | A | evet |
| 05 | ok | Veri paragrafı ile kalın soru cümlesi ayrıldı | C (102 1.700 + 193 300 / 642 2.000) | C | evet |
| 06 | düzeltildi | Kökteki kayıt ham metinde satır satır dağılmıştı; görüntüden `yevmiye` tablosu (102 XX, 308 XX borç; 305 XX alacak) kuruldu | B (bononun iskontolu ihracı) | B | evet |
| 07 | düzeltildi | Altı çizili "yanlıştır" `<u>`; D şıkkında satır birleştirme | D (520 40.000 alacaklandırılır, borç değil) | D | evet |
| 08 | ok | Satır birleştirme | B (197 / 153 500) | B | evet |
| 09 | düzeltildi | Altı çizili "kullanılmaz" `<u>` | A (689 kullanılmaz; 654/158, 621/153, 158/644) | A | evet |
| 10 | düzeltildi | Kökteki kayıt görüntüden `yevmiye` tablosu (102 XX, 119 XX borç; 110 XX alacak); iki satıra bölünmüş "119 MENKUL KIYMETLER DEĞER DÜŞÜKLÜĞÜ KARŞILIĞI" birleştirildi | B (beklenen fiyatla satış) | B | evet |
| 11 | ok | Satır birleştirme; kalın kök | C (Mali Borçlar) | C | evet |
| 12 | ok | Satır birleştirme | D (%60 > %50: iştirak → bağlı ortaklık) | D | evet |
| 13 | ok | Satır birleştirme | A (259 Verilen Avanslar) | A | evet |
| 14 | ok | Kalın soru cümlesi ve "(Bir yıl 360 gün olarak alınacaktır)" ayrı paragraflar | E (100.000 × %24 × 60/360 = 4.000; 780 / 381) | E | evet |
| 15 | ok | Satır birleştirme | B (320 2.400 / kasa-banka 2.256, 153 120, 191 24) | B | evet |
| 16 | düzeltildi | Beş şıkkın yevmiye kayıtları ham metinde düz satırlardı; görüntüden `yevmiye` tabloları kuruldu (A: 760 100, 373 600, 191 140 / 102 840) | A | A | evet |
| 17 | düzeltildi | İki satıra bölünmüş hesap adları birleştirildi, beş kayıt `yevmiye` tablosu | C (691 / 370 2.500) | C | evet |
| 18 | düzeltildi | Çok satırlı hesap adları birleştirildi, beş kayıt `yevmiye` tablosu | E (245 40.000 / 250 30.000, 551 10.000) | E | evet |
| 19 | düzeltildi | Dört satırlık gider verisi `veri` tablosu; beş kayıt `yevmiye` tablosu (E'de 624 satırı borç tarafında) | D (188.000; 12.000 dağıtılmayan sabit GÜG gider) | D | evet |
| 20 | ok | Satır birleştirme | C ((4.000 − 500) × 200 / 1.000 = 700) | C | evet |

## Anahtar çelişkisi

Yok. 20 sorunun hepsinde bağımsız çözüm, kırmızı işaret ve cevap anahtarı tablosu aynı şıkkı veriyor. `tools/allow-missing.txt` değiştirilmedi.

## Tartışmalı soru

Yok. Aşağıdaki 01, 09 ve 14 notları resmi cevabı değiştiren ikinci bir okuma değildir; çözümlerde birer **Not** adımıyla açıklandı.

## İptal edilen soru

Yok (anahtar tablosunda "İPTAL" yok).

## Baskı hataları ve kuşkular

- **18 (baskı hatası):** Kök "TMS 40 … göre *binanın* sınıf değişikliği" diyor; soru bir arsa hakkındadır, doğrusu "arsanın". Metin kitapçıktaki gibi bırakıldı, çözümün Not adımı bunu belirtir. Cevap etkilenmez.
- **18 ve 19 (hesap kodları):** Kitapçık TMS uygulamasına özgü bir kodlama kullanıyor: 245 Gerçeğe Uygun Değerle Ölçülen Yatırım Amaçlı Gayrimenkuller, 647 Yatırım Amaçlı Gayrimenkullerden Elde Edilen Gelir ve Kazançlar, 551 Maddi Duran Varlıklar Yeniden Değerleme Artışları, 624 Dağıtılmayan Sabit Genel Üretim Giderleri. 1 Sıra No.lu MSUGT ekindeki klasik hesap planında 245 Bağlı Ortaklıklar, 647 Reeskont Faiz Gelirleri, maddi duran varlık yeniden değerleme artışları 522'dir; 551 ve 624 kodları yoktur. Kodlar aynen aktarıldı; çözümler hesap adları üzerinden yürür. 18'in Not adımı bunu açıklar. 12'nin çözümünde Bağlı Ortaklıklar için klasik kod (245) kullanıldı ve "klasik hesap planında" diye belirtildi.
- **18 (TMS 40 kullanım değişikliği):** TMS 40, transfer için kullanım amacındaki değişikliğin kanıtlanmasını ister; yönetimin niyet değişikliği tek başına yeterli kanıt sayılmaz. Soru transferi verili kabul ettiği için çözüm bu noktaya girmez.
- **01:** "Dış cephe yalıtımı ve yenilemesi" değer artırıcı harcama olarak ele alındı (resmi cevap A). Harcama yalnız boya-badana gibi olağan bakım olsaydı 770 Genel Yönetim Giderleri (C) olurdu; çözümde Not adımı var. Sorunun "satın aldığı" vurgusu tuzağın 264 Özel Maliyetler olduğunu gösteriyor.
- **09:** Resmi cevap, karşılık ayrılan stok satıldığında 158'in 644 Konusu Kalmayan Karşılıklar'a kapatıldığı Tekdüzen işleyişine dayanır. Karşılığın maliyetle netleştirildiği ya da aynı dönemde 654'e alacak yazılarak iptal edildiği uygulamalarda 644 de kullanılmamış olur ve soru iki cevaplı hale gelir; 689 ise her durumda kullanılmaz, yani resmi cevap her iki okumada da doğrudur. Çözümde Not adımı var. Satış KDV'si için %20 varsayıldı (oran verilmemiş; cevabı etkilemez).
- **10:** Sorudaki kayıt net gösterimdir (karşılık doğrudan satış kaydında kapanıyor). Karşılığın 644'e kapatıldığı brüt gösterim çözümde Not olarak anlatıldı; 2026-1-FM-05 ile aynı yaklaşım.
- **14:** 1 Kasım–31 Aralık 360 günlük yıl esasıyla 60 gün alındı (30 günlük aylar); bu, şıklardaki 4.000 ₺ ile tutarlı. Kredi faiz tahakkukunun 300 Banka Kredileri'ne alacak yazıldığı uygulama şıklarda yok; çözümde Not adımı var.
- **15:** Erken ödeme iskontosu, mal aynı dönemde alındığı için 153'ten düşüldü; KDV düzeltmesi alıcı tarafında 191'e alacak (KDVK md. 35).
- **Yazım:** Kitapçık 16'da "itibarıyla", 17 ve 20'de "itibariyle" yazıyor; 06'da "308 MENKUL KIYMETLER İHRAÇ FARKLARI" (hesap planında "Menkul Kıymet İhraç Farkları"), 02-C'de "Uzun Vadeli Kredilerin Anapara Taksit ve Faizleri" (hesap planında "Taksitleri"). Hepsi aynen aktarıldı.
- **Tuzaklar:** Mekanizması bulunamayan tek şık için uydurma açıklama yazılmadı: 20-A ("doğru yöntemle bulunamaz"). 19-A (140.000 = değişken giderler), 19-C (100.000 = ilk maliyet), 20-D (800, hurda düşülmeden), 20-E (900, hurda eklenerek), 14-A/C (2.000 = 30 günlük faiz), 16-B/C (gider 1.300 / 1.200) aritmetikle doğrulandı.
- **Dayanak atıfları:** Madde/paragraf numarası yalnız kesin bilinenlerde verildi: VUK md. 272 (değerini artıran giderler), md. 278 (değeri düşen mallar), md. 285 (borçların değerlemesi, reeskont); KDVK md. 35 (matrahta değişiklik); TMS 2 par. 13; TMS 40 par. 61-63. TMS 16 için paragraf numarası verilmedi.
