---
draft: true
title: A Guide to Hugo Shortcodes
description: Use Hugo Shortcodes to make post content clearer and easier to maintain.
date: 2026-07-24
slug: using-shortcodes
categories: [Tutorials]
tags: [Hugo, Shortcodes, Markdown]
---

Shortcodes are Hugo’s way to insert reusable structures into Markdown, making them useful for callouts, embeds, and repeated layouts.

## Start with existing Shortcodes

Browse `layouts/shortcodes/` to see what the theme already provides. Reuse existing components before adding one-off HTML for a single article.

## When to use one

Use a Shortcode when content needs a fixed structure, recurs across posts, or must render as HTML. Keep ordinary paragraphs, lists, and code blocks in Markdown.

## Test the result

Preview the post on desktop and mobile after adding a Shortcode. If it uses an image, video, or external URL, check the resource path and its failure state too.
