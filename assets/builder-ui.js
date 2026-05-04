/* ──────────────────────────────────────────────────────────────
   Builder UI v2 — runtime companion to builder-ui.css

   Renders the canvas area exactly like Figma node 455:200:
     ┌─ flex column (justify-between) ──────────────┐
     │  Layout options                              │
     │  •───•••───•••• (active = black, gray = off) │
     │                                              │
     │           [scaled canvas, centred]           │
     │                                              │
     │              [Export button]                 │
     └──────────────────────────────────────────────┘

   • Vertical posts cap at 50 % of the canvas-area width.
   • Landscape posts cap at 75 %.
   • Each "variant dot" is a cluster of N person icons (16×16 frame
     with a 10×10 inner square) where N = 1, 2, 3 for variant 1, 2, 3.
   • Clusters are separated by a 1 px × 11 px black vertical line.
   • Clicking a cluster proxies to the matching .seg-btn already
     wired up by each builder.
   • Export button is moved out of the right-hand controls panel
     and into the canvas area's flex flow at the bottom. ───────── */
(function () {
  function init() {
    const wrapper      = document.querySelector('.preview-wrapper');
    const canvas       = document.getElementById('post-canvas');
    const previewArea  = document.querySelector('.preview-area');
    if (!wrapper || !canvas || !previewArea) return;

    /* Move Export button into the canvas-area flex flow at the bottom. */
    const exportBtn = document.querySelector('.controls .download-btn, .download-btn');
    if (exportBtn && exportBtn.parentElement !== previewArea) {
      previewArea.appendChild(exportBtn);
    }
    if (exportBtn) exportBtn.textContent = 'Export';

    /* ── Right-panel reorganisation to match Figma ── */
    reorganiseRightPanel();

    /* ─── Layout-options indicator ───────────────────────────────
       Two ways to discover the variant set:

       1. The page URL — `?variants=1.1,1.2,1.3` — used for
          family variants (Layouts 6/7/8/9 …) routed by the wizard.
       2. A `.layout-switcher` block inside the controls panel —
          used by Layout 1's internal mode switch
          (1 Person / 2 People / 3 People).

       In either case we render the same dots strip at the top of
       the canvas area and proxy clicks to the underlying buttons.
       The originals are hidden via CSS but stay in the DOM so
       their event handlers keep working. */
    const params   = new URLSearchParams(location.search);
    const variants = (params.get('variants') || '').split(',').map(s => s.trim()).filter(Boolean);

    let dotsRoot = null;
    const layoutBtns = document.querySelectorAll('.layout-switcher .layout-btn');
    if (layoutBtns.length >= 2 && !previewArea.querySelector('.bui-layout-options')) {
      dotsRoot = renderIndicatorFromButtons(previewArea, Array.from(layoutBtns));
    } else if (variants.length >= 2 && !previewArea.querySelector('.bui-layout-options')) {
      dotsRoot = renderIndicator(previewArea, variants);
    }

    /* ─── Canvas size clamp ──────────────────────────────────── */
    function canvasNativeSize() {
      const cs = getComputedStyle(canvas);
      return {
        w: parseFloat(canvas.style.width)  || parseFloat(cs.width)  || 1080,
        h: parseFloat(canvas.style.height) || parseFloat(cs.height) || 1360,
      };
    }

    function rescale() {
      const { w, h } = canvasNativeSize();
      const isLandscape = w > h;
      const widthFraction = isLandscape ? 0.75 : 0.50;
      const r = previewArea.getBoundingClientRect();
      // Subtract the indicator height (~50 px) at top + button (~50 px) at
      // bottom + 80 px (40 px top/bottom padding) so the canvas stays
      // visually centred between them.
      const reservedTop    = (dotsRoot ? dotsRoot.offsetHeight : 0) + 16;
      const reservedBottom = (exportBtn ? exportBtn.offsetHeight : 0) + 16;
      const availW = r.width  * widthFraction;
      const availH = Math.max(0, r.height - 80 - reservedTop - reservedBottom);
      const scale  = Math.max(0.05, Math.min(availW / w, availH / h));
      wrapper.style.width  = Math.round(w * scale) + 'px';
      wrapper.style.height = Math.round(h * scale) + 'px';
      canvas.style.transformOrigin = 'top left';
      canvas.style.transform = `scale(${scale})`;
    }

    /* Defer one frame so each builder's scalePreview runs first,
       then ours overrides whatever size it set. */
    requestAnimationFrame(rescale);
    window.addEventListener('resize', () => requestAnimationFrame(rescale));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(rescale);
    let kicks = 0;
    const tick = setInterval(() => {
      rescale();
      if (++kicks >= 4) clearInterval(tick);
    }, 250);
  }

  /* Icon set — actual Figma renders saved as PNGs in /assets/icons/.
     Sourced from icon component variants on Figma file BMHnkg…
     (nodes 464:404 trash, 463:1008 plus, 461:761 arrow-down,
     456:278 question, 456:273 person, 463:846 edit, 464:347 lines).
     Each icon is 16×16, monochrome black on transparent. */
  const ICON = {
    trash:    '/assets/icons/trash-16.svg',
    plus:     '/assets/icons/plus-16.svg',
    arrow:    '/assets/icons/arrow-down-16.svg',
    question: '/assets/icons/question-16.svg',
    person:   '/assets/icons/person-16.svg',
    edit:     '/assets/icons/edit-16.svg',
    lines:    '/assets/icons/lines-16.svg',
  };

  function makeIconImg(name, alt) {
    const img = document.createElement('img');
    img.src = ICON[name];
    img.alt = alt || '';
    img.width = 16;
    img.height = 16;
    img.draggable = false;
    return img;
  }

  /* Clean up any legacy `alt="thumb"` on the upload-preview <img>
     so the broken-image fallback doesn't render that text inside
     the dashed square when the src is empty. */
  function sanitisePreviewImg(uploadZone) {
    const img = uploadZone.querySelector('.upload-preview img');
    if (img) {
      img.alt = '';
      // If the legacy markup left src="" we don't want the broken-
      // image glyph either — strip the empty attribute.
      if (img.getAttribute('src') === '') img.removeAttribute('src');
    }
  }

  function injectTrashButton(uploadZone) {
    sanitisePreviewImg(uploadZone);
    if (uploadZone.querySelector('.bui-trash-btn')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'bui-trash-btn';
    btn.appendChild(makeIconImg('trash', 'Remove'));
    btn.title = 'Remove';
    btn.setAttribute('aria-label', 'Remove');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const legacy = uploadZone.querySelector('.remove-photo');
      if (legacy) {
        legacy.click();
      } else {
        const preview = uploadZone.querySelector('.upload-preview');
        const placeholder = uploadZone.querySelector('.upload-placeholder');
        if (preview)     preview.style.display = 'none';
        if (placeholder) placeholder.style.display = '';
      }
    });
    uploadZone.appendChild(btn);
  }

  /* When the partner-preset <select> changes, paint the chosen
     logo INSIDE the dashed square (replacing the arrow). The
     placeholder ↔ preview swap is now CSS-driven from
     `.upload-zone:has(.upload-preview img[src]:not([src=""]))`,
     so we just have to keep the <img>'s `src` accurate.

     `custom` with an existing uploaded file → legacy upload code
     already set the src; leave it.
     `custom` with NO file → clear src so the placeholder reappears.
     `<preset id>` → set src to the preset's path.

     The legacy handler still runs and sets the canvas-side image
     in parallel.                                                */
  function wirePresetIntoZone(uploadZone, select) {
    if (!select || select.dataset.buiPresetWired) return;
    select.dataset.buiPresetWired = '1';

    let preview    = uploadZone.querySelector('.upload-preview');
    let previewImg = preview && preview.querySelector('img');

    /* Some builders create the preview lazily — make sure one
       exists so we always have somewhere to render the chosen logo. */
    if (!preview) {
      preview = document.createElement('div');
      preview.className = 'upload-preview';
      previewImg = document.createElement('img');
      previewImg.alt = '';
      preview.appendChild(previewImg);
      uploadZone.appendChild(preview);
    }
    if (previewImg) previewImg.alt = '';

    /* Track whatever src the legacy upload code last set — when the
       user toggles "custom" we restore that, not blank. */
    let lastUploadedSrc = previewImg && previewImg.getAttribute('src') || '';
    if (previewImg) {
      new MutationObserver(() => {
        if (select.value === 'custom') {
          const s = previewImg.getAttribute('src') || '';
          if (s) lastUploadedSrc = s;
        }
      }).observe(previewImg, { attributes: true, attributeFilter: ['src'] });
    }

    const presetsReady = (window.PaysendData || Promise.resolve({ partners: [] }))
      .then(d => Object.fromEntries((d.partners || []).map(p => [p.id, p.src])));

    async function applyCurrent() {
      if (!previewImg) return;
      const presets = await presetsReady;
      const v = select.value;
      if (v === 'custom') {
        /* Restore the user's last upload (if any) — empty src
           means "no logo" → CSS will show the arrow placeholder. */
        if (lastUploadedSrc) previewImg.src = lastUploadedSrc;
        else                 previewImg.removeAttribute('src');
        return;
      }
      const src = presets[v];
      if (src) previewImg.src = src;
    }

    select.addEventListener('change', applyCurrent);
    applyCurrent();
  }

  function makePlusButton(onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'bui-plus-btn';
    btn.appendChild(makeIconImg('plus', 'Add'));
    btn.title = 'Add another';
    btn.setAttribute('aria-label', 'Add another');
    btn.addEventListener('click', (e) => { e.stopPropagation(); onClick(); });
    return btn;
  }

  /* Reorganise an existing builder's controls panel so it visually
     matches the Figma right-panel structure (node 456:479):

       Heading                       (no toggle, default input)
       Subheading toggle ───────────  bordered card
       Location toggle | Date toggle  side-by-side bordered cards
       Partner logo    | Color        side-by-side
       Person card                    photo + sliders + names

     This is a CSS/DOM reshuffle — no IDs change, so all per-builder
     event handlers continue to work. */
  function reorganiseRightPanel() {
    const controls = document.querySelector('.controls');
    if (!controls || controls.dataset.buiReshuffled) return;
    controls.dataset.buiReshuffled = '1';

    /* "Photo Background" → "Color" (Figma label) */
    document.querySelectorAll('.controls .control-label').forEach(l => {
      if (l.textContent.trim() === 'Photo Background') l.textContent = 'Color';
    });

    /* Heading: mandatory input (no toggle, no frame). The toggle
       row gets hidden, the section is marked `.bui-no-frame` so
       it loses the bordered card style, and a clean "Heading"
       label is injected above the textarea. */
    const headlineSection = document.getElementById('input-headline')?.closest('.control-section');
    if (headlineSection) {
      headlineSection.classList.add('bui-no-frame');
      const row = headlineSection.querySelector('.section-row');
      if (row) row.style.display = 'none';
      if (!headlineSection.querySelector('.bui-heading-label')) {
        const label = document.createElement('label');
        label.className = 'control-label bui-heading-label';
        label.textContent = 'Heading';
        headlineSection.insertBefore(label, headlineSection.firstChild);
      }
    }

    /* ── Auto-resize every textarea so its height tracks the text.
       The user expects "no extra empty space below the text". */
    document.querySelectorAll('.controls textarea').forEach(t => {
      const grow = () => {
        t.style.height = 'auto';
        t.style.height = t.scrollHeight + 'px';
      };
      t.addEventListener('input', grow);
      /* Wait one frame so the layout has settled (textarea has its
         final width) before measuring scrollHeight. */
      requestAnimationFrame(grow);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(grow);
    });

    /* Date & Location: split into two separate bordered cards each
       with its own toggle (Figma has them as independent controls,
       not stacked inside one combined card). */
    splitBadgesSection();

    /* ─── Partner-logo row ───
       Each builder ships 1+ partner sections (each with its own
       toggle, upload zone, partner-preset <select> and a hidden
       file input). Figma collapses these into a single row of
       100×100 cards plus a "+" button to add the next one.

       We extract the visible upload + select pair from each
       section into a `.bui-partner-card`, drop them all into a
       `.bui-partner-row`, mount the row in the FIRST section's
       `.section-body`, and hide every other section so its empty
       plumbing doesn't take vertical space. */
    const partnerSections = Array.from(document.querySelectorAll('.controls .control-section'))
      .filter(s => s.querySelector('.upload-zone') && (
        s.querySelector('select.partner-preset') ||
        s.querySelector('select[id*="partner"]')));

    if (partnerSections.length > 0) {
      const row = document.createElement('div');
      row.className = 'bui-partner-row';

      /* Mark every partner section so the CSS rule
         `.bui-partner-section > .section-row { display: none }`
         can hide every per-section toggle reliably (the SELECT
         we usually use to identify them gets MOVED out into the
         row, so the `:has(select.partner-preset)` selector stops
         matching after the reorganisation). */
      partnerSections.forEach(s => s.classList.add('bui-partner-section'));
      /* The first partner section visually contains the row of
         cards; user wants no bordered frame around it. */
      partnerSections[0].classList.add('bui-no-frame');

      /* refreshPlus is forward-referenced from the per-card trash
         click handler below — declare it up here. */
      let plusBtn = null;
      function refreshPlus() {
        const visibleCount = cards.filter(c => !c.card.classList.contains('bui-hidden')).length;
        if (plusBtn) {
          plusBtn.style.display = visibleCount < cards.length ? '' : 'none';
        }
        row.classList.toggle('expanded', visibleCount === cards.length);
      }

      const cards = partnerSections.map((section, idx) => {
        const body   = section.querySelector('.section-body');
        const upload = body && body.querySelector('.upload-zone');
        const select = body && body.querySelector('select.partner-preset, select[id*="partner"]');
        const toggle = section.querySelector('input[type="checkbox"]');

        const card = document.createElement('div');
        card.className = 'bui-partner-card';
        if (idx > 0) card.classList.add('bui-hidden');

        const meta = { card, section, toggle, select, upload };

        if (upload) {
          injectTrashButton(upload);
          if (select) wirePresetIntoZone(upload, select);
          card.appendChild(upload);

          /* Override the trash so it deletes the WHOLE partner card
             instead of just clearing the upload. Empty card removal:
             - hide the card
             - uncheck the section's toggle so the partner stops
               rendering on the canvas
             - reset the select back to "custom" so the next time the
               card is added back it starts blank
             - bring the plus button back if it had been hidden */
          const trash = upload.querySelector('.bui-trash-btn');
          if (trash) {
            const fresh = trash.cloneNode(true); // strip default listener
            trash.replaceWith(fresh);
            fresh.addEventListener('click', (e) => {
              e.stopPropagation();
              meta.card.classList.add('bui-hidden');
              if (meta.toggle && meta.toggle.checked) {
                meta.toggle.checked = false;
                meta.toggle.dispatchEvent(new Event('change', { bubbles: true }));
              }
              if (meta.select) {
                meta.select.value = 'custom';
                meta.select.dispatchEvent(new Event('change', { bubbles: true }));
              }
              /* Also clear any uploaded file via the legacy remove. */
              const legacyRemove = upload.querySelector('.remove-photo');
              if (legacyRemove) legacyRemove.click();
              refreshPlus();
            });
          }
        }
        if (select) card.appendChild(select);

        return meta;
      });

      cards.forEach(c => row.appendChild(c.card));

      /* Plus button — visible when at least one card is hidden.
         Reveals the first hidden card AND turns its underlying
         toggle on so the partner appears on the canvas. */
      if (cards.length > 1) {
        plusBtn = makePlusButton(() => {
          const next = cards.find(c => c.card.classList.contains('bui-hidden'));
          if (!next) return;
          next.card.classList.remove('bui-hidden');
          if (next.toggle && !next.toggle.checked) {
            next.toggle.checked = true;
            next.toggle.dispatchEvent(new Event('change', { bubbles: true }));
          }
          refreshPlus();
        });
        row.appendChild(plusBtn);
      }
      refreshPlus();

      /* Mount the row directly in the first partner section —
         NOT inside its `.section-body`. The legacy CSS rule
         `.control-section.section-off .section-body { display: none }`
         would otherwise hide the row (and the plus button inside
         it) the moment the user trashes a card and we uncheck the
         underlying toggle. As a sibling of section-body, the row
         is unaffected by the section-off styling. */
      const firstSection = partnerSections[0];
      firstSection.appendChild(row);
      /* The original section-body in section[0] now holds nothing
         — its visible bits were lifted into the row. Hide it so
         it doesn't reserve any vertical space. */
      const firstBody = firstSection.querySelector('.section-body');
      if (firstBody) firstBody.style.display = 'none';
      /* Hide every other partner section's leftover plumbing. */
      partnerSections.slice(1).forEach(s => { s.style.display = 'none'; });

      /* "Partner Logo 1" → "Partner logo" (Figma label).
         The whole `.section-row` (toggle + label) is hidden — the
         label gets re-promoted out of it so it stays visible. */
      const firstLabel = partnerSections[0].querySelector('.control-label');
      if (firstLabel && /Partner Logo\s*1/i.test(firstLabel.textContent)) {
        firstLabel.textContent = 'Partner logo';
      }
      const firstSectionRow = partnerSections[0].querySelector('.section-row');
      if (firstSectionRow) {
        if (firstLabel && firstSectionRow.contains(firstLabel)) {
          partnerSections[0].insertBefore(firstLabel, firstSectionRow);
        }
        firstSectionRow.style.display = 'none';
      }
    }

    /* Group Partner Logo 1 + Color side-by-side. */
    const partner1 = document.getElementById('partner1-toggle')?.closest('.control-section');
    const colorSection = document.getElementById('color-palette')?.closest('.control-section')
                       || document.getElementById('bg-palette')?.closest('.control-section')
                       || document.getElementById('accent-palette')?.closest('.control-section');
    if (partner1 && colorSection && partner1.parentElement === colorSection.parentElement) {
      const row = document.createElement('div');
      row.className = 'bui-row-2';
      partner1.parentElement.insertBefore(row, partner1);
      // Color first to match Figma order? Figma has Partner left, Color right.
      row.appendChild(partner1);
      row.appendChild(colorSection);
    }

    /* Restructure each Person section as Figma's compact card. */
    document.querySelectorAll('.person-section').forEach(section => {
      buildPersonCard(section);
    });
  }

  /* Take a builder's existing `.person-section` and lay it out in
     the Figma 2-column grid:

       [Person label, full-width                     ]
       [LEFT column                | RIGHT column    ]
       [ photo  | sliders + presets| name + role     ]
       [ +rmBg  |                  |                 ]

     The LEFT column is itself a nested 2-col grid (100 px photo
     + flexible sliders) so the inner Figma layout matches. Each
     direct `.control-section` is moved wholesale into its column
     — every hidden file input / zoom button / event handler
     survives untouched. */
  function buildPersonCard(section) {
    if (section.dataset.buiCard) return;
    section.dataset.buiCard = '1';
    section.classList.add('bui-person-card');

    const builderLabel = section.querySelector('.person-section-label');

    const left      = document.createElement('div'); left.className     = 'bui-person-left';
    const photoCol  = document.createElement('div'); photoCol.className = 'bui-person-photo';
    const midCol    = document.createElement('div'); midCol.className   = 'bui-person-mid';
    const right     = document.createElement('div'); right.className    = 'bui-person-right';

    /* Sub-section routing:
       - any .upload-zone → photo column
       - any input[type=range] OR zoom-control → mid column
       - everything else (Title / Name fields) → right column   */
    const subSections = Array.from(section.querySelectorAll(':scope > .control-section'));
    subSections.forEach(s => {
      if (s.querySelector('.upload-zone'))                                photoCol.appendChild(s);
      else if (s.querySelector('input[type="range"], .zoom-control'))     midCol.appendChild(s);
      else                                                                 right.appendChild(s);
    });

    left.appendChild(photoCol);
    left.appendChild(midCol);

    while (section.firstChild) section.removeChild(section.firstChild);
    if (builderLabel) {
      builderLabel.classList.add('bui-person-label');
      builderLabel.textContent = 'Person';
      section.appendChild(builderLabel);
    } else {
      const lab = document.createElement('span');
      lab.className = 'bui-person-label';
      lab.textContent = 'Person';
      section.appendChild(lab);
    }
    section.appendChild(left);
    section.appendChild(right);
  }

  /* Split the combined "Date & Location" section into TWO bordered
     cards laid out side-by-side, each with its own toggle. Each
     toggle drives one canvas badge independently — both legacy
     toggles are mirrored under the hood so everything else that
     listened for `#badges-toggle` keeps firing. */
  function splitBadgesSection() {
    const dateInput     = document.getElementById('input-date');
    const locationInput = document.getElementById('input-location');
    const badgesToggle  = document.getElementById('badges-toggle');
    const badgesSection = badgesToggle?.closest('.control-section');
    if (!dateInput || !locationInput || !badgesSection) return;
    if (badgesSection.dataset.buiSplit) return;
    badgesSection.dataset.buiSplit = '1';

    /* Force the original combined toggle ON — the canvas-side
       container needs to stay visible; we'll show/hide each badge
       via `.bui-hidden` independently. */
    if (!badgesToggle.checked) {
      badgesToggle.checked = true;
      badgesToggle.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function buildSplitCard(label, input, badgeSelector) {
      const sec = document.createElement('div');
      sec.className = 'control-section';

      const row = document.createElement('div');
      row.className = 'section-row';

      const toggleEl = document.createElement('label');
      toggleEl.className = 'toggle-switch';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = true;
      const slider = document.createElement('span');
      slider.className = 'toggle-slider';
      toggleEl.appendChild(cb);
      toggleEl.appendChild(slider);

      const lab = document.createElement('label');
      lab.className = 'control-label';
      lab.textContent = label;

      row.appendChild(toggleEl);
      row.appendChild(lab);
      sec.appendChild(row);
      sec.appendChild(input);

      cb.addEventListener('change', () => {
        const badge = document.querySelector(badgeSelector);
        if (badge) badge.classList.toggle('bui-hidden', !cb.checked);
      });

      return sec;
    }

    const locCard = buildSplitCard('Location', locationInput, '.post-badges .badge-location');
    const dateCard = buildSplitCard('Date',     dateInput,    '.post-badges .badge-date');

    const row = document.createElement('div');
    row.className = 'bui-row-2';
    row.appendChild(locCard);
    row.appendChild(dateCard);

    badgesSection.parentNode.insertBefore(row, badgesSection);
    badgesSection.style.display = 'none';
  }

  /* Build the strip from a list of `.layout-btn` buttons (Layout 1).
     Each button index → a cluster of (index + 1) person icons.
     Click a cluster → click the underlying button (whose handler
     already wires the canvas to the matching mode). */
  function renderIndicatorFromButtons(previewArea, buttons) {
    const root = document.createElement('div');
    root.className = 'bui-layout-options';
    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = 'Layout options';
    root.appendChild(label);

    const row = document.createElement('div');
    row.className = 'row';
    root.appendChild(row);

    const clusters = [];

    buttons.forEach((btn, i) => {
      if (i > 0) {
        const sep = document.createElement('span');
        sep.className = 'bui-sep';
        sep.setAttribute('aria-hidden', 'true');
        row.appendChild(sep);
      }
      const cluster = document.createElement('button');
      cluster.type = 'button';
      cluster.className = 'cluster' + (btn.classList.contains('active') ? ' active' : '');
      cluster.title = btn.textContent.trim();
      cluster.setAttribute('aria-label', btn.textContent.trim());

      const n = i + 1; // 1, 2, 3 person icons
      if (n > 1) cluster.classList.add('has-many');
      for (let k = 0; k < n; k++) {
        const person = document.createElement('span');
        person.className = 'person';
        cluster.appendChild(person);
      }

      cluster.addEventListener('click', () => {
        clusters.forEach(c => c.classList.remove('active'));
        cluster.classList.add('active');
        btn.click();
      });

      row.appendChild(cluster);
      clusters.push(cluster);
    });

    /* Mirror back: if the underlying buttons get clicked from
       elsewhere (or programmatically), update active state. */
    buttons.forEach((btn, i) => {
      const obs = new MutationObserver(() => {
        if (btn.classList.contains('active')) {
          clusters.forEach(c => c.classList.remove('active'));
          clusters[i].classList.add('active');
        }
      });
      obs.observe(btn, { attributes: true, attributeFilter: ['class'] });
    });

    previewArea.insertBefore(root, previewArea.firstChild);
    return root;
  }

  /* Builds the "Layout options" strip. Returns the root element so
     caller can measure its height for canvas sizing. */
  function renderIndicator(previewArea, variants) {
    const root = document.createElement('div');
    root.className = 'bui-layout-options';

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = 'Layout options';
    root.appendChild(label);

    const row = document.createElement('div');
    row.className = 'row';
    root.appendChild(row);

    function suffix(v) {
      // "1.1" → "1", "7.2" → "2", "7" → "7"
      return v.includes('.') ? v.split('.')[1] : v;
    }
    function matchSegBtn(variantToken) {
      return document.querySelector(`.seg-btn[data-variant="${suffix(variantToken)}"]`);
    }

    /* Detect the currently active variant from the canvas's class list
       (each builder marks the canvas with .variant-1 / .variant-2 etc).
       Fallback: first variant in URL. */
    const canvas = document.getElementById('post-canvas');
    function activeSuffix() {
      if (canvas) {
        for (let i = 1; i <= 9; i++) {
          if (canvas.classList.contains('variant-' + i)) return String(i);
        }
        // Some builders use "variant-dark" / "variant-split" / "variant-pattern"
        // — there's no numeric mapping for those, so default to first.
      }
      return suffix(variants[0]);
    }

    const initialActive = activeSuffix();
    const clusters = [];

    variants.forEach((v, i) => {
      // Separator BEFORE every cluster except the first.
      if (i > 0) {
        const sep = document.createElement('span');
        sep.className = 'bui-sep';
        sep.setAttribute('aria-hidden', 'true');
        row.appendChild(sep);
      }

      const cluster = document.createElement('button');
      cluster.type = 'button';
      cluster.className = 'cluster' + (suffix(v) === initialActive ? ' active' : '');
      cluster.dataset.variant = v;
      cluster.title = 'Layout ' + v;
      cluster.setAttribute('aria-label', 'Layout ' + v);

      // N icons where N = position in the variants list (1, 2, 3 ...)
      const n = i + 1;
      for (let k = 0; k < n; k++) {
        const person = document.createElement('span');
        person.className = 'person';
        cluster.appendChild(person);
      }

      cluster.addEventListener('click', () => {
        clusters.forEach(c => c.classList.remove('active'));
        cluster.classList.add('active');
        const segBtn = matchSegBtn(v);
        if (segBtn) segBtn.click();
      });

      row.appendChild(cluster);
      clusters.push(cluster);
    });

    /* Mirror builder-driven variant changes back onto the clusters. */
    const segControl = document.querySelector('.seg-control');
    if (segControl) {
      segControl.addEventListener('click', (e) => {
        const btn = e.target.closest('.seg-btn');
        if (!btn) return;
        const s = btn.dataset.variant;
        clusters.forEach(c => c.classList.toggle('active', suffix(c.dataset.variant) === s));
      });
    }

    previewArea.insertBefore(root, previewArea.firstChild);
    return root;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
