import json, pathlib, pytest
from extract_questions import extract

PDF = pathlib.Path(__file__).parent / "pdfs"

def test_maliyet_2026_1_yirmi_soru():
    qs = extract(PDF / "2026_1_maliyet-muhasebesi.pdf", "2026-1", "MAL")
    assert [q["no"] for q in qs] == list(range(1, 21))
    assert qs[0]["id"] == "2026-1-MAL-01"
    assert qs[0]["metin_raw"].startswith("Büro mobilyası üreten")
    for q in qs:
        assert set(q["secenekler_raw"]) == set("ABCDE"), q["id"]
        assert q["dogru"] in "ABCDE", q["id"]
        assert q["kutu"][2] > 0 and q["kutu"][3] > 0

def test_hukuk_2026_2_sirali_numaralama_ve_iptal():
    qs = extract(PDF / "2026_2_hukuk.pdf", "2026-2", "HUK")
    assert [q["no"] for q in qs] == list(range(1, 21))
    assert any(q["iptal"] for q in qs)

def test_vergi_2026_2_cevap_guncelleme():
    qs = extract(PDF / "2026_2_vergi-mevzuati.pdf", "2026-2", "VER")
    q2 = qs[1]
    assert q2["dogru"] == "A"
    assert any("güncellen" in n for n in q2["notlar"])

def test_fta_2026_2_iptal_var():
    qs = extract(PDF / "2026_2_finansal-tablolar-analizi.pdf", "2026-2", "FTA")
    assert sum(q["iptal"] for q in qs) >= 1
