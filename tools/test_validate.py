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

def test_malformed_question_json(tmp_path):
    (tmp_path / "data/questions").mkdir(parents=True); (tmp_path / "data/solutions").mkdir(parents=True)
    (tmp_path / "data/topics/maliyet").mkdir(parents=True)
    (tmp_path / "data/index.json").write_text(json.dumps({"surum": 1, "donemler": ["2026-1"], "dersler": ["MAL"],
        "konular": ["10-maliyet-hacim-kar"]}), encoding="utf-8")
    (tmp_path / "data/questions/2026-1-MAL.json").write_text("{invalid json", encoding="utf-8")
    (tmp_path / "data/solutions/2026-1-MAL.json").write_text(json.dumps([]), encoding="utf-8")
    errs = validate(tmp_path)
    assert isinstance(errs, list)
    assert any("2026-1-MAL" in e and ("JSON" in e or "okunamadı" in e) for e in errs)

def test_question_missing_no(tmp_path):
    qs = [_q(i) for i in range(1, 21)]; del qs[0]["no"]
    _write(tmp_path, qs, [_s(i) for i in range(1, 21)])
    errs = validate(tmp_path)
    assert isinstance(errs, list)
    assert any("2026-1-MAL" in e and "no" in e.lower() for e in errs)

def test_non_dict_item(tmp_path):
    qs = [_q(i) for i in range(1, 21)]; qs[5] = "not a dict"
    _write(tmp_path, qs, [_s(i) for i in range(1, 21)])
    errs = validate(tmp_path)
    assert isinstance(errs, list)
    assert any("sözlük" in e or "dict" in e.lower() or "6" in e for e in errs)

def test_index_missing_dersler(tmp_path):
    (tmp_path / "data/questions").mkdir(parents=True); (tmp_path / "data/solutions").mkdir(parents=True)
    (tmp_path / "data/topics/maliyet").mkdir(parents=True)
    (tmp_path / "data/index.json").write_text(json.dumps({"surum": 1, "donemler": ["2026-1"]}), encoding="utf-8")
    errs = validate(tmp_path)
    assert isinstance(errs, list)
    assert any("index.json" in e and ("dersler" in e or "eksik" in e) for e in errs)

def test_orphan_solution_id(tmp_path):
    qs = [_q(i) for i in range(1, 21)]
    ss = [_s(i) for i in range(1, 21)]; ss.append(_s(21))  # Extra solution for non-existent question
    _write(tmp_path, qs, ss)
    errs = validate(tmp_path)
    assert isinstance(errs, list)
    assert any("2026-1-MAL-21" in e and "sorusu yok" in e for e in errs)

def test_duplicate_question_id(tmp_path):
    qs = [_q(i) for i in range(1, 21)]; qs[5]["id"] = "2026-1-MAL-01"  # Duplicate first question's id
    _write(tmp_path, qs, [_s(i) for i in range(1, 21)])
    errs = validate(tmp_path)
    assert isinstance(errs, list)
    assert any("2026-1-MAL-01" in e and "yinelenen" in e for e in errs)

def test_tuzaklar_string(tmp_path):
    qs = [_q(i) for i in range(1, 21)]
    ss = [_s(i) for i in range(1, 21)]; ss[5]["tuzaklar"] = "not a dict"
    _write(tmp_path, qs, ss)
    errs = validate(tmp_path)
    assert isinstance(errs, list)
    assert any("2026-1-MAL-06" in e and ("tuzaklar" in e and "sözlük" in e) for e in errs)

def test_adimlar_string(tmp_path):
    qs = [_q(i) for i in range(1, 21)]
    ss = [_s(i) for i in range(1, 21)]; ss[3]["adimlar"] = "not a list"
    _write(tmp_path, qs, ss)
    errs = validate(tmp_path)
    assert isinstance(errs, list)
    assert any("2026-1-MAL-04" in e and "adımlar" in e.lower() for e in errs)
