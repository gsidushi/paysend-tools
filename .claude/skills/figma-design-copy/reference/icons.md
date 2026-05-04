# Figma Icon Index

Every icon used in the builder UI was captured from a specific
Figma node and saved as a 16×16 PNG (or larger for placeholders).
If a node ID changes in Figma, re-download by calling
`get_screenshot` on the new node and replacing the file in place.

| File | Node | Description |
|---|---|---|
| `/assets/icons/trash-16.svg`     | `464:404` | Trash can — used as remove button on every upload-zone |
| `/assets/icons/plus-16.svg`      | `463:1008`| `+` cross — adds another partner logo |
| `/assets/icons/arrow-down-16.svg`| `461:761` | Triangle pointing down — `<select>` arrow |
| `/assets/icons/question-16.svg`  | `456:278` | Help/info icon next to optional fields |
| `/assets/icons/person-16.svg`    | `456:273` | Person square — used inside layout-options dot clusters |
| `/assets/icons/edit-16.svg`      | `463:846` | Edit/rename pencil |
| `/assets/icons/lines-16.svg`     | `464:347` | Hamburger / list-options |
| `/assets/icons/upload-zone-empty.png` | `463:929` (100 × 100) | Full empty-state Figma render — kept as PNG for visual reference only, not used directly |

All icons are 16 × 16 monochrome SVGs that pick up colour via
`fill="currentColor"` / `stroke="currentColor"`, so they tint to
whatever `color:` you set on the `<img>`'s container or, when
embedded inline, on the SVG itself.

## Source

Figma file: `BMHnkg8PpTCza3WqfUjkDM`
Section: `builder layout` → `design system` → `icons` (node `456:277`)

## How to refresh — get the REAL Figma vectors, not screenshots

The MCP exposes Figma vector data through two different mechanisms:

1. **`get_screenshot` URL** — always returns a PNG raster. Useful
   for visual reference, useless if you want the actual paths.
2. **`get_design_context` `imgVectorXxx` URL** — returns the SVG
   path data IF you ask for it correctly.

The trick is the `Accept` header. Default `curl` of those URLs
returns HTML (a Figma viewer page). With `Accept: image/svg+xml`
you get the actual SVG file:

```bash
# Step 1 — get_design_context on the icon node, copy the imgVector
# constant URL out of the returned React code.

# Step 2 — fetch as SVG (the Accept header is mandatory).
curl -sL -H "Accept: image/svg+xml" \
     "https://www.figma.com/api/mcp/asset/<asset-id>" \
     -o /tmp/part.svg
```

The returned SVG has a free-form viewBox sized to the path bounds
(e.g. `viewBox="0 0 8 11.5"` for the trash). To assemble the icon
into a 16 × 16 frame:

1. Read the React rendering code to find each part's
   `top / left / width / height` / `rotate-x` inside the 16 × 16
   parent.
2. Wrap the imported `<path>` in `<g transform="translate(x y)
   rotate(...)">` so it lands at the same coordinates Figma
   places it.
3. Replace `fill="var(--fill-0, black)"` with `fill="currentColor"`
   so the icon can be tinted from CSS.

Asset URLs go stale after roughly seven days, so refresh by
re-running `get_design_context` to get fresh URLs first.
