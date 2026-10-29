# Feature port checklist

This file records the reusable improvements ported from the personal site into the public Liquid Stack starter.

## Implemented

- [x] Optional product-catalog demo
  - Four fictional products in two categories
  - English and Simplified Chinese content
  - Name/description search, status filtering, sortable columns, collapsible groups, and responsive mobile cards
  - Data stored in `data/product-catalog.yaml`
  - Optional homepage entry; removing the data/page removes the demo without affecting the blog
- [x] Shared mobile profile top bar
  - Progressive profile contraction while scrolling
  - Fixed avatar, title, theme control, language control, and menu control
  - Homepage and search-page variants reuse the same visual system
  - Search-page top bar activates only when search results make the page scrollable
- [x] Mobile floating navigation
  - About-page navigation remains available on mobile
  - Tap to open; selecting a section or tapping outside closes it
  - Desktop hover behaviour remains available
- [x] Baseline Web App support
  - Web App manifest
  - 192×192 and 512×512 install icons
  - Apple touch icon, standalone metadata, and light/dark browser theme colours
  - No service worker or offline cache is included
- [x] Optional secure Waline upload integration
  - Disabled by default
  - Turnstile-assisted upload sessions and comment verification hooks
  - Client-side image type and 3 MB size checks
  - Backend contract documented in `docs/waline-secure-uploads.md`
- [x] Optional article authorship metadata
  - `writingMode: human` for author-written posts
  - `writingMode: aigc-assisted` for AI-assisted posts
  - Bilingual labels and CMS selection field
  - Both variants demonstrated by sample articles

## Validation completed

- [x] Full Hugo production build with minification and a clean destination
- [x] English and Chinese product-catalog pages generated
- [x] Product catalog contains exactly four fictional demo records
- [x] Generated bilingual CMS configuration parses as valid YAML
- [x] Web App manifest parses as valid JSON and references both install-icon sizes
- [x] Human-written and AI-assisted labels appear in generated English and Chinese article pages
- [x] Mobile floating-navigation markup and compiled interaction code appear in generated output
- [x] Git whitespace/error check passes
- [x] Existing unrelated untracked `Icon` file remains untouched

## Intentionally not ported

- Personal Mac application records and application icons
- Personal deployment workflow and hosting-specific automation
- Personal SEO structured data
- Personal animated avatar Emoji
- Personal analytics configuration

## Maintainer review

- [ ] Confirm the mobile top-bar motion on a real iPhone or Android device
- [ ] Confirm the floating navigation interaction on a real touch device
- [ ] Replace or remove the fictional product catalog if the starter does not need it
- [ ] Configure and test secure Waline endpoints before enabling `secureUploads`
