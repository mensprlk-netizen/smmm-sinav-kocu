# tools/make_icons.py
import pymupdf
for size in (192, 512):
    doc = pymupdf.open(); page = doc.new_page(width=size, height=size)
    page.draw_rect(page.rect, color=None, fill=(0.106, 0.286, 0.396))
    page.insert_textbox(pymupdf.Rect(0, size*0.28, size, size*0.8), "SMMM", fontsize=size*0.3, fontname="helv", color=(1,1,1), align=1)
    page.get_pixmap(dpi=72).save(f"app/img/icon-{size}.png")
