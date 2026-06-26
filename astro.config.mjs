// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Deployed to Cloudflare Pages, served at the domain root (default base "/").
export default defineConfig({
  site: 'https://mrcrabai.com',
  integrations: [react()],
});
