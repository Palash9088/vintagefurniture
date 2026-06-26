#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'smartcode3wingify');
const BADGE = 'SmartCode 3.0 with Wingify';

const BANNER = `      <div class="sc3-banner" id="sc3Banner">
         <img src="../images/banner-bg.png" alt="Vintage Furniture" class="sc3-banner__img" width="1920" height="400" decoding="async">
         <div class="sc3-banner__overlay"></div>
         <div class="sc3-banner__content">
            <span class="sc3-banner__badge">${BADGE}</span>
            <h2 class="sc3-banner__title">Integration Test Lab</h2>
            <p class="sc3-banner__hint">Click the bouncing dot to score!</p>
            <div class="sc3-banner__score">Score: <span id="sc3Score">0</span></div>
         </div>
         <button type="button" class="sc3-target" id="sc3Target" aria-label="Click the moving target"></button>
      </div>`;

const CSS_LINK = '   <link rel="stylesheet" href="../css/smartcode3-banner.css">';
const GAME_SCRIPT = '   <script src="../js/smartcode3-banner.js" defer></script>';

function normalize(html) {
  html = html.replace(/\s*\.site-banner\s*\{[^}]+\}\s*/g, '');
  html = html.replace(/\s*\.site-banner img\s*\{[^}]+\}\s*/g, '');

  html = html.replace(/<div class="sc3-banner"[\s\S]*?<\/div>\s*/g, '');
  html = html.replace(/<div class="sc3-banner__content">[\s\S]*?<\/div>\s*/g, '');
  html = html.replace(/<button type="button" class="sc3-target"[\s\S]*?<\/button>\s*/g, '');
  html = html.replace(/<div class="site-banner"[\s\S]*?<\/div>\s*/g, '');
  html = html.replace(/<div class="image-section">[\s\S]*?<\/div>\s*/g, '');

  html = html.replace(/<link rel="stylesheet" href="\.\.\/css\/smartcode3-banner\.css">\s*/g, '');
  html = html.replace(/<script src="\.\.\/js\/smartcode3-banner\.js" defer><\/script>\s*/g, '');

  html = html.replace(/<\/head>\s*(?:\n\s*)*<\/head>/gi, '</head>');

  if ((html.match(/<body/gi) || []).length > 1) {
    html = html.replace(/<body[^>]*>[\s\S]*?<body([^>]*)>/i, '<body$1>');
  }

  html = html.replace(/<\/head>/i, '\n' + CSS_LINK + '\n</head>');
  html = html.replace(/<body([^>]*)>/i, '<body$1>\n' + BANNER + '\n');
  html = html.replace(/<\/body>/i, GAME_SCRIPT + '\n</body>');

  return html;
}

fs.readdirSync(DIR)
  .filter((f) => f.endsWith('.html') && f !== 'index.html')
  .forEach((f) => {
    const filePath = path.join(DIR, f);
    const out = normalize(fs.readFileSync(filePath, 'utf8'));
    fs.writeFileSync(filePath, out);
    console.log('Normalized:', f);
  });

console.log('Done.');
