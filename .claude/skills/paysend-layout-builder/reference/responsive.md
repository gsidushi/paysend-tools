# Responsive — Preview scaling & breakpoints

## Core idea

The canvas is always rendered at its **full native resolution** (e.g. 1080×1350). A CSS `transform: scale(N)` is applied to the wrapper so it fits the visible area. The `transform-origin` is always `top left`.

This means:
- All px values in the canvas CSS are **true canvas pixels**, not viewport pixels.
- html2canvas exports at exactly `CANVAS_W × CANVAS_H` (scale: 1).
- Nothing on the canvas needs `vw`/`vh`/`%` units.

---

## scalePreview IIFE

Paste this at the bottom of every layout's `<script>` block. Change `CANVAS_W` / `CANVAS_H` to match the layout.

```js
(function scalePreview() {
  const CANVAS_W = 1080;   // ← change per layout
  const CANVAS_H = 1350;   // ← change per layout
  const PREVIEW_PAD = 64;
  const HEADER_H = 60;
  const wrapper = document.querySelector('.preview-wrapper');
  const cvs = document.getElementById('post-canvas');

  function update() {
    const w = window.innerWidth, h = window.innerHeight;
    let sidebarFrac;
    if      (w < 500)  sidebarFrac = 0;
    else if (w < 800)  sidebarFrac = 0.40;
    else if (w < 1200) sidebarFrac = 0.33;
    else               sidebarFrac = 0.25;

    let availW, availH;
    if (w < 500) {
      availW = w; availH = Infinity;
    } else {
      availW = w * (1 - sidebarFrac) - PREVIEW_PAD;
      availH = h - HEADER_H - 80;
    }

    const scale = Math.min(availW / CANVAS_W, availH / CANVAS_H);
    wrapper.style.width  = Math.round(CANVAS_W * scale) + 'px';
    wrapper.style.height = Math.round(CANVAS_H * scale) + 'px';
    cvs.style.transform  = `scale(${scale})`;
  }

  update();
  window.addEventListener('resize', update);
})();
```

---

## CSS sidebar breakpoints

The sidebar (`grid-template-columns`) narrows on small screens. Matches the JS `sidebarFrac` values above.

```css
.workspace { grid-template-columns: 1fr 25vw; }          /* > 1200px */
@media (max-width: 1199px) { .workspace { grid-template-columns: 1fr 33vw; } }
@media (max-width:  799px) { .workspace { grid-template-columns: 1fr 40vw; } }
```

---

## Mobile stacked layout (< 500px)

On phones the canvas fills the full width and the controls panel stacks below it. The preview wrapper **must not** clip, so `overflow` is opened.

```css
@media (max-width: 499px) {
  html, body { height: auto; overflow: auto; }
  .workspace {
    display: flex; flex-direction: column;
    overflow: visible; height: auto;
  }
  .preview-area {
    padding: 0; overflow: visible;
    justify-content: flex-start; align-items: stretch;
    flex-shrink: 0; height: auto;
  }
  .preview-wrapper {
    width: 100vw !important;
    border-radius: 0; box-shadow: none; flex-shrink: 0;
  }
  .preview-hint { display: none; }
  .controls {
    border-left: none; border-top: 1px solid #e8e8e8;
    height: auto; overflow-y: visible; flex: none;
  }
}
```

---

## Preview hint text

Always add below the wrapper. Hidden on mobile (see above).

```html
<p class="preview-hint">Preview scaled — exports 1080 × 1350</p>
```

---

## html2canvas export

```js
const CANVAS_W = 1080;
const CANVAS_H = 1350;

document.getElementById('download-btn').addEventListener('click', async () => {
  const btn = document.getElementById('download-btn');
  btn.disabled = true; btn.textContent = 'Exporting…';
  try {
    const result = await html2canvas(document.getElementById('post-canvas'), {
      scale: 1, useCORS: true, allowTaint: true,
      width: CANVAS_W, height: CANVAS_H,
    });
    const a = document.createElement('a');
    a.href = result.toDataURL('image/png');
    a.download = 'paysend-post.png';
    a.click();
  } finally {
    btn.disabled = false; btn.textContent = 'Download PNG';
  }
});
```

The script tag for html2canvas goes in `<head>`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
```
