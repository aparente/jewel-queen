/**
 * Real-time 60fps Ethereal Black Opal Play-of-Color Engine.
 * Simulates authentic Australian black opal optical diffraction:
 * broadflash luminous silica veins, crystalline pinfire glints,
 * smooth chromatic angle-shift on pointer movement, and liquid fire surges on matches.
 */

export class LivingOpalTray {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.enabled = false;
    this.running = false;
    this.time = 0;
    this.surge = 0;
    this.tiltX = 0;
    this.tiltY = 0;
    this.targetTiltX = 0;
    this.targetTiltY = 0;

    this.veins = [];
    this.pinfire = [];
    this.resize();
    this._seed();

    window.addEventListener('pointermove', (e) => {
      if (!this.enabled) return;
      this.targetTiltX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      this.targetTiltY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    });
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    this.w = Math.max(1, rect.width);
    this.h = Math.max(1, rect.height);
    this.canvas.width = Math.max(1, Math.round(this.w * this.dpr));
    this.canvas.height = Math.max(1, Math.round(this.h * this.dpr));
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (this.enabled && this.reducedMotion) this._draw(0);
  }

  setEnabled(flag) {
    this.enabled = !!flag;
    this.canvas.hidden = !this.enabled;
    if (this.enabled) {
      this.resize();
      if (this.reducedMotion) {
        this._draw(0);
      } else if (!this.running) {
        this._loop();
      }
    }
  }

  pulse(strength = 0.75) {
    if (!this.enabled) return;
    this.surge = Math.min(1.5, this.surge + strength);
  }

  _seed() {
    // Broadflash organic silica color patches that drift, breathe, and shift hue smoothly
    const opalHues = [168, 192, 146, 224, 276, 318, 44, 178, 256, 158, 204, 336, 185, 290, 140, 212];
    this.veins = opalHues.map((baseHue, i) => ({
      // Distribute both around perimeter rim AND gently across translucent interior
      nx: 0.08 + ((i * 0.6180339) % 0.84),
      ny: 0.08 + (((i * 0.381966) + 0.17) % 0.84),
      rx: 0.24 + (i % 4) * 0.075,
      ry: 0.13 + ((i + 1) % 3) * 0.06,
      rot: (i * 0.78) % Math.PI,
      vrot: (i % 2 === 0 ? 1 : -1) * (0.08 + (i % 4) * 0.03),
      baseHue,
      hueRange: 48 + (i % 3) * 18,
      speed: 0.28 + (i % 5) * 0.09,
      phase: i * 1.13,
      parallax: 14 + (i % 4) * 9
    }));

    // Crystalline pinfire micro-facets flashing inside the opal
    this.pinfire = Array.from({ length: 42 }, (_, i) => {
      // Bias slightly toward the glowing perimeter bezel so the frame sparkles like cut opal!
      const onRim = i < 24;
      let nx;
      let ny;
      if (onRim) {
        const side = i % 4;
        const pos = ((i * 0.37) % 0.92) + 0.04;
        if (side === 0) { nx = pos; ny = 0.02 + (i % 3) * 0.014; }
        else if (side === 1) { nx = pos; ny = 0.96 - (i % 3) * 0.014; }
        else if (side === 2) { nx = 0.02 + (i % 3) * 0.014; ny = pos; }
        else { nx = 0.96 - (i % 3) * 0.014; ny = pos; }
      } else {
        nx = 0.08 + ((i * 0.41) % 0.84);
        ny = 0.08 + ((i * 0.73) % 0.84);
      }
      return {
        nx,
        ny,
        size: onRim ? 2.4 + (i % 4) * 1.3 : 1.8 + (i % 3) * 1.1,
        hue: opalHues[i % opalHues.length],
        speed: 1.5 + (i % 6) * 0.55,
        phase: i * 0.91
      };
    });
  }

  _loop() {
    this.running = true;
    let last = performance.now();
    const tick = (now) => {
      if (!this.enabled) {
        this.running = false;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      this.time += dt;
      this.surge = Math.max(0, this.surge - dt * 1.25);
      this.tiltX += (this.targetTiltX - this.tiltX) * Math.min(1, dt * 4.5);
      this.tiltY += (this.targetTiltY - this.tiltY) * Math.min(1, dt * 4.5);
      this._draw(dt);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  _draw() {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;
    const t = this.time;

    // 1. Deep obsidian-indigo black opal silica matrix
    ctx.globalCompositeOperation = 'source-over';
    const base = ctx.createRadialGradient(
      w * (0.45 + this.tiltX * 0.12),
      h * (0.42 + this.tiltY * 0.12),
      w * 0.05,
      w * 0.5,
      h * 0.5,
      w * 0.82
    );
    base.addColorStop(0, '#0f1324');
    base.addColorStop(0.58, '#070914');
    base.addColorStop(1, '#04050b');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    // 2. Iridescent broadflash play-of-color silica veins (additive optical fire!)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (const v of this.veins) {
      const wave = Math.sin(t * v.speed + v.phase);
      const wave2 = Math.cos(t * (v.speed * 0.72) + v.phase * 1.3);

      // Angle-dependent diffraction: tilting pointer shifts both position & fire hue!
      const cx = v.nx * w + wave * 28 + this.tiltX * v.parallax;
      const cy = v.ny * h + wave2 * 24 + this.tiltY * v.parallax;
      const hue = (v.baseHue + t * 14 + wave * v.hueRange + this.tiltX * 38 + this.tiltY * 26 + 360) % 360;
      const intensity = (0.24 + 0.18 * (0.5 + 0.5 * Math.sin(t * v.speed * 1.4 + v.phase))) * (1 + this.surge * 0.65);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(v.rot + t * v.vrot + this.tiltX * 0.25);
      ctx.scale(1, v.ry / v.rx);

      const rad = v.rx * w * (0.92 + 0.12 * wave2 + this.surge * 0.1);
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rad);
      grad.addColorStop(0, `hsla(${hue}, 100%, 66%, ${Math.min(0.85, intensity * 1.25)})`);
      grad.addColorStop(0.45, `hsla(${(hue + 28) % 360}, 95%, 54%, ${intensity * 0.62})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Ethereal drifting opalescent milk-prism caustic ribbon sweeping across the stone
    const sweepPos = ((t * 0.14 + this.tiltX * 0.15) % 1.6) - 0.3;
    const sx = sweepPos * w;
    const ribbon = ctx.createLinearGradient(sx - 90, 0, sx + 110, h);
    const rHue = (185 + t * 22 + this.tiltX * 45 + 360) % 360;
    ribbon.addColorStop(0, 'rgba(255,255,255,0)');
    ribbon.addColorStop(0.45, `hsla(${rHue}, 100%, 76%, ${0.14 + this.surge * 0.14})`);
    ribbon.addColorStop(0.55, `hsla(${(rHue + 65) % 360}, 100%, 78%, ${0.16 + this.surge * 0.14})`);
    ribbon.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = ribbon;
    ctx.fillRect(0, 0, w, h);

    // 4. Sparkling crystalline pinfire micro-flashes
    for (const pf of this.pinfire) {
      const flash = Math.pow(0.5 + 0.5 * Math.sin(t * pf.speed + pf.phase + this.tiltX * 2.5), 5);
      if (flash < 0.08) continue;
      const px = pf.nx * w + this.tiltX * 4;
      const py = pf.ny * h + this.tiltY * 4;
      const hue = (pf.hue + t * 28 + this.tiltY * 40 + 360) % 360;
      const sz = pf.size * (0.7 + flash * 0.9 + this.surge * 0.35);

      ctx.save();
      ctx.translate(px, py);
      ctx.globalAlpha = Math.min(1, flash * (0.9 + this.surge * 0.4));
      ctx.fillStyle = `hsl(${hue}, 100%, 82%)`;
      ctx.beginPath();
      for (let k = 0; k < 8; k++) {
        const r = k % 2 === 0 ? sz * 1.5 : sz * 0.35;
        const a = (k * Math.PI) / 4;
        if (k === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }
}
