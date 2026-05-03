/* Builder breadcrumb — self-mounting.
 *
 * Reads ?p=<purposeId>&a=<activityId> from the URL and prepends a
 * sticky top bar with [Main → Purpose → Activity →] [planet logo]
 * to every page that loads this script. Labels come from
 * /assets/data/layouts.json via the shared PaysendData loader so
 * a single edit there updates the breadcrumb everywhere.            */
(function () {
  function loadPaysendData() {
    if (window.PaysendData) return window.PaysendData;
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = '/assets/data/loader.js';
      s.onload = () => resolve(window.PaysendData);
      s.onerror = reject;
      document.head.appendChild(s);
    }).then(p => p);
  }

  async function init() {
    if (document.querySelector('.builder-topbar')) return; // idempotent

    const { layouts } = await loadPaysendData();
    const purposesById = Object.fromEntries(
      (layouts.purposes || []).map(p => [p.id, p.label])
    );
    const activitiesById = Object.fromEntries(
      Object.entries(layouts.activities || {}).map(([pid, list]) => [
        pid,
        Object.fromEntries(list.map(a => [a.id, a.label]))
      ])
    );

    const params  = new URLSearchParams(location.search);
    const purpose = params.get('p');
    const activity = params.get('a');

    const bar   = document.createElement('header');
    bar.className = 'builder-topbar';
    const crumb = document.createElement('nav');
    crumb.className = 'builder-crumb';

    function addItem(label, href) {
      const a = document.createElement('a');
      a.className   = 'crumb-item';
      a.textContent = label;
      a.href        = href;
      crumb.appendChild(a);
    }
    function addArrow() {
      const s = document.createElement('span');
      s.className   = 'crumb-arrow';
      s.textContent = '→';
      s.setAttribute('aria-hidden', 'true');
      crumb.appendChild(s);
    }

    addItem('Main', '/');
    if (purpose && purposesById[purpose]) {
      addArrow();
      addItem(purposesById[purpose], '/?screen=2&p=' + purpose);
      const sub = activitiesById[purpose] || {};
      if (activity && sub[activity]) {
        addArrow();
        addItem(sub[activity], '/?screen=3&p=' + purpose + '&a=' + activity);
      }
    }
    addArrow();

    bar.appendChild(crumb);

    const logo = document.createElement('img');
    logo.className = 'builder-topbar-logo';
    logo.src = '/assets/logo-planet.svg';
    logo.alt = 'Paysend';
    bar.appendChild(logo);

    document.body.insertBefore(bar, document.body.firstChild);

    // Hide the legacy in-builder .header so we don't show two stacked bars.
    const legacy = document.querySelector('header.header');
    if (legacy) legacy.style.display = 'none';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
