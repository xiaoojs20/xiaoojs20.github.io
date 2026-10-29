---
draft: true
title: "Welcome to Liquid Stack: New Theme Features"
description: "A complete guide to starting with Liquid Stack and exploring its visual system, homepage widgets, content presentation, management tools, and bilingual experience."
date: 2026-08-02T19:40:00+02:00
lastmod: 2026-08-08T16:00:00+02:00
slug: welcome-to-liquid-stack
categories: [Tutorials]
tags: [Liquid Stack, Stack v4, Theme Update, Hugo, Starter]
writingMode: human
---

Liquid Stack is built on [Hugo Theme Stack](https://github.com/CaiJimmy/hugo-theme-stack) v4.0.3. It keeps Stack's blogging foundation and expands it through a visual system, homepage widgets, presentation pages, and management tools into a complete personal-site starter.

Select **Use this template** on GitHub, replace the sample identity and content, and start from a working framework.

## Get started

### Replace the site identity

Update the site title, URL, sidebar copy, and social links in `hugo.yaml`, then replace the sample avatar, logo, and social-preview image under `static/img/liquid-stack/` with your own assets.

Store each article in its own directory under `content/post/`. English posts use `index.md`, with a Simplified Chinese translation in `index.zh.md` beside it. Keep the `slug` stable after publishing so existing links continue to work.

### Connect services when needed

The public starter is not connected to personal comment, analytics, or deployment accounts. Sveltia CMS, Waline, page views, and management links keep their complete framework and can be enabled with your own repository, service endpoints, and public URLs.

## Visual design

### Liquid Glass inspiration

Liquid Stack's largest update is its visual design. Inspired by Apple's **Liquid Glass** design language, it adopts the ideas that translate well to the web, including translucent material, clear content layers, light and dark adaptation, and gentle transformation.

Management overlays and focused photo views use translucency and background blur. Navigation, shortcuts, and controls form a functional layer above the content. Soft shadows and subtle tonal changes define card boundaries, while light and dark modes tune the canvas, surfaces, and text independently. Hover, expansion, and entrance motion keep attention on the active content.

### Rounded-corner hierarchy

Different corner sizes communicate the scale and role of each element.

- **28-pixel large corners** appear on homepage widgets, article cards, dashboard panels, the launchpad, and photo-wall content
- **24 to 25-pixel medium corners** appear on the management menu, compact information panels, and mobile cards
- **18 to 19-pixel small corners** appear on application previews, icon containers, and smaller content modules
- **Pill corners** appear on selected sidebar items, tags, buttons, language controls, and the dark-mode switch
- **Circular outlines** are used for avatars, the emoji badge, and world clocks

This hierarchy keeps large surfaces soft and complete while small controls remain precise.

### Icon theme

The sidebar, homepage widgets, management menu, article actions, and dashboard use **Lucide** as their shared lightweight line-icon system. Related actions use consistent stroke weight, sizing, and spacing, while selected states rely on background and colour changes throughout the site.

### Main colours

- **Light mode** uses a pale grey-lavender canvas `#f5f5fa`, white cards, deep blue-grey accents `#34495e`, and soft grey body text `#707070`
- **Dark mode** uses a deep grey canvas `#303030`, charcoal cards `#424242`, and an off-white accent `#ecf0f1`
- **Functional accents** use small amounts of orange, blue, purple, and green in the world clock and dashboard statuses without changing the neutral foundation

## Homepage widgets

### Profile widget

A profile widget at the top of the homepage presents the avatar, greeting, site description, and social links. Its text, image, and links can be replaced while keeping the component structure.

On phones, the profile area progressively contracts into a shared top bar as the reader scrolls. The compact state keeps the avatar, title, theme control, language control, and menu within reach while preserving the page's visual continuity.

### Feature shortcut cards

Shortcut cards lead to the launchpad, About page, dashboard, and photo wall while previewing application icons or gallery content. Replacing their source data automatically updates the previews, and the complete blog feed remains below them.

### Content navigation widgets

Stack's search, archives, categories, and tag-cloud widgets remain available with Liquid Stack's card, icon, and spacing treatment.

### World clocks

Two analogue world clocks show the visitor's local time and the configured site time, calculate the difference automatically, and allow the site time zone to be changed. The browser supplies the visitor's local zone without requiring manual selection.

## Content and reading

### Blog content structure

Articles, archives, categories, tags, related posts, the table of contents, and full-text search continue to use Stack's content model, so existing Hugo posts remain compatible. Liquid Stack gives article cards, taxonomy labels, metadata, and the table of contents a consistent visual treatment.

### Localized dates

Post lists, article pages, and archive lists format dates using the visitor's browser region. Systems using year-month-day, day-month-year, or month-day-year therefore see their familiar order while the page retains a standard machine-readable date.

### Printing and sharing

Article pages add print, copy-link, and system-share actions. Chinese pages support Weibo, QQ, and X; English pages support X, Reddit, LinkedIn, WhatsApp, and email. Printed articles include author and source attribution.

Posts may also declare optional human-written or AI-assisted writing metadata. The selected bilingual label appears with the article actions, while posts without the field retain the original footer.

### Automatic language switching

English and Simplified Chinese share the same homepage, sidebar, articles, launchpad, photo wall, About page, and dashboard layouts.

On a first visit, the site reads the browser's preferred language. A Chinese-language browser opens the matching Chinese page automatically. A manual choice in the sidebar is saved for later visits, and switching language from an article opens the translation of that same article whenever it is available.

Visitors using another browser language receive a small translation suggestion. Code blocks and other technical text are protected from automatic translation so commands and examples remain intact.

### Search, 404, and sitemaps

The 404 page converts an invalid path into a search query and presents the search interface instead of stopping at an error message.

Human-readable English and Chinese sitemaps are included alongside multilingual XML sitemaps, helping both visitors and search engines discover content.

## Projects, photos, and the About page

### Project launchpad

The launchpad presents software, creative work, research projects, or useful links. Each entry can define bilingual names, an icon, preview image, related article, and repository. Selecting an icon opens an application preview before the full article.

The public starter includes complete examples. Replacing project data and images updates both the launchpad and its homepage widget.

An additional fictional product catalog demonstrates a second data-driven presentation pattern with search, status filtering, sorting, collapsible groups, and responsive cards. It remains independent from the launchpad and can be removed when it is not useful.

### Interactive photo wall

The photo wall supports portrait and landscape images without forcing one crop. Visitors can rearrange photos by dragging them and open a focused view; the arrangement is stored in the current browser.

It works for photography, travel, design work, events, and project screenshots. Replacing photo-wall data also updates the homepage gallery preview.

### About page

The About page keeps its entrance animation, timeline, floating menu, and section layout. A fictional résumé demonstrates the design without limiting how the page can be used.

It can become a personal introduction, site story, team page, portfolio history, or formal résumé without rebuilding the layout and motion.

On touch devices, its floating section navigation opens on tap and closes after selection or an outside tap, keeping long pages practical without occupying the reading area permanently.

## Management, statistics, and interaction

### Site management menu

The emoji badge beside the avatar opens a management menu for the CMS, comment moderation, backlink applications, Cloudflare Pages, search consoles, analytics, and deployment platforms. Its entries come from a data file and can be replaced with other tools and addresses.

### Sveltia CMS

Sveltia CMS remains available at `/admin/`. After connecting a GitHub repository, it can create and edit bilingual posts, categories, launchpad projects, and photo-wall content from the browser.

The public starter includes the CMS framework and generic configuration without connecting the original author's private services or credentials.

### Site dashboard

The dashboard derives post counts, total words, days online, category distribution, popular tags, publishing habits, and an annual heatmap from Hugo content. It also presents the configured Hugo, Stack, deployment, comments, and CMS status.

These summaries work without an external analytics platform.

### Waline comments

Comments continue to use Stack's Waline support with theme-matched cards, typography, and dark mode. The section adds guidance, page-view and comment totals, reply notifications, and reactions, while the footer can show site-wide views.

Users only need to provide their own Waline endpoint; the demo does not connect to a personal comment database.

Sites with a compatible backend may also enable the documented upload-session and comment-verification hooks. They stay disabled by default so the starter does not imply security checks that a backend has not implemented.

### Friend links and applications

The friend-link module expands the compact link list into site cards, exchange rules, application and contact actions, and an optional embedded form. A separate platform section can link to GitHub, portfolios, or other public profiles.

## Open-source template and customization

### Stack remains the foundation

Liquid Stack continues to use the official Stack v4.0.3 release as its blog foundation. Project-level Hugo overrides maintain the additions without editing the official files under `themes/hugo-theme-stack/`, keeping the upstream structure and Liquid Stack extensions separate.

### Generic examples and privacy

The public starter keeps the pages, homepage widgets, management tools, and bilingual examples without publishing the original author's private posts, real résumé, avatar, or service credentials. Sample projects, images, logos, comments, and management links can all be replaced.

The included Web App manifest, install icons, Apple standalone metadata, and browser theme colours provide a basic add-to-home-screen experience. Offline caching is not enabled.

### Suitable sites

Liquid Stack is suitable for personal blogs, digital gardens, developer or designer portfolios, project showcases, photography journals, and bilingual sites that need a browser-based CMS. Explore the live demo, then select **Use this template** on GitHub to create your own copy.
