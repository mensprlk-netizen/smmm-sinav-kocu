"""app/ içeriğinden sw-manifest.js üretir.

Kullanım:
  python tools/build_sw_manifest.py          # app/sw-manifest.js yazar
  python tools/build_sw_manifest.py --check  # yazmaz; güncel değilse 1 ile çıkar
"""
import hashlib
import json
import pathlib
import re
import sys

APP = pathlib.Path(__file__).resolve().parent.parent / "app"
EXCLUDE = {"sw.js", "sw-manifest.js"}


def _render(version, files):
    return (
        f"self.__VERSION = '{version}';\n"
        f"self.__PRECACHE = {json.dumps(files, ensure_ascii=False)};\n"
    )


BINARY_SUFFIXES = {".png", ".ico", ".pdf", ".jpg", ".jpeg", ".webp", ".woff", ".woff2"}


def _icerik(p):
    """Özetlenecek içerik: metin dosyalarında CRLF→LF (Windows checkout'u sürümü değiştirmesin)."""
    data = p.read_bytes()
    return data if p.suffix.lower() in BINARY_SUFFIXES else data.replace(b"\r\n", b"\n")


def build(app_dir=None, write=True):
    app = pathlib.Path(app_dir) if app_dir is not None else APP
    entries = []
    for p in app.rglob("*"):
        rel_parts = p.relative_to(app).parts
        if not p.is_file() or p.name in EXCLUDE or any(s.startswith(".") for s in rel_parts):
            continue
        entries.append(("./" + "/".join(rel_parts), p))
    entries.sort(key=lambda e: e[0])
    h = hashlib.sha256()
    files = []
    for rel, p in entries:
        files.append(rel)
        h.update(rel.encode("utf-8"))
        h.update(b"\0")
        h.update(_icerik(p))
    # sw.js listeye girmez ama sürümü etkiler: işçi değişince önbellek adı da değişir.
    sw = app / "sw.js"
    if sw.is_file():
        h.update(b"\0sw.js\0")
        h.update(_icerik(sw))
    version = h.hexdigest()[:12]
    if write:
        (app / "sw-manifest.js").write_text(_render(version, files), encoding="utf-8", newline="\n")
    return version, files


def _parse(text):
    mv = re.search(r"self\.__VERSION\s*=\s*'([0-9a-f]+)'\s*;", text)
    ma = re.search(r"self\.__PRECACHE\s*=\s*(\[.*?\])\s*;", text, re.S)
    if not mv or not ma:
        return None
    try:
        return mv.group(1), json.loads(ma.group(1))
    except ValueError:
        return None


def check(app_dir=None):
    app = pathlib.Path(app_dir) if app_dir is not None else APP
    version, files = build(app, write=False)
    try:
        parsed = _parse((app / "sw-manifest.js").read_bytes().decode("utf-8"))
    except (OSError, UnicodeDecodeError):
        return False
    return parsed == (version, files)


def main(argv):
    if "--check" in argv:
        if check():
            return 0
        print("sw-manifest.js güncel değil: python tools/build_sw_manifest.py çalıştırın")
        return 1
    v, files = build()
    print(f"sürüm {v}, {len(files)} dosya")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
