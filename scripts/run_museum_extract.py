"""Run the curated 27-piece museum sprite extraction from downloaded V&A & Cleveland Museum photos."""

import json
from pathlib import Path
from extract_museum_sprites import extract_curated

BASE = Path("/Users/sublux/.gemini/antigravity/scratch/jewel-queen/assets")
cands = json.loads((BASE / "museum_candidates.json").read_text())
extra = json.loads((BASE / "museum_extra.json").read_text())

# Map (output_slug, source_record, tolerance)
PICKS = [
    ("lavabre-tiara", cands[86], 34.0),
    # Stage 1: Art Nouveau
    ("lalique-medusa", cands[4], 34.0),
    ("marcus-opal", cands[6], 32.0),
    ("lalique-gold", cands[3], 34.0),
    ("nouveau-pearl", cands[7], 34.0),
    ("child-amethyst", cands[82], 32.0),
    # Stage 2: Art Deco Chinoiserie
    ("chinese-jade", cands[19], 30.0),
    ("cartier-lapis", cands[14], 34.0),
    ("deco-coral-basket", extra[24], 34.0),
    ("cartier-lozenge", cands[11], 32.0),
    ("deco-tutti-frutti", cands[65], 34.0),
    # Stage 3: Global Revival (Pre-Columbian, Mayan Deco, Egyptian, Berber)
    ("precolumbian-gold", cands[89], 36.0),
    ("deco-stepped", cands[74], 34.0),
    ("castellani-scarab", cands[32], 32.0),
    ("berber-coral", extra[21], 32.0),
    ("beetle-scarab", cands[27], 34.0),
    # Stage 4: Surrealist, Bakelite & Pop Whimsy
    ("cartier-hand", cands[17], 30.0),
    ("flato-feet", cands[66], 34.0),
    ("bakelite-oval", cands[36], 32.0),
    ("chang-bangle", extra[12], 34.0),
    ("cartier-owl", cands[12], 32.0),
    # Stage 5: 1940s–50s Hollywood & Dior
    ("dior-unicorn", cands[52], 32.0),
    ("dior-amethyst", cands[51], 30.0),
    ("peacock-1940s", cands[69], 34.0),
    ("trifari-plume", cands[40], 34.0),
    ("cartier-guard", cands[13], 32.0),
    ("dior-snowflake", cands[53], 28.0),
    # Stage 6 & 7 & 8: Mid-Century, Baroque Revival & Modern Haute Joaillerie
    ("grima-turquoise", cands[79], 32.0),
    ("schlumberger-sapphire", cands[45], 32.0),
    ("schlumberger-fruit", cands[46], 32.0),
    ("donald-amethyst", cands[83], 32.0),
    ("kjl-coral", cands[56], 30.0),
    ("canning-merman", cands[57], 32.0),
    ("giuliano-caduceus", extra[27], 32.0),
    ("castellani-gold", cands[31], 30.0),
    ("victorian-turquoise", cands[78], 28.0),
    ("amethyst-pearl", cands[84], 26.0),
    ("wallace-butterfly", cands[64], 28.0),
    ("cindy-ruby", cands[63], 28.0),
]

selection = [(slug, rec["local"], tol) for slug, rec, tol in PICKS]
extract_curated(selection)
