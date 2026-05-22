# 蟹先生 · 笔记 / Mr. Crab — Notes

A bilingual (Chinese/English) personal blog. Pure HTML/CSS/JS — no build step.

## Structure

| File | Role |
|---|---|
| `index.html` | Entry point |
| `colors_and_type.css` | Design tokens (colors, type scale, spacing) |
| `styles.css` | Layout and component styles |
| `data.js` | Post content and tag definitions |
| `app.jsx` | Root app, routing, search overlay |
| `Nav.jsx` | Navigation bar |
| `Home.jsx` | Three home layouts: Editorial, Minimal, Journal |
| `Post.jsx` | Post reading view |
| `tweaks-panel.jsx` | Floating design tweaks panel |
| `assets/` | SVG logo |

## Running locally

```bash
python3 -m http.server 3456
```

Then open [http://localhost:3456](http://localhost:3456).
