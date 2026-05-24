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
| `src/components/Footer.astro` | Footer |
| `src/components/Search.tsx` | Cmd+K search modal (React island) |
| `src/components/PostActions.tsx` | Like / bookmark / share rail (React island) |
| `src/content/notes/*.md` | The notes (frontmatter + bilingual body) |
| `src/content.config.ts` | Content collection schema (Zod) |
| `src/data/tags.ts` | Tag definitions |
| `src/styles/` | Design tokens + surface styles |
| `public/assets/` | SVG logo |

## Develop

```bash
npm install
npm run dev      # http://localhost:4321/mrcrab-blog/
npm run build    # static output → dist/
npm run preview  # preview the built site
```

> The site is served under the `/mrcrab-blog` base path (see `astro.config.mjs`)
> because it deploys to a GitHub Pages project site. For a custom domain, set
> `site` to the domain and remove `base`.

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

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
`withastro/action` and publishes to GitHub Pages. Enable Pages → Source:
**GitHub Actions** in repo settings once.

## AI tooling

`.mcp.json` registers the [Astro Docs MCP server](https://docs.astro.build/en/guides/build-with-ai/)
so Claude Code (CLI and the `@claude` GitHub Action) can reference live Astro docs.
