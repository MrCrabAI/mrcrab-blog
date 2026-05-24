// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// This site deploys to two targets that disagree on the base path:
//   • GitHub Pages (project site) is served under /mrcrab-blog/
//   • Netlify (and `npm run dev`) is served at the domain root
// The GH Pages CI build sets GITHUB_PAGES=true (see deploy.yml); every other
// build — Netlify, local dev — uses the root base. withBase() reads
// import.meta.env.BASE_URL so all links/assets follow automatically.
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: isGitHubPages ? 'https://MrCrabAI.github.io' : undefined,
  base: isGitHubPages ? '/mrcrab-blog' : undefined,
  integrations: [react()],
});
