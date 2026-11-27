/**
 * Jewel Queen — Expanded 6-Step Interactive Hands-On Gallery Tutorial
 * Teaches every core game dynamic, rule, power-jewel combo, and viral collection loop
 * directly on the live black velvet tray in ~45 seconds:
 *   Step 1: Match 3 & understand Goals + Collection unlocks
 *   Step 2: Match 4 in a line to forge a Light Beam power jewel (explains 4 / L-T / 5 rules)
 *   Step 3: Actually trigger/fire your Light Beam jewel to sweep an entire row or column!
 *   Step 4: Tap VAULT DRAW for 3x Luminous Aura, extra moves & cut-gemstone rain
 *   Step 5: Discover 3x Museum Loupe zoom & touring all 8 historical eras
 *   Step 6: Track Estate Value ($), pin Top 5 & share to TikTok / IG / FB / Whatnot
 */

const STORAGE_KEY = 'jq_tutorial_done';

export class GalleryTutorial {
  constructor(game) {
    this.game = game;
    this.active = false;
    this.step = 0; // 1..6
    this.highlightedTiles = [];
    this.highlightedEls = [];
    this.targetSwap = null;

    this.barEl = document.getElementById('tutorialBar');
    this.kickerEl = document.getElementById('tutorialKicker');
    this.textEl = document.getElementById('tutorialText');
    this.ruleChipEl = document.getElementById('tutorialRuleChip');
    this.actionBtn = document.getElementById('tutorialActionBtn');
    this.skipBtn = document.getElementById('tutorialSkipBtn');
    this.dotsEl = document.getElementById('tutorialDots');

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => this.finish(true));
    }
    if (this.actionBtn) {
      this.actionBtn.addEventListener('click', () => {
        if (this.step === 5) {
          this.step = 6;
          this._renderStep();
        } else if (this.step === 6) {
          this.finish(true);
        }
      });
    }
  }

  shouldAutoStart() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tutorial') === '1') return true;
    if (params.get('tutorial') === '0') return false;
    return !localStorage.getItem(STORAGE_KEY);
  }

  start(forceResetStage1 = false) {
    this.active = true;
    this.step = 1;
    if (forceResetStage1 || this.game.stageNum !== 1) {
      this.game.startStage(1, { skipTutorialCheck: true });
    }
    this._stageStep1Board();
    this._renderStep();
  }

  finish(markDone = true) {
    this.active = false;
    this.step = 0;
    this.targetSwap = null;
    this._clearHighlights();
    if (this.barEl) this.barEl.hidden = true;
    if (markDone) {
      localStorage.setItem(STORAGE_KEY, '1');
    }
    this.game._scheduleHint();
  }

  /**
   * Step 1: Guaranteed clean Match-3 right at the center of the velvet tray: (3,3) <-> (3,4)
   */
  _stageStep1Board() {
    const pool = this.game._activeJewelPool().map((j) => j.id);
    if (pool.length < 5) return;
    const [A, B, C, D, E] = pool;
    const layout = [
      [A, B, C, D, E, A, B],
      [C, D, E, A, B, C, D],
      [E, A, B, C, D, E, A],
      [D, B, B, C, B, A, E], // Swap (3,3)=C with (3,4)=B -> 3x B at (3,1),(3,2),(3,3)
      [B, E, A, D, C, B, C],
      [A, C, D, E, A, D, B],
      [C, D, E, B, D, E, A]
    ];
    this.game._loadFixedBoard(layout);
    this.targetSwap = [
      [3, 3],
      [3, 4]
    ];
  }

  /**
   * Step 2: Guarantee a crisp 4-in-a-row swap so the player forges a real Light Beam power jewel.
   */
  _ensureMatch4Swap() {
    const found = this._find4MatchSwap();
    if (found) {
      this.targetSwap = found;
      return;
    }
    const pool = this.game._activeJewelPool().map((j) => j.id);
    const [A, B, C, D] = pool;
    const g = this.game.grid;
    const set = (r, c, type) => {
      if (g[r]?.[c]) {
        g[r][c].type = type;
        g[r][c].special = null;
        this.game._syncTileVisual(g[r][c]);
      }
    };
    set(3, 1, A);
    set(3, 2, A);
    set(3, 3, B);
    set(3, 4, A);
    set(2, 3, A);
    if (g[3]?.[0]?.type === A) set(3, 0, C);
    if (g[3]?.[5]?.type === A) set(3, 5, D);
    if (g[1]?.[3]?.type === A) set(1, 3, C);
    if (g[4]?.[3]?.type === B) set(4, 3, D);
    if (g[2]?.[2]?.type === A && g[2]?.[1]?.type === A) set(2, 2, C);
    if (g[2]?.[4]?.type === A && g[2]?.[5]?.type === A) set(2, 4, D);

    this.targetSwap = [
      [2, 3],
      [3, 3]
    ];
  }

  /**
   * Step 3: Find a live swap that triggers an existing power jewel on the board,
   * or stage a guaranteed Light Beam activation right in the center so the player
   * feels the explosive row-sweep laser firsthand!
   */
  _ensurePowerTriggerSwap() {
    const g = this.game.grid;
    const N = g.length;

    // Look for any existing special tile that already has a valid swap
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const a = g[r][c];
        if (!a || !a.special) continue;
        for (const [dr, dc] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= N || nc < 0 || nc >= N) continue;
          const b = g[nr][nc];
          if (!b) continue;
          if (a.special === 'tiara' || b.special) {
            this.targetSwap = [[r, c], [nr, nc]];
            return;
          }
          g[r][c] = b;
          g[nr][nc] = a;
          const ok = this._runLenAt(r, c) >= 3 || this._runLenAt(nr, nc) >= 3;
          g[r][c] = a;
          g[nr][nc] = b;
          if (ok) {
            this.targetSwap = [[r, c], [nr, nc]];
            return;
          }
        }
      }
    }

    // Otherwise craft a glowing Light Beam trigger right in row 3: swap (2,3) with (3,3)!
    const pool = this.game._activeJewelPool().map((j) => j.id);
    const [A, B, C, D] = pool;
    const set = (r, c, type, spec = null) => {
      if (g[r]?.[c]) {
        g[r][c].type = type;
        g[r][c].special = spec;
        this.game._syncTileVisual(g[r][c]);
      }
    };
    set(3, 1, A, 'line-h');
    set(3, 2, A, null);
    set(3, 3, B, null);
    set(2, 3, A, null);
    if (g[3]?.[0]?.type === A) set(3, 0, C);
    if (g[3]?.[4]?.type === A) set(3, 4, D);
    if (g[1]?.[3]?.type === A) set(1, 3, C);
    if (g[4]?.[3]?.type === B) set(4, 3, D);

    this.targetSwap = [
      [2, 3],
      [3, 3]
    ];
  }

  _find4MatchSwap() {
    const g = this.game.grid;
    const N = g.length;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const a = g[r][c];
        if (!a || a.special) continue;
        for (const [dr, dc] of [[0, 1], [1, 0]]) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= N || nc >= N) continue;
          const b = g[nr][nc];
          if (!b || b.special || a.type === b.type) continue;
          g[r][c] = b;
          g[nr][nc] = a;
          const ok = this._runLenAt(r, c) >= 4 || this._runLenAt(nr, nc) >= 4;
          g[r][c] = a;
          g[nr][nc] = b;
          if (ok) return [[r, c], [nr, nc]];
        }
      }
    }
    return null;
  }

  _runLenAt(r, c) {
    const g = this.game.grid;
    const N = g.length;
    const t = g[r]?.[c];
    if (!t) return 0;
    let h = 1;
    for (let cc = c - 1; cc >= 0 && g[r][cc]?.type === t.type; cc--) h++;
    for (let cc = c + 1; cc < N && g[r][cc]?.type === t.type; cc++) h++;
    let v = 1;
    for (let rr = r - 1; rr >= 0 && g[rr][c]?.type === t.type; rr--) v++;
    for (let rr = r + 1; rr < N && g[rr][c]?.type === t.type; rr++) v++;
    return Math.max(h, v);
  }

  onMatchResolved() {
    if (!this.active) return;
    if (this.step === 1) {
      this.step = 2;
      this._ensureMatch4Swap();
      this._renderStep();
    } else if (this.step === 2) {
      this.step = 3;
      this._ensurePowerTriggerSwap();
      this._renderStep();
    } else if (this.step === 3) {
      this.step = 4;
      this.game.slot.setCharge(100);
      this.game.slot.setBanner('TUTORIAL · TAP VAULT DRAW NOW', true);
      this._renderStep();
    }
  }

  onVaultDrawComplete() {
    if (!this.active) return;
    if (this.step === 4) {
      this.step = 5;
      this._renderStep();
    }
  }

  onLoupeOrCollectionOpened() {
    if (!this.active) return;
    if (this.step === 5) {
      this.step = 6;
      this._renderStep();
    } else if (this.step === 6) {
      this.finish(true);
    }
  }

  _clearHighlights() {
    for (const el of this.highlightedTiles) {
      el?.classList.remove('is-tutorial-focus');
    }
    this.highlightedTiles = [];
    for (const el of this.highlightedEls) {
      el?.classList.remove('is-tutorial-ring');
    }
    this.highlightedEls = [];
  }

  _highlightEl(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('is-tutorial-ring');
      this.highlightedEls.push(el);
    }
  }

  _renderStep() {
    if (!this.barEl) return;
    this._clearHighlights();
    this.barEl.hidden = false;

    const steps = {
      1: {
        kicker: 'STEP 1 OF 6 · MATCH 3 & REACH YOUR GOAL',
        rule: 'RULE · Complete the GOAL above before MOVES run out',
        text: 'Swipe or tap the two glowing jewels to align 3. Every match scores points and permanently unlocks those real V&A Museum pieces in your Vault.',
        cta: ''
      },
      2: {
        kicker: 'STEP 2 OF 6 · FORGE POWER JEWELS',
        rule: '4 = Light Beam · L/T = Aura Burst · 5 = Royal Tiara Wild',
        text: 'Swap the glowing jewels to match 4 in a line — forging a glowing Light Beam power jewel!',
        cta: ''
      },
      3: {
        kicker: 'STEP 3 OF 6 · FIRE YOUR LIGHT BEAM',
        rule: 'COMBO TIP · Swap any 2 power jewels together for a mega blast',
        text: 'Now match the glowing Light Beam jewel to fire a laser sweep across the entire row for big cascade multipliers!',
        cta: ''
      },
      4: {
        kicker: 'STEP 4 OF 6 · CURATOR’S VAULT DRAW',
        rule: 'REWARDS · 3× Luminous Aura, +Moves, Power Jewels & Gem Rain',
        text: 'Matches charge the 3-chamber archive bar. Tap VAULT DRAW now to pull 3 museum pieces and rain faceted gemstones!',
        cta: ''
      },
      5: {
        kicker: 'STEP 5 OF 6 · 3× LOUPE & 8 HISTORIC ERAS',
        rule: 'HOLD ANY JEWEL · Zoom 3× & read its real V&A museum story',
        text: 'Tap the Era title to tour all 8 eras (Art Nouveau, Art Deco, Dior, 1960s Gold & 2022 Couture), or hold any piece for 3× Loupe zoom.',
        cta: 'NEXT →'
      },
      6: {
        kicker: 'STEP 6 OF 6 · COLLECT ALL 45 & SHARE YOUR VAULT',
        rule: 'GO VIRAL · Share your 9:16 Vault Card on TikTok, IG, FB & Whatnot',
        text: 'Open ◆ My Collection to track your $ Estate Value, pin your Top 5 Signature Tray, and challenge fellow jewelry collectors!',
        cta: 'START PLAYING'
      }
    };

    const cfg = steps[this.step];
    if (!cfg) return;

    this.kickerEl.textContent = cfg.kicker;
    if (this.ruleChipEl) this.ruleChipEl.textContent = cfg.rule;
    this.textEl.textContent = cfg.text;
    if (cfg.cta) {
      this.actionBtn.textContent = cfg.cta;
      this.actionBtn.hidden = false;
    } else {
      this.actionBtn.hidden = true;
    }

    if (this.dotsEl) {
      this.dotsEl.innerHTML = [1, 2, 3, 4, 5, 6]
        .map((n) => `<span class="tut-dot ${n === this.step ? 'is-active' : n < this.step ? 'is-done' : ''}"></span>`)
        .join('');
    }

    if ((this.step === 1 || this.step === 2 || this.step === 3) && this.targetSwap) {
      for (const [r, c] of this.targetSwap) {
        const el = this.game.grid[r]?.[c]?.el;
        if (el) {
          el.classList.add('is-tutorial-focus');
          this.highlightedTiles.push(el);
        }
      }
    } else if (this.step === 4) {
      this._highlightEl('spinBtn');
    } else if (this.step === 5) {
      this._highlightEl('erasBtn');
      this._highlightEl('footerLoupeBtn');
    } else if (this.step === 6) {
      this._highlightEl('lookbookBtn');
    }
  }
}
