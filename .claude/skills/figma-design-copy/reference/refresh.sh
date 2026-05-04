#!/usr/bin/env bash
# Re-fetch every Figma icon currently in /assets/icons/ as SVG.
#
# Figma's MCP asset URLs return the Figma viewer HTML by default
# — the `Accept: image/svg+xml` header forces a real SVG response.
# URLs are short-lived (~7 days), so before running this you must
# re-discover the current asset IDs by calling get_design_context
# on each icon node.
#
# Usage:
#   1. From an MCP-aware session, get_design_context on the icon
#      component (file BMHnkg8PpTCza3WqfUjkDM, node 456:277) and
#      copy each `imgVectorXxx` URL into the table below.
#   2. Run this script.

set -euo pipefail
cd "$(dirname "$0")/../../../assets/icons"

# Replace each <ASSET-ID-…> with the matching imgVectorXxx URL fragment
# (the part after /api/mcp/asset/) from a fresh get_design_context.
declare -A icons=(
  [trash-16]="<ASSET-ID-trash>"
  [plus-16]="<ASSET-ID-plus>"
  [arrow-down-16]="<ASSET-ID-arrow>"
  [question-16]="<ASSET-ID-question>"
  [edit-16]="<ASSET-ID-edit>"
  [lines-16]="<ASSET-ID-lines>"
  [upload-arrow-line4]="<ASSET-ID-upload-arrow-chevron>"
  [upload-arrow-line5]="<ASSET-ID-upload-arrow-baseline>"
)

for name in "${!icons[@]}"; do
  curl -sL -H "Accept: image/svg+xml" \
    "https://www.figma.com/api/mcp/asset/${icons[$name]}" \
    -o "${name}.svg"
  echo "fetched ${name}.svg"
done

# Replace `fill="var(--fill-0, ...)"` with `fill="currentColor"`
# so the icon can be tinted from CSS.
for f in *.svg; do
  sed -i '' 's/fill="var([^"]*)"/fill="currentColor"/g' "$f" || true
  sed -i '' 's/stroke="var([^"]*)"/stroke="currentColor"/g' "$f" || true
done

echo "done — diff check the icons in your dev server."
