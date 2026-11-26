/**
 * Jewel Queen — Viral Collector Vault Share Card Generator (1080×1350 4:5 Portrait)
 * Generates a museum-grade black-velvet Collector Card PNG showcasing:
 *   - Collector display name & rank
 *   - Estate Valuation ($), Acquired count (X / 45), & Best Score
 *   - Top 5 Signature Lineup (or top 5 rarest discovered V&A pieces) with real museum photography
 *   - Subtle gallery credit: "Curated in the spirit of Connie Parente · @parenteconnie"
 * Supports 1-tap native mobile Share Sheet (Instagram Stories, Facebook, Messenger, Messages)
 * with instant Download PNG + Facebook Share + Copy Challenge Link fallback on desktop.
 */

import { JEWELS, JEWEL_MAP, TIARA_PIECE } from './data.js';
import { COLLECTOR_TIERS, RARITY_META, getMasteryRank, formatEstateMoney } from './history.js';

const LIVE_URL = 'https://aparente.github.io/jewel-queen/';

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function computeVaultStats(collectionCounts = {}, showcaseIds = []) {
  const allPieces = [TIARA_PIECE, ...JEWELS];
  let ownedCount = 0;
  let totalEstate = 0;
  const ownedPieces = [];

  for (const p of allPieces) {
    const cnt = collectionCounts[p.id] || 0;
    const tierKey = p.id === 'tiara' ? 'lavabre-tiara' : p.id;
    const tier = COLLECTOR_TIERS[tierKey] || { rarity: 'classic', value: 2500 };
    if (cnt > 0) {
      ownedCount++;
      const mastery = getMasteryRank(cnt);
      const val = Math.round(tier.value * mastery.mult);
      totalEstate += val;
      ownedPieces.push({ piece: p, tier, count: cnt, value: val });
    }
  }

  // Pick 5 featured jewels: user's pinned Signature Lineup first, then highest-value owned, then iconic museum highlights
  const featured = [];
  const used = new Set();

  for (const pid of showcaseIds) {
    if (featured.length >= 5) break;
    if ((collectionCounts[pid] || 0) > 0) {
      const p = pid === 'tiara' ? TIARA_PIECE : JEWEL_MAP[pid];
      if (p && !used.has(p.id)) {
        const tierKey = p.id === 'tiara' ? 'lavabre-tiara' : p.id;
        featured.push({ piece: p, tier: COLLECTOR_TIERS[tierKey] || { rarity: 'rare', value: 25000 }, owned: true });
        used.add(p.id);
      }
    }
  }

  ownedPieces.sort((a, b) => b.value - a.value);
  for (const entry of ownedPieces) {
    if (featured.length >= 5) break;
    if (!used.has(entry.piece.id)) {
      featured.push({ piece: entry.piece, tier: entry.tier, owned: true });
      used.add(entry.piece.id);
    }
  }

  // Fill any remaining showcase slots with iconic museum preview pieces so even brand-new players get a gorgeous card
  const fallbackIds = ['wallace-butterfly', 'cindy-ruby', 'cartier-lapis', 'lalique-medusa', 'flato-feet'];
  for (const fid of fallbackIds) {
    if (featured.length >= 5) break;
    const p = JEWEL_MAP[fid];
    if (p && !used.has(p.id)) {
      featured.push({ piece: p, tier: COLLECTOR_TIERS[fid] || { rarity: 'sovereign', value: 120000 }, owned: false });
      used.add(p.id);
    }
  }

  const rankTitle =
    ownedCount >= 40
      ? 'SOVEREIGN CURATOR'
      : ownedCount >= 25
        ? 'GRAND CONNOISSEUR'
        : ownedCount >= 12
          ? 'PRIVATE COLLECTOR'
          : ownedCount >= 4
            ? 'GALLERY PATRON'
            : 'NEW ACQUISITIONIST';

  return {
    ownedCount,
    totalCount: allPieces.length,
    totalEstate,
    featured,
    rankTitle
  };
}

export function buildChallengeUrl({ collectorName, whatnotHandle, totalEstate, ownedCount, bestScore }) {
  const base = window.location.origin.startsWith('http') && !window.location.origin.includes('localhost')
    ? `${window.location.origin}${window.location.pathname}`
    : LIVE_URL;
  const u = new URL(base);
  if (collectorName) u.searchParams.set('invite', collectorName.slice(0, 28));
  if (whatnotHandle) u.searchParams.set('wn', whatnotHandle.replace(/^@+/, '').slice(0, 28));
  if (totalEstate > 0) u.searchParams.set('estate', String(totalEstate));
  if (ownedCount > 0) u.searchParams.set('owned', String(ownedCount));
  if (bestScore > 0) u.searchParams.set('score', String(bestScore));
  return u.toString();
}

export async function renderVaultShareCard({
  collectorName = 'PRIVATE COLLECTOR',
  whatnotHandle = '',
  bestScore = 0,
  collectionCounts = {},
  showcaseIds = []
}) {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const stats = computeVaultStats(collectionCounts, showcaseIds);
  const displayName = (collectorName || 'Private Collector').trim().slice(0, 26);
  const cleanWn = (whatnotHandle || '').trim().replace(/^@+/, '').slice(0, 26);

  // 1. Deep Museum Gallery Black + Subtle teamLab Iridescent Light Veil
  ctx.fillStyle = '#030306';
  ctx.fillRect(0, 0, W, H);

  const aura1 = ctx.createRadialGradient(W * 0.22, H * 0.22, 20, W * 0.22, H * 0.22, 540);
  aura1.addColorStop(0, 'rgba(130, 232, 224, 0.14)');
  aura1.addColorStop(0.55, 'rgba(148, 128, 255, 0.06)');
  aura1.addColorStop(1, 'rgba(3, 3, 6, 0)');
  ctx.fillStyle = aura1;
  ctx.fillRect(0, 0, W, H);

  const aura2 = ctx.createRadialGradient(W * 0.8, H * 0.72, 20, W * 0.8, H * 0.72, 560);
  aura2.addColorStop(0, 'rgba(244, 152, 204, 0.13)');
  aura2.addColorStop(0.6, 'rgba(130, 178, 255, 0.05)');
  aura2.addColorStop(1, 'rgba(3, 3, 6, 0)');
  ctx.fillStyle = aura2;
  ctx.fillRect(0, 0, W, H);

  // Delicate museum gallery frame hairline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  roundRectPath(ctx, 44, 44, W - 88, H - 88, 30);
  ctx.stroke();

  // 2. Editorial Header
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(214, 212, 224, 0.62)';
  ctx.font = '500 21px Inter, -apple-system, sans-serif';
  ctx.fillText('V&A MUSEUM ARCHIVE EDITION  ·  ' + stats.rankTitle, W / 2, 118);

  ctx.fillStyle = '#f5f2ed';
  ctx.font = '300 78px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('J E W E L   Q U E E N', W / 2, 202);

  ctx.fillStyle = 'rgba(245, 242, 237, 0.76)';
  ctx.font = 'italic 400 34px "Cormorant Garamond", Georgia, serif';
  const subtitleLine = cleanWn
    ? `${displayName}’s Private Vault  ·  Whatnot @${cleanWn}`
    : `${displayName}’s Private Vault`;
  ctx.fillText(subtitleLine, W / 2, 256);

  // 3. Borderless Hairline Metrics Placard
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.11)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(96, 298);
  ctx.lineTo(W - 96, 298);
  ctx.moveTo(96, 424);
  ctx.lineTo(W - 96, 424);
  ctx.moveTo(W * 0.365, 322);
  ctx.lineTo(W * 0.365, 400);
  ctx.moveTo(W * 0.665, 322);
  ctx.lineTo(W * 0.665, 400);
  ctx.stroke();

  const metrics = [
    { x: W * 0.22, label: 'ESTATE VALUE', val: formatEstateMoney(stats.totalEstate), accent: '#c8f5ef' },
    { x: W * 0.515, label: 'ACQUIRED', val: `${stats.ownedCount} / ${stats.totalCount}`, accent: '#f5f2ed' },
    { x: W * 0.81, label: 'BEST SCORE', val: bestScore.toLocaleString(), accent: '#e6dcff' }
  ];
  for (const m of metrics) {
    ctx.fillStyle = 'rgba(214, 212, 224, 0.56)';
    ctx.font = '500 18px Inter, -apple-system, sans-serif';
    ctx.fillText(m.label, m.x, 344);
    ctx.fillStyle = m.accent;
    ctx.font = '500 44px Inter, -apple-system, sans-serif';
    ctx.fillText(m.val, m.x, 398);
  }

  // 4. Pure Black Velvet Collector's Vitrine (5 Real Museum Jewels)
  roundRectPath(ctx, 84, 466, W - 168, 636, 28);
  ctx.fillStyle = '#09090d';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.09)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = 'rgba(214, 212, 224, 0.52)';
  ctx.font = '500 19px Inter, -apple-system, sans-serif';
  ctx.fillText(
    stats.ownedCount > 0 ? 'SIGNATURE VELVET TRAY  ·  CURATED HIGHLIGHTS' : 'CURATED V&A MUSEUM HIGHLIGHTS',
    W / 2,
    514
  );

  // Load the 5 jewel sprites in parallel
  const loadedImgs = await Promise.all(stats.featured.map((f) => loadImage(f.piece.img)));

  // Top row: 2 large hero compartments; Bottom row: 3 compartments
  const slots = [
    { x: 124, y: 544, w: 400, h: 256 },
    { x: 556, y: 544, w: 400, h: 256 },
    { x: 124, y: 822, w: 264, h: 244 },
    { x: 408, y: 822, w: 264, h: 244 },
    { x: 692, y: 822, w: 264, h: 244 }
  ];

  slots.forEach((slot, i) => {
    const entry = stats.featured[i];
    const img = loadedImgs[i];
    if (!entry) return;

    roundRectPath(ctx, slot.x, slot.y, slot.w, slot.h, 20);
    const wellGrad = ctx.createRadialGradient(
      slot.x + slot.w / 2,
      slot.y + slot.h * 0.42,
      10,
      slot.x + slot.w / 2,
      slot.y + slot.h * 0.42,
      slot.w * 0.65
    );
    wellGrad.addColorStop(0, '#14141b');
    wellGrad.addColorStop(1, '#060609');
    ctx.fillStyle = wellGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (img) {
      const maxImg = i < 2 ? 168 : 144;
      const scale = Math.min(maxImg / img.width, maxImg / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 8;
      ctx.drawImage(img, slot.x + (slot.w - dw) / 2, slot.y + 18 + (maxImg - dh) / 2, dw, dh);
      ctx.restore();
    }

    // Jewel short name & maker
    ctx.fillStyle = '#f5f2ed';
    ctx.font = i < 2 ? '500 22px "Cormorant Garamond", Georgia, serif' : '500 19px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(entry.piece.shortName, slot.x + slot.w / 2, slot.y + slot.h - 42);

    const maker = (entry.piece.designers || '').split('·')[0].trim();
    const rLabel = (RARITY_META[entry.tier.rarity]?.label || '').toUpperCase();
    ctx.fillStyle = 'rgba(214, 212, 224, 0.56)';
    ctx.font = '500 14px Inter, -apple-system, sans-serif';
    ctx.fillText(i < 2 ? `${maker} · ${rLabel}` : maker, slot.x + slot.w / 2, slot.y + slot.h - 18);
  });

  // 5. Connie Parente Brand Colophon & Viral Invite Footer
  ctx.fillStyle = 'rgba(245, 242, 237, 0.8)';
  ctx.font = 'italic 400 29px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Connie Parente · IG @parenteconnie · Whatnot @jewelqueen', W / 2, 1170);

  ctx.fillStyle = 'rgba(214, 212, 224, 0.52)';
  ctx.font = '400 20px Inter, -apple-system, sans-serif';
  ctx.fillText('A gallery game made by & for family — can you collect all 45 V&A treasures?', W / 2, 1212);

  // Subtle luminous pill URL at bottom
  roundRectPath(ctx, W / 2 - 235, 1236, 470, 44, 22);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.055)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#d4f4ef';
  ctx.font = '500 20px Inter, -apple-system, sans-serif';
  ctx.fillText('aparente.github.io/jewel-queen', W / 2, 1265);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.96));
  const dataUrl = canvas.toDataURL('image/png');
  const shareUrl = buildChallengeUrl({
    collectorName: displayName,
    whatnotHandle: cleanWn,
    totalEstate: stats.totalEstate,
    ownedCount: stats.ownedCount,
    bestScore
  });

  const shareText =
    stats.ownedCount > 0
      ? `My Jewel Queen Estate Vault is valued at ${formatEstateMoney(stats.totalEstate)} (${stats.ownedCount}/${stats.totalCount} real V&A museum jewels)! Inspired by Connie Parente (IG @parenteconnie · Whatnot @jewelqueen) — see if you can top my vault:`
      : `Discover 45 real V&A Museum vintage jewels in Jewel Queen — inspired by Connie Parente (IG @parenteconnie · Whatnot @jewelqueen):`;

  return { blob, dataUrl, shareUrl, shareText, stats };
}
