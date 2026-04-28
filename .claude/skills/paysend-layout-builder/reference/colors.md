# Colors

## Brand palette (swatches used in accent / background pickers)

| Name | Hex | Notes |
|---|---|---|
| Black | `#0a0a0a` | default canvas bg (layouts 6) |
| Near-black | `#141414` | default canvas bg (layouts 1-5), always-dark UI text |
| Cyan | `#08ffce` | Paysend primary accent |
| Sky Blue | `#17bff2` | secondary accent |
| Indigo | `#4a57c5` | dark accent — needs white text on it |
| Teal | `#08c197` | |
| Lime | `#a0eb31` | |
| Yellow | `#f7e43d` | |
| Orange | `#f7ab3d` | |
| Red | `#ff574a` | |
| Purple | `#b75eff` | |
| Pink | `#fe94da` | |

---

## CSS variables

Every layout declares these on `#post-canvas`:

| Variable | Default | Purpose |
|---|---|---|
| `--accent` | `#08ffce` | accent strip, nameplate backgrounds, tag bg |
| `--text-on-accent` | `#141414` | text that sits **on** the accent color |
| `--bg-color` | `#0a0a0a` or `#141414` | canvas background color (layouts with a bg palette) |
| `--text-color` | `#fff` | main body / headline text |

---

## Contrast rules

### Accent color → `--text-on-accent`

Used for text inside colored tags / nameplates. Only **dark blue** needs white text.

```js
const DARK_ACCENT = new Set(['#4a57c5']);

function applyAccent(color) {
  canvas.style.setProperty('--accent', color);
  canvas.style.setProperty('--text-on-accent', DARK_ACCENT.has(color) ? '#fff' : '#141414');
}
```

### Background color → `--text-color`

Used for headline + body copy. Black and dark-blue backgrounds need white text; every other color in the palette is light enough for dark text.

```js
const DARK_BG = new Set(['#0a0a0a', '#141414', '#4a57c5']);

bgPalette.querySelectorAll('.color-swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    const c = sw.dataset.color;
    canvas.style.setProperty('--bg-color', c);
    const isDark = DARK_BG.has(c);
    canvas.style.setProperty('--text-color', isDark ? '#fff' : '#141414');
    canvas.classList.toggle('bg-light', !isDark);   // used by logo invert rules
  });
});
```

### `.bg-light` class effects

When the background is a light color the Paysend wordmark (white SVG) must be inverted to black. Also darken the logo divider.

```css
/* Default: white wordmark on dark bg */
.top-logos .logo-paysend { filter: brightness(0) invert(1); }

/* Light bg override */
#post-canvas.bg-light .top-logos .logo-paysend,
#post-canvas.bg-light .bottom-brand .logo-paysend { filter: none; }
#post-canvas.bg-light .top-logos .logo-divider    { background: rgba(20,20,20,0.55); }
```

---

## UI / shell colors

These are for the app chrome (header, controls panel) — **never** use them inside `#post-canvas`.

| Usage | Value |
|---|---|
| App background | `#f0f0f0` |
| Panel background | `#fff` |
| Border / dividers | `#e8e8e8` / `#f0f0f0` |
| Label text | `#888` / `#999` |
| Active toggle | `#141414` |
| Focus ring | `#17bff2` |
| Remove / destructive | `#e94560` |
