import json, pathlib
from validate import validate

def _q(no, **kw):
    d = {"id": f"2026-1-MAL-{no:02d}", "donem": "2026-1", "ders": "MAL", "no": no, "konu": "10-maliyet-hacim-kar",
         "ortakBilgi": None, "metin": "<p>s</p>", "secenekler": {k: "<p>x</p>" for k in "ABCDE"},
         "dogru": "A", "iptal": False, "cevapNotu": None, "orijinal": {"sayfa": 1, "kutu": [0, 0, 1, 1]}}
    d.update(kw); return d

def _s(no, **kw):
    d = {"id": f"2026-1-MAL-{no:02d}", "sonuc": "A", "ozet": "o", "adimlar": ["<p>1</p>"], "dayanak": "d",
         "tuzaklar": {"B": "b", "C": "c"}, "kartlar": [], "konuBaglantisi": "10-maliyet-hacim-kar"}
    d.update(kw); return d

def _write(tmp, qs, ss, konular=None):
    (tmp / "data/questions").mkdir(parents=True); (tmp / "data/solutions").mkdir(parents=True)
    (tmp / "data/topics/maliyet").mkdir(parents=True)
    (tmp / "data/index.json").write_text(json.dumps({"surum": 1, "donemler": ["2026-1"], "dersler": ["MAL"],
        "konular": ["10-maliyet-hacim-kar"]}), encoding="utf-8")
    (tmp / "data/questions/2026-1-MAL.json").write_text(json.dumps(qs), encoding="utf-8")
    (tmp / "data/solutions/2026-1-MAL.json").write_text(json.dumps(ss), encoding="utf-8")
    for k in (konular or []):
        (tmp / f"data/topics/maliyet/{k['kod']}.json").write_text(json.dumps(k), encoding="utf-8")

def test_gecerli_veri(tmp_path):
    _write(tmp_path, [_q(i) for i in range(1, 21)], [_s(i) for i in range(1, 21)])
    errs = validate(tmp_path)
    assert [e for e in errs if "MAL" in e] == []

def test_eksik_soru_ve_anahtar_uyumsuzlugu(tmp_path):
    qs = [_q(i) for i in range(1, 20)]
    ss = [_s(i) for i in range(1, 20)]; ss[0]["sonuc"] = "B"
    _write(tmp_path, qs, ss)
    errs = validate(tmp_path)
    assert any("20 soru" in e for e in errs)
    assert any("2026-1-MAL-01" in e and "sonuc" in e for e in errs)

def test_html_ve_konu_kontrolu(tmp_path):
    qs = [_q(i) for i in range(1, 21)]; qs[2]["metin"] = "<p>açık"; qs[3]["konu"] = "yok"
    _write(tmp_path, qs, [_s(i) for i in range(1, 21)])
    errs = validate(tmp_path)
    assert any("2026-1-MAL-03" in e and "HTML" in e for e in errs)
    assert any("2026-1-MAL-04" in e and "konu" in e for e in errs)

def test_konu_cikmis_soru_referansi(tmp_path):
    konu = {"kod": "10-maliyet-hacim-kar", "sira": 10, "baslik": "MHK", "amac": "a", "bolumler": [{"baslik": "b", "html": "<p>x</p>"}],
            "sinavYaklasimi": [], "ornekler": [], "cikmisSorular": ["2026-1-MAL-99"], "kartlar": []}
    _write(tmp_path, [_q(i) for i in range(1, 21)], [_s(i) for i in range(1, 21)], [konu])
    errs = validate(tmp_path)
    assert any("2026-1-MAL-99" in e for e in errs)
