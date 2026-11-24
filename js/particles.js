/**
 * Elevated teamLab × Museum Light-Art Particle FX:
 * faceted crystal prisms, luminous pearl sparks, refractive water-light ripples,
 * pure prismatic laser filaments, and editorial Cormorant Garamond italic callouts.
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

  burst(x, y, color = '#d8f4ff', count = 14) {
    const n = this.reducedMotion ? Math.min(5, count) : count;
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.45;
      const speed = 55 + Math.random() * 155;
      const isStar = i % 2 === 0;
      this.particles.push({
        kind: isStar ? 'star' : 'spark',
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 24,
        size: isStar ? 4.5 + Math.random() * 5.5 : 2 + Math.random() * 3,
        color: i % 3 === 0 ? '#ffffff' : color,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 7,
        life: 0,
        maxLife: 0.52 + Math.random() * 0.38
      });
    }
    this._ensureLoop();
  }

  /* Shower of drifting iridescent crystal prisms & pearl light petals (replaces casino coins!) */
  coinShower(count = 28) {
    const n = this.reducedMotion ? 8 : count;
    const prismColors = ['#d6faf6', '#e6d8ff', '#ffe2ec', '#ffffff', '#cde8ff'];
    for (let i = 0; i < n; i++) {
      this.particles.push({
        kind: 'prism',
        x: this.w * (0.08 + Math.random() * 0.84),
        y: -14 - Math.random() * 85,
        vx: (Math.random() - 0.5) * 75,
        vy: 90 + Math.random() * 145,
        size: 5 + Math.random() * 6,
        phase: Math.random() * Math.PI * 2,
        vphase: 5 + Math.random() * 5,
        color: prismColors[i % prismColors.length],
        life: 0,
        maxLife: 1.55 + Math.random() * 0.8
      });
    }
    this._ensureLoop();
  }

  shockwave(x, y, color = '#d6f4ff', maxRadius = 115) {
    this.rings.push({
      x,
      y,
      color,
      radius: 8,
      maxRadius,
      life: 0,
      maxLife: 0.52
    });
    this._ensureLoop();
  }

  laserBeam(x, y, orientation = 'h', color = '#d8f4ff') {
    this.beams.push({
      x,
      y,
      orientation,
      color,
      life: 0,
      maxLife: 0.42
    });
    this._ensureLoop();
  }

  lightningArc(x1, y1, x2, y2, color = '#e4f6ff') {
    const segs = 6;
    const pts = [{ x: x1, y: y1 }];
    for (let i = 1; i < segs; i++) {
      const t = i / segs;
      const jitter = 12;
      pts.push({
        x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * jitter,
        y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * jitter
      });
    }
    pts.push({ x: x2, y: y2 });
    this.arcs.push({ pts, color, life: 0, maxLife: 0.36 });
    this._ensureLoop();
  }

  popup(x, y, text, { color = '#f5f2ed', scale = 1, big = false } = {}) {
    this.popups.push({
      x: Math.max(66, Math.min(this.w - 66, x)),
      y: Math.max(40, Math.min(this.h - 40, y)),
      text,
      color,
      scale,
      big,
      life: 0,
      maxLife: big ? 1.2 : 0.9
    });
    this._ensureLoop();
  }

  _updateAndDraw(dt) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    // Prismatic Silk Light Beams
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const b = this.beams[i];
      b.life += dt;
      if (b.life >= b.maxLife) {
        this.beams.splice(i, 1);
        continue;
      }
      const p = b.life / b.maxLife;
      const alpha = 1 - p;
      const thickness = (1 - p * 0.45) * 22;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alpha;
      if (b.orientation === 'h') {
        const g = ctx.createLinearGradient(0, b.y - thickness, 0, b.y + thickness);
        g.addColorStop(0, 'rgba(200,242,255,0)');
        g.addColorStop(0.5, b.color);
        g.addColorStop(1, 'rgba(200,242,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, b.y - thickness, this.w, thickness * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, b.y - 1.5, this.w, 3);
      } else {
        const g = ctx.createLinearGradient(b.x - thickness, 0, b.x + thickness, 0);
        g.addColorStop(0, 'rgba(200,242,255,0)');
        g.addColorStop(0.5, b.color);
        g.addColorStop(1, 'rgba(200,242,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(b.x - thickness, 0, thickness * 2, this.h);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(b.x - 1.5, 0, 3, this.h);
      }
      ctx.restore();
    }

    // Refractive Water-Light Ripples
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
      ctx.globalAlpha = (1 - p) * 0.85;
      ctx.strokeStyle = r.color;
      ctx.lineWidth = Math.max(1, 5 * (1 - p));
      ctx.beginPath();
      ctx.arc(r.x, r.y, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Optical Light Filaments (Tiara Wild)
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
      ctx.lineWidth = 3;
      ctx.shadowColor = '#c8f3ff';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      a.pts.forEach((pt, idx) => (idx === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y)));
      ctx.stroke();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
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

      if (pt.kind === 'prism') {
        pt.vy += 180 * dt;
        pt.x += pt.vx * dt + Math.sin(pt.phase) * 18 * dt;
        pt.y += pt.vy * dt;
        pt.phase += pt.vphase * dt;
        const spinW = Math.max(0.2, Math.abs(Math.cos(pt.phase)));
        const alpha = p > 0.72 ? (1 - p) / 0.28 : 0.92;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = alpha;
        ctx.translate(pt.x, pt.y);
        ctx.rotate(Math.sin(pt.phase * 0.5) * 0.5);
        ctx.scale(spinW, 1);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.moveTo(0, -pt.size);
        ctx.lineTo(pt.size * 0.65, 0);
        ctx.lineTo(0, pt.size);
        ctx.lineTo(-pt.size * 0.65, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else {
        pt.vy += 210 * dt;
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vx *= 0.96;
        pt.rot += pt.vrot * dt;
        const alpha = 1 - p;
        const sz = pt.size * (1 - p * 0.4);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = alpha;
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rot);
        ctx.fillStyle = pt.color;
        if (pt.kind === 'star') {
          ctx.beginPath();
          for (let k = 0; k < 8; k++) {
            const rad = k % 2 === 0 ? sz : sz * 0.24;
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

    // Editorial Serif Popups
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pop = this.popups[i];
      pop.life += dt;
      if (pop.life >= pop.maxLife) {
        this.popups.splice(i, 1);
        continue;
      }
      const p = pop.life / pop.maxLife;
      const rise = (pop.big ? 56 : 40) * (1 - Math.pow(1 - p, 2));
      const punch = p < 0.16 ? 0.78 + (p / 0.16) * 0.28 : 1.06 - Math.min(0.06, (p - 0.16) * 0.3);
      const alpha = p > 0.65 ? (1 - p) / 0.35 : 1;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(pop.x, pop.y - rise);
      ctx.scale(punch * pop.scale, punch * pop.scale);
      ctx.font = pop.big
        ? 'italic 600 24px "Cormorant Garamond", Georgia, serif'
        : '500 15px "Inter", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(4, 4, 8, 0.88)';
      ctx.strokeText(pop.text, 0, 0);
      ctx.fillStyle = pop.color;
      ctx.fillText(pop.text, 0, 0);
      ctx.restore();
    }
  }
}
