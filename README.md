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

## Deploy

Hosted on **Cloudflare Pages** at **[mrcrabai.com](https://mrcrabai.com)**. The
repo is connected to Cloudflare via Git, so every push to `main` builds
(`npm run build` → `dist`) and deploys automatically. The custom domain (apex +
`www`) and DNS are managed in the Cloudflare account that owns the zone.

Cloudflare Web Analytics is enabled for the zone with automatic injection, so the
beacon script is added at the edge and appears in no source file and in no build
output. Injection fails **silently** — no error, the data just stops — if the DNS
record is set to DNS-only (the edge no longer sees the response) or if the HTML is
served with `Cache-Control: no-transform` (which forbids the edge from rewriting
the body). So if a `_headers` file is ever added, scope `no-transform` to static
assets only (`/assets/*`), never to `/*`. Verify the beacon is live against the
production response, not the source:

```bash
curl -s https://mrcrabai.com | grep -c cloudflareinsights   # 0 = not injected
```

The blog lives at the apex on purpose: the apex is the identity, and subdomains
are for projects (`aimoneymap.mrcrabai.com`). The home page doubles as the
personal landing page — `About` is an anchor on it, not a route. Moving the blog
to `blog.` would demote the only thing the domain currently says, and would cost
a permanent redirect table plus a fresh start on search authority, since Google
treats a subdomain as a separate host.

## AI tooling

`.mcp.json` registers the [Astro Docs MCP server](https://docs.astro.build/en/guides/build-with-ai/)
so Claude Code (CLI and the `@claude` GitHub Action) can reference live Astro docs.
