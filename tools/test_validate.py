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


def _base(tmp, donemler=("2026-1",), dersler=("MAL",), konular=("10-maliyet-hacim-kar",), index=None):
    (tmp / "data/questions").mkdir(parents=True); (tmp / "data/solutions").mkdir(parents=True)
    (tmp / "data/topics/maliyet").mkdir(parents=True)
    idx = index if index is not None else {"surum": 1, "donemler": list(donemler), "dersler": list(dersler), "konular": list(konular)}
    (tmp / "data/index.json").write_text(json.dumps(idx), encoding="utf-8")

def _put(tmp, rel, obj, raw=False):
    (tmp / rel).write_text(obj if raw else json.dumps(obj), encoding="utf-8")

def _ok(tmp, qs=None, ss=None):
    _write(tmp, qs if qs is not None else [_q(i) for i in range(1, 21)], ss if ss is not None else [_s(i) for i in range(1, 21)])

def _run(tmp):
    errs = validate(tmp)
    assert isinstance(errs, list)
    return errs

def test_malformed_question_json_other_file_still_reported(tmp_path):
    _base(tmp_path, dersler=("MAL", "HUK"), konular=())
    _put(tmp_path, "data/questions/2026-1-MAL.json", "{invalid json", raw=True)
    _put(tmp_path, "data/solutions/2026-1-MAL.json", [])
    qs = [_q(i, id=f"2026-1-HUK-{i:02d}", ders="HUK") for i in range(1, 21)]; qs[0]["dogru"] = "Z"
    _put(tmp_path, "data/questions/2026-1-HUK.json", qs)
    _put(tmp_path, "data/solutions/2026-1-HUK.json", [_s(i, id=f"2026-1-HUK-{i:02d}") for i in range(1, 21)])
    errs = _run(tmp_path)
    assert "2026-1-MAL: soru dosyası okunamadı (JSON hatası)" in errs
    assert "2026-1-HUK-01: dogru A-E değil" in errs

def test_solution_file_missing(tmp_path):
    _write(tmp_path, [_q(i) for i in range(1, 21)], [])
    (tmp_path / "data/solutions/2026-1-MAL.json").unlink()
    errs = _run(tmp_path)
    assert "2026-1-MAL: çözüm dosyası yok" in errs
    for i in range(1, 21):
        assert f"2026-1-MAL-{i:02d}: çözüm yok" in errs

def test_no_not_int(tmp_path):
    qs = [_q(i) for i in range(1, 21)]; qs[0]["no"] = "a"
    _ok(tmp_path, qs)
    errs = _run(tmp_path)
    assert "2026-1-MAL: 1. soru no alanı eksik veya tamsayı değil" in errs
    assert not any("çözümün sorusu yok" in e for e in errs)

def test_question_missing_no(tmp_path):
    qs = [_q(i) for i in range(1, 21)]; del qs[0]["no"]
    _ok(tmp_path, qs)
    errs = _run(tmp_path)
    assert "2026-1-MAL: 1. soru no alanı eksik veya tamsayı değil" in errs
    assert not any("çözümün sorusu yok" in e for e in errs)

def test_non_dict_item(tmp_path):
    qs = [_q(i) for i in range(1, 21)]; qs[5] = "not a dict"
    _ok(tmp_path, qs)
    assert "2026-1-MAL: 6. öğe sözlük değil" in _run(tmp_path)

def test_question_file_not_list(tmp_path):
    _ok(tmp_path)
    _put(tmp_path, "data/questions/2026-1-MAL.json", 5)
    assert "2026-1-MAL: soru dosyası liste olmalı" in _run(tmp_path)

def test_solution_file_not_list(tmp_path):
    _ok(tmp_path)
    _put(tmp_path, "data/solutions/2026-1-MAL.json", {"a": 1})
    assert "2026-1-MAL: çözüm dosyası liste olmalı" in _run(tmp_path)

def test_index_missing_dersler(tmp_path):
    _base(tmp_path, index={"surum": 1, "donemler": ["2026-1"]})
    assert "index.json: dersler eksik" in _run(tmp_path)

def test_index_not_dict(tmp_path):
    _base(tmp_path, index=[1, 2])
    assert _run(tmp_path) == ["index.json: sözlük olmalı"]

def test_index_bad_utf8(tmp_path):
    _base(tmp_path)
    (tmp_path / "data/index.json").write_bytes(b"\xff\xfe\x80{")
    assert _run(tmp_path) == ["index.json: okunamadı (kodlama hatası)"]

def test_question_file_bad_utf8(tmp_path):
    _ok(tmp_path)
    (tmp_path / "data/questions/2026-1-MAL.json").write_bytes(b"\xff\xfe\x80")
    assert "2026-1-MAL: soru dosyası okunamadı (kodlama hatası)" in _run(tmp_path)

def test_solution_without_id(tmp_path):
    ss = [_s(i) for i in range(1, 21)]; del ss[2]["id"]
    _ok(tmp_path, ss=ss)
    errs = _run(tmp_path)
    assert "2026-1-MAL: çözüm 3. öğe id eksik veya geçersiz" in errs
    assert "2026-1-MAL-03: çözüm yok" in errs

def test_non_dict_solution(tmp_path):
    ss = [_s(i) for i in range(1, 21)]; ss[4] = 7
    _ok(tmp_path, ss=ss)
    assert "2026-1-MAL: çözüm 5. öğe sözlük değil" in _run(tmp_path)

def test_duplicate_solution_id(tmp_path):
    ss = [_s(i) for i in range(1, 21)] + [_s(3)]
    _ok(tmp_path, ss=ss)
    assert "2026-1-MAL-03: yinelenen çözüm id" in _run(tmp_path)

def test_duplicate_question_id(tmp_path):
    qs = [_q(i) for i in range(1, 21)]; qs[5]["id"] = "2026-1-MAL-01"
    _ok(tmp_path, qs)
    assert "2026-1-MAL-01: yinelenen soru id" in _run(tmp_path)

def test_orphan_solution_id(tmp_path):
    ss = [_s(i) for i in range(1, 21)] + [_s(21)]
    _ok(tmp_path, ss=ss)
    assert "2026-1-MAL-21: çözümün sorusu yok" in _run(tmp_path)

def test_orphan_id_belongs_to_other_file(tmp_path):
    _base(tmp_path, dersler=("MAL", "HUK"), konular=())
    _put(tmp_path, "data/questions/2026-1-MAL.json", [_q(i) for i in range(1, 21)])
    _put(tmp_path, "data/solutions/2026-1-MAL.json", [_s(i) for i in range(1, 21)] + [_s(1, id="2026-1-HUK-01")])
    _put(tmp_path, "data/questions/2026-1-HUK.json", [_q(i, id=f"2026-1-HUK-{i:02d}", ders="HUK") for i in range(1, 21)])
    _put(tmp_path, "data/solutions/2026-1-HUK.json", [_s(i, id=f"2026-1-HUK-{i:02d}") for i in range(1, 21)])
    assert "2026-1-HUK-01: çözümün sorusu yok" in _run(tmp_path)

def test_solution_file_without_question_file(tmp_path):
    _ok(tmp_path)
    (tmp_path / "data/questions/2026-1-MAL.json").unlink()
    assert "2026-1-MAL: çözüm dosyası var ama soru dosyası yok" in _run(tmp_path)

def test_secenekler_list(tmp_path):
    qs = [_q(i) for i in range(1, 21)]; qs[1]["secenekler"] = ["a", "b"]
    _ok(tmp_path, qs)
    assert "2026-1-MAL-02: seçenekler sözlük olmalı" in _run(tmp_path)

def test_tuzaklar_string(tmp_path):
    ss = [_s(i) for i in range(1, 21)]; ss[5]["tuzaklar"] = "x"
    _ok(tmp_path, ss=ss)
    assert "2026-1-MAL-06: tuzaklar sözlük olmalı" in _run(tmp_path)

def test_adimlar_string(tmp_path):
    ss = [_s(i) for i in range(1, 21)]; ss[3]["adimlar"] = "x"
    _ok(tmp_path, ss=ss)
    assert "2026-1-MAL-04: adımlar liste olmalı" in _run(tmp_path)

def test_adimlar_missing_single_line(tmp_path):
    ss = [_s(i) for i in range(1, 21)]; del ss[6]["adimlar"]
    _ok(tmp_path, ss=ss)
    lines = [e for e in _run(tmp_path) if e.startswith("2026-1-MAL-07")]
    assert lines == ["2026-1-MAL-07: çözüm adımlar eksik veya boş"]

def test_kartlar_string(tmp_path):
    ss = [_s(i) for i in range(1, 21)]; ss[0]["kartlar"] = "x"
    _ok(tmp_path, ss=ss)
    assert "2026-1-MAL-01: çözüm: kartlar liste olmalı" in _run(tmp_path)

def test_kartlar_item_missing_arka(tmp_path):
    ss = [_s(i) for i in range(1, 21)]; ss[0]["kartlar"] = [{"on": "q"}]
    _ok(tmp_path, ss=ss)
    assert "2026-1-MAL-01: çözüm: kartlar 1. öğe 'arka' eksik veya boş" in _run(tmp_path)

def test_topic_not_dict(tmp_path):
    _ok(tmp_path)
    _put(tmp_path, "data/topics/maliyet/10-maliyet-hacim-kar.json", [1])
    assert "konu 10-maliyet-hacim-kar: dosya sözlük olmalı" in _run(tmp_path)

def test_topic_bolum_not_dict(tmp_path):
    konu = {"kod": "10-maliyet-hacim-kar", "bolumler": ["x"], "cikmisSorular": [], "kartlar": []}
    _write(tmp_path, [_q(i) for i in range(1, 21)], [_s(i) for i in range(1, 21)], [konu])
    assert "konu 10-maliyet-hacim-kar: bölüm 1. öğe sözlük değil" in _run(tmp_path)

def test_gate_sonuc_mismatch_after_guards(tmp_path):
    ss = [_s(i) for i in range(1, 21)]; ss[8]["sonuc"] = "C"
    _ok(tmp_path, ss=ss)
    assert "2026-1-MAL-09: çözüm sonuc (C) anahtarla (A) uyuşmuyor" in _run(tmp_path)
