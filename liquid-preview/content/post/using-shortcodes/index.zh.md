---
draft: true
title: Shortcodes 使用指南
description: 用 Hugo Shortcodes 让文章内容更清晰、更易维护。
date: 2026-07-24
slug: using-shortcodes
categories: [教程]
tags: [Hugo, Shortcodes, Markdown]
---

Shortcodes 是 Hugo 在 Markdown 中插入可复用结构的方式，适合提示框、嵌入内容和重复版式。

## 先看现有 Shortcodes

浏览 `layouts/shortcodes/`，了解主题已经提供的能力。优先复用现有组件，避免为一次性排版复制大段 HTML。

## 什么时候使用

当一段内容需要固定结构、会在多篇文章中重复，或必须渲染为 HTML 时，Shortcode 比手写重复代码更合适。普通段落、列表和代码块仍然直接使用 Markdown。

## 测试渲染结果

加入 Shortcode 后用本地预览检查桌面与移动端。若它依赖图片、视频或外部链接，也要检查资源路径与加载失败时的表现。
