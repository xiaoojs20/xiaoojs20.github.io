---
draft: true
title: "Quick Start: Deploy Liquid Stack"
description: The shortest path from a copied theme to a published first page.
date: 2026-07-20
slug: quick-start-deploying-liquid-stack
categories: [Tutorials]
tags: [Hugo, Cloudflare Pages, Deployment]
---

This guide shows how to use Liquid Stack as the starting point for your own site and publish a first version.

## Copy the project

Use GitHub’s template flow or copy this repository. Then edit the title, subtitle, avatar path, and GitHub links in `hugo.yaml`. Do not edit `public/` or `resources/`; Hugo regenerates them during a build.

## Preview locally

Install Hugo Extended and run `hugo server -D` from the project root. Open the local address shown in the terminal. Markdown, configuration, and style changes refresh automatically.

## Check before publishing

Run `hugo --minify --cleanDestinationDir --ignoreCache`. Confirm that the home page, posts, photo wall, launchpad, and admin page open correctly before pushing source files to your repository. The generated `public/` directory can be published to Cloudflare Pages or another static host.

## Next step

Replace the sample values in `hugo.yaml`, then write your first post. The launchpad, photo wall, links, and comment configuration are all kept for you to adapt.
