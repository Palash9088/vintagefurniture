#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const TARGETS = [
  { dir: 'smartcode3', badge: 'SmartCode 3.0' },
  { dir: 'smartcode3wingify', badge: 'SmartCode 3.0 with Wingify' },
];

function bannerHtml(badge) {
  return `      <div class="sc3-banner" id="sc3Banner">
         <img src="../images/banner-bg.png" alt="Vintage Furniture" class="sc3-banner__img" width="1920" height="400" decoding="async">
         <div class="sc3-banner__overlay"></div>
         <div class="sc3-banner__content">
            <span class="sc3-banner__badge">${badge}</span>
            <h2 class="sc3-banner__title">Integration Test Lab</h2>
            <p class="sc3-banner__hint">Click the bouncing dot to score!</p>
            <div class="sc3-banner__score">Score: <span id="sc3Score">0</span></div>
         </div>
         <button type="button" class="sc3-target" id="sc3Target" aria-label="Click the moving target"></button>
      </div>`;
}

const CSS_LINK = '   <link rel="stylesheet" href="../css/smartcode3-banner.css">';
const GAME_SCRIPT = '   <script src="../js/smartcode3-banner.js" defer></script>';

const BANNER_BLOCK_RE = /<!--\s*Banner\s*-->[\s\S]*?<\/div>\s*\n\s*(?=<)/i;
const OLD_BANNER_RE = /<div class="site-banner"[^>]*>[\s\S]*?<\/div>\s*\n/;
const SC3_BANNER_RE = /<div class="sc3-banner"[\s\S]*?<\/div>\s*\n/;

function patchFile(filePath, badge) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  const BANNER_HTML = bannerHtml(badge);

  html = html.replace(/\s*\.site-banner\s*\{[^}]+\}\s*/g, '');
  html = html.replace(/\s*\.site-banner img\s*\{[^}]+\}\s*/g, '');

  if (/banner-bg\.(png|svg)/.test(html)) {
    html = html.replace(/(?:\.\.\/)?images\/banner-bg\.(?:png|svg)/g, '../images/banner-bg.png');
    changed = true;
  }

  if (html.includes('id="sc3Banner"')) {
    html = html.replace(SC3_BANNER_RE, BANNER_HTML + '\n');
    changed = true;
  } else if (BANNER_BLOCK_RE.test(html)) {
    html = html.replace(BANNER_BLOCK_RE, BANNER_HTML + '\n\n');
    changed = true;
  } else if (OLD_BANNER_RE.test(html)) {
    html = html.replace(OLD_BANNER_RE, BANNER_HTML + '\n\n');
    changed = true;
  }

  if (!html.includes('smartcode3-banner.css')) {
    if (/<\/style>\s*\n<\/head>/i.test(html)) {
      html = html.replace(/<\/style>\s*\n<\/head>/i, '</style>\n' + CSS_LINK + '\n</head>');
      changed = true;
    } else if (/<\/style>/i.test(html)) {
      html = html.replace(/<\/style>/i, '</style>\n' + CSS_LINK);
      changed = true;
    } else if (/<\/head>/i.test(html)) {
      html = html.replace(/<\/head>/i, CSS_LINK + '\n</head>');
      changed = true;
    }
  }

  if (!html.includes('id="sc3Banner"')) {
    html = html.replace(/<body([^>]*)>/i, '<body$1>\n' + BANNER_HTML + '\n');
    changed = true;
  }

  if (!html.includes('smartcode3-banner.js')) {
    html = html.replace(/<\/body>/i, GAME_SCRIPT + '\n</body>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html);
    console.log('Patched:', path.relative(ROOT, filePath));
  }
}

for (const { dir, badge } of TARGETS) {
  const folder = path.join(ROOT, dir);
  if (!fs.existsSync(folder)) continue;
  console.log(`\n--- ${dir} ---`);
  fs.readdirSync(folder)
    .filter((f) => f.endsWith('.html') && f !== 'index.html')
    .forEach((f) => patchFile(path.join(folder, f), badge));
}

console.log('\nDone.');
