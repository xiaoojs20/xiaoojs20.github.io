---
draft: true
title: Customize Liquid Stack Styles
description: Safely adjust colors, typography, and components so the theme feels like your own.
date: 2026-07-25
slug: customizing-liquid-stack-styles
categories: [Tutorials]
tags: [CSS, Styling, Customization]
---

This guide explains how to adjust Liquid Stack’s visual style without breaking upgrades or responsive layouts.

## Start with configuration

Begin with the title, sidebar subtitle, avatar, and color settings in `hugo.yaml`. Prefer front matter and `data/` files for content changes instead of editing theme source directly.

## Add scoped styles

Site-level styles live in `assets/scss/custom.scss`. Give new components clear class names and avoid broad element overrides, which can unintentionally affect posts, menus, and mobile layouts.

## Preview every change

After changing color, spacing, or type, check the home page, posts, photo wall, launchpad, and dark mode. Finish with a full Hugo build to catch missing resources and template errors.
