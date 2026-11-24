/**
 * Synthesized Web Audio soundscape for Jewel Queen:
 * crystalline jewelry clinks, rising harp cascade chimes,
 * mechanical brass slot-reel clicks, and maximalist jackpot fanfares.
 */

const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51, 1567.98];

class JewelAudio {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('jq_muted') === '1';
  }

  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(flag) {
    this.muted = !!flag;
    localStorage.setItem('jq_muted', this.muted ? '1' : '0');
  }

  toggleMute() {
    this.setMuted(!this.muted);
    if (!this.muted) this.playSelect();
    return this.muted;
  }

  _tone(freq, dur, type = 'sine', gainPeak = 0.12, delay = 0, slideTo = null) {
    if (this.muted) return;
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, now + dur);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(gainPeak, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  playSelect() {
    this._tone(1046.5, 0.09, 'sine', 0.08, 0, 1318.5);
    this._tone(2093, 0.07, 'triangle', 0.04, 0.01);
  }

  playSwap() {
    this._tone(420, 0.08, 'triangle', 0.07, 0, 620);
    this._tone(1280, 0.06, 'sine', 0.04, 0.02, 1480);
  }

  playInvalid() {
    this._tone(220, 0.11, 'triangle', 0.09, 0, 150);
    this._tone(175, 0.12, 'sine', 0.07, 0.07, 130);
  }

  playMatch(cascadeStep = 1, count = 3) {
    const idx = Math.min(PENTATONIC.length - 1, Math.max(0, cascadeStep - 1));
    const root = PENTATONIC[idx];
    this._tone(root, 0.24, 'triangle', 0.12, 0);
    this._tone(root * 1.25, 0.22, 'sine', 0.09, 0.045);
    this._tone(root * 1.5, 0.28, 'sine', 0.1, 0.09);
    // Crystalline diamond overtone shimmer
    this._tone(root * 3, 0.16, 'sine', 0.045, 0.06);
    if (count >= 4) {
      this._tone(root * 2, 0.32, 'triangle', 0.11, 0.13);
    }
  }

  playSpecial(kind = 'line') {
    if (kind === 'tiara') {
      [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98, 2093].forEach((f, i) => {
        this._tone(f, 0.35, 'triangle', 0.11, i * 0.045);
        this._tone(f * 2, 0.25, 'sine', 0.04, i * 0.045 + 0.02);
      });
    } else if (kind === 'bomb') {
      this._tone(140, 0.34, 'sawtooth', 0.12, 0, 48);
      this._tone(880, 0.26, 'triangle', 0.1, 0.03, 1760);
      this._tone(1320, 0.22, 'sine', 0.08, 0.08, 2200);
    } else {
      // Gold filigree laser sweep
      this._tone(587.33, 0.26, 'sawtooth', 0.07, 0, 1760);
      this._tone(1174.66, 0.24, 'sine', 0.1, 0.03, 2349.3);
    }
  }

  playReelTick() {
    this._tone(920, 0.028, 'square', 0.035, 0, 620);
  }

  playReelStop(reelIdx = 0) {
    const base = [440, 554.37, 659.25][reelIdx] || 659.25;
    this._tone(160, 0.09, 'triangle', 0.14, 0, 95);
    this._tone(base, 0.22, 'triangle', 0.11, 0.015);
    this._tone(base * 2, 0.18, 'sine', 0.055, 0.03);
  }

  playJackpot() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5, 1567.98];
    notes.forEach((f, i) => {
      const t = i * 0.075;
      this._tone(f, 0.36, 'triangle', 0.12, t);
      this._tone(f * 1.5, 0.26, 'sine', 0.055, t + 0.02);
    });
    // Coin clink shimmer tail
    for (let i = 0; i < 6; i++) {
      this._tone(2400 + i * 240, 0.09, 'sine', 0.035, 0.35 + i * 0.065);
    }
  }

  playStageWin() {
    const fanfare = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
    fanfare.forEach((f, i) => {
      this._tone(f, 0.45, 'triangle', 0.13, i * 0.09);
      this._tone(f * 2, 0.3, 'sine', 0.05, i * 0.09 + 0.03);
    });
  }

  playStageFail() {
    [440, 392, 349.23, 293.66].forEach((f, i) => {
      this._tone(f, 0.3, 'triangle', 0.1, i * 0.13);
    });
  }
}

export const audio = new JewelAudio();
