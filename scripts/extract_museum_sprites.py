"""Extract clean transparent 320x320 PNG sprites from real V&A and Cleveland Museum
studio photographs (automatically handling both pitch-black AND clean white/grey
museum backdrops via adaptive corner-seeded flood-fill + edge un-premultiplication).
"""

import json
from collections import deque
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

RAW_DIR = Path("/Users/sublux/.gemini/antigravity/scratch/jewel-queen/assets/museum_raw")
OUT_DIR = Path("/Users/sublux/.gemini/antigravity/scratch/jewel-queen/assets/museum_jewels")
TARGET_SIZE = 320
PADDING = 0.06


def remove_studio_bg(img: Image.Image, tolerance: float = 38.0, step_tol: float = 14.0) -> Image.Image:
    rgba = img.convert("RGBA")
    arr = np.array(rgba, dtype=np.uint8)
    h, w, _ = arr.shape
    rgb = arr[:, :, :3].astype(np.float32)

    # Sample border pixels from all 4 corners to estimate studio backdrop color
    patch = min(14, h // 10, w // 10)
    corners = np.concatenate([
        rgb[:patch, :patch].reshape(-1, 3),
        rgb[:patch, -patch:].reshape(-1, 3),
        rgb[-patch:, :patch].reshape(-1, 3),
        rgb[-patch:, -patch:].reshape(-1, 3),
    ], axis=0)
    bg = np.median(corners, axis=0)
    bg_lum = 0.299 * bg[0] + 0.587 * bg[1] + 0.114 * bg[2]

    dist_bg = np.linalg.norm(rgb - bg, axis=2)

    # Flood-fill from outer perimeter allowing gentle studio lighting gradients
    visited = np.zeros((h, w), dtype=bool)
    q = deque()

    def seed(y, x):
        if not visited[y, x] and dist_bg[y, x] < tolerance * 1.15:
            visited[y, x] = True
            q.append((y, x))

    for x in range(w):
        seed(0, x)
        seed(h - 1, x)
    for y in range(h):
        seed(y, 0)
        seed(y, w - 1)

    max_dist = tolerance * 1.45
    while q:
        cy, cx = q.popleft()
        cr, cg, cb = rgb[cy, cx]
        for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
                d_bg = dist_bg[ny, nx]
                if d_bg < tolerance:
                    visited[ny, nx] = True
                    q.append((ny, nx))
                elif d_bg < max_dist:
                    # Allow smooth studio backdrop gradient transitions
                    nr, ng, nb = rgb[ny, nx]
                    step = abs(nr - cr) + abs(ng - cg) + abs(nb - cb)
                    if step < step_tol:
                        visited[ny, nx] = True
                        q.append((ny, nx))

    # Drop tiny disconnected floating background/dust specks (< 1.5% of main foreground)
    fg = ~visited
    labels = np.zeros((h, w), dtype=np.int32)
    cur = 0
    sizes = {}
    for y in range(h):
        for x in range(w):
            if fg[y, x] and labels[y, x] == 0:
                cur += 1
                cnt = 0
                dq = deque([(y, x)])
                labels[y, x] = cur
                while dq:
                    cy, cx = dq.popleft()
                    cnt += 1
                    for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                        if 0 <= ny < h and 0 <= nx < w and fg[ny, nx] and labels[ny, nx] == 0:
                            labels[ny, nx] = cur
                            dq.append((ny, nx))
                sizes[cur] = cnt

    if sizes:
        main_sz = max(sizes.values())
        # Keep significant pieces (e.g., pair of Paul Flato golden feet both > 15% of largest!)
        min_keep = max(90, int(main_sz * 0.04))
        for lbl, sz in sizes.items():
            if sz < min_keep:
                visited[labels == lbl] = True

    # For pitch-black museum backdrops, also clear enclosed neutral pitch-black filigree holes
    if bg_lum < 18.0:
        max_c = rgb.max(axis=2)
        min_c = rgb.min(axis=2)
        chroma = max_c - min_c
        holes = (max_c < 14.0) & (chroma < 8.0) & (~visited)
        bg_mask = visited | holes
    else:
        bg_mask = visited

    alpha = np.where(bg_mask, 0.0, 255.0).astype(np.float32)

    # Smooth 2px border fringe feathering
    fringe = np.zeros((h, w), dtype=bool)
    for dy in (-2, -1, 0, 1, 2):
        for dx in (-2, -1, 0, 1, 2):
            if dy == 0 and dx == 0:
                continue
            shifted = np.zeros_like(bg_mask)
            y0s, y1s = max(0, dy), h + min(0, dy)
            x0s, x1s = max(0, dx), w + min(0, dx)
            y0d, y1d = max(0, -dy), h + min(0, -dy)
            x0d, x1d = max(0, -dx), w + min(0, -dx)
            shifted[y0d:y1d, x0d:x1d] = bg_mask[y0s:y1s, x0s:x1s]
            fringe |= (shifted & ~bg_mask)

    ramp = np.clip((dist_bg - tolerance * 0.35) / (tolerance * 0.9), 0.0, 1.0) * 255.0
    alpha = np.where(fringe, np.minimum(alpha, ramp), alpha)
    alpha_img = Image.fromarray(alpha.astype(np.uint8), mode="L").filter(
        ImageFilter.GaussianBlur(radius=0.7)
    )
    arr[:, :, 3] = np.array(alpha_img)

    # Un-premultiply semi-transparent halo against studio bg
    a_norm = arr[:, :, 3].astype(np.float32) / 255.0
    semi = (a_norm > 0.05) & (a_norm < 0.90)
    for c in range(3):
        ch = arr[:, :, c].astype(np.float32)
        unp = np.clip((ch - bg[c] * (1.0 - a_norm)) / np.maximum(a_norm, 0.25), 0, 255)
        arr[:, :, c] = np.where(semi, unp, ch).astype(np.uint8)

    return Image.fromarray(arr, mode="RGBA")


def crop_and_center(img: Image.Image) -> Image.Image:
    alpha = np.array(img.split()[3])
    ys, xs = np.where(alpha > 26)
    if len(xs) == 0 or len(ys) == 0:
        return img.resize((TARGET_SIZE, TARGET_SIZE), Image.Resampling.LANCZOS)
    cropped = img.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))
    cw, ch = cropped.size
    inner = int(TARGET_SIZE * (1.0 - 2 * PADDING))
    scale = min(inner / cw, inner / ch)
    nw, nh = max(1, int(round(cw * scale))), max(1, int(round(ch * scale)))
    resized = cropped.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (TARGET_SIZE, TARGET_SIZE), (0, 0, 0, 0))
    canvas.paste(resized, ((TARGET_SIZE - nw) // 2, (TARGET_SIZE - nh) // 2), resized)
    return canvas


def extract_curated(selection: list[tuple[str, str, float]]):
    """selection: list of (output_slug, local_jpg_path, tolerance)"""
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    thumbs = []
    for slug, src_path, tol in selection:
        im = Image.open(src_path)
        clean = remove_studio_bg(im, tolerance=tol)
        sprite = crop_and_center(clean)
        out_p = OUT_DIR / f"{slug}.png"
        sprite.save(out_p, optimize=True)
        thumbs.append((slug, sprite))
        print(f"Extracted {slug}.png ({out_p.stat().st_size // 1024} KB)")

    cols = 6
    rows = (len(thumbs) + cols - 1) // cols
    cell, pad = 160, 12
    sheet = Image.new("RGBA", (cols * cell + (cols + 1) * pad, rows * cell + (rows + 1) * pad), (34, 10, 28, 255))
    for i, (slug, sp) in enumerate(thumbs):
        r, c = divmod(i, cols)
        tile = Image.new("RGBA", (cell, cell), (56, 18, 46, 255))
        t = sp.resize((cell - 16, cell - 16), Image.Resampling.LANCZOS)
        tile.paste(t, (8, 8), t)
        sheet.paste(tile, (pad + c * (cell + pad), pad + r * (cell + pad)))
    sheet.save(OUT_DIR.parent / "curated_museum_sheet.png")
    print("Saved curated_museum_sheet.png")
