"""Yayın öncesi veri doğrulama. Kullanım: python tools/validate.py [app_dir]

validate() hiçbir girdide istisna fırlatmaz; her bozukluk bir hata satırına dönüşür.
"""
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
    try:
        c = _Checker(); c.feed(s); c.close()
    except Exception:
        return False
    return not c.bad and not c.stack


def _load_json(path, errs, label):
    """JSON yükler; başarısızsa hata ekler ve None döner."""
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except UnicodeDecodeError:
        errs.append(f"{label} okunamadı (kodlama hatası)")
    except (OSError, ValueError, RecursionError) as e:
        why = "JSON hatası" if isinstance(e, (ValueError, RecursionError)) else "dosya okunamadı"
        errs.append(f"{label} okunamadı ({why})")
    return None


def _is_int(v):
    return isinstance(v, int) and not isinstance(v, bool)


def _check_kartlar(kartlar, who, errs):
    if kartlar is None: return
    if not isinstance(kartlar, list):
        errs.append(f"{who}: kartlar liste olmalı"); return
    for i, k in enumerate(kartlar, 1):
        if not isinstance(k, dict):
            errs.append(f"{who}: kartlar {i}. öğe sözlük değil"); continue
        for alan in ("on", "arka"):
            v = k.get(alan)
            if not isinstance(v, str) or not v.strip():
                errs.append(f"{who}: kartlar {i}. öğe '{alan}' eksik veya boş")


def _check_question(q, donem, ders, konular, errs):
    """Bir soruyu denetler (q dict ve id str olmalı)."""
    qid = q["id"]
    no = q.get("no")
    if _is_int(no) and qid != f"{donem}-{ders}-{no:02d}":
        errs.append(f"{qid}: id biçimi")
    sec = q.get("secenekler")
    if not isinstance(sec, dict):
        errs.append(f"{qid}: seçenekler sözlük olmalı")
    else:
        if set(sec) != set("ABCDE"): errs.append(f"{qid}: 5 seçenek yok")
        for k, v in sec.items():
            if not html_ok(v): errs.append(f"{qid}: seçenek {k} HTML geçersiz veya boş")
    if q.get("dogru") not in list("ABCDE"): errs.append(f"{qid}: dogru A-E değil")
    if not html_ok(q.get("metin")): errs.append(f"{qid}: metin HTML geçersiz veya boş")
    if q.get("ortakBilgi") is not None and not html_ok(q["ortakBilgi"]):
        errs.append(f"{qid}: ortakBilgi HTML geçersiz")
    if ders == "MAL":
        konu = q.get("konu")
        if not isinstance(konu, str) or konu not in konular: errs.append(f"{qid}: konu kodu tanımsız")


def _check_solution(s, q, errs):
    """Çözümü (s) sorusuyla (q) karşılaştırarak denetler."""
    qid = q["id"]
    if s.get("sonuc") != q.get("dogru"):
        errs.append(f"{qid}: çözüm sonuc ({s.get('sonuc')}) anahtarla ({q.get('dogru')}) uyuşmuyor")
    if not s.get("ozet"): errs.append(f"{qid}: çözüm özet boş")
    adimlar = s.get("adimlar")
    if adimlar is None or adimlar == [] or adimlar == "":
        errs.append(f"{qid}: çözüm adımlar eksik veya boş")
    elif not isinstance(adimlar, list):
        errs.append(f"{qid}: adımlar liste olmalı")
    else:
        for a in adimlar:
            if not html_ok(a): errs.append(f"{qid}: çözüm adımı HTML geçersiz")
    tuz = s.get("tuzaklar", {})
    if not isinstance(tuz, dict):
        errs.append(f"{qid}: tuzaklar sözlük olmalı")
    elif len(tuz) < 2 and not q.get("iptal"):
        errs.append(f"{qid}: en az iki tuzak açıklaması gerekli")
    _check_kartlar(s.get("kartlar"), f"{qid}: çözüm", errs)


def _load_questions(qp, key, errs):
    """Soru listesini döner (yalnız dict öğeler, (indeks, dict) çiftleri) veya None."""
    data = _load_json(qp, errs, f"{key}: soru dosyası")
    if data is None: return None
    if not isinstance(data, list):
        errs.append(f"{key}: soru dosyası liste olmalı"); return None
    out = []
    for i, q in enumerate(data, 1):
        if not isinstance(q, dict):
            errs.append(f"{key}: {i}. öğe sözlük değil"); continue
        out.append((i, q))
    return out


def _load_solutions(sp, key, errs):
    """{id: çözüm} sözlüğü döner; dosya okunamazsa None."""
    data = _load_json(sp, errs, f"{key}: çözüm dosyası")
    if data is None: return None
    if not isinstance(data, list):
        errs.append(f"{key}: çözüm dosyası liste olmalı"); return None
    ss = {}
    for i, s in enumerate(data, 1):
        if not isinstance(s, dict):
            errs.append(f"{key}: çözüm {i}. öğe sözlük değil"); continue
        sid = s.get("id")
        if not isinstance(sid, str) or not sid:
            errs.append(f"{key}: çözüm {i}. öğe id eksik veya geçersiz"); continue
        if sid in ss:
            errs.append(f"{sid}: yinelenen çözüm id"); continue
        ss[sid] = s
    return ss


def _check_pair(app, donem, ders, konular, all_ids, errs, allow=frozenset(), warns=None, state=None):
    key = f"{donem}-{ders}"
    qp = app / f"data/questions/{key}.json"; sp = app / f"data/solutions/{key}.json"
    if not qp.exists():
        errs.append(f"{key}: soru dosyası yok")
        if sp.exists():
            errs.append(f"{key}: çözüm dosyası var ama soru dosyası yok")
        return
    qs = _load_questions(qp, key, errs)
    ss = None
    if not sp.exists():
        errs.append(f"{key}: çözüm dosyası yok")
        ss = {}
    else:
        ss = _load_solutions(sp, key, errs)
    if qs is None: return

    # no alanı: her soru geçerli tamsayı olmalı; sonra 1..20 sırası
    no_ok = True
    for i, q in qs:
        if not _is_int(q.get("no")):
            errs.append(f"{key}: {i}. soru no alanı eksik veya tamsayı değil"); no_ok = False
    if no_ok and [q["no"] for _, q in qs] != list(range(1, 21)):
        errs.append(f"{key}: 20 soru 1..20 sırayla olmalı")

    seen = set()
    for i, q in qs:
        qid = q.get("id")
        if not isinstance(qid, str) or not qid:
            errs.append(f"{key}: {i}. soru id eksik veya geçersiz"); continue
        all_ids.add(qid)
        if qid in seen: errs.append(f"{qid}: yinelenen soru id")
        seen.add(qid)
        _check_question(q, donem, ders, konular, errs)
        if ss is None: continue
        s = ss.get(qid)
        if s is None:
            if qid in allow:
                if state is not None: state["tolerated"].add(qid)
                if warns is not None: warns.append(f"{qid}: çözüm yok (izinli istisna)")
            else:
                errs.append(f"{qid}: çözüm yok")
            continue
        _check_solution(s, q, errs)

    if ss:
        for sid in ss:
            if sid not in seen: errs.append(f"{sid}: çözümün sorusu yok")


def _check_topic(app, kod, all_ids, errs):
    tp = app / f"data/topics/maliyet/{kod}.json"
    if not tp.exists():
        errs.append(f"konu {kod}: dosya yok"); return
    t = _load_json(tp, errs, f"konu {kod}:")
    if t is None: return
    if not isinstance(t, dict):
        errs.append(f"konu {kod}: dosya sözlük olmalı"); return
    if t.get("kod") != kod: errs.append(f"konu {kod}: kod alanı uyuşmuyor")
    bol = t.get("bolumler", [])
    if not isinstance(bol, list):
        errs.append(f"konu {kod}: bolumler liste olmalı")
    else:
        for i, b in enumerate(bol, 1):
            if not isinstance(b, dict):
                errs.append(f"konu {kod}: bölüm {i}. öğe sözlük değil"); continue
            if not html_ok(b.get("html")):
                errs.append(f"konu {kod}: bölüm '{b.get('baslik')}' HTML geçersiz")
    refs = t.get("cikmisSorular", [])
    if not isinstance(refs, list):
        errs.append(f"konu {kod}: cikmisSorular liste olmalı")
    else:
        for ref in refs:
            if not isinstance(ref, str) or ref not in all_ids:
                errs.append(f"konu {kod}: çıkmış soru {ref} bulunamadı")
    _check_kartlar(t.get("kartlar"), f"konu {kod}", errs)


def _str_list(idx, name, errs):
    v = idx.get(name)
    if not isinstance(v, list) or not all(isinstance(x, str) for x in v):
        errs.append(f"index.json: {name} string listesi olmalı"); return None
    return v


def validate(app_dir, allow_missing=()):
    return validate_full(app_dir, allow_missing)[0]


def validate_full(app_dir, allow_missing=()):
    """(hatalar, uyarılar) döner. allow_missing: çözümü bilerek yayımlanmayan soru id'leri."""
    errs = []; warns = []
    allow = frozenset(allow_missing)
    state = {"tolerated": set()}
    all_ids = set()
    _validate_into(app_dir, errs, warns, allow, state, all_ids)
    for qid in sorted(allow - state["tolerated"]):
        warns.append(f"{qid}: izinli istisna listesinde ama gerek yok")
    return errs, warns


def _validate_into(app_dir, errs, warns, allow, state, all_ids):
    try:
        app = pathlib.Path(app_dir)
        ip = app / "data/index.json"
        if not ip.exists():
            errs.append("index.json: okunamadı (dosya yok)"); return
        idx = _load_json(ip, errs, "index.json:")
        if idx is None: return
        if not isinstance(idx, dict):
            errs.append("index.json: sözlük olmalı"); return
        for alan in ("donemler", "dersler"):
            if alan not in idx: errs.append(f"index.json: {alan} eksik")
        if errs: return
        donemler = _str_list(idx, "donemler", errs)
        dersler = _str_list(idx, "dersler", errs)
        konular_l = _str_list(idx, "konular", errs) if "konular" in idx else []
        if donemler is None or dersler is None or konular_l is None: return
        konular = set(konular_l)
        for donem in donemler:
            for ders in dersler:
                try:
                    _check_pair(app, donem, ders, konular, all_ids, errs, allow, warns, state)
                except Exception as e:  # son çare: asla istisna sızdırma
                    errs.append(f"{donem}-{ders}: beklenmeyen hata ({type(e).__name__})")
        for kod in konular_l:
            try:
                _check_topic(app, kod, all_ids, errs)
            except Exception as e:
                errs.append(f"konu {kod}: beklenmeyen hata ({type(e).__name__})")
    except Exception as e:
        errs.append(f"doğrulama: beklenmeyen hata ({type(e).__name__})")


def load_allow_missing(path):
    """Dosyadan id listesi okur (satır başına bir id; boş satır ve # yorumları atlanır)."""
    p = pathlib.Path(path)
    if not p.exists(): return []
    out = []
    for line in p.read_text(encoding="utf-8").splitlines():
        line = line.split("#", 1)[0].strip()
        if line: out.append(line)
    return out


def main(argv=None):
    import argparse
    here = pathlib.Path(__file__).parent
    ap = argparse.ArgumentParser(description="Yayın öncesi veri doğrulama")
    ap.add_argument("app_dir", nargs="?", default=str(here.parent / "app"))
    ap.add_argument("--allow-missing", default="", help="virgülle ayrılmış, çözümü olmayabilecek soru id'leri")
    ap.add_argument("--allow-file", default=str(here / "allow-missing.txt"), help="izinli istisna dosyası")
    a = ap.parse_args(argv)
    allow = load_allow_missing(a.allow_file) + [x.strip() for x in a.allow_missing.split(",") if x.strip()]
    errs, warns = validate_full(a.app_dir, allow)
    for e in errs: print("HATA:", e)
    for w in warns: print("UYARI:", w)
    print("Doğrulama:", "GEÇTİ" if not errs else f"{len(errs)} hata")
    return 1 if errs else 0


if __name__ == "__main__":
    sys.exit(main())
