import { useEffect, useMemo, useRef, useState } from 'react';

export interface SearchPost {
  href: string;
  titleCn: string;
  titleEn: string;
  dekCn: string;
  dekEn: string;
  body: string;
  date: string;
  readMin: number;
}

function highlight(text: string, q: string) {
  const needle = q.trim();
  if (!needle) return text;
  const re = new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const m = text.match(re);
  if (!m) return text;
  const idx = m.index ?? 0;
  return (
    <>
      {text.slice(0, idx)}
      <em>{m[0]}</em>
      {text.slice(idx + m[0].length)}
    </>
  );
}

export default function Search({ posts }: { posts: SearchPost[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Open via nav button (custom event) or Cmd/Ctrl+K; close via Esc.
  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('open-search', onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('open-search', onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ('');
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const hits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return posts.slice(0, 6);
    return posts.filter((p) =>
      `${p.titleCn} ${p.titleEn} ${p.dekCn} ${p.dekEn} ${p.body}`
        .toLowerCase()
        .includes(needle)
    );
  }, [q, posts]);

  if (!open) return null;

  return (
    <div className="search-overlay" onClick={() => setOpen(false)}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          placeholder="搜索笔记 · Search notes"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="search-modal__hits">
          {hits.length === 0 && (
            <div className="search-modal__empty">
              没有匹配的笔记。
              <br />
              <em>No notes match.</em>
            </div>
          )}
          {hits.map((p) => (
            <a key={p.href} className="search-modal__hit" href={p.href}>
              <div className="search-modal__hit-title">
                {highlight(p.titleCn, q)} ·{' '}
                <span style={{ color: 'var(--ink-3)' }}>{highlight(p.titleEn, q)}</span>
              </div>
              <div className="search-modal__hit-meta">
                {p.date.replace(/-/g, '.')} · {p.readMin} 分钟
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
