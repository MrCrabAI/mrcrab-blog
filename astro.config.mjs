// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// GitHub Pages project site: https://MrCrabAI.github.io/mrcrab-blog/
// If you move to a custom domain, set `site` to it and remove `base`.
export default defineConfig({
  site: 'https://MrCrabAI.github.io',
  base: '/mrcrab-blog',
  integrations: [react()],
});
