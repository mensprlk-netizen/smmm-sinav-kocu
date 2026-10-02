# İnceleme notları: 2026-1 Maliyet Muhasebesi (2026-1-MAL)

Kaynak: `tools/pdfs/2026_1_maliyet-muhasebesi.pdf` (TÜRMOB-TESMER, A kitapçığı, s. 7-11), sayfa görüntüleri `app/img/originals/2026-1-MAL-p1..p5.png`.
Yöntem: Her soru görüntüden yeniden yazıldı, ham çıkarımla (`tools/out/raw/2026-1-MAL.json`) karşılaştırıldı. Her soru, kırmızı işaretli şıkka bakılmadan çözüldü, sonra resmi anahtarla karşılaştırıldı. Resmi anahtar hem görüntüdeki kırmızı şıkla hem de PDF metin katmanındaki renk bilgisiyle (0xff0000) teyit edildi. Ham `notlar` hepsinde boş, `iptal` hepsinde `false`; görüntüde "İPTAL" ibaresi yok.

Genel: Ham metindeki satır sonları birleştirildi, ₺ ve binlik ayracı korundu. Kitapçık başındaki "Maliyet Muhasebesi sorularında KDV dikkate alınmayacaktır." notu hiçbir soruyu etkilemediği için `ortakBilgi` olarak eklenmedi.

| No | Durum | Ham çıkarıma göre düzeltme | Bağımsız cevap | Resmi cevap | Eşleşme |
|----|-------|----------------------------|----------------|-------------|---------|
| 01 | ok | Yalnız satır birleştirme | C (138.750; 79.000) | C | evet |
| 02 | düzeltildi | Dağınık tablo satırları `veri` tablosuna dönüştürüldü ("Yüklenen (Standart) GÜG", "Gerçekleşen GÜG" satırları birleştirildi). C şıkkındaki "Eksik (+) 66.148" kitapçıktaki gibi korundu (kitapçıktaki tutarsız işaret) | B (+35.150; −2.076; +33.074) | B | evet |
| 03 | ok | D şıkkında satır birleştirme | A | A | evet |
| 04 | düzeltildi | Ham metinde dört sütunlu tablo hücre hücre dağılmıştı; görüntüden `veri` tablosu kuruldu (Faaliyet / GÜG Yükleme Verisi / Bütçelenmiş GÜG (₺) / Bütçelenmiş İşlem Sayısı, TOPLAM satırı). Şıklardaki satır kırılımları birleştirildi | C (900; 600; 8.250; 5.200) | C | evet |
| 05 | ok | Yalnız satır birleştirme | E (13.000; 6.500) | E | evet |
| 06 | ok | Şıklarda satır birleştirme | C | C | evet |
| 07 | düzeltildi | Kökteki altı çizili "değildir" `<u>` ile işaretlendi | E | E | evet |
| 08 | düzeltildi | "Etiket : tutar" satırları `<ul>` listesine çevrildi | C (22.000) | C | evet |
| 09 | düzeltildi | Dağınık tablo `veri` tablosuna dönüştürüldü (Dönembaşı / Dönemsonu; DİMM, Yarımamul, Mamul stok) | A (10.000) | A | evet |
| 10 | düzeltildi | Altı çizili "değildir" `<u>` ile işaretlendi | E | E | evet |
| 11 | ok | Şıklarda satır birleştirme | D | D | evet |
| 12 | ok | Şıklarda satır birleştirme | D | D | evet |
| 13 | ok | Yalnız satır birleştirme | B | B | evet |
| 14 | düzeltildi | Ham şıklar yevmiye kayıtlarını karışık sırayla veriyordu (B ve D'de "YANSITMA HESABI" tutardan sonra kopmuş). Her şık görüntüden iki ayrı `yevmiye` tablosu (iki kayıt) olarak yeniden kuruldu | A (622/741, 741/740) | A | evet |
| 15 | ok | Yalnız satır birleştirme | D (230.000; 220.000) | D | evet |
| 16 | ok | Yalnız satır birleştirme | B (57,5 ₺/kg; 132,5 ₺/DİS) | B | evet |
| 17 | ok (soru) / çözüm yok | Yalnız satır birleştirme; rakamlar PDF metin katmanından ayrıca teyit edildi | Hiçbir şık tam doğru değil (yan ürüne ortak maliyetten 150.000 ₺, ana ürüne 4.850.000 ₺) | E | **hayır: ANAHTAR ÇELİŞKİSİ** |
| 18 | düzeltildi | Dağınık tablo `veri` tablosuna dönüştürüldü (Mamuller / Katsayılar / Üretim Miktarı) | B (500.000; 800.000; 300.000) | B | evet |
| 19 | ok | Yalnız satır birleştirme | C (2.500.000) | C | evet |
| 20 | ok | Yalnız satır birleştirme | D (3.750; 1.250) | D | evet |

## ANAHTAR ÇELİŞKİSİ: 2026-1-MAL-17

**Veri (görüntü ve PDF metin katmanıyla teyitli):** Ortak maliyet 5.000.000 ₺; yan ürün satış tutarı 250.000 ₺; satış tutarı üzerinden yan ürün kârlılığı %20; satışa hazır hale getirme ek maliyeti 50.000 ₺; yöntem "Satış Fiyatından Geriye Doğru Hesaplama". Resmi anahtar: **E (350.000 ₺; 4.650.000 ₺)**.

**Bağımsız çözüm (iki kez kontrol edildi):**
- Satış fiyatından geriye doğru hesaplama (maliyet indirgeme) yönteminde yan ürünün ortak maliyetten alacağı pay = Satış tutarı − Normal kâr − Ayrılma noktasından sonraki ek maliyetler.
- Normal kâr = 250.000 × %20 = 50.000 ₺.
- Yan ürünün ortak maliyet payı = 250.000 − 50.000 − 50.000 = **150.000 ₺**; yan ürünün toplam maliyeti (ek maliyet dahil) = 150.000 + 50.000 = **200.000 ₺** (= satış − kâr).
- Ana ürüne kalan ortak maliyet = 5.000.000 − 150.000 = **4.850.000 ₺**.

**Neden hiçbir şık eşleşmiyor:**
- 4.850.000 ₺ hiçbir şıkta yok. Tüm şıklar toplamı 5.000.000 ₺ olacak biçimde kurulmuş.
- A (200.000; 4.800.000): Yan ürünün toplam maliyeti (200.000) doğru, ancak ana ürün için ortak maliyetten 200.000 düşülmüş. 50.000 ₺ ek maliyet ortak maliyetin parçası değildir, bu nedenle ana ürün 4.850.000 olmalıdır.
- E (350.000; 4.650.000): 350.000 = 250.000 + 50.000 + 50.000, yani kâr ve ek maliyet satış tutarından düşüleceği yerde eklenmiş. Ayrıca yan ürüne kendi satış tutarından (250.000) fazla maliyet yüklemek, sorudaki %20 kârlılık varsayımıyla çelişir: 250.000 − 350.000 = 100.000 ₺ zarar çıkar.
- Başka bir yorumla da (örneğin kârın maliyet üzerinden alınması: 250.000/1,2 ≈ 208.333; ya da ek maliyetin dahil/hariç tutulması) 350.000 ₺'ye ulaşılamıyor.

**Karar:** Görev kuralı gereği bu sorunun çözümü `app/data/solutions/2026-1-MAL.json` dosyasına **eklenmedi**. Soru, resmi anahtar (`dogru: "E"`) ile soru dosyasında duruyor. `validate.py` bu nedenle tek bir satır üretir: `2026-1-MAL-17: çözüm yok`. Kullanıcı kararı gerekiyor: (a) çözümsüz bırakmak, (b) "resmi anahtar E; doğru hesap 150.000 / 4.850.000, hiçbir şık doğru değil" açıklamalı bir çözüm yazmak (bunun için `validate.py`'nin `sonuc` alanıyla eşleşme kuralına bir istisna gerekir), (c) TESMER'in sonradan bir cevap değişikliği veya iptal duyurusu yapıp yapmadığını kontrol etmek. smmmonline.com 2026-1 sayfasında iptal veya değişiklik notu bulunamadı.

## Diğer notlar ve kuşkular

- **02:** Resmi C şıkkı kitapçıkta "Eksik (+) 66.148" diye basılmış (işaret ile ifade tutarsız). Kitapçıktaki gibi aktarıldı; cevabı etkilemiyor.
- **07:** B şıkkı kitapçıkta "Maliyet fonksiyonları ve satış fiyatı gerçektir." diye yazıyor (ders kitaplarında genellikle "doğrusaldır/belirlidir"). Aynen aktarıldı. Çözümde bunun bir MHK varsayımını (belirli ve doğrusal fonksiyonlar) anlattığı açıklandı.
- **20:** Kök "birim maliyetleri" diyor ama mamul miktarı verilmemiş. Şıklar, her mamulün NSD yöntemiyle ortak maliyetten aldığı payları (3.750 / 1.250) gösteriyor. Çözümde bu açıkça belirtildi (her mamulden bir birim kabulü; ek maliyetler paya dahil değil). Ortak maliyetin (5.000 ₺) toplam NSD'den (800 ₺) büyük olması ekonomik olarak gerçekçi değil, ancak hesap yöntemi ve cevap net.
- **04, 05, 15, 16, 18, 20 tuzakları:** Bazı yanlış şıkların hangi hatadan üretildiği tersine bulunamadı (örn. 04-B, 16'daki 75 ve 157,5, 18-A/C/D/E, 20-C/E). Bu şıklar için "yönteme göre tutarsız" açıklaması yazıldı, uydurma bir hata mekanizması yazılmadı.
