"""Targeted V&A v2 search (without restrictive id_category) for:
  1. 1995-2025 Contemporary Haute Joaillerie (for Room 8: Modern Couture Finale)
  2. 1930-1959 Figural / Surrealist Couture brooches (for Room 4: Surrealist & Figural)
"""

import json
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image, ImageDraw

OUT_DIR = Path("/Users/sublux/.gemini/antigravity/scratch/jewel-queen/assets/curate_v2")
OUT_DIR.mkdir(parents=True, exist_ok=True)

QUERIES = [
    # Contemporary Haute Joaillerie (1995-2025)
    ("contemp", "brooch", 2000, 2025, 35),
    ("contemp", "ring diamond gold", 2000, 2025, 25),
    ("contemp", "earrings gold gemstone", 2000, 2025, 20),
    ("contemp", "pendant gold gemstone", 2000, 2025, 20),
    ("contemp", "Boucheron", 1995, 2025, 15),
    ("contemp", "Van Cleef & Arpels", 1995, 2025, 15),
    ("contemp", "Cartier", 1995, 2025, 15),
    ("contemp", "Wendy Ramshaw", 1990, 2025, 15),
    ("contemp", "Stephen Webster", 1998, 2025, 12),
    ("contemp", "Chopard", 1995, 2025, 12),
    ("contemp", "Hemmerle", 1995, 2025, 12),
    ("contemp", "Glenn Spiro", 1995, 2025, 12),
    # 1930-1959 Figural / Surrealist / Whimsical Couture
    ("figural", "Cartier brooch", 1930, 1959, 20),
    ("figural", "Schiaparelli brooch", 1930, 1958, 15),
    ("figural", "Van Cleef brooch", 1930, 1959, 20),
    ("figural", "Boucheron brooch", 1930, 1959, 20),
    ("figural", "bird brooch", 1930, 1959, 20),
    ("figural", "butterfly brooch", 1930, 1959, 15),
    ("figural", "fish brooch", 1930, 1959, 15),
    ("figural", "animal brooch", 1930, 1959, 20),
]

BAD_TYPES = (
    "print", "drawing", "photograph", "design", "sketch", "dress", "coat",
    "book", "chair", "vase", "plate", "textile", "poster", "fashion plate",
    "magazine", "watercolour", "catalogue", "box", "case", "clock", "watch",
    "painting", "miniature", "engraving", "lithograph", "furniture", "railing",
)

GOOD_TYPES = (
    "brooch", "clip", "pendant", "pin", "earring", "bracelet", "bangle",
    "ring", "necklace", "jewel", "tiara", "clasp",
)

EXISTING = {
    "O153154", "O126861", "O144033", "O123310", "O144035", "O141327",
    "O110183", "O153314", "O118207", "O125537", "O126401", "O118678",
    "O115730", "O106454", "O115648", "O153307", "O116419", "O117859",
    "O153312", "O116950", "O116948", "O126402", "O139137", "O153313",
    "O116952", "O120296", "O116969", "O116970", "O116750", "O117881",
    "O114424", "O116250", "O115726", "O115780", "O115509", "O1744028",
    "O1629032", "O1771965", "O1522051", "O153332", "O153312",
}


def fetch_json(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "JewelQueenCurator/2.2"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def run_q(spec):
    grp, q, y0, y1, lim = spec
    params = {"q": q, "images_exist": 1, "year_made_from": y0, "year_made_to": y1, "page_size": lim}
    url = f"https://api.vam.ac.uk/v2/objects/search?{urllib.parse.urlencode(params)}"
    out = []
    try:
        data = fetch_json(url)
        for rec in data.get("records", []):
            sid = rec.get("systemNumber")
            iid = rec.get("_primaryImageId")
            if not sid or not iid or sid in EXISTING:
                continue
            otype = (rec.get("objectType") or "").lower()
            if any(b in otype for b in BAD_TYPES):
                continue
            if not any(g in otype for g in GOOD_TYPES):
                continue
            out.append({
                "group": grp,
                "id": sid,
                "img_id": iid,
                "title": rec.get("_primaryTitle") or rec.get("objectType") or "",
                "objectType": rec.get("objectType") or "",
                "maker": (rec.get("_primaryMaker") or {}).get("name", ""),
                "date": rec.get("_primaryDate") or "",
                "place": rec.get("_primaryPlace") or "",
                "thumb_url": f"https://framemark.vam.ac.uk/collections/{iid}/full/!320,320/0/default.jpg",
                "hires_url": f"https://framemark.vam.ac.uk/collections/{iid}/full/!1000,1000/0/default.jpg",
            })
    except Exception as e:
        print(f"ERR {q}: {e}")
    return out


def dl(it):
    p = OUT_DIR / f"{it['id']}.jpg"
    if not p.exists():
        try:
            req = urllib.request.Request(it["thumb_url"], headers={"User-Agent": "JewelQueenCurator/2.2"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                p.write_bytes(resp.read())
        except Exception:
            return None
    it["local"] = str(p)
    return it


def make_sheet(name, items):
    if not items:
        return None
    cols, cell, pad, lh = 6, 170, 8, 34
    rows = (len(items) + cols - 1) // cols
    canvas = Image.new("RGB", (cols * cell + (cols + 1) * pad, rows * (cell + lh) + (rows + 1) * pad), (12, 12, 16))
    draw = ImageDraw.Draw(canvas)
    for i, it in enumerate(items):
        r, c = divmod(i, cols)
        x = pad + c * (cell + pad)
        y = pad + r * (cell + lh + pad)
        try:
            im = Image.open(it["local"]).convert("RGB")
            im.thumbnail((cell, cell), Image.Resampling.LANCZOS)
            canvas.paste(im, (x + (cell - im.width) // 2, y + (cell - im.height) // 2))
        except Exception:
            pass
        draw.text((x + 2, y + cell + 3), f"{it['id']} {it['date'][:11]}", fill=(235, 240, 255))
        draw.text((x + 2, y + cell + 17), f"{(it['maker'] or it['objectType'])[:22]}", fill=(175, 195, 210))
    p = OUT_DIR / f"sheet_{name}.jpg"
    canvas.save(p, quality=86)
    return str(p)


def main():
    seen = set()
    groups = {"contemp": [], "figural": []}
    with ThreadPoolExecutor(max_workers=8) as ex:
        for res in ex.map(run_q, QUERIES):
            for it in res:
                if it["id"] in seen:
                    continue
                seen.add(it["id"])
                groups[it["group"]].append(it)

    all_it = [it for lst in groups.values() for it in lst]
    print(f"Found contemp={len(groups['contemp'])}, figural={len(groups['figural'])}")
    with ThreadPoolExecutor(max_workers=12) as ex:
        ok = {r["id"]: r for r in ex.map(dl, all_it) if r is not None}

    for k in groups:
        groups[k] = [ok[it["id"]] for it in groups[k] if it["id"] in ok]
        for ci in range(0, min(len(groups[k]), 84), 42):
            sp = make_sheet(f"{k}_v2_{ci // 42}", groups[k][ci : ci + 42])
            print(f"Sheet: {sp} ({len(groups[k][ci : ci + 42])} items)")

    (OUT_DIR / "candidates_v2_extra.json").write_text(json.dumps(groups, indent=2))
    for k, lst in groups.items():
        print(f"\n=== {k.upper()} ===")
        for it in lst[:48]:
            print(f"  {it['id']} | {it['date'][:14]:14s} | {it['objectType'][:14]:14s} | {it['maker'][:24]:24s} | {it['title'][:36]}")


if __name__ == "__main__":
    main()
