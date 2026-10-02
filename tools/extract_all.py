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


# Resmi cevap anahtarı sayfalarından belirlenen iptal edilmiş sorular (kitapçıkları okuyarak saptandı).
BEKLENEN_IPTAL = frozenset({"2026-2-FTA-06", "2026-2-FTA-07", "2026-2-HUK-03", "2026-2-DEN-11"})
BEKLENEN_TOPLAM = 320


def supheli(q):
    """Cevabı olmayan veya tam beş seçeneği olmayan soru şüphelidir (iptal edilmiş olsa da)."""
    return q["dogru"] is None or len(q["secenekler_raw"]) != 5


def main(pdf_dir=None, out_dir=None, render_dir=None, do_render=True):
    """Çıkarır, yazar, kendini denetler. Çıkış kodu: 0 tamam, 1 sorun var."""
    pdf_dir = pathlib.Path(pdf_dir or HERE / "pdfs")
    out_dir = pathlib.Path(out_dir or HERE / "out" / "raw")
    problems = []
    total = 0
    iptal_all = set()
    out_dir.mkdir(parents=True, exist_ok=True)
    for pdf in sorted(pdf_dir.glob("*.pdf")):
        try:
            donem, ders = parse_name(pdf.stem)
        except ValueError as e:
            print(f"HATA: {e}")
            problems.append(str(e)); continue
        key = f"{donem}-{ders}"
        qs = extract(pdf, donem, ders)
        (out_dir / f"{key}.json").write_text(json.dumps(qs, ensure_ascii=False, indent=1), encoding="utf-8")
        npages = len(render(pdf, donem, ders, dest_dir=render_dir)) if do_render else 0
        eksik = [q["id"] for q in qs if supheli(q)]
        iptal = [q["id"] for q in qs if q["iptal"]]
        print(f"{key}: {len(qs)} soru, {npages} sayfa, şüpheli: {eksik}, iptal: {iptal}")
        if [q["no"] for q in qs] != list(range(1, 21)):
            problems.append(f"{key}: soru numaraları 1..20 değil ({len(qs)} soru)")
        if eksik: problems.append(f"{key}: şüpheli sorular {eksik}")
        total += len(qs); iptal_all.update(iptal)
    print("toplam", total)
    print("iptal:", sorted(iptal_all))
    if total != BEKLENEN_TOPLAM: problems.append(f"toplam {total}, beklenen {BEKLENEN_TOPLAM}")
    if iptal_all != BEKLENEN_IPTAL:
        problems.append(f"iptal kümesi beklenenden farklı: fazla {sorted(iptal_all - BEKLENEN_IPTAL)}, "
                        f"eksik {sorted(BEKLENEN_IPTAL - iptal_all)}")
    for p in problems: print("SORUN:", p)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
