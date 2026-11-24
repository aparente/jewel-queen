/**
 * Living, breathing emotional salon atmosphere behind the Jewel Queen cabinet:
 * silky crystal-chandelier aurora waves, luminous bokeh orbs, and rising golden stardust
 * that swells and blooms with radiance on cascades and Royal Spins.
 */

const GALLERY_GOLD_PALETTE = {
  orbs: ['rgba(255, 218, 120, 0.08)', 'rgba(255, 244, 200, 0.05)', 'rgba(218, 165, 62, 0.07)'],
  motes: ['#fff7d6', '#ffe082', '#ffffff'],
  ray: 'rgba(255, 234, 174, 0.06)'
};

const ERA_PALETTES = {
  'art-nouveau': GALLERY_GOLD_PALETTE,
  chinoiserie: GALLERY_GOLD_PALETTE,
  'mayan-egyptian': GALLERY_GOLD_PALETTE,
  bakelite: GALLERY_GOLD_PALETTE,
  'golden-age': GALLERY_GOLD_PALETTE,
  'mid-century': GALLERY_GOLD_PALETTE,
  'paris-runway': GALLERY_GOLD_PALETTE,
  'power-80s': GALLERY_GOLD_PALETTE
};

export class AmbientSalon {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.palette = ERA_PALETTES['art-nouveau'];
    this.bloom = 0; // Swells emotionally on cascades & Royal Spins!
    this.orbs = [];
    this.motes = [];
    this.time = 0;
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
    this.palette = ERA_PALETTES[eraId] || ERA_PALETTES['bakelite'];
    this.orbs.forEach((o, i) => {
      o.color = this.palette.orbs[i % this.palette.orbs.length];
    });
    this.motes.forEach((m, i) => {
      m.color = this.palette.motes[i % this.palette.motes.length];
    });
    this.pulse(0.7);
    if (this.reducedMotion) this._drawFrame(0);
  }

  pulse(strength = 0.65) {
    this.bloom = Math.min(1.4, this.bloom + strength);
  }

  resize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.max(1, Math.round(this.w * this.dpr));
    this.canvas.height = Math.max(1, Math.round(this.h * this.dpr));
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  _seed() {
    this.orbs = Array.from({ length: 9 }, (_, i) => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      r: 70 + Math.random() * 130,
      vx: (Math.random() - 0.5) * 14,
      vy: -6 - Math.random() * 10,
      phase: Math.random() * Math.PI * 2,
      color: this.palette.orbs[i % this.palette.orbs.length]
    }));

    this.motes = Array.from({ length: 34 }, (_, i) => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      size: 1.8 + Math.random() * 4.4,
      vy: -10 - Math.random() * 20,
      drift: (Math.random() - 0.5) * 12,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: 1.6 + Math.random() * 2.8,
      isStar: i % 3 === 0,
      color: this.palette.motes[i % this.palette.motes.length]
    }));
  }

  _start() {
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      this.time += dt;
      this.bloom = Math.max(0, this.bloom - dt * 1.15);
      this._drawFrame(dt);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  _drawFrame(dt) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    // 1. Soft chandelier diagonal light rays drifting across the velvet salon
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const rayAlpha = 0.65 + this.bloom * 0.55;
    for (let i = 0; i < 3; i++) {
      const sway = Math.sin(this.time * (0.28 + i * 0.11) + i * 2.1) * 48;
      const rx = this.w * (0.2 + i * 0.32) + sway;
      const grad = ctx.createLinearGradient(rx - 90, 0, rx + 130, this.h);
      grad.addColorStop(0, this.palette.ray);
      grad.addColorStop(0.55, 'rgba(255, 245, 220, 0.04)');
      grad.addColorStop(1, 'rgba(255, 245, 220, 0)');
      ctx.globalAlpha = rayAlpha;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(rx - 55, 0);
      ctx.lineTo(rx + 65, 0);
      ctx.lineTo(rx + 210, this.h);
      ctx.lineTo(rx + 30, this.h);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Dreamy prismatic silk bokeh orbs
    for (const o of this.orbs) {
      o.x += o.vx * dt;
      o.y += o.vy * dt * (1 + this.bloom * 1.2);
      o.phase += dt * 0.8;
      if (o.y < -o.r) {
        o.y = this.h + o.r;
        o.x = Math.random() * this.w;
      }
      if (o.x < -o.r) o.x = this.w + o.r;
      if (o.x > this.w + o.r) o.x = -o.r;

      const rad = o.r * (0.92 + 0.1 * Math.sin(o.phase) + this.bloom * 0.14);
      const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, rad);
      g.addColorStop(0, o.color);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = 0.72 + this.bloom * 0.28;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(o.x, o.y, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Twinkling floating golden chandelier stardust motes
    for (const m of this.motes) {
      m.y += m.vy * dt * (1 + this.bloom * 1.8);
      m.x += Math.sin(this.time * 0.9 + m.phase) * m.drift * dt;
      if (m.y < -12) {
        m.y = this.h + 12;
        m.x = Math.random() * this.w;
      }
      const tw = 0.25 + 0.75 * Math.pow(0.5 + 0.5 * Math.sin(this.time * m.twinkleSpeed + m.phase), 2);
      const alpha = Math.min(1, tw * (0.78 + this.bloom * 0.45));
      const sz = m.size * (0.85 + tw * 0.45 + this.bloom * 0.25);

      ctx.globalAlpha = alpha;
      ctx.fillStyle = m.color;
      if (m.isStar) {
        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.beginPath();
        for (let k = 0; k < 8; k++) {
          const r = k % 2 === 0 ? sz * 1.8 : sz * 0.36;
          const a = (k * Math.PI) / 4;
          if (k === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(m.x, m.y, sz * 0.65, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
}
