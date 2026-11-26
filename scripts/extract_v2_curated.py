"""Fetch full V&A object metadata + 1000px hi-res JPEGs for our 13 newly curated
period-authentic museum jewels, extract clean 320x320 transparent PNG sprites,
and build a visual verification sheet on pure black velvet.
"""

import json
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image, ImageDraw
from extract_museum_sprites import remove_studio_bg, crop_and_center

BASE = Path("/Users/sublux/.gemini/antigravity/scratch/jewel-queen/assets")
SPRITE_DIR = BASE / "museum_jewels"
HIRES_DIR = BASE / "museum_hires"
V2_DIR = BASE / "curate_v2"

# (slug, V&A systemNumber, bg_tolerance)
NEW_PICKS = [
    # Room 2: Art Deco — Geometric Modernism (1920s-30s)
    ("templier-coral", "O153427", 30.0),
    ("fouquet-turquoise", "O153415", 32.0),
    ("deco-bow", "O153355", 30.0),
    # Room 3: Art Deco — Tutti Frutti & Flower Baskets (1920s-30s)
    ("deco-fruit-basket", "O153338", 30.0),
    ("ostertag-tutti-frutti", "O153317", 30.0),
    ("deco-tutti-arch", "O153311", 30.0),
    # Room 4: 1930s-50s Surrealist & Figural Couture
    ("treskow-fish", "O73756", 34.0),
    # Room 5: 1940s-50s Golden Age Hollywood & Dior Couture
    ("tiffany-shells", "O143687", 28.0),
    # Room 6: 1960s Swinging 60s Sculptural Gold
    ("king-tourmaline", "O143039", 30.0),
    # Room 8: 2000-2022 Contemporary Haute Joaillerie
    ("corvaja-gold", "O106002", 28.0),
    ("webster-fish", "O1295432", 34.0),
    ("short-enamel", "O140324", 26.0),
    ("faisceaux-prism", "O1803249", 30.0),
]


def fetch_meta_and_hires(spec):
    slug, sid, tol = spec
    url = f"https://api.vam.ac.uk/v2/museumobject/{sid}"
    req = urllib.request.Request(url, headers={"User-Agent": "JewelQueenCurator/2.3"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    rec = data.get("record", {})
    meta = data.get("meta", {})
    imgs = meta.get("images", {})
    img_id = imgs.get("_primary_thumbnail", "")
    # Extract IIIF image id from record.images[0]
    img_list = rec.get("images") or []
    iiif_id = img_list[0] if img_list else ""

    hires_path = HIRES_DIR / f"{slug}.jpg"
    if iiif_id:
        hires_url = f"https://framemark.vam.ac.uk/collections/{iiif_id}/full/!1000,1000/0/default.jpg"
        req2 = urllib.request.Request(hires_url, headers={"User-Agent": "JewelQueenCurator/2.3"})
        with urllib.request.urlopen(req2, timeout=20) as r2:
            hires_path.write_bytes(r2.read())
    else:
        # fallback to local thumb
        src = V2_DIR / f"{sid}.jpg"
        hires_path.write_bytes(src.read_bytes())

    # Extract transparent 320x320 sprite from hi-res photo
    im = Image.open(hires_path)
    clean = remove_studio_bg(im, tolerance=tol)
    sprite = crop_and_center(clean)
    sprite_path = SPRITE_DIR / f"{slug}.png"
    sprite.save(sprite_path, optimize=True)

    makers = [m.get("name", {}).get("text", "") for m in (rec.get("artistMakerPerson") or []) + (rec.get("artistMakerOrganisations") or [])]
    dates = [d.get("date", {}).get("text", "") for d in (rec.get("productionDates") or [])]
    places = [p.get("place", {}).get("text", "") for p in (rec.get("placesOfOrigin") or [])]
    mats = rec.get("materialsAndTechniques") or ""
    brief = rec.get("briefDescription") or ""
    summary = rec.get("summaryDescription") or ""
    titles = [t.get("title", "") for t in (rec.get("titles") or [])]

    return {
        "slug": slug,
        "id": sid,
        "archiveUrl": f"https://collections.vam.ac.uk/item/{sid}/",
        "title": titles[0] if titles else rec.get("objectType", slug),
        "objectType": rec.get("objectType", ""),
        "makers": [m for m in makers if m],
        "date": dates[0] if dates else "",
        "place": places[0] if places else "",
        "materials": mats,
        "brief": brief,
        "summary": summary[:450],
        "sprite_kb": sprite_path.stat().st_size // 1024,
        "hires_kb": hires_path.stat().st_size // 1024,
    }


def main():
    with ThreadPoolExecutor(max_workers=6) as ex:
        results = list(ex.map(fetch_meta_and_hires, NEW_PICKS))

    (V2_DIR / "new_13_metadata.json").write_text(json.dumps(results, indent=2))

    # Build verification contact sheet on pure black velvet (#0b0b0e)
    cols = 5
    cell, pad, lh = 180, 12, 26
    rows = (len(results) + cols - 1) // cols
    sheet = Image.new("RGBA", (cols * cell + (cols + 1) * pad, rows * (cell + lh) + (rows + 1) * pad), (4, 4, 7, 255))
    draw = ImageDraw.Draw(sheet)
    for i, r_info in enumerate(results):
        r, c = divmod(i, cols)
        x = pad + c * (cell + pad)
        y = pad + r * (cell + lh + pad)
        tile = Image.new("RGBA", (cell, cell), (14, 14, 18, 255))
        sp = Image.open(SPRITE_DIR / f"{r_info['slug']}.png").convert("RGBA")
        sp_r = sp.resize((cell - 16, cell - 16), Image.Resampling.LANCZOS)
        tile.paste(sp_r, (8, 8), sp_r)
        sheet.paste(tile, (x, y))
        draw.text((x + 2, y + cell + 5), f"{r_info['slug']} ({r_info['date'][:10]})", fill=(235, 232, 226, 255))

    out_sheet = V2_DIR / "verify_new_13.png"
    sheet.save(out_sheet)
    print(f"Saved verification sheet: {out_sheet}\n")
    for info in results:
        print(f"=== {info['slug']} ({info['id']}) ===")
        print(f"  Title: {info['title']} | Makers: {info['makers']} | Date: {info['date']} | Place: {info['place']}")
        print(f"  Materials: {info['materials']}")
        print(f"  Brief: {info['brief'][:180]}")
        print(f"  Sizes: sprite={info['sprite_kb']}KB hires={info['hires_kb']}KB")


if __name__ == "__main__":
    main()
