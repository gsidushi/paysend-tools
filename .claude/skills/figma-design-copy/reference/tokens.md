# Design Tokens — captured from Figma 466:600

These are the exact values used throughout the builder UI overlay
(`/assets/builder-ui.css`). If a future Figma update changes any of
them, refresh this file and the matching CSS variable.

## Colour

| Token | Hex | Used for |
|---|---|---|
| `--bui-bg`         | `#ffffff` | Page background |
| `--bui-canvas-bg`  | `#f2f2f2` | Soft-grey rectangle around the canvas; inset frame inside color swatches; upload zone fill |
| `--bui-card`       | `#ffffff` | Right-panel card surface |
| `--bui-border`     | `#f2f2f2` | Hairline around toggle-led cards |
| `--bui-border-on`  | `#000000` | Active border (color swatch active state, toggle border) |
| `--bui-label`      | `#6e6e6e` | Small `12px` labels above inputs |
| `--bui-ink`        | `#000000` | Body text, input value, button background |
| Inactive icon dot  | `#c2c2c2` | Greyed-out person icons in layout-options strip |
| Dashed border      | `#c2c2c2` | Upload-zone outline |

## Type — GT Standard

| Role | Family · Weight · Size · LH · Tracking |
|---|---|
| Label (small caption) | GT Standard · Regular 400 · `12px` · `0.95` · `-0.12px` |
| Input value | GT Standard · Semibold 600 · `24px` · `0.95` · `-0.24px` |
| Heading H2 (canvas) | GT Standard · Semibold 600 · `80px` · `0.9` · `-0.8px` |
| Quote H3 | GT Standard · Semibold 600 · `52px` · `1.0` · `-0.52px` |
| Pill / step label | GT Standard · Regular 400 · `36px` · `0.95` · `-0.36px` |
| Button (Primary "Export") | GT Standard · Regular 400 · `12px` · `0.95` · `-0.12px` |

## Geometry

| Token | Value |
|---|---|
| `--bui-radius`    | `8px`  — outer card radius, primary button |
| `--bui-radius-sm` | `4px`  — toggle, color swatch, secondary button |
| `--bui-radius-lg` | `12px` — soft-grey canvas-area rectangle |

## Padding

| Where | Value |
|---|---|
| Canvas area (preview-area) | `40px` top/bottom · `10px` left/right |
| Right-panel section card   | `12px` |
| Toggle-led section gap     | `8px` |
| Color picker grid gap      | `4px` |
| Color swatch inner inset   | `4px` (box-shadow inset) |
| Layout-options dot cluster | `0` (negative `-6px` margin between icons) |
| Layout-options trailing pad on multi-icon cluster | `6px` (right) |
| Workspace gap (canvas | controls) | `16px` |
| Workspace outer padding | `20px` |

## Component dimensions

| Component | Size |
|---|---|
| Toggle (collapsed) | 40 × 20 px (knob 10 × 10 square) |
| Color swatch | 1 : 1, fluid width (CSS grid 5 cols), 4 px inset frame |
| Upload zone | 100 × 100 px (inner 84 × 84 icon area) |
| Trash button | 16 × 16 px (top-right of upload zone, 6 px from edges) |
| Plus button | 16 × 16 px (vertically centred to right of upload zone) |
| Layout-options person icon | 16 × 16 frame, 10 × 10 inner square |
| Layout-options separator | 1 × 11 px black vertical line |
| Sliders | track 1 px, thumb 12 px diameter |

## Layout proportions

| Rule | Value |
|---|---|
| Canvas width inside soft-grey area (portrait) | `50%` of preview-area width |
| Canvas width inside soft-grey area (landscape) | `75%` of preview-area width |
| Right panel width | `min(560px, 42vw)` |
| Layout-options pagination row max-height | up to half of canvas-area height |
