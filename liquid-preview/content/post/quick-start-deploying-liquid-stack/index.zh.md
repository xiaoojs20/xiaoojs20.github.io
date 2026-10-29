---
draft: true
title: 快速开始：部署 Liquid Stack
description: 从复制主题到发布第一个页面的最短路径。
date: 2026-07-20
slug: quick-start-deploying-liquid-stack
categories: [教程]
tags: [Hugo, Cloudflare Pages, 部署]
---

本文介绍如何把 Liquid Stack 作为自己的博客起点，并发布第一个可访问的版本。

## 复制项目

使用 GitHub 的模板功能或复制本仓库。随后在 `hugo.yaml` 中修改站点标题、简介、头像路径和 GitHub 链接。不要编辑 `public/` 或 `resources/`，它们会在构建时重新生成。

## 本地预览

安装 Hugo Extended 后，在项目根目录运行 `hugo server -D`。浏览器打开终端显示的本地地址；保存 Markdown、配置或样式后，预览会自动刷新。

## 发布前检查

运行 `hugo --minify --cleanDestinationDir --ignoreCache`。确认首页、文章、相册、启动台和管理页都能打开，再把源文件推送到自己的仓库。生成的 `public/` 目录可以发布到 Cloudflare Pages 或其他静态托管平台。

## 下一步

先替换 `hugo.yaml` 中的示例信息，再开始写第一篇文章。启动台、相册、链接和评论配置都保留在项目中，可逐项改成自己的内容。
