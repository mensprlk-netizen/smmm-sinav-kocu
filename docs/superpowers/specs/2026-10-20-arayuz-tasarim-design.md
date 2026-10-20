# Arayüz tasarım dili — "Defter ve optik form"

Tarih: 20 Ekim 2026
Durum: Uygulandı (bu belge kararların kaydıdır; ileride yapılacak görsel işler buradan devam eder).

## 1. Amaç

Uygulama gösterildiğinde akılda kalsın, üretilmiş/şablon görünmesin; günlük çalışmayı daha zevkli kılsın. Kullanıcı yönü tasarımcıya bıraktı ("kaptan sendeyiz"); tek ölçüt: WOW dedirtmeli, "AI kokmamalı".

## 2. Kavram

Konu muhasebe, hedef resmî bir test sınavı. Görsel dil de oradan geliyor:

- **Defter**: Kâğıt yüzeyler, defter satırları (etiket ···· değer; noktalı kılavuz etiketi değere bağlar), tablo sayıları (tabular-nums), yeşil mürekkep ileri/doğru, kırmızı mürekkep yanlış/uyarı.
- **Optik form**: Şıklar yuvarlak içinde harf; denemede kurşun kalemle (grafit) doldurulur, çalışmada doğru yeşil, yanlış kırmızı dolar. Soru haritasında cevaplananlar grafitle dolu kutu.
- **Takvim yaprağı** (ana ekranın kahramanı): Üstü delikli koparılabilir yaprak; büyük yoğun sayı (sınava kalan gün), altında günün satırı (plan mesajı, serif), haftanın yedi noktası (çalışılan günler) ve seri.
- **Kaşe**: Deneme sonucu "GEÇTİ / KALDI" eğik kaşe.

Cesaret tek yerde harcandı: takvim yaprağı. Geri kalan her şey sakin ve disiplinli.

## 3. Belirteçler (`app/css/base.css`)

| Belirteç | Açık | Koyu | Rol |
|---|---|---|---|
| `--paper` | #eef1ea | #0f1512 | sayfa (soğuk defter kâğıdı; krem değil) |
| `--sheet` | #fbfcf9 | #182019 | yaprak, soru kâğıdı, kart |
| `--ink` / `--ink-2` | #15231c / #5c6b62 | #e7ece6 / #9aa89f | yazı / ikincil |
| `--rule` / `--rule-2` | #c9d2c6 / #e1e7de | #2e3b33 / #222c26 | çizgiler |
| `--green` / `--green-soft` | #1d5c43 / #dcebe1 | #7fcba4 / #1e3a2d | eylem, doğru, ilerleme |
| `--red` / `--red-soft` | #b3261e / #f6dedb | #f0887e / #4a2320 | yanlış, bayrak, uyarı, süre azaldı |
| `--graphite` | #2a2d2b | #e7ece6 | denemede doldurulan yuvarlak |
| `--mark` | #efe3a1 | #6b5f1d | fosforlu kalem: tabloda vurgulu hücre |

Eski adlar (`--primary`, `--surface`, `--text`, `--muted`, `--border`, `--ok`, `--err`, `--accent`, `--sel`) takma ad olarak korunur; konu JSON'larındaki SVG'ler ve `visuals.js` bunları kullanır.

## 4. Yazı

- **Archivo** (değişken: ağırlık 100–900, genişlik 62–125): arayüz, başlıklar, düğmeler, sekmeler, tüm sayılar. Yaprak sayısı ve puan `font-stretch: 74–78%` ile yoğun; sayaç 85%.
- **Literata** (değişken, optik boyutlu; normal + italik): okuma metni — soru, şıklar, çözüm, konu anlatımı, bilgi kartı. Basılı kitapçığı yansıtır.
- Dosyalar `app/fonts/` içinde yerel (çevrimdışı şart). Google Fonts'un latin ve latin-ext alt kümeleri; Türkçe harfler latin-ext'te. Lisans: SIL OFL 1.1 (`app/fonts/OFL-*.txt`).
- Ölçek: `--fs` tabanı ve `data-fs` kademeleri korunur. h1 1.7em/700, gövde 1em/1.5, serif gövde 1.03em/1.6.

## 5. Yerleşim ve bileşenler

- Üst çubuk kâğıt renginde, altında çizgi; sağda ayarlar simgesi.
- Alt sekmeler: 6 simge (SVG, inline) + kısa ad; etkin sekmenin üstünde yeşil ayraç.
- Ana ekran: yaprak → "Bugünkü defter" (Tekrar, Yeni soru satırları + çubuk, iki düğme) → "Dersler" (her ders bir satır: görülen/toplam, doğruluk, çubuk; önerilen derste "Öneri" rozeti). Metin sola yaslı; yalnız yaprak ortalı.
- Soru ekranı: başlık satırı (ders kalın, dönem/soru no küçük, sayaç sağda), soru kâğıdı, şıklar, yapışkan alt düğmeler, çözüm paneli (sol yeşil çizgi, açılırken 220 ms kayma).
- Kartlar (`.card`) form bölümü gibi: başlığın altında ince çizgi, gölge yok, 10 px köşe.

## 6. Hareket

Yalnızca bir eyleme cevap olarak: şık yuvarlağının dolması (180 ms), çözüm panelinin gelmesi (220 ms), alt panel. Sayfa açılış animasyonu yok. `prefers-reduced-motion` tüm geçişleri kapatır. Android'de dokunsal geri bildirim: doğru kısa, yanlış çift vuruş (`navigator.vibrate`, yoksa sessiz).

## 7. Zevk katan eklemeler

- Çalışma serisi ve hafta noktaları (`planner.js`: `aktifGunler`, `seriHesapla`, `haftaOzeti`; cevap satırları + bugünkü tekrar sayacından türetilir, ek kayıt yok).
- Çalışma listesi bitince özet kartı (doğru / yanlış / boş).
- Deneme sonucunda kaşe; tekrar bitişinde bugünkü kart sayısı.

## 8. Kaçınılanlar

Krem zemin + serif başlık + kiremit vurgu; siyah zemin + tek neon; eş kartlardan oluşan "SaaS kiti" ve gölgeler; büyük harfli etiketler; ok eklenmiş bağlantılar; küçük veri etiketlerinde monospace. Yaprak sayısı için de mono değil, yoğun Archivo.

## 9. Doğrulama

Playwright ile 390×844 görünümde açık/koyu ekran görüntüleri; `npm test` (297 test), `python tools/validate.py`, `python tools/build_sw_manifest.py --check`.
