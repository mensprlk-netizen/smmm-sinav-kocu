# SMMM Sınav Koçu — Tasarım Dokümanı

Tarih: 2 Ekim 2026
Durum: Kullanıcı tarafından sözlü onaylandı; yazılı inceleme bekliyor.

## 1. Amaç ve başarı ölçütü

Kullanıcı 28 Kasım 2026 tarihli SMMM Yeterlilik Sınavı'na (2026/3 dönemi) 8 dersin tamamından girecek. Günde 1-2 saat çalışabiliyor. Samsung Galaxy S23 Ultra'da, internetsiz ortamda da çalışan, S Pen ile çözüm yapılabilen bir sınav koçu uygulaması istiyor.

Başarı ölçütü: Uygulama telefona kurulur, offline açılır; 2026/1 ve 2026/2 dönemlerinin 320 resmi test sorusu okunaklı biçimde, doğrulanmış çözümleriyle çözülebilir; deneme ve aralıklı tekrar motoru çalışır; Maliyet Muhasebesi için 14 konuluk görselli anlatım modülü vardır; ilerleme kalıcıdır ve yedeklenebilir.

## 2. Sınava ilişkin sabit gerçekler (doğrulanmış)

Kaynak: TÜRMOB E.233 sayılı 14.01.2026 tarihli yazı ve TÜRMOB 2026 sınav takvimi.

- 2026/1 döneminden itibaren sınav test (çoktan seçmeli) usulüyle yapılır.
- 8 ders, her derste 20 soru, 5 seçenek, ders başına 45 dakika.
- 1. oturum (09.00-12.00): Finansal Muhasebe, Maliyet Muhasebesi, Hukuk, Sermaye Piyasası Mevzuatı.
- 2. oturum (14.00-17.00): Finansal Tablolar ve Analizi, Muhasebe Denetimi, Vergi Mevzuatı ve Uygulaması, Muhasebecilik ve Mali Müşavirlik Meslek Hukuku.
- Mutlak değerlendirme; 100 puan 20 soruya eşit dağıtılır (soru başına 5 puan).
- Her yanlış cevap 0,25 doğruyu götürür. Puan = (doğru − yanlış × 0,25) × 5.
- İptal edilen sorular değerlendirme dışı bırakılır; puanları geçerli sorulara dağıtılır.
- Hesap makinesi kullanılmaz.
- Geçme: her dersten en az 50, genel ortalama en az 60 (Sınav Yönetmeliği). Küsuratlı notlar tama iblağ edilmez.
- Sınav tarihleri 2026: 25 Nisan (2026/1), 25 Temmuz (2026/2), 28 Kasım (2026/3).

## 3. Kapsam

Dahil:
- 2026/1 ve 2026/2 dönemlerinin 16 resmi kitapçığı (8 ders × 2 dönem), toplam 320 soru.
- Her soru için adım adım çözüm, dayanak, tuzak şık açıklaması, bilgi kartları.
- Çalışma, deneme, aralıklı tekrar, hata defteri, istatistik, ayarlar ekranları.
- S Pen çizim alanı (soru ve konu ekranlarında).
- Maliyet Muhasebesi konu anlatımı modülü (14 konu, sınav odaklı, SVG görseller).
- PWA olarak GitHub Pages'te yayın; tam offline çalışma; JSON yedekleme.

Hariç (bilinçli olarak):
- 2025 ve öncesi klasik (yazılı) sorular.
- Diğer 7 ders için konu anlatımı.
- Sunucu, hesap, senkronizasyon, bildirim servisi.
- Native Android paketi.

## 4. Mimari

Saf web uygulaması; derleme adımı ve çalışma zamanı bağımlılığı yok. ES modülleri, tek sayfa (hash yönlendirme), service worker ile tam önbellek.

```
app/
  index.html
  manifest.json
  sw.js
  css/
    base.css        tema değişkenleri (açık/koyu), tipografi, yazı boyutu ölçekleri
    components.css  düğme, kart, alt sekme, alt panel, soru haritası
  js/
    app.js          başlangıç, hash yönlendirme, ekran yükleme, sürüm bildirimi
    db.js           IndexedDB katmanı; tüm kalıcı veri bu modülden geçer
    data.js         soru/çözüm/konu JSON'larını yükler ve bellekte indeksler
    fsrs.js         FSRS zamanlama algoritması (saf fonksiyonlar)
    exam.js         deneme oturumu: soru seçimi, sayaç, puanlama (saf + durum)
    planner.js      günlük plan hesabı (tekrar kotası, yeni soru hedefi, sınava kalan gün)
    ink.js          S Pen canvas bileşeni
    screens/
      home.js  study.js  exam.js  review.js  topics.js  stats.js  settings.js
      question-view.js  (soru + şıklar + çözüm paneli; study/exam/review ortak)
  data/
    index.json                      ders ve dönem listesi, sürüm numarası, kaynak kaydı
    questions/<donem>-<ders>.json   16 dosya
    solutions/<donem>-<ders>.json   16 dosya
    topics/maliyet/<nn>-<slug>.json 14 dosya
  img/originals/<donem>-<ders>-p<n>.png   kitapçık sayfaları (orijinali göster)
tools/
  extract_questions.py   PDF → ham JSON (metin blokları, kırmızı işaret = doğru şık, iptal, notlar)
  render_pages.py        PDF → PNG
  validate.py            yayın öncesi veri doğrulama (bkz. §7)
  build_sw_manifest.py   sw.js'deki önbellek listesini üretir
tests/
  *.test.js              node --test ile çalışan birim testleri
docs/superpowers/specs, docs/superpowers/plans
```

Ekranlar arası iletişim: ekran modülleri `db.js` ve `data.js`'e bağlanır, birbirine değil. `question-view.js` bir soru id'si ve mod ("study" | "exam" | "review") alır; cevap olaylarını geri çağırmayla yukarı verir.

## 5. Veri modeli

### 5.1 Ders kodları

| Kod | Ders | Oturum |
|---|---|---|
| FM | Finansal Muhasebe | 1 |
| MAL | Maliyet Muhasebesi | 1 |
| HUK | Hukuk | 1 |
| SPK | Sermaye Piyasası Mevzuatı | 1 |
| FTA | Finansal Tablolar ve Analizi | 2 |
| DEN | Muhasebe Denetimi | 2 |
| VER | Vergi Mevzuatı ve Uygulaması | 2 |
| MH | Muhasebecilik ve Mali Müşavirlik Meslek Hukuku | 2 |

Dönem kodları: `2026-1`, `2026-2`. Soru id: `<donem>-<ders>-<no>` örn. `2026-1-MAL-07`.

### 5.2 Soru (`data/questions/*.json`, dizi)

```json
{
  "id": "2026-1-MAL-07",
  "donem": "2026-1", "ders": "MAL", "no": 7,
  "konu": "mhk-analizi",
  "ortakBilgi": null,
  "metin": "<p>Aşağıdakilerden hangisi …?</p>",
  "secenekler": { "A": "<p>…</p>", "B": "…", "C": "…", "D": "…", "E": "…" },
  "dogru": "E",
  "iptal": false,
  "cevapNotu": null,
  "orijinal": { "sayfa": 2, "kutu": [0, 0, 0, 0] }
}
```

- `metin` ve `secenekler` HTML'dir. Yevmiye kayıtları `<table class="yevmiye">` (borç satırı sola, alacak satırı içeri girintili, tutar sütunları sağa), veri tabloları `<table class="veri">` ile yazılır. Para birimi ₺ olarak korunur.
- `ortakBilgi`: birden fazla soruya ortak veri verildiğinde (örn. Vergi 2026/2 soru 1-3 için tarife) HTML olarak her ilgili soruda tekrar edilir, böylece soru tek başına okunabilir.
- `iptal: true` olan sorular çalışma ekranında "İPTAL" rozetiyle gösterilir, denemeye ve tekrara girmez.
- `cevapNotu`: resmi anahtar değişikliği metni; `dogru` güncel anahtarı taşır.
- `konu`: Maliyet için 14 konu kodundan biri; diğer dersler için serbest etiket (istatistikte kullanılır).
- `orijinal.kutu`: sayfa PNG'si üzerinde sorunun kapladığı alan (x, y, genişlik, yükseklik; piksel). "Orijinali göster" bu alanı büyütülmüş gösterir.

### 5.3 Çözüm (`data/solutions/*.json`, dizi)

```json
{
  "id": "2026-1-MAL-07",
  "sonuc": "E",
  "ozet": "Tek cümlelik cevap gerekçesi.",
  "adimlar": ["<p>1. …</p>", "<p>2. …</p>"],
  "dayanak": "MHK analizi varsayımları; TMS 2 …",
  "tuzaklar": { "A": "Neden yanlış …", "C": "…" },
  "kartlar": [ { "on": "Soru", "arka": "Cevap" } ],
  "konuBaglantisi": "mhk-analizi"
}
```

`sonuc` resmi `dogru` ile eşleşmek zorundadır (validate.py). Hesaplı sorularda `adimlar` ara sonuçlarla birlikte verilir. `tuzaklar` en az iki yanlış şık için yazılır.

### 5.4 Konu (`data/topics/maliyet/*.json`)

```json
{
  "kod": "mhk-analizi", "sira": 10, "baslik": "Maliyet-Hacim-Kâr Analizi",
  "amac": "…",
  "bolumler": [
    { "baslik": "…", "html": "…", "gorsel": { "tip": "svg-static", "veri": {} } }
  ],
  "sinavYaklasimi": ["Kaynaklar arası farklılık varsa burada açıkça yazılır."],
  "ornekler": [ { "soru": "<p>…</p>", "cozum": ["<p>…</p>"] } ],
  "cikmisSorular": ["2026-1-MAL-07", "2026-2-MAL-11"],
  "kartlar": [ { "on": "…", "arka": "…" } ]
}
```

Görsel tipleri: `svg-static` (hazır inline SVG), `flow` (hesap akış şeması; veri olarak düğüm ve oklar, JS çizer), `cvp-interactive` (başabaş grafiği; fiyat, birim değişken maliyet, sabit maliyet kaydırıcıları), `allocation-table` (dağıtım tablosu, adım adım vurgulanır), `variance-tree` (sapma ağacı).

14 konu: 01 maliyet kavramları ve sınıflandırma; 02 maliyet akışı ve 7/A–7/B kayıt düzeni; 03 direkt ilk madde ve malzeme; 04 direkt işçilik; 05 genel üretim giderleri ve dağıtım; 06 sipariş maliyeti; 07 safha maliyeti; 08 birleşik ve yan ürün; 09 standart maliyet ve sapma analizi; 10 maliyet-hacim-kâr; 11 tam/normal/değişken maliyet yöntemleri; 12 bütçeleme ve esnek bütçe; 13 karar verme (ilgili maliyet); 14 faaliyet tabanlı maliyetleme.

### 5.5 Kullanıcı durumu (IndexedDB, veritabanı `smmm-koc`, sürüm 1)

| Depo | Anahtar | İçerik |
|---|---|---|
| `answers` | otomatik | `{soruId, cevap, dogruMu, emin, sure, mod, denemeId?, tarih, hataEtiketi?}` |
| `cards` | `kartId` | FSRS durumu: `{kartId, tur: "soru" veya "bilgi", kaynakId, stability, difficulty, due, reps, lapses, state, lastReview}` |
| `ink` | `hedefId` | `{hedefId, vuruslar: [{p:[[x,y,basinc],…], renk, kalinlik, silgi}], guncelleme}` |
| `exams` | `denemeId` | `{denemeId, tur, dersler, soruIdler, cevaplar, baslangic, bitis, sure, puanlar{ders: puan}, ortalama, bittiMi}` |
| `settings` | `anahtar` | yazı boyutu, tema, günlük hedef, sınav tarihi, son ekran |
| `flags` | `soruId` | bayrak, notlar |

Yedek: tüm depolar tek JSON `{surum, tarih, depolar:{…}}` olarak dışa aktarılır; geri yüklemede sürüm kontrolü, mevcut veri üzerine birleştirme değil tam değiştirme (kullanıcı onayı ile).

## 6. Öğrenme motoru

### 6.1 FSRS
`fsrs.js` saf fonksiyonlar: `newCard()`, `review(card, rating, now)` → yeni kart durumu. FSRS-4.5 varsayılan parametreleri; dört derece: 1 Tekrar, 2 Zor, 3 İyi, 4 Kolay. İstenen hatırlama oranı 0,9. Sınav tarihi geçildiğinde aralık sınava kadar olan günle sınırlanır.

Kart oluşturma kuralları:
- Çalışma modunda yanlış cevap veya "emin değilim" → soru kartı oluşur, 1 (Tekrar) ile başlar.
- Doğru ve emin → soru kartı 3 (İyi) ile oluşur; ilk aralığı FSRS belirler.
- Çözüm panelinde "Kartları ekle" ile çözümdeki bilgi kartları eklenir; konu modülünde "Konu kartlarını ekle" aynı işi yapar.
- Deneme sonunda yanlışlar tek dokunuşla kart olur.

### 6.2 Günlük plan (`planner.js`)
Girdi: günlük hedef (varsayılan 1,5 saat), vadesi gelmiş kart sayısı, sınava kalan gün, ders bazında görülmemiş soru sayısı ve doğruluk.
Çıktı: `{tekrarKotasi, yeniSoruHedefi, oneriDers, oneriKonu, mesaj}`.
Kural: tekrar kotası en fazla 40; yeni soru hedefi 20 (son 10 günde 10); öneri ders = en düşük doğruluk oranlı, eşitlikte en az görülmüş ders; sınava 7 gün kala "tam oturum denemesi yap" önerisi.

### 6.3 Hata defteri
Yanlış cevap sonrası etiket seçimi (zorunlu değil): `bilgi`, `dikkat`, `sure`, `okuma`. Hata defteri (İstatistik içinde) etiket, ders, dönem ile filtrelenir; "Bu listeden deneme kur" düğmesi.

### 6.4 Karma pratik ve aktif hatırlama
Çalış ekranı varsayılanı karışık ders ve rastgele sıra. Çözüm paneli cevap işaretlenmeden açılmaz; çalışma modunda "Boş geç" ile açılabilir, bu durumda kart 1 ile oluşur.

### 6.5 Feynman alanı
Çözüm panelinin altında "Kendi cümlenle anlat" başlıklı S Pen alanı; `ink` deposunda `feynman:<soruId>` anahtarıyla saklanır; tekrar sırasında çözümden önce gösterilir.

## 7. İçerik üretim hattı ve doğruluk güvencesi

1. `extract_questions.py`: pymupdf ile metin bloklarını sütun sırasına göre okur; soru başlangıçlarını (`^\d{1,2}\.`), şıkları (`^[A-E]\)`), siyah dışı renkli `X)` etiketini doğru cevap olarak, `İPTAL` ve "güncellenmiştir" satırlarını not olarak çıkarır. Çıktı `tools/out/raw/*.json`.
2. Elle düzeltme: ham çıktı `data/questions` biçimine aktarılırken her soru orijinal sayfa PNG'siyle karşılaştırılır; tablolar ve yevmiye kayıtları HTML tabloya dönüştürülür; konu etiketi verilir. Her dosya için kontrol notu `tools/out/review-<dosya>.md` (soru no, durum, not).
3. Çözümler yazılır. Hesaplı sorular çözülerek `sonuc` bulunur, anahtarla karşılaştırılır. Anahtarla çelişen durumda çözüm yayına alınmaz; kullanıcıya soru id'si ve çelişki raporlanır.
4. `validate.py` kuralları (hepsi geçmeden yayın yok):
   - Her dönem-ders dosyasında 20 soru, `no` 1..20 eksiksiz.
   - Her sorunun 5 seçeneği var, `dogru` A-E içinde (iptal olsa bile).
   - Her sorunun çözümü var; `cozum.sonuc == soru.dogru`.
   - HTML geçerli (etiketler kapanıyor); boş metin yok.
   - Konu etiketi Maliyet için 14 koddan biri.
   - `cikmisSorular` referansları mevcut soru id'lerine çözülüyor.
   - `index.json` sürüm numarası artırılmış.
5. Kaynak kaydı: `data/index.json` içinde her dosya için kaynak URL ve indirme tarihi.

Maliyet konu modülü doğruluk kuralı: her konu için anlatılan yöntem, o konuya etiketli resmi sorular üzerinde uygulanır ve sonuç anahtarla eşleşir (konu dosyasındaki `cikmisSorular` listesi bu kontrolün kaydıdır). Kaynaklar arasında farklı uygulanan noktalar `sinavYaklasimi` alanında açıkça belirtilir.

## 8. Ekranlar

Genel: alt sekme çubuğu (Ana Sayfa, Çalış, Deneme, Tekrar, Konular, İstatistik; Ayarlar sağ üst dişli). Telefon dikey öncelikli; yatayda S Pen paneli yan yana. Yazı boyutu 4 kademe. Açık/koyu tema sistemi takip eder, elle değiştirilebilir. Tüm dokunma hedefleri en az 44 px.

**Ana Sayfa:** sınava kalan gün; bugünkü plan kartı (tekrar/yeni soru ilerlemesi); ders bazında hazırlık çubukları (görülen soru oranı × doğruluk); "Devam et" (son bırakılan yer).

**Çalış:** filtre (ders çoklu seçim, dönem, sadece görülmemiş, sadece yanlışlar, sadece bayraklılar), sıra (karışık/sıralı). Soru ekranı: üst şerit (ders, soru id, ilerleme, bayrak), soru metni, şıklar, "Emin değilim" anahtarı, alt şerit (Önceki, S Pen, Sonraki). Cevap sonrası: şıklar renklenir, çözüm paneli yukarı kayar (özet, adımlar, dayanak, tuzaklar, kartlar ekle, hata etiketi, Feynman alanı, orijinali göster).

**Deneme:** mod seçimi: Tek ders (20 soru, 45 dk, bir dönemin resmi seti veya iki dönemden rastgele 20), Tam oturum (4 ders, 180 dk, oturum 1 veya 2), Özel (ders/dönem/adet/süre). Sınav görünümü: sayaç, soru haritası ızgarası (cevaplı/boş/bayraklı), "Boş bırak", "Sınavı bitir" onaylı. Sonuç ekranı: ders başına doğru/yanlış/boş, resmi puan, baraj durumu (50 ve ortalama 60), süre kullanımı, "Yanlışları tekrara ekle", "Yanlışları gözden geçir" (çalışma modunda çözümlerle).

**Tekrar:** vadesi gelen kartlar; soru kartında cevap sonra derece; bilgi kartında çevir sonra derece; günlük kota göstergesi; "Erken tekrar" seçeneği.

**Konular:** Maliyet Muhasebesi 14 konu listesi (ilerleme işareti); konu sayfası: amaç, bölümler (görselli), sınav yaklaşımı kutusu, örnekler (çözüm gizli, "Kendin çöz" S Pen alanı, sonra çözümü göster), çıkmış sorular (dokununca çalışma modunda açılır), "Konu kartlarını ekle".

**İstatistik:** ders ve konu bazında doğruluk ve ortalama süre; hata etiketi dağılımı; zayıf 5 konu; deneme geçmişi listesi; hata defteri.

**Ayarlar:** yazı boyutu, tema, günlük hedef, sınav tarihi, yedekle (JSON indir), geri yükle (dosya seç, onay), verileri sıfırla (onay), sürüm ve kaynak bilgisi.

## 9. S Pen (`ink.js`)

- Pointer Events; `pointerType === "pen"` çizer, `touch` kaydırır (avuç reddi), `mouse` çizer (masaüstü test).
- Kalınlık = taban × (0,5 + basınç); S Pen yan düğmesi veya silgi aracı silme.
- Araçlar: kalem (3 renk), silgi, geri al, ileri al, temizle, tam ekran.
- Vuruşlar vektör olarak saklanır; yeniden çizim deterministiktir. Canvas `devicePixelRatio` ile ölçeklenir.
- Soru ekranında alt panel (ekranın yarısı), konu örneklerinde satır içi alan. Kayıt her vuruş sonunda, geciktirmeli (300 ms).

## 10. Offline ve yayın

- `sw.js`: yükleme sırasında `build_sw_manifest.py` ile üretilen tam dosya listesini önbelleğe alır (uygulama + veri + görseller). Strateji: önbellek öncelikli; ağ varsa arka planda yeni sürümü indirir, hazır olunca uygulama "Yeni sürüm, yenile" şeridi gösterir.
- `manifest.json`: ad "SMMM Sınav Koçu", `display: standalone`, dikey, tema rengi, ikonlar (192/512).
- Yayın: GitHub deposu `smmm-sinav-kocu`, `app/` klasörü GitHub Pages ile yayınlanır. `gh` yüklenir ve kullanıcı oturum açar.
- Görsel boyutu: sayfa PNG'leri 150 dpi, toplam hedef 40 MB altı; ilk kurulumda indirilir.

## 11. Hata yönetimi

- Veri dosyası yüklenemezse: önbellekteki sürümle devam, üstte kısa uyarı.
- IndexedDB açılamazsa: uygulama salt okunur çalışır, "İlerleme kaydedilemiyor, yedek alın" uyarısı.
- Deneme sırasında uygulama kapanırsa: oturum durumu her cevapta kaydedilir; yeniden açılışta "Denemeye devam et" sorulur, sayaç geçen gerçek zamanı düşer.
- Geri yüklemede sürüm uyumsuzluğu: işlem reddedilir, açıklama gösterilir.
- Tüm kullanıcı mesajları Türkçe, tek cümle.

## 12. Test stratejisi

- Birim (node --test): `fsrs.js` (aralık artışı, derece etkileri, sınav tarihi sınırı), `exam.js` puanlama (0,25 ceza, iptal soru dağıtımı, baraj), `planner.js` kota kuralları, `db.js` yedek dışa/içe aktarma döngüsü (fake-indexeddb ile), soru ayrıştırıcı (Python, örnek PDF üzerinde 20 soru ve doğru anahtar).
- Veri: `validate.py` tüm kurallar; yayın komutu öncesi zorunlu çalışır.
- Tarayıcı: Chrome cihaz emülasyonu (412×915) ile ekran akışları; gerçek cihazda S Pen basınç ve avuç reddi, offline açılış, ana ekrana ekleme.

## 13. Yapım sırası (özet)

1. İskelet: index, yönlendirme, tema, alt sekme, db.js, sw.js, manifest.
2. Araçlar: extract_questions.py, render_pages.py, validate.py; 2026/1 Maliyet ile uçtan uca.
3. question-view + Çalış ekranı; S Pen bileşeni.
4. Veri: 16 dosyanın çıkarımı ve elle doğrulaması; çözümlerin yazılması (ders ders).
5. FSRS + Tekrar ekranı; planner + Ana Sayfa.
6. Deneme motoru + ekranları.
7. Maliyet konu modülü (14 konu, görseller).
8. İstatistik, Ayarlar, yedekleme.
9. GitHub Pages yayını, cihaz testi.
