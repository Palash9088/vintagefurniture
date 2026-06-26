#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'smartcode3');

const BANNER_HTML = `      <div class="sc3-banner" id="sc3Banner">
         <img src="../images/banner-bg.svg" alt="Vintage Furniture" class="sc3-banner__img" width="1920" height="400" decoding="async">
         <div class="sc3-banner__overlay"></div>
         <div class="sc3-banner__content">
            <span class="sc3-banner__badge">SmartCode 3.0</span>
            <h2 class="sc3-banner__title">Integration Test Lab</h2>
            <p class="sc3-banner__hint">Click the bouncing dot to score!</p>
            <div class="sc3-banner__score">Score: <span id="sc3Score">0</span></div>
         </div>
         <button type="button" class="sc3-target" id="sc3Target" aria-label="Click the moving target"></button>
      </div>`;

const CSS_LINK = '   <link rel="stylesheet" href="../css/smartcode3-banner.css">';
const GAME_SCRIPT = '   <script src="../js/smartcode3-banner.js" defer></script>';

const BANNER_BLOCK_RE = /<!--\s*Banner\s*-->[\s\S]*?<\/div>\s*\n\s*(?=<)/i;
const OLD_BANNER_RE = /<div class="site-banner"[^>]*>[\s\S]*?<\/div>\s*\n/;

function patchFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  html = html.replace(/\s*\.site-banner\s*\{[^}]+\}\s*/g, '');
  html = html.replace(/\s*\.site-banner img\s*\{[^}]+\}\s*/g, '');

  if (html.includes('banner-bg.png')) {
    html = html.replace(/\.\.\/images\/banner-bg\.png/g, '../images/banner-bg.svg');
    html = html.replace(/images\/banner-bg\.png/g, '../images/banner-bg.svg');
    changed = true;
  }

  if (BANNER_BLOCK_RE.test(html)) {
    html = html.replace(BANNER_BLOCK_RE, BANNER_HTML + '\n\n');
    changed = true;
  } else if (OLD_BANNER_RE.test(html)) {
    html = html.replace(OLD_BANNER_RE, BANNER_HTML + '\n\n');
    changed = true;
  }

  if (!html.includes('smartcode3-banner.css')) {
    html = html.replace(/<\/style>\s*\n<\/head>/i, '</style>\n' + CSS_LINK + '\n</head>');
    changed = true;
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
    console.log('Patched:', path.basename(filePath));
  } else {
    console.log('Skipped (already patched):', path.basename(filePath));
  }
}

fs.readdirSync(DIR)
  .filter((f) => f.endsWith('.html'))
  .forEach((f) => patchFile(path.join(DIR, f)));

console.log('Done.');
