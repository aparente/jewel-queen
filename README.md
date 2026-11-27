# JEWEL QUEEN — Gallery Archive

**Play live on mobile or desktop:** https://aparente.github.io/jewel-queen/

*A private gallery game made by & for family — inspired by Connie Parente (**Whatnot [`@jewelqueen`](https://www.whatnot.com/user/jewelqueen)** · **Instagram [`@parenteconnie`](https://www.instagram.com/parenteconnie/?hl=en)**).*

---

## What's Live Today (`main`)

- **45 Real Victoria & Albert Museum (V&A) Jewels across 8 Cohesive Gallery Rooms** — zero cross-era anachronisms or duplicates across rooms:
  1. **1895–1910 · Art Nouveau: Enamel & Opal** *(René Lalique, Marcus & Co., Child & Child)*
  2. **1920s–30s · Art Deco: Geometric Contrast** *(Cartier, Raymond Templier, Georges Fouquet)*
  3. **1920s–30s · Art Deco: Tutti Frutti & Florals** *(Ostertag Paris, Parisian Deco Flower Baskets)*
  4. **1930s–50s · Surrealist & Figural Menagerie** *(Cartier Coral Hand, Owl & Guard, Paul Flato, Elisabeth Treskow)*
  5. **1940s–50s · Golden Age & Christian Dior** *(Christian Dior by Mitchel Maer, Tiffany & Co., Trifari)*
  6. **1960s · Swinging 60s Sculptural Gold** *(Andrew Grima, Jean Schlumberger, John Donald, Arthur King, Kenneth Jay Lane)*
  7. **1850–1900 · Victorian & Renaissance Revival** *(The Canning Pearl Merman, Castellani, Arthur Giuliano)*
  8. **2000–2022 · 21st-Century Masterworks** *(Wallace Chan, Cindy Chao, Boucheron, Stephen Webster, Giovanni Corvaja, Jane Short MBE)*
  - Plus Henri Lavabre's 1913 **Ruby & Diamond Royal Tiara** as the Match-5 Crown Sovereign wild.
- **teamLab Borderless × Museum Gallery Aesthetic:** Pure gallery black with a custom zero-dependency **WebGL GLSL liquid-light & chromatic shockwave shader** (`js/webgl-gallery.js`), **Pure Black Velvet Collector's Tray**, borderless HUD, smoked-glass **Curator's Vault Draw**, and faceted **cut-gemstone rain** (diamonds, emeralds, rubies, sapphires, amethysts, and pearls).
- **Interactive 4-Step Guided Tutorial (`js/tutorial.js`):** Auto-launches on first visit (replayable anytime via `?` or `?tutorial=1`), walking players hands-on through Match 3, forging a Match-4 Light Beam, pulling Vault Draw, and using the 3× Loupe & Collection.
- **3× Jeweler's Loupe & My Collection Pokédex (`js/history.js`):** Hold any jewel on the board (or tap any card) to zoom up to 3×, pan, read its materials & provenance, open the official V&A archive record, track Estate Valuation (`$`), and pin a 5-piece **Signature Lineup**.
- **Built for Instagram, Facebook & Whatnot Sharing (`js/share.js`, `assets/og-card.jpg`):**
  - `1200×630` Open Graph preview card for Facebook, Messenger, WhatsApp & iMessage.
  - 1-tap `1080×1350` portrait **Shareable Vault Card PNG** displaying the collector's Name, optional **Whatnot `@handle`**, Estate Value, Acquired count (`/45`), Best Score, Top 5 Velvet Tray, and Connie Parente's `@jewelqueen` / `@parenteconnie` colophon.
  - Personalized Challenge Invite URLs (`?invite=...&wn=...&estate=...`).
- **Collector Passport & Cloud Sync Layer (`js/auth.js`, `supabase/schema.sql`):** Guest Collector Profile + optional Whatnot `@handle` works immediately; Facebook & Google SSO + cross-device Cloud Vault Sync + Collectors' Leaderboard activate once Supabase keys are configured.
- **WCAG 2.2 Level AA Accessible:** Pinch-to-zoom & 200%-zoom scroll reflow (`1.4.4`, `1.4.10`), full keyboard playability on the 7×7 board (roving `tabindex`, Arrow keys, `Enter`/`Space` select-and-swap, `I` for Loupe), non-drag arrow pan buttons & keyboard shortcuts in the 3× Loupe (`2.5.7`), all interactive targets ≥ `24×24px` (`2.5.8`), AA text (`≥ 5.7:1`) & UI border (`≥ 4.0:1`) contrast (`1.4.3`, `1.4.11`), unified `:focus-visible` rings, labelled inputs, and semantic ARIA across all 7 dialogs.

---

## Upcoming Features & Roadmap

### 1. Live Facebook & Google SSO + Collectors' Leaderboard Activation *(Next Up)*
- [ ] Connect a free [Supabase](https://supabase.com) project by running [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor, enabling Google & Facebook OAuth providers, and adding the public Project URL + Publishable key in [`js/supabase-config.js`](js/supabase-config.js).
- [ ] Enable cross-device Estate Vault sync (Instagram in-app browser ↔ Facebook ↔ Safari ↔ Desktop) and live Collectors' Leaderboard with clickable Whatnot `@handle` links.

### 2. Customizable Collector Trays & Gallery Backgrounds
- [ ] Surface an in-gallery tray material switcher so players can toggle between **Pure Black Velvet** (default), **Living Black Opal** (already prototyped on branch `tray/living-opal` / tag `checkpoint/v1.3-living-opal-tray`), and future velvet/mineral finishes.

### 3. Collector Virality & Community Features
- [ ] **Daily Curated Exhibition Challenge:** One shared daily board & featured V&A grail so collectors in Facebook & Instagram groups can compare scores on the exact same tray.
- [ ] **Public Shareable Vault Page (`?vault=<handle>`):** Let friends inspect another collector's full pinned 5-piece Signature Lineup in 3× Loupe zoom.
- [ ] **Optional "Shop Connie's Real Vault" Showcase:** Standalone off-platform browse drawer linking Connie's real Whatnot `@jewelqueen` vintage pieces (strictly separate from live-show gameplay to stay 100% compliant with Whatnot policies).

### 4. Experimental Game Mode Branches *(Shared 45-Piece V&A Core)*
See [`CHECKPOINTS.md`](CHECKPOINTS.md) for all saved checkpoint tags and planned spin-off branches:
- [ ] `game/pokemon-collector` — Estate auction pulls, rarity drops, appraisal mini-games & Fantasy Lineup scoring
- [ ] `game/jewel-asteroids` — Mobile arcade spin collecting drifting museum jewels across black velvet space
- [ ] `game/maximalist-slots` — 5×3 museum slot cabinet with cascading jewel reels & collector jackpots

### Recently Completed
- [x] **WCAG 2.2 Level AA Accessibility Pass (`checkpoint/v2.4-wcag22-aa`):** Pinch-zoom & scroll reflow, keyboard playability on the 7×7 board, non-drag 3× Loupe pan controls, ≥ `24×24px` target sizes, AA text & UI border contrast, `:focus-visible` rings, and full ARIA/dialog semantics.
- [x] **Whatnot Social Integration (`@jewelqueen`):** Optional collector Whatnot `@handle` field on Vault Cards & Leaderboard + clickable Connie Parente `@jewelqueen` & `@parenteconnie` links.
- [x] **Interactive 4-Step Tutorial & Viral Vault Share Card (`checkpoint/v2.3-tutorial-share-sso`):** Guided onboarding, `1080×1350` IG/FB Vault Card PNG generator, `1200×630` Open Graph card, and Supabase Facebook/Google SSO layer.
- [x] **45 Cohesive V&A Museum Jewels (`checkpoint/v2.2-cohesive-exhibitions`):** 8 stylistically unified era rooms with zero anachronisms.

---

## Local Development

```bash
python3 -m http.server 8765 --directory .
# Open http://localhost:8765/
```

See [`CHECKPOINTS.md`](CHECKPOINTS.md) for the full checkpoint history (`checkpoint/v1` through `checkpoint/v2.4-wcag22-aa`).
