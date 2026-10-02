"""Resmi TÜRMOB-TESMER SMMM kitapçığından ham soru çıkarımı.

Kullanım: python tools/extract_questions.py <pdf> <donem> <ders>
Çıktı: tools/out/raw/<donem>-<ders>.json
"""
import json, re, sys, pathlib
import pymupdf

Q_RE = re.compile(r"^\s*(\d{1,2})\.(?:\s+\S|\s*$)")  # tablolu sorularda numara tek başına satırda olabilir
OPT_RE = re.compile(r"^\s*([A-E])\)\s*(.*)$")
SKIP_RE = re.compile(r"^(TÜRMOB(-TESMER)? SMMM|20\d\d-\d|Diğer sayfaya geçiniz\.?|TEST BİTTİ\.?)$")
PAGENO_RE = re.compile(r"^\d{1,2}$")  # sayfa numarası: yalnızca alt bantta atılır, tablo hücreleri korunur
FOOTER_Y = 780
KEY_HEAD_RE = re.compile(r"Cevap Anahtarı\s*$")
KEY_FOOT_RE = re.compile(r"^(\* Tablo;|göstermektedir\.)")
ANS_RE = re.compile(r"(?:[A-E]\s*-->\s*)?([A-E])")
STAMP_RE = re.compile(r"\s*İPTAL\s*")
NOTE_RE = re.compile(r'(şıkkı olarak (yayınlanmış|güncellen)|^\d+\.\s*Sorunun doğru cevap)')
GUNCEL_RE = re.compile(r'"([A-E])"\s*şıkkı olarak güncellen')

def _is_red(color):
    r, g, b = (color >> 16) & 255, (color >> 8) & 255, color & 255
    return r >= 180 and g <= 80 and b <= 80

def _lines(doc):
    """Sayfa, sütun, y, x sırasına göre satırlar. `reds`: kırmızı karakterlerin (kırpılmış metindeki) indeksleri."""
    out = []
    for pno, page in enumerate(doc):
        mid = page.rect.width / 2
        for b in page.get_text("dict")["blocks"]:
            for l in b.get("lines", []):
                raw, redflags = "", []
                for s in l["spans"]:
                    raw += s["text"]
                    redflags += [_is_red(s["color"])] * len(s["text"])
                text = raw.strip()
                if not text:
                    continue
                off = len(raw) - len(raw.lstrip())
                reds = {i - off for i, f in enumerate(redflags) if f and 0 <= i - off < len(text) and not text[i - off].isspace()}
                x0, y0, x1, y1 = l["bbox"]
                col = 0 if x0 < mid - 15 else 1
                out.append({"page": pno, "col": col, "y": round(y0, 1), "x": x0, "bbox": l["bbox"], "text": text, "reds": reds})
    out.sort(key=lambda L: (L["page"], L["col"], L["y"], L["x"]))
    return out

def _split_inline(text, reds):
    """'A) 17.000   B) 18.000' gibi tek satırdaki seçenekleri ayırır; her parçanın kırmızılığı etiket harfine bakılarak belirlenir."""
    if not OPT_RE.match(text):
        return [(text, bool(reds))]
    cuts, last = [], ""
    for m in re.finditer(r"(?:^|(?<=\s))([A-E])\)", text):
        lab = m.group(1)
        if not cuts or lab > last:
            cuts.append((m.start(), lab)); last = lab
    cuts = [c for c in cuts if c[0] == 0 or text[c[0] - 1].isspace()]
    out = []
    for i, (st, lab) in enumerate(cuts):
        en = cuts[i + 1][0] if i + 1 < len(cuts) else len(text)
        out.append((text[st:en].strip(), st in reds))
    return out

def _split_key(lines):
    """Cevap anahtarı tablosundan önceki satırlar ve tablodan {A kitapçığı soru no: (şık, iptal)}."""
    head = next((i for i, L in enumerate(lines) if KEY_HEAD_RE.search(L["text"])), None)
    if head is None:
        return lines, {}
    h = lines[head]
    body, key_lines = [], []
    for i, L in enumerate(lines):
        after = L["page"] > h["page"] or (L["page"] == h["page"] and L["y"] >= h["y"] - 1)
        in_key = after and (L["page"] > h["page"] or L["col"] == h["col"] or STAMP_RE.fullmatch(L["text"]) or KEY_FOOT_RE.match(L["text"]))
        (key_lines if in_key else body).append(L)
    rows = {}
    for L in key_lines:
        rows.setdefault((L["page"], round(L["y"])), []).append(L)
    key = {}
    for r in rows.values():
        r.sort(key=lambda L: L["x"])
        toks = [L["text"] for L in r]
        ans = [m.group(1) for m in (ANS_RE.fullmatch(t) for t in toks) if m]  # "B --> A" (şık değişikliği) ise sonuncu şık geçerli
        if toks and toks[0].isdigit() and ans:
            key[int(toks[0])] = (ans[-1], any(STAMP_RE.fullmatch(t) for t in toks))
    return body, key

def extract(pdf_path, donem, ders, dpi=150):
    doc = pymupdf.open(str(pdf_path))
    scale = dpi / 72
    lines, key = _split_key(_lines(doc))
    first_q = next((i for i, L in enumerate(lines) if Q_RE.match(L["text"]) and L["text"].lstrip().startswith("1.")), 0)
    headers = {L["text"] for L in lines[:first_q] if L["y"] < 80}  # sayfa başlıkları (kurum, dönem, ders adı) her sayfada tekrar eder
    questions, cur, expected = [], None, 1
    for L in lines:
        t = L["text"]
        if SKIP_RE.match(t) or t in headers or (L["y"] > FOOTER_Y and PAGENO_RE.match(t)):
            continue
        m = Q_RE.match(t)
        reds = L["reds"]
        if m and int(m.group(1)) == expected:
            cur = {"no": expected, "sayfa": L["page"] + 1, "lines": [], "boxes": []}
            questions.append(cur)
            expected += 1
            cut = m.end() - 1 if m.end() < len(t) else len(t)
            reds = {i - cut for i in reds if i >= cut}
            t = t[cut:]
            lead = len(t) - len(t.lstrip())
            reds = {i - lead for i in reds if i >= lead}
            t = t.strip()
        if cur is None or not t:
            continue
        for piece, red in _split_inline(t, reds):
            cur["lines"].append({"text": piece, "red": red, "page": L["page"]})
        if L["page"] + 1 == cur["sayfa"]:
            cur["boxes"].append(L["bbox"])
    out = []
    for q in questions:
        metin, opts, dogru, notlar, iptal, key_ = [], {}, None, [], False, None
        for ln in q["lines"]:
            t = ln["text"]
            om = OPT_RE.match(t)
            if om:
                key_ = om.group(1); opts[key_] = om.group(2).strip()
                if ln["red"] and dogru is None:
                    dogru = key_
                continue
            if STAMP_RE.fullmatch(t):
                iptal = True; notlar.append(t); continue
            if NOTE_RE.search(t):
                notlar.append(t); continue
            if key_ is None:
                metin.append(t)
            else:
                opts[key_] = (opts[key_] + "\n" + t).strip()
        gm = GUNCEL_RE.search(" ".join(notlar))
        if gm:
            dogru = gm.group(1)
        if q["no"] in key:  # cevap anahtarı tablosu: İPTAL satırı ve (kırmızı işaret yoksa) doğru şık
            letter, k_iptal = key[q["no"]]
            if k_iptal:
                iptal = True; notlar.append("Cevap anahtarında İPTAL")
            if dogru is None:
                dogru = letter
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
