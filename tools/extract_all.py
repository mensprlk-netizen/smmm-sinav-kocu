"""16 kitapçığı tek seferde çıkarır ve sayfa görüntülerini üretir. Kullanım: python extract_all.py"""
import json, pathlib, re, sys

from extract_questions import extract
from render_pages import render

SLUG = {"finansal-muhasebe": "FM", "maliyet-muhasebesi": "MAL", "hukuk": "HUK", "spk-mevzuati": "SPK",
        "finansal-tablolar-analizi": "FTA", "muhasebe-denetimi": "DEN", "vergi-mevzuati": "VER", "meslek-hukuku": "MH"}
HERE = pathlib.Path(__file__).parent
_NAME = re.compile(r"^(\d{4})_([12])_(.+)$")


def parse_name(stem):
    """'2026_1_hukuk' -> ('2026-1', 'HUK'); beklenmeyen ad için ValueError."""
    m = _NAME.match(stem)
    if not m:
        raise ValueError(f"beklenmeyen dosya adı: {stem!r} (beklenen: <yıl>_<1|2>_<ders-adı>)")
    if m.group(3) not in SLUG:
        raise ValueError(f"bilinmeyen ders adı: {m.group(3)!r} (dosya: {stem!r})")
    return f"{m.group(1)}-{m.group(2)}", SLUG[m.group(3)]


def main():
    total = 0
    for pdf in sorted((HERE / "pdfs").glob("*.pdf")):
        donem, ders = parse_name(pdf.stem)
        qs = extract(pdf, donem, ders)
        dest = HERE / "out" / "raw" / f"{donem}-{ders}.json"
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(json.dumps(qs, ensure_ascii=False, indent=1), encoding="utf-8")
        pages = render(pdf, donem, ders)
        eksik = [q["id"] for q in qs if (q["dogru"] is None and not q["iptal"]) or len(q["secenekler_raw"]) != 5]
        print(f"{donem}-{ders}: {len(qs)} soru, {len(pages)} sayfa, şüpheli: {eksik}")
        total += len(qs)
    print("toplam", total)


if __name__ == "__main__":
    main()
