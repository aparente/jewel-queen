/**
 * High-DPI Canvas 2D maximalist FX layer:
 * faceted diamond sparkles, spinning gold coins, filigree laser sweeps,
 * starburst shockwaves, Queen Tiara lightning arcs, and floating glamour text.
 */

export class ParticleFX {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.beams = [];
    this.rings = [];
    this.arcs = [];
    this.popups = [];
    this.running = false;
    this.lastTime = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resize();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = Math.max(1, Math.round(this.w * this.dpr));
    this.canvas.height = Math.max(1, Math.round(this.h * this.dpr));
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  _ensureLoop() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    const tick = (now) => {
      const dt = Math.min(0.05, (now - this.lastTime) / 1000);
      this.lastTime = now;
      this._updateAndDraw(dt);
      if (
        this.particles.length ||
        this.beams.length ||
        this.rings.length ||
        this.arcs.length ||
        this.popups.length
      ) {
        requestAnimationFrame(tick);
      } else {
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.running = false;
      }
    };
    requestAnimationFrame(tick);
  }

  burst(x, y, color = '#ffe074', count = 14) {
    const n = this.reducedMotion ? Math.min(5, count) : count;
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.45;
      const speed = 70 + Math.random() * 170;
      const isStar = i % 2 === 0;
      this.particles.push({
        kind: isStar ? 'star' : 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 35,
        size: isStar ? 5 + Math.random() * 6 : 2.5 + Math.random() * 3.5,
        color: i % 3 === 0 ? '#fff9e6' : color,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 8,
        life: 0,
        maxLife: 0.48 + Math.random() * 0.36
      });
    }
    this._ensureLoop();
  }

  coinShower(count = 28) {
    const n = this.reducedMotion ? 8 : count;
    for (let i = 0; i < n; i++) {
      this.particles.push({
        kind: 'coin',
        x: this.w * (0.12 + Math.random() * 0.76),
        y: -12 - Math.random() * 90,
        vx: (Math.random() - 0.5) * 110,
        vy: 140 + Math.random() * 180,
        size: 8 + Math.random() * 5,
        phase: Math.random() * Math.PI * 2,
        vphase: 8 + Math.random() * 6,
        life: 0,
        maxLife: 1.5 + Math.random() * 0.75
      });
    }
    this._ensureLoop();
  }

  shockwave(x, y, color = '#ffd966', maxRadius = 110) {
    this.rings.push({
      x,
      y,
      color,
      radius: 10,
      maxRadius,
      life: 0,
      maxLife: 0.42
    });
    this._ensureLoop();
  }

  laserBeam(x, y, orientation = 'h', color = '#ffe074') {
    this.beams.push({
      x,
      y,
      orientation,
      color,
      life: 0,
      maxLife: 0.38
    });
    this._ensureLoop();
  }

  lightningArc(x1, y1, x2, y2, color = '#fff0a8') {
    const segs = 6;
    const pts = [{ x: x1, y: y1 }];
    for (let i = 1; i < segs; i++) {
      const t = i / segs;
      const jitter = 14;
      pts.push({
        x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * jitter,
        y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * jitter
      });
    }
    pts.push({ x: x2, y: y2 });
    this.arcs.push({ pts, color, life: 0, maxLife: 0.34 });
    this._ensureLoop();
  }

  popup(x, y, text, { color = '#fff3c4', scale = 1, big = false } = {}) {
    this.popups.push({
      x: Math.max(64, Math.min(this.w - 64, x)),
      y: Math.max(40, Math.min(this.h - 40, y)),
      text,
      color,
      scale,
      big,
      life: 0,
      maxLife: big ? 1.15 : 0.85
    });
    this._ensureLoop();
  }

  _updateAndDraw(dt) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    // Beams
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const b = this.beams[i];
      b.life += dt;
      if (b.life >= b.maxLife) {
        this.beams.splice(i, 1);
        continue;
      }
      const p = b.life / b.maxLife;
      const alpha = 1 - p;
      const thickness = (1 - p * 0.5) * 26;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alpha;
      if (b.orientation === 'h') {
        const g = ctx.createLinearGradient(0, b.y - thickness, 0, b.y + thickness);
        g.addColorStop(0, 'rgba(255,215,100,0)');
        g.addColorStop(0.5, b.color);
        g.addColorStop(1, 'rgba(255,215,100,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, b.y - thickness, this.w, thickness * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, b.y - 3, this.w, 6);
      } else {
        const g = ctx.createLinearGradient(b.x - thickness, 0, b.x + thickness, 0);
        g.addColorStop(0, 'rgba(255,215,100,0)');
        g.addColorStop(0.5, b.color);
        g.addColorStop(1, 'rgba(255,215,100,0)');
        ctx.fillStyle = g;
        ctx.fillRect(b.x - thickness, 0, thickness * 2, this.h);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(b.x - 3, 0, 6, this.h);
      }
      ctx.restore();
    }

    // Shockwave rings
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.life += dt;
      if (r.life >= r.maxLife) {
        this.rings.splice(i, 1);
        continue;
      }
      const p = r.life / r.maxLife;
      const ease = 1 - Math.pow(1 - p, 3);
      const rad = r.radius + (r.maxRadius - r.radius) * ease;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = (1 - p) * 0.9;
      ctx.strokeStyle = r.color;
      ctx.lineWidth = Math.max(1.5, 8 * (1 - p));
      ctx.beginPath();
      ctx.arc(r.x, r.y, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Lightning arcs
    for (let i = this.arcs.length - 1; i >= 0; i--) {
      const a = this.arcs[i];
      a.life += dt;
      if (a.life >= a.maxLife) {
        this.arcs.splice(i, 1);
        continue;
      }
      const alpha = 1 - a.life / a.maxLife;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = a.color;
      ctx.lineWidth = 4;
      ctx.shadowColor = '#ffd966';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      a.pts.forEach((pt, idx) => (idx === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();
    }

    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life += dt;
      if (pt.life >= pt.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }
      const p = pt.life / pt.maxLife;

      if (pt.kind === 'coin') {
        pt.vy += 420 * dt;
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.phase += pt.vphase * dt;
        const spinW = Math.max(0.18, Math.abs(Math.cos(pt.phase)));
        const alpha = p > 0.78 ? (1 - p) / 0.22 : 1;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(pt.x, pt.y);
        ctx.scale(spinW, 1);
        const grad = ctx.createRadialGradient(-2, -2, 1, 0, 0, pt.size);
        grad.addColorStop(0, '#fff7c2');
        grad.addColorStop(0.55, '#f5bc3b');
        grad.addColorStop(1, '#9b640b');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffe999';
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.restore();
      } else {
        pt.vy += 280 * dt;
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vx *= 0.96;
        pt.rot += pt.vrot * dt;
        const alpha = 1 - p;
        const sz = pt.size * (1 - p * 0.45);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = alpha;
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rot);
        ctx.fillStyle = pt.color;
        if (pt.kind === 'star') {
          // 4-point diamond starlight
          ctx.beginPath();
          for (let k = 0; k < 8; k++) {
            const rad = k % 2 === 0 ? sz : sz * 0.28;
            const ang = (k * Math.PI) / 4;
            const px = Math.cos(ang) * rad;
            const py = Math.sin(ang) * rad;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, sz, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // Popups
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pop = this.popups[i];
      pop.life += dt;
      if (pop.life >= pop.maxLife) {
        this.popups.splice(i, 1);
        continue;
      }
      const p = pop.life / pop.maxLife;
      const rise = (pop.big ? 58 : 42) * (1 - Math.pow(1 - p, 2));
      const punch = p < 0.16 ? 0.65 + (p / 0.16) * 0.5 : 1.15 - Math.min(0.15, (p - 0.16) * 0.4);
      const alpha = p > 0.68 ? (1 - p) / 0.32 : 1;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(pop.x, pop.y - rise);
      ctx.scale(punch * pop.scale, punch * pop.scale);
      ctx.font = pop.big
        ? '900 22px "Playfair Display", Georgia, serif'
        : '800 16px "DM Sans", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 4.5;
      ctx.strokeStyle = 'rgba(32, 6, 24, 0.92)';
      ctx.strokeText(pop.text, 0, 0);
      ctx.fillStyle = pop.color;
      ctx.fillText(pop.text, 0, 0);
      ctx.restore();
    }
  }
}
