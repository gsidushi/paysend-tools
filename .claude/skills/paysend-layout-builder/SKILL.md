# Paysend Post-Builder — Layout Rules

Use this skill whenever:
- A Figma design needs to be turned into a new post-builder layout
- An existing layout needs a new component added
- You need to know the correct value for any spacing, font, color, or interaction

---

## Shared data — `/assets/data/*.json`

Lists that appear in more than one builder are stored as JSON in
`/assets/data/` and pulled in via `/assets/data/loader.js`:

| File | Contents |
|---|---|
| `partners.json` | Partner-logo presets (Visa, Mastercard, …) — `id / label / src` |
| `colors.json`   | Accent + background palette — `id / label / hex / textColor` |
| `team.json`     | Staff portrait presets — `id / name / src` |
| `layouts.json`  | Wizard data — `purposes`, `activities`, `assignments`, `familyRoutes` |

**Every new builder must:**

1. Add `<script src="/assets/data/loader.js"></script>` in `<head>` BEFORE
   the inline `<script>` block.
2. Leave `<select class="partner-preset">` containing only
   `<option value="custom">Custom upload</option>`. The other options
   are injected at runtime from `partners.json`.
3. Leave the colour-palette `<div id="…-palette">` empty. Swatches are
   injected from `colors.json` in an
   `(async () => { const { colors } = await window.PaysendData; … })()` IIFE.
4. Use `presetMap[id]` (built from `partners`) instead of a hard-coded
   `PARTNER_PRESETS = {…}` object. Same for `team.json` if applicable.

Adding a new partner / colour / staff member is then a one-line edit in
the matching JSON file — every builder picks it up on next load. Never
re-introduce hard-coded `<option>` lists or `const PARTNER_PRESETS`
objects in new layouts.

---

## Quick-start workflow

1. **Read the Figma design** — note canvas size, variant names, background strategy, which elements are toggleable
2. **Create** `templates<N>/index.html` — copy the boilerplate from `reference/snippets.md`
3. **Set canvas size** (`CANVAS_W`, `CANVAS_H`) in the scalePreview IIFE
4. **Build background layers** — one `<div>` per zone, CSS-driven by a variant class on `#post-canvas`
5. **Place logo block** — always `.top-logos` (Paysend + 2 optional partners)
6. **Add text elements** — headline → body copy → tags; see typography rules
7. **Wire controls panel** — variant switch → content toggles → color palette → partner-logo sections → upload zones
8. **Add the 5 JS helpers** — `fileToOptimizedSrc`, `fitHeadline`, `bindToggle`, `bindPartnerToggle`, `setupLogoUpload`, `setupPartnerPreset`
9. **Verify contrast** — set `DARK_ACCENT` / `DARK_BG` so white/black text flips correctly
10. **Register in `index.html`** root menu

---

## Files & folders

```
paysend-tools/
├── assets/
│   ├── logo-paysend-wordmark.svg   ← white-friendly wordmark (filter: invert)
│   ├── Paysend-main-logo.svg       ← full planet + wordmark (pattern variant hero)
│   ├── logo-planet.svg             ← icon-only planet mark
│   ├── pattern-1.png               ← brand pattern tile
│   ├── partner-logo.png            ← default partner placeholder
│   ├── partner-logos/
│   │   ├── visa.png
│   │   └── master-card.png
│   ├── city-placeholder.png
│   ├── person_placeholder.png
│   └── placeholder-venue.png
├── fonts/
│   ├── GT-Standard-L-Standard-Regular.woff2
│   └── GT-Standard-L-Standard-Semibold.woff2
├── templates/          ← Layout 1 (portrait 1080×1360, headshots)
├── templates2/         ← Layout 2 (landscape 1200×627, event)
├── templates3/         ← Layout 3 (portrait 1080×1440, event + new-hire)
├── templates4/         ← Layout 4 (portrait 1080×1360, pattern-bg event)
├── templates5/         ← Layout 5 (landscape 1200×627, pattern-bg event)
├── templates6/         ← Layout 6 (portrait 1080×1360, milestone)
└── index.html          ← root menu — add new layout here
```

Each layout is a single self-contained `index.html` — no build step, no imports.

---

## Canvas sizes

| Format | Width | Height | Layouts |
|---|---|---|---|
| Portrait | 1080px | 1350px | 1, 4, 6 |
| Tall portrait | 1080px | 1440px | 3 |
| Landscape | 1200px | 627px | 2, 5 |

The canvas element is `#post-canvas` with `transform-origin: top left`. Scale is applied via JS (see `reference/responsive.md`).

---

## The 41 px rule — spacing

**All internal canvas margins are 41 px.** Every edge gap: top, right, bottom, left.

```css
/* Examples */
.top-logos  { position: absolute; top: 41px; left: 41px; }
.news-tag   { position: absolute; top: 41px; right: 41px; }
.headline   { left: 41px; right: 41px; }      /* = max-width: 998px on 1080 canvas */
.body-block { left: 41px; right: 41px; }
.bottom-brand { left: 41px; bottom: 41px; }
```

When an element "sticks to the image edge" add 41 px as the gap from that edge:
- Body above pattern strip (y=675): `bottom: 721px` (675 + 41)
- Body below pattern strip: `top: 721px`

For landscape (1200px wide) the gap remains 40–41 px on all sides.

---

## Detailed references

- [Typography](reference/typography.md) — fonts, sizes, weights, line-height, letter-spacing
- [Colors](reference/colors.md) — accent palette, CSS variables, contrast rules
- [Components](reference/components.md) — logos, badges, news-tag, controls, upload zones
- [Responsive](reference/responsive.md) — preview scaling, breakpoints, mobile
- [Snippets](reference/snippets.md) — copy-paste boilerplate for new layouts
