---
title: Security Headers Checklist for Production
date: '2026-02-04'
description: "A practical, copy-paste friendly guide to CSP, HSTS, XFO, and other\
  \ headers \u2014 with safe starting values."
tags:
- web
- headers
- csp
thumbnail: /assets/posts/security-headers-checklist/thumbnail.png
---

Security headers help browsers enforce your intent.

## Recommended starting set
- Content-Security-Policy (start in Report-Only)
- Strict-Transport-Security
- X-Content-Type-Options: nosniff
- Referrer-Policy

## CSP rollout tip
Start with `Content-Security-Policy-Report-Only` and iterate.
