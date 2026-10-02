import pathlib, pytest
import extract_all
from extract_all import parse_name, supheli, BEKLENEN_IPTAL


def test_parse_name_ok():
    assert parse_name("2026_1_spk-mevzuati") == ("2026-1", "SPK")
    assert parse_name("2026_2_finansal-tablolar-analizi") == ("2026-2", "FTA")


@pytest.mark.parametrize("stem", ["notes", "2026_3_hukuk", "2026_1_bilinmeyen-ders"])
def test_parse_name_errors(stem):
    with pytest.raises(ValueError) as e:
        parse_name(stem)
    assert stem in str(e.value)


def _q(dogru="A", iptal=False, n=5):
    return {"dogru": dogru, "iptal": iptal, "secenekler_raw": ["x"] * n}


def test_supheli_cases():
    assert supheli(_q(dogru=None))
    assert supheli(_q(dogru=None, iptal=True))
    assert supheli(_q(n=4))
    assert not supheli(_q(iptal=True))
    assert not supheli(_q())


def test_unexpected_file_name_reported(tmp_path, capsys):
    (tmp_path / "notes.pdf").write_bytes(b"")
    assert extract_all.main(pdf_dir=tmp_path, out_dir=tmp_path / "o", do_render=False) == 1
    out = capsys.readouterr().out
    assert "HATA:" in out and "notes" in out


def test_main_real_booklets(tmp_path, capsys):
    code = extract_all.main(out_dir=tmp_path, do_render=False)
    out = capsys.readouterr().out
    assert code == 0, out
    assert "toplam 320" in out
    assert len(list(tmp_path.glob("*.json"))) == 16
    assert f"iptal: {sorted(BEKLENEN_IPTAL)}" in out
