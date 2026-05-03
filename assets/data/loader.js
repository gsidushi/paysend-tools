/* Paysend shared-data loader.
 *
 * Exposes a Promise on `window.PaysendData` that resolves to the
 * combined contents of /assets/data/*.json. Every builder + the
 * wizard awaits this Promise before rendering its dropdowns,
 * colour palettes, layout cards, breadcrumbs, etc.
 *
 *     await window.PaysendData;
 *     const { partners, colors, team, layouts } = await window.PaysendData;
 *
 * Adding a partner / colour / staff member becomes a one-line edit
 * in the corresponding JSON file — every page that loads this
 * script picks up the change automatically.
 */
(function () {
  if (window.PaysendData) return; // idempotent — load once per page
  const get = (path) => fetch(path).then(r => {
    if (!r.ok) throw new Error('Failed to fetch ' + path + ': ' + r.status);
    return r.json();
  });
  window.PaysendData = Promise.all([
    get('/assets/data/partners.json'),
    get('/assets/data/colors.json'),
    get('/assets/data/team.json'),
    get('/assets/data/layouts.json'),
  ])
  .then(([partners, colors, team, layouts]) => ({ partners, colors, team, layouts }))
  .catch((err) => {
    console.error('[Paysend] data load failed', err);
    return { partners: [], colors: [], team: [], layouts: { purposes: [], activities: {}, assignments: {}, familyRoutes: {} } };
  });
})();
