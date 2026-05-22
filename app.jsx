/* global React, ReactDOM, POSTS, Nav, Home, Post,
   TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakColor, TweakSelect */
const { useState, useEffect, useMemo, useRef } = React;

// Default tweak values — wrapped in EDITMODE markers so host can rewrite them
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "layout": "editorial",
  "theme": "auto",
  "accent": "#C8553D",
  "density": "regular"
}/*EDITMODE-END*/;

const LAYOUT_LABELS = {
  editorial: '编辑式',
  minimal: '极简清单',
  journal: '日志',
};

const ACCENT_PRESETS = [
  '#C8553D', // brick coral (default)
  '#1D1D1F', // mono ink
  '#3A7D6E', // mossy green
  '#4A5BB8', // dusty indigo
  '#B07B3C', // amber
];

function App() {
  const [route, setRoute] = useState({ name: 'home' }); // { name: 'home' } | { name: 'post', id: 'p09' }
  const [search, setSearch] = useState({ open: false, q: '' });
  const [toast, setToast] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // toast timer
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  // nav scrolled shadow
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', f, { passive: true });
    f();
    return () => window.removeEventListener('scroll', f);
  }, []);

  // apply theme + density + accent to <html>
  useEffect(() => {
    const html = document.documentElement;
    if (tweaks.theme && tweaks.theme !== 'auto') html.setAttribute('data-theme', tweaks.theme);
    else html.removeAttribute('data-theme');
    html.setAttribute('data-density', tweaks.density || 'regular');
    if (tweaks.accent) {
      html.style.setProperty('--accent', tweaks.accent);
      // simple darker variant for hover
      html.style.setProperty('--accent-hover', shade(tweaks.accent, -10));
      html.style.setProperty('--accent-pressed', shade(tweaks.accent, -20));
      html.style.setProperty('--accent-tint', toRgba(tweaks.accent, 0.08));
    }
  }, [tweaks.theme, tweaks.density, tweaks.accent]);

  // Cmd+K to open search, Esc to close
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearch((s) => ({ ...s, open: !s.open }));
      } else if (e.key === 'Escape') {
        setSearch((s) => ({ ...s, open: false }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Navigation
  const goHome = () => { setRoute({ name: 'home' }); window.scrollTo({ top: 0 }); };
  const goPost = (post) => { setRoute({ name: 'post', id: post.id }); window.scrollTo({ top: 0 }); };
  const onNav = (id) => {
    if (id === 'home') goHome();
    else if (id === 'about') {
      goHome();
      setTimeout(() => {
        const el = document.querySelector('.about');
        if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' });
      }, 30);
    }
  };

  // Resolve current post
  const currentPost = route.name === 'post' ? POSTS.find((p) => p.id === route.id) : null;

  return (
    <>
      <Nav
        active={route.name === 'home' ? 'home' : 'post'}
        onNav={onNav}
        onSearch={() => setSearch({ open: true, q: '' })}
        scrolled={scrolled}
      />

      {route.name === 'home' && (
        <Home layout={tweaks.layout} onOpen={goPost} />
      )}

      {route.name === 'post' && currentPost && (
        <Post
          post={currentPost}
          onBack={goHome}
          onOpen={goPost}
          onToast={setToast}
        />
      )}

      {search.open && (
        <SearchOverlay
          q={search.q}
          onChange={(q) => setSearch({ open: true, q })}
          onClose={() => setSearch({ open: false, q: '' })}
          onSelect={(p) => { setSearch({ open: false, q: '' }); goPost(p); }}
        />
      )}

      <TweaksPanel title="Tweaks">
          <TweakSection label="Layout · 排版">
            <TweakRadio
              label="Home view"
              value={tweaks.layout}
              onChange={(v) => setTweak('layout', v)}
              options={[
                { value: 'editorial', label: 'Editorial' },
                { value: 'minimal',   label: 'Minimal' },
                { value: 'journal',   label: 'Journal' },
              ]}
            />
            <TweakSelect
              label="Density"
              value={tweaks.density}
              onChange={(v) => setTweak('density', v)}
              options={[
                { value: 'cosy',    label: 'Cosy · 紧凑' },
                { value: 'regular', label: 'Regular · 常规' },
                { value: 'roomy',   label: 'Roomy · 宽松' },
              ]}
            />
          </TweakSection>

          <TweakSection label="Theme · 主题">
            <TweakRadio
              label="Mode"
              value={tweaks.theme}
              onChange={(v) => setTweak('theme', v)}
              options={[
                { value: 'auto',  label: 'Auto' },
                { value: 'light', label: 'Light' },
                { value: 'dark',  label: 'Dark' },
              ]}
            />
            <TweakColor
              label="Accent"
              value={tweaks.accent}
              onChange={(v) => setTweak('accent', v)}
              options={ACCENT_PRESETS}
            />
          </TweakSection>
        </TweaksPanel>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

// ---------- Search overlay ----------
function SearchOverlay({ q, onChange, onClose, onSelect }) {
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);

  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return POSTS.slice(0, 6);
    return POSTS.filter((p) => {
      const hay = (p.titleCn + ' ' + p.titleEn + ' ' + p.dekCn + ' ' + p.dekEn + ' ' + p.bodyCn + ' ' + p.bodyEn).toLowerCase();
      return hay.includes(needle);
    });
  }, [q]);

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          placeholder="搜索笔记 · Search notes"
          value={q}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="search-modal__hits">
          {hits.length === 0 && (
            <div className="search-modal__empty">
              没有匹配的笔记。<br />
              <em>No notes match.</em>
            </div>
          )}
          {hits.map((p) => (
            <a key={p.id} className="search-modal__hit" onClick={() => onSelect(p)}>
              <div className="search-modal__hit-title">{highlight(p.titleCn, q)} · <span style={{ color: 'var(--ink-3)' }}>{highlight(p.titleEn, q)}</span></div>
              <div className="search-modal__hit-meta">{p.date.replace(/-/g, '.')} · {p.readMin} 分钟</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function highlight(text, q) {
  const needle = q.trim();
  if (!needle) return text;
  const re = new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const m = text.match(re);
  if (!m) return text;
  const idx = m.index;
  return (
    <>
      {text.slice(0, idx)}
      <em>{m[0]}</em>
      {text.slice(idx + m[0].length)}
    </>
  );
}

// ---------- Color utils ----------
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function toRgba(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}
function shade(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + (percent / 100) * 255)));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
