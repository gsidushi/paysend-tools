/* Builder breadcrumb — self-mounting.
   Reads ?p=<purposeId>&a=<activityId> from the URL and prepends a
   sticky top bar with: [Main → Purpose → Activity →]   [planet logo]
   to every page that loads this script. Falls back gracefully
   when params are missing (e.g. someone deep-links a builder).      */
(function () {
  const PURPOSES = {
    hr:         'HR / People',
    pr:         'PR / News',
    personal:   'Personal Brand',
    thought:    'Thought Leadership',
    product:    'Product / Sales',
    engagement: 'Engagement / Reach',
  };

  const ACTIVITIES = {
    hr: {
      'new-job':       'New Job Announcement',
      'promotion':     'Promotion Announcement',
      'hiring':        "We're Hiring",
      'bts':           'Behind-the-Scenes',
    },
    pr: {
      'company-news':  'Company News',
      'press-release': 'Press Release',
      'partnership':   'Partnership Announcement',
    },
    thought: {
      'insight':       'Insight / POV',
      'educational':   'Educational / How-To',
      'case-study':    'Case Study',
    },
    product: {
      'feature':       'Feature / Product Highlight',
      'before-after':  'Before / After',
      'testimonial':   'Customer Testimonial',
    },
    personal: {
      'story':         'Story / Experience',
      'unpopular':     'Unpopular Opinion',
      'founder-pov':   'Founder POV',
    },
    engagement: {
      'question':      'Question Post',
    },
  };

  function init() {
    // Don't double-mount
    if (document.querySelector('.builder-topbar')) return;

    const params  = new URLSearchParams(location.search);
    const purpose = params.get('p');
    const activity = params.get('a');

    const bar = document.createElement('header');
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
      crumb.appendChild(s);
    }

    addItem('Main', '/');
    if (purpose && PURPOSES[purpose]) {
      addArrow();
      addItem(PURPOSES[purpose], '/?screen=2&p=' + purpose);
      const subList = ACTIVITIES[purpose] || {};
      if (activity && subList[activity]) {
        addArrow();
        addItem(subList[activity], '/?screen=3&p=' + purpose + '&a=' + activity);
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

    // Hide the legacy in-builder .header (logo + "Post Builder" + size)
    // so we don't show two stacked bars. Each builder has its own
    // .header bar — collapse it to nothing now that the topbar is on.
    const legacy = document.querySelector('header.header');
    if (legacy) legacy.style.display = 'none';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
