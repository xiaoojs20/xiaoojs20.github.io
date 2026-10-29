---
draft: true
title: Configure Comments, Backlink Forms, and Email Templates
description: Use Liquid Stack's comment demo, reusable Microsoft Forms backlink application, and sanitized bilingual email templates.
date: 2026-08-02
slug: comment-forms-email-templates
image: /img/posts/bilingual-publishing.png
categories: [Tutorials]
tags: [Waline, Backlinks, Microsoft Forms, Email Templates, Liquid Stack]
---

This guide introduces Liquid Stack's comment demonstration, backlink application form, and bilingual email templates, then explains how to connect each example to your own services.

## Comment demo mode

The public Demo enables comment demo mode by default. Article pages show a comment composer, engagement totals, and four sample comments without connecting to a Waline backend database.

The homepage footer shows a static site-view count marked as a demo value. Every page also shows a sample runtime of 365 days. After connecting Waline and changing `demoMode` to `false`, the homepage can read the real site-wide count from your Waline service. Add `params.footer.launchDate` to calculate the real runtime.

Text entered in the demo composer is not submitted or recorded by this site. Do not enter a real email address, contact details, or other sensitive information.

Demo mode is controlled in `hugo.yaml`.

```yaml
params:
  comments:
    enabled: true
    provider: waline
    waline:
      serverURL: https://example.com/waline
      demoMode: true
```

## Connect your own Waline service

Deploy a server by following the [official Waline guide](https://waline.js.org/en/guide/get-started/), then update two values.

1. Replace `serverURL` with your Waline endpoint
2. Change `demoMode` to `false`

Liquid Stack will then load real comments, page views, comment totals, reply notifications, and reactions. Keep server credentials, administrator tokens, and mail secrets in deployment environment variables.

For the basic integration steps, continue with [Configure Waline Comments](/p/configure-waline-comments/).

## Backlink application system

The Demo links page includes a Microsoft Forms backlink application example.

- [Open the backlink application demo](https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__bK_KBBUQ0sxMlZYNVA0OTZIQTMySkxLVjdXTVJNNS4u)
- [Copy the backlink application form template](https://forms.cloud.microsoft/Pages/ShareFormPage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__bK_KBBUQ0sxMlZYNVA0OTZIQTMySkxLVjdXTVJNNS4u&sharetoken=TnsZOZAtRpQBsNnIX6GA)

The demo form is provided for reference. The Demo site does not retain the entries or use them for a formal backlink review. Microsoft provides the external form, so review its privacy information and avoid submitting real sensitive information.

If the structure suits your site, use the copy link to create your own form, then replace the title, site details, privacy notice, notification rules, and review flow.

The links-page buttons and embed URL live under `content/page/links/`. The management-menu entry is configured in `data/management_links.yaml`.

## Bilingual email templates

Five sanitized responsive HTML email files and a Waline notification subject file are available under [`examples/email-templates`](https://github.com/Jingyuan-Zheng/Liquid-Stack/tree/main/examples/email-templates).

- Reader reply in English
- Reader reply in Simplified Chinese
- Backlink approval in English
- Backlink approval in Simplified Chinese

### Waline reply notification

`waline-comment-reply-bilingual.html` is a ready-to-adapt bilingual reply-notification body for Waline. `waline-comment-reply-subject.txt` provides the matching subject line. The template detects `/zh/` in the post URL to select Simplified Chinese; other pages use English.

It preserves the Waline variables for the original commenter, reply author, reply body, and post URL. Replace `[SITE NAME]` and `[站点名称]` with your own public site name, then paste the body and subject into your Waline mail configuration. Do not replace the `self`, `parent`, or `site` variables.

Personal names, private branding, and personal-site URLs have been removed and replaced with bracketed placeholders. Before sending, replace the site name, brand, URLs, recipient name, reply body, and signature.

The HTML can be adapted for Waline mail workflows, manual replies, email automation, or backlink-review notifications. Providers use different HTML and variable conventions, so send a test message and check mobile layout, links, and dark-mode rendering before production use.

## Pre-launch checklist

- Disable `demoMode` before testing real comment submission and notifications
- Copy the backlink form into your own Microsoft account
- Update the form privacy notice and review rules
- Replace every bracketed placeholder in the email templates
- Never commit access tokens, administrator URLs, or mail secrets to a public repository

Once these settings are complete, comments, backlink applications, and email notifications can run through your own services while preserving Liquid Stack's interface and bilingual structure.
