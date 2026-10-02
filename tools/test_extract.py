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

# ---- Düzeltme turu 1: tüm kitapçıklar için sağlamlık testleri ----
import re
import pymupdf
from extract_questions import _lines, _split_key

ALL = []
for _f in sorted(PDF.glob("*.pdf")):
    _m = re.match(r"(\d{4})_(\d)_(.*)\.pdf", _f.name)
    ALL.append((_f, f"{_m[1]}-{_m[2]}", {"finansal-muhasebe": "FM", "maliyet-muhasebesi": "MAL", "finansal-tablolar-analizi": "FTA",
                                          "muhasebe-denetimi": "DEN", "vergi-mevzuati": "VER", "hukuk": "HUK",
                                          "meslek-hukuku": "MH", "spk-mevzuati": "SPK"}[_m[3]]))

@pytest.fixture(scope="module")
def tum():
    return {f"{d}-{k}": extract(f, d, k) for f, d, k in ALL}

# Cevap anahtarı sayfasındaki kırmızı "İPTAL" satırları (A kitapçığı soru no); sayfa görüntüleri 100 dpi'da
# render edilip gözle doğrulandı: HUK anahtarı satır 3, FTA anahtarı satır 6 ve 7, DEN anahtarı satır 11.
# 2026-1 kitapçıklarında cevap anahtarı sayfası ve İPTAL damgası yoktur.
BEKLENEN_IPTAL = {"2026-2-FTA-06", "2026-2-FTA-07", "2026-2-HUK-03", "2026-2-DEN-11"}

def test_16_kitapcik_20_soru_5_secenek(tum):
    assert len(ALL) == 16 and len(tum) == 16
    for kid, qs in tum.items():
        assert [q["no"] for q in qs] == list(range(1, 21)), kid
        for q in qs:
            assert list(q["secenekler_raw"]) == list("ABCDE"), q["id"]
            assert all(v.strip() for v in q["secenekler_raw"].values()), q["id"]

def test_iptal_disindakilerin_dogrusu_var(tum):
    for qs in tum.values():
        for q in qs:
            if not q["iptal"]:
                assert q["dogru"] in list("ABCDE"), q["id"]

def test_iptal_kumesi_tam_olarak_beklenen(tum):
    assert {q["id"] for qs in tum.values() for q in qs if q["iptal"]} == BEKLENEN_IPTAL

def test_kirmizi_sik_cevap_anahtariyla_ayni(tum):
    # 2026-2 kitapçıklarının sonundaki cevap anahtarı (A kitapçığı = bu PDF) ile kırmızı şık/güncelleme notu uyuşmalı
    for f, d, k in ALL:
        _, key = _split_key(_lines(pymupdf.open(str(f))))
        if d != "2026-2":
            assert key == {}
            continue
        assert sorted(key) == list(range(1, 21)), (d, k)
        for q in tum[f"{d}-{k}"]:
            assert q["dogru"] == key[q["no"]][0], q["id"]
            assert q["iptal"] == key[q["no"]][1], q["id"]

def test_cevap_anahtari_sorulara_karismaz(tum):
    for qs in tum.values():
        blob = qs[19]["metin_raw"] + " ".join(qs[19]["secenekler_raw"].values())
        assert "Anahtar" not in blob and "TEST BİTTİ" not in blob and "Tablo;" not in blob

def test_spk_2026_2_q17_iptal_davasi_secenek_degil_iptal(tum):
    q = tum["2026-2-SPK"][16]
    assert q["iptal"] is False and "İptal davası" in q["secenekler_raw"]["B"]

def test_den_2026_2_q11_seffaflik_secenegi(tum):
    q = tum["2026-2-DEN"][10]
    assert "Şeffaflık raporu" in q["secenekler_raw"]["A"] and q["dogru"] == "A"

def test_huk_2026_2_q8_satir_ici_secenekler(tum):
    q = tum["2026-2-HUK"][7]
    assert q["secenekler_raw"] == {"A": "2", "B": "3", "C": "5", "D": "10", "E": "20"}
    assert q["dogru"] == "D"

def test_satir_ici_secenekte_kirmizi_secenek_basina(tum):
    # FM 2026-1 Q12: "A) 18.000 B) 34.000" tek span; FTA 2026-1 Q9: "A) %2,00 B) %2,29" ve kırmızı olan B
    fm = tum["2026-1-FM"][11]
    assert fm["secenekler_raw"]["B"] == "34.000" and fm["dogru"] == "C"
    fta = tum["2026-1-FTA"][8]
    assert fta["secenekler_raw"]["B"] == "%2,29" and fta["dogru"] == "B"

def test_mal_2026_1_tablo_sayilari_korunur(tum):
    qs = tum["2026-1-MAL"]
    assert "5.000" in qs[3]["metin_raw"].splitlines()
    # Q18 katsayı tablosu: "5", "4", "1" hücreleri sayfa numarası sanılıp atılmamalı
    assert {"5", "4", "1"} <= set(qs[17]["metin_raw"].splitlines())

def test_ver_2026_2_q2_guncelleme_notu(tum):
    q = tum["2026-2-VER"][1]
    assert q["dogru"] == "A" and any("güncellen" in n for n in q["notlar"])
