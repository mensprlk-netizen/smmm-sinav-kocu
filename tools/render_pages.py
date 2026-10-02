"""Kitapçık sayfalarını PNG olarak üretir. Kullanım: python tools/render_pages.py <pdf> <donem> <ders>"""
import sys, pathlib, pymupdf

def render(pdf_path, donem, ders, dpi=150, dest_dir=None):
    dest_dir = pathlib.Path(dest_dir or pathlib.Path(__file__).parent.parent / "app" / "img" / "originals")
    dest_dir.mkdir(parents=True, exist_ok=True)
    doc = pymupdf.open(str(pdf_path)); paths = []
    for i, page in enumerate(doc):
        p = dest_dir / f"{donem}-{ders}-p{i + 1}.png"
        page.get_pixmap(dpi=dpi).save(str(p)); paths.append(p)
    return paths

if __name__ == "__main__":
    for p in render(*sys.argv[1:4]):
        print(p, p.stat().st_size // 1024, "KB")
