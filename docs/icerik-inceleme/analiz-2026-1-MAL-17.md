# 2026-1-MAL-17 Analizi: Yan Ürün, "Satış Fiyatından Geriye Doğru Hesaplama"

**Tarih:** 2026-10-03
**Kapsam:** SMMM Yeterlilik 2026/1 (25 Nisan 2026), Maliyet Muhasebesi, A kitapçığı 17. soru
**Uygulamadaki durum:** `app/data/questions/2026-1-MAL.json` içinde `dogru: "E"`, `iptal: false`, çözüm yok (`tools/allow-missing.txt`)

## Kısa sonuç

**TESMER bu soruyu iptal etmiştir.** TESMER'in soru-cevap arşivinde bugün yayımlanan 2026/1 Maliyet Muhasebesi dosyasının (PDF oluşturulma tarihi 11.06.2026, itiraz sürecinden sonra) cevap anahtarı sayfasında 17. satır kırmızıyla vurgulanmış ve **"E İPTAL"** diye işaretlenmiştir. Aynı dosyada 17. sorunun üzerinde **"Değerlendirme Dışı"** damgası vardır. Depodaki kitapçık (`tools/pdfs/2026_1_maliyet-muhasebesi.pdf`) ise sınav öncesi hazırlanmış Word sürümüdür (oluşturulma tarihi 02.04.2026). Bu sürümde iptal bilgisi yoktur. Önceki iki çözücünün "anahtar savunulamaz" yargısı resmî kararla örtüşüyor.

Aynı anahtar sayfasında **20. soru da (2026-1-MAL-20, işaretli D) İPTAL** edilmiştir. Uygulamada bu soru iptal değil ve D cevaplı bir çözümle yayımlanıyor (bkz. §5.3).

Hesap tarafında E (350.000 / 4.650.000) bilinen hiçbir yan ürün yöntemiyle sorunun verisinden çıkmıyor. En sade açıklama bir **işaret hatasıdır**: 250.000 + 50.000 (kâr) + 50.000 (ek maliyet) = 350.000. Standart yöntemde bu iki kalem toplanmaz, düşülür. Doğru sonuç (150.000 / 4.850.000) şıklarda yok. Yani anahtarlı soru, iptal kararı olmasa da (b) sınıfındadır: E yalnızca bir hatayla elde ediliyor.

---

## 1. Soru metni ve transkripsiyon denetimi

### 1.1 Karşılaştırılan kaynaklar
- JSON: `app/data/questions/2026-1-MAL.json` → `2026-1-MAL-17` (`orijinal.sayfa: 4`).
- Depodaki kitapçık: `tools/pdfs/2026_1_maliyet-muhasebesi.pdf`, s. 4, sağ sütun. 200 dpi kırpılarak görsel olarak okundu. Metin katmanı da ayrıca çıkarıldı.
- TESMER'in güncel dosyası: `https://www2.tesmer.org.tr/files/ortak/soru_cevaplar/smmm/2026/1/03/smmm_2026_1_03.pdf` (6 sayfa; ABBYY FineReader, 11.06.2026). Metin katmanı ve sayfa görüntüsü incelendi.

### 1.2 Kitapçıktaki metin (görüntüden, satır satır)
> 17. E Endüstri İşletmesi'nde Yan Ürün maliyeti, "Satış Fiyatından Geriye Doğru Hesaplama Yöntemi" kullanılarak hesaplanmaktadır. İşletmede Ortak Maliyet 5.000.000 ₺, yan ürün satış tutarı 250.000 ₺, satış tutarı üzerinden yan ürün kârlılığı %20, yan ürünün satışa hazır hale gelmesi için ek maliyet 50.000 ₺'dir.
> **İşletmede yan ürünlere ve ana ürüne yüklenecek toplam maliyetler aşağıdakilerden hangisinde sırasıyla doğru olarak verilmiştir?**
> A) 200.000 ₺, 4.800.000 ₺ · B) 250.000 ₺, 4.750.000 ₺ · C) 275.000 ₺, 4.725.000 ₺ · D) 300.000 ₺, 4.700.000 ₺ · **E) 350.000 ₺, 4.650.000 ₺** (kırmızı)

### 1.3 Denetim sonucu
| Öğe | JSON | Görüntü | PDF metin katmanı | TESMER 11.06 sürümü |
|---|---|---|---|---|
| Ortak maliyet | 5.000.000 ₺ | 5.000.000 ₺ | aynı | aynı |
| Yan ürün satış tutarı | 250.000 ₺ | 250.000 ₺ | aynı | aynı |
| Kârlılık | "satış tutarı üzerinden … %20" | aynı | aynı | aynı |
| Ek maliyet | 50.000 ₺ ("satışa hazır hale gelmesi için") | aynı | aynı | aynı |
| Yöntem adı | "Satış Fiyatından Geriye Doğru Hesaplama Yöntemi" | aynı | aynı | aynı |
| Kök | "yan ürünlere ve ana ürüne yüklenecek toplam maliyetler … sırasıyla" | aynı | aynı | aynı |
| Şıklar A–E | 5 çift, yukarıdaki gibi | aynı | aynı | aynı |
| İşaretli şık | E | E (kırmızı) | — | E (kırmızı) + "Değerlendirme Dışı" damgası |

**Transkripsiyon hatası yok.** Rakamlar, yüzde, "ana/yan ürün" sırası ve şıkların hepsi karakter karakter tutuyor. Bu yüzden ilk hipotez ("hata bizim aktarımımızda") elendi. TESMER'in sonradan yayımladığı sürümde de soru metni aynıdır. Yani TESMER metni düzeltmedi, soruyu iptal etti.

### 1.4 Kökteki belirsizlikler
1. **Kâr tabanı açık:** "satış tutarı üzerinden … %20" ifadesi kârın satış tutarı üzerinden hesaplandığını söylüyor. Kâr = 250.000 × %20 = 50.000 ₺. Maliyet ya da net satış tabanlı okumalar da aşağıda hesaplandı. Hiçbiri bir şıkka çıkmıyor.
2. **50.000 ₺ toplam mı, birim mi?** Miktar verilmediği için yalnız toplam olarak okunabilir.
3. **50.000 ₺ ek işleme mi, satış gideri mi?** "Satışa hazır hale gelmesi için ek maliyet" ayrılma sonrası ek işleme maliyetidir. İki okumada da formüldeki yeri aynı olduğu için (satış tutarından düşülür) sonuç değişmez.
4. **"Yüklenecek toplam maliyet"** iki anlama gelebilir: (a) ortak maliyetten alınan pay, (b) yan ürünün toplam stok maliyeti (pay + ek maliyet). Şıklarda yan + ana her zaman 5.000.000 ediyor. Bu da sınavı hazırlayanın (a) okumasını, yani ortak maliyetin bölüşümünü kastettiğini gösteriyor. Aynı kitapçıktaki 05, 18 ve 20. sorular da ortak maliyet paylarını soruyor ve şıkları ortak maliyet toplamına eşit.
5. **Sayısal çakışma:** kâr (250.000 × %20) ile ek maliyet aynı tutarda: 50.000 = 50.000. Bu yüzden birçok farklı formül aynı sayıya çıkıyor (aşağıdaki tabloda 12 ve 13 numaralı satırlar). Ters mühendisliği zorlaştıran temel etken budur.

---

## 2. Yöntem envanteri ve hesaplar

Gösterim: S = 250.000 (yan ürün satış tutarı), k = %20, kS = 50.000 (normal kâr), X = 50.000 (ek maliyet), C = 5.000.000 (ortak maliyet). Hesaplar `scratchpad/mal17/mal17.py` ile kesirli aritmetikle yapıldı (çıktı Ek A'da).

| # | Yöntem / okuma | Formül | Yan ürün | Ana ürün | Şık |
|---|---|---|---:|---:|---|
| 1 | **Satış fiyatından geriye doğru (standart)**: kâr satış üzerinden | pay = S − kS − X; ana = C − pay | **150.000** | **4.850.000** | **yok** |
| 2 | Aynısı, yan ürünün *toplam* stok maliyeti (pay + ek) | 150.000 + 50.000; ana = C − 150.000 | 200.000 | 4.850.000 | kısmi (yalnız yan = A) |
| 3 | S − kâr ortak maliyetten düşülür (ek maliyet ortak maliyetin içindeymiş gibi) | S − kS; ana = C − (S − kS) | 200.000 | 4.800.000 | A |
| 4 | Kâr maliyet üzerinden (÷ 1,20) | S/1,20 − X | 158.333,33 | 4.841.666,67 | yok |
| 5 | Kâr maliyet üzerinden, yan toplam = S/1,20 | S/1,20 | 208.333,33 | 4.841.666,67 | yok |
| 6 | Kâr net satış (NGD) üzerinden | (S − X) × 0,80 | 160.000 | 4.840.000 | yok |
| 7 | Kâr NGD'nin maliyeti üzerinden | (S − X)/1,20 | 166.666,67 | 4.833.333,33 | yok |
| 8 | Net gerçekleşebilir değer / net hasılatı ortak maliyetten indirme (kâr düşülmez; TMS 2 md. 14) | S − X | 200.000 | 4.800.000 | A |
| 9 | Brüt satış hasılatını ortak maliyetten indirme | S | 250.000 | 4.750.000 | B |
| 10 | Gelir yöntemi (yan ürüne maliyet yüklenmez, net hasılat diğer gelir) | 0 | 0 | 5.000.000 | yok |
| 11 | **İşaret hatası:** kâr ve ek maliyet eklenir | S + kS + X | **350.000** | **4.650.000** | **E** |
| 12 | İşaret hatası, yalnız kâr eklenir | S × 1,20 | 300.000 | 4.700.000 | D |
| 13 | İşaret hatası, yalnız ek maliyet eklenir | S + X | 300.000 | 4.700.000 | D |
| 14 | Kâr eklenir, ek maliyet düşülür | S × 1,20 − X | 250.000 | 4.750.000 | B |
| 15 | Kâr düşülür, ek maliyet eklenir | S × 0,80 + X | 250.000 | 4.750.000 | B |
| 16 | Kâr maliyet üzerinden "eklenir" | S/0,80 | 312.500 | 4.687.500 | yok |
| 17 | S/0,80 + X | | 362.500 | 4.637.500 | yok |
| 18 | Yarım kâr (%10) eklenir | S × 1,10 | 275.000 | 4.725.000 | C |
| 19 | Ek maliyetin yarısı eklenir | S + X/2 | 275.000 | 4.725.000 | C |
| — | Yenileme (tedarik) maliyeti yöntemi | piyasa alış fiyatı | — | — | veri yok |

**Gözlemler**
- Ders kitaplarında tanımlanan ve soruda adı geçen yöntem (satır 1) 150.000 / 4.850.000 veriyor. Bu çift şıklarda yok.
- Literatürde adı olan yöntemlerden şıka çıkanlar yalnızca 3, 8 ve 9. satırlardır (A ve B). Bunların hiçbiri sorunun adını verdiği yöntem değil. Satır 3 ve 8 kârı ya da ek maliyeti hesaba katmıyor. Satır 9 ikisini de katmıyor.
- C, D ve E yalnızca **eklemeli** (ters işaretli) formüllerle elde ediliyor. Bu formüllerin hiçbiri literatürde bir yöntem değil.
- Sağlama: şıktaki yan ürün tutarı ortak maliyet payı sayılırsa yan ürünün kârı A'da 0, B'de −50.000, C'de −75.000, D'de −100.000, E'de **−150.000** (satışın −%60'ı) çıkıyor. Yalnızca standart sonuç (150.000) sorudaki %20 kârı (50.000) veriyor. E, yan ürüne kendi satış tutarından fazla maliyet yüklüyor. Bu sonuç, kârlılık varsayımıyla doğrudan çelişiyor.

---

## 3. E'ye (350.000 / 4.650.000) ulaşan yollar ve değerlendirmesi

Tüm şıklar "yan + ana = 5.000.000" kuralına göre kurulmuş. Bu yüzden ana ürün tutarı her şıkta C − yan olarak bulunuyor ve ters mühendislikte yalnız 350.000 tutarını açıklamak yeterli. Küçük tamsayı katsayılı (−2…+2) kaba kuvvet aramasının sonuçları Ek A'da.

| Yol | Cebir | Değerlendirme |
|---|---|---|
| E1 | S + kS + X = 250.000 + 50.000 + 50.000 | **En olası açıklama (işaret hatası).** "Geriye doğru" hesapta düşülmesi gereken iki kalem eklenmiş. Ana ürün tutarı (5.000.000 − 350.000) bu hatadan kendiliğinden çıkıyor. Tek bir hata iki sayıyı birden açıklıyor. Çeldirici yapısıyla da uyumlu (§4). |
| E2 | S × 1,20 + X = 300.000 + 50.000 | E1 ile aynı sayı (kS = X olduğu için ayırt edilemez). "Maliyete kâr ekleyip satış fiyatına gitme" (ileri doğru) mantığı. Yön hatası. |
| E3 | S + 2X ya da S + 2kS | Sayısal olarak E1'e eşit, ayrı bir anlamı yok (numeroloji). |
| E4 | S × (1 + 2k) = 250.000 × 1,40 | Numeroloji. |
| E5 | C × %7 | Numeroloji. Verilerle bağı yok. |
| E6 | **Kök baskı hatası:** satış tutarı 500.000 olsaydı, 500.000 − 100.000 − 50.000 = 350.000; ana = 4.650.000 | Standart yöntem bu hipotezde E'yi **tam** veriyor. Hipotez, sınavı hazırlayanın hesabının doğru, sorudaki "250.000"in yanlış olduğunu varsayar. Zayıf yanları: (i) 250.000 → 500.000 tek karakterlik bir yazım hatası değil; (ii) çeldiriciler (200, 250, 275, 300 bin) 500.000 tabanıyla anlamlı bir hataya bağlanmıyor, buna karşılık 250.000 tabanıyla düzgün bir seri oluşturuyor (§4). Olasılığı düşük ama sıfır değil. |
| E7 | Kâr oranı −%60 ya da ek maliyet −150.000 olsaydı | Anlamsız (negatif kâr ya da negatif maliyet). |
| E8 | Ortak maliyet 4.800.000 olsaydı | Ana 4.650.000 tutardı ama yan 150.000 olurdu ve E'nin ilk sayısı tutmazdı. Elendi. |

**Hüküm:** E'yi, sorunun verisiyle ve adı geçen yöntemle veren tanınmış bir yöntem ya da savunulabilir bir okuma **bulunamadı**. E'ye yalnızca bir hatayla ulaşılıyor. Olasılık sırası: E1/E2 (işaret ya da yön hatası) > E6 (sorudaki satış tutarının yanlış basılması). TESMER'in iptal kararı gerekçe yayımlamıyor, bu nedenle mekanizma kesin olarak bilinemez.

---

## 4. Diğer şıkların kaynağı (çeldirici tasarımı)

Şıklar 250.000 (S) etrafında kurulmuş bir dizi oluşturuyor:

| Şık | Yan ürün | S'ye göre | Olası üretim mantığı |
|---|---:|---|---|
| A | 200.000 | S − 50.000 | Yalnız kâr düşülmüş (S × 0,80) ya da yalnız ek maliyet düşülmüş (S − X = NGD). İkisi de yarım bir "geriye doğru" hesap. A'daki 200.000, yan ürünün toplam stok maliyetine de eşit (pay 150.000 + ek 50.000). Ama ana ürün 4.850.000 değil 4.800.000 yazılmış. |
| B | 250.000 | S | Satış tutarının kendisi (brüt hasılatı indirme). |
| C | 275.000 | S + 25.000 | Bilinen bir yöntemle bağlantısı yok. Dolgu çeldirici (S × 1,10 ya da S + X/2). |
| D | 300.000 | S + 50.000 | Tek kalem eklenmiş (S × 1,20 ya da S + X). |
| E | 350.000 | S + 100.000 | İki kalem eklenmiş (S + kS + X). |
| (standart) | 150.000 | S − 100.000 | **Şıklarda yok.** |

Bu dizi, sınavı hazırlayanın E'yi "S + kâr + ek maliyet" diye kurduğunu, çeldiricileri de bu toplamdan kalem çıkararak ya da işareti çevirerek ürettiğini düşündürüyor. Doğru cevap olan 150.000 (S − kâr − ek maliyet), E'nin S'ye göre tam simetriğidir. Buna karşılık E6 hipotezinde (S = 500.000) çeldiricilerin hiçbiri tutarlı bir hatayla açıklanamıyor. Bu yüzden çeldirici tasarımı E1'i (işaret ya da yön hatası) destekliyor.

**Not:** Sınavı hazırlayanın elinde başka bir tanım bulunmuş olabilir. Tarama kapsamında "geriye doğru hesaplamada kâr ve ek maliyet satış tutarına eklenir" diyen hiçbir kaynağa rastlanmadı (§5).

---

## 5. Resmî ve ikincil kaynak taraması

### 5.1 TESMER (resmî)
| Kaynak | Bulgu |
|---|---|
| TESMER soru-cevap arşivi: `https://www2.tesmer.org.tr/files/ortak/soru_cevaplar/smmm/2026/1/03/smmm_2026_1_03.pdf` (giriş sayfası `https://www.tesmer.org.tr/?p=2050`, sınav tipi SMMM, 2026, dönem 1, ders 03) | **6. sayfa "Maliyet Muhasebesi Cevap Anahtarı": "17 · 3 · 6 · 13 · E · İPTAL"** ve **"20 · 17 · 19 · 4 · D · İPTAL"**. Satırlar kırmızıyla vurgulanmış (A/B/C/D kitapçığı karşılıkları: A-17 = B-3 = C-6 = D-13). Kitapçığın 4. sayfasında 17. sorunun üzerinde "Değerlendirme Dışı" damgası var. PDF meta verisi: ABBYY FineReader 14, oluşturulma 11.06.2026 17:12, yani 2026/1 sonuçlarının açıklanmasından (10.06.2026) sonra. |
| `https://www.tesmer.org.tr/?p=7258`, "2026/1 SMMM Sınavı Soru İtirazı" | "…sorularına itiraz etmek isteyen adaylar, 1 Mayıs 2026 Cuma günü saat 23:59'a kadar http://ssi.tesmer.org.tr adresinden itiraz edebilirler." Soru bazında sonuç bu duyuruda yer almıyor. |
| `https://www.tesmer.org.tr/?p=7274`, "2026/1 SMMM Sınavı Soru ve Cevapları" (27.04.2026) | İlk yayın duyurusu. İptal bilgisi duyuru metninde yok. |
| `https://www.tesmer.org.tr/?p=7340` (sonuçlara itiraz, 10–16.06.2026) ve `https://www.tesmer.org.tr/?p=7396` (itiraz sonuçları, 24.06.2026) | Duyuru metinlerinde soru numarası ya da iptal gerekçesi yok. İptal bilgisi yalnızca arşivdeki anahtar sayfasında görülüyor. |
| Gerekçe | TESMER bir iptal gerekçesi **yayımlamamış**. |

Aynı yöntemle bakılan öbür 2026 anahtarlarında İPTAL satırları (A kitapçığı numarası; soru metinleri uygulamadakilerle eşleştirildi):
- **2026/1:** FM-14, FTA-18, **MAL-17, MAL-20**, HUK-03, MH-01, MH-05. **Uygulamada bunların hiçbiri `iptal: true` değil.** Depodaki 2026/1 kitapçıkları sınav öncesi Word sürümleridir (02.04.2026) ve iptal bilgisini taşımaz.
- **2026/2:** FTA-06, FTA-07, DEN-11, HUK-03. Uygulamadaki `iptal` işaretleriyle birebir uyumlu.

### 5.2 İkincil kaynaklar
| Kaynak | Ne diyor |
|---|---|
| smmmonline.com, `https://smmmonline.com/yeterlilik-cikmis-sorular/2026-1` | Maliyet kitapçığı ve cevaplı PDF bağlantıları var. Sayfada iptal ya da değişiklik notu **yok** (önceki inceleme de aynı sonuca varmıştı). |
| Forum ya da sosyal medyada "2026 nisan maliyet 17. soru" tartışması | Aramada **bulunamadı**. |
| Prof. Dr. Kadir Gürdal, AÜ SBF, Maliyet Muhasebesi 8. hafta ders notu, `https://acikders.ankara.edu.tr/pluginfile.php/92157/mod_resource/content/1/8.%20Hafta.pdf` | Yan ürün değerleme yöntemlerini "Brüt Satış Hasılatı Yöntemi, Net Satış Hasılatı Yöntemi, **Satış Fiyatından Geriye Doğru Hesaplama Yöntemi**, Tedarik Değerinin Esas Alınması Yöntemi" diye sayıyor. Sorudaki yöntem adı bu sınıflamayla birebir aynı. Notta formül ve örnek **yok**. |
| Trakya Üniv. İİBF E-Dergi 9(2), 2020, s. 141–164 (Bursal ve Ercan 2015: 328; Özerhan ve Yanık 2015'e atıfla), `https://dergipark.org.tr/tr/download/article-file/958041` | "Yan mamullerin maliyeti ölçülürken ayrışma noktasından sonra yapılacak tahmini ek giderler ve satış için yapılması olası giderler dikkate alınarak, **tahmini satış fiyatından indirilmektedir** … Bulunan tutar ana ürünün maliyetinden düşülmektedir." Ayrıca TMS 2 md. 8'deki NGD tanımı: "tahmini satış fiyatından, tahmini tamamlanma maliyeti ve satışı gerçekleştirmek için gerekli tahmini satış giderleri toplamının düşülmesi". Ek maliyetler **düşülür**, eklenmez. |
| Albez, A. (2010), "Yan Mamullerin Muhasebeleştirilmesine İlişkin Öneriler", Atatürk Üniv. SBE Dergisi 14(2): 301–314, `https://dergipark.org.tr/tr/download/article-file/487075` | TMS 2'ye göre "yan ürünler … net gerçekleşebilir değeri ile ölçülmekte ve söz konusu değer ana mamullerin maliyetini oluşturan birleşik giderlerden düşülmektedir". |
| Aktif Akademi, Maliyet Muhasebesi ders kitabı, `https://onlineaktifakademi.net/assets/uploads/documents/4-%20MAL%C4%B0YET%20MUHASEBES%C4%B0-85614.pdf` | Örnek: "Peynirin Net Maliyeti = Peynirin Maliyeti − Yan Ürünün Net Satış Değeri" (NGD = satış − tamamlayıcı ek giderler). Bu da yan ürün değerinin ana ürün maliyetinden düşüldüğünü gösteriyor. |
| Uluslararası literatür ("reversal cost method"; Polimeni, Fabozzi ve Adelberg, *Cost Accounting*) | Bilinen tanım: yan ürün maliyeti = tahmini satış değeri − tahmini brüt kâr − ayrılma sonrası maliyetler − satış/yönetim giderleri; sonuç ortak maliyetten düşülür. **Not:** bu oturumda çevrimiçi bir metinle doğrulanmadı, kaynak bilgisi bellekten. |
| Büyükmirza, Hacırüstemoğlu, Karakaya, Yükçü ve Lazol/Sevilengül'ün MSUGT açıklamaları | Çevrimiçi erişilebilir tam metin **bulunamadı**. Tam formül alıntısı yapılamadı. |

**Özet:** Taranan kaynakların hepsi kâr, ek maliyet ve satış giderlerinin satış tutarından **düşüldüğünü**, bulunan tutarın da ortak (ana ürün) maliyetinden düşüldüğünü söylüyor. Eklemeli bir tanıma rastlanmadı.

### 5.3 Bağlantılı bulgu: 2026-1-MAL-20 da iptal
TESMER anahtarında 20. soru da "D İPTAL" olarak işaretli. Uygulamada bu soru `iptal: false` ve D cevaplı bir çözümle yayımlanıyor. Önceki incelemede (`review-2026-1-MAL.md`) kayda geçen kuşku, iptalin muhtemel gerekçesini veriyor: kök "birim maliyetleri" istiyor, ama miktar verilmemiş ve şıklar toplam paylar. Ortak maliyet (5.000) de toplam net satış değerinden (800) büyük. TESMER bunun için de gerekçe yayımlamadı.

---

## 6. Sonuç ve öneri

### 6.1 Sonuç: (b), E yalnızca bir hatayla elde ediliyor ve soru resmî olarak iptal
- **Resmî durum (güven: çok yüksek):** TESMER'in güncel arşiv dosyasında 2026/1 Maliyet 17. soru **İPTAL** ve "Değerlendirme Dışı" damgalı. 20. soru da iptal.
- **Hesap (güven: yüksek):** Soruda adı geçen yöntemle sonuç yan ürün 150.000 ₺, ana ürün 4.850.000 ₺. Bu çift şıklarda yok. Literatürdeki yöntemlerden şıka çıkanlar yalnızca A (NGD ya da yalnız kâr düşülmüş) ve B (brüt hasılat).
- **E'nin mekanizması (güven: orta):** En olası açıklama, kâr ve ek maliyetin satış tutarından düşüleceği yerde eklenmesi (250.000 + 50.000 + 50.000). Daha zayıf bir alternatif, sorudaki satış tutarının 500.000 yerine 250.000 basılması. Gerekçe yayımlanmadığı için kesin değil.

### 6.2 Uygulama için öneri
1. **`2026-1-MAL-17` → `iptal: true`.** `dogru: "E"` korunur (arayüz "İlk anahtar: E (iptal)" gösteriyor). `cevapNotu`, 2026-2-DEN-11 örneğindeki biçimde yazılır, örneğin: "Bu soru TESMER cevap anahtarında İPTAL edilmiştir (kitapçıkta 'Değerlendirme Dışı' damgalı); işaretli şık: E. Satış fiyatından geriye doğru hesaplamada yan ürünün ortak maliyet payı = 250.000 − 50.000 (normal kâr) − 50.000 (ek maliyet) = 150.000 ₺, ana ürün = 4.850.000 ₺; bu çift şıklarda yoktur. E (350.000) kâr ve ek maliyetin düşülmek yerine eklenmesiyle elde edilir (resmî gerekçe yayımlanmadı)." İptal edilen soru sınav puanına ve istatistiklere girmez. Bu, öğrencinin E'yi öğrenmesini de engeller.
2. **Çözüm dosyası:** İki yol var. (a) DEN-11 örneğindeki gibi çözümsüz bırakılır ve `allow-missing.txt` içindeki gerekçe "TESMER İPTAL" diye güncellenir. Standart yöntem zaten `08-birlesik-yan-urun` konusunun 2. örneğinde ve `cevapNotu`'nda anlatılıyor. (b) Öğretici bir çözüm yazılır. Ancak `validate.py` `sonuc == dogru` koşulunu arıyor ve "E" sonuçlu bir çözüm standart yöntemi öğretirken kafa karıştırır. Bu yüzden **(a) öneriliyor**. (b) seçilecekse doğrulayıcıya iptal sorular için bir istisna gerekir.
3. **`08-birlesik-yan-urun.json` → `sinavYaklasimi`:** MAL-17 maddesi "resmî anahtar çelişiyor; çözüm yayımlanmadı" yerine "TESMER bu soruyu iptal etti; standart hesap 150.000 / 4.850.000" olarak güncellenir. MAL-20'ye atıf yapan maddelere de iptal notu eklenir.
4. **`2026-1-MAL-20` → `iptal: true`** ve `cevapNotu`. Mevcut çözüm (D) yöntemi doğru anlatıyor ve kalabilir, ama soru puanlamaya girmemeli.
5. **Kapsam dışı ama acil:** 2026/1'de iptal edilen öbür 5 soru da (FM-14, FTA-18, HUK-03, MH-01, MH-05) uygulamada iptal değil. Bu sorular sınav modunda puanlanıyor. Ayrı bir görevde, TESMER 2026/1 anahtarlarıyla (`https://www2.tesmer.org.tr/files/ortak/soru_cevaplar/smmm/2026/1/0X/smmm_2026_1_0X.pdf`, X = 1…8) karşılaştırılarak düzeltilmeleri önerilir. Bu analizde yalnız İPTAL satırları ayıklandı. Bütün anahtarlar harf harf karşılaştırılmadı: otomatik ayrıştırma MAL, DEN, MH ve SPK anahtarlarında farksız çıktı, öbür derslerin tablo düzeni bu ayrıştırmayla güvenilir okunamadı.

Bu doküman dışında hiçbir dosya değiştirilmedi, commit yapılmadı.

---

## Ekler

### Ek A: Python betiği çıktısı (`scratchpad/mal17/mal17.py`)

```
YÖNTEM TABLOSU (yan ürün / ana ürün / şık)
 1. Geriye doğru (standart): pay = S − %20·S − ek                         | yan    150.000 | ana  4.850.000 | yok   [250.000 − 50.000 − 50.000; ana = C − pay]
 2. Geriye doğru, yan ürün TOPLAM maliyeti (pay + ek); ana = C − pay      | yan    200.000 | ana  4.850.000 | kısmi: yan=A   [150.000 + 50.000]
 3. S − kâr ortak maliyetten düşülür (ek, ortak maliyetin içinde sayılır) | yan    200.000 | ana  4.800.000 | A (tam)   [250.000 − 50.000]
 4. Kâr maliyet üzerinden: pay = S/1,20 − ek                              | yan 158.333,33 | ana 4.841.666,67 | yok   [208.333 − 50.000]
 5. Kâr maliyet üzerinden, yan toplam = S/1,20; ana = C − pay             | yan 208.333,33 | ana 4.841.666,67 | yok   [208.333]
 6. Kâr NGD (net satış) üzerinden: pay = (S − ek)·0,80                    | yan    160.000 | ana  4.840.000 | yok   [200.000 × 0,80]
 7. Kâr NGD'nin maliyeti üzerinden: pay = (S − ek)/1,20                   | yan 166.666,67 | ana 4.833.333,33 | yok   [200.000 / 1,20]
 8. NGD / net hasılatı indirme: pay = S − ek                              | yan    200.000 | ana  4.800.000 | A (tam)   [250.000 − 50.000]
 9. Brüt satış tutarını indirme: pay = S                                  | yan    250.000 | ana  4.750.000 | B (tam)   [250.000]
10. Gelir (diğer gelir) yöntemi: pay = 0                                  | yan          0 | ana  5.000.000 | yok   [0]
11. İŞARET HATASI: S + %20·S + ek                                         | yan    350.000 | ana  4.650.000 | E (tam)   [250.000 + 50.000 + 50.000]
12. İşaret hatası, yalnız kâr eklenir: S·1,20                             | yan    300.000 | ana  4.700.000 | D (tam)   [250.000 × 1,20]
13. İşaret hatası, yalnız ek eklenir: S + ek                              | yan    300.000 | ana  4.700.000 | D (tam)   [250.000 + 50.000]
14. Kâr eklenir, ek düşülür: S·1,20 − ek                                  | yan    250.000 | ana  4.750.000 | B (tam)   [300.000 − 50.000]
15. Kâr düşülür, ek eklenir: S·0,80 + ek                                  | yan    250.000 | ana  4.750.000 | B (tam)   [200.000 + 50.000]
16. Kâr maliyet üzerinden 'eklenir': S/0,80                               | yan    312.500 | ana  4.687.500 | yok   [312.500]
17. S/0,80 + ek                                                           | yan    362.500 | ana  4.637.500 | yok   [362.500]
18. Yarım kâr (%10) eklenir: S·1,10                                       | yan    275.000 | ana  4.725.000 | C (tam)   [275.000]
19. S + ek/2                                                              | yan    275.000 | ana  4.725.000 | C (tam)   [275.000]

KABA KUVVET 1: a·S + b·(k·S) + c·X, a,b,c ∈ {-2..2}
  standart(150.000): ['+0·S +1·kS +2·X', '+0·S +2·kS +1·X', '+1·S -2·kS +0·X', '+1·S -1·kS -1·X', '+1·S +0·kS -2·X']
  A: ['+0·S +2·kS +2·X', '+1·S -2·kS +1·X', '+1·S -1·kS +0·X', '+1·S +0·kS -1·X', '+1·S +1·kS -2·X']
  B: ['+1·S -2·kS +2·X', '+1·S -1·kS +1·X', '+1·S +0·kS +0·X', '+1·S +1·kS -1·X', '+1·S +2·kS -2·X']
  C: ['—']
  D: ['+1·S -1·kS +2·X', '+1·S +0·kS +1·X', '+1·S +1·kS +0·X', '+1·S +2·kS -1·X', '+2·S -2·kS -2·X']
  E: ['+1·S +0·kS +2·X', '+1·S +1·kS +1·X', '+1·S +2·kS +0·X', '+2·S -2·kS -1·X', '+2·S -1·kS -2·X']

KABA KUVVET 2: S·f + m·X (f ∈ çarpanlar), m ∈ {-2..2}
  S·1 -2·X = 150.000 -> standart(150.000)
  S·1 -1·X = 200.000 -> A
  S·1 +0·X = 250.000 -> B
  S·1 +1·X = 300.000 -> D
  S·1 +2·X = 350.000 -> E
  S·(1+k) -2·X = 200.000 -> A
  S·(1+k) -1·X = 250.000 -> B
  S·(1+k) +0·X = 300.000 -> D
  S·(1+k) +1·X = 350.000 -> E
  S·(1−k) -1·X = 150.000 -> standart(150.000)
  S·(1−k) +0·X = 200.000 -> A
  S·(1−k) +1·X = 250.000 -> B
  S·(1−k) +2·X = 300.000 -> D
  S·(1+k/2) +0·X = 275.000 -> C
  S·(1−k/2) +1·X = 275.000 -> C
  S·(1+2k) -2·X = 250.000 -> B
  S·(1+2k) -1·X = 300.000 -> D
  S·(1+2k) +0·X = 350.000 -> E
  S·(1−2k) +0·X = 150.000 -> standart(150.000)
  S·(1−2k) +1·X = 200.000 -> A
  S·(1−2k) +2·X = 250.000 -> B
  Ortak maliyetin yüzdesi olarak: A=4.0%, B=5.0%, C=5.5%, D=6.0%, E=7.0%

ŞIKLARIN TOPLAMI (yan + ana)
  A: 200.000 + 4.800.000 = 5.000.000
  B: 250.000 + 4.750.000 = 5.000.000
  C: 275.000 + 4.725.000 = 5.000.000
  D: 300.000 + 4.700.000 = 5.000.000
  E: 350.000 + 4.650.000 = 5.000.000
  Standart pay: 150.000 + 4.850.000 = 5.000.000
  Standart, yan toplam maliyet (pay+ek) + ana: 200.000 + 4.850.000 = 5.050.000

SAĞLAMA: şıktaki yan tutar 'ortak maliyet payı' ise yan ürünün kârı = S − pay − ek
  A: 250.000 − 200.000 − 50.000 = 0  (satışa oranı %0.0)
     (şıktaki tutar ek dahil toplam maliyet ise kâr = 50.000, %20.0)
  B: 250.000 − 250.000 − 50.000 = -50.000  (satışa oranı %-20.0)
     (şıktaki tutar ek dahil toplam maliyet ise kâr = 0, %0.0)
  C: 250.000 − 275.000 − 50.000 = -75.000  (satışa oranı %-30.0)
     (şıktaki tutar ek dahil toplam maliyet ise kâr = -25.000, %-10.0)
  D: 250.000 − 300.000 − 50.000 = -100.000  (satışa oranı %-40.0)
     (şıktaki tutar ek dahil toplam maliyet ise kâr = -50.000, %-20.0)
  E: 250.000 − 350.000 − 50.000 = -150.000  (satışa oranı %-60.0)
     (şıktaki tutar ek dahil toplam maliyet ise kâr = -100.000, %-40.0)
  Standart: kâr = 50.000 (%20.0)

TERS ÇÖZÜM: E'yi standart formülle veren girdiler
  Kâr oranı r (pay = S(1−r) − ek = 350.000): r = %-60
  Kâr oranı r (pay = S(1−r), ek yok): r = %-40
  Satış tutarı S' (pay = 0,8·S' − 50.000 = 350.000): S' = 500.000
  Satış tutarı S' (pay = 0,8·S', ek yok): S' = 437.500
  Ek maliyet X' (200.000 − X' = 350.000): X' = -150.000 (negatif → anlamsız)
  Ortak maliyet C' (ana 4.650.000 standart pay 150.000 ile): C' = 4.800.000

TERS ÇÖZÜM: öbür şıkları standart formülle veren satış tutarı S'
  A: S' = (200.000 + 50.000)/0,80 = 312.500
  B: S' = (250.000 + 50.000)/0,80 = 375.000
  C: S' = (275.000 + 50.000)/0,80 = 406.250
  D: S' = (300.000 + 50.000)/0,80 = 437.500
  E: S' = (350.000 + 50.000)/0,80 = 500.000

OLASI BASKI HATASI SENARYOLARI (standart formül)
  S = 450.000: pay = 310.000, ana = 4.690.000 -> yok
  S = 500.000: pay = 350.000, ana = 4.650.000 -> E (tam)
  S = 437.500: pay = 300.000, ana = 4.700.000 -> D (tam)
  S = 550.000: pay = 390.000, ana = 4.610.000 -> yok
  S = 312.500: pay = 200.000, ana = 4.800.000 -> A (tam)
  ek = 0: pay = 200.000, ana = 4.800.000 -> A (tam)
  ek = -50.000: pay = 250.000, ana = 4.750.000 -> B (tam)
```

### Ek B: TESMER cevap anahtarındaki İPTAL satırlarının çıkarımı
`pymupdf` ile anahtar sayfasında "İPTAL" kelimesinin y koordinatındaki satır okundu (dosyalar `scratchpad/mal17/keys/`):

```
smmm_2026_1_01 (FM)  İPTAL: 14            smmm_2026_2_01 (FM)  İPTAL: —
smmm_2026_1_02 (FTA) İPTAL: 18            smmm_2026_2_02 (FTA) İPTAL: 6, 7
smmm_2026_1_03 (MAL) İPTAL: 17 (E), 20 (D) smmm_2026_2_03 (MAL) İPTAL: —
smmm_2026_1_04 (DEN) İPTAL: —             smmm_2026_2_04 (DEN) İPTAL: 11
smmm_2026_1_05 (VER) İPTAL: —             smmm_2026_2_05 (VER) İPTAL: —
smmm_2026_1_06 (HUK) İPTAL: 3             smmm_2026_2_06 (HUK) İPTAL: 3
smmm_2026_1_07 (MH)  İPTAL: 1, 5          smmm_2026_2_07 (MH)  İPTAL: —
smmm_2026_1_08 (SPK) İPTAL: —             smmm_2026_2_08 (SPK) İPTAL: —
```
2026/1'deki 7 iptal sorusunun ilk 70 karakteri TESMER metni ile uygulama JSON'unda birebir aynı. 2026/1 MAL anahtarının 20 harfi uygulamadaki `dogru` alanlarıyla farksız.
