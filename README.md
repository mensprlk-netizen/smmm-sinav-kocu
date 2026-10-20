# SMMM Sınav Koçu

28 Kasım 2026 SMMM Yeterlilik Sınavı için çevrimdışı çalışan PWA. 2026/1 ve 2026/2 resmi test soruları (8 ders × 2 dönem × 20 soru), bağımsız incelemeden geçmiş çözümler, FSRS aralıklı tekrar, deneme simülasyonu (resmi puanlama), S Pen çözüm alanı, Maliyet Muhasebesi için 14 konuluk konu anlatımı modülü.

## Kurulum (telefon)
1. Chrome'da yayın adresini aç.
2. Menü → "Ana ekrana ekle".
3. İlk açılış internetle; sonrası internetsiz çalışır. Yeni sürüm yayınlanınca uygulama "Yeni sürüm hazır" şeridi gösterir.
4. İlerleme telefonda (IndexedDB) saklanır; Ayarlar → "Yedekle" ile JSON dosyası alınıp "Geri yükle" ile başka cihaza taşınabilir.

## Geliştirme
- `npm install && npm test` (JS testleri, Node 24), `python -m pytest tools -q` (Python araç testleri)
- `npm run serve` → http://localhost:8080
- İçerik doğrulama: `python tools/validate.py` (çıkış kodu 0 = geçti)
- Çevrimdışı önbellek listesi: `python tools/build_sw_manifest.py` (her içerik değişikliğinden sonra; `--check` ile doğrulanır)
- Yayın: `bash tools/deploy.sh` (main dalından; `gh auth login` gerekir)

## İçerik
- Sorular TÜRMOB-TESMER resmi soru kitapçıklarından aynen aktarılmıştır (bkz. `app/data/index.json` → kaynaklar); sayfa görüntüleri `app/img/originals/`.
- Çözümler bu proje için yazılmış, bağımsız olarak yeniden çözülerek resmi cevap anahtarıyla doğrulanmıştır. Anahtarla çelişen ya da tartışmalı sorular `docs/icerik-inceleme/review-*.md` dosyalarında kayıtlıdır; çözümü yayımlanmayan sorular `tools/allow-missing.txt` listesindedir.
- Konu anlatımları `app/data/topics/maliyet/`; her konunun yöntemi o konuya düşen resmi sorular üzerinde yeniden çalıştırılarak doğrulanmıştır.

## Yapı
- `app/` — bağımlılıksız statik PWA (ES modülleri, hash yönlendirme, IndexedDB, service worker)
- `app/fonts/` — yerel yazı tipleri: Archivo (arayüz, sayılar) ve Literata (okuma metni), SIL OFL; tasarım dili için bkz. `docs/superpowers/specs/2026-10-20-arayuz-tasarim-design.md`
- `tools/` — PDF'den soru çıkarma, doğrulama, önbellek listesi ve yayın betikleri
- `tests/` — jsdom + fake-indexeddb ile JS testleri
- `docs/` — tasarım/plan belgeleri, içerik inceleme notları, cihaz kontrol listesi
