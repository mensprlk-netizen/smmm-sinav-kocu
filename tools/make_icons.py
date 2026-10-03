# tools/make_icons.py
import pymupdf


def icon(size, path, fontsize, top):
    doc = pymupdf.open(); page = doc.new_page(width=size, height=size)
    page.draw_rect(page.rect, color=None, fill=(0.106, 0.286, 0.396))
    page.insert_textbox(pymupdf.Rect(0, size*top, size, size*0.8), "SMMM", fontsize=size*fontsize, fontname="helv", color=(1,1,1), align=1)
    page.get_pixmap(dpi=72).save(path)


for size in (192, 512):
    icon(size, f"app/img/icon-{size}.png", 0.3, 0.28)
    # maskable: tam kenara taşan zemin, yazı güvenli bölgede (merkezdeki %80'lik daire)
    icon(size, f"app/img/icon-maskable-{size}.png", 0.2, 0.37)
