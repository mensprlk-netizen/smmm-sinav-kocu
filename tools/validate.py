"""Yayın öncesi veri doğrulama. Kullanım: python tools/validate.py [app_dir]"""
import json, pathlib, sys
from html.parser import HTMLParser

VOID = {"br", "hr", "img", "input", "col"}

class _Checker(HTMLParser):
    def __init__(self):
        super().__init__(); self.stack = []; self.bad = False
    def handle_starttag(self, tag, attrs):
        if tag not in VOID: self.stack.append(tag)
    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1] != tag: self.bad = True
        else: self.stack.pop()

def html_ok(s):
    if not isinstance(s, str) or not s.strip(): return False
    c = _Checker(); c.feed(s); c.close()
    return not c.bad and not c.stack

def validate(app_dir):
    app = pathlib.Path(app_dir); errs = []
    idx = json.loads((app / "data/index.json").read_text(encoding="utf-8"))
    konular = set(idx.get("konular", []))
    all_ids = set()
    for donem in idx["donemler"]:
        for ders in idx["dersler"]:
            key = f"{donem}-{ders}"
            qp = app / f"data/questions/{key}.json"; sp = app / f"data/solutions/{key}.json"
            if not qp.exists():
                errs.append(f"{key}: soru dosyası yok"); continue
            qs = json.loads(qp.read_text(encoding="utf-8"))
            ss = {s["id"]: s for s in json.loads(sp.read_text(encoding="utf-8"))} if sp.exists() else {}
            if [q["no"] for q in qs] != list(range(1, 21)):
                errs.append(f"{key}: 20 soru 1..20 sırayla olmalı")
            for q in qs:
                qid = q.get("id", "?"); all_ids.add(qid)
                if qid != f"{donem}-{ders}-{q.get('no', 0):02d}": errs.append(f"{qid}: id biçimi")
                if set(q.get("secenekler", {})) != set("ABCDE"): errs.append(f"{qid}: 5 seçenek yok")
                if q.get("dogru") not in list("ABCDE"): errs.append(f"{qid}: dogru A-E değil")
                if not html_ok(q.get("metin")): errs.append(f"{qid}: metin HTML geçersiz veya boş")
                for k, v in q.get("secenekler", {}).items():
                    if not html_ok(v): errs.append(f"{qid}: seçenek {k} HTML geçersiz veya boş")
                if q.get("ortakBilgi") is not None and not html_ok(q["ortakBilgi"]): errs.append(f"{qid}: ortakBilgi HTML geçersiz")
                if ders == "MAL" and q.get("konu") not in konular: errs.append(f"{qid}: konu kodu tanımsız")
                s = ss.get(qid)
                if not s:
                    errs.append(f"{qid}: çözüm yok"); continue
                if s.get("sonuc") != q.get("dogru"): errs.append(f"{qid}: çözüm sonuc ({s.get('sonuc')}) anahtarla ({q.get('dogru')}) uyuşmuyor")
                if not s.get("ozet") or not s.get("adimlar"): errs.append(f"{qid}: çözüm özet/adımlar boş")
                for a in s.get("adimlar", []):
                    if not html_ok(a): errs.append(f"{qid}: çözüm adımı HTML geçersiz")
                if len(s.get("tuzaklar", {})) < 2 and not q.get("iptal"): errs.append(f"{qid}: en az iki tuzak açıklaması gerekli")
    for kod in idx.get("konular", []):
        tp = app / f"data/topics/maliyet/{kod}.json"
        if not tp.exists():
            errs.append(f"konu {kod}: dosya yok"); continue
        t = json.loads(tp.read_text(encoding="utf-8"))
        if t.get("kod") != kod: errs.append(f"konu {kod}: kod alanı uyuşmuyor")
        for b in t.get("bolumler", []):
            if not html_ok(b.get("html")): errs.append(f"konu {kod}: bölüm '{b.get('baslik')}' HTML geçersiz")
        for ref in t.get("cikmisSorular", []):
            if ref not in all_ids: errs.append(f"konu {kod}: çıkmış soru {ref} bulunamadı")
    return errs

if __name__ == "__main__":
    app_dir = sys.argv[1] if len(sys.argv) > 1 else pathlib.Path(__file__).parent.parent / "app"
    errs = validate(app_dir)
    for e in errs: print("HATA:", e)
    print("Doğrulama:", "GEÇTİ" if not errs else f"{len(errs)} hata")
    sys.exit(1 if errs else 0)
