/**
 * SOTA teamLab × Museum Light-Art Particle FX:
 * - Curved flowing silk Bezier light-ribbons (Royal Tiara sovereign sweeps!)
 * - Dual-core chromatic-dispersion split laser beams (Match-4 Light Beam)
 * - Dual-ring refractive water-light ripples (L/T Aura Burst)
 * - Silk-decelerating faceted crystal shards & pearl starlight bursts
 * - Refined Cormorant Garamond italic callouts
 */

export class ParticleFX {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.beams = [];
    this.rings = [];
    this.ribbons = [];
    this.popups = [];
    this.jewelCache = new Map();
    this.activeRainImgs = [];
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
        this.ribbons.length ||
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

  burst(x, y, color = '#d8f4ff', count = 16) {
    const n = this.reducedMotion ? Math.min(5, count) : count;
    // Soft instant core flash ring
    this.rings.push({
      x,
      y,
      color,
      radius: 4,
      maxRadius: 34,
      life: 0,
      maxLife: 0.34,
      thin: true
    });

    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.42;
      const speed = 50 + Math.random() * 165;
      const kind = i % 3 === 0 ? 'petal' : i % 2 === 0 ? 'star' : 'spark';
      this.particles.push({
        kind,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 22,
        size: kind === 'star' ? 5 + Math.random() * 5.5 : kind === 'petal' ? 4 + Math.random() * 4 : 2 + Math.random() * 2.5,
        color: i % 4 === 0 ? '#ffffff' : color,
        rot: angle,
        vrot: (Math.random() - 0.5) * 6,
        life: 0,
        maxLife: 0.55 + Math.random() * 0.42
      });
    }
    this._ensureLoop();
  }

  setRainJewels(imgUrls = []) {
    this.activeRainImgs = imgUrls.map((url) => {
      if (this.jewelCache.has(url)) return this.jewelCache.get(url);
      const img = new Image();
      img.decoding = 'async';
      img.src = url;
      this.jewelCache.set(url, img);
      return img;
    });
  }

  /* Rain real tumbling museum jewels with depth sizing, gentle rotation & soft starlight glints */
  coinShower(count = 24) {
    const n = this.reducedMotion ? 6 : count;
    const readyImgs = this.activeRainImgs.filter((im) => im.complete && im.naturalWidth > 0);
    const pool = readyImgs.length ? readyImgs : this.activeRainImgs;

    for (let i = 0; i < n; i++) {
      const depth = 0.65 + Math.random() * 0.7; // Parallax depth (smaller far, larger close)
      const img = pool.length ? pool[i % pool.length] : null;
      this.particles.push({
        kind: 'jewel',
        img,
        x: this.w * (0.06 + Math.random() * 0.88),
        y: -26 - Math.random() * 140,
        vx: (Math.random() - 0.5) * 65,
        vy: (95 + Math.random() * 140) * depth,
        size: 32 * depth,
        rot: (Math.random() - 0.5) * 0.9,
        vrot: (Math.random() - 0.5) * 2.6,
        phase: Math.random() * Math.PI * 2,
        vphase: 2.2 + Math.random() * 2.4,
        depth,
        life: 0,
        maxLife: 1.75 + Math.random() * 0.95
      });
    }
    this._ensureLoop();
  }

  shockwave(x, y, color = '#d6f4ff', maxRadius = 122) {
    // Dual refractive concentric water-light ripples
    this.rings.push({ x, y, color, radius: 8, maxRadius, life: 0, maxLife: 0.56, thin: false });
    this.rings.push({ x, y, color: '#ffffff', radius: 4, maxRadius: maxRadius * 0.72, life: -0.06, maxLife: 0.48, thin: true });
    this._ensureLoop();
  }

  laserBeam(x, y, orientation = 'h', color = '#d8f4ff') {
    this.beams.push({ x, y, orientation, color, life: 0, maxLife: 0.46 });
    // Scatter luminous diamond dust along the beam path
    const steps = this.reducedMotion ? 4 : 11;
    for (let i = 0; i < steps; i++) {
      const t = (i + 0.5) / steps;
      const px = orientation === 'h' ? t * this.w : x + (Math.random() - 0.5) * 14;
      const py = orientation === 'v' ? t * this.h : y + (Math.random() - 0.5) * 14;
      this.particles.push({
        kind: 'star',
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 55,
        vy: (Math.random() - 0.5) * 55 - 15,
        size: 3.5 + Math.random() * 4.5,
        color: i % 2 === 0 ? '#ffffff' : color,
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 6,
        life: 0,
        maxLife: 0.45 + Math.random() * 0.3
      });
    }
    this._ensureLoop();
  }

  /**
   * Curved flowing teamLab silk light-ribbon snaking from (x1,y1) -> (x2,y2).
   */
  lightningArc(x1, y1, x2, y2, color = '#d8f6ff') {
    const mx = (x1 + x2) * 0.5;
    const my = (y1 + y2) * 0.5;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const bend = (Math.random() > 0.5 ? 1 : -1) * (24 + Math.random() * 32);
    const len = Math.max(1, Math.hypot(dx, dy));
    const cx = mx - (dy / len) * bend;
    const cy = my + (dx / len) * bend;
    this.ribbons.push({ x1, y1, cx, cy, x2, y2, color, life: 0, maxLife: 0.46 });
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
      maxLife: big ? 1.25 : 0.9
    });
    this._ensureLoop();
  }

  _updateAndDraw(dt) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    // 1. Chromatic-Dispersion Split Laser Beams (Cyan + Violet fringe + Pure White Core)
    for (let i = this.beams.length - 1; i >= 0; i--) {
      const b = this.beams[i];
      b.life += dt;
      if (b.life >= b.maxLife) {
        this.beams.splice(i, 1);
        continue;
      }
      const p = b.life / b.maxLife;
      const alpha = Math.pow(1 - p, 1.3);
      const thick = (1 - p * 0.55) * 24;
      const offset = 3.5 * (1 - p * 0.3);

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alpha;
      if (b.orientation === 'h') {
        const drawBand = (yOff, cHex, hSize) => {
          const g = ctx.createLinearGradient(0, b.y + yOff - hSize, 0, b.y + yOff + hSize);
          g.addColorStop(0, 'rgba(0,0,0,0)');
          g.addColorStop(0.5, cHex);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, b.y + yOff - hSize, this.w, hSize * 2);
        };
        drawBand(-offset, 'rgba(130, 244, 255, 0.7)', thick * 0.85);
        drawBand(offset, 'rgba(210, 160, 255, 0.7)', thick * 0.85);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, b.y - 1.5, this.w, 3);
      } else {
        const drawBand = (xOff, cHex, wSize) => {
          const g = ctx.createLinearGradient(b.x + xOff - wSize, 0, b.x + xOff + wSize, 0);
          g.addColorStop(0, 'rgba(0,0,0,0)');
          g.addColorStop(0.5, cHex);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = g;
          ctx.fillRect(b.x + xOff - wSize, 0, wSize * 2, this.h);
        };
        drawBand(-offset, 'rgba(130, 244, 255, 0.7)', thick * 0.85);
        drawBand(offset, 'rgba(210, 160, 255, 0.7)', thick * 0.85);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(b.x - 1.5, 0, 3, this.h);
      }
      ctx.restore();
    }

    // 2. Refractive Water-Light Ripples
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.life += dt;
      if (r.life < 0) continue;
      if (r.life >= r.maxLife) {
        this.rings.splice(i, 1);
        continue;
      }
      const p = r.life / r.maxLife;
      const ease = 1 - Math.pow(1 - p, 3);
      const rad = r.radius + (r.maxRadius - r.radius) * ease;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = (1 - p) * (r.thin ? 0.65 : 0.85);
      ctx.strokeStyle = r.color;
      ctx.lineWidth = Math.max(0.8, (r.thin ? 2.2 : 5.5) * (1 - p));
      ctx.beginPath();
      ctx.arc(r.x, r.y, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Curved Flowing Silk Light-Ribbons (Royal Tiara)
    for (let i = this.ribbons.length - 1; i >= 0; i--) {
      const rb = this.ribbons[i];
      rb.life += dt;
      if (rb.life >= rb.maxLife) {
        this.ribbons.splice(i, 1);
        continue;
      }
      const p = rb.life / rb.maxLife;
      const head = Math.min(1, p * 2.1);
      const alpha = p > 0.45 ? (1 - p) / 0.55 : 1;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alpha;
      ctx.lineCap = 'round';

      // Draw partial quadratic Bezier up to `head`
      const drawPartial = (width, stroke) => {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;
        ctx.beginPath();
        const segs = 14;
        for (let s = 0; s <= segs; s++) {
          const t = (s / segs) * head;
          const mt = 1 - t;
          const px = mt * mt * rb.x1 + 2 * mt * t * rb.cx + t * t * rb.x2;
          const py = mt * mt * rb.y1 + 2 * mt * t * rb.cy + t * t * rb.y2;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      };

      ctx.shadowColor = rb.color;
      ctx.shadowBlur = 14;
      drawPartial(5.2 * (1 - p * 0.4), rb.color);
      drawPartial(1.6, '#ffffff');
      ctx.restore();
    }

    // 4. Particles (Silk-Decelerating Crystal Shards, Light Petals & Prisms)
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.life += dt;
      if (pt.life >= pt.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }
      const p = pt.life / pt.maxLife;

      if (pt.kind === 'jewel') {
        pt.vy += 185 * pt.depth * dt;
        pt.x += pt.vx * dt + Math.sin(pt.phase) * 24 * dt;
        pt.y += pt.vy * dt;
        pt.rot += pt.vrot * dt;
        pt.phase += pt.vphase * dt;

        const fadeIn = Math.min(1, pt.life / 0.14);
        const fadeOut = p > 0.72 ? (1 - p) / 0.28 : 1;
        const alpha = fadeIn * fadeOut * (0.72 + pt.depth * 0.24);

        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rot);

        if (pt.img && pt.img.complete && pt.img.naturalWidth > 0) {
          ctx.shadowColor = 'rgba(218, 240, 255, 0.35)';
          ctx.shadowBlur = 10 * pt.depth;
          ctx.drawImage(pt.img, -pt.size * 0.5, -pt.size * 0.5, pt.size, pt.size);
        }
        ctx.restore();
      } else {
        // Silky fluid deceleration like particles suspended in dark gallery air
        pt.vy += 140 * dt;
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vx *= 0.93;
        pt.vy *= 0.96;
        pt.rot += pt.vrot * dt;
        const alpha = Math.pow(1 - p, 1.15);
        const sz = pt.size * (1 - p * 0.38);

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = alpha;
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rot);
        ctx.fillStyle = pt.color;

        if (pt.kind === 'star') {
          ctx.beginPath();
          for (let k = 0; k < 8; k++) {
            const rad = k % 2 === 0 ? sz : sz * 0.22;
            const ang = (k * Math.PI) / 4;
            if (k === 0) ctx.moveTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
            else ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
          }
          ctx.closePath();
          ctx.fill();
        } else if (pt.kind === 'petal') {
          ctx.beginPath();
          ctx.ellipse(0, 0, sz * 1.35, sz * 0.45, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, sz, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // 5. Editorial Serif Callouts
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pop = this.popups[i];
      pop.life += dt;
      if (pop.life >= pop.maxLife) {
        this.popups.splice(i, 1);
        continue;
      }
      const p = pop.life / pop.maxLife;
      const rise = (pop.big ? 58 : 42) * (1 - Math.pow(1 - p, 2.4));
      const punch = p < 0.16 ? 0.78 + (p / 0.16) * 0.28 : 1.06 - Math.min(0.06, (p - 0.16) * 0.3);
      const alpha = p > 0.64 ? (1 - p) / 0.36 : 1;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(pop.x, pop.y - rise);
      ctx.scale(punch * pop.scale, punch * pop.scale);
      ctx.font = pop.big
        ? 'italic 400 26px "Cormorant Garamond", Georgia, serif'
        : '500 15px "Inter", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(3, 3, 7, 0.88)';
      ctx.strokeText(pop.text, 0, 0);
      ctx.fillStyle = pop.color;
      ctx.fillText(pop.text, 0, 0);
      ctx.restore();
    }
  }
}
