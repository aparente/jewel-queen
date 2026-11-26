"""Query the V&A Museum v2 API with strict historical date ranges to curate
100% period-authentic, style-cohesive, vibrant jewelry candidates for:
  - 1918-1939 Art Deco (Geometric & Carved Gem / Floral Chinoiserie)
  - 1930-1959 Surrealist / Figural & Mid-Century Couture
  - 1960-1972 Swinging 60s Modernist Gold & Cocktail
  - 1995-2025 Contemporary Haute Joaillerie
"""

import json
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image, ImageDraw

OUT_DIR = Path("/Users/sublux/.gemini/antigravity/scratch/jewel-queen/assets/curate_v2")
OUT_DIR.mkdir(parents=True, exist_ok=True)

# (bucket, query, year_from, year_to, page_size)
QUERIES = [
    # 1918-1939 Art Deco (strictly dated!)
    ("deco_geom", "Art Deco brooch", 1918, 1939, 25),
    ("deco_clip", "dress clip", 1920, 1939, 20),
    ("deco_cartier", "Cartier", 1918, 1939, 20),
    ("deco_jade", "jade brooch", 1918, 1939, 15),
    ("deco_emerald", "emerald brooch", 1918, 1939, 15),
    ("deco_coral", "coral brooch", 1918, 1939, 15),
    ("deco_enamel", "enamel brooch", 1920, 1939, 20),
    ("deco_fouquet", "Fouquet brooch", 1918, 1939, 12),
    ("deco_french", "brooch France", 1920, 1939, 25),
    # 1930-1959 Figural / Surrealist / Dior / Couture
    ("figural_30s50s", "brooch bird animal", 1930, 1959, 18),
    ("couture_40s50s", "brooch", 1945, 1959, 25),
    ("dior_50s", "Christian Dior jewellery", 1947, 1962, 15),
    # 1960-1972 Modernist Gold & Cocktail
    ("mod_60s", "brooch gold", 1960, 1973, 25),
    ("grima_60s", "Andrew Grima", 1960, 1975, 12),
    ("donald_60s", "John Donald", 1960, 1975, 12),
    # 1995-2025 Contemporary Haute Joaillerie
    ("contemp_jewel", "brooch", 1998, 2025, 30),
    ("contemp_gem", "brooch gold diamond ruby sapphire emerald", 1995, 2025, 25),
    ("contemp_titanium", "titanium brooch", 1995, 2025, 15),
]

BAD_TYPES = (
    "print", "drawing", "photograph", "design", "sketch", "dress", "coat",
    "book", "chair", "vase", "plate", "textile", "poster", "fashion plate",
    "magazine", "watercolour", "catalogue", "box", "case", "clock", "watch",
    "painting", "miniature", "engraving", "lithograph", "furniture",
)

GOOD_TYPES = (
    "brooch", "clip", "pendant", "pin", "earring", "bracelet", "bangle",
    "ring", "necklace", "jewel", "ornament", "hatpin", "clasp", "buckle",
)

EXISTING_IDS = {
    "O153154", "O126861", "O144033", "O123310", "O144035", "O141327",
    "O110183", "O153314", "O118207", "O125537", "O126401", "O118678",
    "O115730", "O106454", "O115648", "O153307", "O116419", "O117859",
    "O153312", "O116950", "O116948", "O126402", "O139137", "O153313",
    "O116952", "O120296", "O116969", "O116970", "O116750", "O117881",
    "O114424", "O116250", "O115726", "O115780", "O115509", "O1744028",
    "O1629032",
}


def fetch_json(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "JewelQueenCurator/2.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def run_query(spec):
    bucket, q, y0, y1, limit = spec
    params = urllib.parse.urlencode({
        "q": q,
        "images_exist": 1,
        "year_made_from": y0,
        "year_made_to": y1,
        "page_size": limit,
        "id_category": "THES48966",  # Jewellery category in V&A
    })
    url = f"https://api.vam.ac.uk/v2/objects/search?{params}"
    out = []
    try:
        data = fetch_json(url)
        recs = data.get("records", [])
        # Fallback without category filter if sparse
        if len(recs) < 3:
            params2 = urllib.parse.urlencode({
                "q": q,
                "images_exist": 1,
                "year_made_from": y0,
                "year_made_to": y1,
                "page_size": limit,
            })
            data = fetch_json(f"https://api.vam.ac.uk/v2/objects/search?{params2}")
            recs = data.get("records", [])
        for rec in recs:
            sys_id = rec.get("systemNumber")
            img_id = rec.get("_primaryImageId")
            if not img_id or not sys_id or sys_id in EXISTING_IDS:
                continue
            otype = (rec.get("objectType") or "").lower()
            if any(b in otype for b in BAD_TYPES):
                continue
            if not any(g in otype for g in GOOD_TYPES):
                continue
            out.append({
                "bucket": bucket,
                "id": sys_id,
                "img_id": img_id,
                "title": rec.get("_primaryTitle") or rec.get("objectType") or bucket,
                "objectType": rec.get("objectType") or "",
                "maker": (rec.get("_primaryMaker") or {}).get("name", ""),
                "date": rec.get("_primaryDate") or "",
                "place": rec.get("_primaryPlace") or "",
                "thumb_url": f"https://framemark.vam.ac.uk/collections/{img_id}/full/!320,320/0/default.jpg",
                "hires_url": f"https://framemark.vam.ac.uk/collections/{img_id}/full/!1000,1000/0/default.jpg",
            })
    except Exception as e:
        print(f"ERR {bucket}: {e}")
    return out


def download_thumb(it):
    p = OUT_DIR / f"{it['id']}.jpg"
    if not p.exists():
        try:
            req = urllib.request.Request(it["thumb_url"], headers={"User-Agent": "JewelQueenCurator/2.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                p.write_bytes(resp.read())
        except Exception:
            return None
    it["local"] = str(p)
    return it


def make_sheet(name: str, items: list):
    if not items:
        return None
    cols = 6
    cell = 170
    pad = 8
    lh = 34
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
        l1 = f"{it['id']} {it['date'][:11]}"
        l2 = f"{(it['maker'] or it['objectType'])[:22]}"
        draw.text((x + 2, y + cell + 3), l1, fill=(235, 240, 255))
        draw.text((x + 2, y + cell + 17), l2, fill=(175, 195, 210))
    out_p = OUT_DIR / f"sheet_{name}.jpg"
    canvas.save(out_p, quality=86)
    return str(out_p)


def main():
    seen = set()
    groups = {"deco": [], "mid": [], "sixties": [], "contemp": []}
    with ThreadPoolExecutor(max_workers=8) as ex:
        for res in ex.map(run_query, QUERIES):
            for it in res:
                if it["id"] in seen:
                    continue
                seen.add(it["id"])
                b = it["bucket"]
                if b.startswith("deco_"):
                    groups["deco"].append(it)
                elif b.startswith(("figural_", "couture_", "dior_")):
                    groups["mid"].append(it)
                elif b.startswith(("mod_", "grima_", "donald_")):
                    groups["sixties"].append(it)
                else:
                    groups["contemp"].append(it)

    all_items = [it for lst in groups.values() for it in lst]
    print(f"Found {len(all_items)} strictly-dated unique V&A jewelry records:")
    for k, lst in groups.items():
        print(f"  {k}: {len(lst)}")

    with ThreadPoolExecutor(max_workers=12) as ex:
        ok = {r["id"]: r for r in ex.map(download_thumb, all_items) if r is not None}

    for k in groups:
        groups[k] = [ok[it["id"]] for it in groups[k] if it["id"] in ok]

    # Cap contact sheets to manageable sizes (up to 42 per sheet)
    for k, lst in groups.items():
        for chunk_i in range(0, min(len(lst), 84), 42):
            sub = lst[chunk_i : chunk_i + 42]
            sp = make_sheet(f"{k}_{chunk_i // 42}", sub)
            print(f"Sheet: {sp} ({len(sub)} items)")

    (OUT_DIR / "candidates_v2.json").write_text(json.dumps(groups, indent=2))
    for k, lst in groups.items():
        print(f"\n=== {k.upper()} ===")
        for it in lst[:48]:
            print(f"  {it['id']} | {it['date'][:14]:14s} | {it['objectType'][:14]:14s} | {it['maker'][:24]:24s} | {it['title'][:36]}")


if __name__ == "__main__":
    main()
