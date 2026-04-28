# Components

---

## Logo block — `.top-logos`

The top-left area always has the Paysend wordmark. Up to two partner logos can be added. All items share a fixed `height: 48px` row.

```html
<div class="top-logos">
  <img class="logo-paysend" src="/assets/logo-paysend-wordmark.svg" alt="Paysend" />
  <div class="logo-divider" id="divider-1"></div>
  <img class="logo-partner" id="logo-partner-1" src="/assets/partner-logo.png" alt="Partner 1" />
  <div class="logo-divider" id="divider-2"></div>
  <img class="logo-partner" id="logo-partner-2" src="/assets/partner-logo.png" alt="Partner 2" />
</div>
```

```css
.top-logos {
  position: absolute; top: 41px; left: 41px;
  z-index: 3; display: flex; align-items: center; gap: 16px;
  height: 48px;
}
.top-logos .logo-paysend { height: 100%; width: auto; filter: brightness(0) invert(1); flex-shrink: 0; }
.top-logos .logo-divider  { width: 2px; height: 100%; background: rgba(255,255,255,0.55); flex-shrink: 0; }
.top-logos .logo-partner  { height: 100%; width: auto; object-fit: contain; display: block; flex-shrink: 0; }
.top-logos .logo-partner.hidden,
.top-logos .logo-divider.hidden { display: none !important; }
```

### Compact mode (2 partners visible)

When both partners are on, shrink everything so the row doesn't overflow.

```css
#post-canvas.logo-compact .logo-paysend { width: auto; height: 40px; max-width: 200px; }
#post-canvas.logo-compact .logo-partner { height: 40px; }
#post-canvas.logo-compact .logo-divider { height: 40px; }
```

```js
function updateLogoLayout() {
  const visible = document.querySelectorAll('.top-logos .logo-partner:not(.hidden)').length;
  canvas.classList.toggle('logo-compact', visible >= 2);
}
```

### Landscape / older layouts (`.post-logos`)

Some layouts use `.post-logos` instead of `.top-logos`. Same logic, slightly different sizes:

```css
.logo-paysend { width: 313px; height: 53px; object-fit: contain; }
.logo-divider  { width: 2px; height: 53px; background: rgba(255,255,255,0.55); }
.logo-partner  { height: 53px; width: auto; object-fit: contain; }
/* compact */
#post-canvas.logo-compact .logo-paysend { width: auto; height: 40px; max-width: 200px; }
#post-canvas.logo-compact .logo-partner { height: 40px; }
#post-canvas.logo-compact .logo-divider { height: 40px; }
```

---

## News tag — `.news-tag`

Always top-right, always white background.

```html
<div class="news-tag" id="news-tag">
  <span id="preview-tag">news</span>
</div>
```

```css
.news-tag {
  position: absolute; top: 41px; right: 41px;
  background: #fff; padding: 10px 18px;
  z-index: 3;
}
.news-tag span {
  font-size: 28px; font-weight: 600; color: #141414;
  line-height: 1; letter-spacing: -0.14px; white-space: nowrap;
}
.news-tag.hidden { display: none !important; }
```

---

## Headline — `.headline`

```html
<div class="headline" id="headline">
  <p id="preview-headline">Headline text</p>
</div>
```

```css
.headline {
  position: absolute;
  left: 41px; /* right: 41px set per variant or inline */
  z-index: 2; max-width: 998px;
}
.headline p {
  font-size: 104px; font-weight: 600;
  color: var(--text-color, #fff);
  line-height: 0.95; letter-spacing: -1.04px;
  white-space: pre-line; overflow-wrap: break-word;
}
.headline.hidden { display: none !important; }
```

Vertical position is set per-variant (see SKILL.md spacing rules).

---

## Body copy — `.body-block`

```html
<div class="body-block" id="body-block">
  <p id="preview-body">Body text here.</p>
</div>
```

```css
.body-block {
  position: absolute;
  left: 41px;
  z-index: 2; max-width: 740px; /* or 880px for wide layouts */
}
.body-block p {
  font-size: 36px; font-weight: 400;
  color: var(--text-color, #fff);
  line-height: 0.95; letter-spacing: -0.18px;
  white-space: pre-line;
}
.body-block.hidden { display: none !important; }
```

---

## Bottom brand — `.bottom-brand`

Used to show the Paysend wordmark at the bottom of the canvas (pattern and solid variants).

```css
.bottom-brand {
  position: absolute;
  left: 41px; bottom: 41px;
  display: flex; align-items: center; gap: 12px;
  z-index: 3;
}
.bottom-brand .logo-paysend {
  height: 44px; width: auto;
  filter: brightness(0) invert(1);
}
```

**Pattern variant** — fills the full width of the pattern strip:

```css
#post-canvas.variant-pattern .bottom-brand {
  left: 41px; right: 41px; bottom: 41px;
  display: flex; align-items: center; justify-content: center;
}
#post-canvas.variant-pattern .bottom-brand .logo-paysend {
  width: 100%; height: auto; max-width: 998px;
}
```

Switch the logo src to the full planet + wordmark mark in the pattern variant:

```js
const PAYSEND_WORDMARK = '/assets/logo-paysend-wordmark.svg';
const PAYSEND_MAIN     = '/assets/Paysend-main-logo.svg';

// inside applyVariant(v):
bottomBrandLogo.src = (v === 'pattern') ? PAYSEND_MAIN : PAYSEND_WORDMARK;
```

---

## Toggle switch

Used to show/hide optional canvas elements.

```html
<label class="toggle-switch">
  <input type="checkbox" id="tag-toggle" checked />
  <span class="toggle-slider"></span>
</label>
```

```css
.toggle-switch { position: relative; width: 36px; height: 20px; flex-shrink: 0; }
.toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
.toggle-slider { position: absolute; cursor: pointer; inset: 0; background: #ccc; border-radius: 20px; transition: background 0.2s; }
.toggle-slider::before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: transform 0.2s; }
.toggle-switch input:checked + .toggle-slider { background: #141414; }
.toggle-switch input:checked + .toggle-slider::before { transform: translateX(16px); }
```

```js
function bindToggle(toggleId, targetEl) {
  const cb = document.getElementById(toggleId);
  const apply = () => {
    targetEl.classList.toggle('hidden', !cb.checked);
    const section = cb.closest('.control-section');
    if (section) section.classList.toggle('section-off', !cb.checked);
  };
  cb.addEventListener('change', apply);
  apply(); // run once on init
}
```

---

## Collapsible control section

A section whose body hides when its toggle is off.

```html
<div class="control-section">
  <div class="section-row">
    <label class="control-label">Section Name</label>
    <label class="toggle-switch">
      <input type="checkbox" id="my-toggle" checked />
      <span class="toggle-slider"></span>
    </label>
  </div>
  <div class="section-body">
    <!-- inputs here -->
  </div>
</div>
```

```css
.section-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.section-body { display: flex; flex-direction: column; gap: 10px; }
.control-section.section-off .section-body { display: none; }
```

---

## Color swatch palette

```html
<div class="color-palette" id="accent-palette">
  <button class="color-swatch active" data-color="#08ffce" style="background:#08ffce" title="Cyan"></button>
  <!-- ... more swatches ... -->
</div>
```

```css
.color-palette { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
.color-swatch {
  width: 32px; height: 32px; border-radius: 50%;
  border: 2px solid transparent; cursor: pointer;
  transition: transform 0.12s, border-color 0.12s; flex-shrink: 0;
}
.color-swatch:hover { transform: scale(1.15); }
.color-swatch.active { border-color: #141414; transform: scale(1.1); box-shadow: 0 0 0 1px #fff inset; }
```

---

## Upload zone

```html
<div class="upload-zone" id="photo-zone">
  <div class="upload-placeholder">
    <span class="upload-icon">↑</span>
    <span>Upload photo</span>
    <span class="upload-hint">PNG, JPG, WebP</span>
  </div>
  <div class="upload-preview" style="display:none">
    <img src="" alt="thumb" />
    <button class="remove-photo">Remove</button>
  </div>
</div>
<input type="file" accept="image/*" id="photo-file" style="display:none" />
```

```css
.upload-zone {
  border: 2px dashed #ddd; border-radius: 8px; padding: 12px;
  cursor: pointer; transition: border-color 0.15s, background 0.15s;
  min-height: 70px; display: flex; align-items: center; justify-content: center;
}
.upload-zone:hover { border-color: #17bff2; background: #f0fbff; }
.upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 3px; color: #aaa; font-size: 12px; }
.upload-icon { font-size: 18px; line-height: 1; }
.upload-hint { font-size: 11px; color: #ccc; }
.upload-preview { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%; }
.upload-preview img { width: 100%; height: 60px; object-fit: cover; border-radius: 4px; }
.remove-photo { font-size: 11px; color: #e94560; background: none; border: none; cursor: pointer; padding: 2px 4px; font-family: inherit; }
.remove-photo:hover { text-decoration: underline; }
```

JS helper — optimizes large images before use, supports drag-and-drop:

```js
const MAX_EDGE = 2400;
const SMALL_FILE_BYTES = 400 * 1024;

async function fileToOptimizedSrc(file) {
  if (file.type === 'image/svg+xml' || file.size <= SMALL_FILE_BYTES) return URL.createObjectURL(file);
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1) { bitmap.close(); return URL.createObjectURL(file); }
    const w = Math.round(bitmap.width * scale), h = Math.round(bitmap.height * scale);
    const cvs = document.createElement('canvas');
    cvs.width = w; cvs.height = h;
    cvs.getContext('2d').drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise(res => cvs.toBlob(res, 'image/jpeg', 0.88));
    return URL.createObjectURL(blob);
  } catch { return URL.createObjectURL(file); }
}

function setupLogoUpload({ zoneId, fileId, imgId, defaultSrc }) {
  const zone = document.getElementById(zoneId);
  const fileInput = document.getElementById(fileId);
  const img = document.getElementById(imgId);
  const placeholder = zone.querySelector('.upload-placeholder');
  const preview = zone.querySelector('.upload-preview');
  const thumb = preview.querySelector('img');
  const removeBtn = preview.querySelector('.remove-photo');

  function setSrc(src) { img.src = src; thumb.src = src; placeholder.style.display = 'none'; preview.style.display = 'flex'; }
  function clearSrc() { img.src = defaultSrc; fileInput.value = ''; placeholder.style.display = ''; preview.style.display = 'none'; }

  zone.addEventListener('click', e => { if (e.target === removeBtn || removeBtn.contains(e.target)) return; fileInput.click(); });
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor = '#141414'; });
  zone.addEventListener('dragleave', () => { zone.style.borderColor = ''; });
  zone.addEventListener('drop', async e => { e.preventDefault(); zone.style.borderColor = ''; const f = e.dataTransfer.files[0]; if (f) setSrc(await fileToOptimizedSrc(f)); });
  fileInput.addEventListener('change', async () => { const f = fileInput.files[0]; if (f) setSrc(await fileToOptimizedSrc(f)); });
  removeBtn.addEventListener('click', e => { e.stopPropagation(); clearSrc(); });
}
```

---

## Partner logo preset dropdown

Placed directly above each upload zone. Lets the user pick Visa / Mastercard without uploading.

```html
<select class="control-input partner-preset" id="partner1-preset">
  <option value="custom">Custom upload</option>
  <option value="visa">Visa</option>
  <option value="mastercard">Mastercard</option>
</select>
```

```js
const PARTNER_PRESETS = {
  visa: '/assets/partner-logos/visa.png',
  mastercard: '/assets/partner-logos/master-card.png',
};

function setupPartnerPreset({ selectId, zoneId, imgId, defaultSrc }) {
  const select = document.getElementById(selectId);
  const zone   = document.getElementById(zoneId);
  const img    = document.getElementById(imgId);
  if (!select || !zone || !img) return;
  let lastCustom = defaultSrc;
  // Track any custom upload so we can restore it when switching back
  new MutationObserver(() => {
    if (select.value === 'custom') lastCustom = img.src;
  }).observe(img, { attributes: true, attributeFilter: ['src'] });
  select.addEventListener('change', () => {
    const v = select.value;
    if (v === 'custom') { zone.style.display = ''; img.src = lastCustom; }
    else if (PARTNER_PRESETS[v]) { zone.style.display = 'none'; img.src = PARTNER_PRESETS[v]; }
  });
}
```

---

## Segment control (variant switcher)

```html
<div class="seg-control" id="variant-switch">
  <button class="seg-btn active" data-variant="dark"    type="button">Dark</button>
  <button class="seg-btn"        data-variant="split"   type="button">Split</button>
  <button class="seg-btn"        data-variant="pattern" type="button">Pattern</button>
</div>
```

```css
.seg-control { display: flex; gap: 4px; background: #f5f5f5; padding: 4px; border-radius: 8px; flex-wrap: wrap; }
.seg-btn {
  flex: 1 1 45%; padding: 8px 10px; font-size: 12px; font-weight: 600;
  font-family: inherit; color: #555; background: transparent;
  border: none; border-radius: 6px; cursor: pointer;
  transition: background 0.15s, color 0.15s; min-width: 0;
}
.seg-btn.active { background: #141414; color: #fff; }
.seg-btn:not(.active):hover { color: #141414; }
```

---

## Download button

Always sticks to the bottom of the controls panel.

```html
<button class="download-btn" id="download-btn">Download PNG</button>
```

```css
.download-btn {
  margin-top: auto; padding: 13px 20px;
  background: #141414; color: #fff; border: none;
  border-radius: 8px; font-size: 14px; font-weight: 600;
  cursor: pointer; font-family: inherit;
  transition: background 0.15s, transform 0.1s;
}
.download-btn:hover:not(:disabled) { background: #333; }
.download-btn:active:not(:disabled) { transform: scale(0.98); }
.download-btn:disabled { opacity: 0.6; cursor: not-allowed; }
```

```js
document.getElementById('download-btn').addEventListener('click', async () => {
  const btn = document.getElementById('download-btn');
  btn.disabled = true; btn.textContent = 'Exporting…';
  try {
    const cvs = await html2canvas(document.getElementById('post-canvas'), {
      scale: 1, useCORS: true, allowTaint: true,
      width: CANVAS_W, height: CANVAS_H,
    });
    const a = document.createElement('a');
    a.href = cvs.toDataURL('image/png');
    a.download = 'paysend-post.png';
    a.click();
  } finally {
    btn.disabled = false; btn.textContent = 'Download PNG';
  }
});
```

---

## Variant background layers

For layouts that have multiple visual variants (dark / split / pattern), add hidden `<div>` layers and reveal them with CSS variant classes.

```html
<!-- Inside #post-canvas -->
<div class="bg-dark-full"></div>
<div class="bg-pattern-strip-bottom"></div>
<div class="bg-pattern-strip-top"></div>
<div class="bg-dark-bottom"></div>
<div class="bg-dark-top"></div>
<div class="bg-pattern-strip-pattern"></div>
```

```css
/* All hidden by default */
.bg-dark-full, .bg-pattern-strip-bottom,
.bg-pattern-strip-top, .bg-dark-bottom,
.bg-dark-top, .bg-pattern-strip-pattern { position: absolute; display: none; }

/* Dark variant: solid bg + pattern strip at bottom half */
#post-canvas.variant-dark .bg-dark-full            { display: block; inset: 0; background: var(--bg-color, #0a0a0a); }
#post-canvas.variant-dark .bg-pattern-strip-bottom { display: block; left: 0; right: 0; bottom: 0; height: 50%; background: #0a0a0a url('/assets/pattern-1.png') center / cover no-repeat; }

/* Split variant: pattern top, dark bottom */
#post-canvas.variant-split .bg-pattern-strip-top   { display: block; left: 0; right: 0; top: 0;    height: 50%; background: #0a0a0a url('/assets/pattern-1.png') center / cover no-repeat; }
#post-canvas.variant-split .bg-dark-bottom         { display: block; left: 0; right: 0; bottom: 0; height: 50%; background: var(--bg-color, #0a0a0a); }

/* Pattern variant: dark top, pattern bottom */
#post-canvas.variant-pattern .bg-dark-top              { display: block; left: 0; right: 0; top: 0;    height: 50%; background: var(--bg-color, #0a0a0a); }
#post-canvas.variant-pattern .bg-pattern-strip-pattern { display: block; left: 0; right: 0; bottom: 0; height: 50%; background: #0a0a0a url('/assets/pattern-1.png') center / cover no-repeat; }
```
