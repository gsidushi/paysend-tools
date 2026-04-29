# Snippets — copy-paste boilerplate for new layouts

This file contains complete ready-to-copy starting points. Pick the canvas size that matches your Figma design, then fill in the specific content elements.

---

## Portrait 1080×1360 — dark/split/pattern variants (e.g. Layout 6)

The most common format. Three background variants: **Dark** (solid bg + pattern strip at bottom), **Split** (pattern top / dark bottom), **Pattern** (dark top / pattern bottom with big Paysend mark).

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Post Builder — [Layout Name]</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <style>
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

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; overflow: hidden; font-family: 'GT Standard', sans-serif; background: #f0f0f0; color: #111; display: flex; flex-direction: column; }

    /* ── App shell ── */
    .header { padding: 14px 24px; background: #fff; border-bottom: 1px solid #e8e8e8; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
    .header-logo { width: 28px; height: 28px; flex-shrink: 0; display: block; }
    .header h1 { font-size: 16px; font-weight: 700; letter-spacing: -0.3px; }
    .header p  { font-size: 13px; color: #999; }
    .workspace { flex: 1; display: grid; grid-template-columns: 1fr 25vw; min-height: 0; overflow: hidden; }
    .preview-area { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 32px; gap: 12px; overflow: hidden; }
    .preview-wrapper { overflow: hidden; box-shadow: 0 8px 48px rgba(0,0,0,0.22); border-radius: 3px; flex-shrink: 0; }
    .preview-hint { font-size: 12px; color: #aaa; }

    /* ── Canvas ── */
    #post-canvas {
      width: 1080px; height: 1360px;
      transform-origin: top left;
      font-family: 'GT Standard', sans-serif;
      position: relative; overflow: hidden;
      background: var(--bg-color, #0a0a0a);
      --bg-color: #0a0a0a;
    }

    /* ── Background layers ── */
    .bg-dark-full, .bg-pattern-strip-bottom,
    .bg-pattern-strip-top, .bg-dark-bottom,
    .bg-dark-top, .bg-pattern-strip-pattern { position: absolute; display: none; }

    #post-canvas.variant-dark .bg-dark-full            { display: block; inset: 0; background: var(--bg-color, #0a0a0a); }
    #post-canvas.variant-dark .bg-pattern-strip-bottom { display: block; left: 0; right: 0; bottom: 0; height: 50%; background: #0a0a0a url('/assets/pattern-1.png') center / cover no-repeat; }

    #post-canvas.variant-split .bg-pattern-strip-top   { display: block; left: 0; right: 0; top: 0;    height: 50%; background: #0a0a0a url('/assets/pattern-1.png') center / cover no-repeat; }
    #post-canvas.variant-split .bg-dark-bottom         { display: block; left: 0; right: 0; bottom: 0; height: 50%; background: var(--bg-color, #0a0a0a); }

    #post-canvas.variant-pattern .bg-dark-top              { display: block; left: 0; right: 0; top: 0;    height: 50%; background: var(--bg-color, #0a0a0a); }
    #post-canvas.variant-pattern .bg-pattern-strip-pattern { display: block; left: 0; right: 0; bottom: 0; height: 50%; background: #0a0a0a url('/assets/pattern-1.png') center / cover no-repeat; }

    /* ── Top logos ── */
    .top-logos { position: absolute; top: 41px; left: 41px; z-index: 3; display: flex; align-items: center; gap: 16px; height: 48px; }
    .top-logos .logo-paysend { height: 100%; width: auto; filter: brightness(0) invert(1); flex-shrink: 0; }
    .top-logos .logo-divider  { width: 2px; height: 100%; background: rgba(255,255,255,0.55); flex-shrink: 0; }
    .top-logos .logo-partner  { height: 100%; width: auto; object-fit: contain; display: block; flex-shrink: 0; }
    .top-logos .logo-partner.hidden, .top-logos .logo-divider.hidden { display: none !important; }
    #post-canvas.logo-compact .top-logos .logo-paysend { height: 40px; }
    #post-canvas.logo-compact .top-logos .logo-partner { height: 40px; }
    #post-canvas.logo-compact .top-logos .logo-divider { height: 40px; }
    /* Pattern variant hides top logos — big wordmark is at the bottom instead */
    #post-canvas.variant-pattern .top-logos { display: none; }

    /* Light bg: un-invert logos */
    #post-canvas.bg-light .top-logos .logo-paysend,
    #post-canvas.bg-light .bottom-brand .logo-paysend { filter: none; }
    #post-canvas.bg-light .top-logos .logo-divider    { background: rgba(20,20,20,0.55); }

    /* ── News tag ── */
    .news-tag { position: absolute; top: 41px; right: 41px; background: #fff; padding: 10px 18px; z-index: 3; }
    .news-tag span { font-size: 28px; font-weight: 600; color: #141414; line-height: 1; letter-spacing: -0.14px; white-space: nowrap; }
    .news-tag.hidden { display: none !important; }

    /* ── Headline ── */
    .headline { position: absolute; left: 41px; z-index: 2; max-width: 998px; }
    .headline p { font-size: 104px; font-weight: 600; color: var(--text-color, #fff); line-height: 0.95; letter-spacing: -1.04px; white-space: pre-line; overflow-wrap: break-word; }
    .headline.hidden { display: none !important; }
    #post-canvas.variant-dark    .headline { top: 140px; left: 41px; right: 41px; }
    #post-canvas.variant-split   .headline { top: auto; bottom: 41px; left: 41px; right: 41px; }
    #post-canvas.variant-pattern .headline { top: 41px; left: 41px; right: 41px; }

    /* ── Body copy ── */
    .body-block { position: absolute; left: 41px; z-index: 2; max-width: 880px; }
    .body-block p { font-size: 36px; font-weight: 400; color: var(--text-color, #fff); line-height: 0.95; letter-spacing: -0.18px; white-space: pre-line; }
    .body-block.hidden { display: none !important; }
    /* 680px = midpoint of 1360px canvas. Add 41px gap from the image edge. */
    #post-canvas.variant-dark    .body-block { top: auto; bottom: 721px; left: 41px; right: 41px; }
    #post-canvas.variant-split   .body-block { top: 721px; left: 41px; right: 41px; }
    #post-canvas.variant-pattern .body-block { top: auto; bottom: 721px; left: 41px; right: 41px; }

    /* ── Bottom brand ── */
    .bottom-brand { position: absolute; left: 41px; bottom: 41px; display: flex; align-items: center; gap: 12px; z-index: 3; }
    .bottom-brand .logo-paysend { height: 44px; width: auto; filter: brightness(0) invert(1); }
    #post-canvas.variant-dark  .bottom-brand,
    #post-canvas.variant-split .bottom-brand { display: none; }
    #post-canvas.variant-pattern .bottom-brand { left: 41px; right: 41px; bottom: 41px; display: flex; align-items: center; justify-content: center; }
    #post-canvas.variant-pattern .bottom-brand .logo-paysend { width: 100%; height: auto; max-width: 998px; }

    /* ── Controls (app chrome) ── */
    .controls { background: #fff; border-left: 1px solid #e8e8e8; padding: 24px 20px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }
    .control-section { display: flex; flex-direction: column; gap: 6px; }
    .control-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; color: #888; }
    .control-input, .control-textarea { width: 100%; padding: 9px 11px; border: 1px solid #e0e0e0; border-radius: 6px; font-size: 14px; font-family: inherit; color: #1a1a1a; background: #fafafa; transition: border-color 0.15s; resize: none; }
    .control-input:focus, .control-textarea:focus { outline: none; border-color: #17bff2; background: #fff; }
    .divider { height: 1px; background: #f0f0f0; margin: 2px 0; }
    .section-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .section-row .control-label { margin-bottom: 0; }
    .section-body { display: flex; flex-direction: column; gap: 10px; }
    .control-section.section-off .section-body { display: none; }
    .sub-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #999; margin-bottom: 4px; display: block; }
    .toggle-switch { position: relative; width: 36px; height: 20px; flex-shrink: 0; }
    .toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
    .toggle-slider { position: absolute; cursor: pointer; inset: 0; background: #ccc; border-radius: 20px; transition: background 0.2s; }
    .toggle-slider::before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: transform 0.2s; }
    .toggle-switch input:checked + .toggle-slider { background: #141414; }
    .toggle-switch input:checked + .toggle-slider::before { transform: translateX(16px); }
    .seg-control { display: flex; gap: 4px; background: #f5f5f5; padding: 4px; border-radius: 8px; flex-wrap: wrap; }
    .seg-btn { flex: 1 1 45%; padding: 8px 10px; font-size: 12px; font-weight: 600; font-family: inherit; color: #555; background: transparent; border: none; border-radius: 6px; cursor: pointer; transition: background 0.15s, color 0.15s; min-width: 0; }
    .seg-btn.active { background: #141414; color: #fff; }
    .seg-btn:not(.active):hover { color: #141414; }
    .color-palette { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
    .color-swatch { width: 32px; height: 32px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: transform 0.12s, border-color 0.12s; flex-shrink: 0; }
    .color-swatch:hover { transform: scale(1.15); }
    .color-swatch.active { border-color: #141414; transform: scale(1.1); box-shadow: 0 0 0 1px #fff inset; }
    .upload-zone { border: 2px dashed #ddd; border-radius: 8px; padding: 12px; cursor: pointer; transition: border-color 0.15s, background 0.15s; min-height: 70px; display: flex; align-items: center; justify-content: center; }
    .upload-zone:hover { border-color: #17bff2; background: #f0fbff; }
    .upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 3px; color: #aaa; font-size: 12px; }
    .upload-icon { font-size: 18px; line-height: 1; }
    .upload-hint { font-size: 11px; color: #ccc; }
    .upload-preview { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; }
    .upload-preview img { width: 100%; height: 60px; object-fit: cover; border-radius: 4px; }
    .remove-photo { font-size: 11px; color: #e94560; background: none; border: none; cursor: pointer; padding: 2px 4px; font-family: inherit; }
    .remove-photo:hover { text-decoration: underline; }
    .download-btn { margin-top: auto; padding: 13px 20px; background: #141414; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.15s, transform 0.1s; }
    .download-btn:hover:not(:disabled) { background: #333; }
    .download-btn:active:not(:disabled) { transform: scale(0.98); }
    .download-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    @media (max-width: 1199px) { .workspace { grid-template-columns: 1fr 33vw; } }
    @media (max-width:  799px) { .workspace { grid-template-columns: 1fr 40vw; } }
    @media (max-width:  499px) {
      html, body { height: auto; overflow: auto; }
      .workspace { display: flex; flex-direction: column; overflow: visible; height: auto; }
      .preview-area { padding: 0; overflow: visible; justify-content: flex-start; align-items: stretch; flex-shrink: 0; height: auto; }
      .preview-wrapper { width: 100vw !important; border-radius: 0; box-shadow: none; flex-shrink: 0; }
      .preview-hint { display: none; }
      .controls { border-left: none; border-top: 1px solid #e8e8e8; height: auto; overflow-y: visible; flex: none; }
    }
  </style>
</head>
<body>

  <header class="header">
    <a href="/" title="Back to layouts">
      <img class="header-logo" src="/assets/logo-planet.svg" alt="Paysend" />
    </a>
    <h1>Post Builder</h1>
    <p>1080 × 1360 [Layout Name]</p>
  </header>

  <main class="workspace">

    <div class="preview-area">
      <div class="preview-wrapper">
        <div id="post-canvas" class="variant-dark">

          <!-- Background layers -->
          <div class="bg-dark-full"></div>
          <div class="bg-pattern-strip-bottom"></div>
          <div class="bg-pattern-strip-top"></div>
          <div class="bg-dark-bottom"></div>
          <div class="bg-dark-top"></div>
          <div class="bg-pattern-strip-pattern"></div>

          <!-- Top-left: Paysend wordmark + optional partners -->
          <div class="top-logos">
            <img class="logo-paysend" src="/assets/logo-paysend-wordmark.svg" alt="Paysend" />
            <div class="logo-divider" id="divider-1"></div>
            <img class="logo-partner" id="logo-partner-1" src="/assets/partner-logo.png" alt="Partner 1" />
            <div class="logo-divider" id="divider-2"></div>
            <img class="logo-partner" id="logo-partner-2" src="/assets/partner-logo.png" alt="Partner 2" />
          </div>

          <!-- Top-right: news tag -->
          <div class="news-tag" id="news-tag">
            <span id="preview-tag">news</span>
          </div>

          <!-- Headline -->
          <div class="headline" id="headline">
            <p id="preview-headline">Your Headline Here</p>
          </div>

          <!-- Body copy -->
          <div class="body-block" id="body-block">
            <p id="preview-body">Supporting body copy goes here.</p>
          </div>

          <!-- Bottom brand (pattern variant only) -->
          <div class="bottom-brand">
            <img class="logo-paysend" id="bottom-brand-logo" src="/assets/logo-paysend-wordmark.svg" alt="Paysend" />
          </div>

        </div><!-- #post-canvas -->
      </div><!-- .preview-wrapper -->
      <p class="preview-hint">Preview scaled — exports 1080 × 1360</p>
    </div><!-- .preview-area -->

    <div class="controls variant-dark">

      <!-- Variant -->
      <div class="control-section">
        <label class="control-label">Variant</label>
        <div class="seg-control" id="variant-switch">
          <button class="seg-btn active" data-variant="dark"    type="button">Dark</button>
          <button class="seg-btn"        data-variant="split"   type="button">Split</button>
          <button class="seg-btn"        data-variant="pattern" type="button">Pattern</button>
        </div>
      </div>

      <!-- Tag -->
      <div class="control-section">
        <div class="section-row">
          <label class="control-label">Tag</label>
          <label class="toggle-switch"><input type="checkbox" id="tag-toggle" checked /><span class="toggle-slider"></span></label>
        </div>
        <div class="section-body">
          <input class="control-input" id="input-tag" type="text" value="news" />
        </div>
      </div>

      <div class="divider"></div>

      <!-- Headline -->
      <div class="control-section">
        <div class="section-row">
          <label class="control-label">Headline</label>
          <label class="toggle-switch"><input type="checkbox" id="headline-toggle" checked /><span class="toggle-slider"></span></label>
        </div>
        <div class="section-body">
          <textarea class="control-textarea" id="input-headline" rows="3">Your Headline Here</textarea>
        </div>
      </div>

      <!-- Body -->
      <div class="control-section">
        <div class="section-row">
          <label class="control-label">Body Copy</label>
          <label class="toggle-switch"><input type="checkbox" id="body-toggle" checked /><span class="toggle-slider"></span></label>
        </div>
        <div class="section-body">
          <textarea class="control-textarea" id="input-body" rows="4">Supporting body copy goes here.</textarea>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Background color -->
      <div class="control-section">
        <label class="control-label">Background Color</label>
        <div class="color-palette" id="bg-palette">
          <button class="color-swatch active" data-color="#0a0a0a" style="background:#0a0a0a" title="Black"></button>
          <button class="color-swatch" data-color="#08ffce" style="background:#08ffce" title="Cyan"></button>
          <button class="color-swatch" data-color="#17bff2" style="background:#17bff2" title="Sky Blue"></button>
          <button class="color-swatch" data-color="#4a57c5" style="background:#4a57c5" title="Indigo"></button>
          <button class="color-swatch" data-color="#08c197" style="background:#08c197" title="Teal"></button>
          <button class="color-swatch" data-color="#a0eb31" style="background:#a0eb31" title="Lime"></button>
          <button class="color-swatch" data-color="#f7e43d" style="background:#f7e43d" title="Yellow"></button>
          <button class="color-swatch" data-color="#f7ab3d" style="background:#f7ab3d" title="Orange"></button>
          <button class="color-swatch" data-color="#ff574a" style="background:#ff574a" title="Red"></button>
          <button class="color-swatch" data-color="#b75eff" style="background:#b75eff" title="Purple"></button>
          <button class="color-swatch" data-color="#fe94da" style="background:#fe94da" title="Pink"></button>
        </div>
      </div>

      <!-- Partner logo 1 -->
      <div class="control-section">
        <div class="section-row">
          <label class="control-label">Partner Logo 1</label>
          <label class="toggle-switch"><input type="checkbox" id="partner1-toggle" /><span class="toggle-slider"></span></label>
        </div>
        <div class="section-body">
          <select class="control-input partner-preset" id="partner1-preset">
            <option value="custom">Custom upload</option>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
          </select>
          <div class="upload-zone" id="partner1-zone">
            <div class="upload-placeholder"><span class="upload-icon">↑</span><span>Upload logo</span><span class="upload-hint">PNG, SVG, JPG</span></div>
            <div class="upload-preview" style="display:none"><img src="" alt="thumb" style="object-fit:contain;background:#1a1a1a;" /><button class="remove-photo">Remove</button></div>
          </div>
          <input type="file" accept="image/*,.svg" id="partner1-file" style="display:none" />
        </div>
      </div>

      <!-- Partner logo 2 -->
      <div class="control-section">
        <div class="section-row">
          <label class="control-label">Partner Logo 2</label>
          <label class="toggle-switch"><input type="checkbox" id="partner2-toggle" /><span class="toggle-slider"></span></label>
        </div>
        <div class="section-body">
          <select class="control-input partner-preset" id="partner2-preset">
            <option value="custom">Custom upload</option>
            <option value="visa">Visa</option>
            <option value="mastercard">Mastercard</option>
          </select>
          <div class="upload-zone" id="partner2-zone">
            <div class="upload-placeholder"><span class="upload-icon">↑</span><span>Upload logo</span><span class="upload-hint">PNG, SVG, JPG</span></div>
            <div class="upload-preview" style="display:none"><img src="" alt="thumb" style="object-fit:contain;background:#1a1a1a;" /><button class="remove-photo">Remove</button></div>
          </div>
          <input type="file" accept="image/*,.svg" id="partner2-file" style="display:none" />
        </div>
      </div>

      <button class="download-btn" id="download-btn">Download PNG</button>

    </div><!-- .controls -->
  </main>

  <script>
  /* ── Image optimiser ── */
  const MAX_EDGE = 2400, SMALL_FILE_BYTES = 400 * 1024;
  async function fileToOptimizedSrc(file) {
    if (file.type === 'image/svg+xml' || file.size <= SMALL_FILE_BYTES) return URL.createObjectURL(file);
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
      if (scale === 1) { bitmap.close(); return URL.createObjectURL(file); }
      const w = Math.round(bitmap.width * scale), h = Math.round(bitmap.height * scale);
      const cvs = document.createElement('canvas'); cvs.width = w; cvs.height = h;
      cvs.getContext('2d').drawImage(bitmap, 0, 0, w, h); bitmap.close();
      const blob = await new Promise(res => cvs.toBlob(res, 'image/jpeg', 0.88));
      return URL.createObjectURL(blob);
    } catch { return URL.createObjectURL(file); }
  }

  const canvas = document.getElementById('post-canvas');
  const controlsEl = document.querySelector('.controls');

  /* ── Text bindings ── */
  function bindText(inputId, previewId) {
    const input = document.getElementById(inputId), preview = document.getElementById(previewId);
    if (!input || !preview) return;
    input.addEventListener('input', () => { preview.textContent = input.value; });
  }
  bindText('input-tag',  'preview-tag');
  bindText('input-body', 'preview-body');

  const headlineInput = document.getElementById('input-headline');
  headlineInput.addEventListener('input', () => { document.getElementById('preview-headline').textContent = headlineInput.value; fitHeadline(); });

  /* ── Headline auto-fit ── */
  const HL_BASE = 104, HL_MIN = 48;
  function longestWordWidth(el) {
    const words = (el.textContent || '').trim().split(/\s+/);
    const cs = getComputedStyle(el);
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;left:-99999px;top:-99999px;visibility:hidden;white-space:nowrap;';
    ['fontFamily','fontSize','fontWeight','fontStyle','letterSpacing','textTransform'].forEach(p => probe.style[p] = cs[p]);
    document.body.appendChild(probe);
    let max = 0;
    for (const w of words) { probe.textContent = w; if (probe.offsetWidth > max) max = probe.offsetWidth; }
    document.body.removeChild(probe); return max;
  }
  function fitHeadline() {
    const el = document.getElementById('preview-headline');
    const wrap = document.getElementById('headline');
    if (!el || !wrap) return;
    let size = HL_BASE; el.style.fontSize = size + 'px';
    for (let i = 0; i < 50; i++) {
      if (size <= HL_MIN) break;
      if (longestWordWidth(el) <= wrap.clientWidth + 0.5) break;
      size -= 2; el.style.fontSize = size + 'px';
    }
  }

  /* ── Toggles ── */
  function syncSectionOff(cb) { const s = cb.closest('.control-section'); if (s) s.classList.toggle('section-off', !cb.checked); }
  function bindToggle(toggleId, targetEl) {
    const cb = document.getElementById(toggleId);
    const apply = () => { targetEl.classList.toggle('hidden', !cb.checked); syncSectionOff(cb); };
    cb.addEventListener('change', apply); apply();
  }
  bindToggle('tag-toggle',      document.getElementById('news-tag'));
  bindToggle('headline-toggle', document.getElementById('headline'));
  bindToggle('body-toggle',     document.getElementById('body-block'));

  /* ── Variant switch ── */
  const variantSwitch = document.getElementById('variant-switch');
  const bottomBrandLogo = document.getElementById('bottom-brand-logo');
  const PAYSEND_WORDMARK = '/assets/logo-paysend-wordmark.svg';
  const PAYSEND_MAIN     = '/assets/Paysend-main-logo.svg';
  function applyVariant(v) {
    ['dark','split','pattern'].forEach(x => {
      canvas.classList.toggle('variant-' + x, x === v);
      controlsEl.classList.toggle('variant-' + x, x === v);
    });
    variantSwitch.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('active', b.dataset.variant === v));
    bottomBrandLogo.src = (v === 'pattern') ? PAYSEND_MAIN : PAYSEND_WORDMARK;
    fitHeadline();
  }
  variantSwitch.querySelectorAll('.seg-btn').forEach(b => b.addEventListener('click', () => applyVariant(b.dataset.variant)));

  /* ── Background color palette ── */
  const DARK_BG = new Set(['#0a0a0a', '#4a57c5']);
  const bgPalette = document.getElementById('bg-palette');
  bgPalette.querySelectorAll('.color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      bgPalette.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      const c = sw.dataset.color;
      canvas.style.setProperty('--bg-color', c);
      const isDark = DARK_BG.has(c);
      canvas.style.setProperty('--text-color', isDark ? '#fff' : '#141414');
      canvas.classList.toggle('bg-light', !isDark);
    });
  });

  /* ── Partner toggles ── */
  function updateLogoLayout() {
    const visible = document.querySelectorAll('.top-logos .logo-partner:not(.hidden)').length;
    canvas.classList.toggle('logo-compact', visible >= 2);
  }
  function bindPartnerToggle(toggleId, logoId, dividerId) {
    const cb = document.getElementById(toggleId);
    const logo = document.getElementById(logoId), divider = document.getElementById(dividerId);
    const apply = () => { const off = !cb.checked; logo.classList.toggle('hidden', off); divider.classList.toggle('hidden', off); syncSectionOff(cb); updateLogoLayout(); };
    cb.addEventListener('change', apply); apply();
  }
  bindPartnerToggle('partner1-toggle', 'logo-partner-1', 'divider-1');
  bindPartnerToggle('partner2-toggle', 'logo-partner-2', 'divider-2');

  /* ── Partner logo uploads ── */
  function setupLogoUpload({ zoneId, fileId, imgId, defaultSrc }) {
    const zone = document.getElementById(zoneId), fileInput = document.getElementById(fileId), img = document.getElementById(imgId);
    const placeholder = zone.querySelector('.upload-placeholder'), preview = zone.querySelector('.upload-preview');
    const thumb = preview.querySelector('img'), removeBtn = preview.querySelector('.remove-photo');
    function setSrc(src) { img.src = src; thumb.src = src; placeholder.style.display = 'none'; preview.style.display = 'flex'; }
    function clearSrc() { img.src = defaultSrc; fileInput.value = ''; placeholder.style.display = ''; preview.style.display = 'none'; }
    zone.addEventListener('click', e => { if (e.target === removeBtn || removeBtn.contains(e.target)) return; fileInput.click(); });
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor = '#141414'; });
    zone.addEventListener('dragleave', () => { zone.style.borderColor = ''; });
    zone.addEventListener('drop', async e => { e.preventDefault(); zone.style.borderColor = ''; const f = e.dataTransfer.files[0]; if (f) setSrc(await fileToOptimizedSrc(f)); });
    fileInput.addEventListener('change', async () => { const f = fileInput.files[0]; if (f) setSrc(await fileToOptimizedSrc(f)); });
    removeBtn.addEventListener('click', e => { e.stopPropagation(); clearSrc(); });
  }
  setupLogoUpload({ zoneId: 'partner1-zone', fileId: 'partner1-file', imgId: 'logo-partner-1', defaultSrc: '/assets/partner-logo.png' });
  setupLogoUpload({ zoneId: 'partner2-zone', fileId: 'partner2-file', imgId: 'logo-partner-2', defaultSrc: '/assets/partner-logo.png' });

  /* ── Partner presets ── */
  const PARTNER_PRESETS = { visa: '/assets/partner-logos/visa.png', mastercard: '/assets/partner-logos/master-card.png' };
  function setupPartnerPreset({ selectId, zoneId, imgId, defaultSrc }) {
    const select = document.getElementById(selectId), zone = document.getElementById(zoneId), img = document.getElementById(imgId);
    if (!select || !zone || !img) return;
    let lastCustom = defaultSrc;
    new MutationObserver(() => { if (select.value === 'custom') lastCustom = img.src; }).observe(img, { attributes: true, attributeFilter: ['src'] });
    select.addEventListener('change', () => {
      const v = select.value;
      if (v === 'custom') { zone.style.display = ''; img.src = lastCustom; }
      else if (PARTNER_PRESETS[v]) { zone.style.display = 'none'; img.src = PARTNER_PRESETS[v]; }
    });
  }
  setupPartnerPreset({ selectId: 'partner1-preset', zoneId: 'partner1-zone', imgId: 'logo-partner-1', defaultSrc: '/assets/partner-logo.png' });
  setupPartnerPreset({ selectId: 'partner2-preset', zoneId: 'partner2-zone', imgId: 'logo-partner-2', defaultSrc: '/assets/partner-logo.png' });

  /* ── Download ── */
  const CANVAS_W = 1080, CANVAS_H = 1360;
  document.getElementById('download-btn').addEventListener('click', async () => {
    const btn = document.getElementById('download-btn');
    btn.disabled = true; btn.textContent = 'Exporting…';
    try {
      const result = await html2canvas(canvas, { scale: 1, useCORS: true, allowTaint: true, width: CANVAS_W, height: CANVAS_H });
      const a = document.createElement('a'); a.href = result.toDataURL('image/png'); a.download = 'paysend-post.png'; a.click();
    } finally { btn.disabled = false; btn.textContent = 'Download PNG'; }
  });

  /* ── Preview scaling ── */
  (function scalePreview() {
    const PREVIEW_PAD = 64, HEADER_H = 60;
    const wrapper = document.querySelector('.preview-wrapper'), cvs = document.getElementById('post-canvas');
    function update() {
      const w = window.innerWidth, h = window.innerHeight;
      let sf = w < 500 ? 0 : w < 800 ? 0.40 : w < 1200 ? 0.33 : 0.25;
      let availW = w < 500 ? w : w * (1 - sf) - PREVIEW_PAD;
      let availH = w < 500 ? Infinity : h - HEADER_H - 80;
      const scale = Math.min(availW / CANVAS_W, availH / CANVAS_H);
      wrapper.style.width  = Math.round(CANVAS_W * scale) + 'px';
      wrapper.style.height = Math.round(CANVAS_H * scale) + 'px';
      cvs.style.transform  = `scale(${scale})`;
    }
    update(); window.addEventListener('resize', update);
  })();

  /* ── Init ── */
  fitHeadline();
  </script>
</body>
</html>
```

---

## Root menu entry (`index.html`)

After creating a new `templates<N>/` folder, add it to the root `index.html` grid:

```html
<a class="layout-card" href="/templates7/">
  <div class="layout-thumb" style="background:#0a0a0a;">
    <!-- Optional: small preview SVG or emoji -->
  </div>
  <div class="layout-info">
    <span class="layout-name">Layout 7</span>
    <span class="layout-desc">1080 × 1360 · [brief description]</span>
  </div>
</a>
```

---

## Landscape canvas size differences (1200×627)

Use these values instead when building a landscape layout:

```js
const CANVAS_W = 1200, CANVAS_H = 627;
```

The 41 px margin rule still applies on all four sides. Headline / body absolute positioning is derived from the landscape midpoint: `height / 2 = 313.5 px` → rounded to `314px`. Gap from the image edge: `314 + 41 = 355px`.
