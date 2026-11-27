---
name: wcag22-accessibility-check
description: >-
  Audit and auto-fix web interfaces for WCAG 2.2 Level AA compliance across
  pinch-zoom/reflow (1.4.4, 1.4.10), text and UI contrast (1.4.3, 1.4.11),
  keyboard playability and focus visibility (2.1.1, 2.4.7), dragging
  alternatives (2.5.7), minimum 24x24px target sizes (2.5.8), and ARIA/label
  semantics (1.3.1, 4.1.2). Use whenever reviewing accessibility, after commits
  triggered by the post-commit accessibility hook, or before shipping UI edits.
---

# WCAG 2.2 Level AA Accessibility Check

Run deterministic static + contrast + ARIA checks first, apply safe auto-fixes, verify any UI/layout changes in a live mobile browser (`390×844` and `390×422`), and re-commit fixes cleanly with `[skip-a11y]` so post-commit hooks never loop.

## Workflow

1. **Run the automated WCAG 2.2 AA checker** from the repo root:
   ```bash
   node .agents/skills/wcag22-accessibility-check/scripts/wcag22_check.mjs
   ```
   Pass `--fix` to apply safe deterministic fixes (viewport zoom lock removal, `outline: none` cleanup, contrast floor restoration, missing `<dialog aria-labelledby>` wiring):
   ```bash
   node .agents/skills/wcag22-accessibility-check/scripts/wcag22_check.mjs --fix
   ```
   Pass `--json` for machine-readable output.

2. **Fix any remaining manual findings** reported by the script:
   - **Zoom & Reflow (`1.4.4`, `1.4.10`):** Keep `<meta name="viewport">` free of `user-scalable=no` and `maximum-scale=1.0`; keep `html, body` vertically scrollable (`min-height: 100dvh; overflow-y: auto`).
   - **Contrast (`1.4.3`, `1.4.11`):** Keep normal text `>= 4.5:1` and interactive control borders `>= 3.0:1` over dark obsidian/velvet surfaces (`#030305`–`#161822`). Never lower opacity on an entire card containing text.
   - **Target Size (`2.5.8`):** Ensure every clickable button, link, pill, or icon control is `>= 24×24 CSS px` (`>= 28px` preferred for touch).
   - **Keyboard & Dragging (`2.1.1`, `2.4.7`, `2.5.7`):** Keep every interactive element reachable via `Tab` with a visible `:focus-visible` outline, roving `tabindex` + Arrow/Enter/Escape on grids, and non-drag alternatives (pan buttons / arrow keys) for zoomed pan views.
   - **ARIA & Labels (`1.3.1`, `4.1.2`):** Associate every `<input>`/`<select>`/`<textarea>` with `<label for>` or `aria-label`; give every `<dialog>` `aria-labelledby`; ensure `role="tablist"` children carry `role="tab"` and `aria-selected`; keep `aria-pressed` synced on toggle buttons.

3. **Live Browser Verification (when layout, board, or modal CSS/JS changed):**
   - Inspect at `390×844` (standard mobile) and `390×422` (simulated 200% zoom / landscape) to verify zero collapsed containers, working vertical scroll, keyboard `Tab`/`Arrow`/`Enter` flow, and zero console errors.

4. **Re-commit cleanly without triggering a hook loop:**
   ```bash
   git add -A
   git commit -m "a11y: fix WCAG 2.2 AA accessibility issues [skip-a11y]"
   ```
