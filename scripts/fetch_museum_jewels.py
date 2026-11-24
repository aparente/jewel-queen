"""Search V&A Museum API and Met Museum Open Access API for real studio photographs
of antique & vintage jewelry across all 8 eras/styles.
"""

import json
import urllib.parse
import urllib.request

QUERIES = [
    ("art_nouveau", "brooch Art Nouveau Lalique enamel"),
    ("chinese_jade", "Chinese jade pendant carving Qing"),
    ("chinese_hairpin", "Chinese kingfisher turquoise hairpin brooch"),
    ("mayan_precolumbian", "gold pendant Pre-Columbian Mayan Aztec"),
    ("egyptian_revival", "Egyptian revival brooch scarab lotus"),
    ("art_deco", "Art Deco brooch clip onyx diamond"),
    ("bakelite", "Bakelite plastic brooch bangle 1930s"),
    ("retro_1940s", "brooch 1940s gold ruby pearl Trifari Haskell"),
    ("midcentury", "brooch 1950s rhinestone costume jewelry"),
    ("couture_70s_80s", "brooch Chanel Dior Schiaparelli costume jewelry"),
]


def fetch_json(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "JewelQueenCurator/1.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def search_vam(query: str, limit: int = 8):
    q = urllib.parse.quote(query)
    url = f"https://api.vam.ac.uk/v2/objects/search?q={q}&images_exist=1&page_size={limit}"
    data = fetch_json(url)
    results = []
    for rec in data.get("records", []):
        img_id = rec.get("_primaryImageId")
        if not img_id:
            continue
        results.append({
            "source": "V&A",
            "id": rec.get("systemNumber"),
            "title": rec.get("_primaryTitle") or rec.get("objectType"),
            "objectType": rec.get("objectType"),
            "maker": rec.get("_primaryMaker", {}).get("name", ""),
            "date": rec.get("_primaryDate", ""),
            "img": f"https://framemark.vam.ac.uk/collections/{img_id}/full/!600,600/0/default.jpg",
        })
    return results


def search_met(query: str, limit: int = 6):
    q = urllib.parse.quote(query)
    url = f"https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isPublicDomain=true&q={q}"
    data = fetch_json(url)
    ids = (data.get("objectIDs") or [])[:limit * 2]
    results = []
    for oid in ids:
        if len(results) >= limit:
            break
        try:
            obj = fetch_json(f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{oid}")
            img = obj.get("primaryImageSmall") or obj.get("primaryImage")
            if not img:
                continue
            results.append({
                "source": "Met",
                "id": str(oid),
                "title": obj.get("title", ""),
                "objectType": obj.get("objectName", ""),
                "maker": obj.get("artistDisplayName") or obj.get("culture") or "",
                "date": obj.get("objectDate", ""),
                "img": img,
            })
        except Exception:
            continue
    return results


def main():
    catalog = {}
    for key, q in QUERIES:
        print(f"=== {key}: {q} ===")
        items = []
        try:
            items.extend(search_vam(q, limit=6))
        except Exception as e:
            print(f"  V&A error: {e}")
        try:
            items.extend(search_met(q, limit=4))
        except Exception as e:
            print(f"  Met error: {e}")
        catalog[key] = items
        print(f"  Found {len(items)} items")
        for it in items[:4]:
            print(f"    [{it['source']}] {it['title']} | {it['maker']} | {it['date']} -> {it['img']}")

    with open("/Users/sublux/.gemini/antigravity/scratch/jewel-queen/assets/museum_catalog.json", "w") as f:
        json.dump(catalog, f, indent=2)
    print("Saved museum_catalog.json")


if __name__ == "__main__":
    main()
