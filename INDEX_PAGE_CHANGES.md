# Index Page Reorganization — Change Log

This document describes the file-level changes made to reorganize the integration test hub index pages.

## Summary

The site index was rebuilt from a flat, stale list (~128 entries) into a **master hub** covering **287 integration fixtures** across **5 environments**, grouped by category with search, jump navigation, and a decorative layout.

---

## Files Added

### `js/pages-manifest.js`
- **Purpose:** Single source of truth for all index page links.
- **Contents:** `window.PAGE_MANIFEST` with:
  - `environments` — VWO (Root), SmartCode 3, AB Tasty, Wingify, Wingify V3
  - `categories` — Tag Managers, Product Analytics, Session Replay, CDP, Marketing Automation, Adobe, Matomo/Privacy, Test/Edge, Utility, Other
  - `pages` — Array of `{ url, name, environment, category }` for every content HTML file
- **Coverage:** 287 pages (excludes `index.html` hub files only)

### `js/index-hub.js`
- **Purpose:** Shared renderer used by all index pages.
- **Features:**
  - Hero header with fixture/environment/category counts
  - Sticky search toolbar with accessible label
  - Environment jump navigation (master index only)
  - Grouped sections with collapsible category blocks
  - Color-coded environment badges on cards
  - Scoped mode for subfolder local hubs
  - "View Master Index" link on subfolder indexes

### `scripts/generate-pages-manifest.js`
- **Purpose:** Regenerate `js/pages-manifest.js` when new HTML fixtures are added.
- **Usage:** `node scripts/generate-pages-manifest.js`

---

## Files Modified

### `index.html` (root master hub)
- **Removed:** Inline `pages` array (~130 manual entries), flat card grid, emoji-only search, `target="_blank"` on all links
- **Added:** Loads `js/pages-manifest.js` + `js/index-hub.js`, renders full multi-environment hub
- **Preserved:** VWO Async SmartCode in `<head>`

### `codewingify/index.html`
- **Removed:** Duplicated root-relative `pages` array (broken links when opened from subfolder)
- **Added:** Scoped hub for `codewingify` environment only (79 pages), link to `../index.html`
- **Preserved:** Wingify Async SmartCode in `<head>`

### `smartcode3wingify/index.html`
- **Removed:** Duplicated root-relative `pages` array
- **Added:** Scoped hub for `smartcode3wingify` environment only (79 pages), link to `../index.html`
- **Preserved:** Wingify V3 SmartCode in `<head>`

---

## Data Corrections

| Issue | Resolution |
|-------|------------|
| `hubspot2.html` listed but file missing | **Removed** from manifest |
| `index.html` self-link | **Excluded** from manifest |
| `air360.html` missing from old index | **Added** |
| `eventjourney.html` missing from old index | **Added** |
| `hubspottest.html` missing from old index | **Added** |
| Entire `codewingify/` tree missing | **Added** (79 pages) |
| Entire `smartcode3wingify/` tree missing | **Added** (79 pages) |
| `codewingify/segmentpushwithoutvwo.html` only in subfolder | **Included** in manifest |

---

## Environment Breakdown

| Environment | Pages | Path prefix |
|-------------|-------|-------------|
| VWO (Root) | 78 | `*.html` at root |
| SmartCode 3 | 25 | `smartcode3/` |
| AB Tasty | 26 | `abtasty/` + root `abtasty.html` |
| Wingify | 79 | `codewingify/` |
| Wingify V3 | 79 | `smartcode3wingify/` |

---

## How to Maintain

1. Add a new integration HTML fixture anywhere in the repo.
2. Run: `node scripts/generate-pages-manifest.js`
3. Commit both the new HTML file and updated `js/pages-manifest.js`.

Category assignment is automatic based on filename patterns in the generator script. To add a new category rule, edit `CATEGORY_RULES` in `scripts/generate-pages-manifest.js`.

---

## Navigation Model

```
index.html (master hub)
├── VWO (Root) section
├── SmartCode 3 section
├── AB Tasty section
├── Wingify section
└── Wingify V3 section

codewingify/index.html          → local Wingify hub + link to master
smartcode3wingify/index.html    → local Wingify V3 hub + link to master
```
