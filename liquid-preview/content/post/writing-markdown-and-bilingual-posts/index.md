---
draft: true
title: "Start Writing: Markdown and Bilingual Posts"
description: Maintain Chinese and English articles as a matched pair of files.
date: 2026-07-23
slug: writing-markdown-and-bilingual-posts
categories: [Tutorials]
tags: [Markdown, i18n, Writing]
---

Liquid Stack uses Hugo’s multilingual content structure: Chinese and English versions of one post live in the same directory.

## Create a post directory

Create `index.md` and `index.zh.md` under `content/post/your-slug/`. Give both files the same `slug` so the language switcher recognises them as translations of one post.

## Write useful front matter

Every post should have a title, description, date, category, and tags. Localise the title and description for each audience rather than translating word by word; keep product names, commands, and code unchanged.

## Keep it maintainable

Store images in `static/img/your-slug/` and use site-absolute paths such as `/img/your-slug/featured.png`. Before release, check links, images, and categories in both languages.
