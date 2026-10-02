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
    # Load index.json
    try:
        idx = json.loads((app / "data/index.json").read_text(encoding="utf-8"))
    except (json.JSONDecodeError, FileNotFoundError) as e:
        errs.append(f"index.json: okunamadı (JSON hatası)")
        return errs

    if "donemler" not in idx:
        errs.append("index.json: donemler eksik")
    if "dersler" not in idx:
        errs.append("index.json: dersler eksik")
    if errs:
        return errs

    konular = set(idx.get("konular", []))
    all_ids = set()
    question_ids = {}  # Track all question ids to detect duplicates
    solution_ids = {}  # Track all solution ids to detect orphans

    for donem in idx["donemler"]:
        for ders in idx["dersler"]:
            key = f"{donem}-{ders}"
            qp = app / f"data/questions/{key}.json"; sp = app / f"data/solutions/{key}.json"

            # Load questions
            if not qp.exists():
                errs.append(f"{key}: soru dosyası yok"); continue
            try:
                qs = json.loads(qp.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                errs.append(f"{key}: soru dosyası okunamadı (JSON hatası)"); continue

            # Check questions are dicts
            q_list = []
            for i, q in enumerate(qs):
                if not isinstance(q, dict):
                    errs.append(f"{key}: {i+1}. öğe sözlük değil"); continue
                q_list.append(q)
            qs = q_list

            # Load solutions
            ss = {}
            if sp.exists():
                try:
                    sol_list = json.loads(sp.read_text(encoding="utf-8"))
                    for s in sol_list:
                        if isinstance(s, dict) and "id" in s:
                            ss[s["id"]] = s
                            solution_ids[s["id"]] = key
                except json.JSONDecodeError:
                    errs.append(f"{key}: çözüm dosyası okunamadı (JSON hatası)"); ss = {}
            elif any(len([q for q in qs]) > 0):
                # Question file exists but solution file doesn't
                pass

            # Check question count and order
            try:
                nos = [q["no"] for q in qs]
                if nos != list(range(1, 21)):
                    errs.append(f"{key}: 20 soru 1..20 sırayla olmalı")
            except (KeyError, TypeError):
                errs.append(f"{key}: soru numaraları okundu hata (no alanı eksik veya geçersiz)"); continue

            # Validate each question
            seen_qids = {}
            for q in qs:
                qid = q.get("id", "?"); all_ids.add(qid)

                # Check for duplicate ids
                if qid in seen_qids:
                    errs.append(f"{qid}: yinelenen soru id")
                seen_qids[qid] = True

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

                # Type check adimlar
                if not isinstance(s.get("adimlar"), list):
                    errs.append(f"{qid}: adımlar liste olmalı"); continue
                for a in s.get("adimlar", []):
                    if not html_ok(a): errs.append(f"{qid}: çözüm adımı HTML geçersiz")

                # Type check tuzaklar
                tuzaklar = s.get("tuzaklar", {})
                if not isinstance(tuzaklar, dict):
                    errs.append(f"{qid}: tuzaklar sözlük olmalı"); continue
                if len(tuzaklar) < 2 and not q.get("iptal"): errs.append(f"{qid}: en az iki tuzak açıklaması gerekli")

    # Check for orphan solutions (solutions without matching questions)
    for sid in solution_ids:
        if sid not in all_ids:
            errs.append(f"{sid}: çözümün sorusu yok")

    # Validate topics
    for kod in idx.get("konular", []):
        tp = app / f"data/topics/maliyet/{kod}.json"
        if not tp.exists():
            errs.append(f"konu {kod}: dosya yok"); continue
        try:
            t = json.loads(tp.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            errs.append(f"konu {kod}: okunamadı (JSON hatası)"); continue

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
