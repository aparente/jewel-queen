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

---

## Upcoming Features & Roadmap

### 1. WCAG 2.2 Level AA Accessibility Pass *(Next Up)*
Tracked from our live WCAG 2.2 AA audit (`390×844`, `390×422` 200% zoom, `320×568`):
- [ ] **Zoom & Reflow (`1.4.4`, `1.4.10`):** Remove `user-scalable=no` / `maximum-scale=1.0` and unlock vertical scrolling on zoomed/short screens.
- [ ] **Full Keyboard Playability (`2.1.1`, `2.4.7`):** Add roving `tabindex` + Arrow-key navigation and `Enter`/`Space` select-and-swap on the 7×7 board, convert clickable non-buttons (`#goalDisplay`, `.era-jewels-strip img`, `.loupe-stage`) to real `<button>` elements, and add unified `:focus-visible` outlines everywhere.
- [ ] **Non-Drag 3× Loupe Pan (`2.5.7`):** Add keyboard arrow / button pan controls when zoomed into 2×/3× in the Jeweler's Loupe.
- [ ] **WCAG 2.2 Target Sizes (`2.5.8` ≥ `24×24px`):** Expand the 7 undersized controls (`.era-picker-btn`, `.tutorial-skip-btn`, `.invite-close-btn`, `#saveCollectorNameBtn`, `.footer-loupe-btn`, `#goalDisplay`, `.zoom-pill`).
- [ ] **Text & UI Contrast (`1.4.3` ≥ `4.5:1`, `1.4.11` ≥ `3:1`):** Lift `--silver-muted`, `.family-note`, locked Pokédex labels, Facebook SSO button (`#1466d6`), and form input borders above AA thresholds while preserving the dark velvet gallery mood.
- [ ] **ARIA & Labels (`1.3.1`, `4.1.2`):** Label `#collectorWhatnotInput`, add `role="row"` wrappers inside `[role="grid"]`, add `role="tab"` + `aria-selected` in `#vaultFilters`, add `aria-labelledby` to all `<dialog>` modals, and add `aria-pressed` to `#muteBtn` and `.zoom-pill`.

### 2. Live Facebook & Google SSO + Collectors' Leaderboard Activation
- [ ] Connect a free [Supabase](https://supabase.com) project by running [`supabase/schema.sql`](supabase/schema.sql) in the SQL Editor, enabling Google & Facebook OAuth providers, and adding the public Project URL + Publishable key in [`js/supabase-config.js`](js/supabase-config.js).
- [ ] Enable cross-device Estate Vault sync (Instagram in-app browser ↔ Facebook ↔ Safari ↔ Desktop) and live Collectors' Leaderboard with clickable Whatnot `@handle` links.

### 3. Customizable Collector Trays & Gallery Backgrounds
- [ ] Surface an in-gallery tray material switcher so players can toggle between **Pure Black Velvet** (default), **Living Black Opal** (already prototyped on branch `tray/living-opal` / tag `checkpoint/v1.3-living-opal-tray`), and future velvet/mineral finishes.

### 4. Collector Virality & Community Features
- [ ] **Daily Curated Exhibition Challenge:** One shared daily board & featured V&A grail so collectors in Facebook & Instagram groups can compare scores on the exact same tray.
- [ ] **Public Shareable Vault Page (`?vault=<handle>`):** Let friends inspect another collector's full pinned 5-piece Signature Lineup in 3× Loupe zoom.
- [ ] **Optional "Shop Connie's Real Vault" Showcase:** Standalone off-platform browse drawer linking Connie's real Whatnot `@jewelqueen` vintage pieces (strictly separate from live-show gameplay to stay 100% compliant with Whatnot policies).

### 5. Experimental Game Mode Branches *(Shared 45-Piece V&A Core)*
See [`CHECKPOINTS.md`](CHECKPOINTS.md) for all saved checkpoint tags and planned spin-off branches:
- [ ] `game/pokemon-collector` — Estate auction pulls, rarity drops, appraisal mini-games & Fantasy Lineup scoring
- [ ] `game/jewel-asteroids` — Mobile arcade spin collecting drifting museum jewels across black velvet space
- [ ] `game/maximalist-slots` — 5×3 museum slot cabinet with cascading jewel reels & collector jackpots

---

## Local Development

```bash
python3 -m http.server 8765 --directory .
# Open http://localhost:8765/
```

See [`CHECKPOINTS.md`](CHECKPOINTS.md) for the full checkpoint history (`checkpoint/v1` through `checkpoint/v2.3-tutorial-share-sso`).
