# Typography

## Font family

**GT Standard** — loaded via `@font-face` from `../fonts/` (relative to the layout file).

```css
@font-face {
  font-family: 'GT Standard';
  src: url('../fonts/GT-Standard-L-Standard-Regular.woff2') format('woff2');
  font-weight: 400; font-style: normal;
}
@font-face {
  font-family: 'GT Standard';
  src: url('../fonts/GT-Standard-L-Standard-Semibold.woff2') format('woff2');
  font-weight: 600; font-style: normal;
}
```

Always set the fallback stack: `font-family: 'GT Standard', -apple-system, BlinkMacSystemFont, sans-serif;`

---

## Canvas text roles

| Role | Size | Weight | Line-height | Letter-spacing | Color |
|---|---|---|---|---|---|
| Headline | 104 px (auto-fit down to 48 px) | 600 | 0.95 | −1.04 px | `var(--text-color, #fff)` |
| Body copy | 36 px | 400 | 0.95 | −0.18 px | `var(--text-color, #fff)` |
| News tag | 28 px | 600 | 1 | −0.14 px | `#141414` (always dark) |
| Badge — location | 32 px | 600 | 1 | — | `#141414` |
| Badge — date | 22 px | 400 | 1 | +0.44 px | `var(--text-on-accent, #141414)` |
| Person name | 52 px | 600 | 0.9 | −0.52 px | `#141414` |
| Person title | 28 px | 400 | 1.2 | +0.56 px | `#141414` |
| Sub-headline | 28 px | 400 | 1.2 | +0.56 px | `rgba(255,255,255,0.6)` |

---

## Headline auto-fit

When a headline is editable the font size shrinks automatically to prevent words from overflowing.

```js
const HL_BASE = 104;  // starting size in px
const HL_MIN  = 48;   // never go below this

function longestWordWidth(el) {
  const words = (el.textContent || '').trim().split(/\s+/);
  const cs = getComputedStyle(el);
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;left:-99999px;top:-99999px;visibility:hidden;white-space:nowrap;';
  ['fontFamily','fontSize','fontWeight','fontStyle','letterSpacing','textTransform'].forEach(p => probe.style[p] = cs[p]);
  document.body.appendChild(probe);
  let max = 0;
  for (const w of words) { probe.textContent = w; if (probe.offsetWidth > max) max = probe.offsetWidth; }
  document.body.removeChild(probe);
  return max;
}

function fitHeadline() {
  const el = document.getElementById('preview-headline');
  const wrap = document.getElementById('headline');
  if (!el || !wrap) return;
  let size = HL_BASE;
  el.style.fontSize = size + 'px';
  for (let i = 0; i < 50; i++) {
    if (size <= HL_MIN) break;
    if (longestWordWidth(el) <= wrap.clientWidth + 0.5) break;
    size -= 2;
    el.style.fontSize = size + 'px';
  }
}
```

Call `fitHeadline()` on every headline input event **and** on every variant switch (because the available width may change).

---

## white-space

All multi-line text blocks use `white-space: pre-line` so newlines in the textarea are preserved on the canvas.

```css
.headline p,
.body-block p,
#preview-headline,
#preview-subheadline {
  white-space: pre-line;
  overflow-wrap: break-word;
}
```
