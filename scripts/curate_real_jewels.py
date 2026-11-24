"""Fetch real high-res studio photographs of authentic antique & vintage jewelry
from the Victoria & Albert Museum (V&A) API and Cleveland Museum of Art CC0 API,
and build labeled contact sheets for visual curation.
"""

import json
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image, ImageDraw

OUT_RAW = Path("/Users/sublux/.gemini/antigravity/scratch/jewel-queen/assets/museum_raw")
OUT_RAW.mkdir(parents=True, exist_ok=True)

VAM_QUERIES = [
    ("lalique", "Lalique brooch", 6),
    ("art_nouveau_brooch", "Art Nouveau brooch", 6),
    ("cartier", "Cartier brooch", 6),
    ("art_deco_clip", "Art Deco clip", 6),
    ("chinese_jade", "jade pendant China", 6),
    ("chinese_kingfisher", "kingfisher brooch China", 5),
    ("egyptian_revival", "Egyptian brooch", 6),
    ("scarab_brooch", "scarab brooch", 5),
    ("bakelite_jewel", "Bakelite brooch", 6),
    ("bakelite_bangle", "Bakelite bangle", 5),
    ("plastic_brooch", "plastic brooch 1930s", 5),
    ("trifari", "Trifari", 6),
    ("haskell", "Miriam Haskell", 6),
    ("schiaparelli", "Schiaparelli brooch", 5),
    ("chanel_jewel", "Chanel brooch", 6),
    ("dior_jewel", "Christian Dior brooch", 6),
    ("ysl_jewel", "Yves Saint Laurent brooch", 5),
    ("kjl_jewel", "Kenneth Jay Lane", 5),
    ("butler_wilson", "Butler and Wilson", 5),
    ("ruby_brooch", "ruby brooch", 5),
    ("emerald_brooch", "emerald brooch", 5),
    ("sapphire_brooch", "sapphire brooch", 5),
    ("turquoise_brooch", "turquoise brooch", 5),
    ("amethyst_brooch", "amethyst brooch", 5),
    ("tiara", "tiara diamond", 4),
]

CMA_QUERIES = [
    ("mayan_gold", "Mayan gold pendant", 5),
    ("precolumbian_gold", "Pre-Columbian gold pendant", 6),
    ("chinese_jade_cma", "jade pendant China", 5),
    ("egyptian_cma", "Egyptian pectoral lotus", 5),
]


def fetch_json(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "JewelQueenMuseumCurator/1.0"})
    with urllib.request.urlopen(req, timeout=12) as resp:
        return json.loads(resp.read().decode("utf-8"))


def query_vam(tag, q, limit):
    url = f"https://api.vam.ac.uk/v2/objects/search?q={urllib.parse.quote(q)}&images_exist=1&page_size={limit}"
    out = []
    try:
        data = fetch_json(url)
        for rec in data.get("records", []):
            img_id = rec.get("_primaryImageId")
            if not img_id:
                continue
            otype = (rec.get("objectType") or "").lower()
            # Filter out prints/drawings/textiles where possible unless brooch/jewel/pendant/bangle/ring/earring/clip/tiara
            if any(bad in otype for bad in ("print", "drawing", "photograph", "dress", "coat", "book", "chair", "vase", "plate", "textile", "poster")):
                continue
            out.append({
                "key": f"{tag}_{rec.get('systemNumber')}",
                "tag": tag,
                "source": "V&A Museum",
                "id": rec.get("systemNumber"),
                "title": rec.get("_primaryTitle") or rec.get("objectType") or tag,
                "objectType": rec.get("objectType") or "",
                "maker": (rec.get("_primaryMaker") or {}).get("name", ""),
                "date": rec.get("_primaryDate") or "",
                "url": f"https://framemark.vam.ac.uk/collections/{img_id}/full/!512,512/0/default.jpg",
            })
    except Exception as e:
        print(f"V&A err {tag}: {e}")
    return out


def query_cma(tag, q, limit):
    url = f"https://openaccess-api.clevelandart.org/api/artworks/?q={urllib.parse.quote(q)}&has_image=1&cc0=1&limit={limit}"
    out = []
    try:
        data = fetch_json(url)
        for rec in data.get("data", []):
            img = (rec.get("images") or {}).get("web", {}).get("url")
            if not img:
                continue
            out.append({
                "key": f"{tag}_{rec.get('id')}",
                "tag": tag,
                "source": "Cleveland Museum of Art",
                "id": str(rec.get("id")),
                "title": rec.get("title") or tag,
                "objectType": rec.get("type") or "",
                "maker": (rec.get("culture") or [""])[0],
                "date": rec.get("creation_date") or "",
                "url": img,
            })
    except Exception as e:
        print(f"CMA err {tag}: {e}")
    return out


def download_item(item):
    dest = OUT_RAW / f"{item['key']}.jpg"
    if not dest.exists():
        try:
            req = urllib.request.Request(item["url"], headers={"User-Agent": "JewelQueenMuseumCurator/1.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                dest.write_bytes(resp.read())
        except Exception:
            return None
    item["local"] = str(dest)
    return item


def build_sheets(items):
    # Render contact sheets of 30 items each (6 cols x 5 rows) so we can visually inspect every candidate
    per_sheet = 30
    cols = 6
    cell = 180
    pad = 10
    label_h = 26
    sheets = []
    for s_idx in range(0, len(items), per_sheet):
        chunk = items[s_idx : s_idx + per_sheet]
        rows = (len(chunk) + cols - 1) // cols
        w = cols * cell + (cols + 1) * pad
        h = rows * (cell + label_h) + (rows + 1) * pad
        canvas = Image.new("RGB", (w, h), (32, 12, 28))
        draw = ImageDraw.Draw(canvas)
        for i, it in enumerate(chunk):
            r, c = divmod(i, cols)
            x = pad + c * (cell + pad)
            y = pad + r * (cell + label_h + pad)
            try:
                im = Image.open(it["local"]).convert("RGB")
                im.thumbnail((cell, cell), Image.Resampling.LANCZOS)
                ox = x + (cell - im.width) // 2
                oy = y + (cell - im.height) // 2
                canvas.paste(im, (ox, oy))
            except Exception:
                pass
            idx_num = s_idx + i
            caption = f"#{idx_num} {it['tag'][:14]}"
            draw.text((x + 2, y + cell + 4), caption, fill=(255, 232, 160))
        out_p = OUT_RAW.parent / f"museum_sheet_{s_idx // per_sheet}.jpg"
        canvas.save(out_p, quality=85)
        sheets.append(str(out_p))
    return sheets


def main():
    all_items = []
    seen_ids = set()
    with ThreadPoolExecutor(max_workers=8) as ex:
        futs = [ex.submit(query_vam, *q) for q in VAM_QUERIES] + [ex.submit(query_cma, *q) for q in CMA_QUERIES]
        for fut in futs:
            for it in fut.result():
                uid = f"{it['source']}:{it['id']}"
                if uid not in seen_ids:
                    seen_ids.add(uid)
                    all_items.append(it)

    print(f"Found {len(all_items)} unique museum jewelry records. Downloading thumbnails...")
    with ThreadPoolExecutor(max_workers=10) as ex:
        downloaded = [r for r in ex.map(download_item, all_items) if r is not None]

    meta_path = OUT_RAW.parent / "museum_candidates.json"
    with open(meta_path, "w") as f:
        json.dump(downloaded, f, indent=2)

    sheets = build_sheets(downloaded)
    print(f"Downloaded {len(downloaded)} real museum photos into {len(sheets)} sheets:")
    for s in sheets:
        print(" ", s)
    for i, it in enumerate(downloaded):
        print(f"#{i:02d} [{it['tag']}] {it['title'][:40]} | {it['maker'][:24]} | {it['date']}")


if __name__ == "__main__":
    main()
