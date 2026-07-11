# 蟹先生 · 笔记 / Mr. Crab — Notes

A bilingual (Chinese/English) personal blog, built with [Astro](https://astro.build).
Content is server-rendered to static HTML; React ships only as small islands for
the search modal and post action rail.

## Structure

| Path | Role |
|---|---|
| `src/pages/index.astro` | Home — editorial layout + tag filter |
| `src/pages/notes/[slug].astro` | One static page per note |
| `src/layouts/Base.astro` | HTML shell, nav, no-flash theme init |
| `src/components/Nav.astro` | Nav bar, search trigger, dark/light toggle |
| `src/components/Card.astro` | Post card |
| `src/components/CrabMark.astro` | Crab logo mark |
| `src/components/Footer.astro` | Footer |
| `src/components/Search.tsx` | Cmd+K search modal (React island) |
| `src/components/PostActions.tsx` | Like / bookmark / share rail (React island) |
| `src/content/notes/*.md` | The notes (frontmatter + bilingual body) |
| `src/content.config.ts` | Content collection schema (Zod) |
| `src/data/tags.ts` | Tag definitions |
| `src/styles/` | Design tokens + surface styles |
| `public/assets/` | SVG logo + per-post illustration assets |
| `tools/mockups/` | HTML→PNG terminal-mockup render toolchain (see below) |

## Develop

```bash
npm install
npm run dev      # http://localhost:4321/
npm run build    # static output → dist/
npm run preview  # preview the built site
```

## Writing a note

Add a markdown file to `src/content/notes/`. The filename becomes the URL slug.

```md
---
date: 2026-06-01
tag: notes          # notes | tea | cooking | walks | craft
readMin: 4
titleCn: "标题"
titleEn: "Title"
dekCn: "一句话简介。"
dekEn: "One-line summary."
hero: "https://…"   # optional; omit for a text card
bodyCn: |
  第一段。

  第二段。
bodyEn: |
  First paragraph.

  Second paragraph.
---
```

## Post illustrations

Terminal-style "screenshots" (e.g. for the Claude Code guide) are hand-built as
HTML/CSS and rendered to 2× PNGs with headless Chrome — fully controllable and
leak-free, no real screen capture. One folder per post under `tools/mockups/<slug>/`,
then `zsh tools/mockups/render.sh <slug>` outputs to `public/assets/<slug>/`.
See [`tools/mockups/README.md`](tools/mockups/README.md) for the full workflow.

## Deploy

Hosted on **Cloudflare Pages** at **[mrcrabai.com](https://mrcrabai.com)**. The
repo is connected to Cloudflare via Git, so every push to `main` builds
(`npm run build` → `dist`) and deploys automatically. The custom domain (apex +
`www`, with `www` → apex 301) and DNS are managed in the Cloudflare account that
owns the zone. **Cloudflare Web Analytics** (a cookie-less in-HTML beacon) is
enabled for privacy-friendly traffic stats.

## AI tooling

`.mcp.json` registers the [Astro Docs MCP server](https://docs.astro.build/en/guides/build-with-ai/)
so Claude Code (CLI and the `@claude` GitHub Action) can reference live Astro docs.
