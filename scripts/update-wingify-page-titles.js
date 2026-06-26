#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'smartcode3wingify');

const TITLE_BY_FILE = {
  'adobe-aep.html': 'Adobe AEP Integration | Wingify',
  'eventbasedgtm.html': 'Event Based GTM | Wingify',
  'klaviyo.html': 'Klaviyo Integration | Wingify',
  'klaviyoautomation.html': 'Klaviyo Automation | Wingify',
};

function humanize(file) {
  const base = file.replace(/\.html$/, '');
  return base
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    + ' | Wingify';
}

fs.readdirSync(DIR)
  .filter((f) => f.endsWith('.html'))
  .forEach((file) => {
    const fp = path.join(DIR, file);
    let html = fs.readFileSync(fp, 'utf8');
    let changed = false;

    if (file === 'index.html') {
      return;
    }

    if (/<title>/i.test(html)) {
      const next = html.replace(/<title>([^<]*)<\/title>/gi, (match, content) => {
        const updated = content.replace(/VWO/g, 'Wingify').replace(/\s+/g, ' ').trim();
        if (updated !== content.trim()) {
          changed = true;
          return `<title>${updated}</title>`;
        }
        if (!/\| Wingify$/i.test(updated) && file !== 'eventjourney.html') {
          // already has Wingify from replacement
        }
        if (file === 'eventjourney.html' && !/\| Wingify/i.test(updated)) {
          changed = true;
          return `<title>${updated} | Wingify</title>`;
        }
        return match;
      });
      html = next;
    } else {
      const title = TITLE_BY_FILE[file] || humanize(file);
      if (/<\/head>/i.test(html)) {
        html = html.replace(/<\/head>/i, `   <title>${title}</title>\n</head>`);
      } else {
        html = html.replace(/<head([^>]*)>/i, `<head$1>\n   <title>${title}</title>`);
      }
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(fp, html);
      console.log('Updated:', file);
    }
  });

console.log('Done.');
