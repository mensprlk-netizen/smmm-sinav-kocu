# İnceleme notları: 2026-1 Hukuk (2026-1-HUK)

Kaynak: `tools/pdfs/2026_1_hukuk.pdf` (TÜRMOB-TESMER SMMM 2026-1, A kitapçığı, 3 sayfa; sayfa no. 12–14), sayfa görüntüleri `app/img/originals/2026-1-HUK-p1..p3.png`. 2026-1 kitapçıklarında cevap anahtarı tablosu yoktur; resmî cevap kırmızı basılmış şıktır. Kırmızı şıkların 20’si de ham `dogru` değeriyle aynıdır.

Yöntem: Her soru sayfa görüntüsünden yeniden yazıldı (06, 13 ve 15 ayrıca 200 dpi kırpımla kontrol edildi). Kökler ve şıklar HTML’den arındırılıp NFC’ye normalleştirildikten sonra betikle ham metinle (`tools/out/raw/2026-1-HUK.json`) karşılaştırıldı (boşluklar hariç): 20 kökte ve 100 şıkta fark yok. Her soru önce birincil kanun metninden bağımsız çözüldü, sonra kırmızı şıkla karşılaştırıldı: 20/20 eşleşme. İptal işareti yok; `iptal` hepsinde `false`, `cevapNotu` hepsinde `null`, ham `notlar` hepsinde boş.

Hukuki kontrol: Bütün kurallar mevzuat.gov.tr’den bu çalışmada indirilen güncel konsolide metinlerden madde madde doğrulandı: 6102 TTK, 6098 TBK, 4857 İş K., 7036 İş Mahkemeleri K. (ek md. 3’ün yürürlüğü için), 5510 SSGSS K., 2577 İYUK, 4721 TMK. 01 için ayrıca SGK’nın 2017/26 sayılı Genelgesi (7/9/2017, “Genel Sağlık Sigortası Sağlık Aktivasyon İşlemleri”; asmmmo.org.tr’de yayımlanan PDF), 2014 tarihli Genel Sağlık Sigortası Tescil, Prim ve Müstehaklık İşlemleri Yönetmeliği ve mülga 2008 tarihli Genel Sağlık Sigortası İşlemleri Yönetmeliği metinleri tarandı. Konsolide metinler 2026 yılı değişikliklerini de içeriyor (İş K. md. 74 ve 5510 md. 16: 7578 sayılı Kanun, 22/4/2026; İYUK md. 28: 7588 sayılı Kanun, 2/7/2026; 5510 md. 81’de bir fıkra: 7590 sayılı Kanun, 24/7/2026). Bunların hiçbiri 20 sorunun cevabını değiştirmez; sınava hazırlık için önemli olanlar (analık izni 24 hafta, İYUK 28’deki istisna) ilgili çözümlerde “Not” olarak verildi.

Genel: Satır sonları birleştirildi; tire ile bölünmüş kelime yoktu. Tamamı kalın basılan kökler (15, 16, 18 dışındakiler) `<strong>` ile korundu. 15’te alıntılı giriş paragrafı düz, soru cümlesi kalın; 16 ve 18’de Roma rakamlı öncüller düz `<ul class="madde">` listesi, soru cümlesi kalın. Altı çizili “değildir” (01, 03, 08), “en fazla” (02), “bakılmaz” (05), “en geç” (07), “yanlıştır” (14, 17) ve “yer almaz” (20) `<u>` ile işaretlendi. 06’daki “en fazla” kitapçıkta altı çizili değildir; öyle bırakıldı. Kitapçığın yazımları (“İdarî” / “idari”, “Kötü niyet”, “Şikayet”, “1ay”) aynen korundu.

## Konu etiketleri

Hukuk için tanımlanan set (13 etiket). 2026-2-HUK dosyası tam olarak bu etiketleri kullanacaktır; 2026-1’de kullanılmayan etiketler 2026-2 (ve sonraki dönemler) için ayrılmıştır. 2026-2 kitapçığının ham metni tarandı: taşıma (11) ve haksız rekabet (12) soruları da bu setle karşılanır. `konuBaglantisi` her soruda `konu` ile aynıdır.

| Etiket | Kapsam | 2026-1 soruları |
|---|---|---|
| Ticari işletme ve tacir | TTK Birinci Kitap: ticari işletme, tacir ve esnaf, ticari işler, ticari davalar ve görevli mahkeme (md. 3–5), tacirin yükümlülükleri, ticari defterler, haksız rekabet, cari hesap | 10 |
| Ticaret unvanı ve sicil | Ticaret sicili, ticaret unvanı, işletme adı (TTK Birinci Kitap ilgili bölümler) | (yok) |
| Taşıma ve sigorta hukuku | TTK Dördüncü Kitap (taşıma işleri), Beşinci Kitap (deniz ticareti), Altıncı Kitap (sigorta hukuku) | (yok) |
| Ticaret şirketleri: genel hükümler | TTK md. 124 vd.: şirket türleri, şahıs/sermaye şirketi ayrımı, tüzel kişilik, birleşme, bölünme, tür değiştirme, şirketler topluluğu | 18 |
| Şahıs şirketleri | Kollektif ve komandit şirket | (yok) |
| Anonim şirket | Kuruluş, sermaye, genel kurul, yönetim kurulu, denetim, pay | (yok) |
| Limited şirket | Kuruluş, sermaye, ortaklar kurulu, müdürler, pay devri | (yok) |
| Kıymetli evrak | TTK Üçüncü Kitap: genel hükümler, nama/emre/hamiline yazılı senetler, poliçe, bono, çek, iptal | 19 |
| Borçlar: genel hükümler | TBK Birinci Kısım: borç ilişkisinin kaynakları, ifa, sona erme, zamanaşımı, teselsül, koşullar | 03, 04, 16 |
| Borçlar: sözleşmeler | TBK İkinci Kısım: satış (taksitle satış dahil), kira, ödünç, hizmet, eser, vekâlet, kefalet, adi ortaklık vb. | 17 |
| İş hukuku | 4857 İş Kanunu (ve iş hukukunu ilgilendiren 7036 sayılı İş Mahkemeleri Kanunu hükümleri) | 02, 09, 11, 12 |
| Sosyal güvenlik | 5510 SSGSS Kanunu ve SGK ikincil düzenlemeleri | 01, 07, 08, 13, 14, 15 |
| İdari yargı | 2577 İYUK | 05, 06, 20 |

Sınır notları: 10 (görevli mahkeme) TTK md. 4–5 Birinci Kitapta olduğu için “Ticari işletme ve tacir”dedir. 11 bir zamanaşımı sorusudur ama İş K. ek md. 3’ü sorduğu için “İş hukuku”ndadır. 19 kıymetli evrakın iptalini sorduğu için, görevli mahkeme gerekçesi TTK md. 4–5 olsa da “Kıymetli evrak”tadır. 6183 veya 213 sayılı Kanunlara dokunan bir soru gelirse en yakın etikete (kamu alacağı: “İdari yargı”, vergi usulü: ilgili etikete) not düşülerek yerleştirilecektir.

## Soru bazında tablo

| No | Durum | Ham çıkarıma göre düzeltme | Bağımsız cevap | Kırmızı şık | Eşleşme |
|----|-------|----------------------------|----------------|-------------|---------|
| 01 | tartışmalı | Satır birleştirme; kalın kök, altı çizili “değildir” | E (SGK Genelgesi 2017/26, 1.8: oturma izni almamış yabancı uyruklu anne-baba sayılmaz); A da savunulabilir | E | evet |
| 02 | ok | Kalın kök, altı çizili “en fazla” | D (İş K. md. 15/1: 2 ay, TİS ile 4 ay) | D | evet |
| 03 | ok | Kalın kök, altı çizili “değildir” | C (ölüm sona erme hâli değil; TMK md. 599) | C | evet |
| 04 | ok | Kalın kök | B (TBK md. 72/1 ve 82: öğrenmeden itibaren 2 yıl) | B | evet |
| 05 | ok | Kalın kök, altı çizili “bakılmaz” | A (İYUK md. 14/3 a–g’de ivedilik yok) | A | evet |
| 06 | ok | Kalın kök (“en fazla” altı çizili değil) | B (İYUK md. 28/1: 30 gün) | B | evet |
| 07 | ok | Kalın kök, altı çizili “en geç”; E “1ay” aynen | E (5510 md. 8/1-b: bir aylık süre) | E | evet |
| 08 | ok | Kalın kök, altı çizili “değildir”; şıklarda satır birleştirme | C (5510 md. 16/1-c: hak sahiplerine gelir; md. 3/1-7) | C | evet |
| 09 | ok | Kalın kök | E (İş K. md. 29/1) | E | evet |
| 10 | ok | Kalın kök, alıntı tırnakları aynen | B (TTK md. 5/1) | B | evet |
| 11 | ok | Kalın kök; şıklarda satır birleştirme | A (İş K. ek md. 3: diğerleri 5 yıl; haksız fiil TBK md. 72) | A | evet |
| 12 | ok | Kalın kök | C (İş K. md. 74/7: 1,5 saat) | C | evet |
| 13 | ok | Kalın kök; açılış tırnağı eksik, kapanış ” aynen | A (5510 md. 81, 6486 ile eklenen fıkra; ek md. 2) | A | evet |
| 14 | ok | Kalın kök, altı çizili “yanlıştır”; şıklarda satır birleştirme | B (5510 md. 102/5: peşin ödeme yargı yolunu etkilemez) | B | evet |
| 15 | ok | Düz alıntı paragrafı + kalın soru cümlesi (ham metin tek blok) | D (5510 md. 102/1-ı-1: 5 kat) | D | evet |
| 16 | ok | Roma rakamlı öncüller `<ul class="madde">`, kalın soru cümlesi | D (TBK Birinci Bölüm üç ayırım) | D | evet |
| 17 | tartışmalı | Kalın kök, altı çizili “yanlıştır”; şıklarda satır birleştirme | A (TBK md. 256/1: onda bir); E de md. 258’e aykırı | A | evet |
| 18 | ok | Roma rakamlı öncüller `<ul class="madde">`, kalın soru cümlesi | E (TTK md. 124/2) | E | evet |
| 19 | ok | Kalın kök | C (TTK md. 651; 4/1-a, 5/1) | C | evet |
| 20 | ok | Kalın kök, altı çizili “yer almaz”; D’de satır birleştirme | B (İYUK’ta “şikâyet” yolu yok) | B | evet |

Ham çıkarım karakter düzeyinde doğruydu; düzeltmeler yalnız biçimseldir (satır birleştirme, kalın/düz ayrımı, altı çizili ifadeler, öncül listeleri).

## Anahtar çelişkisi

Yok. 20 sorunun hepsinde bağımsız çözüm kırmızı şıkla aynıdır. `tools/allow-missing.txt` değiştirilmedi.

## Tartışmalı sorular

- **01 (resmî E; diğer okuma A):** 5510 md. 3/1-10 yalnız “eş, çocuk, ana ve baba” der; ne üvey çocuğu ne de oturma izni şartını düzenler. Her iki kural da SGK Genelgesi 2017/26’dadır. Bölüm 1.8’e göre oturma izni almamış yabancı uyruklu anne-baba koşulsuz olarak bakmakla yükümlü olunan kişi sayılmaz (E). Bölüm 1.6.4’e göre üvey çocuklar ise yalnız geçiş hükümleri kapsamında bakmakla yükümlü olunan kişidir: 5510 geçici 4. madde kapsamında olup devir tarihinden (15/01/2010; TSK personeli için 15/10/2010) önce evlenmiş olanlar (§1.6.4(1)–(2)) ve 01/01/2012 öncesi görevlendirilen güvenlik korucuları (§1.6.4(5)). Devirden sonra evlenenler, 01/10/2008 sonrası ilk kez 4/1-c’li olanlar, 442 sayılı Kanun kapsamında aylık bağlananlar (§1.6.4(5)) ve diğer bütün genel sağlık sigortalıları için sayılmaz. Bu okumayla A da “arasında değildir” cevabı olur. Çözüm resmî cevabı (E) izler; 5. adım “Not (tartışmalı)” A’yı ve gerekçesini açıkça yazar, `tuzaklar.A` da aynı noktaya gönderir.
- **17 (resmî A; diğer okuma E):** A (“%50”) TBK md. 256/1’e (“en az onda biri”; Cumhurbaşkanı yarıya indirebilir veya iki katına çıkarabilir, yani %5–%20) açıkça aykırıdır. E ise md. 258’i “kalan kısmı her zaman <em>bir defada</em> ödeyerek” yerine “her zaman <em>taksitler halinde</em> ödeyerek” diye aktarır. E kanunun erken ödeme kuralını yanlış anlatır; bu okumayla E de yanlış ifadedir ve soru iki cevaplı olur. Lafzen (“taksitleri ödeyen borçtan kurtulur”) doğru okunabilir ama md. 258’in kuralı bu değildir. Çözüm A’yı izler; “Not (tartışmalı)” adımı E’yi ve gerekçesini yazar.

## İptal edilen soru

Yok (sayfalarda iptal işareti yok).

## Baskı hataları, kitapçık notları ve kuşkular

- **07 E:** Şık kitapçıkta “1ay” (boşluksuz) basılmıştır; aynen korundu, çözümün Not adımında belirtildi.
- **07 kök:** Kök md. 8/1-b’yi sorar ama “sigortalı olarak çalışmaya başladıklarını … bildirir” ifadesi sigortalının kendini bildirmesine ilişkin md. 8/2’nin diline yakındır. İki hükümde de süre bir aydır; cevap etkilenmez. Ayrıca md. 8/1-b’deki bir aylık süre, işyerinde ilk sigortalı çalıştırılmaya başlanan tarihten işler; çözümde açıklandı.
- **13:** Kökteki alıntının açılış tırnağı basılmamış, yalnız kapanış ” var; aynen korundu. Boşluklu cümle 5510 md. 81’e 6486 sayılı Kanun’la eklenen fıkranın ve ek md. 2’deki cümlenin aynısıdır. 6824 sayılı Kanun’la eklenen ek md. 14 aynı fiil için 5510, 3294 ve 4447’deki bütün teşviklerde “ilk tespitte bir ay, üç yıl içinde tekrarında bir yıl” kuralını getirir ve aykırı hükümlerin uygulanmayacağını söyler. Soru metindeki cümleyi sorduğu için cevap A’dır; ek md. 14 çözümde Not olarak verildi. Şıklarda “1 ay” olmadığından bu fark başka bir şıkkı desteklemez.
- **14 A:** Şık, md. 102/2’deki dörtte bir indirimini şartlarını (belgenin kendiliğinden 30 gün içinde verilmesi; yalnız (a), (b), (g), (h), (j) bentleri; tespite dayananlar hariç) yazmadan aktarır. Hükmün kendisi olduğu için doğru kabul edildi; B açıkça md. 102/5’in tersidir. Çözümde dörtte bir (102/2) ile peşin ödemedeki dörtte üç tahsil (102/5) ayrımı yapıldı.
- **03 B:** Öğretide zamanaşımı alacağı ortadan kaldırmaz, eksik borca dönüştürür (TBK md. 161: hâkim kendiliğinden dikkate alamaz). TBK zamanaşımını “Borçların ve Borç İlişkilerinin Sona Ermesi, Zamanaşımı” başlıklı aynı bölümde düzenler ve ders kitapları onu sona erme hâlleri arasında sayar. Ölüm ise hiçbir sınıflandırmada genel bir sona erme hâli değildir. Bu yüzden ikinci bir cevap doğmaz; çözümde Not olarak açıklandı.
- **04:** Kök “haksız bir fiil ile mal iktisabından doğan borçlar” der. Bu hâlde hem haksız fiil (TBK md. 72) hem sebepsiz zenginleşme (md. 82) hükümleri uygulanabilir; ikisinde de öğrenmeye bağlı süre 2 yıldır, cevap değişmez.
- **15 A, C:** Tuzak açıklamalarında 1/2 ve 2 katın 5510 md. 102’de başka fiillere ait oranlar olduğu yazıldı (md. 102/1-k ve 102/1-a-2, metinde görüldü); adayın hatasının kaynağı olduğu iddia edilmedi. 15-B (3/4) için açıklama yazılmadı.
- **Tuzaklar:** Mekanizması metinle doğrulanamayan yanlış şıklar için uydurma açıklama yazılmadı; “kanunda böyle bir süre/kural yoktur” denildi (02-C/E, 04-E, 06-E, 07-C/D, 13-B/E). 04-A’daki “1 yıl, 818 sayılı eski Borçlar Kanunu’ndaki süreydi” bilgisi yürürlükten kalkmış metinden doğrulanmadı; iyi bilinen bir değişikliktir, madde numarası verilmedi.

## Dayanak atıfları ve güven düzeyi

Kesin = hüküm metni bu çalışmada mevzuat.gov.tr’den indirilen konsolide metinde (`MevzuatMetin/1.5.<no>.pdf`) kelime kelime görülerek yazıldı. Fıkra numaraları PDF’deki paragraf girintilerinden sayıldı.

- **TTK (6102):** md. 4/1 (a, c, f bentleri ve son cümle), 4/2 (basit yargılama, bir milyon TL), 5/1, 5/2, 124/1, 124/2, 651/1–2, 652/1, 757/1, 758–762 (761: üç ay–bir yıl; 762: üç defa ilan), 778/1-ı (bonoya atıf), 818/1-s (çeke atıf) — kesin.
- **TBK (6098):** Birinci Bölüm ve ayırım başlıkları (md. 1, 49, 77), md. 72/1–2, 82/1–2, 83 (İkinci Bölüm başlangıcı), Üçüncü Bölüm ve ayırım başlıkları, md. 132, 133, 135, 136, 139, 143, 146, 147, 161, 253, 256/1–4, 257/1, 258, 440, 513 — kesin.
- **TMK (4721):** md. 599 — kesin.
- **İş K. (4857):** md. 15/1–2, 29/1–2 ve fesih/kapatma fıkraları, 32/8, 66/1-e, 74/1–2 ve 74/7 (7578 sayılı Kanun dipnotu dahil), ek md. 3, geçici md. 8 — kesin. Ek md. 3’ün yürürlüğü (yayım tarihi 25/10/2017) 7036 sayılı Kanun md. 38’den doğrulandı — kesin.
- **5510:** md. 3/1-7, 3/1-10, 8/1 (a, b, c) ve 8/2, 16/1–3, 59/1, 81 (6486 sayılı Kanun’la eklenen fıkra; fıkra numarası verilmedi çünkü maddede mülga fıkralar var), ek md. 2, ek md. 14, 102/1-a-2, 102/1-k, 102/1-ı-1, 102/1-ı-2, 102/2, 102/4, 102/5, 102/6, 102/7 — kesin.
- **İYUK (2577):** md. 7/1, 14/3 (a–g), 14/4, 14/6, 20/A/1–2, 27/7, 28/1 (7588 sayılı Kanun’la eklenen cümle dahil), 28/3–4, 29/1 ve 29/5, 45, 46/1, 51, 53, 54 (mülga) — kesin.
- **SGK Genelgesi 2017/26** (7/9/2017, Emeklilik Hizmetleri Genel Müdürlüğü, sayı 71256087-010.06-E.4521044), bölüm 1.4, 1.6.4, 1.8 — metin kelime kelime görüldü (asmmmo.org.tr’deki genelge PDF’i). Güven: kesin. Bağımsız incelemede bulunan SGK Genelgesi 2026/20 (31/07/2026), 2017/26’yı yalnız §3.1.5’te (belgeler) değiştirmiş ve yabancı uyruklu ana/baba için ikamet izni şartını yeniden teyit etmiştir; §1.8 değişmemiştir. 2026/20 Nisan sınavından sonra yayımlanmıştır ve cevabı etkilemez. (2026/20 metni bu çalışmada ayrıca indirilmedi; bilgi inceleme raporuna dayanır.) 01 tartışmalı olarak işaretli kalır (üvey çocuk okuması).
- Madde numarası verilmeden kural olarak anlatılanlar: 04-A (818 sayılı eski BK’de haksız fiil zamanaşımının 1 yıl olması), 10-A/D (iş mahkemesi ve icra mahkemesinin genel görev alanları), 19-B (vergi mahkemesinin vergi uyuşmazlıklarına bakması), 11/3. adım (ek md. 3’ten önce kıdem, ihbar, kötüniyet ve eşit davranmama tazminatlarına TBK md. 146’daki on yıllık genel sürenin uygulanması; md. 146 metni görüldü, önceki uygulama genel bilgi; yıllık izin ücreti Yargıtay’ca genellikle ücret niteliğinde, 5 yıllık sayıldığı için cümleden çıkarıldı). Hepsi tuzak veya bağlam açıklamasıdır; hiçbiri cevabı taşımaz.

## Düzeltme turu 1 (bağımsız inceleme sonrası)

- 05 `tuzaklar.B` (önemli): “idari merci tecavüzü” tanımı tersti. Düzeltildi: önce bir idari mercie yapılması gereken başvurunun (ör. zorunlu idari itiraz) doğrudan yargı yerine getirilmesi; md. 15/1-e uyarınca dilekçe görevli idari merciye gönderilir (md. 15/2: mahkemeye başvuru tarihi, mercie başvuru tarihi sayılır). İYUK md. 15/1-e ve 15/2 metinde görüldü. Aynı tanım başka bir alanda (adimlar, kartlar) yoktu.
- 01 `adimlar[4]`, `tuzaklar.A`, `kartlar[1].arka`: üvey çocuk geçiş hâli Genelge 2017/26 §1.6.4(1)–(2)’ye göre “5510 geçici 4. madde kapsamında olup devir tarihinden (15/01/2010; TSK personeli için 15/10/2010) önce evlenmiş olanlar” diye düzeltildi. §1.6.4(5)’teki “442 sayılı Kanun kapsamında aylık bağlananların üvey çocukları sayılmaz” hükmü genelge metninde görüldü ve `adimlar[4]`’e eklendi.
- 01 `adimlar[3]`: Türk vatandaşı ana-babadan oturma izni aranmadığı için E’nin zorunlu olarak yabancı uyruklu ana-babayı anlattığı eklendi. Güven satırına SGK Genelgesi 2026/20 bilgisi eklendi.
- 11 `adimlar[2]`: on yıllık genel zamanaşımı cümlesi dört tazminatla (kıdem, ihbar, kötüniyet, eşit davranmama) sınırlandı.
- 15 `tuzaklar`: anahtarlar A, C, E sırasına konuldu.
- 07 `tuzaklar.A`: “aynı gün, yani ‘1 gün’ değil” eklendi.
