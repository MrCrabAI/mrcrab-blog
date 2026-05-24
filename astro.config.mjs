// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Deployed to Netlify, served at the domain root (default base "/").
export default defineConfig({
  integrations: [react()],
});
