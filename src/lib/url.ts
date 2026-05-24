// Join Astro's configured base path (e.g. "/mrcrab-blog") with an app path.
// Use for every internal href and asset src so links work on GitHub Pages
// (served under a sub-path) and on a custom domain (served at root) alike.
const BASE = import.meta.env.BASE_URL;

export function withBase(path: string): string {
  const b = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}
