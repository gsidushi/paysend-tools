# Figma Design Copy — Pixel-Perfect Implementation Rules

Use this skill **whenever** the user asks me to copy a design from
Figma — keywords: "match Figma", "pixel perfect", "exactly the same",
"copy from Figma", "implement this design", or any new Figma URL.

The user has repeatedly given me the same kind of feedback when my
first attempt was off. This skill encodes that feedback as a
forcing-function checklist so I get it right on the first pass.

---

## Mandatory workflow (do these in order, never skip steps)

1. **Get the visual first.** Call `get_screenshot` on the node
   the user pointed at. Download the PNG locally with curl and
   read it with the Read tool. Look at the image before reading
   any metadata — visual clues (alignment, padding, dashed
   borders, icon placement) often disagree with metadata alone.

2. **Get FULL design context, not metadata.** Call
   `get_design_context` (NOT `get_metadata`) on the target node.
   Metadata is sparse — it returns sizes and positions but not
   styles or asset URLs. For a parent that has 4–5 sub-components,
   call `get_design_context` on each one too.

3. **Capture every token.** From the returned React/Tailwind code,
   extract:
   - Font: family, weight, size, line-height, letter-spacing
   - Colour: hex of every fill, stroke, border
   - Geometry: width, height, padding (per side), gap, radius
   - Border style: solid / dashed / dotted, colour, width
   - Position: absolute coords vs flex/grid layout

4. **Download real assets.** For every icon, illustration, vector
   or background that Figma serves at a `/api/mcp/asset/...` URL,
   curl the PNG/SVG into `/assets/icons/` (or appropriate folder).
   **Never** synthesise a "close-enough" SVG when the real one is
   available — the user will spot it. Use the asset by name from
   `/assets/icons/...` — not inline SVG, not Unicode glyph, not
   emoji, not a font icon.

5. **Implement.** Match every token captured in step 3. Use the
   downloaded assets from step 4.

6. **Run the verification checklist below before declaring done.**

---

## Verification checklist (run before saying "the design is finished")

Each box maps to a real piece of feedback the user has given. If a
box can't be ticked, mark the affected component with the
`.bui-missing` red dashed outline so the user can see exactly
what's pending — never silently ship an approximation.

### Layout & placement
- [ ] Every Figma element has a corresponding rendered element (or a
      red `.bui-missing` flag if I can't build it)
- [ ] Components are in the **same on-screen position** as Figma
      (top-left, top-right, centred, etc.) — not "the same kind of
      panel but on the wrong side"
- [ ] **Horizontal vs vertical** stacking matches (Figma sometimes
      shows two cards side-by-side that the legacy code stacks
      vertically — check side-by-side rows explicitly)
- [ ] Layout-switcher / variant-picker is in the place Figma puts it
      (most often above the canvas, not in the controls panel)
- [ ] Each named component lives inside the right parent frame —
      not floating where the legacy markup happened to put it

### Spacing
- [ ] **Inner paddings** of every container match Figma exactly
      (especially boxes that look "filled with the colour" —
      check whether Figma has an inner inset frame around the fill)
- [ ] **Gaps** between siblings match (Figma's gap is usually
      4 / 8 / 12 / 16 / 20 px — never `auto` or `space-around`
      unless Figma uses justify-between)
- [ ] **Outer margins** between sections match
- [ ] Border radii match (4 / 8 / 12 / 16 — not the legacy 6 / 20)

### Typography
- [ ] Font-family is the exact Figma family (not a system fallback)
- [ ] Font-weight matches the *exact* style name
      (Regular / Medium / Semibold / Bold) — don't guess
- [ ] Font-size matches in px
- [ ] Line-height matches (often `0.95` or `1.05` — not the
      browser default `normal`)
- [ ] Letter-spacing (tracking) matches in px (e.g. `-0.12px`)
- [ ] Text colour is the exact hex (`#6e6e6e` for labels,
      `#000` for body — not `#999` / `#111`)
- [ ] Text-transform (uppercase / sentence case) matches —
      legacy labels often use `text-transform: uppercase` when
      Figma is sentence case

### Icons & vector content
- [ ] Every icon was **downloaded from the matching Figma node**
      and is referenced from `/assets/icons/`
- [ ] No icon is missing from the layout (especially trash, plus,
      edit, arrow-down, question — these are easy to skip)
- [ ] Icons are at their Figma size (usually 16×16) and at the
      correct corner (top-right, bottom-right, etc.)
- [ ] Hover / active states use the same icon, just recoloured —
      don't swap icons unless Figma does

### Inputs / controls
- [ ] Toggle: 40 × 20 black border, 4 px radius, **square** 10 × 10
      knob (NOT a circle)
- [ ] Input: black bottom hairline, 24 px GT Semibold value,
      label above in 12 px GT Regular `#6e6e6e`
- [ ] `<select>` has all three `appearance` prefixes set to `none`
      and a transparent background — no native combo-box texture
      leaking through
- [ ] Color swatches have a **4 px inner inset frame** (Figma's
      "color option" component shows the colour at 80 % of the
      tile, not 100 %)
- [ ] Upload zone: 100 × 100, 1 px **dashed** grey border,
      big arrow centred in the inner 84 × 84, 16 × 16 trash icon
      anchored top-right
- [ ] Section dividers: 1 px × 11 px **vertical** lines between
      clusters in dot strips (NOT horizontal `<hr>` rules)

### CSS hygiene (avoid silent overrides)
- [ ] No two CSS classes share the same name across the design
      system overlay and the legacy stylesheet (e.g. `.divider`
      always loses to legacy `.divider` — rename to `.bui-sep`)
- [ ] Every `(async function …)` IIFE is preceded by `;` to defend
      against ASI when the previous line ends in `)` (this trap
      has bitten Layouts 1, 3, 8 already)
- [ ] DOM refs that helpers depend on are declared *above* the
      helpers — not below, even with `const` (TDZ)

### Behaviour preservation
- [ ] When relocating an element via JS (e.g. moving the Export
      button into the canvas area), use `appendChild` on the
      same node — don't `cloneNode`. Click handlers must survive.
- [ ] When hiding a legacy element to add a new visual, set
      `style.display = 'none'` rather than removing it — the
      element may still be wired to JS event handlers
- [ ] After a reorganisation, every `<input type="file">` and
      every hidden state element still lives inside its parent
      `.upload-zone` (so click-to-upload still works)
- [ ] Variant-switching: a click on the new dot also fires the
      legacy `.seg-btn` / `.layout-btn` so the canvas updates;
      a click on the legacy button mirrors back to the dot

### Cross-builder consistency
- [ ] If the change is in the shared overlay (`builder-ui.css` /
      `builder-ui.js`), it works on every builder — not just the
      one Figma demoes (Layouts 1, 2, 3, 4, 5, 6, 7, 8, 9 + WIP)
- [ ] If a layout differs structurally (e.g. landscape canvas vs
      portrait), the overlay handles both via the `isLandscape`
      branch (50 % vs 75 % canvas-width clamp)

### Final visual diff
- [ ] Open the running preview side-by-side with the Figma
      screenshot at the same zoom and walk top-to-bottom, left-
      to-right. Anything visually different gets flagged in the
      reply BEFORE saying "done" — don't make the user spot it.

---

## When unsure: paint it red

If a Figma component can't be matched (asset unavailable, behaviour
ambiguous, conflicts with existing data model), wrap the affected
container in `<div class="bui-missing">` so the dashed red outline
+ "UI redesign pending" badge is unmistakable in the rendered page.
Don't ship a silent guess.

---

## Patterns the user has objected to (don't repeat)

The following corrections came from real user feedback over multiple
iterations. Each one is a "blue arrow" in their annotated
screenshots — re-read this list before submitting design work.

| What I shipped | What the user said | What was needed |
|---|---|---|
| Layout switcher in the right controls panel | "the layout switcher option is still not at the place where i need it" | Top of canvas area, dots indicator |
| Simple ✓ / ● dots for variants | "you forgot the separation lines" + "the paddings inside the layout options switcher are wrong" | N person-icons per cluster, 1 × 11 px black vertical line dividers, 6 px right-padding on multi-icon clusters |
| Synthesised inline SVG for trash / plus / arrow | "copy all the icons from figma exactly as they are" | Download from Figma node, save in /assets/icons/, reference as `<img>` |
| Single-row Date & Location combined section | "the right part... it's wrong as well" | Split into two side-by-side bordered cards |
| Color swatch fills the whole tile | "color switchers look different in figma. they have small paddings from the inside" | 4 px inset frame in `--bui-canvas-bg`, colour at 80 % via box-shadow inset |
| `<select>` with native combo-box chrome | "the dropdown is filled with some pattern" | All three `appearance: none` prefixes + transparent background |
| Upload zone with up-arrow Unicode glyph | "place for logo uploading looks different in figma" | 100 × 100 with 1 px dashed `#c2c2c2` border, real download-arrow vector inside |
| Just one partner upload zone | "plus icon is missing" | Plus button (16 × 16) to the right that reveals the next partner section |
| Upload preview without a delete affordance | "trash icon is missing" | 16 × 16 trash button anchored top-right that proxies to legacy `.remove-photo` |

---

## Files referenced by this skill

- `reference/icons.md` — index of every downloaded Figma icon and
  its source node ID (so future updates can re-download from the
  same place)
- `reference/tokens.md` — the design tokens captured from Figma
  466:600 (colours, fonts, radii, paddings)
