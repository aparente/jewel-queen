/**
 * Jewel Queen — Main Match-3 Cascade & Royal Slot Game Engine
 * Mobile-first pointer-gesture swap, special power jewels, velvet showcase goals,
 * cascade combos, and persistent Collector's Vault Lookbook.
 */

import {
  BOARD_SIZE,
  JEWELS,
  JEWEL_MAP,
  TIARA_PIECE,
  STAGES,
  GLAMOUR_CALLOUTS,
  getStageConfig
} from './data.js';
import { audio } from './audio.js';
import { ParticleFX } from './particles.js';
import { RoyalSlotBar } from './slot.js';
import { WebGLGallery } from './webgl-gallery.js';
import { GalleryTutorial } from './tutorial.js';
import { renderVaultShareCard, computeVaultStats } from './share.js';
import { CollectorAuth } from './auth.js';
import {
  MUSEUM_DOSSIERS,
  COLLECTOR_TIERS,
  RARITY_META,
  getMasteryRank,
  formatEstateMoney
} from './history.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const keyOf = (r, c) => `${r},${c}`;
const inBounds = (r, c) => r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;

function vibrate(pattern) {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore unsupported environments
    }
  }
}

class JewelQueenGame {
  constructor() {
    // DOM References
    this.boardShell = document.getElementById('boardShell');
    this.boardStage = document.getElementById('boardStage');
    this.boardCells = document.getElementById('boardCells');
    this.boardTiles = document.getElementById('boardTiles');
    this.marqueeBulbs = document.getElementById('marqueeBulbs');
    this.feverRibbon = document.getElementById('feverRibbon');
    this.feverCount = document.getElementById('feverCount');

    this.stageSubtitle = document.getElementById('stageSubtitle');
    this.designerLine = document.getElementById('designerLine');
    this.scoreVal = document.getElementById('scoreVal');
    this.scoreBarFill = document.getElementById('scoreBarFill');
    this.goalDisplay = document.getElementById('goalDisplay');
    this.movesVal = document.getElementById('movesVal');
    this.movesPlaque = document.getElementById('movesPlaque');
    this.bestScoreVal = document.getElementById('bestScoreVal');

    this.resultDialog = document.getElementById('resultDialog');
    this.resultKicker = document.getElementById('resultKicker');
    this.resultTitle = document.getElementById('resultTitle');
    this.resultStars = document.getElementById('resultStars');
    this.resultSummary = document.getElementById('resultSummary');
    this.resultScore = document.getElementById('resultScore');
    this.resultBonus = document.getElementById('resultBonus');
    this.resultPrimaryBtn = document.getElementById('resultPrimaryBtn');
    this.resultSecondaryBtn = document.getElementById('resultSecondaryBtn');

    this.lookbookDialog = document.getElementById('lookbookDialog');
    this.lookbookGrid = document.getElementById('lookbookGrid');
    this.erasDialog = document.getElementById('erasDialog');
    this.erasGrid = document.getElementById('erasGrid');
    this.helpDialog = document.getElementById('helpDialog');
    this.loupeDialog = document.getElementById('loupeDialog');
    this.loupeStage = document.getElementById('loupeStage');
    this.loupeImg = document.getElementById('loupeImg');
    this.loupeEra = document.getElementById('loupeEra');
    this.loupeTitle = document.getElementById('loupeTitle');
    this.loupeMaker = document.getElementById('loupeMaker');
    this.loupeCollected = document.getElementById('loupeCollected');
    this.loupeMaterials = document.getElementById('loupeMaterials');
    this.loupeStory = document.getElementById('loupeStory');
    this.loupeArchiveLink = document.getElementById('loupeArchiveLink');
    this.loupePanHint = document.getElementById('loupePanHint');
    this.loupeRarity = document.getElementById('loupeRarity');
    this.loupeValue = document.getElementById('loupeValue');
    this.loupePinBtn = document.getElementById('loupePinBtn');
    this.vaultCountStat = document.getElementById('vaultCountStat');
    this.vaultValueStat = document.getElementById('vaultValueStat');
    this.vaultProgressFill = document.getElementById('vaultProgressFill');
    this.showcaseSlots = document.getElementById('showcaseSlots');
    this.acquireToast = document.getElementById('acquireToast');
    this.acquireToastImg = document.getElementById('acquireToastImg');
    this.acquireToastKicker = document.getElementById('acquireToastKicker');
    this.acquireToastTitle = document.getElementById('acquireToastTitle');
    this.muteBtn = document.getElementById('muteBtn');
    this.soundOnIcon = document.getElementById('soundOnIcon');
    this.soundOffIcon = document.getElementById('soundOffIcon');

    // Persistent stats
    this.bestScore = Number(localStorage.getItem('jq_best_score') || 0);
    this.collectionCounts = JSON.parse(localStorage.getItem('jq_collection') || '{}');
    this.stageStars = JSON.parse(localStorage.getItem('jq_stage_stars') || '{}');
    this.showcaseIds = JSON.parse(localStorage.getItem('jq_showcase') || '[]');
    this.vaultFilter = 'all';
    this.acquireToastTimer = null;

    // Runtime state
    this.stageNum = 1;
    this.stageCfg = getStageConfig(1);
    this.grid = [];
    this.gilded = new Set();
    this.gildedTotal = 0;
    this.collectedGoal = 0;
    this.score = 0;
    this.moves = 18;
    this.feverMoves = 0;
    this.isBusy = false;
    this.stageEnded = false;
    this.nextUid = 1;
    this.selected = null;
    this.dragState = null;
    this.hintTimer = null;
    this.hintCoords = [];

    // GPU WebGL Gallery Light-Field, FX & Vault Draw systems
    this.ambient = new WebGLGallery(document.getElementById('ambientCanvas'));
    this.fx = new ParticleFX(document.getElementById('fxCanvas'));
    this.loupeState = { list: [], index: 0, zoom: 1, panX: 0, panY: 0, dragging: false };
    this.longPressTimer = null;
    this._startAmbientGlints();
    this.slot = new RoyalSlotBar({
      reelEls: [
        document.getElementById('reel0'),
        document.getElementById('reel1'),
        document.getElementById('reel2')
      ],
      spinBtn: document.getElementById('spinBtn'),
      meterFill: document.getElementById('spinMeterFill'),
      meterLabel: document.getElementById('spinBtnLabel'),
      bannerEl: document.getElementById('slotBanner'),
      onReward: (outcome) => this._applySlotReward(outcome)
    });

    this._buildCellWells();
    this._bindEvents();
    this._bindAccountAndShareEvents();
    this._syncMuteIcon();
    this.bestScoreVal.textContent = this.bestScore.toLocaleString();

    this.tutorial = new GalleryTutorial(this);
    this.lastShareData = null;

    this.auth = new CollectorAuth({
      onStateChange: (st) => this._syncAccountUI(st),
      onCloudMerged: (cloud) => this._mergeCloudProgress(cloud)
    });
    this.auth.init();

    this._checkViralInviteBanner();
    this.startStage(1, { skipTutorialCheck: true });

    if (this.tutorial.shouldAutoStart()) {
      this.tutorial.start(false);
    }
  }

  _buildMarqueeBulbs() {
    const bulbs = [];
    const perSide = 7;
    // Top edge
    for (let i = 0; i < perSide; i++) {
      bulbs.push({ left: `${(i + 0.5) * (100 / perSide)}%`, top: '6px' });
    }
    // Right edge
    for (let i = 0; i < perSide; i++) {
      bulbs.push({ left: 'calc(100% - 6px)', top: `${(i + 0.5) * (100 / perSide)}%` });
    }
    // Bottom edge
    for (let i = perSide - 1; i >= 0; i--) {
      bulbs.push({ left: `${(i + 0.5) * (100 / perSide)}%`, top: 'calc(100% - 6px)' });
    }
    // Left edge
    for (let i = perSide - 1; i >= 0; i--) {
      bulbs.push({ left: '6px', top: `${(i + 0.5) * (100 / perSide)}%` });
    }
    this.marqueeBulbs.innerHTML = bulbs
      .map(
        (b, idx) =>
          `<span class="bulb" style="left:${b.left};top:${b.top};--i:${idx}"></span>`
      )
      .join('');
  }

  _buildCellWells() {
    const frag = document.createDocumentFragment();
    this.wellEls = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      const row = [];
      for (let c = 0; c < BOARD_SIZE; c++) {
        const div = document.createElement('div');
        div.className = `cell-well ${(r + c) % 2 === 1 ? 'alt' : ''}`;
        frag.appendChild(div);
        row.push(div);
      }
      this.wellEls.push(row);
    }
    this.boardCells.appendChild(frag);
  }

  _bindEvents() {
    // Resize FX canvas cleanly
    const ro = new ResizeObserver(() => this.fx.resize());
    ro.observe(this.boardStage);

    // Pointer swipe, tap & keyboard handling on the board
    this.boardTiles.addEventListener('pointerdown', (e) => this._onPointerDown(e));
    this.boardTiles.addEventListener('keydown', (e) => this._onBoardKeyDown(e));
    window.addEventListener('pointermove', (e) => this._onPointerMove(e));
    window.addEventListener('pointerup', () => this._onPointerUp());
    window.addEventListener('pointercancel', () => this._onPointerUp());

    // Royal Bonus Slot Spin
    document.getElementById('spinBtn').addEventListener('click', () => {
      audio.unlock();
      if (this.isBusy || this.stageEnded || !this.slot.isReady()) return;
      this._triggerRoyalSpin();
    });

    // Header & Footer controls
    this.muteBtn.addEventListener('click', () => {
      audio.toggleMute();
      this._syncMuteIcon();
    });

    document.getElementById('helpBtn').addEventListener('click', () => {
      audio.playSelect();
      this.helpDialog.showModal();
    });
    document.getElementById('closeHelpBtn').addEventListener('click', () => {
      audio.playSelect();
      this.helpDialog.close();
    });
    this.helpDialog.addEventListener('click', (e) => {
      if (e.target === this.helpDialog) this.helpDialog.close();
    });

    const openEras = () => {
      audio.playSelect();
      this._renderErasModal();
      this.erasDialog.showModal();
    };
    document.getElementById('eraPickerBtn').addEventListener('click', openEras);
    document.getElementById('erasBtn').addEventListener('click', openEras);
    document.getElementById('closeErasBtn').addEventListener('click', () => {
      this.erasDialog.close();
    });
    this.erasDialog.addEventListener('click', (e) => {
      if (e.target === this.erasDialog) this.erasDialog.close();
    });

    const openLookbook = () => {
      audio.playSelect();
      this.tutorial?.onLoupeOrCollectionOpened();
      this._renderLookbook();
      this.lookbookDialog.showModal();
    };
    document.getElementById('lookbookBtn').addEventListener('click', openLookbook);
    document.getElementById('footerLoupeBtn').addEventListener('click', () => {
      audio.playSelect();
      const eraIds = this._activeJewelPool().map((j) => j.id);
      this.openLoupe(eraIds[0] || 'tiara', [...eraIds, 'tiara']);
    });
    this._bindLoupeControls();

    // Right-click any board jewel on desktop to inspect it in the Loupe!
    this.boardTiles.addEventListener('contextmenu', (e) => {
      const tile = this._tileFromEvent(e);
      if (!tile) return;
      e.preventDefault();
      this._cancelLongPress();
      const id = tile.special === 'tiara' ? 'tiara' : tile.type;
      const eraIds = [...this._activeJewelPool().map((j) => j.id), 'tiara'];
      this.openLoupe(id, eraIds);
    });

    // Click Goal jewel icon or 3-reel slot window to inspect that piece!
    this.goalDisplay.addEventListener('click', () => {
      if (this.stageCfg.goal.type === 'collect') {
        const eraIds = [...this._activeJewelPool().map((j) => j.id), 'tiara'];
        this.openLoupe(this.stageCfg.goal.jewelId, eraIds);
      }
    });
    document.getElementById('closeLookbookBtn').addEventListener('click', () => {
      this.lookbookDialog.close();
    });
    document.getElementById('vaultFilters').addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      audio.playSelect();
      this.vaultFilter = btn.dataset.filter;
      document.querySelectorAll('#vaultFilters .filter-pill').forEach((p) => {
        const active = p === btn;
        p.classList.toggle('is-active', active);
        p.setAttribute('aria-selected', String(active));
      });
      this._renderLookbook();
    });
    this.lookbookDialog.addEventListener('click', (e) => {
      if (e.target === this.lookbookDialog) this.lookbookDialog.close();
    });

    // Result modal buttons
    this.resultPrimaryBtn.addEventListener('click', () => {
      audio.playSelect();
      this.resultDialog.close();
      if (this.lastStageWon) {
        this.startStage(this.stageNum + 1);
      } else {
        this.startStage(this.stageNum);
      }
    });
    this.resultSecondaryBtn.addEventListener('click', () => {
      audio.playSelect();
      this.resultDialog.close();
      if (this.lastStageWon) {
        this.startStage(this.stageNum);
      } else {
        this._renderErasModal();
        this.erasDialog.showModal();
      }
    });
  }

  _syncMuteIcon() {
    this.soundOnIcon.hidden = audio.muted;
    this.soundOffIcon.hidden = !audio.muted;
    this.muteBtn.setAttribute('aria-pressed', String(audio.muted));
    this.muteBtn.setAttribute('aria-label', audio.muted ? 'Unmute Sound' : 'Mute Sound');
  }

  startStage(stageNum, opts = {}) {
    if (!opts.skipTutorialCheck && this.tutorial?.active) {
      this.tutorial.finish(false);
    }
    this.stageNum = stageNum;
    this.stageCfg = getStageConfig(stageNum);
    this.score = 0;
    this.moves = this.stageCfg.moves;
    this.feverMoves = 0;
    this.collectedGoal = 0;
    this.isBusy = false;
    this.stageEnded = false;
    this.selected = null;
    this._clearHint();

    // Setup gilded velvet showcase tiles
    this.gilded.clear();
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        this.wellEls[r][c].classList.remove('is-gilded');
      }
    }
    for (const [r, c] of this.stageCfg.gildedTiles) {
      this.gilded.add(keyOf(r, c));
      this.wellEls[r][c].classList.add('is-gilded');
    }
    this.gildedTotal = this.gilded.size;

    // Apply bespoke era velvet palette, living chandelier mood & header metadata
    const eraId = this.stageCfg.eraId || 'art-nouveau';
    document.body.dataset.era = eraId;
    this.ambient.setEra(eraId);
    const designersText = this.stageCfg.designers.join(' · ');
    this.stageSubtitle.textContent = `${this.stageCfg.decade} · ${this.stageCfg.title}`;
    this.designerLine.textContent = designersText;

    // Show a faster first-move hint on Turn 1 so players immediately feel the swap mechanic!
    this.isFirstMove = this.stageNum === 1;

    // Fresh Vault Draw ready on every exhibition stage (using this era's curated jewels!)
    const activePool = this._activeJewelPool();
    this.slot.setEraJewels(activePool);
    this.slot.setCharge(100);
    this.slot.setBanner(`${this.stageCfg.decade.toUpperCase()} · VAULT DRAW READY`, true);

    this._updateFeverUI();
    this._updateHUD();

    // Generate guaranteed playable initial board
    this._generateInitialBoard();
    this._scheduleHint();
  }

  _activeJewelPool() {
    if (Array.isArray(this.stageCfg.jewels) && this.stageCfg.jewels.length) {
      return this.stageCfg.jewels.map((id) => JEWEL_MAP[id]).filter(Boolean);
    }
    return JEWELS.slice(0, this.stageCfg.jewelCount || 6);
  }

  _randomJewelId(excludeIds = []) {
    const pool = this._activeJewelPool().filter((j) => !excludeIds.includes(j.id));
    const chosen = pool[Math.floor(Math.random() * pool.length)] || JEWELS[0];
    return chosen.id;
  }

  _generateInitialBoard() {
    this.boardTiles.innerHTML = '';
    let attempts = 0;
    do {
      attempts++;
      this.grid = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const forbidden = [];
          if (c >= 2 && this.grid[r][c - 1].type === this.grid[r][c - 2].type) {
            forbidden.push(this.grid[r][c - 1].type);
          }
          if (r >= 2 && this.grid[r - 1][c].type === this.grid[r - 2][c].type) {
            forbidden.push(this.grid[r - 1][c].type);
          }
          const id = this._randomJewelId(forbidden);
          this.grid[r][c] = this._createTileObj(id, r, c, null);
        }
      }
    } while (!this._findValidMove() && attempts < 20);

    // Mount all DOM tiles with crisp staggered entrance drop
    const frag = document.createDocumentFragment();
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const tile = this.grid[r][c];
        const el = this._createTileElement(tile);
        tile.el = el;
        this._positionTileEl(el, r - 1.5, c, false);
        frag.appendChild(el);
      }
    }
    this.boardTiles.appendChild(frag);
    void this.boardTiles.offsetHeight;

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const tile = this.grid[r][c];
        tile.el.classList.add('is-falling');
        this._positionTileEl(tile.el, r, c, true);
      }
    }
  }

  _loadFixedBoard(layout) {
    this.boardTiles.innerHTML = '';
    this.grid = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
    const frag = document.createDocumentFragment();
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const tile = this._createTileObj(layout[r][c], r, c, null);
        this.grid[r][c] = tile;
        const el = this._createTileElement(tile);
        tile.el = el;
        this._positionTileEl(el, r, c, false);
        frag.appendChild(el);
      }
    }
    this.boardTiles.appendChild(frag);
  }

  _createTileObj(type, r, c, special = null) {
    return {
      uid: this.nextUid++,
      type,
      r,
      c,
      special, // null | 'line-h' | 'line-v' | 'bomb' | 'tiara'
      el: null
    };
  }

  _createTileElement(tile) {
    const el = document.createElement('div');
    el.className = 'jewel-tile';
    el.dataset.uid = String(tile.uid);
    el.setAttribute('role', 'button');
    el.setAttribute('aria-pressed', 'false');
    el.tabIndex = tile.r === 0 && tile.c === 0 ? 0 : -1;
    const inner = document.createElement('div');
    inner.className = 'jewel-inner';
    const img = document.createElement('img');
    img.className = 'jewel-img';
    img.draggable = false;
    inner.appendChild(img);
    el.appendChild(inner);
    this._syncTileVisual(tile, el);
    return el;
  }

  _syncTileVisual(tile, el = tile.el) {
    if (!el) return;
    const img = el.querySelector('.jewel-img');
    let labelName = '';
    if (tile.special === 'tiara') {
      el.dataset.special = 'tiara';
      el.style.setProperty('--jewel-glow', TIARA_PIECE.glow);
      img.src = TIARA_PIECE.img;
      img.alt = TIARA_PIECE.name;
      labelName = `${TIARA_PIECE.name} (Royal Tiara Wild)`;
    } else {
      const meta = JEWEL_MAP[tile.type] || JEWELS[0];
      if (tile.special) el.dataset.special = tile.special;
      else delete el.dataset.special;
      el.style.setProperty('--jewel-glow', meta.glow);
      img.src = meta.img;
      img.alt = meta.name;
      const specLabel =
        tile.special === 'bomb'
          ? ' (Aura Burst)'
          : tile.special === 'line-h' || tile.special === 'line-v'
            ? ' (Light Beam)'
            : '';
      labelName = `${meta.name}${specLabel}`;
    }
    el.setAttribute('aria-label', `Row ${tile.r + 1} Column ${tile.c + 1}: ${labelName}`);
  }

  _focusTileAt(r, c) {
    if (!inBounds(r, c)) return;
    const target = this.grid[r]?.[c];
    if (!target?.el) return;
    this.boardTiles.querySelectorAll('.jewel-tile[tabindex="0"]').forEach((t) => {
      t.tabIndex = -1;
    });
    target.el.tabIndex = 0;
    target.el.focus();
  }

  _onBoardKeyDown(e) {
    const tile = this._tileFromEvent(e);
    if (!tile || this.isBusy || this.stageEnded) return;
    const dirs = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1]
    };
    if (dirs[e.key]) {
      e.preventDefault();
      const [dr, dc] = dirs[e.key];
      const nr = tile.r + dr;
      const nc = tile.c + dc;
      if (!inBounds(nr, nc)) return;
      if (this.selected && this.selected === tile) {
        audio.unlock();
        const sr = tile.r;
        const sc = tile.c;
        this._setSelected(null);
        this._attemptSwap(sr, sc, nr, nc);
        setTimeout(() => this._focusTileAt(nr, nc), 240);
      } else {
        this._focusTileAt(nr, nc);
      }
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      audio.unlock();
      if (!this.selected) {
        audio.playSelect();
        this._setSelected(tile);
      } else if (this.selected === tile) {
        this._setSelected(null);
      } else if (Math.abs(this.selected.r - tile.r) + Math.abs(this.selected.c - tile.c) === 1) {
        const sr = this.selected.r;
        const sc = this.selected.c;
        this._setSelected(null);
        this._attemptSwap(sr, sc, tile.r, tile.c);
      } else {
        audio.playSelect();
        this._setSelected(tile);
      }
      return;
    }
    if (e.key === 'Escape' && this.selected) {
      e.preventDefault();
      this._setSelected(null);
      return;
    }
    if (e.key === 'i' || e.key === 'I') {
      e.preventDefault();
      const id = tile.special === 'tiara' ? 'tiara' : tile.type;
      const eraIds = [...this._activeJewelPool().map((j) => j.id), 'tiara'];
      this.openLoupe(id, eraIds);
    }
  }

  _positionTileEl(el, r, c, smooth = true) {
    if (!el) return;
    if (!smooth) {
      el.style.transition = 'none';
      el.style.transform = `translate3d(${c * 100}%, ${r * 100}%, 0)`;
      void el.offsetWidth;
      el.style.transition = '';
    } else {
      el.style.transform = `translate3d(${c * 100}%, ${r * 100}%, 0)`;
    }
  }

  _cellCenterPx(r, c) {
    const rect = this.boardTiles.getBoundingClientRect();
    const cellW = rect.width / BOARD_SIZE;
    const cellH = rect.height / BOARD_SIZE;
    return {
      x: 4 + (c + 0.5) * cellW,
      y: 4 + (r + 0.5) * cellH
    };
  }

  // Pointer & Touch Gestures (both swipe-to-swap and tap-to-swap)
  _tileFromEvent(e) {
    const tileEl = e.target.closest('.jewel-tile');
    if (!tileEl) return null;
    const uid = Number(tileEl.dataset.uid);
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (this.grid[r][c] && this.grid[r][c].uid === uid) {
          return this.grid[r][c];
        }
      }
    }
    return null;
  }

  _onPointerDown(e) {
    audio.unlock();
    if (this.isBusy || this.stageEnded || e.button === 2) return;
    const tile = this._tileFromEvent(e);
    if (!tile) return;

    this._clearHint();
    this._cancelLongPress();
    this.dragState = {
      tile,
      startX: e.clientX,
      startY: e.clientY,
      swiped: false
    };

    // Long-press (440ms) opens the interactive 3x Jeweler's Loupe on this jewel!
    this.longPressTimer = setTimeout(() => {
      if (this.dragState && !this.dragState.swiped && !this.isBusy) {
        const id = tile.special === 'tiara' ? 'tiara' : tile.type;
        const eraIds = [...this._activeJewelPool().map((j) => j.id), 'tiara'];
        this._setSelected(null);
        this.dragState = null;
        vibrate(18);
        this.openLoupe(id, eraIds);
      }
    }, 440);

    if (this.selected) {
      const prev = this.selected;
      if (prev.uid === tile.uid) {
        this._setSelected(null);
        return;
      }
      const dist = Math.abs(prev.r - tile.r) + Math.abs(prev.c - tile.c);
      if (dist === 1) {
        this._cancelLongPress();
        this._setSelected(null);
        this.dragState = null;
        this._attemptSwap(prev.r, prev.c, tile.r, tile.c);
        return;
      }
    }
    audio.playSelect();
    this._setSelected(tile);
  }

  _onPointerMove(e) {
    if (!this.dragState || this.dragState.swiped || this.isBusy || this.stageEnded) return;
    const dx = e.clientX - this.dragState.startX;
    const dy = e.clientY - this.dragState.startY;
    if (Math.hypot(dx, dy) > 10) {
      this._cancelLongPress();
    }
    const threshold = 18;
    if (Math.hypot(dx, dy) < threshold) return;

    let dr = 0;
    let dc = 0;
    if (Math.abs(dx) > Math.abs(dy)) dc = dx > 0 ? 1 : -1;
    else dr = dy > 0 ? 1 : -1;

    const { r, c } = this.dragState.tile;
    const nr = r + dr;
    const nc = c + dc;
    this.dragState.swiped = true;
    this._setSelected(null);
    if (inBounds(nr, nc)) {
      this._attemptSwap(r, c, nr, nc);
    }
  }

  _onPointerUp() {
    this._cancelLongPress();
    this.dragState = null;
  }

  _cancelLongPress() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  _setSelected(tile) {
    if (this.selected && this.selected.el) {
      this.selected.el.classList.remove('is-selected');
      this.selected.el.setAttribute('aria-pressed', 'false');
    }
    this.selected = tile;
    if (tile && tile.el) {
      tile.el.classList.add('is-selected');
      tile.el.setAttribute('aria-pressed', 'true');
    }
  }

  async _attemptSwap(r1, c1, r2, c2) {
    if (this.isBusy || this.stageEnded) return;
    this.isBusy = true;
    this._clearHint();

    const a = this.grid[r1][c1];
    const b = this.grid[r2][c2];
    if (!a || !b) {
      this.isBusy = false;
      return;
    }

    audio.playSwap();
    this._swapInGrid(r1, c1, r2, c2);
    await sleep(220);

    // Check special + special or tiara combos first!
    const isSpecialCombo =
      a.special === 'tiara' ||
      b.special === 'tiara' ||
      (a.special && b.special);

    if (isSpecialCombo) {
      this._consumeMove();
      await this._executeSpecialCombo(a, b);
      await this._collapseAndCascade(2);
      await this._finishTurn();
      return;
    }

    const matches = this._findMatchGroups();
    if (matches.length === 0) {
      // Invalid swap — bounce back cleanly
      audio.playInvalid();
      vibrate(18);
      this._swapInGrid(r1, c1, r2, c2);
      await sleep(210);
      this.isBusy = false;
      this._scheduleHint();
      return;
    }

    this._consumeMove();
    await this._resolveMatches(matches, 1, { r1, c1, r2, c2 });
    await this._collapseAndCascade(2);
    await this._finishTurn();
  }

  _swapInGrid(r1, c1, r2, c2) {
    const a = this.grid[r1][c1];
    const b = this.grid[r2][c2];
    this.grid[r1][c1] = b;
    this.grid[r2][c2] = a;
    if (a) {
      a.r = r2;
      a.c = c2;
      a.el.classList.remove('is-falling');
      this._positionTileEl(a.el, r2, c2, true);
    }
    if (b) {
      b.r = r1;
      b.c = c1;
      b.el.classList.remove('is-falling');
      this._positionTileEl(b.el, r1, c1, true);
    }
  }

  _consumeMove() {
    this.isFirstMove = false;
    this.moves = Math.max(0, this.moves - 1);
    this._updateHUD();
  }

  _scoreMultiplier(cascadeStep = 1) {
    const feverMult = this.feverMoves > 0 ? 3 : 1;
    return feverMult * (1 + (cascadeStep - 1) * 0.5);
  }

  // Match-3 / 4 / 5 / L / T Detection
  _findMatchGroups() {
    const hRuns = [];
    const vRuns = [];

    for (let r = 0; r < BOARD_SIZE; r++) {
      let c = 0;
      while (c < BOARD_SIZE) {
        const t = this.grid[r][c];
        if (!t || t.special === 'tiara') {
          c++;
          continue;
        }
        let end = c + 1;
        while (
          end < BOARD_SIZE &&
          this.grid[r][end] &&
          this.grid[r][end].special !== 'tiara' &&
          this.grid[r][end].type === t.type
        ) {
          end++;
        }
        if (end - c >= 3) {
          const cells = [];
          for (let k = c; k < end; k++) cells.push([r, k]);
          hRuns.push({ type: t.type, dir: 'h', cells });
        }
        c = end;
      }
    }

    for (let c = 0; c < BOARD_SIZE; c++) {
      let r = 0;
      while (r < BOARD_SIZE) {
        const t = this.grid[r][c];
        if (!t || t.special === 'tiara') {
          r++;
          continue;
        }
        let end = r + 1;
        while (
          end < BOARD_SIZE &&
          this.grid[end][c] &&
          this.grid[end][c].special !== 'tiara' &&
          this.grid[end][c].type === t.type
        ) {
          end++;
        }
        if (end - r >= 3) {
          const cells = [];
          for (let k = r; k < end; k++) cells.push([k, c]);
          vRuns.push({ type: t.type, dir: 'v', cells });
        }
        r = end;
      }
    }

    // Merge intersecting runs of the same jewel type into connected groups
    const allRuns = [...hRuns, ...vRuns];
    const used = new Array(allRuns.length).fill(false);
    const groups = [];

    for (let i = 0; i < allRuns.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      const cluster = [allRuns[i]];
      const cellSet = new Set(allRuns[i].cells.map(([r, c]) => keyOf(r, c)));
      let expanded = true;

      while (expanded) {
        expanded = false;
        for (let j = 0; j < allRuns.length; j++) {
          if (used[j] || allRuns[j].type !== allRuns[i].type) continue;
          if (allRuns[j].cells.some(([r, c]) => cellSet.has(keyOf(r, c)))) {
            used[j] = true;
            cluster.push(allRuns[j]);
            allRuns[j].cells.forEach(([r, c]) => cellSet.add(keyOf(r, c)));
            expanded = true;
          }
        }
      }

      const hasH = cluster.some((run) => run.dir === 'h');
      const hasV = cluster.some((run) => run.dir === 'v');
      const maxLen = Math.max(...cluster.map((run) => run.cells.length));
      const cells = Array.from(cellSet).map((k) => k.split(',').map(Number));

      let spawnSpecial = null;
      if (maxLen >= 5) {
        spawnSpecial = 'tiara';
      } else if (hasH && hasV) {
        spawnSpecial = 'bomb';
      } else if (maxLen === 4) {
        spawnSpecial = cluster[0].dir === 'h' ? 'line-v' : 'line-h';
      }

      groups.push({ type: allRuns[i].type, cells, spawnSpecial });
    }

    return groups;
  }

  async _resolveMatches(groups, cascadeStep, swappedHint = null) {
    const toClear = new Set();
    const spawns = []; // { r, c, type, special }

    for (const g of groups) {
      let anchor = g.cells[Math.floor(g.cells.length / 2)];
      if (swappedHint) {
        const hit = g.cells.find(
          ([r, c]) =>
            (r === swappedHint.r1 && c === swappedHint.c1) ||
            (r === swappedHint.r2 && c === swappedHint.c2)
        );
        if (hit) anchor = hit;
      }
      for (const [r, c] of g.cells) {
        toClear.add(keyOf(r, c));
      }
      if (g.spawnSpecial) {
        spawns.push({
          r: anchor[0],
          c: anchor[1],
          type: g.type,
          special: g.spawnSpecial
        });
      }
    }

    await this._clearCellsWithChainReactions(toClear, spawns, cascadeStep);
  }

  async _executeSpecialCombo(a, b) {
    const toClear = new Set();
    const center = this._cellCenterPx(b.r, b.c);

    // 1. Tiara + Tiara = ROYAL FLUSH (entire board supernova!)
    if (a.special === 'tiara' && b.special === 'tiara') {
      audio.playSpecial('tiara');
      vibrate([35, 30, 50]);
      this._shakeBoard();
      this.fx.shockwave(center.x, center.y, '#ffe074', 240);
      this.fx.coinShower(34);
      this.fx.popup(center.x, center.y, 'ROYAL FLUSH!', { color: '#fff3a8', big: true, scale: 1.15 });
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) toClear.add(keyOf(r, c));
      }
      await this._clearCellsWithChainReactions(toClear, [], 3);
      return;
    }

    // 2. Tiara + Regular or Special Jewel
    if (a.special === 'tiara' || b.special === 'tiara') {
      const tiaraTile = a.special === 'tiara' ? a : b;
      const other = a.special === 'tiara' ? b : a;
      const targetType = other.type;
      const upgradeSpecial = other.special; // if swapped with bomb/line!
      const tPos = this._cellCenterPx(tiaraTile.r, tiaraTile.c);

      audio.playSpecial('tiara');
      vibrate([25, 25, 40]);
      this._shakeBoard();
      this.fx.popup(tPos.x, tPos.y, 'CROWN SOVEREIGN!', { color: '#fff3b0', big: true });

      toClear.add(keyOf(tiaraTile.r, tiaraTile.c));
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          const cell = this.grid[r][c];
          if (cell && cell.type === targetType) {
            if (upgradeSpecial && cell.special !== 'tiara') {
              cell.special = upgradeSpecial;
              this._syncTileVisual(cell);
            }
            const p = this._cellCenterPx(r, c);
            this.fx.lightningArc(tPos.x, tPos.y, p.x, p.y);
            toClear.add(keyOf(r, c));
          }
        }
      }
      await sleep(140);
      await this._clearCellsWithChainReactions(toClear, [], 2);
      return;
    }

    // 3. Bomb + Bomb = Giant 5x5 Vault Blast
    if (a.special === 'bomb' && b.special === 'bomb') {
      audio.playSpecial('bomb');
      vibrate([30, 20, 45]);
      this._shakeBoard();
      this.fx.shockwave(center.x, center.y, '#ff77aa', 180);
      this.fx.popup(center.x, center.y, 'VAULT DETONATION!', { color: '#ffd966', big: true });
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          if (inBounds(b.r + dr, b.c + dc)) toClear.add(keyOf(b.r + dr, b.c + dc));
        }
      }
      await this._clearCellsWithChainReactions(toClear, [], 2);
      return;
    }

    // 4. Line + Bomb = Giant 3-row + 3-column Royal Cross Sweep
    if (
      (a.special === 'bomb' && (b.special === 'line-h' || b.special === 'line-v')) ||
      (b.special === 'bomb' && (a.special === 'line-h' || a.special === 'line-v'))
    ) {
      audio.playSpecial('bomb');
      audio.playSpecial('line');
      vibrate([25, 20, 35]);
      this._shakeBoard();
      this.fx.popup(center.x, center.y, 'COUTURE SWEEP!', { color: '#ffe48a', big: true });
      for (let d = -1; d <= 1; d++) {
        if (inBounds(b.r + d, b.c)) {
          const p = this._cellCenterPx(b.r + d, b.c);
          this.fx.laserBeam(p.x, p.y, 'h');
          for (let c = 0; c < BOARD_SIZE; c++) toClear.add(keyOf(b.r + d, c));
        }
        if (inBounds(b.r, b.c + d)) {
          const p = this._cellCenterPx(b.r, b.c + d);
          this.fx.laserBeam(p.x, p.y, 'v');
          for (let r = 0; r < BOARD_SIZE; r++) toClear.add(keyOf(r, b.c + d));
        }
      }
      await this._clearCellsWithChainReactions(toClear, [], 2);
      return;
    }

    // 5. Line + Line = Crisp Cross Laser Blast
    audio.playSpecial('line');
    vibrate(25);
    this._shakeBoard();
    this.fx.laserBeam(center.x, center.y, 'h');
    this.fx.laserBeam(center.x, center.y, 'v');
    for (let i = 0; i < BOARD_SIZE; i++) {
      toClear.add(keyOf(b.r, i));
      toClear.add(keyOf(i, b.c));
    }
    await this._clearCellsWithChainReactions(toClear, [], 2);
  }

  async _clearCellsWithChainReactions(initialKeys, spawns, cascadeStep) {
    const finalKeys = new Set(initialKeys);
    const processedSpecials = new Set();
    const queue = Array.from(initialKeys);

    // Expand any triggered special jewels caught in the blast!
    while (queue.length) {
      const k = queue.shift();
      if (processedSpecials.has(k)) continue;
      const [r, c] = k.split(',').map(Number);
      const tile = this.grid[r]?.[c];
      if (!tile || !tile.special) continue;
      processedSpecials.add(k);

      const pos = this._cellCenterPx(r, c);
      if (tile.special === 'line-h') {
        audio.playSpecial('line');
        this.fx.laserBeam(pos.x, pos.y, 'h');
        for (let cc = 0; cc < BOARD_SIZE; cc++) {
          const nk = keyOf(r, cc);
          if (!finalKeys.has(nk)) {
            finalKeys.add(nk);
            queue.push(nk);
          }
        }
      } else if (tile.special === 'line-v') {
        audio.playSpecial('line');
        this.fx.laserBeam(pos.x, pos.y, 'v');
        for (let rr = 0; rr < BOARD_SIZE; rr++) {
          const nk = keyOf(rr, c);
          if (!finalKeys.has(nk)) {
            finalKeys.add(nk);
            queue.push(nk);
          }
        }
      } else if (tile.special === 'bomb') {
        audio.playSpecial('bomb');
        this._shakeBoard();
        this.fx.shockwave(pos.x, pos.y, '#ffd966', 118);
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (inBounds(r + dr, c + dc)) {
              const nk = keyOf(r + dr, c + dc);
              if (!finalKeys.has(nk)) {
                finalKeys.add(nk);
                queue.push(nk);
              }
            }
          }
        }
      } else if (tile.special === 'tiara') {
        audio.playSpecial('tiara');
        const pool = this._activeJewelPool();
        const pick = pool[Math.floor(Math.random() * pool.length)].id;
        for (let rr = 0; rr < BOARD_SIZE; rr++) {
          for (let cc = 0; cc < BOARD_SIZE; cc++) {
            const cell = this.grid[rr][cc];
            if (cell && cell.type === pick) {
              const nk = keyOf(rr, cc);
              const tp = this._cellCenterPx(rr, cc);
              this.fx.lightningArc(pos.x, pos.y, tp.x, tp.y);
              if (!finalKeys.has(nk)) {
                finalKeys.add(nk);
                queue.push(nk);
              }
            }
          }
        }
      }
    }

    const spawnMap = new Map(spawns.map((s) => [keyOf(s.r, s.c), s]));
    const count = finalKeys.size;
    if (count === 0) return;

    audio.playMatch(cascadeStep, count);
    if (count >= 4 || cascadeStep >= 2) vibrate(16);

    // Points & Slot Charge
    const basePts = count * 55 + Math.max(0, count - 3) * 45 + processedSpecials.size * 120;
    const earned = Math.round(basePts * this._scoreMultiplier(cascadeStep));
    this.score += earned;
    this.slot.addCharge(count * 5.2 + (cascadeStep > 1 ? 8 : 0) + processedSpecials.size * 7);

    // Centroid for floating score popup
    let sumX = 0;
    let sumY = 0;
    let ptCount = 0;

    for (const k of finalKeys) {
      const [r, c] = k.split(',').map(Number);
      const tile = this.grid[r]?.[c];
      const pos = this._cellCenterPx(r, c);
      sumX += pos.x;
      sumY += pos.y;
      ptCount++;

      // Polish gilded velvet tile if matched on it
      if (this.gilded.has(k)) {
        this.gilded.delete(k);
        this.wellEls[r][c].classList.remove('is-gilded');
        this.fx.burst(pos.x, pos.y, '#ffe588', 16);
      }

      if (tile) {
        const meta = tile.special === 'tiara' ? TIARA_PIECE : JEWEL_MAP[tile.type];
        this.fx.burst(pos.x, pos.y, meta?.spark || '#ffe074', count >= 5 ? 14 : 10);

        // Track lifetime collection, first-time acquisition toast & stage collect goal
        const statKey = tile.special === 'tiara' ? 'tiara' : tile.type;
        const prevCount = this.collectionCounts[statKey] || 0;
        this.collectionCounts[statKey] = prevCount + 1;
        if (prevCount === 0) {
          this._announceAcquisition(statKey);
        }
        if (
          this.stageCfg.goal.type === 'collect' &&
          tile.type === this.stageCfg.goal.jewelId
        ) {
          this.collectedGoal++;
        }

        if (!spawnMap.has(k)) {
          tile.el.classList.add('is-clearing');
        }
      }
    }

    const cx = sumX / Math.max(1, ptCount);
    const cy = sumY / Math.max(1, ptCount);

    // Fire a GPU WebGL chromatic-dispersion shockwave directly from the exact match centroid!
    const stageRect = this.boardStage.getBoundingClientRect();
    const normX = (stageRect.left + cx) / Math.max(1, window.innerWidth);
    const normY = (stageRect.top + cy) / Math.max(1, window.innerHeight);
    const sampleKey = Array.from(finalKeys)[0];
    const [sr, sc] = sampleKey.split(',').map(Number);
    const sampleTile = this.grid[sr]?.[sc];
    const sampleColor = sampleTile ? JEWEL_MAP[sampleTile.type]?.color : '#c8f3ff';
    this.ambient.triggerWave(normX, normY, sampleColor, 0.55 + cascadeStep * 0.25 + (count >= 4 ? 0.3 : 0));

    const multTag = this.feverMoves > 0 ? ' (3×)' : '';
    this.fx.popup(cx, cy, `+${earned.toLocaleString()}${multTag}`, {
      color: this.feverMoves > 0 ? '#d6f4ff' : '#f5f2ed',
      scale: count >= 5 ? 1.15 : 1
    });

    if (cascadeStep >= 2 || count >= 4) {
      const phrase =
        GLAMOUR_CALLOUTS[Math.min(GLAMOUR_CALLOUTS.length - 1, cascadeStep + (count >= 5 ? 2 : -1))];
      this.fx.popup(this.fx.w / 2, Math.max(54, cy - 30), phrase, {
        color: '#e8f6ff',
        big: true
      });
      this.fx.coinShower(cascadeStep >= 3 || count >= 5 ? 18 : 8);
    }

    this._saveProgress();
    this._updateHUD();

    await sleep(205);

    // Remove cleared DOM elements & upgrade spawn anchors into Power Jewels
    for (const k of finalKeys) {
      const [r, c] = k.split(',').map(Number);
      const tile = this.grid[r]?.[c];
      if (spawnMap.has(k)) {
        const sp = spawnMap.get(k);
        if (tile) {
          tile.special = sp.special;
          tile.type = sp.type;
          tile.el.classList.remove('is-clearing');
          this._syncTileVisual(tile);
          const pos = this._cellCenterPx(r, c);
          this.fx.shockwave(pos.x, pos.y, '#ffe48a', 52);
        }
      } else {
        if (tile && tile.el) tile.el.remove();
        this.grid[r][c] = null;
      }
    }
  }

  async _collapseAndCascade(cascadeStep) {
    // 1. Drop existing jewels downward
    for (let c = 0; c < BOARD_SIZE; c++) {
      let writeRow = BOARD_SIZE - 1;
      for (let r = BOARD_SIZE - 1; r >= 0; r--) {
        const tile = this.grid[r][c];
        if (tile) {
          if (r !== writeRow) {
            this.grid[writeRow][c] = tile;
            this.grid[r][c] = null;
            tile.r = writeRow;
            tile.c = c;
            tile.el.classList.add('is-falling');
            this._positionTileEl(tile.el, writeRow, c, true);
          }
          writeRow--;
        }
      }

      // 2. Spawn fresh couture jewels above the velvet tray
      let dropOffset = 1;
      for (let r = writeRow; r >= 0; r--) {
        const id = this._randomJewelId();
        const tile = this._createTileObj(id, r, c, null);
        const el = this._createTileElement(tile);
        tile.el = el;
        this.grid[r][c] = tile;
        this._positionTileEl(el, -dropOffset, c, false);
        this.boardTiles.appendChild(el);
        void el.offsetHeight;
        el.classList.add('is-falling');
        this._positionTileEl(el, r, c, true);
        dropOffset++;
      }
    }

    await sleep(275);

    // Check for cascading matches!
    const nextMatches = this._findMatchGroups();
    if (nextMatches.length > 0) {
      await this._resolveMatches(nextMatches, cascadeStep);
      await this._collapseAndCascade(cascadeStep + 1);
    }
  }

  async _finishTurn() {
    if (this.feverMoves > 0) {
      this.feverMoves--;
      this._updateFeverUI();
    }

    // Check win condition first!
    if (this._isStageGoalMet()) {
      await this._handleStageWin();
      return;
    }

    // Check out of moves
    if (this.moves <= 0) {
      // If Royal Spin is 100% ready, give the player a dramatic automatic Last-Chance Spin!
      if (this.slot.isReady()) {
        this.slot.setBanner('LAST-CHANCE ROYAL SPIN!', true);
        await sleep(320);
        await this.slot.spin();
        if (this._isStageGoalMet()) {
          await this._handleStageWin();
          return;
        }
        if (this.moves > 0) {
          this.isBusy = false;
          this._scheduleHint();
          return;
        }
      }
      await this._handleStageFail();
      return;
    }

    // Auto-reshuffle if deadlocked
    if (!this._findValidMove()) {
      await this._reshuffleBoard();
    }

    this.isBusy = false;
    // Keep roving keyboard tabindex intact if the previous tabstop tile was cleared
    if (!this.boardTiles.querySelector('.jewel-tile[tabindex="0"]') && this.grid[0]?.[0]?.el) {
      this.grid[0][0].el.tabIndex = 0;
    }
    if (this.tutorial?.active) {
      this.tutorial.onMatchResolved(true);
    } else {
      this._scheduleHint();
    }
  }

  _isStageGoalMet() {
    const g = this.stageCfg.goal;
    if (g.type === 'gilded') {
      return this.gilded.size === 0 && this.score >= Math.round(this.stageCfg.targetScore * 0.6);
    }
    if (g.type === 'collect') {
      return this.collectedGoal >= g.count && this.score >= Math.round(this.stageCfg.targetScore * 0.65);
    }
    return this.score >= this.stageCfg.targetScore;
  }

  async _triggerRoyalSpin() {
    this.isBusy = true;
    this._clearHint();
    this._setSelected(null);
    await this.slot.spin();
    if (this._isStageGoalMet()) {
      await this._handleStageWin();
      return;
    }
    this.isBusy = false;
    // Keep roving keyboard tabindex intact if the previous tabstop tile was cleared
    if (!this.boardTiles.querySelector('.jewel-tile[tabindex="0"]') && this.grid[0]?.[0]?.el) {
      this.grid[0][0].el.tabIndex = 0;
    }
    if (this.tutorial?.active) {
      this.tutorial.onVaultDrawComplete();
    } else {
      this._scheduleHint();
    }
  }

  async _applySlotReward(outcome) {
    vibrate([20, 30, 40]);
    this.ambient.triggerWave(0.35, 0.28, '#c6f7f2', 1.15);
    setTimeout(() => this.ambient.triggerWave(0.65, 0.34, '#e4d4ff', 1.1), 160);
    this.fx.coinShower(outcome.tier === 'grand' ? 38 : 24);
    this.fx.popup(this.fx.w / 2, this.fx.h * 0.36, outcome.title, {
      color: '#ffe588',
      big: true
    });

    if (outcome.points) {
      this.score += outcome.points;
    }
    if (outcome.extraMoves) {
      this.moves += outcome.extraMoves;
    }
    if (outcome.feverMoves) {
      this.feverMoves += outcome.feverMoves;
      this._updateFeverUI();
    }

    // Upgrade random normal tiles on the board with gilded powers!
    const candidates = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const t = this.grid[r][c];
        if (t && !t.special) candidates.push(t);
      }
    }
    candidates.sort(() => Math.random() - 0.5);

    if (outcome.spawnTiara && candidates.length) {
      const target = candidates.pop();
      target.special = 'tiara';
      this._syncTileVisual(target);
      const pos = this._cellCenterPx(target.r, target.c);
      this.fx.shockwave(pos.x, pos.y, '#ffe48a', 85);
      this.fx.burst(pos.x, pos.y, '#fff5b8', 22);
    }

    for (let i = 0; i < outcome.spawnSpecials && candidates.length; i++) {
      const target = candidates.pop();
      target.special = i === 0 ? 'bomb' : Math.random() < 0.5 ? 'line-h' : 'line-v';
      this._syncTileVisual(target);
      const pos = this._cellCenterPx(target.r, target.c);
      this.fx.shockwave(pos.x, pos.y, '#ffd966', 68);
      this.fx.burst(pos.x, pos.y, '#ffe074', 16);
    }

    this._saveProgress();
    this._updateHUD();
    await sleep(420);
  }

  async _reshuffleBoard() {
    this.fx.popup(this.fx.w / 2, this.fx.h / 2, 'RESHUFFLING VAULT!', {
      color: '#ffe48a',
      big: true
    });
    audio.playSpecial('line');
    await sleep(300);

    const normalTiles = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (this.grid[r][c] && !this.grid[r][c].special) normalTiles.push(this.grid[r][c]);
      }
    }
    for (let tries = 0; tries < 25; tries++) {
      const types = normalTiles.map((t) => t.type).sort(() => Math.random() - 0.5);
      normalTiles.forEach((t, idx) => {
        t.type = types[idx];
        this._syncTileVisual(t);
      });
      if (this._findMatchGroups().length === 0 && this._findValidMove()) break;
    }
    await sleep(220);
  }

  _findValidMove() {
    // Check if any swap creates a match or involves a special combo
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const a = this.grid[r][c];
        if (!a) continue;
        for (const [dr, dc] of [[0, 1], [1, 0]]) {
          const nr = r + dr;
          const nc = c + dc;
          if (!inBounds(nr, nc)) continue;
          const b = this.grid[nr][nc];
          if (!b) continue;
          if (a.special === 'tiara' || b.special === 'tiara' || (a.special && b.special)) {
            return [[r, c], [nr, nc]];
          }
          // Temporarily swap in grid array
          this.grid[r][c] = b;
          this.grid[nr][nc] = a;
          const ok = this._hasQuickMatchAt(r, c) || this._hasQuickMatchAt(nr, nc);
          this.grid[r][c] = a;
          this.grid[nr][nc] = b;
          if (ok) return [[r, c], [nr, nc]];
        }
      }
    }
    return null;
  }

  _hasQuickMatchAt(r, c) {
    const t = this.grid[r][c];
    if (!t || t.special === 'tiara') return false;
    const type = t.type;

    let h = 1;
    for (let cc = c - 1; cc >= 0 && this.grid[r][cc]?.type === type && this.grid[r][cc]?.special !== 'tiara'; cc--) h++;
    for (let cc = c + 1; cc < BOARD_SIZE && this.grid[r][cc]?.type === type && this.grid[r][cc]?.special !== 'tiara'; cc++) h++;
    if (h >= 3) return true;

    let v = 1;
    for (let rr = r - 1; rr >= 0 && this.grid[rr][c]?.type === type && this.grid[rr][c]?.special !== 'tiara'; rr--) v++;
    for (let rr = r + 1; rr < BOARD_SIZE && this.grid[rr][c]?.type === type && this.grid[rr][c]?.special !== 'tiara'; rr++) v++;
    return v >= 3;
  }

  _scheduleHint() {
    this._clearHint();
    const delay = this.isFirstMove ? 1800 : 4200;
    this.hintTimer = setTimeout(() => {
      if (this.isBusy || this.stageEnded) return;
      const move = this._findValidMove();
      if (!move) return;
      this.hintCoords = move;
      for (const [r, c] of move) {
        this.grid[r]?.[c]?.el?.classList.add('is-hint');
      }
    }, delay);
  }

  _clearHint() {
    if (this.hintTimer) {
      clearTimeout(this.hintTimer);
      this.hintTimer = null;
    }
    for (const [r, c] of this.hintCoords) {
      this.grid[r]?.[c]?.el?.classList.remove('is-hint');
    }
    this.hintCoords = [];
  }

  _shakeBoard() {
    this.boardShell.classList.remove('is-shaking');
    void this.boardShell.offsetWidth;
    this.boardShell.classList.add('is-shaking');
  }

  _updateFeverUI() {
    const active = this.feverMoves > 0;
    this.boardShell.classList.toggle('is-fever', active);
    this.feverRibbon.hidden = !active;
    if (active) {
      this.feverCount.textContent = `${this.feverMoves} MOVES`;
    }
  }

  _updateHUD() {
    this.scoreVal.textContent = this.score.toLocaleString();
    const pct = Math.min(100, (this.score / this.stageCfg.targetScore) * 100);
    this.scoreBarFill.style.width = `${pct}%`;

    this.movesVal.textContent = String(this.moves);
    this.movesPlaque.classList.toggle('is-low', this.moves <= 5);

    const g = this.stageCfg.goal;
    if (g.type === 'gilded') {
      const done = this.gildedTotal - this.gilded.size;
      this.goalDisplay.disabled = true;
      this.goalDisplay.setAttribute('aria-label', `Showcase tiles polished: ${done} of ${this.gildedTotal}`);
      this.goalDisplay.innerHTML = `<span class="goal-tile-swatch" aria-hidden="true"></span><span class="hud-value">${done}/${this.gildedTotal}</span>`;
    } else if (g.type === 'collect') {
      const meta = JEWEL_MAP[g.jewelId];
      const shown = Math.min(this.collectedGoal, g.count);
      this.goalDisplay.disabled = false;
      this.goalDisplay.setAttribute('aria-label', `Collect ${shown} of ${g.count} ${meta.name}. Tap to inspect in Loupe.`);
      this.goalDisplay.innerHTML = `<img class="goal-icon" src="${meta.img}" alt="" aria-hidden="true" /><span class="hud-value">${shown}/${g.count}</span>`;
    } else {
      this.goalDisplay.disabled = true;
      this.goalDisplay.setAttribute('aria-label', `Score goal: ${this.stageCfg.targetScore.toLocaleString()}`);
      this.goalDisplay.innerHTML = `<span class="hud-value">${this.stageCfg.targetScore.toLocaleString()}</span>`;
    }

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.bestScoreVal.textContent = this.bestScore.toLocaleString();
    }
  }

  _saveProgress() {
    const best = Math.max(this.bestScore, this.score);
    localStorage.setItem('jq_best_score', String(best));
    localStorage.setItem('jq_collection', JSON.stringify(this.collectionCounts));
    localStorage.setItem('jq_stage_stars', JSON.stringify(this.stageStars));
    localStorage.setItem('jq_showcase', JSON.stringify(this.showcaseIds));

    if (this.auth) {
      const stats = computeVaultStats(this.collectionCounts, this.showcaseIds);
      this.auth.scheduleCloudSave({
        bestScore: best,
        estateValue: stats.totalEstate,
        ownedCount: stats.ownedCount,
        collectionCounts: this.collectionCounts,
        stageStars: this.stageStars,
        showcaseIds: this.showcaseIds
      });
    }
  }

  _mergeCloudProgress(cloud) {
    if (!cloud) return;
    if (Number(cloud.best_score) > this.bestScore) {
      this.bestScore = Number(cloud.best_score);
      this.bestScoreVal.textContent = this.bestScore.toLocaleString();
    }
    if (cloud.collection_counts && typeof cloud.collection_counts === 'object') {
      for (const [id, cnt] of Object.entries(cloud.collection_counts)) {
        this.collectionCounts[id] = Math.max(this.collectionCounts[id] || 0, Number(cnt) || 0);
      }
    }
    if (cloud.stage_stars && typeof cloud.stage_stars === 'object') {
      for (const [st, stars] of Object.entries(cloud.stage_stars)) {
        this.stageStars[st] = Math.max(this.stageStars[st] || 0, Number(stars) || 0);
      }
    }
    if (Array.isArray(cloud.showcase_ids) && cloud.showcase_ids.length && !this.showcaseIds.length) {
      this.showcaseIds = cloud.showcase_ids.slice(0, 5);
    }
    this._saveProgress();
  }

  _checkViralInviteBanner() {
    const params = new URLSearchParams(window.location.search);
    const inviter = params.get('invite');
    if (!inviter) return;
    const banner = document.getElementById('inviteBanner');
    const text = document.getElementById('inviteBannerText');
    const closeBtn = document.getElementById('closeInviteBtn');
    if (!banner || !text) return;
    const estate = Number(params.get('estate') || 0);
    const owned = Number(params.get('owned') || 0);
    const wn = (params.get('wn') || '').replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 24);
    const cleanName = inviter.slice(0, 24);
    const who = wn ? `${cleanName} (@${wn})` : cleanName;
    text.textContent =
      estate > 0
        ? `✦ ${who} invited you · Top ${formatEstateMoney(estate)} (${owned}/45 jewels)!`
        : `✦ ${who} invited you to collect 45 V&A Museum jewels!`;
    banner.hidden = false;
    closeBtn?.addEventListener('click', () => {
      banner.hidden = true;
    });
  }

  _bindAccountAndShareEvents() {
    this.accountDialog = document.getElementById('accountDialog');
    this.shareDialog = document.getElementById('shareDialog');
    this.sharePreviewImg = document.getElementById('sharePreviewImg');
    this.shareStatus = document.getElementById('shareStatus');
    this.collectorNameInput = document.getElementById('collectorNameInput');
    this.collectorWhatnotInput = document.getElementById('collectorWhatnotInput');
    this.ssoNotice = document.getElementById('ssoNotice');

    // Replay guided tutorial from How-to-Play modal
    document.getElementById('replayTutorialBtn')?.addEventListener('click', () => {
      audio.playSelect();
      this.helpDialog.close();
      this.tutorial.start(true);
    });

    // Account modal triggers
    document.getElementById('accountBtn')?.addEventListener('click', () => {
      audio.playSelect();
      this._openAccountModal();
    });
    document.getElementById('closeAccountBtn')?.addEventListener('click', () => {
      this.accountDialog.close();
    });
    this.accountDialog?.addEventListener('click', (e) => {
      if (e.target === this.accountDialog) this.accountDialog.close();
    });

    // Facebook & Google SSO buttons
    const handleSSO = async (provider) => {
      audio.playSelect();
      const res = await this.auth.signInWithProvider(provider);
      if (!res.ok && this.ssoNotice) {
        this.ssoNotice.hidden = false;
        this.ssoNotice.textContent =
          res.reason === 'not-configured'
            ? 'Facebook & Google SSO is ready — add your free Supabase URL & Publishable Key in js/supabase-config.js to turn on live Cloud Sync. You can still set your name & share your Vault Card below right now!'
            : `Sign-in paused: ${res.reason}`;
      }
    };
    document.getElementById('facebookSignInBtn')?.addEventListener('click', () => handleSSO('facebook'));
    document.getElementById('googleSignInBtn')?.addEventListener('click', () => handleSSO('google'));
    document.getElementById('signOutBtn')?.addEventListener('click', async () => {
      audio.playSelect();
      await this.auth.signOut();
    });

    // Collector Display Name & Whatnot Handle save
    document.getElementById('saveCollectorNameBtn')?.addEventListener('click', () => {
      audio.playSelect();
      this.auth.setCollectorProfile(
        this.collectorNameInput.value,
        this.collectorWhatnotInput?.value || ''
      );
      this._saveProgress();
      if (this.ssoNotice) {
        this.ssoNotice.hidden = false;
        const wn = this.auth.getWhatnotHandle();
        this.ssoNotice.textContent = wn
          ? `Saved! Your Vault Card will feature “${this.auth.getDisplayName()}” & Whatnot @${wn}.`
          : `Saved! Your Share Card will read “${this.auth.getDisplayName()}’s Private Vault”.`;
      }
    });

    // Share Vault Card triggers (from My Collection, Account modal, and Stage Complete modal)
    document.getElementById('openShareFromVaultBtn')?.addEventListener('click', () => {
      audio.playSelect();
      this.lookbookDialog.close();
      this.openShareCardModal();
    });
    document.getElementById('accountShareVaultBtn')?.addEventListener('click', () => {
      audio.playSelect();
      this.accountDialog.close();
      this.openShareCardModal();
    });
    document.getElementById('resultShareBtn')?.addEventListener('click', () => {
      audio.playSelect();
      this.resultDialog.close();
      this.openShareCardModal();
    });

    // Share modal controls
    document.getElementById('closeShareBtn')?.addEventListener('click', () => {
      this.shareDialog.close();
    });
    this.shareDialog?.addEventListener('click', (e) => {
      if (e.target === this.shareDialog) this.shareDialog.close();
    });

    document.getElementById('nativeShareBtn')?.addEventListener('click', async () => {
      audio.playSelect();
      if (!this.lastShareData) return;
      const { blob, shareText, shareUrl } = this.lastShareData;
      try {
        const file = blob ? new File([blob], 'jewel-queen-vault.png', { type: 'image/png' }) : null;
        if (navigator.share) {
          if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ title: 'JEWEL QUEEN — My Estate Vault', text: shareText, url: shareUrl, files: [file] });
            this.shareStatus.textContent = 'Shared!';
            return;
          }
          await navigator.share({ title: 'JEWEL QUEEN — My Estate Vault', text: shareText, url: shareUrl });
          this.shareStatus.textContent = 'Shared!';
          return;
        }
      } catch (err) {
        if (err?.name === 'AbortError') return;
      }
      this._downloadShareCard();
    });

    document.getElementById('downloadCardBtn')?.addEventListener('click', () => {
      audio.playSelect();
      this._downloadShareCard();
    });

    document.getElementById('shareFacebookLinkBtn')?.addEventListener('click', () => {
      audio.playSelect();
      if (!this.lastShareData) return;
      const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.lastShareData.shareUrl)}`;
      window.open(fbUrl, '_blank', 'noopener,noreferrer');
    });

    document.getElementById('copyChallengeLinkBtn')?.addEventListener('click', async () => {
      audio.playSelect();
      if (!this.lastShareData) return;
      try {
        await navigator.clipboard.writeText(`${this.lastShareData.shareText} ${this.lastShareData.shareUrl}`);
        this.shareStatus.textContent = 'Challenge link copied — paste in IG Story, Facebook or text!';
      } catch {
        this.shareStatus.textContent = this.lastShareData.shareUrl;
      }
    });
  }

  _syncAccountUI(st) {
    const avatarImg = document.getElementById('accountAvatarImg');
    const defaultIcon = document.getElementById('accountDefaultIcon');
    const syncDot = document.getElementById('accountSyncDot');
    const signedInPanel = document.getElementById('signedInPanel');
    const ssoButtons = document.getElementById('ssoButtons');
    const signedInName = document.getElementById('signedInName');
    const signedInAvatar = document.getElementById('signedInAvatar');
    const syncStatusText = document.getElementById('syncStatusText');

    if (this.collectorNameInput && !document.activeElement?.isSameNode(this.collectorNameInput)) {
      this.collectorNameInput.value = st.displayName === 'Private Collector' ? '' : st.displayName;
    }
    if (this.collectorWhatnotInput && !document.activeElement?.isSameNode(this.collectorWhatnotInput)) {
      this.collectorWhatnotInput.value = st.whatnotHandle || '';
    }

    const signedIn = Boolean(st.user);
    if (signedInPanel) signedInPanel.hidden = !signedIn;
    if (ssoButtons) ssoButtons.hidden = signedIn;
    if (syncDot) syncDot.hidden = !signedIn;

    if (signedIn && st.avatarUrl) {
      if (avatarImg) { avatarImg.src = st.avatarUrl; avatarImg.hidden = false; }
      if (defaultIcon) defaultIcon.hidden = true;
      if (signedInAvatar) { signedInAvatar.src = st.avatarUrl; signedInAvatar.hidden = false; }
    } else {
      if (avatarImg) avatarImg.hidden = true;
      if (defaultIcon) defaultIcon.hidden = false;
      if (signedInAvatar) signedInAvatar.hidden = true;
    }
    if (signedInName) signedInName.textContent = st.displayName;
    if (syncStatusText) {
      syncStatusText.textContent =
        st.syncStatus === 'syncing' ? 'Syncing Estate Vault…' : 'Cloud Vault Synced';
    }
  }

  async _openAccountModal() {
    if (this.ssoNotice) this.ssoNotice.hidden = true;
    this._syncAccountUI({
      configured: this.auth.configured,
      user: this.auth.user,
      displayName: this.auth.getDisplayName(),
      whatnotHandle: this.auth.getWhatnotHandle(),
      avatarUrl: this.auth.getAvatarUrl(),
      syncStatus: this.auth.syncStatus
    });
    this.accountDialog.showModal();

    const listEl = document.getElementById('leaderboardList');
    if (listEl && this.auth.configured) {
      listEl.innerHTML = '<p class="leaderboard-empty">Loading collectors…</p>';
      const rows = await this.auth.fetchLeaderboard(10);
      if (rows.length) {
        listEl.innerHTML = rows
          .map((r, idx) => {
            const safeName = (r.display_name || 'Collector').replace(/</g, '&lt;');
            const safeWn = (r.whatnot_handle || '').replace(/[^a-zA-Z0-9._-]/g, '');
            const wnTag = safeWn
              ? `<a class="leaderboard-wn" href="https://www.whatnot.com/user/${safeWn}" target="_blank" rel="noopener noreferrer">@${safeWn}</a>`
              : '';
            return `
              <div class="leaderboard-row">
                <span class="leaderboard-rank">${idx + 1}</span>
                <span class="leaderboard-name">${safeName}${wnTag} · ${r.owned_count || 0}/45</span>
                <span class="leaderboard-val">${formatEstateMoney(r.estate_value || 0)}</span>
              </div>`;
          })
          .join('');
      } else {
        listEl.innerHTML = '<p class="leaderboard-empty">Be the first signed-in collector on the leaderboard!</p>';
      }
    }
  }

  async openShareCardModal() {
    this.shareStatus.textContent = 'Composing museum card…';
    this.shareDialog.showModal();
    this.lastShareData = await renderVaultShareCard({
      collectorName: this.auth?.getDisplayName() || 'Private Collector',
      whatnotHandle: this.auth?.getWhatnotHandle() || '',
      bestScore: Math.max(this.bestScore, this.score),
      collectionCounts: this.collectionCounts,
      showcaseIds: this.showcaseIds
    });
    this.sharePreviewImg.src = this.lastShareData.dataUrl;
    this.shareStatus.textContent = 'Ready for Instagram Stories, Facebook & Messages.';
  }

  _downloadShareCard() {
    if (!this.lastShareData?.dataUrl) return;
    const a = document.createElement('a');
    a.href = this.lastShareData.dataUrl;
    a.download = 'jewel-queen-vault.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    this.shareStatus.textContent = 'Saved jewel-queen-vault.png — ready to post!';
  }

  async _handleStageWin() {
    this.stageEnded = true;
    this.lastStageWon = true;
    const movesBonus = this.moves * 250;
    this.score += movesBonus;

    const starCount =
      this.score >= this.stageCfg.targetScore * 1.45
        ? 3
        : this.score >= this.stageCfg.targetScore * 1.1
          ? 2
          : 1;
    const prevStars = this.stageStars[this.stageCfg.stage] || 0;
    this.stageStars[this.stageCfg.stage] = Math.max(prevStars, starCount);
    this._saveProgress();
    this._updateHUD();

    audio.playStageWin();
    this.fx.coinShower(45);
    vibrate([30, 40, 60]);
    await sleep(550);

    const stars = '★'.repeat(starCount) + '☆'.repeat(3 - starCount);
    const nextCfg = getStageConfig(this.stageNum + 1);

    this.resultKicker.textContent = `${this.stageCfg.decade.toUpperCase()} EXHIBITION COMPLETE`;
    this.resultTitle.textContent = 'JEWEL QUEEN!';
    this.resultStars.textContent = stars;
    this.resultSummary.textContent = `You curated ${this.stageCfg.title} (${this.stageCfg.designers.join(', ')}) with dazzling flair.`;
    this.resultScore.textContent = this.score.toLocaleString();
    this.resultBonus.textContent = `+${movesBonus.toLocaleString()}`;
    this.resultPrimaryBtn.textContent = `NEXT: ${nextCfg.decade.toUpperCase()} ${nextCfg.title.split(' ')[0].toUpperCase()} →`;
    this.resultSecondaryBtn.textContent = 'REPLAY THIS ERA';
    this.resultDialog.showModal();
  }

  async _handleStageFail() {
    this.stageEnded = true;
    this.lastStageWon = false;
    this._saveProgress();
    audio.playStageFail();
    await sleep(360);

    this.resultKicker.textContent = `${this.stageCfg.decade.toUpperCase()} · CURTAIN CALL`;
    this.resultTitle.textContent = 'OUT OF MOVES';
    this.resultStars.textContent = '✦ ✦ ✦';
    this.resultSummary.textContent = `So close! Goal for ${this.stageCfg.title}: ${this.stageCfg.goal.label}.`;
    this.resultScore.textContent = this.score.toLocaleString();
    this.resultBonus.textContent = `BEST ${this.bestScore.toLocaleString()}`;
    this.resultPrimaryBtn.textContent = 'TRY THIS ERA AGAIN';
    this.resultSecondaryBtn.textContent = 'TOUR ALL ERAS';
    this.resultDialog.showModal();
  }

  _tierFor(pieceId) {
    const k = pieceId === 'tiara' ? 'lavabre-tiara' : pieceId;
    return COLLECTOR_TIERS[k] || { rarity: 'classic', value: 2500 };
  }

  _homeStageFor(pieceId) {
    if (pieceId === 'tiara') return this.stageNum;
    const found = STAGES.find((st) => st.jewels && st.jewels.includes(pieceId));
    return found ? found.stage : 1;
  }

  _announceAcquisition(pieceId) {
    const piece = pieceId === 'tiara' ? TIARA_PIECE : JEWEL_MAP[pieceId];
    if (!piece) return;
    const tier = this._tierFor(pieceId);
    const rMeta = RARITY_META[tier.rarity];
    this.acquireToastImg.src = piece.img;
    this.acquireToastImg.alt = piece.name;
    this.acquireToastKicker.textContent = `✦ NEW ${rMeta.label.toUpperCase()} · ${formatEstateMoney(tier.value)}`;
    this.acquireToastTitle.textContent = piece.name;
    this.acquireToast.hidden = false;
    if (this.acquireToastTimer) clearTimeout(this.acquireToastTimer);
    this.acquireToastTimer = setTimeout(() => {
      this.acquireToast.hidden = true;
    }, 3200);
  }

  _renderLookbook() {
    const allPieces = [TIARA_PIECE, ...JEWELS];
    const allIds = allPieces.map((p) => p.id);

    // Compute Pokédex progress & total Estate Valuation!
    let ownedCount = 0;
    let totalEstate = 0;
    for (const p of allPieces) {
      const cnt = this.collectionCounts[p.id] || 0;
      if (cnt > 0) {
        ownedCount++;
        const tier = this._tierFor(p.id);
        const mastery = getMasteryRank(cnt);
        totalEstate += Math.round(tier.value * mastery.mult);
      }
    }
    this.vaultCountStat.textContent = `${ownedCount} / ${allPieces.length}`;
    this.vaultValueStat.textContent = formatEstateMoney(totalEstate);
    this.vaultProgressFill.style.width = `${Math.round((ownedCount / allPieces.length) * 100)}%`;

    // Render 5-slot Signature Lineup (Fantasy Showcase Tray)
    const validPins = this.showcaseIds.filter((id) => (this.collectionCounts[id] || 0) > 0).slice(0, 5);
    this.showcaseSlots.innerHTML = Array.from({ length: 5 }, (_, idx) => {
      const pid = validPins[idx];
      if (!pid) {
        return `<div class="showcase-slot" title="Pin a favorite from the 3× Loupe">✦</div>`;
      }
      const p = pid === 'tiara' ? TIARA_PIECE : JEWEL_MAP[pid];
      if (!p) return `<div class="showcase-slot">✦</div>`;
      return `
        <button type="button" class="showcase-slot is-filled" data-pin-open="${p.id}" title="${p.name}">
          <img src="${p.img}" alt="${p.shortName}" />
        </button>
      `;
    }).join('');
    this.showcaseSlots.querySelectorAll('[data-pin-open]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.lookbookDialog.close();
        this.openLoupe(btn.dataset.pinOpen, allIds);
      });
    });

    // Filter pieces according to active Pokédex tab
    const filtered = allPieces.filter((p) => {
      const owned = (this.collectionCounts[p.id] || 0) > 0;
      const tier = this._tierFor(p.id);
      if (this.vaultFilter === 'owned') return owned;
      if (this.vaultFilter === 'missing') return !owned;
      if (this.vaultFilter === 'grails') return tier.rarity === 'grail' || tier.rarity === 'sovereign';
      return true;
    });

    this.lookbookGrid.innerHTML = filtered
      .map((p) => {
        const count = this.collectionCounts[p.id] || 0;
        const owned = count > 0;
        const tier = this._tierFor(p.id);
        const mastery = getMasteryRank(count);
        const isPinned = validPins.includes(p.id);
        const homeStage = this._homeStageFor(p.id);
        const estVal = formatEstateMoney(Math.round(tier.value * Math.max(1, mastery.mult)));
        return `
          <article
            class="dex-card ${owned ? 'is-owned' : 'is-locked'}"
            data-jewel-id="${p.id}"
            data-rarity="${tier.rarity}"
            data-home-stage="${homeStage}"
            tabindex="0"
            role="button"
            aria-label="${owned ? `Inspect ${p.name}` : `Undiscovered piece from Stage ${homeStage}`}"
          >
            ${isPinned ? '<span class="dex-pin-mark" title="In Signature Lineup">★</span>' : ''}
            <div class="dex-card-top">
              <span class="dex-stars">${owned ? mastery.badge : '???'}</span>
              <span class="dex-count">${owned ? `×${count}` : `S${homeStage}`}</span>
            </div>
            <div class="dex-img-box">
              <img src="${p.img}" alt="${owned ? p.name : 'Undiscovered jewel'}" loading="lazy" />
            </div>
            <span class="dex-name">${owned ? p.shortName : 'Undiscovered'}</span>
            <span class="dex-val">${owned ? estVal : `Hunt Era ${homeStage} →`}</span>
          </article>
        `;
      })
      .join('');

    this.lookbookGrid.querySelectorAll('.dex-card').forEach((card) => {
      const activate = () => {
        const id = card.dataset.jewelId;
        const owned = (this.collectionCounts[id] || 0) > 0;
        audio.playSelect();
        this.lookbookDialog.close();
        if (owned) {
          this.openLoupe(id, allIds);
        } else {
          // Jump straight into the Era where this missing jewel can be hunted!
          this.startStage(Number(card.dataset.homeStage) || 1);
        }
      };
      card.addEventListener('click', activate);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate();
        }
      });
    });
  }

  _startAmbientGlints() {
    setInterval(() => {
      if (this.isBusy || this.stageEnded || !this.grid.length) return;
      const r = Math.floor(Math.random() * BOARD_SIZE);
      const c = Math.floor(Math.random() * BOARD_SIZE);
      const tile = this.grid[r]?.[c];
      if (!tile || !tile.el || tile.special) return;
      tile.el.classList.remove('is-glinting');
      void tile.el.offsetWidth;
      tile.el.classList.add('is-glinting');
      setTimeout(() => tile.el?.classList.remove('is-glinting'), 750);
    }, 1250);
  }

  _bindLoupeControls() {
    document.getElementById('closeLoupeBtn').addEventListener('click', () => {
      this.loupeDialog.close();
    });
    this.loupeDialog.addEventListener('click', (e) => {
      if (e.target === this.loupeDialog) this.loupeDialog.close();
    });

    // Zoom magnification pills (1x, 2x, 3x)
    this.loupeDialog.querySelectorAll('.zoom-pill').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        audio.playSelect();
        this._setLoupeZoom(Number(btn.dataset.zoom));
      });
    });

    // Non-drag pan buttons (WCAG 2.2 SC 2.5.7 Dragging Movements alternative)
    this.loupeDialog.querySelectorAll('.pan-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        audio.playSelect();
        this._nudgeLoupePan(btn.dataset.pan);
      });
    });

    // Keyboard shortcuts inside Loupe (1/2/3 zoom, Arrow pan when zoomed or Prev/Next when 1x)
    this.loupeDialog.addEventListener('keydown', (e) => {
      if (e.key === '1' || e.key === '2' || e.key === '3') {
        e.preventDefault();
        audio.playSelect();
        this._setLoupeZoom(Number(e.key));
      } else if (this.loupeState.zoom > 1 && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const dir = e.key.replace('Arrow', '').toLowerCase();
        this._nudgeLoupePan(dir);
      } else if (this.loupeState.zoom === 1 && e.key === 'ArrowLeft') {
        e.preventDefault();
        document.getElementById('loupePrevBtn')?.click();
      } else if (this.loupeState.zoom === 1 && e.key === 'ArrowRight') {
        e.preventDefault();
        document.getElementById('loupeNextBtn')?.click();
      }
    });

    // Tap photo stage to cycle zoom (1x -> 2x -> 3x -> 1x) when not dragging
    let startX = 0;
    let startY = 0;
    let moved = false;

    this.loupeStage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.zoom-pill')) return;
      this.loupeStage.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;
      moved = false;
      if (this.loupeState.zoom > 1) {
        this.loupeState.dragging = true;
        this.loupeState.origPanX = this.loupeState.panX;
        this.loupeState.origPanY = this.loupeState.panY;
        this.loupeStage.classList.add('is-dragging');
      }
    });

    this.loupeStage.addEventListener('pointermove', (e) => {
      if (!this.loupeState.dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.hypot(dx, dy) > 4) moved = true;
      const limit = (this.loupeState.zoom - 1) * 95;
      this.loupeState.panX = Math.max(-limit, Math.min(limit, this.loupeState.origPanX + dx));
      this.loupeState.panY = Math.max(-limit, Math.min(limit, this.loupeState.origPanY + dy));
      this._applyLoupeTransform();
    });

    const endDrag = () => {
      if (this.loupeState.dragging) {
        this.loupeState.dragging = false;
        this.loupeStage.classList.remove('is-dragging');
      }
      if (!moved) {
        const nextZoom = this.loupeState.zoom === 1 ? 2 : this.loupeState.zoom === 2 ? 3 : 1;
        audio.playSelect();
        this._setLoupeZoom(nextZoom);
      }
    };
    this.loupeStage.addEventListener('pointerup', (e) => {
      if (e.target.closest('.zoom-pill')) return;
      endDrag();
    });
    this.loupeStage.addEventListener('pointercancel', () => {
      this.loupeState.dragging = false;
      this.loupeStage.classList.remove('is-dragging');
    });

    // Prev / Next browsing across era or full museum collection
    document.getElementById('loupePrevBtn').addEventListener('click', () => {
      audio.playSelect();
      const len = this.loupeState.list.length;
      if (!len) return;
      this.loupeState.index = (this.loupeState.index - 1 + len) % len;
      this._renderLoupePiece(this.loupeState.list[this.loupeState.index]);
    });
    document.getElementById('loupeNextBtn').addEventListener('click', () => {
      audio.playSelect();
      const len = this.loupeState.list.length;
      if (!len) return;
      this.loupeState.index = (this.loupeState.index + 1) % len;
      this._renderLoupePiece(this.loupeState.list[this.loupeState.index]);
    });

    this.loupePinBtn.addEventListener('click', () => {
      const id = this.loupeState.currentId;
      if (!id || (this.collectionCounts[id] || 0) === 0) return;
      audio.playSelect();
      const idx = this.showcaseIds.indexOf(id);
      if (idx >= 0) {
        this.showcaseIds.splice(idx, 1);
      } else {
        if (this.showcaseIds.length >= 5) this.showcaseIds.shift();
        this.showcaseIds.push(id);
      }
      this._saveProgress();
      this._syncLoupePinBtn(id);
    });
  }

  _syncLoupePinBtn(pieceId) {
    const owned = (this.collectionCounts[pieceId] || 0) > 0;
    const pinned = this.showcaseIds.includes(pieceId);
    this.loupePinBtn.disabled = !owned;
    this.loupePinBtn.classList.toggle('is-pinned', pinned);
    if (!owned) {
      this.loupePinBtn.textContent = 'Match to Unlock';
    } else {
      this.loupePinBtn.textContent = pinned ? '★ In Lineup' : '☆ Pin to Lineup';
    }
  }

  openLoupe(jewelId, list = null) {
    this.tutorial?.onLoupeOrCollectionOpened();
    const browseList = list && list.length ? list : [TIARA_PIECE.id, ...JEWELS.map((j) => j.id)];
    const idx = Math.max(0, browseList.indexOf(jewelId));
    this.loupeState.list = browseList;
    this.loupeState.index = idx;
    this._renderLoupePiece(browseList[idx]);
    if (!this.loupeDialog.open) this.loupeDialog.showModal();
  }

  _renderLoupePiece(jewelId) {
    const piece = jewelId === 'tiara' ? TIARA_PIECE : JEWEL_MAP[jewelId] || JEWELS[0];
    this.loupeState.currentId = piece.id;
    const dossierKey = jewelId === 'tiara' ? 'lavabre-tiara' : piece.id;
    const dossier = MUSEUM_DOSSIERS[dossierKey];
    const tier = this._tierFor(piece.id);
    const rMeta = RARITY_META[tier.rarity];
    const count = this.collectionCounts[piece.id] || 0;
    const mastery = getMasteryRank(count);

    this.loupeEra.textContent = piece.era.toUpperCase();
    this.loupeTitle.textContent = piece.name;
    this.loupeMaker.textContent = piece.designers;
    this.loupeCollected.textContent = count > 0 ? `${mastery.badge} · ×${count.toLocaleString()}` : 'Not Yet Acquired';
    this.loupeRarity.textContent = rMeta.label;
    this.loupeRarity.dataset.rarity = tier.rarity;
    this.loupeValue.textContent = formatEstateMoney(Math.round(tier.value * Math.max(1, mastery.mult)));
    this._syncLoupePinBtn(piece.id);
    this.loupeImg.src = dossier?.hires || piece.img;
    this.loupeImg.alt = piece.name;

    const mats = dossier?.materials || [];
    this.loupeMaterials.innerHTML = mats
      .map((m) => `<span class="material-tag">${m}</span>`)
      .join('');
    this.loupeStory.textContent = dossier?.story || piece.provenance;

    if (dossier?.archiveUrl) {
      this.loupeArchiveLink.href = dossier.archiveUrl;
      this.loupeArchiveLink.hidden = false;
    } else {
      this.loupeArchiveLink.hidden = true;
    }

    this._setLoupeZoom(1);
  }

  _nudgeLoupePan(dir) {
    if (this.loupeState.zoom <= 1) return;
    const step = 42;
    const limit = (this.loupeState.zoom - 1) * 95;
    if (dir === 'left') this.loupeState.panX = Math.min(limit, this.loupeState.panX + step);
    if (dir === 'right') this.loupeState.panX = Math.max(-limit, this.loupeState.panX - step);
    if (dir === 'up') this.loupeState.panY = Math.min(limit, this.loupeState.panY + step);
    if (dir === 'down') this.loupeState.panY = Math.max(-limit, this.loupeState.panY - step);
    this._applyLoupeTransform();
  }

  _setLoupeZoom(level) {
    this.loupeState.zoom = level;
    if (level === 1) {
      this.loupeState.panX = 0;
      this.loupeState.panY = 0;
    }
    this.loupeStage.classList.toggle('is-zoomed', level > 1);
    const panControls = document.getElementById('loupePanControls');
    if (panControls) panControls.hidden = level <= 1;
    this.loupePanHint.textContent =
      level === 1 ? 'Tap photo or 2× / 3× to zoom in' : `${level}× Loupe · Drag or use arrows to pan`;
    this.loupeDialog.querySelectorAll('.zoom-pill').forEach((btn) => {
      const active = Number(btn.dataset.zoom) === level;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    this._applyLoupeTransform();
  }

  _applyLoupeTransform() {
    const { zoom, panX, panY } = this.loupeState;
    this.loupeImg.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoom})`;
  }

  _renderErasModal() {
    this.erasGrid.innerHTML = STAGES.map((st) => {
      const jewel = JEWEL_MAP[st.signatureJewel] || JEWELS[0];
      const earned = this.stageStars[st.stage] || 0;
      const starText = earned ? '★'.repeat(earned) + '☆'.repeat(3 - earned) : '☆☆☆';
      const isCurrent = this.stageNum === st.stage;
      const tags = st.designers.map((d) => `<span class="designer-tag">${d}</span>`).join('');
      const miniTray = (st.jewels || [])
        .map((id) => JEWEL_MAP[id])
        .filter(Boolean)
        .map(
          (j) =>
            `<button type="button" class="era-jewel-btn" data-inspect-id="${j.id}" aria-label="Inspect ${j.name}" title="Tap to zoom: ${j.name}"><img src="${j.img}" alt="" aria-hidden="true" loading="lazy" /></button>`
        )
        .join('');
      return `
        <article class="era-card ${isCurrent ? 'is-active' : ''}">
          <div class="era-swatch" style="background:${st.swatch}">
            <img src="${jewel.img}" alt="${jewel.name}" loading="lazy" />
          </div>
          <div class="era-card-body">
            <div class="era-card-top">
              <span class="era-decade-pill">${st.decade} · ${st.style}</span>
              <span class="era-stars" aria-label="${earned} of 3 stars">${starText}</span>
            </div>
            <h3>${st.title}</h3>
            <div class="era-designers-row">${tags}</div>
            <p>${st.curatorNote}</p>
            <div class="era-jewels-strip" aria-label="Featured jewels in this exhibition">${miniTray}</div>
            <div class="era-card-footer">
              <span class="era-goal-tag">Goal: ${st.goal.label}</span>
              <button
                type="button"
                class="era-play-btn ${isCurrent ? 'is-current' : ''}"
                data-stage="${st.stage}"
              >
                ${isCurrent ? 'PLAYING' : 'ENTER ERA'}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    this.erasGrid.querySelectorAll('.era-play-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetStage = Number(btn.dataset.stage);
        audio.playSelect();
        this.erasDialog.close();
        this.startStage(targetStage);
      });
    });

    this.erasGrid.querySelectorAll('[data-inspect-id]').forEach((img) => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = img.dataset.inspectId;
        this.erasDialog.close();
        this.openLoupe(id);
      });
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.__jewelQueen = new JewelQueenGame();
});
