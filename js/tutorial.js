/**
 * Jewel Queen — Interactive 4-Step Guided Gallery Tutorial
 * Hands-on, deterministic onboarding directly on the black velvet tray:
 *   Step 1: Swipe or tap two highlighted jewels to make a Match 3
 *   Step 2: Swap two highlighted jewels to forge a Match 4 Light Beam power jewel
 *   Step 3: Tap VAULT DRAW to experience the 3-chamber bonus & cut-gemstone rain
 *   Step 4: Discover the 3x Jeweler's Loupe & My Collection (45 V&A Museum pieces)
 */

const STORAGE_KEY = 'jq_tutorial_done';

export class GalleryTutorial {
  constructor(game) {
    this.game = game;
    this.active = false;
    this.step = 0; // 1..4
    this.highlightedTiles = [];
    this.highlightedEl = null;

    this.barEl = document.getElementById('tutorialBar');
    this.kickerEl = document.getElementById('tutorialKicker');
    this.textEl = document.getElementById('tutorialText');
    this.actionBtn = document.getElementById('tutorialActionBtn');
    this.skipBtn = document.getElementById('tutorialSkipBtn');
    this.dotsEl = document.getElementById('tutorialDots');

    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => this.finish(true));
    }
    if (this.actionBtn) {
      this.actionBtn.addEventListener('click', () => {
        if (this.step === 4) {
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
    this._clearHighlights();
    if (this.barEl) this.barEl.hidden = true;
    if (markDone) {
      localStorage.setItem(STORAGE_KEY, '1');
    }
    this.game._scheduleHint();
  }

  /**
   * Ensure a guaranteed, visually obvious Match-3 right at the center of the tray
   * without triggering pre-existing matches.
   */
  _stageStep1Board() {
    const pool = this.game._activeJewelPool().map((j) => j.id);
    if (pool.length < 5) return;
    const [A, B, C, D, E] = pool;
    // Deterministic 7x7 starter board with zero initial matches and a clean Match-3 at (3,2)<->(3,3)
    const layout = [
      [A, B, C, D, E, A, B],
      [C, D, E, A, B, C, D],
      [E, A, B, C, D, E, A],
      [D, B, B, C, B, A, E], // Swap (3,3)=C with (3,4)=B -> 3x B at (3,1),(3,2),(3,3)!
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
   * Find an existing Match-4 swap on the live board, or craft one cleanly near the center
   * so the player always experiences forging a Light Beam jewel!
   */
  _ensureMatch4Swap() {
    const found = this._find4MatchSwap();
    if (found) {
      this.targetSwap = found;
      return;
    }
    const pool = this.game._activeJewelPool().map((j) => j.id);
    const A = pool[0];
    const B = pool[1];
    const C = pool[2];
    const D = pool[3];
    // Gently arrange row 3 & (2,3) into an unmistakable 4-in-a-row swap: (2,3)<->(3,3)
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
    // Prevent accidental vertical matches at (2,3)/(3,3) or row 3 neighbors
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

  _find4MatchSwap() {
    const g = this.game.grid;
    const N = g.length;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const a = g[r][c];
        if (!a || a.special) continue;
        for (const [dr, dc] of [
          [0, 1],
          [1, 0]
        ]) {
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

  onMatchResolved(hadSpecialCreated) {
    if (!this.active) return;
    if (this.step === 1) {
      this.step = 2;
      this._ensureMatch4Swap();
      this._renderStep();
    } else if (this.step === 2) {
      // Advance whether they matched 4 or cleared a cascade
      this.step = 3;
      this.game.slot.setCharge(100);
      this.game.slot.setBanner('TUTORIAL · TAP VAULT DRAW NOW', true);
      this._renderStep();
    }
  }

  onVaultDrawComplete() {
    if (!this.active) return;
    if (this.step === 3) {
      this.step = 4;
      this._renderStep();
    }
  }

  onLoupeOrCollectionOpened() {
    if (!this.active) return;
    if (this.step === 4) {
      this.finish(true);
    }
  }

  _clearHighlights() {
    for (const el of this.highlightedTiles) {
      el?.classList.remove('is-tutorial-focus');
    }
    this.highlightedTiles = [];
    if (this.highlightedEl) {
      this.highlightedEl.classList.remove('is-tutorial-ring');
      this.highlightedEl = null;
    }
  }

  _renderStep() {
    if (!this.barEl) return;
    this._clearHighlights();
    this.barEl.hidden = false;

    const steps = {
      1: {
        kicker: 'STEP 1 OF 4 · ALIGN THREE',
        text: 'Swipe or tap the two glowing jewels to align 3 in a row.',
        cta: ''
      },
      2: {
        kicker: 'STEP 2 OF 4 · FORGE A LIGHT BEAM',
        text: 'Swap the glowing jewels to match 4 — creating a luminous row-sweeping jewel.',
        cta: ''
      },
      3: {
        kicker: 'STEP 3 OF 4 · CURATOR’S VAULT DRAW',
        text: 'Matches charge the archive bar. Tap VAULT DRAW for 3× Aura, extra moves & gem rain.',
        cta: ''
      },
      4: {
        kicker: 'STEP 4 OF 4 · LOUPE & COLLECTION',
        text: 'Hold any jewel to zoom 3× & read its V&A story. Open ◆ My Collection to track & share all 45 pieces.',
        cta: 'BEGIN EXHIBITION'
      }
    };

    const cfg = steps[this.step];
    if (!cfg) return;

    this.kickerEl.textContent = cfg.kicker;
    this.textEl.textContent = cfg.text;
    if (cfg.cta) {
      this.actionBtn.textContent = cfg.cta;
      this.actionBtn.hidden = false;
    } else {
      this.actionBtn.hidden = true;
    }

    if (this.dotsEl) {
      this.dotsEl.innerHTML = [1, 2, 3, 4]
        .map((n) => `<span class="tut-dot ${n === this.step ? 'is-active' : n < this.step ? 'is-done' : ''}"></span>`)
        .join('');
    }

    if ((this.step === 1 || this.step === 2) && this.targetSwap) {
      for (const [r, c] of this.targetSwap) {
        const el = this.game.grid[r]?.[c]?.el;
        if (el) {
          el.classList.add('is-tutorial-focus');
          this.highlightedTiles.push(el);
        }
      }
    } else if (this.step === 3) {
      const btn = document.getElementById('spinBtn');
      if (btn) {
        btn.classList.add('is-tutorial-ring');
        this.highlightedEl = btn;
      }
    } else if (this.step === 4) {
      const btn = document.getElementById('lookbookBtn');
      if (btn) {
        btn.classList.add('is-tutorial-ring');
        this.highlightedEl = btn;
      }
    }
  }
}
