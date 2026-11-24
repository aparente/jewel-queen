"""Convert raw generated jewelry studio photos on black backgrounds into
crisp, centered, square transparent PNG sprites with clean openwork cutouts.
"""

from collections import deque
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

RAW_DIR = Path("/Users/sublux/.gemini/antigravity/scratch/jewel-queen/assets/raw")
OUT_DIR = Path("/Users/sublux/.gemini/antigravity/scratch/jewel-queen/assets/jewels")
TARGET_SIZE = 320
PADDING_RATIO = 0.05


KEEP_INTERIOR_BLACK = {"deco-clip", "kjl-panther"}


def remove_black_bg(img: Image.Image, punch_holes: bool = True) -> Image.Image:
    rgba = img.convert("RGBA")
    arr = np.array(rgba, dtype=np.uint8)
    h, w, _ = arr.shape

    rgb = arr[:, :, :3].astype(np.float32)
    corners = np.concatenate([
        rgb[:16, :16].reshape(-1, 3),
        rgb[:16, -16:].reshape(-1, 3),
        rgb[-16:, :16].reshape(-1, 3),
        rgb[-16:, -16:].reshape(-1, 3),
    ], axis=0)
    bg_color = np.median(corners, axis=0)

    dist = np.linalg.norm(rgb - bg_color, axis=2)
    lum = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
    max_c = rgb.max(axis=2)
    min_c = rgb.min(axis=2)
    chroma = max_c - min_c

    # 1. Exterior flood-fill (handles soft dark JPEG smudges around edges)
    bg_candidate = ((dist < 52.0) & (lum < 48.0) & (chroma < 26.0)) | ((dist < 28.0) & (lum < 30.0))

    visited = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if bg_candidate[y, x] and not visited[y, x]:
                visited[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if bg_candidate[y, x] and not visited[y, x]:
                visited[y, x] = True
                q.append((y, x))

    while q:
        cy, cx = q.popleft()
        for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and bg_candidate[ny, nx]:
                visited[ny, nx] = True
                q.append((ny, nx))

    # 2. Keep only the main connected foreground jewel (removes any stray floating dust specks)
    fg = ~visited
    labels = np.zeros((h, w), dtype=np.int32)
    cur_label = 0
    sizes = {}
    for y in range(h):
        for x in range(w):
            if fg[y, x] and labels[y, x] == 0:
                cur_label += 1
                cnt = 0
                dq = deque([(y, x)])
                labels[y, x] = cur_label
                while dq:
                    cy, cx = dq.popleft()
                    cnt += 1
                    for ny, nx in ((cy - 1, cx), (cy + 1, cx), (cy, cx - 1), (cy, cx + 1)):
                        if 0 <= ny < h and 0 <= nx < w and fg[ny, nx] and labels[ny, nx] == 0:
                            labels[ny, nx] = cur_label
                            dq.append((ny, nx))
                sizes[cur_label] = cnt

    if sizes:
        main_label = max(sizes, key=sizes.get)
        # Drop tiny isolated specks (< 0.5% of main jewel area)
        min_keep = max(80, int(sizes[main_label] * 0.005))
        for lbl, sz in sizes.items():
            if sz < min_keep:
                visited[labels == lbl] = True

    # 3. Punch out pure neutral pitch-black openwork filigree holes (skipped for black onyx/enamel pieces)
    if punch_holes:
        openwork_holes = (max_c < 14.0) & (chroma < 8.0) & (~visited)
        bg_mask = visited | openwork_holes
    else:
        bg_mask = visited

    alpha = np.where(bg_mask, 0.0, 255.0).astype(np.float32)

    # Soft fringe feathering around background boundary
    fringe = np.zeros((h, w), dtype=bool)
    for dy in (-2, -1, 0, 1, 2):
        for dx in (-2, -1, 0, 1, 2):
            if dy == 0 and dx == 0:
                continue
            shifted = np.zeros_like(bg_mask)
            y0_s, y1_s = max(0, dy), h + min(0, dy)
            x0_s, x1_s = max(0, dx), w + min(0, dx)
            y0_d, y1_d = max(0, -dy), h + min(0, -dy)
            x0_d, x1_d = max(0, -dx), w + min(0, -dx)
            shifted[y0_d:y1_d, x0_d:x1_d] = bg_mask[y0_s:y1_s, x0_s:x1_s]
            fringe |= (shifted & ~bg_mask)

    ramp = np.clip((dist - 14.0) / 40.0, 0.0, 1.0) * 255.0
    alpha = np.where(fringe, np.minimum(alpha, ramp), alpha)

    alpha_img = Image.fromarray(alpha.astype(np.uint8), mode="L").filter(
        ImageFilter.GaussianBlur(radius=0.75)
    )
    arr[:, :, 3] = np.array(alpha_img)

    # Un-premultiply semi-transparent edge pixels against black background
    a_norm = arr[:, :, 3].astype(np.float32) / 255.0
    semi = (a_norm > 0.05) & (a_norm < 0.92)
    for c in range(3):
        ch = arr[:, :, c].astype(np.float32)
        unpremult = np.clip((ch - bg_color[c] * (1.0 - a_norm)) / np.maximum(a_norm, 0.22), 0, 255)
        arr[:, :, c] = np.where(semi, unpremult, ch).astype(np.uint8)

    return Image.fromarray(arr, mode="RGBA")


def crop_and_center(img: Image.Image, target_size: int = TARGET_SIZE) -> Image.Image:
    alpha = np.array(img.split()[3])
    ys, xs = np.where(alpha > 24)
    if len(xs) == 0 or len(ys) == 0:
        return img.resize((target_size, target_size), Image.Resampling.LANCZOS)

    x0, x1 = int(xs.min()), int(xs.max()) + 1
    y0, y1 = int(ys.min()), int(ys.max()) + 1
    cropped = img.crop((x0, y0, x1, y1))

    cw, ch = cropped.size
    inner_max = int(target_size * (1.0 - 2 * PADDING_RATIO))
    scale = min(inner_max / cw, inner_max / ch)
    nw, nh = max(1, int(round(cw * scale))), max(1, int(round(ch * scale)))
    resized = cropped.resize((nw, nh), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
    ox = (target_size - nw) // 2
    oy = (target_size - nh) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    raw_files = sorted([p for p in RAW_DIR.iterdir() if p.suffix.lower() in {".png", ".jpg", ".jpeg"}])
    sprites = []
    for raw_path in raw_files:
        im = Image.open(raw_path)
        clean = remove_black_bg(im, punch_holes=(raw_path.stem not in KEEP_INTERIOR_BLACK))
        sprite = crop_and_center(clean, TARGET_SIZE)
        out_name = raw_path.stem + ".png"
        out_path = OUT_DIR / out_name
        sprite.save(out_path, optimize=True)
        sprites.append((out_name, sprite))
        print(f"Saved {out_name} ({out_path.stat().st_size // 1024} KB)")

    cols = 4
    rows = (len(sprites) + cols - 1) // cols
    cell = 200
    pad = 16
    sheet = Image.new("RGBA", (cols * cell + (cols + 1) * pad, rows * cell + (rows + 1) * pad), (38, 12, 32, 255))
    for i, (name, sp) in enumerate(sprites):
        r, c = divmod(i, cols)
        x = pad + c * (cell + pad)
        y = pad + r * (cell + pad)
        tile = Image.new("RGBA", (cell, cell), (58, 18, 46, 255))
        thumb = sp.resize((cell - 20, cell - 20), Image.Resampling.LANCZOS)
        tile.paste(thumb, (10, 10), thumb)
        sheet.paste(tile, (x, y))
    sheet.save(OUT_DIR.parent / "preview_sheet.png")
    print("Done.")


if __name__ == "__main__":
    main()
