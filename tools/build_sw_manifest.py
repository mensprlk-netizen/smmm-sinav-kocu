"""app/ içeriğinden sw-manifest.js üretir.

Kullanım:
  python tools/build_sw_manifest.py          # app/sw-manifest.js yazar
  python tools/build_sw_manifest.py --check  # yazmaz; güncel değilse 1 ile çıkar
"""
import hashlib
import json
import pathlib
import sys

APP = pathlib.Path(__file__).resolve().parent.parent / "app"
EXCLUDE = {"sw.js", "sw-manifest.js"}


def _render(version, files):
    return (
        f"self.__VERSION = '{version}';\n"
        f"self.__PRECACHE = {json.dumps(files, ensure_ascii=False)};\n"
    )


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
        h.update(p.read_bytes())
    version = h.hexdigest()[:12]
    if write:
        (app / "sw-manifest.js").write_text(_render(version, files), encoding="utf-8", newline="\n")
    return version, files


def check(app_dir=None):
    app = pathlib.Path(app_dir) if app_dir is not None else APP
    version, files = build(app, write=False)
    try:
        current = (app / "sw-manifest.js").read_bytes().decode("utf-8")
    except OSError:
        return False
    return current == _render(version, files)


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
