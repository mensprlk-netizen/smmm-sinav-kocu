"""Resmi TÜRMOB-TESMER SMMM kitapçığından ham soru çıkarımı.

Kullanım: python tools/extract_questions.py <pdf> <donem> <ders>
Çıktı: tools/out/raw/<donem>-<ders>.json
"""
import json, re, sys, pathlib
import pymupdf

Q_RE = re.compile(r"^\s*(\d{1,2})\.(?:\s+\S|\s*$)")  # tablolu sorularda numara tek başına satırda olabilir
OPT_RE = re.compile(r"^\s*([A-E])\)\s*(.*)$")
SKIP_RE = re.compile(r"^(TÜRMOB(-TESMER)? SMMM|20\d\d-\d|Diğer sayfaya geçiniz\.?|\d{1,2})$")
GUNCEL_RE = re.compile(r'"([A-E])"\s*şıkkı olarak güncellen')

def _is_red(color):
    r, g, b = (color >> 16) & 255, (color >> 8) & 255, color & 255
    return r >= 180 and g <= 80 and b <= 80

def _lines(doc):
    """Sayfa, sütun, y, x sırasına göre satırlar."""
    out = []
    for pno, page in enumerate(doc):
        mid = page.rect.width / 2
        for b in page.get_text("dict")["blocks"]:
            for l in b.get("lines", []):
                text = "".join(s["text"] for s in l["spans"]).strip()
                if not text:
                    continue
                red = any(_is_red(s["color"]) and re.match(r"^\s*[A-E]\)", s["text"]) for s in l["spans"])
                x0, y0, x1, y1 = l["bbox"]
                col = 0 if x0 < mid - 15 else 1
                out.append({"page": pno, "col": col, "y": round(y0, 1), "x": x0, "bbox": l["bbox"], "text": text, "red": red})
    out.sort(key=lambda L: (L["page"], L["col"], L["y"], L["x"]))
    return out

def extract(pdf_path, donem, ders, dpi=150):
    doc = pymupdf.open(str(pdf_path))
    scale = dpi / 72
    lines = _lines(doc)
    first_q = next((i for i, L in enumerate(lines) if Q_RE.match(L["text"]) and L["text"].lstrip().startswith("1.")), 0)
    headers = {L["text"] for L in lines[:first_q]}  # sayfa başlıkları (kurum, dönem, ders adı) her sayfada tekrar eder
    questions, cur, expected = [], None, 1
    for L in lines:
        t = L["text"]
        if SKIP_RE.match(t) or t in headers:
            continue
        m = Q_RE.match(t)
        if m and int(m.group(1)) == expected:
            cur = {"no": expected, "sayfa": L["page"] + 1, "lines": [], "boxes": []}
            questions.append(cur)
            expected += 1
            t = t[m.end() - 1:].strip() if m.end() < len(t) else ""
        if cur is None or not t:
            continue
        cur["lines"].append({"text": t, "red": L["red"], "page": L["page"]})
        if L["page"] + 1 == cur["sayfa"]:
            cur["boxes"].append(L["bbox"])
    out = []
    for q in questions:
        metin, opts, dogru, notlar, iptal, key = [], {}, None, [], False, None
        for ln in q["lines"]:
            t = ln["text"]
            if "İPTAL" in t.upper():
                iptal = True; notlar.append(t); continue
            if "güncellen" in t or "yayınlanmış" in t:
                notlar.append(t); continue
            om = OPT_RE.match(t)
            if om:
                key = om.group(1); opts[key] = om.group(2).strip()
                if ln["red"] and dogru is None:
                    dogru = key
                continue
            if key is None:
                metin.append(t)
            else:
                opts[key] = (opts[key] + "\n" + t).strip()
        gm = GUNCEL_RE.search(" ".join(notlar))
        if gm:
            dogru = gm.group(1)
        xs = [b[0] for b in q["boxes"]] or [0]; ys = [b[1] for b in q["boxes"]] or [0]
        xe = [b[2] for b in q["boxes"]] or [0]; ye = [b[3] for b in q["boxes"]] or [0]
        kutu = [round(min(xs) * scale), round(min(ys) * scale), round((max(xe) - min(xs)) * scale), round((max(ye) - min(ys)) * scale)]
        out.append({
            "id": f"{donem}-{ders}-{q['no']:02d}", "donem": donem, "ders": ders, "no": q["no"],
            "sayfa": q["sayfa"], "kutu": kutu,
            "metin_raw": "\n".join(metin).strip(), "secenekler_raw": opts,
            "dogru": dogru, "iptal": iptal, "notlar": notlar,
        })
    return out

if __name__ == "__main__":
    pdf, donem, ders = sys.argv[1:4]
    qs = extract(pdf, donem, ders)
    dest = pathlib.Path(__file__).parent / "out" / "raw" / f"{donem}-{ders}.json"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(qs, ensure_ascii=False, indent=1), encoding="utf-8")
    eksik = [q["id"] for q in qs if q["dogru"] is None or len(q["secenekler_raw"]) != 5]
    print(f"{dest}: {len(qs)} soru; eksik/şüpheli: {eksik}")
