# Jewel Queen — Game Dynamics & Checkpoints

Every game prototype in **Jewel Queen** shares the same **38-piece Real Museum Jewelry Core** (sourced from the Victoria & Albert Museum and Cleveland Museum of Art, inspired by Connie Parente's archive):

- `assets/museum_jewels/` — 38 transparent 320×320 museum cutouts
- `assets/museum_hires/` — 38 full-resolution photographs for the 3× Jeweler's Loupe
- `js/data.js` — 38 museum jewels + 8 Historical Era & Style exhibitions
- `js/history.js` — Curatorial stories, materials, rarity tiers, estate valuations, and official museum links
- `js/audio.js` & `js/ambient.js` — Synthesized Web Audio chimes & pure gallery-black golden stardust canvas

---

## Saved Checkpoints (Tags & Branches)

| Checkpoint Tag | Branch | Game Dynamic | Highlights |
| --- | --- | --- | --- |
| `checkpoint/v1-candy-crush-museum-pokedex` | `main` (`18363b0`) | **Candy Crush Match-3 + Royal Slot + Pokédex Vault** | First complete museum baseline: 7×7 Match-3 + 3-reel slot + 8 Historical Eras + 3× Loupe + MY COLLECTION Pokédex on pure gallery black (original gold marquee frame). |
| `checkpoint/v1.1-velvet-crystal-trays` | `main`, `game/candy-crush-pokedex` | **Candy Crush + Pokédex + Era Velvet/Crystal Trays** | Replaces the gold marquee frame & bulbs with **8 bespoke era-matched luxury jewelry trays** (iridescent black opal, jadeite lacquer, obsidian turquoise inlay, crushed mulberry velvet, smoked diamond crystal, peacock rock crystal, oxblood museum velvet, and iridescent anodized titanium prism). |

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
