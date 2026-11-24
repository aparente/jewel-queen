"""Render 3 studio-lit, 3D beveled Chinoiserie, Mayan Revival, and Egyptian Revival
vintage Art Deco jewelry sprites (320x320 transparent PNGs) using NumPy SDF shading.
"""

from pathlib import Path
import numpy as np
from PIL import Image

OUT_DIR = Path("/Users/sublux/.gemini/antigravity/scratch/jewel-queen/assets/jewels")
SIZE = 320
SS = 2
N = SIZE * SS


def make_grid():
    lin = np.linspace(-1.0, 1.0, N, dtype=np.float32)
    return np.meshgrid(lin, lin)


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0 + 1e-8), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def marble(x, y, f=5.0, ph=0.0):
    v = (
        np.sin(x * f + np.sin(y * f * 0.9 + ph) * 1.4) * 0.5
        + np.cos(y * f * 1.2 - np.sin(x * f * 0.8 - ph) * 1.1) * 0.35
        + np.sin((x - y) * f * 1.7 + ph) * 0.15
    )
    return 0.5 + 0.5 * v


def solid(r, g, b):
    arr = np.empty((N, N, 3), dtype=np.float32)
    arr[:, :, 0], arr[:, :, 1], arr[:, :, 2] = r, g, b
    return arr


def shade_sdf(dist, base_rgb, bevel=0.10, gloss=64.0, spec_s=0.82, trans=0.22):
    alpha = smoothstep(0.012, -0.006, dist)
    depth = np.clip(-dist / bevel, 0.0, 1.0)
    height = np.sqrt(np.clip(1.0 - (1.0 - depth) ** 2, 0.0, 1.0)) * 0.84 + 0.16 * depth
    gy, gx = np.gradient(height)
    nx, ny, nz = -gx * 20.0, -gy * 20.0, np.ones_like(gx)
    norm = np.sqrt(nx * nx + ny * ny + nz * nz) + 1e-6
    nx, ny, nz = nx / norm, ny / norm, nz / norm

    lx, ly, lz = -0.45, -0.58, 0.68
    l_len = np.sqrt(lx * lx + ly * ly + lz * lz)
    lx, ly, lz = lx / l_len, ly / l_len, lz / l_len
    diff = np.clip(nx * lx + ny * ly + nz * lz, 0.0, 1.0)

    hx, hy, hz = lx, ly, lz + 1.0
    h_len = np.sqrt(hx * hx + hy * hy + hz * hz)
    hx, hy, hz = hx / h_len, hy / h_len, hz / h_len
    spec = np.power(np.clip(nx * hx + ny * hy + nz * hz, 0.0, 1.0), gloss)

    lit = 0.28 + 0.78 * diff + (0.3 + 0.7 * depth) * trans
    rgb = np.empty((N, N, 3), dtype=np.float32)
    for c in range(3):
        rgb[:, :, c] = np.clip(base_rgb[:, :, c] * lit + spec * spec_s, 0.0, 1.0)
    return np.dstack([rgb, alpha])


def composite(layers):
    out = np.zeros((N, N, 4), dtype=np.float32)
    for layer in layers:
        sa = layer[:, :, 3:4]
        da = out[:, :, 3:4]
        out_a = sa + da * (1.0 - sa)
        out_rgb = (layer[:, :, :3] * sa + out[:, :, :3] * da * (1.0 - sa)) / np.maximum(out_a, 1e-6)
        out = np.concatenate([out_rgb, out_a], axis=2)
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8), mode="RGBA").resize(
        (SIZE, SIZE), Image.Resampling.LANCZOS
    )


def sd_circle(x, y, cx, cy, r):
    return np.hypot(x - cx, y - cy) - r


def sd_box(x, y, cx, cy, bx, by, rad=0.05, ang=0.0):
    ca, sa = np.cos(ang), np.sin(ang)
    dx, dy = x - cx, y - cy
    px = np.abs(dx * ca + dy * sa) - bx
    py = np.abs(-dx * sa + dy * ca) - by
    return np.hypot(np.maximum(px, 0.0), np.maximum(py, 0.0)) + np.minimum(np.maximum(px, py), 0.0) - rad


def render_chinese_jade():
    """1920s Art Deco Chinoiserie: carved imperial apple-jade bi-disc with gold clasps & cinnabar coral bead."""
    x, y = make_grid()
    m = marble(x, y, 6.2, 0.6)

    # Outer carved imperial jadeite bi-disc shifted slightly up for cinnabar drop
    cy = -0.06
    r = np.hypot(x, y - cy)
    ang = np.arctan2(y - cy, x)
    carve = 0.015 * np.sin(16.0 * ang)
    jade_d = np.maximum(r - (0.72 + carve), 0.28 - r)

    jade_col = np.empty((N, N, 3), dtype=np.float32)
    jade_col[:, :, 0] = 0.14 + 0.24 * m
    jade_col[:, :, 1] = 0.68 + 0.22 * m
    jade_col[:, :, 2] = 0.36 + 0.16 * m
    jade_layer = shade_sdf(jade_d, np.clip(jade_col, 0, 1), bevel=0.14, gloss=80.0, spec_s=0.9, trans=0.35)

    # Art Deco black onyx & gold geometric top bail and 4 cardinal clasps
    clasp_t = sd_box(x, y, 0.0, -0.76, 0.15, 0.12, rad=0.03)
    clasp_l = sd_box(x, y, -0.52, cy, 0.11, 0.08, rad=0.02)
    clasp_r = sd_box(x, y, 0.52, cy, 0.11, 0.08, rad=0.02)
    clasp_b = sd_box(x, y, 0.0, 0.44, 0.14, 0.10, rad=0.03)
    gold_d = np.minimum(np.minimum(clasp_t, clasp_b), np.minimum(clasp_l, clasp_r))
    gold_col = solid(0.95, 0.77, 0.28) * (0.9 + 0.14 * m[:, :, None])
    gold_layer = shade_sdf(gold_d, np.clip(gold_col, 0, 1), bevel=0.045, gloss=95.0, spec_s=0.95)

    # Glossy black onyx inlay bar in top bail
    onyx_d = sd_box(x, y, 0.0, -0.76, 0.08, 0.055, rad=0.015)
    onyx_layer = shade_sdf(onyx_d, solid(0.10, 0.10, 0.12), bevel=0.03, gloss=110.0, spec_s=0.95)

    # Center & lower carved cinnabar-red coral beads
    center_bead = sd_circle(x, y, 0.0, cy, 0.18)
    drop_bead = sd_circle(x, y, 0.0, 0.70, 0.17)
    cin_col = solid(0.92, 0.16, 0.14) * (0.88 + 0.18 * marble(x, y, 4.5, 2.0)[:, :, None])
    cin1 = shade_sdf(center_bead, np.clip(cin_col, 0, 1), bevel=0.14, gloss=76.0, spec_s=0.9, trans=0.28)
    cin2 = shade_sdf(drop_bead, np.clip(cin_col, 0, 1), bevel=0.14, gloss=76.0, spec_s=0.9, trans=0.28)

    # Tiny gold center floret dot
    dot_d = sd_circle(x, y, 0.0, cy, 0.06)
    dot_layer = shade_sdf(dot_d, solid(0.98, 0.84, 0.36), bevel=0.04, gloss=100.0, spec_s=0.95)

    return composite([jade_layer, gold_layer, onyx_layer, cin1, cin2, dot_layer])


def render_mayan_sun():
    """1920s–30s Mayan Revival / Taxco: stepped Mesoamerican antique gold & turquoise calendar medallion."""
    x, y = make_grid()
    m = marble(x, y, 5.5, 1.1)

    # Stepped Mayan Ziggurat / cross-square gold frame
    sq1 = sd_box(x, y, 0.0, 0.0, 0.62, 0.62, rad=0.06)
    sq2 = sd_box(x, y, 0.0, 0.0, 0.62, 0.62, rad=0.06, ang=np.pi / 4.0)
    bar_h = sd_box(x, y, 0.0, 0.0, 0.82, 0.24, rad=0.05)
    bar_v = sd_box(x, y, 0.0, 0.0, 0.24, 0.82, rad=0.05)
    base_d = np.minimum(np.minimum(sq1, sq2), np.minimum(bar_h, bar_v))

    # Carved antique burnished gold relief
    gold_col = np.empty((N, N, 3), dtype=np.float32)
    gold_col[:, :, 0] = 0.86 + 0.12 * m
    gold_col[:, :, 1] = 0.64 + 0.14 * m
    gold_col[:, :, 2] = 0.18 + 0.08 * m
    gold_layer = shade_sdf(base_d, np.clip(gold_col, 0, 1), bevel=0.09, gloss=85.0, spec_s=0.9, trans=0.18)

    # Deep obsidian stepped inner frame
    obs_d = sd_box(x, y, 0.0, 0.0, 0.44, 0.44, rad=0.05)
    obs_layer = shade_sdf(obs_d, solid(0.12, 0.11, 0.14), bevel=0.05, gloss=95.0, spec_s=0.88, trans=0.1)

    # Vivid Sleeping Beauty turquoise stepped mosaic tiles (center + 4 cardinal stones)
    t_center = sd_box(x, y, 0.0, 0.0, 0.26, 0.26, rad=0.05)
    t_n = sd_box(x, y, 0.0, -0.62, 0.11, 0.11, rad=0.03)
    t_s = sd_box(x, y, 0.0, 0.62, 0.11, 0.11, rad=0.03)
    t_w = sd_box(x, y, -0.62, 0.0, 0.11, 0.11, rad=0.03)
    t_e = sd_box(x, y, 0.62, 0.0, 0.11, 0.11, rad=0.03)
    turq_d = np.minimum(t_center, np.minimum(np.minimum(t_n, t_s), np.minimum(t_w, t_e)))

    tm = marble(x, y, 8.0, 0.3)
    turq_col = np.empty((N, N, 3), dtype=np.float32)
    turq_col[:, :, 0] = 0.08 + 0.10 * tm
    turq_col[:, :, 1] = 0.74 + 0.18 * tm
    turq_col[:, :, 2] = 0.78 + 0.16 * tm
    turq_layer = shade_sdf(turq_d, np.clip(turq_col, 0, 1), bevel=0.07, gloss=78.0, spec_s=0.88, trans=0.25)

    # Center sculpted gold Aztec sun glyph disc + coral center cabochon
    sun_ring = sd_circle(x, y, 0.0, 0.0, 0.16)
    sun_layer = shade_sdf(sun_ring, solid(0.96, 0.76, 0.26), bevel=0.05, gloss=95.0, spec_s=0.95)
    coral_dot = sd_circle(x, y, 0.0, 0.0, 0.085)
    coral_layer = shade_sdf(coral_dot, solid(0.92, 0.28, 0.18), bevel=0.06, gloss=85.0, spec_s=0.92)

    return composite([gold_layer, obs_layer, turq_layer, sun_layer, coral_layer])


def render_egyptian_lotus():
    """1920s Egyptian Revival Art Deco: cloisonné lotus fan brooch in lapis, turquoise, carnelian & gold."""
    x, y = make_grid()
    m = marble(x, y, 5.0, 2.2)

    # Fan-shaped Egyptian lotus silhouette built from 5 radiating petals + golden base bar
    cy = 0.32
    petals = []
    angles = [-0.62, -0.31, 0.0, 0.31, 0.62]
    lengths = [0.46, 0.56, 0.64, 0.56, 0.46]
    widths = [0.13, 0.145, 0.16, 0.145, 0.13]
    colors = [
        (0.10, 0.34, 0.84),  # Lapis blue
        (0.10, 0.72, 0.74),  # Turquoise
        (0.90, 0.20, 0.18),  # Carnelian red center
        (0.10, 0.72, 0.74),  # Turquoise
        (0.10, 0.34, 0.84),  # Lapis blue
    ]

    # Gold outer backing silhouette slightly larger than petals
    back_d = sd_box(x, y, 0.0, 0.44, 0.44, 0.16, rad=0.07)
    for ang, ln, wd in zip(angles, lengths, widths):
        px = np.sin(ang) * ln * 0.72
        py = cy - np.cos(ang) * ln * 0.72
        pd = sd_box(x, y, px, py, wd + 0.045, ln * 0.56 + 0.045, rad=0.11, ang=-ang)
        back_d = np.minimum(back_d, pd)

    gold_col = solid(0.94, 0.74, 0.26) * (0.90 + 0.15 * m[:, :, None])
    layers = [shade_sdf(back_d, np.clip(gold_col, 0, 1), bevel=0.08, gloss=90.0, spec_s=0.92, trans=0.18)]

    # Individual cloisonné enamel petals
    for ang, ln, wd, col_t in zip(angles, lengths, widths, colors):
        px = np.sin(ang) * ln * 0.72
        py = cy - np.cos(ang) * ln * 0.72
        pd = sd_box(x, y, px, py, wd * 0.76, ln * 0.46, rad=0.075, ang=-ang)
        c_arr = solid(*col_t) * (0.88 + 0.20 * m[:, :, None])
        layers.append(shade_sdf(pd, np.clip(c_arr, 0, 1), bevel=0.06, gloss=85.0, spec_s=0.92, trans=0.25))

    # Stepped Egyptian collar base with lapis & gold bars
    base_bar = sd_box(x, y, 0.0, 0.42, 0.40, 0.13, rad=0.05)
    layers.append(shade_sdf(base_bar, np.clip(gold_col, 0, 1), bevel=0.05, gloss=95.0, spec_s=0.95))

    lapis_bar = sd_box(x, y, 0.0, 0.42, 0.28, 0.06, rad=0.025)
    layers.append(shade_sdf(lapis_bar, solid(0.10, 0.28, 0.80), bevel=0.03, gloss=90.0, spec_s=0.9))

    # Scarab-gold sun orb at lotus heart
    orb = sd_circle(x, y, 0.0, 0.24, 0.12)
    layers.append(shade_sdf(orb, solid(0.98, 0.82, 0.34), bevel=0.07, gloss=100.0, spec_s=0.95))

    return composite(layers)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    items = [
        ("chinese-jade.png", render_chinese_jade),
        ("mayan-sun.png", render_mayan_sun),
        ("egyptian-lotus.png", render_egyptian_lotus),
    ]
    thumbs = []
    for name, fn in items:
        im = fn()
        out = OUT_DIR / name
        im.save(out, optimize=True)
        thumbs.append(im)
        print(f"Rendered {name} ({out.stat().st_size // 1024} KB)")

    cell = 180
    pad = 14
    sheet = Image.new("RGBA", (len(thumbs) * cell + (len(thumbs) + 1) * pad, cell + 2 * pad), (42, 14, 34, 255))
    for i, im in enumerate(thumbs):
        tile = Image.new("RGBA", (cell, cell), (64, 22, 50, 255))
        t = im.resize((cell - 16, cell - 16), Image.Resampling.LANCZOS)
        tile.paste(t, (8, 8), t)
        sheet.paste(tile, (pad + i * (cell + pad), pad))
    sheet.save(OUT_DIR.parent / "revival_preview.png")
    print("Saved revival_preview.png")


if __name__ == "__main__":
    main()
