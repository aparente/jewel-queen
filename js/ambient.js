/**
 * teamLab Borderless × Museum Gallery Light-Field Canvas.
 * Pure gallery-black darkness animated with delicate drifting bioluminescent light filaments,
 * gossamer floating stardust, and expanding liquid-light aura ripples that bloom emotionally
 * whenever the player matches jewels, chains cascades, or illuminates the Prism Spin.
 */

const ERA_LIGHT_HUES = {
  'art-nouveau': [186, 268, 42],
  'deco-geometric': [214, 192, 24],
  'deco-tutti-frutti': [156, 348, 224],
  'surrealist-figural': [342, 44, 192],
  'golden-age': [214, 286, 44],
  'mid-century': [178, 206, 326],
  'victorian-revival': [346, 38, 274],
  'contemporary-haute': [316, 184, 268]
};

export class AmbientSalon {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.hues = ERA_LIGHT_HUES['art-nouveau'];
    this.bloom = 0;
    this.time = 0;
    this.filaments = [];
    this.motes = [];
    this.ripples = [];
    this.resize();
    this._seed();

    if (!this.reducedMotion) {
      this._start();
    } else {
      this._drawFrame(0);
    }
    window.addEventListener('resize', () => this.resize());
  }

  setEra(eraId) {
    this.hues = ERA_LIGHT_HUES[eraId] || ERA_LIGHT_HUES['art-nouveau'];
    this.pulse(0.6);
  }

  pulse(strength = 0.65) {
    this.bloom = Math.min(1.5, this.bloom + strength);
    if (!this.reducedMotion) {
      const hue = this.hues[Math.floor(Math.random() * this.hues.length)];
      this.ripples.push({
        x: this.w * (0.28 + Math.random() * 0.44),
        y: this.h * (0.34 + Math.random() * 0.36),
        r: 24,
        maxR: Math.max(this.w, this.h) * (0.45 + strength * 0.2),
        hue,
        life: 0,
        maxLife: 1.55
      });
    }
  }

  resize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.max(1, Math.round(this.w * this.dpr));
    this.canvas.height = Math.max(1, Math.round(this.h * this.dpr));
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  _seed() {
    // Flowing teamLab-style bioluminescent light streams drifting slowly in deep space
    this.filaments = Array.from({ length: 5 }, (_, i) => ({
      yRatio: 0.14 + i * 0.19,
      amp: 28 + (i % 3) * 18,
      freq: 0.0045 + i * 0.001,
      speed: 0.22 + i * 0.07,
      phase: i * 1.4,
      hueIdx: i % 3
    }));

    // Gossamer rising light particles
    this.motes = Array.from({ length: 38 }, (_, i) => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      size: 1.1 + Math.random() * 2.4,
      vy: -7 - Math.random() * 16,
      drift: (Math.random() - 0.5) * 14,
      phase: Math.random() * Math.PI * 2,
      twinkle: 1.2 + Math.random() * 2.4,
      hueIdx: i % 3
    }));
  }

  _start() {
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      this.time += dt;
      this.bloom = Math.max(0, this.bloom - dt * 0.95);
      this._drawFrame(dt);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  _drawFrame(dt) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // 1. Ethereal drifting light filaments (whisper-subtle at rest, glowing on combos)
    const baseOpacity = 0.045 + this.bloom * 0.075;
    for (const f of this.filaments) {
      const hue = (this.hues[f.hueIdx] + Math.sin(this.time * 0.2 + f.phase) * 18 + 360) % 360;
      ctx.beginPath();
      const step = 28;
      for (let x = -step; x <= this.w + step; x += step) {
        const y =
          f.yRatio * this.h +
          Math.sin(x * f.freq + this.time * f.speed + f.phase) * f.amp +
          Math.cos(x * f.freq * 0.5 - this.time * 0.35) * 14;
        if (x === -step) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `hsla(${hue}, 82%, 78%, ${baseOpacity})`;
      ctx.lineWidth = 1.4 + this.bloom * 1.4;
      ctx.stroke();
    }

    // 2. Expanding teamLab liquid-light ripples triggered by matches & spins
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const rp = this.ripples[i];
      rp.life += dt;
      if (rp.life >= rp.maxLife) {
        this.ripples.splice(i, 1);
        continue;
      }
      const p = rp.life / rp.maxLife;
      const ease = 1 - Math.pow(1 - p, 3);
      const rad = rp.r + (rp.maxR - rp.r) * ease;
      const alpha = (1 - p) * 0.22;
      const g = ctx.createRadialGradient(rp.x, rp.y, rad * 0.68, rp.x, rp.y, rad);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(0.82, `hsla(${rp.hue}, 88%, 76%, ${alpha})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Gossamer twinkling light motes drifting upward through the gallery darkness
    for (const m of this.motes) {
      m.y += m.vy * dt * (1 + this.bloom * 2.2);
      m.x += Math.sin(this.time * 0.7 + m.phase) * m.drift * dt;
      if (m.y < -10) {
        m.y = this.h + 10;
        m.x = Math.random() * this.w;
      }
      const tw = Math.pow(0.5 + 0.5 * Math.sin(this.time * m.twinkle + m.phase), 2);
      const hue = this.hues[m.hueIdx];
      const alpha = Math.min(0.85, (0.14 + tw * 0.42) * (1 + this.bloom * 0.9));
      const sz = m.size * (0.85 + tw * 0.4 + this.bloom * 0.25);

      ctx.fillStyle = `hsla(${hue}, 65%, 88%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, sz, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
