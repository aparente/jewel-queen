"""Render 5 studio-lit, 3D beveled, glossy translucent Bakelite & Catalin
vintage jewelry sprites (320x320 transparent PNGs) using NumPy SDF shading,
Phong specular highlights, subsurface resin glow, and marbled Bakelite veining.
"""

from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

OUT_DIR = Path("/Users/sublux/.gemini/antigravity/scratch/jewel-queen/assets/jewels")
SIZE = 320
SS = 2  # 2x supersampling (640x640 -> crisp 320x320)
N = SIZE * SS


def make_grid():
    lin = np.linspace(-1.0, 1.0, N, dtype=np.float32)
    x, y = np.meshgrid(lin, lin)
    return x, y


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0 + 1e-8), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def marble_noise(x, y, freq=4.5, phase=0.0):
    v = (
        np.sin(x * freq + np.sin(y * freq * 0.9 + phase) * 1.4) * 0.5
        + np.cos(y * freq * 1.2 - np.sin(x * freq * 0.7 - phase) * 1.2) * 0.35
        + np.sin((x + y) * freq * 1.8 + phase) * 0.15
    )
    return 0.5 + 0.5 * v


def shade_sdf(dist, base_rgb, x, y, bevel=0.11, gloss=48.0, spec_strength=0.72, translucency=0.25):
    """Turn a 2D signed distance field (negative inside) into a lush glossy 3D Bakelite layer."""
    alpha = smoothstep(0.012, -0.006, dist)
    # Height field dome inside shape
    depth = np.clip(-dist / bevel, 0.0, 1.0)
    height = np.sqrt(np.clip(1.0 - (1.0 - depth) ** 2, 0.0, 1.0)) * 0.85 + 0.15 * depth

    # Surface normals from gradient of height
    gy, gx = np.gradient(height)
    scale = 18.0
    nx = -gx * scale
    ny = -gy * scale
    nz = np.ones_like(nx)
    norm = np.sqrt(nx * nx + ny * ny + nz * nz) + 1e-6
    nx, ny, nz = nx / norm, ny / norm, nz / norm

    # Primary warm studio key light (top-left) + cool rim bounce (bottom-right)
    lx, ly, lz = -0.48, -0.58, 0.66
    l_len = np.sqrt(lx * lx + ly * ly + lz * lz)
    lx, ly, lz = lx / l_len, ly / l_len, lz / l_len

    diff = np.clip(nx * lx + ny * ly + nz * lz, 0.0, 1.0)
    # Halfway vector for glossy Bakelite specular highlight
    hx, hy, hz = lx, ly, lz + 1.0
    h_len = np.sqrt(hx * hx + hy * hy + hz * hz)
    hx, hy, hz = hx / h_len, hy / h_len, hz / h_len
    spec = np.power(np.clip(nx * hx + ny * hy + nz * hz, 0.0, 1.0), gloss)

    # Secondary soft studio fill highlight on lower-right rim
    rim = np.clip(nx * 0.55 + ny * 0.55 + nz * 0.3, 0.0, 1.0) * (1.0 - depth * 0.6)

    # Subsurface translucent glow toward center/edges
    subsurface = (0.35 + 0.65 * depth) * translucency

    ambient = 0.28
    lit = ambient + 0.78 * diff + subsurface
    rgb = np.empty((N, N, 3), dtype=np.float32)
    for c in range(3):
        ch = base_rgb[:, :, c] * lit + rim * 0.18 * base_rgb[:, :, c] + spec * spec_strength
        rgb[:, :, c] = np.clip(ch, 0.0, 1.0)

    rgba = np.dstack([rgb, alpha])
    return rgba


def composite(layers):
    out = np.zeros((N, N, 4), dtype=np.float32)
    for layer in layers:
        sa = layer[:, :, 3:4]
        da = out[:, :, 3:4]
        out_a = sa + da * (1.0 - sa)
        out_rgb = (layer[:, :, :3] * sa + out[:, :, :3] * da * (1.0 - sa)) / np.maximum(out_a, 1e-6)
        out = np.concatenate([out_rgb, out_a], axis=2)
    img = Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8), mode="RGBA")
    return img.resize((SIZE, SIZE), Image.Resampling.LANCZOS)


def sd_circle(x, y, cx, cy, r):
    return np.hypot(x - cx, y - cy) - r


def sd_ellipse(x, y, cx, cy, rx, ry, ang=0.0):
    ca, sa = np.cos(ang), np.sin(ang)
    dx, dy = x - cx, y - cy
    ux = dx * ca + dy * sa
    uy = -dx * sa + dy * ca
    k0 = np.hypot(ux / rx, uy / ry)
    k1 = np.hypot(ux / (rx * rx), uy / (ry * ry)) + 1e-6
    return k0 * (k0 - 1.0) / k1


def sd_segment(x, y, ax, ay, bx, by, r):
    pax, pay = x - ax, y - ay
    bax, bay = bx - ax, by - ay
    h = np.clip((pax * bax + pay * bay) / (bax * bax + bay * bay + 1e-6), 0.0, 1.0)
    return np.hypot(pax - bax * h, pay - bay * h) - r


def sd_box(x, y, cx, cy, bx, by, rad=0.06, ang=0.0):
    ca, sa = np.cos(ang), np.sin(ang)
    dx, dy = x - cx, y - cy
    px = np.abs(dx * ca + dy * sa) - bx
    py = np.abs(-dx * sa + dy * ca) - by
    return np.hypot(np.maximum(px, 0.0), np.maximum(py, 0.0)) + np.minimum(np.maximum(px, py), 0.0) - rad


def solid_color(r, g, b):
    arr = np.empty((N, N, 3), dtype=np.float32)
    arr[:, :, 0] = r
    arr[:, :, 1] = g
    arr[:, :, 2] = b
    return arr


def render_bakelite_cherries():
    """Glossy carved cherry-red Bakelite twin cherries with butterscotch stems & apple-green leaves."""
    x, y = make_grid()
    m = marble_noise(x, y, 5.0, 0.4)

    # Butterscotch stems
    stem1 = sd_segment(x, y, -0.02, -0.45, -0.34, 0.22, 0.048)
    stem2 = sd_segment(x, y, 0.04, -0.45, 0.34, 0.28, 0.048)
    stems_d = np.minimum(stem1, stem2)
    butter = solid_color(0.92, 0.65, 0.18) * (0.88 + 0.22 * m[:, :, None])
    stems_layer = shade_sdf(stems_d, butter, x, y, bevel=0.045, gloss=55.0, spec_strength=0.65)

    # Carved apple-green Bakelite leaves
    leaf1 = sd_ellipse(x, y, -0.28, -0.48, 0.34, 0.16, ang=-0.32)
    leaf2 = sd_ellipse(x, y, 0.26, -0.52, 0.32, 0.15, ang=0.38)
    # Subtle carved vein groove
    vein1 = np.exp(-((y + 0.48 - (x + 0.28) * 0.32) ** 2) / 0.0012) * 0.12
    leaves_d = np.minimum(leaf1, leaf2)
    green = solid_color(0.14, 0.62, 0.26) * (0.85 + 0.26 * m[:, :, None] - vein1[:, :, None])
    leaves_layer = shade_sdf(leaves_d, np.clip(green, 0, 1), x, y, bevel=0.11, gloss=62.0, spec_strength=0.72)

    # Tiny gold ribbon knot at stem top
    knot_d = sd_ellipse(x, y, 0.0, -0.46, 0.12, 0.08)
    gold = solid_color(0.96, 0.78, 0.32)
    knot_layer = shade_sdf(knot_d, gold, x, y, bevel=0.06, gloss=90.0, spec_strength=0.9)

    # Plump glossy cherry-red translucent Bakelite cherries
    c1 = sd_circle(x, y, -0.34, 0.34, 0.33)
    c2 = sd_circle(x, y, 0.34, 0.38, 0.33)
    red_base = solid_color(0.88, 0.09, 0.18) * (0.85 + 0.24 * marble_noise(x, y, 4.0, 1.3)[:, :, None])
    cherry1 = shade_sdf(c1, np.clip(red_base, 0, 1), x, y, bevel=0.28, gloss=72.0, spec_strength=0.92, translucency=0.32)
    cherry2 = shade_sdf(c2, np.clip(red_base, 0, 1), x, y, bevel=0.28, gloss=72.0, spec_strength=0.92, translucency=0.32)

    return composite([stems_layer, leaves_layer, knot_layer, cherry1, cherry2])


def render_bakelite_bangle():
    """Chunky carved Philadelphia butterscotch & tortoiseshell Bakelite bangle."""
    x, y = make_grid()
    r = np.hypot(x, y)
    ang = np.arctan2(y, x)

    # Scalloped carved outer rim + smooth inner bore
    flute = 0.038 * np.cos(12.0 * ang)
    outer = r - (0.80 + flute)
    inner = 0.43 - r
    ring_d = np.maximum(outer, inner)

    # Rich swirled butterscotch & amber tortoiseshell Bakelite marble
    swirl = marble_noise(x * 1.4, y * 1.4, 5.2, 0.8)
    # Carved Art Deco diagonal ribs highlighted in deeper caramel
    rib = 0.5 + 0.5 * np.sin(12.0 * ang + r * 5.0)
    col = np.empty((N, N, 3), dtype=np.float32)
    col[:, :, 0] = 0.78 + 0.20 * swirl - 0.14 * rib
    col[:, :, 1] = 0.44 + 0.28 * swirl - 0.15 * rib
    col[:, :, 2] = 0.06 + 0.10 * swirl
    bangle = shade_sdf(ring_d, np.clip(col, 0, 1), x, y, bevel=0.16, gloss=68.0, spec_strength=0.88, translucency=0.32)
    return composite([bangle])


def render_bakelite_applejuice():
    """Translucent golden Applejuice Bakelite hoop inlaid with cherry-red & ivory polka dots."""
    x, y = make_grid()
    r = np.hypot(x, y)
    ring_d = np.maximum(r - 0.80, 0.44 - r)

    # Translucent golden applejuice glow
    swirl = marble_noise(x, y, 3.6, 2.1)
    base = np.empty((N, N, 3), dtype=np.float32)
    base[:, :, 0] = 0.96 - 0.08 * swirl
    base[:, :, 1] = 0.72 + 0.12 * swirl
    base[:, :, 2] = 0.18 + 0.10 * swirl

    # Inlaid cherry-red & cream-ivory Bakelite polka dots around the ring!
    for i in range(10):
        a = (i / 10.0) * 2.0 * np.pi
        cx, cy = 0.62 * np.cos(a), 0.62 * np.sin(a)
        dot_mask = smoothstep(0.085, 0.065, np.hypot(x - cx, y - cy))
        if i % 2 == 0:
            dc = (0.86, 0.11, 0.20)  # Cherry red Bakelite dot
        else:
            dc = (0.98, 0.94, 0.84)  # Cream ivory Bakelite dot
        for c in range(3):
            base[:, :, c] = base[:, :, c] * (1.0 - dot_mask) + dc[c] * dot_mask

    hoop = shade_sdf(ring_d, np.clip(base, 0, 1), x, y, bevel=0.17, gloss=80.0, spec_strength=0.92, translucency=0.36)
    return composite([hoop])


def render_bakelite_scottie():
    """Adorable carved jade-green Bakelite Scottie dog novelty pin with cherry-red bow collar."""
    x, y = make_grid()
    # Build unmistakable Scottie dog silhouette (facing right)
    body = sd_box(x, y, -0.08, 0.12, 0.36, 0.22, rad=0.14)
    head = sd_box(x, y, 0.32, -0.22, 0.22, 0.18, rad=0.10, ang=0.06)
    snout = sd_box(x, y, 0.56, -0.18, 0.14, 0.11, rad=0.08)
    neck = sd_box(x, y, 0.18, -0.05, 0.14, 0.18, rad=0.07, ang=-0.2)
    ear1 = sd_ellipse(x, y, 0.22, -0.48, 0.075, 0.16, ang=-0.16)
    ear2 = sd_ellipse(x, y, 0.35, -0.47, 0.07, 0.15, ang=0.12)
    tail = sd_ellipse(x, y, -0.52, -0.12, 0.075, 0.22, ang=-0.38)
    leg1 = sd_box(x, y, -0.34, 0.44, 0.09, 0.18, rad=0.06)
    leg2 = sd_box(x, y, 0.16, 0.44, 0.09, 0.18, rad=0.06)

    dog_d = body
    for part in (head, snout, neck, ear1, ear2, tail, leg1, leg2):
        dog_d = np.minimum(dog_d, part)

    m = marble_noise(x, y, 5.5, 0.9)
    jade = np.empty((N, N, 3), dtype=np.float32)
    jade[:, :, 0] = 0.09 + 0.12 * m
    jade[:, :, 1] = 0.58 + 0.22 * m
    jade[:, :, 2] = 0.36 + 0.14 * m
    dog_layer = shade_sdf(dog_d, np.clip(jade, 0, 1), x, y, bevel=0.13, gloss=64.0, spec_strength=0.82, translucency=0.28)

    # Cherry-red Bakelite collar & cute bow
    collar_d = sd_box(x, y, 0.21, -0.02, 0.19, 0.055, rad=0.035, ang=-0.38)
    bow_l = sd_ellipse(x, y, 0.32, 0.07, 0.10, 0.065, ang=0.4)
    bow_r = sd_ellipse(x, y, 0.17, 0.12, 0.09, 0.06, ang=-0.3)
    collar_all = np.minimum(collar_d, np.minimum(bow_l, bow_r))
    cherry = solid_color(0.90, 0.11, 0.22)
    collar_layer = shade_sdf(collar_all, cherry, x, y, bevel=0.05, gloss=75.0, spec_strength=0.88)

    # Sparkling brass-and-cream eye + glossy nose button
    eye_d = sd_circle(x, y, 0.40, -0.26, 0.052)
    eye_layer = shade_sdf(eye_d, solid_color(0.98, 0.85, 0.38), x, y, bevel=0.04, gloss=95.0, spec_strength=0.95)
    nose_d = sd_circle(x, y, 0.72, -0.23, 0.045)
    nose_layer = shade_sdf(nose_d, solid_color(0.14, 0.08, 0.08), x, y, bevel=0.04, gloss=95.0, spec_strength=0.9)

    return composite([dog_layer, collar_layer, eye_layer, nose_layer])


def render_bakelite_clip():
    """Laminated 1930s Art Deco Bakelite chevron dress clip (turquoise, cream, cherry & butterscotch)."""
    x, y = make_grid()
    # Stepped shield / chevron silhouette
    top = sd_box(x, y, 0.0, -0.34, 0.56, 0.24, rad=0.08)
    mid = sd_box(x, y, 0.0, 0.04, 0.46, 0.28, rad=0.08)
    bot = sd_box(x, y, 0.0, 0.38, 0.30, 0.22, rad=0.08)
    clip_d = np.minimum(top, np.minimum(mid, bot))

    # Diagonal laminated Catalin stripes
    stripe = y + np.abs(x) * 0.45
    col = np.empty((N, N, 3), dtype=np.float32)
    # 4 crisp laminated bands: cherry -> cream -> turquoise -> butterscotch
    c_cherry = np.array([0.88, 0.12, 0.24], dtype=np.float32)
    c_cream = np.array([0.97, 0.93, 0.82], dtype=np.float32)
    c_turq = np.array([0.10, 0.68, 0.72], dtype=np.float32)
    c_butter = np.array([0.95, 0.68, 0.16], dtype=np.float32)

    m = marble_noise(x, y, 5.0, 1.7)
    for idx in range(3):
        ch = np.where(
            stripe < -0.18,
            c_cherry[idx],
            np.where(
                stripe < 0.04,
                c_cream[idx],
                np.where(stripe < 0.34, c_turq[idx], c_butter[idx]),
            ),
        )
        col[:, :, idx] = np.clip(ch * (0.90 + 0.16 * m), 0.0, 1.0)

    clip_layer = shade_sdf(clip_d, col, x, y, bevel=0.11, gloss=72.0, spec_strength=0.88, translucency=0.25)

    # Gold Deco center bar accent
    bar_d = sd_box(x, y, 0.0, -0.06, 0.065, 0.34, rad=0.03)
    bar_layer = shade_sdf(bar_d, solid_color(0.96, 0.78, 0.30), x, y, bevel=0.05, gloss=95.0, spec_strength=0.95)
    return composite([clip_layer, bar_layer])


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    items = [
        ("bakelite-cherries.png", render_bakelite_cherries),
        ("bakelite-bangle.png", render_bakelite_bangle),
        ("bakelite-applejuice.png", render_bakelite_applejuice),
        ("bakelite-scottie.png", render_bakelite_scottie),
        ("bakelite-clip.png", render_bakelite_clip),
    ]
    thumbs = []
    for name, fn in items:
        im = fn()
        out_path = OUT_DIR / name
        im.save(out_path, optimize=True)
        thumbs.append(im)
        print(f"Rendered {name} ({out_path.stat().st_size // 1024} KB)")

    # Quick contact sheet for visual QA
    cell = 180
    pad = 14
    sheet = Image.new("RGBA", (len(thumbs) * cell + (len(thumbs) + 1) * pad, cell + 2 * pad), (42, 14, 34, 255))
    for i, im in enumerate(thumbs):
        tile = Image.new("RGBA", (cell, cell), (64, 22, 50, 255))
        t = im.resize((cell - 16, cell - 16), Image.Resampling.LANCZOS)
        tile.paste(t, (8, 8), t)
        sheet.paste(tile, (pad + i * (cell + pad), pad))
    sheet.save(OUT_DIR.parent / "bakelite_preview.png")
    print("Saved bakelite_preview.png")


if __name__ == "__main__":
    main()
