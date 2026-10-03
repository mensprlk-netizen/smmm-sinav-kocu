import json
import re
import subprocess
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent))
import build_sw_manifest as m


@pytest.fixture
def app(tmp_path):
    (tmp_path / "data").mkdir()
    (tmp_path / "index.html").write_bytes(b"<html>")
    (tmp_path / "data" / "a.json").write_bytes(b"{}")
    (tmp_path / "sw.js").write_bytes(b"sw")
    (tmp_path / "sw-manifest.js").write_bytes(b"old")
    (tmp_path / ".hidden").write_bytes(b"x")
    return tmp_path


def test_excludes_and_sorted_posix_paths(app):
    version, files = m.build(app, write=False)
    assert files == ["./data/a.json", "./index.html"]
    assert re.fullmatch(r"[0-9a-f]{12}", version)


def test_deterministic(app):
    assert m.build(app, write=False) == m.build(app, write=False)


def test_version_changes_on_content(app):
    v1, _ = m.build(app, write=False)
    (app / "index.html").write_bytes(b"<html>2")
    assert m.build(app, write=False)[0] != v1


def test_version_changes_on_add(app):
    v1, _ = m.build(app, write=False)
    (app / "new.txt").write_bytes(b"n")
    assert m.build(app, write=False)[0] != v1


def test_version_changes_on_rename(app):
    v1, _ = m.build(app, write=False)
    (app / "index.html").rename(app / "home.html")
    assert m.build(app, write=False)[0] != v1


def test_write_false_writes_nothing(app):
    m.build(app, write=False)
    assert (app / "sw-manifest.js").read_bytes() == b"old"


def test_written_file_is_valid_js(app):
    version, files = m.build(app)
    text = (app / "sw-manifest.js").read_text(encoding="utf-8")
    assert f"self.__VERSION = '{version}';" in text
    arr = re.search(r"self\.__PRECACHE = (\[.*\]);", text, re.S).group(1)
    assert json.loads(arr) == files


def test_check_true_and_false(app):
    m.build(app)
    assert m.check(app) is True
    (app / "index.html").write_bytes(b"changed")
    assert m.check(app) is False


def test_cli_check_exit_codes(app, monkeypatch):
    m.build(app)
    monkeypatch.setattr(m, "APP", app)
    assert m.main(["--check"]) == 0
    (app / "index.html").write_bytes(b"changed")
    assert m.main(["--check"]) == 1
    assert (app / "sw-manifest.js").read_text(encoding="utf-8") != ""


def test_cli_default_writes_and_prints(app, monkeypatch, capsys):
    monkeypatch.setattr(m, "APP", app)
    assert m.main([]) == 0
    assert "sürüm " in capsys.readouterr().out
    assert m.check(app) is True


def test_version_changes_when_only_sw_js_changes_but_not_listed(app):
    v1, _ = m.build(app, write=False)
    (app / "sw.js").write_bytes(b"sw2")
    v2, files = m.build(app, write=False)
    assert v2 != v1
    assert "./sw.js" not in files


def test_manifest_content_does_not_affect_version(app):
    v1, _ = m.build(app, write=False)
    (app / "sw-manifest.js").write_bytes(b"completely different")
    assert m.build(app, write=False)[0] == v1


def test_check_accepts_crlf_manifest(app):
    m.build(app)
    p = app / "sw-manifest.js"
    p.write_bytes(p.read_bytes().replace(b"\n", b"\r\n"))
    assert m.check(app) is True


def test_check_rejects_wrong_version_or_list_or_missing(app):
    m.build(app)
    p = app / "sw-manifest.js"
    good = p.read_text(encoding="utf-8")
    version = re.search(r"'([0-9a-f]{12})'", good).group(1)
    p.write_text(good.replace(version, "0" * 12), encoding="utf-8")
    assert m.check(app) is False
    p.write_text(good.replace('"./index.html"', '"./other.html"'), encoding="utf-8")
    assert m.check(app) is False
    p.write_text("garbage", encoding="utf-8")
    assert m.check(app) is False
    p.unlink()
    assert m.check(app) is False


def test_version_ignores_line_endings(app):
    """Windows checkout'larında CRLF'li metin dosyaları sürümü değiştirmemeli; --check farklı makinelerde tutarlı kalır."""
    v1, _ = m.build(app, write=False)
    (app / "index.html").write_bytes(b"<html>\r\n")
    v_crlf, _ = m.build(app, write=False)
    (app / "index.html").write_bytes(b"<html>\n")
    v_lf, _ = m.build(app, write=False)
    assert v_crlf == v_lf
    (app / "sw.js").write_bytes(b"sw\r\n")
    v_sw_crlf, _ = m.build(app, write=False)
    (app / "sw.js").write_bytes(b"sw\n")
    assert m.build(app, write=False)[0] == v_sw_crlf
