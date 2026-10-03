#!/usr/bin/env bash
# Doğrula, önbellek listesini üret, test et, main'i gönder, app/ içeriğini gh-pages dalına yayınla.
# Ön koşullar: `gh auth login` yapılmış, uzak depo `origin` tanımlı, çalışılan dal main.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ "$(git branch --show-current)" != "main" ]; then
  echo "Yayın yalnız main dalından yapılır (şu an: $(git branch --show-current))." >&2
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Çalışma ağacı temiz değil; önce değişiklikleri işleyin veya saklayın." >&2
  exit 1
fi

PYTHONIOENCODING=utf-8 python tools/validate.py
PYTHONIOENCODING=utf-8 python tools/build_sw_manifest.py
npm test

# Yalnız üretilen önbellek listesi işlenir (kullanıcının yayın işlemesi; yardımcı eş-yazar satırı yok).
git add app/sw-manifest.js
if ! git diff --cached --quiet; then
  git commit -qm "Yayın: $(date +%F)"
fi
git push origin main

# app/ alt ağacını gh-pages dalı olarak gönder (geçmiş yeniden yazılır; Pages için sorun değil).
git branch -D gh-pages-tmp 2>/dev/null || true
git subtree split --prefix app -b gh-pages-tmp
git push -f origin gh-pages-tmp:gh-pages
git branch -D gh-pages-tmp

echo "Yayınlandı: https://$(gh api user -q .login).github.io/smmm-sinav-kocu/"
echo "Pages kaynağı ayarlı değilse bir kez: gh api -X POST repos/{owner}/smmm-sinav-kocu/pages -f build_type=legacy -f 'source[branch]=gh-pages' -f 'source[path]=/'"
