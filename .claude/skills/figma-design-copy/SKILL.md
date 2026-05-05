# Figma Design Copy — Pixel-Perfect Implementation Rules

Use this skill **whenever** the user asks me to copy a design from
Figma — keywords: "match Figma", "pixel perfect", "exactly the same",
"copy from Figma", "implement this design", "the design is wrong",
or any new Figma URL.

The user has corrected my work many times. This skill is the
distilled cost of every one of those corrections. Read every rule
**before** starting, and run the checklist **before** declaring
the work done.

---

## Standing instruction — keep this skill alive

> **Whenever the user points out ANY mismatch between Figma and
> the implemented design, BEFORE fixing the code:**
>
> 1. Add a row to the **"Patterns the user has objected to"**
>    table below — paraphrase the correction in the user's own
>    words and write the right answer.
> 2. If the failure mode isn't already in the **"Recurring
>    mistakes"** list near the bottom, add a bullet for it.
> 3. If a new verification check would have caught it, add a
>    box to the **Verification checklist**.
> 4. Commit the skill update in the SAME commit (or one commit
>    earlier) as the code fix, so the skill never lags the
>    codebase.
>
> The point of the skill is to make every correction the user
> makes a one-time correction. If a category of mistake repeats,
> something is missing from this file — add it.

---

## Mandatory workflow (do these in order, never skip steps)

1. **Get the visual first.** Call `get_screenshot` on the node
   the user pointed at. Download with `curl` and read the PNG with
   the Read tool. Visual cues (alignment, dashes, fills, icon
   placement) often disagree with the metadata.

2. **Get FULL design context — not metadata.** Call
   `get_design_context` (with `disableCodeConnect: true`) on the
   target node. Then call it on **every nested sub-component**
   you are going to reproduce. Metadata alone returns only sizes
   and positions; you need the React/Tailwind code to capture
   styles AND the `imgVectorXxx` asset URLs.

3. **Capture every token.** From the returned code, extract:
   - Font: family, weight, **size**, **line-height**, **letter-spacing**
   - Colour: hex of every fill, stroke, border (including the inactive states like `#c2c2c2`, `#6e6e6e`)
   - Geometry: width, height, **padding (per side)**, **gap**, radius
   - Border style: solid / dashed / dotted, colour, width, **stroke-dasharray** if dashed
   - Position: absolute coords vs flex/grid layout, with `align-items` / `justify-content` / `gap`
   - Transforms: `rotate-90` etc — replicate as `transform: rotate(...)` or `<g transform="...">`

4. **Download REAL Figma assets.** Every icon, vector, illustration,
   background image. Procedure:

   ```bash
   # The imgVectorXxx URLs from get_design_context
   # return HTML by default; you MUST set the Accept header to
   # image/svg+xml or you get the Figma viewer page.
   curl -sL -H "Accept: image/svg+xml" \
        "https://www.figma.com/api/mcp/asset/<asset-id>" \
        -o /tmp/part.svg
   ```

   - Compose multi-part icons by translating + rotating each
     fetched fragment per the parent React's `top`, `left`,
     `width`, `height`, `rotate-x` properties.
   - Replace `fill="var(--fill-0, black)"` with `fill="currentColor"`
     so the icon can be tinted from CSS.
   - Save assets to `/assets/icons/` named by their Figma node and
     intended size (e.g. `trash-16.svg`, `upload-arrow-84.svg`).
   - **Never** synthesise an "approximate" icon when the source
     is available. Never use Unicode glyphs (`↑`, `×`, `⌫`),
     emoji, or font icons in place of a Figma vector.

5. **Implement.** Match every captured token. Use the downloaded
   assets.

6. **Run the verification checklist below before declaring done.**

---

## Patterns the user has objected to (do not repeat)

Each row is a real correction from a real session. Re-read this
list before submitting design work. **If you find yourself doing
the thing in the "I shipped" column, stop.**

| What I shipped | What the user said | The right answer |
|---|---|---|
| Layout switcher in the right controls panel | "the layout switcher option is still not at the place where i need it" | Top of the canvas area, dots indicator, hide the in-panel switcher via CSS |
| Simple ✓ / ● dots for variants | "you forgot the separation lines" + "the paddings inside the layout options switcher are wrong" | N person-icons per cluster, 1 × 11 px black vertical line dividers, 6 px right-padding on multi-icon clusters, `-6 px` margin between icons inside a cluster |
| Synthesised inline SVG for trash / plus / arrow | "are you dumb? i need you to use the same svgs i have in my figma file, not some random icons" | `curl -H 'Accept: image/svg+xml'` from each `imgVectorXxx` URL, save in `/assets/icons/` |
| 16 × 16 PNGs for icons | "i need all the icons to be svg not png" | SVGs with `currentColor` fill/stroke so they tint from CSS |
| Single-row Date & Location combined section | "the right part... it's wrong as well" + "date and location must be separate controls with separate toggles" | Two bordered cards side-by-side, each with its own toggle, each driving its canvas badge independently |
| Color swatch fills the whole tile | "color switchers look different in figma. they have small paddings from the inside" | Inset frame in `--bui-canvas-bg` via `box-shadow: inset 0 0 0 4px <bg>`; colour fills the inner ~80 % |
| `<select>` with native combo-box chrome | "the dropdown is filled with some pattern which mustn't be there" | All three `appearance: none` prefixes (`appearance / -webkit-appearance / -moz-appearance`) + `background-color: transparent` + an SVG arrow as background-image |
| Upload zone with up-arrow Unicode glyph | "place for logo uploading looks different in figma" | 100 × 100 with 1 px **dashed `#c2c2c2`** border drawn as an SVG background (browser default `border-style: dashed` does NOT match Figma's render), real Figma 84 × 84 download-arrow vector inside |
| Just one partner upload zone, no add-button | "plus icon is missing, it was there to create a second layout option" | Plus button (16 × 16) to the right of the upload at vertical centre when there is room for another card |
| Upload preview without a delete affordance | "trash icon is missing as well" | 16 × 16 trash button anchored top-right of the dashed square |
| Synthesised arrow icon | "the arrow icon size is wrong. it's much more massive in figma" | Real Figma 84 × 84 chevron + baseline composed from `Line 4 (Stroke)` and `Line 5 (Stroke)` paths |
| `alt="thumb"` text leaking out | "there's a 'thumb' text which shouldn't be there" | Clear `alt` to empty string AND remove empty `src=""` attribute on init; CSS-hide preview when img has no src |
| Broken image icon visible | "there's some missing image reference" | Hide preview entirely when img has no src — `:has(img[src]:not([src=""]))` swap |
| Browser-default dashed border | "the dashes are different from figma" | SVG background `<rect rx='4' stroke='#c2c2c2' stroke-dasharray='6 4'/>` — same dash pattern across browsers, matches Figma exactly |
| `background: var(--bui-canvas-bg)` on upload zone | "there's a fill i didn't ask for" | `background-color: transparent` — let whatever's behind the dashed square show through |
| Trash button only clears the upload | "i need the trash icon to delete the whole logo option" | Trash hides the card AND unchecks the section's toggle AND resets the preset select; canvas-side partner is removed |
| Plus disappears when zero cards visible | "if all the logos are deleted than there must be a plus icon" | `visibleCount < cards.length ? show + : hide +` — plus shown whenever there's room. Mount the row OUTSIDE `.section-body` so `.section-off` doesn't hide it |
| Heading wrapped in a bordered card | "Heading must not be wrapped into a frame and doesn't need a toggle. this is a mandatory input" | Add `.bui-no-frame` opt-out class; hide the section-row; insert clean `<label>` directly above textarea |
| Toggle and label on opposite ends of section-row | "Subheading name must be next to the toggle as well as other names" | `justify-content: flex-start; gap: 8px` (NOT `space-between`); toggle order 1, label order 2 |
| Fixed `rows="3"` textarea, may overflow or leave empty space | "all the texts must fit the width they have. hight of the text blocks must fit the hight of the texts" | Auto-resize on `input` event: `t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'`. Run on init AND after `document.fonts.ready` |
| Partner logos wrapped in a frame | "partner logos must not be wrapped in a frame" | `.bui-no-frame` on the partner section |
| Partner / Color labels at different y because of partner padding | "baselines for partner logos and colors naes must be on the same level" | Remove the partner frame so its content starts at y=0 like Color's; `.bui-row-2 { align-items: start }` |
| Empty section-body still rendering | "there must be no empty frame under the partner logos section" | Explicitly `.section-body { display: none }` after lifting its content out |
| Person card 3-column (photo \| sliders \| names) | "person layout must match the figma precisely. it must be divided bu two columns. left column has all the controls for a photo... right column must be just the name and the role" | Outer 2-col (`1fr 1fr`); LEFT is itself a nested 2-col (`100px 1fr`) with photo on far left + sliders/dropdown next to it; RIGHT is name + role only |
| Person card still rendered single-column even after `.bui-person-card { display: grid }` | "person section is wrong. compare the way it looks in figma..." | Overlay CSS competes with the per-builder inline `<style>` block at equal specificity; the inline block loads LATER so it wins. **Always put `!important` on layout-critical properties** (`display`, `grid-template-columns`, `grid-column`, `align-items`) when fighting an inline `<style>` |
| "PERSON" rendered uppercase | inferred from screenshot — Figma shows "Person" sentence case | Override the legacy `.person-section-label { text-transform: uppercase }` with `text-transform: none !important` on the new label class |
| Position slider had "Top" / "Bottom" min/max labels around it | inferred from screenshot — Figma shows a bare slider with just a "Position" label above | Hide every legacy `.position-slider-wrap > span` so only the `<input type="range">` renders |
| Zoom rendered as `−` / value / `+` stepper buttons | inferred from screenshot — Figma shows a continuous **slider** labelled "Scale" | Provide a Scale slider in the mid column. If the legacy implementation only has stepper buttons, render a slider that drives the same zoom state and hide the stepper |
| Team-member dropdown rendered at the top of the photo controls | inferred from screenshot — Figma puts it at the BOTTOM of the mid column, BELOW the sliders | Move it last in the mid-column DOM order |
| Person photo upload zone had no trash button | inferred from screenshot — Figma shows the same trash glyph in the top-right of EVERY upload zone (partners + person) | Call `injectTrashButton()` on every `.upload-zone` discovered, not just the partner ones |
| "Nameplate" toggle visible in Person card | inferred from screenshot — Figma's Person card has no toggle for the nameplate; it's always present | Hide the legacy `.nameplate-toggle`'s `.section-row` so the title + name fields render as bare default-input fields |
| All 4 person cards visible in 1-person mode | "why the fuck do we have 4 people inputs for layout with just 1?" | `display: grid !important` on `.bui-person-card` beat the per-builder mode-switcher's inline `style="display: none"` on the inactive person sections. Override only when the section is NOT inline-hidden: `.bui-person-card:not([style*="display: none"]):not([style*="display:none"]) { display: grid !important; … }`. Same trick for any other layout-critical override that has to coexist with inline `display: none` toggling. |
| Zoom rendered as `−` / `100%` / `+` stepper buttons | "zoom controller must be a slider as well. as in figma" | Hide the legacy `.zoom-label`, `.zoom-btn`, `.zoom-value` children and inject a `<input type="range">` in their place. Slider movement fires synthetic clicks on the original +/- buttons (one click per `step`) so every existing per-builder zoom handler keeps running. Re-sync slider value back from `.zoom-value` after the clicks complete to absorb any rounding the underlying handler does. |

---

## Verification checklist (run before declaring done)

If a box can't be ticked, paint the affected component with the
`.bui-missing` red dashed outline so the user can see exactly
what's pending. Never silently ship an approximation.

### Real-asset usage
- [ ] Every icon in the design comes from `/assets/icons/`, not synthesised
- [ ] Every icon is SVG (not PNG, not Unicode, not emoji, not a font glyph)
- [ ] Every SVG uses `currentColor` so CSS can tint it
- [ ] Multi-part Figma icons are reassembled with the correct `transform` per the parent's `top / left / rotate-x` props (don't lose rotation)

### Layout & placement
- [ ] Every Figma element has a corresponding rendered element (or a red `.bui-missing` flag)
- [ ] Components are in the **same on-screen position** as Figma — top-left, top-right, centred, etc.
- [ ] **Horizontal vs vertical** stacking matches Figma (Date | Date side-by-side; Partner logo | Color side-by-side; Person card uses 2-col outer + nested 2-col left)
- [ ] Layout-switcher / variant-picker is in the place Figma puts it (most often above the canvas, NOT in the controls panel)
- [ ] Each named component lives inside the right parent frame — not floating where the legacy markup happened to put it
- [ ] If Figma has 1 control per concept and the legacy code has many (or vice versa), restructure to match Figma's count exactly (e.g. split combined "Date & Location" into two; collapse two stacked partner cards into one row + plus button)

### Spacing
- [ ] **Inner paddings** of every container match Figma exactly
- [ ] **Color swatches and similar tinted boxes** have the correct **inner inset frame** (Figma's "color option" sits at 10 % inset)
- [ ] **Gaps** between siblings match (Figma is usually 4 / 8 / 12 / 16 / 20 px — never `auto` or `space-around` unless Figma uses them)
- [ ] Border radii match (4 / 8 / 12 / 16 — not the legacy 6 / 20)
- [ ] **Same baseline** when two components sit side-by-side: their first text element starts on the same y line. If one has a frame and the other doesn't, remove the frame (or add one to the other)

### Typography
- [ ] Font-family is the exact Figma family (not a system fallback)
- [ ] Font-weight matches the *exact* style name (Regular / Medium / Semibold / Bold) — don't guess
- [ ] Font-size matches in px
- [ ] Line-height matches (often `0.95` or `1.05` — not the browser default `normal`)
- [ ] Letter-spacing (tracking) matches in px (e.g. `-0.12px`)
- [ ] Text colour is the exact hex (`#6e6e6e` for labels, `#000` for body — not `#999` / `#111`)
- [ ] Text-transform (uppercase / sentence case) matches — legacy labels often use `text-transform: uppercase` when Figma is sentence case
- [ ] **Texts fit their container's width without overflowing**, AND the container's height fits the text exactly (no fixed `rows`, no extra empty space below)

### Inputs / controls
- [ ] Toggle: 40 × 20 black border, 4 px radius, **square** 10 × 10 knob (NOT a circle)
- [ ] Toggle row: `justify-content: flex-start`, `gap: 8px`, toggle on the LEFT, label immediately next to it (NOT on opposite ends via `space-between`)
- [ ] Mandatory inputs have **no toggle and no frame** (e.g. Heading, Title) — opt out via `.bui-no-frame`
- [ ] Optional inputs that DO have a toggle live inside a bordered card
- [ ] When Figma shows two related controls separately (e.g. Date / Location, Partner 1 / Partner 2 add-button) — **don't combine them** into one section just because the legacy markup did
- [ ] `<select>` has all three `appearance: none` prefixes + transparent background + an SVG arrow as background-image — no native combo-box texture leaking through
- [ ] Color swatches show a **4 px inner inset frame** in the canvas-area background colour (Figma's "color option" inset is 10 %)
- [ ] Upload zone: 100 × 100, 1 px **dashed `#c2c2c2`** border drawn as **SVG background** (NOT `border-style: dashed`), **transparent fill** (no inner colour), big real Figma arrow centred (84 × 84), 16 × 16 trash anchored top-right
- [ ] Section dividers between layout-options clusters: 1 × 11 px **vertical** lines (NOT horizontal `<hr>`)
- [ ] Auto-resize textareas: `t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'` on `input` + on init + on `document.fonts.ready`

### State machines (for any "add / remove" UI)
- [ ] Plus button shows when `visibleCount < maxCount`, hides when full
- [ ] Trash button on a card deletes the **whole card** (hide it, uncheck its toggle, reset its select / clear its upload, fire the matching `change` events). NOT just clear the upload.
- [ ] Plus button continues to render when `visibleCount === 0` — mount it OUTSIDE any container affected by `.section-off` / per-builder hide logic
- [ ] Click a freshly revealed card → all event handlers (the original section's toggle + select + file input) still work because the original elements were MOVED, not cloned

### CSS hygiene (avoid silent overrides)
- [ ] No two CSS classes share the same name across the design system overlay and the legacy stylesheet (e.g. `.divider` always loses to legacy `.divider` — rename to `.bui-sep`)
- [ ] No `display: <flex|grid|block> !important` on a layer whose visibility flips between two states (placeholder ↔ preview, hidden ↔ shown). Use CSS `:has()` instead so visibility is data-driven from one source of truth
- [ ] **Every layout-critical property is `!important`** when it has to fight the per-builder inline `<style>` block. The inline block loads AFTER `builder-ui.css` so at equal specificity, the inline block wins. Properties to defend: `display`, `grid-template-*`, `grid-column`, `flex-direction`, `align-items`, `justify-content`, `gap`, `text-transform`, `position`, `width`, `height`, padding, margin
- [ ] If the overlay's `display: x !important` rule applies to elements that the per-builder code hides via inline `style="display: none"`, **guard the overlay rule** with `:not([style*="display: none"]):not([style*="display:none"])` so the inline hide still works. Not just person cards — any element a builder toggles by setting inline `style.display`
- [ ] Every `(async function …)` IIFE is preceded by `;` to defend against ASI when the previous line ends in `)` (this trap has bitten Layouts 1, 3, 8 already)
- [ ] DOM refs that helpers depend on are declared **above** the helpers — not below, even with `const` (TDZ)
- [ ] When a JS reorganisation moves an element out of its original parent, any selector that anchors on **the original parent's contents** (e.g. `:has(select.partner-preset)`) breaks. Add a stable **marker class** (`.bui-partner-section`) so CSS keeps matching after the move

### Behaviour preservation
- [ ] When relocating an element via JS (e.g. moving the Export button into the canvas area), use `appendChild` on the same node — don't `cloneNode`. Click handlers must survive
- [ ] When hiding a legacy element to add a new visual, set `style.display = 'none'` rather than removing it — the element may still be wired to JS event handlers
- [ ] After a reorganisation, every `<input type="file">` and every hidden state element still lives inside its parent `.upload-zone` (so click-to-upload still works)
- [ ] Variant-switching: a click on the new dot also fires the legacy `.seg-btn` / `.layout-btn` so the canvas updates; a click on the legacy button mirrors back to the dot
- [ ] **Don't mount fragile UI inside `.section-body`** — `.section-off` hides it. Mount stable bits as siblings of `.section-body`, inside the `.control-section`

### Image / preview hygiene
- [ ] Clear every legacy `alt="thumb"` (or any other placeholder alt) to `alt=""`
- [ ] Strip empty `src=""` attributes — they render as a broken-image icon plus the alt text
- [ ] Hide a preview `<img>` (and its parent) when it has no real src — CSS `img[src=""], img:not([src]) { display: none }` plus a `:has()` rule on the parent
- [ ] When a preset is picked → preview src points at the preset path
- [ ] When custom is picked → preview src restores the last-uploaded blob URL (track via MutationObserver on the img)
- [ ] When trash is clicked → src cleared (or removed) so the placeholder reappears

### Cross-builder consistency
- [ ] If the change is in the shared overlay (`builder-ui.css` / `builder-ui.js`), it works on every builder — not just the one Figma demoes (Layouts 1, 2, 3, 4, 5, 6, 7, 8, 9 + WIP)
- [ ] If a layout differs structurally (e.g. landscape canvas vs portrait), the overlay handles both via the `isLandscape` branch (50 % vs 75 % canvas-width clamp)

### Final visual diff
- [ ] Open the running preview side-by-side with the Figma screenshot at the same zoom and walk top-to-bottom, left-to-right. Anything visually different gets flagged in the reply BEFORE saying "done" — don't make the user spot it.

---

## Recurring mistakes I have to actively guard against

These are the failure modes that have hit me most often. Each one
costs a round trip with the user — read these every time before
starting design work.

1. **Synthesising vectors instead of fetching.** When I see a path
   in metadata I assume I can reconstruct it. I cannot. Always
   `curl -H "Accept: image/svg+xml"` the asset URL and use the
   real path data verbatim.

2. **"Close enough" paddings.** I default to 32 / 16 / 8 px when
   Figma uses 40 / 10 / 12 px. Always extract the exact px from
   the React/Tailwind code; don't round.

3. **`!important` on `display`** stomping on sibling state-toggle
   logic. Use `:has()` or class markers, not blanket `!important`.

4. **Leaving native browser chrome visible** on `<select>` /
   `<input type="range">`. All three appearance prefixes, every time.

5. **Browser-default dashed border** instead of an SVG-rendered
   one. Browsers' dash patterns differ from Figma's render.

6. **Hiding `.section-row` but keeping the bordered card** because
   `:has(.section-row)` still matches. Add `.bui-no-frame` opt-out.

7. **Mounting plus-buttons / always-visible UI inside `.section-body`**
   — the `.section-off` rule hides the whole body when the section's
   toggle is off, taking your UI with it.

8. **Forgetting that moving a `<select>` out of its original
   section breaks `:has(select)` selectors** that depended on it.
   Add a class marker BEFORE the move.

9. **Combining controls because legacy did**, when Figma has them
   separate. Always copy Figma's structure, not the legacy one.

10. **Using Unicode arrows / × / etc. as icons.** Looks different
    per OS / font and breaks pixel-perfect.

11. **Skipping the visual.** I read metadata and skip the
    screenshot. Always download and read the screenshot first.

12. **Equal-specificity overlay loses to inline `<style>`.** Each
    builder ships its own `<style>` block in the `<head>`, AFTER
    `<link rel="stylesheet" href="builder-ui.css">`. At equal
    specificity, "later wins" — so a class selector in the
    overlay loses to the same class in the inline block. **Put
    `!important` on every layout-critical property** when the
    overlay needs to dictate layout (`display`, `grid-template-*`,
    `flex-direction`, `align-items`, `justify-content`, `gap`,
    text-`transform`, `position`).

13. **Routing whole `.control-section`s into columns** when the
    Figma layout requires individual elements to land in different
    columns. Example: the legacy "Photo" section bundles upload
    zone + dropdown + bg-remove + zoom into one block; Figma puts
    upload + bg-remove in the photo column but the dropdown +
    sliders in the mid column. Extract individual elements and
    route them precisely.

14. **`display: x !important` collides with inline
    `style="display: none"` toggling.** When the per-builder code
    shows / hides things by setting inline `style.display`, any
    overlay rule that uses `display: <something> !important`
    will beat the inline `none` and force the element visible.
    Guard your overlay rule with
    `:not([style*="display: none"]):not([style*="display:none"])`
    (cover both spaced and unspaced variants) so the element
    can still be hidden by its own builder.

---

## Files referenced by this skill

- `reference/icons.md` — index of every downloaded Figma icon and
  its source node ID (so future updates can re-download from the
  same place)
- `reference/tokens.md` — the design tokens captured from Figma
  466:600 (colours, fonts, radii, paddings, dimensions, proportions)
- `reference/refresh.sh` — small helper that re-fetches every
  current icon's SVG from Figma (URLs go stale ~7 days)
