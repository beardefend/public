# BearDefend (Hugo)

A production-ready Hugo site for BearDefend with:

- **Tutorials**, **News**, **Products**
- Clean URLs (configurable via `hugo.toml` permalinks)
- Pagination built-in (fast + SEO-friendly)
- Lightweight **client-side search** across all posts/products
- GitHub Pages deployment via **GitHub Actions** (auto on push)
- Downloads served from `static/downloads/`
- Thumbnails enforced on all listing cards (fallback included)

## Run locally
Install Hugo Extended.

```bash
hugo server -D
```
Open: http://localhost:1313

## Add content
- Tutorials: `content/tutorials/*.md`
- News: `content/news/*.md`
- Products: `content/products/*.md`

Front matter example:
```yaml
---
title: "My Post"
date: "2026-02-14"
description: "Short summary"
tags: ["tag1","tag2"]
thumbnail: "/assets/posts/my-post/thumbnail.png"
---
```

### Products: CTA controls
```yaml
downloadUrl: "/downloads/my-tool.zip"
whatsapp: true
whatsappOnly: false
```

## Downloads
Put files in `static/downloads/`.
They will be available at `/downloads/<filename>`.

## Deploy to GitHub Pages
1. GitHub → **Settings → Pages**
2. Source: **GitHub Actions**
3. Push commits to `main` (or `master`) — Actions builds & deploys automatically.

## Custom domain
1. GitHub: Settings → Pages → Custom domain
2. Add DNS records at registrar
3. Enable “Enforce HTTPS”

Hugo `baseURL` is configured in `hugo.toml` (set to `https://beardefend.com/`).

## Recommended content + images workflow (optimized)
For best performance, place images **in the same folder as the markdown** so Hugo can treat them as **Page Resources** and generate optimized versions.

Example page bundle:
```
content/tutorials/my-post/
  index.md
  thumbnail.webp   # or thumbnail.jpg/png
  figure-1.png
```

The theme will automatically pick up `thumbnail.*` from the bundle and generate optimized sizes via Hugo Pipes.
