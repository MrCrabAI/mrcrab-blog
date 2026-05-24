// Join Astro's configured base path with an app path. The base is currently
// "/" (served at the domain root), but routing every internal href and asset
// src through here keeps things correct if a sub-path base is ever set.
const BASE = import.meta.env.BASE_URL;

export function withBase(path: string): string {
  const b = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}
