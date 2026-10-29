---
draft: true
title: 开始写博客：Markdown 与双语文章
description: 用一组配对文件维护中文和英文文章。
date: 2026-07-23
slug: writing-markdown-and-bilingual-posts
categories: [教程]
tags: [Markdown, 多语言, 写作]
---

Liquid Stack 使用 Hugo 的多语言内容结构：同一篇文章的中英文版本放在同一个目录。

## 创建文章目录

在 `content/post/文章-slug/` 新建 `index.md` 和 `index.zh.md`。两个文件使用同一个 `slug`，这样语言切换器能识别它们是一对翻译文章。

## 写好前置数据

每篇文章至少应有标题、简介、日期、分类和标签。中文与英文应分别本地化标题和简介，而不是逐字翻译；产品名、命令和代码保持原样。

## 保持可维护

文章图片放在 `static/img/文章-slug/`，并用 `/img/文章-slug/featured.png` 一类的站点绝对路径引用。发布前检查两种语言是否都有正确链接、图片和分类。
