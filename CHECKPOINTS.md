# Jewel Queen — Game Dynamics & Checkpoints

Every game prototype in **Jewel Queen** shares the same **45-piece Real V&A Museum Jewelry Core** (inspired by Connie Parente's archive):

- `assets/museum_jewels/` — 45 transparent 320×320 museum cutouts
- `assets/museum_hires/` — 45 full-resolution photographs for the 3× Jeweler's Loupe
- `js/data.js` — 45 unique V&A museum jewels across 8 historically & stylistically cohesive gallery rooms (zero cross-era filler or duplicates)
- `js/history.js` — Curatorial stories, materials, rarity tiers, estate valuations, and official museum links
- `js/audio.js` & `js/ambient.js` — Synthesized Web Audio chimes & pure gallery-black golden stardust canvas

---

## Saved Checkpoints (Tags & Branches)

| Checkpoint Tag | Branch | Game Dynamic | Highlights |
| --- | --- | --- | --- |
| `checkpoint/v1-candy-crush-museum-pokedex` | `main` (`18363b0`) | **Candy Crush Match-3 + Royal Slot + Pokédex Vault** | First complete museum baseline: 7×7 Match-3 + 3-reel slot + 8 Historical Eras + 3× Loupe + MY COLLECTION Pokédex on pure gallery black (original gold marquee frame). |
| `checkpoint/v1.1-velvet-crystal-trays` | `main` (`7f0953d`) | **Candy Crush + Era-Matched Colored Trays** | First pass replacing the gold frame with 8 era-tinted static rims. |
| `checkpoint/v1.2-black-velvet-tray` | `tray/black-velvet` (`3c81811`) | **Pure Black Velvet Collector's Tray** | Ultra-tactile flocked matte black-velvet jewelry tray with micro-nap grain, soft padded velvet lip, and individual recessed velvet brooch compartments. |
| `checkpoint/v1.3-living-opal-tray` | `tray/living-opal` (`042b4ec`) | **Ethereal Living Black Opal + Live Velvet/Opal Switcher** | Real-time 60fps canvas play-of-color Black Opal engine (`js/opal-tray.js`) with shifting cyan/emerald/sapphire/violet/rose/gold silica fire, pinfire micro-glints, pointer-tilt refraction, and match surges — plus a 1-tap `Velvet | Living Opal` switcher in the footer. |
| `checkpoint/v2-gallery-borderless` | `main` (`0869a50`) | **teamLab Borderless × Museum Gallery Redesign** | Strips all yellow borders, casino boxes, and decorative logo; wide-tracked pearl `Cormorant Garamond` wordmark, borderless HUD, smoked-glass chambers, Pure Black Velvet Tray default. |
| `checkpoint/v2.1-webgl-borderless` | `main`, `game/candy-crush-pokedex` | **SOTA WebGL GLSL Shader + Vault Draw + Curved Light-Art FX** | Zero-dependency custom GPU GLSL fragment shader (`js/webgl-gallery.js`) with domain-warped FBM liquid-light silk, 4 simultaneous R/G/B chromatic-dispersion optical shockwaves fired from exact match coordinates, interactive pointer spotlight, dual-core chromatic Match-4 beams, curved teamLab Bezier Tiara ribbons, and renamed **VAULT DRAW**. |
| `checkpoint/v2.2-cohesive-exhibitions` | `main` (`5f89c88`) | **45 Cohesive V&A Museum Pieces Across 8 Stylistic Rooms** | Removed every cross-era anachronism (including the 3,000-year-old jade ring), added 13 newly curated V&A jewels (Raymond Templier, Georges Fouquet, Ostertag, Elisabeth Treskow, Tiffany & Co., Arthur King, Boucheron, Stephen Webster, Giovanni Corvaja, Jane Short), split Art Deco into *Geometric Contrast* & *Tutti Frutti & Florals*, added cut-gemstone rain & family colophon note. |
| `checkpoint/v2.3-tutorial-share-sso` | `main` (`5a81158`) | **Interactive Tutorial + Viral IG/FB Share Card + Supabase Facebook/Google SSO** | 4-step hands-on guided gallery tutorial (`js/tutorial.js`), `1200×630` Open Graph preview card (`assets/og-card.jpg`), 1-tap `1080×1350` Viral Vault Share Card generator (`js/share.js`) with `@parenteconnie` colophon & invite challenge links, plus Supabase Facebook + Google SSO & Cloud Sync (`js/auth.js`, `js/supabase-config.js`, `supabase/schema.sql`). |
| `checkpoint/v2.4-wcag22-aa` | `main` | **WCAG 2.2 Level AA Accessibility + Whatnot `@jewelqueen` Social** | Full WCAG 2.2 AA compliance verified live: pinch-zoom & `390×422` scroll reflow, roving-tabindex keyboard play on the 7×7 board, non-drag 3× Loupe pan controls & keyboard shortcuts, all targets ≥ `24×24px`, AA text (`≥ 5.7:1`) & UI border (`≥ 4.0:1`) contrast, unified `:focus-visible` rings, labelled Whatnot `@handle` field, semantic ARIA on all 7 modals, plus updated `README.md`. |

---

## Planned Experimental Branches (Ready to Fork from `checkpoint/v1-candy-crush-museum-pokedex`)

- **`game/pokemon-collector`** — Deeper **Pokémon / Fantasy Estate** loop: pack pulls / estate auction hunts, rarity drops, appraisal mini-games, daily showcases, and competitive Fantasy Lineup scoring.
- **`game/jewel-asteroids`** — Mobile-first **Asteroids** arcade spin: antique museum jewels drift across black velvet space; aim/fire diamond beams or lasso rays to shatter & collect rare pieces before they collide!
- **`game/maximalist-slots`** — Pure **5×3 Maximalist Slot Machine** cabinet with cascading jewel reels, free-spin bonus wheels, and collector jackpot drops.

---

## Quick Git Commands

```bash
# List all labeled checkpoints
git tag -n1

# Jump back to the verified Candy Crush + Pokédex baseline
git checkout checkpoint/v1-candy-crush-museum-pokedex

# Start a new experiment branch (e.g. Jewel Asteroids or Pokémon Collector)
git checkout -b game/jewel-asteroids checkpoint/v1-candy-crush-museum-pokedex
git checkout -b game/pokemon-collector checkpoint/v1-candy-crush-museum-pokedex
git checkout -b game/maximalist-slots checkpoint/v1-candy-crush-museum-pokedex

# Switch between active game branches anytime
git switch game/candy-crush-pokedex
```

## Running Locally

```bash
python3 -m http.server 8765 --directory /Users/sublux/.gemini/antigravity/scratch/jewel-queen
# Open http://localhost:8765/
```
