---
draft: true
title: 配置评论、友链申请与邮件模板
description: 使用 Liquid Stack 的评论演示、Microsoft Forms 友链申请模板和已去敏的双语邮件模板。
date: 2026-08-02
slug: comment-forms-email-templates
image: /img/posts/bilingual-publishing.png
categories: [教程]
tags: [Waline, 友链, Microsoft Forms, 邮件模板, Liquid Stack]
---

本文介绍 Liquid Stack 提供的评论演示、友链申请表单与双语邮件模板，并说明如何把这些示例连接到自己的服务。

## 评论区演示模式

开源 Demo 默认启用评论演示模式。文章底部会显示评论输入框、互动数字和四条示例评论，页面不会连接 Waline 后端数据库。

主页页脚显示带有演示说明的全站浏览量静态数值，所有页面同时显示 365 天示意运行时间。接入 Waline 并将 `demoMode` 改为 `false` 后，主页可以从自己的 Waline 服务读取真实全站浏览量。添加 `params.footer.launchDate` 后，页脚会计算实际运行天数。

在演示框中输入的内容不会被本站提交或记录。请勿在演示页面填写真实邮箱、联系方式或其他敏感信息。

演示模式由 `hugo.yaml` 控制。

```yaml
params:
  comments:
    enabled: true
    provider: waline
    waline:
      serverURL: https://example.com/waline
      demoMode: true
```

## 接入自己的 Waline

先按照 [Waline 官方文档](https://waline.js.org/guide/get-started/) 部署服务端，再完成下面两项配置。

1. 将 `serverURL` 替换为自己的 Waline 服务地址
2. 将 `demoMode` 改为 `false`

完成后，Liquid Stack 会加载真实评论、浏览量、评论数、回复通知和文章反应。服务端凭据、管理员令牌和邮件密钥应保存在部署平台的环境变量中。

更基础的评论接入步骤可继续阅读[配置 Waline 评论区](/zh/p/configure-waline-comments/)。

## 友链申请系统

Demo 的链接页面已经接入一份 Microsoft Forms 友链申请示例。

- [打开友链申请演示](https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__bK_KBBUQ0sxMlZYNVA0OTZIQTMySkxLVjdXTVJNNS4u)
- [复制友链申请表单模板](https://forms.cloud.microsoft/Pages/ShareFormPage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__bK_KBBUQ0sxMlZYNVA0OTZIQTMySkxLVjdXTVJNNS4u&sharetoken=TnsZOZAtRpQBsNnIX6GA)

演示表单仅供参考。Demo 网站不会保存这里的填写内容，也不会将其用于正式友链审核。Microsoft Forms 由微软提供，打开外部表单前仍应查看其隐私说明，并避免提交真实敏感信息。

喜欢这套申请结构时，可以使用复制链接创建自己的表单，再替换标题、站点资料、隐私提示、通知规则和审核流程。

友链页面的按钮与嵌入地址位于 `content/page/links/`，网站管理菜单中的入口位于 `data/management_links.yaml`。

## 双语邮件模板

仓库在 [`examples/email-templates`](https://github.com/Jingyuan-Zheng/Liquid-Stack/tree/main/examples/email-templates) 中提供五份已去敏的响应式 HTML 邮件和一份 Waline 通知主题文件。

- 中文读者来信回复
- 英文读者来信回复
- 中文友链申请通过通知
- 英文友链申请通过通知

### Waline 评论回复通知

`waline-comment-reply-bilingual.html` 是一份可直接改用的 Waline 中英双语回复通知正文，`waline-comment-reply-subject.txt` 提供对应主题。模板会根据文章 URL 是否包含 `/zh/` 选择简体中文，其余页面显示英文。

模板保留评论者、回复者、回复内容和文章链接所需的 Waline 变量。将 `[SITE NAME]` 与 `[站点名称]` 替换为自己的公开站点名称后，再把正文和主题粘贴到 Waline 邮件配置中。不要替换 `self`、`parent` 与 `site` 变量。

模板已经移除真实姓名、个人网站和身份信息，统一改成方括号占位符。发送前需要替换网站名称、品牌、网址、收件人称呼、回复正文和署名。

这些 HTML 可以用于 Waline 邮件工作流、人工回复、自动化邮件服务或友链审核通知。不同邮件服务对 HTML 和变量语法的要求不同，接入前应先发送测试邮件，检查移动端布局、链接和深色模式显示。

## 上线前检查

- 关闭 `demoMode` 后再测试真实评论提交与通知
- 将友链表单复制到自己的 Microsoft 账户
- 更新表单中的隐私说明和审核规则
- 替换邮件模板中的全部方括号占位符
- 不要把访问令牌、管理员地址和邮件密钥提交到公开仓库

完成这些设置后，评论、友链申请与通知邮件就会进入自己的服务流程，主题界面和双语结构可以继续保留。
