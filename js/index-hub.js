/**
 * Shared index hub renderer for integration test fixture navigation.
 */
(function () {
  const ENV_COLORS = {
    vwo: { bg: '#e8f4fd', border: '#1a73e8', badge: '#1a73e8' },
    smartcode3vwo: { bg: '#e0f7f4', border: '#00897b', badge: '#00897b' },
    abtasty: { bg: '#fff3e0', border: '#ef6c00', badge: '#ef6c00' },
    codewingify: { bg: '#f3e8ff', border: '#7b1fa2', badge: '#7b1fa2' },
    smartcode3wingify: { bg: '#fce4ec', border: '#c2185b', badge: '#c2185b' },
  };

  const ENV_INDEX_URLS = {
    smartcode3vwo: 'smartcode3vwo/index.html',
    codewingify: 'codewingify/index.html',
    smartcode3wingify: 'smartcode3wingify/index.html',
  };

  const ACRONYMS = {
    gtm: 'GTM',
    ga4: 'GA4',
    adc: 'ADC',
    aep: 'AEP',
    cdp: 'CDP',
    vwo: 'VWO',
    sfmc: 'SFMC',
    ux: 'UX',
  };

  let hubState = { accountId: '', path: 'tag' };

  function injectStyles() {
    if (document.getElementById('index-hub-styles')) return;
    const style = document.createElement('style');
    style.id = 'index-hub-styles';
    style.textContent = `
      :root {
        --hub-bg: #f0f2f5;
        --hub-surface: #ffffff;
        --hub-text: #1a1a2e;
        --hub-muted: #5c6370;
        --hub-accent: #1a73e8;
        --hub-radius: 12px;
        --hub-shadow: 0 2px 12px rgba(0,0,0,0.08);
      }
      body.index-hub {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        background: var(--hub-bg);
        color: var(--hub-text);
        margin: 0;
        line-height: 1.5;
      }
      .hub-header {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        color: #fff;
        padding: 2.5rem 1.5rem 2rem;
        text-align: center;
      }
      .hub-header h1 {
        margin: 0 0 0.5rem;
        font-size: clamp(1.5rem, 4vw, 2.25rem);
        font-weight: 700;
        letter-spacing: -0.02em;
      }
      .hub-header p {
        margin: 0;
        opacity: 0.85;
        font-size: 1rem;
        max-width: 640px;
        margin-inline: auto;
      }
      .hub-stats {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin-top: 1.5rem;
      }
      .hub-stat {
        background: rgba(255,255,255,0.12);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 8px;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }
      .hub-stat strong { display: block; font-size: 1.25rem; }
      .hub-env-cards {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1.25rem 1rem 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 0.75rem;
      }
      .hub-env-card {
        display: block;
        padding: 1rem 1.125rem;
        border-radius: var(--hub-radius);
        border: 1px solid;
        text-decoration: none;
        color: inherit;
        transition: transform 0.15s, box-shadow 0.15s;
        box-shadow: var(--hub-shadow);
        background: var(--hub-surface);
      }
      .hub-env-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      }
      .hub-env-card__label {
        font-weight: 700;
        font-size: 1rem;
        margin-bottom: 0.25rem;
      }
      .hub-env-card__meta {
        font-size: 0.8125rem;
        color: var(--hub-muted);
        margin-bottom: 0.35rem;
      }
      .hub-env-card__count {
        display: inline-block;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.2rem 0.5rem;
        border-radius: 999px;
        background: rgba(0,0,0,0.06);
      }
      .hub-toolbar {
        position: sticky;
        top: 0;
        z-index: 100;
        background: var(--hub-surface);
        border-bottom: 1px solid #e0e4ea;
        padding: 0.75rem 1rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      }
      .hub-toolbar-inner {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
      }
      .hub-search-wrap { flex: 1; min-width: 200px; }
      .hub-search-wrap label {
        position: absolute;
        width: 1px; height: 1px;
        overflow: hidden;
        clip: rect(0,0,0,0);
      }
      #hubSearchInput {
        width: 100%;
        padding: 0.625rem 1rem 0.625rem 2.5rem;
        border: 1px solid #d0d5dd;
        border-radius: 8px;
        font-size: 0.9375rem;
        background: #f9fafb url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%235c6370' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.156a5 5 0 1 1 0-10 5 5 0 0 1 0 10z'/%3E%3C/svg%3E") no-repeat 0.75rem center;
      }
      #hubSearchInput:focus {
        outline: 2px solid var(--hub-accent);
        outline-offset: 0;
        border-color: var(--hub-accent);
      }
      .hub-account-wrap {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 180px;
      }
      .hub-account-wrap label {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--hub-muted);
        white-space: nowrap;
      }
      #hubAccountIdInput {
        width: 120px;
        padding: 0.5rem 0.625rem;
        border: 1px solid #d0d5dd;
        border-radius: 8px;
        font-size: 0.875rem;
      }
      .hub-btn {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 0.875rem;
        border: 1px solid #d0d5dd;
        border-radius: 8px;
        background: #fff;
        color: var(--hub-text);
        font-weight: 600;
        font-size: 0.8125rem;
        cursor: pointer;
        white-space: nowrap;
      }
      .hub-btn:hover { background: #f3f4f6; }
      .hub-master-link {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.5rem 1rem;
        background: var(--hub-accent);
        color: #fff !important;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        font-size: 0.875rem;
        white-space: nowrap;
      }
      .hub-master-link:hover { background: #1557b0; }
      .hub-jump-nav {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
      }
      .hub-jump-link {
        display: inline-block;
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        font-size: 0.8125rem;
        font-weight: 600;
        text-decoration: none;
        border: 1px solid;
        transition: transform 0.15s;
      }
      .hub-jump-link:hover { transform: translateY(-1px); }
      .hub-main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem 3rem;
      }
      .hub-env-section {
        margin-bottom: 2.5rem;
        scroll-margin-top: 5rem;
      }
      .hub-env-header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
        padding: 1rem 1.25rem;
        border-radius: var(--hub-radius);
        border-left: 4px solid;
      }
      .hub-env-header h2 {
        margin: 0;
        font-size: 1.25rem;
        flex: 1;
      }
      .hub-env-index-link {
        font-size: 0.8125rem;
        font-weight: 600;
        text-decoration: none;
        padding: 0.25rem 0.625rem;
        border-radius: 999px;
        border: 1px solid currentColor;
      }
      .hub-env-count {
        font-size: 0.8125rem;
        font-weight: 600;
        padding: 0.25rem 0.625rem;
        border-radius: 999px;
        background: rgba(0,0,0,0.06);
      }
      .hub-env-smartcode {
        font-size: 0.8125rem;
        font-weight: 600;
        padding: 0.25rem 0.625rem;
        border-radius: 999px;
        background: rgba(0,0,0,0.08);
        white-space: nowrap;
      }
      .hub-smartcode-pill {
        display: inline-block;
        margin-top: 0.75rem;
        padding: 0.35rem 0.875rem;
        border-radius: 999px;
        font-size: 0.875rem;
        font-weight: 600;
        background: rgba(255,255,255,0.18);
        border: 1px solid rgba(255,255,255,0.35);
      }
      .hub-category {
        margin-bottom: 1.25rem;
      }
      .hub-category summary {
        cursor: pointer;
        font-weight: 600;
        font-size: 0.9375rem;
        color: var(--hub-muted);
        padding: 0.5rem 0;
        list-style: none;
      }
      .hub-category summary::-webkit-details-marker { display: none; }
      .hub-category summary::before {
        content: '▸ ';
        display: inline-block;
        transition: transform 0.2s;
      }
      .hub-category[open] summary::before { transform: rotate(90deg); }
      .hub-card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 0.75rem;
        padding-top: 0.5rem;
      }
      .hub-card {
        background: var(--hub-surface);
        border: 1px solid #e8eaed;
        border-radius: 10px;
        padding: 1rem 1.125rem;
        box-shadow: var(--hub-shadow);
        transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
      }
      .hub-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        border-color: #c5cae0;
      }
      .hub-card a {
        color: var(--hub-text);
        text-decoration: none;
        font-weight: 700;
        font-size: 1rem;
        line-height: 1.35;
        display: block;
        word-break: break-word;
      }
      .hub-card a:hover { color: var(--hub-accent); }
      .hub-card__slug {
        margin-top: 0.35rem;
        font-size: 0.75rem;
        color: var(--hub-muted);
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        word-break: break-all;
      }
      .hub-no-results {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--hub-muted);
        display: none;
      }
      .hub-no-results.visible { display: block; }
      @media (max-width: 600px) {
        .hub-card-grid { grid-template-columns: 1fr; }
        .hub-env-cards { grid-template-columns: 1fr; }
        .hub-jump-nav { justify-content: flex-start; }
      }
    `;
    document.head.appendChild(style);
  }

  const SLUG_OVERRIDES = {
    datalayersetup: 'Data Layer Setup',
    datalayertesting: 'Data Layer Testing',
    ga4viagtm: 'GA4 Via GTM',
    eventbasedgtm: 'Event Based GTM',
    gtmwithoutsmartcode: 'GTM Without SmartCode',
    gtmwithcookie: 'GTM With Cookie',
    gtagecom: 'GTM Ecommerce',
    gtagsetup: 'GTag Setup',
    hubspottest: 'HubSpot Test',
    klaviyoautomation: 'Klaviyo Automation',
    mixpanelintegrations: 'Mixpanel Integrations',
    mparticlewithoutvwo: 'mParticle Without VWO',
    rudderstackwithoutvwo: 'RudderStack Without VWO',
    segmentpushwithoutvwo: 'Segment Push Without VWO',
    segmentvwotesting: 'Segment VWO Testing',
    tealiumwithoutvwo: 'Tealium Without VWO',
    vwosupporthubspot: 'VWO Support HubSpot',
    fullstorycargo: 'FullStory Cargo',
    fullstorysandbox: 'FullStory Sandbox',
    matomocloudfree: 'Matomo Cloud Free',
    pendoanalytics: 'Pendo Analytics',
    carrotlayersetup: 'Carrot Layer Setup',
  };

  function humanizeSlug(slug) {
    if (SLUG_OVERRIDES[slug]) return SLUG_OVERRIDES[slug];

    const normalized = slug
      .replace(/datalayer/gi, 'data-layer')
      .replace(/withoutvwo/gi, 'without-vwo')
      .replace(/viagtm/gi, 'via-gtm')
      .replace(/gtm/gi, '-gtm-')
      .replace(/ga4/gi, '-ga4-')
      .replace(/[-_]+/g, ' ')
      .replace(/([a-z])(\d)/g, '$1 $2')
      .replace(/(\d)([a-z])/g, '$1 $2')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim();

    return normalized
      .split(' ')
      .filter(Boolean)
      .map((word) => {
        const lower = word.toLowerCase();
        if (ACRONYMS[lower]) return ACRONYMS[lower];
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join(' ');
  }

  function getPageSlug(page) {
    const parts = page.name.split(' / ');
    return parts.length > 1 ? parts[parts.length - 1] : page.name;
  }

  function getPageDisplayName(page) {
    return humanizeSlug(getPageSlug(page));
  }

  function appendQueryParams(url, params) {
    const entries = Object.entries(params).filter(([, value]) => value);
    if (!entries.length) return url;
    const query = new URLSearchParams(entries).toString();
    return url + (url.includes('?') ? '&' : '?') + query;
  }

  function resolveUrl(page, options) {
    let url = page.url;
    if (options.scope && page.environment === options.scope) {
      const prefix = options.scope + '/';
      url = url.startsWith(prefix) ? url.slice(prefix.length) : url;
    }
    if (options.useAccountParams && hubState.accountId) {
      url = appendQueryParams(url, {
        id: hubState.accountId,
        path: hubState.path !== 'tag' ? hubState.path : '',
      });
    }
    return url;
  }

  function getFilteredPages(manifest, options) {
    let pages = manifest.pages.slice();
    if (options.scope) {
      pages = pages.filter((p) => p.environment === options.scope);
    }
    return pages;
  }

  function groupPages(pages) {
    const envMap = new Map();
    pages.forEach((page) => {
      if (!envMap.has(page.environment)) {
        envMap.set(page.environment, new Map());
      }
      const catMap = envMap.get(page.environment);
      if (!catMap.has(page.category)) {
        catMap.set(page.category, []);
      }
      catMap.get(page.category).push(page);
    });
    return envMap;
  }

  function renderCard(page, options) {
    const url = resolveUrl(page, options);
    const slug = getPageSlug(page);
    const displayName = getPageDisplayName(page);
    return `
      <article class="hub-card" data-search="${displayName.toLowerCase()} ${slug.toLowerCase()} ${page.name.toLowerCase()} ${page.category}">
        <a href="${url}" data-base-href="${url.split('?')[0]}">${displayName}</a>
        <div class="hub-card__slug">${slug}.html</div>
      </article>`;
  }

  function renderEnvCards(environments, envMap) {
    return environments
      .filter((env) => envMap.has(env.id))
      .map((env) => {
        const colors = ENV_COLORS[env.id] || ENV_COLORS.vwo;
        const catMap = envMap.get(env.id);
        const count = Array.from(catMap.values()).reduce((sum, arr) => sum + arr.length, 0);
        const href = ENV_INDEX_URLS[env.id] || `#env-${env.id}`;
        const smartCode = env.smartCode ? `<div class="hub-env-card__meta">${env.smartCode}</div>` : '';
        return `
          <a class="hub-env-card" href="${href}" style="border-color:${colors.border}">
            <div class="hub-env-card__label" style="color:${colors.badge}">${env.label}</div>
            ${smartCode}
            <span class="hub-env-card__count">${count} fixtures</span>
          </a>`;
      })
      .join('');
  }

  function renderJumpLinks(items, prefix) {
    return items
      .map((item) => {
        const colors = item.colors || ENV_COLORS.vwo;
        return `<a class="hub-jump-link" href="#${prefix}-${item.id}" style="color:${colors.badge};border-color:${colors.badge};background:${colors.bg}">${item.label}</a>`;
      })
      .join('');
  }

  function initAccountParams(options) {
    const params = new URLSearchParams(window.location.search);
    const storageKey = `hub-account-id-${options.scope || 'global'}`;
    hubState.accountId = params.get('id') || sessionStorage.getItem(storageKey) || '';
    hubState.path = params.get('path') || 'tag';
    if (hubState.accountId) {
      sessionStorage.setItem(storageKey, hubState.accountId);
    }
  }

  function render(manifest, options) {
    injectStyles();
    document.body.classList.add('index-hub');
    options = options || {};

    if (options.useAccountParams) {
      initAccountParams(options);
    }

    const pages = getFilteredPages(manifest, options);
    const envMap = groupPages(pages);
    const environments = options.scope
      ? manifest.environments.filter((e) => e.id === options.scope)
      : manifest.environments;

    const totalPages = pages.length;
    const envCount = new Set(pages.map((p) => p.environment)).size;
    const catCount = new Set(pages.map((p) => p.category)).size;

    const headerSubtitle = options.subtitle ||
      'Browse integration test fixtures across all SmartCode environments.';

    const envCards = !options.scope
      ? `<div class="hub-env-cards">${renderEnvCards(manifest.environments, envMap)}</div>`
      : '';

    let jumpNav = '';
    if (!options.scope) {
      jumpNav = renderJumpLinks(
        environments.filter((env) => envMap.has(env.id)).map((env) => ({
          id: env.id,
          label: env.label,
          colors: ENV_COLORS[env.id],
        })),
        'env'
      );
    } else {
      jumpNav = renderJumpLinks(
        manifest.categories
          .filter((cat) => {
            const catMap = envMap.get(options.scope);
            return catMap && catMap.has(cat.id) && catMap.get(cat.id).length;
          })
          .map((cat) => ({
            id: cat.id,
            label: cat.label,
            colors: ENV_COLORS[options.scope] || ENV_COLORS.vwo,
          })),
        'cat'
      );
    }

    let sections = '';
    environments.forEach((env) => {
      const catMap = envMap.get(env.id);
      if (!catMap) return;

      const colors = ENV_COLORS[env.id] || ENV_COLORS.vwo;
      const envPageCount = Array.from(catMap.values()).reduce((s, arr) => s + arr.length, 0);
      const envIndexLink = !options.scope && ENV_INDEX_URLS[env.id]
        ? `<a class="hub-env-index-link" href="${ENV_INDEX_URLS[env.id]}" style="color:${colors.badge}">Open folder index</a>`
        : '';

      let categoriesHtml = '';
      manifest.categories.forEach((cat) => {
        const catPages = catMap.get(cat.id);
        if (!catPages || !catPages.length) return;
        catPages.sort((a, b) => getPageDisplayName(a).localeCompare(getPageDisplayName(b)));
        categoriesHtml += `
          <details class="hub-category" id="cat-${cat.id}" open>
            <summary>${cat.label} (${catPages.length})</summary>
            <div class="hub-card-grid">
              ${catPages.map((p) => renderCard(p, options)).join('')}
            </div>
          </details>`;
      });

      const smartCodeBadge = env.smartCode
        ? `<span class="hub-env-smartcode">${env.smartCode}</span>`
        : '';

      sections += `
        <section class="hub-env-section" id="env-${env.id}">
          <div class="hub-env-header" style="background:${colors.bg};border-color:${colors.border}">
            <h2>${env.label}</h2>
            ${smartCodeBadge}
            ${envIndexLink}
            <span class="hub-env-count">${envPageCount} pages</span>
          </div>
          ${categoriesHtml}
        </section>`;
    });

    const masterLink = options.masterIndexUrl
      ? `<a class="hub-master-link" href="${options.masterIndexUrl}">View Master Index</a>`
      : '';

    const accountToolbar = options.useAccountParams
      ? `<div class="hub-account-wrap">
           <label for="hubAccountIdInput">Account ID</label>
           <input type="text" id="hubAccountIdInput" placeholder="e.g. 718597" value="${hubState.accountId}" inputmode="numeric">
         </div>`
      : '';

    const smartCodePill = options.smartCode
      ? `<div class="hub-smartcode-pill">${options.smartCode}</div>`
      : '';

    document.body.innerHTML = `
      <header class="hub-header">
        <h1>${options.title || 'Integration Test Hub'}</h1>
        <p>${headerSubtitle}</p>
        ${smartCodePill}
        <div class="hub-stats">
          <div class="hub-stat"><strong>${totalPages}</strong> fixtures</div>
          <div class="hub-stat"><strong>${envCount}</strong> environments</div>
          <div class="hub-stat"><strong>${catCount}</strong> categories</div>
        </div>
      </header>
      ${envCards}
      <div class="hub-toolbar">
        <div class="hub-toolbar-inner">
          <div class="hub-search-wrap">
            <label for="hubSearchInput">Search integration pages</label>
            <input type="search" id="hubSearchInput" placeholder="Search by name or category... (press /)" autocomplete="off">
          </div>
          ${accountToolbar}
          <button type="button" class="hub-btn" id="hubToggleCategories">Collapse all</button>
          ${masterLink}
        </div>
      </div>
      ${jumpNav ? `<nav class="hub-jump-nav" aria-label="Quick navigation">${jumpNav}</nav>` : ''}
      <main class="hub-main" id="hubMain">
        ${sections}
        <p class="hub-no-results" id="hubNoResults">No pages match your search.</p>
      </main>`;

    bindSearch();
    bindAccountId(options);
    bindCategoryToggle();
    bindKeyboardShortcuts();
  }

  function updateCardLinks() {
    document.querySelectorAll('.hub-card a[data-base-href]').forEach((link) => {
      const base = link.getAttribute('data-base-href');
      link.href = hubState.accountId
        ? appendQueryParams(base, { id: hubState.accountId, path: hubState.path !== 'tag' ? hubState.path : '' })
        : base;
    });
  }

  function bindAccountId(options) {
    const input = document.getElementById('hubAccountIdInput');
    if (!input || !options.useAccountParams) return;

    const storageKey = `hub-account-id-${options.scope || 'global'}`;

    input.addEventListener('input', () => {
      hubState.accountId = input.value.trim();
      if (hubState.accountId) {
        sessionStorage.setItem(storageKey, hubState.accountId);
      } else {
        sessionStorage.removeItem(storageKey);
      }
      updateCardLinks();

      const params = new URLSearchParams(window.location.search);
      if (hubState.accountId) {
        params.set('id', hubState.accountId);
      } else {
        params.delete('id');
      }
      const query = params.toString();
      const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
      window.history.replaceState(null, '', nextUrl);
    });
  }

  function bindCategoryToggle() {
    const btn = document.getElementById('hubToggleCategories');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const categories = document.querySelectorAll('.hub-category');
      const shouldOpen = btn.textContent === 'Expand all';
      categories.forEach((cat) => { cat.open = shouldOpen; });
      btn.textContent = shouldOpen ? 'Collapse all' : 'Expand all';
    });
  }

  function bindKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      event.preventDefault();
      const input = document.getElementById('hubSearchInput');
      if (input) input.focus();
    });
  }

  function bindSearch() {
    const input = document.getElementById('hubSearchInput');
    const noResults = document.getElementById('hubNoResults');
    if (!input) return;

    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.hub-card');
      const categories = document.querySelectorAll('.hub-category');
      const sections = document.querySelectorAll('.hub-env-section');
      let visibleCount = 0;

      cards.forEach((card) => {
        const text = card.getAttribute('data-search') || card.textContent.toLowerCase();
        const match = !query || text.includes(query);
        card.style.display = match ? '' : 'none';
        if (match) visibleCount++;
      });

      categories.forEach((cat) => {
        const hasVisible = Array.from(cat.querySelectorAll('.hub-card')).some(
          (c) => c.style.display !== 'none'
        );
        cat.style.display = hasVisible ? '' : 'none';
        if (query && hasVisible) cat.open = true;
      });

      sections.forEach((section) => {
        const hasVisible = Array.from(section.querySelectorAll('.hub-card')).some(
          (c) => c.style.display !== 'none'
        );
        section.style.display = hasVisible ? '' : 'none';
      });

      noResults.classList.toggle('visible', visibleCount === 0);
    });
  }

  window.IndexHub = {
    init(options) {
      options = options || {};
      if (!window.PAGE_MANIFEST) {
        console.error('IndexHub: PAGE_MANIFEST not loaded');
        return;
      }
      render(window.PAGE_MANIFEST, options);
    },
  };
})();
