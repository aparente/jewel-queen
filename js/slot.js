/**
 * Maximalist 3-Reel Royal Bonus Slot Marquee integrated into the Jewel Queen cabinet.
 * Uses the actual Connie Parente-inspired jewelry assets on cream-velvet gilded reels.
 */

import { JEWELS, JEWEL_MAP, TIARA_PIECE } from './data.js';
import { audio } from './audio.js';

export class RoyalSlotBar {
  constructor({ reelEls, spinBtn, meterFill, meterLabel, bannerEl, onReward }) {
    this.reelEls = reelEls;
    this.spinBtn = spinBtn;
    this.meterFill = meterFill;
    this.meterLabel = meterLabel;
    this.bannerEl = bannerEl;
    this.onReward = onReward;

    this.activeJewels = JEWELS.slice(0, 5);
    this.charge = 100; // Start every stage with a FREE Royal Spin ready!
    this.spinning = false;
    this.currentSymbols = ['ruby', 'tiara', 'pearl'];
    this._renderStatic();
  }

  setEraJewels(jewelList) {
    if (!jewelList || !jewelList.length) return;
    this.activeJewels = jewelList;
    const first = jewelList[0]?.id || 'ruby';
    const last = jewelList[1]?.id || first;
    this.currentSymbols = [first, 'tiara', last];
    this._renderStatic();
  }

  _reelPool() {
    return [...this.activeJewels, TIARA_PIECE];
  }

  _symbolById(id) {
    if (id === 'tiara') return TIARA_PIECE;
    return JEWEL_MAP[id] || this.activeJewels[0] || TIARA_PIECE;
  }

  _renderStatic() {
    this.reelEls.forEach((el, idx) => {
      const sym = this._symbolById(this.currentSymbols[idx]);
      el.innerHTML = `<div class="reel-strip"><div class="reel-item"><img src="${sym.img}" alt="${sym.shortName}" draggable="false" /></div></div>`;
    });
    this._updateUI();
  }

  setCharge(value) {
    this.charge = Math.max(0, Math.min(100, value));
    this._updateUI();
  }

  addCharge(delta) {
    if (this.spinning) return;
    const wasReady = this.charge >= 100;
    this.charge = Math.min(100, this.charge + delta);
    this._updateUI();
    if (!wasReady && this.charge >= 100) {
      this.setBanner('ROYAL SPIN READY! TAP TO PULL');
    }
  }

  isReady() {
    return this.charge >= 100 && !this.spinning;
  }

  setBanner(text, highlight = false) {
    if (!this.bannerEl) return;
    this.bannerEl.textContent = text;
    this.bannerEl.classList.toggle('is-gold', highlight);
  }

  _updateUI() {
    if (this.meterFill) {
      this.meterFill.style.width = `${Math.round(this.charge)}%`;
    }
    const ready = this.charge >= 100 && !this.spinning;
    if (this.spinBtn) {
      this.spinBtn.disabled = !ready;
      this.spinBtn.classList.toggle('is-ready', ready);
      this.spinBtn.classList.toggle('is-spinning', this.spinning);
    }
    if (this.meterLabel) {
      if (this.spinning) {
        this.meterLabel.textContent = 'DRAWING...';
      } else if (ready) {
        this.meterLabel.textContent = 'PRISM SPIN';
      } else {
        this.meterLabel.textContent = `PRISM ${Math.round(this.charge)}%`;
      }
    }
  }

  _rollOutcome() {
    const r = Math.random();
    if (r < 0.22) {
      // Grand Tiara Sovereign Draw!
      return {
        tier: 'grand',
        symbols: ['tiara', 'tiara', 'tiara'],
        title: 'Sovereign Crown Draw',
        subtitle: '+1,200 PTS · ROYAL TIARA SPAWNED',
        points: 1200,
        extraMoves: 1,
        spawnTiara: true,
        spawnSpecials: 0,
        feverMoves: 0
      };
    }
    if (r < 0.50) {
      // Triple Museum Match
      const gem = this.activeJewels[Math.floor(Math.random() * this.activeJewels.length)];
      return {
        tier: 'triple',
        symbols: [gem.id, gem.id, gem.id],
        title: `Triple ${gem.shortName}`,
        subtitle: '+650 PTS · 2 POWER JEWELS ILLUMINATED',
        points: 650,
        extraMoves: 0,
        spawnTiara: false,
        spawnSpecials: 2,
        feverMoves: 0
      };
    }
    if (r < 0.78) {
      // 3x Luminous Aura
      const gem = this.activeJewels[Math.floor(Math.random() * this.activeJewels.length)];
      return {
        tier: 'fever',
        symbols: [gem.id, 'tiara', gem.id],
        title: '3× Luminous Aura',
        subtitle: '3× SCORE FOR 4 MOVES · +2 MOVES',
        points: 400,
        extraMoves: 2,
        spawnTiara: false,
        spawnSpecials: 0,
        feverMoves: 4
      };
    }
    // Curator's Encore
    const pool = [...this.activeJewels].sort(() => Math.random() - 0.5);
    return {
      tier: 'encore',
      symbols: [pool[0].id, (pool[1] || pool[0]).id, 'tiara'],
      title: "Curator's Encore",
      subtitle: '+3 MOVES · +350 PTS · AURA BURST',
      points: 350,
      extraMoves: 3,
      spawnTiara: false,
      spawnSpecials: 1,
      feverMoves: 0
    };
  }

  async spin() {
    if (!this.isReady()) return null;
    this.spinning = true;
    this.charge = 0;
    this._updateUI();
    this.setBanner('ILLUMINATING THE PRISM CHAMBER...', true);

    const outcome = this._rollOutcome();

    // Mechanical reel ticks during spin
    const tickTimer = setInterval(() => audio.playReelTick(), 78);

    const spinPromises = this.reelEls.map((reelEl, idx) => {
      return new Promise((resolve) => {
        const finalSym = this._symbolById(outcome.symbols[idx]);
        const prevSym = this._symbolById(this.currentSymbols[idx]);
        const steps = 11 + idx * 5;
        const items = [prevSym];
        const reelPool = this._reelPool();
        for (let i = 0; i < steps - 1; i++) {
          items.push(reelPool[Math.floor(Math.random() * reelPool.length)]);
        }
        items.push(finalSym);

        const strip = document.createElement('div');
        strip.className = 'reel-strip';
        strip.innerHTML = items
          .map(
            (s) =>
              `<div class="reel-item"><img src="${s.img}" alt="${s.shortName}" draggable="false" /></div>`
          )
          .join('');
        reelEl.innerHTML = '';
        reelEl.appendChild(strip);

        const itemH = reelEl.clientHeight || 48;
        strip.style.transform = 'translateY(0px)';
        // Force reflow
        void strip.offsetHeight;

        const duration = 760 + idx * 340;
        strip.style.transition = `transform ${duration}ms cubic-bezier(0.16, 0.94, 0.28, 1.04)`;
        strip.style.transform = `translateY(-${(items.length - 1) * itemH}px)`;

        setTimeout(() => {
          audio.playReelStop(idx);
          reelEl.classList.add('reel-landed');
          setTimeout(() => reelEl.classList.remove('reel-landed'), 260);
          resolve();
        }, duration);
      });
    });

    await Promise.all(spinPromises);
    clearInterval(tickTimer);

    this.currentSymbols = outcome.symbols;
    this.spinning = false;
    this._renderStatic();
    this.setBanner(`${outcome.title} — ${outcome.subtitle}`, true);
    audio.playJackpot();

    if (this.onReward) {
      await this.onReward(outcome);
    }
    return outcome;
  }
}
