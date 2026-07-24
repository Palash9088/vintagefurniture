#!/usr/bin/env node
/**
 * Regenerate js/pages-manifest.js from all HTML files in the repo.
 * Usage: node scripts/generate-pages-manifest.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const ENV_CONFIG = {
  vwo: { id: 'vwo', label: 'VWO (Root)', order: 1, smartCode: 'SmartCode 2.2 with VWO' },
  smartcode3vwo: { id: 'smartcode3vwo', label: 'VWO V3', order: 2, smartCode: 'SmartCode 3.0 with VWO' },
  abtasty: { id: 'abtasty', label: 'AB Tasty', order: 3, smartCode: 'AB Tasty + VWO' },
  codewingify: { id: 'codewingify', label: 'Wingify', order: 4, smartCode: 'Wingify SmartCode 2.2' },
  smartcode3wingify: { id: 'smartcode3wingify', label: 'Wingify V3', order: 5, smartCode: 'SmartCode 3.0 with Wingify' },
};

const CATEGORY_RULES = [
  { id: 'tag_managers', label: 'Tag Managers & Data Layer', test: (n) => /^(gtm|gtag|datalayer|tealium|eventbasedgtm|ga4viagtm|gtagecom|abtgtagsetup|abtdatalayersetup)/.test(n) },
  { id: 'product_analytics', label: 'Product Analytics', test: (n) => /^(heap|mixpanel|amplitude|pendo|kissmetrics|abtheap|abtmixpanel|abtamplitude)/.test(n) },
  { id: 'session_replay', label: 'Session Replay & UX', test: (n) => /^(hotjar|fullstory|clarity|mouseflow|contentsquare|glassbox|piano|abthotjar|abtfullstory|abtclarity|abtcontentsquare|abtglassbox|abtpiano|abtquantummetrics)/.test(n) },
  { id: 'cdp_identity', label: 'CDP & Identity', test: (n) => /^(segment|rudderstack|mparticle|clearbit|6sense|demandbase|albacross|zoominfo|zeotap|lytics|factorsai|air360|commandersact|abtsegmentpush|abtmparticle|abtair360|abtysance|abtanil|abtadvalo)/.test(n) },
  { id: 'marketing_automation', label: 'Marketing Automation', test: (n) => /^(hubspot|marketo|klaviyo|braze|clevertap|moengage|abthubspot|abtklaviyo|abtsfmc)/.test(n) },
  { id: 'adobe', label: 'Adobe Stack', test: (n) => /^adobe/.test(n) },
  { id: 'matomo_privacy', label: 'Matomo & Privacy Analytics', test: (n) => /^(matomo|piwik|snowplow|abtmatomo|abtpiwik|abteulerian|eulerian)/.test(n) },
  { id: 'test_edge', label: 'Test & Edge Cases', test: (n) => /(random|withoutvwo|bodytag|both|timezonecalc|eventjourney|hubspottest|segmentvwotesting|segmentpush2|gtmwithoutsmartcode|gtmwithcookie)/.test(n) },
  { id: 'utility', label: 'Utility', test: (n) => /^(contact|carrotlayer|vwosupporthubspot|quin|abtasty)$/.test(n) },
];

function getEnvironment(url) {
  if (url.startsWith('smartcode3vwo/')) return 'smartcode3vwo';
  if (url.startsWith('smartcode3wingify/')) return 'smartcode3wingify';
  if (url.startsWith('codewingify/')) return 'codewingify';
  if (url.startsWith('abtasty/') || url === 'abtasty.html') return 'abtasty';
  return 'vwo';
}

function getBaseName(url) {
  const file = url.split('/').pop().replace('.html', '');
  if (url.startsWith('abtasty/')) return file.replace(/^abt/, '');
  return file;
}

function getCategory(url) {
  const base = getBaseName(url);
  for (const rule of CATEGORY_RULES) {
    if (rule.test(base)) return rule.id;
  }
  return 'other';
}

function getDisplayName(url) {
  const parts = url.split('/');
  const file = parts.pop().replace('.html', '');
  if (parts.length === 0) return file;
  if (parts[0] === 'abtasty') return `abtasty / ${file}`;
  return `${parts[0]} / ${file}`;
}

const raw = execSync(
  "find . -name '*.html' -not -path './.git/*' | sed 's|^\\./||' | grep -v 'index\\.html$' | sort",
  { cwd: ROOT, encoding: 'utf8' }
);

const files = raw.trim().split('\n').filter(Boolean);

const pages = files.map((url) => ({
  url,
  name: getDisplayName(url),
  environment: getEnvironment(url),
  category: getCategory(url),
}));

pages.sort((a, b) => a.name.localeCompare(b.name));

const categories = CATEGORY_RULES.map((r) => ({ id: r.id, label: r.label }));
categories.push({ id: 'other', label: 'Other Integrations' });

const environments = Object.values(ENV_CONFIG).sort((a, b) => a.order - b.order);

const out = `/**
 * Shared page manifest for integration test fixtures.
 * Regenerate: node scripts/generate-pages-manifest.js
 */
window.PAGE_MANIFEST = {
  environments: ${JSON.stringify(environments, null, 2)},
  categories: ${JSON.stringify(categories, null, 2)},
  pages: ${JSON.stringify(pages, null, 2)}
};
`;

fs.writeFileSync(path.join(ROOT, 'js/pages-manifest.js'), out);
console.log(`Generated ${pages.length} pages in js/pages-manifest.js`);
