---
draft: true
title: 配置 Waline 评论区
description: 保留评论前端，并安全接入自己的 Waline 服务。
date: 2026-07-22
slug: configure-waline-comments
categories: [教程]
tags: [Waline, 评论, 配置]
---

Liquid Stack 已保留 Waline 评论组件；示例地址不会连接到任何真实后端。

## 准备服务端

先按照 Waline 官方文档部署自己的服务端。获得服务地址后，在 `hugo.yaml` 的 `params.comments.waline.serverURL` 中替换示例 URL。

## 启用与关闭

将 `params.comments.enabled` 设为 `true` 可启用评论。单篇文章也可以在前置数据中设为 `comments: false`，例如隐私页、说明页或不希望讨论的公告。

## 可选的安全上传与验证

`params.comments.waline.secureUploads` 默认关闭。它用于对接一个提供 `/api/upload-session`、`/api/upload-image`、`/api/comment-context`，并能在评论接口验证 Turnstile 令牌的 Waline 兼容后端。填写公开的 Cloudflare Turnstile Site Key、实现对应服务端校验与限额后再启用。浏览器会限制为 3 MB 以内的 JPEG、PNG、WebP 与 GIF，但服务端仍必须重复校验，并限制来源、频率、会话和存储容量。

不要把 Turnstile Secret Key 或存储凭据写入 Hugo 配置。主题只包含公开的前端配置；接口约定见 `docs/waline-secure-uploads.md`。

## 发布前测试

本地预览时检查文章底部是否出现评论框；发布后再测试提交、审核和邮件通知。服务器地址、访问令牌和管理员配置应放在自己的部署环境中，不应保留在公开主题示例里。
