---
name: hanushree-front
description: >-
  Applies or edits the Hanushree Jewellers display front on fixture HTML pages.
  Use when changing that jewellery front, its dataLayer events, the Contact us
  HubSpot accordion, or adding the front to a root or folder fixture page.
---

# Hanushree front

Shared files only. Do not paste the shell, CSS, or click handler into a page.

- Look: `css/hanushree.css`
- Events and pieces: `js/hanushree-front.js`
- Splice onto fixture pages: `python3 scripts/apply-hanushree-front.py`

The script covers the repo root plus `smartcode3vwo/`, `smartcode3wingify/`, `codewingify/`, and `abtasty/`. Folder pages use `../` for the shared CSS, script, and images. It skips every `index.html` and does not touch `ecom/`.

## Rules

- Leave each page `<head>` script as-is. Add only the font links and `css/hanushree.css`.
- Do not change `<title>`.
- Keep page tools below the shell: dataLayer demo, tic-tac-toe, identify buttons, Salesforce web-to-lead, Quin forms, journey visualizer, timezone converter.
- `vwosupporthubspot.html` keeps portal `40003415` and form `9027fd59-50e1-4085-9777-5e8f4e55d40e`. Every other page uses portal `44178869` and form `d913a33a-71c4-4f8d-9e53-baff8487a900` unless that page already had a different pair.
- The HubSpot embed stays inline inside `#contact-panel`, with no `target`. `onFormReady` adds `is-closed`. Do not hide the panel before that callback.
- Header, category, View, Cart, Checkout, and Contact us only push `dataLayer` events. They do not navigate.
- On `smartcode3vwo/` and `smartcode3wingify/` pages, do not put the SmartCode score banner back. The test-app note is the `.hj-testapp` box at the top of `.hj-main`, with that page’s own GitHub Pages URL.
