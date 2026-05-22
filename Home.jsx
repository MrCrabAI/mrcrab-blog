/* global React, POSTS, TAGS, ArrowRight */
const { useState, useEffect, useMemo, useRef } = React;

// ---------- helpers ----------
function fmtDateCN(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
function fmtDateEN(iso) {
  const d = new Date(iso);
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${M[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}
function fmtDateShort(iso) {
  const d = new Date(iso);
  return `${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}
function fmtYear(iso) {
  const d = new Date(iso);
  return d.getFullYear();
}
function tagLabel(id) {
  const t = TAGS.find((x) => x.id === id);
  return t ? t : { cn: id, en: id };
}

// ---------- Masthead (shared) ----------
function Masthead({ onTag, activeTag }) {
  const counts = useMemo(() => {
    const c = { all: POSTS.length };
    POSTS.forEach((p) => { c[p.tag] = (c[p.tag] || 0) + 1; });
    return c;
  }, []);

  return (
    <header className="masthead wrap">
      <div className="masthead__eyebrow">蟹先生 · 笔记 / NOTES</div>
      <h1 className="masthead__title">
        <span className="t-cn">慢慢写。</span>
        <span className="t-en">Writing, slowly.</span>
      </h1>
      <p className="masthead__sub">
        视频之外，多一个慢一点的地方。每周一篇，关于日常里的小事。<br />
        <em style={{ color: 'var(--ink-3)' }}>A slower place beyond the videos — one short note a week, on small everyday things.</em>
      </p>
      <div className="tags" role="tablist" aria-label="Filter by tag">
        {TAGS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTag === t.id}
            className={'tag-chip' + (activeTag === t.id ? ' is-on' : '')}
            onClick={() => onTag(t.id)}
          >
            <span className="tag-chip__cn">{t.cn}</span>
            <span className="tag-chip__en">{t.en}</span>
            {counts[t.id] != null && <span className="tag-chip__en" style={{ marginLeft: 2 }}>· {counts[t.id]}</span>}
          </button>
        ))}
      </div>
    </header>
  );
}

// ---------- Card ----------
function PostCard({ post, onOpen, big }) {
  return (
    <article className="post-card fade-in" onClick={() => onOpen(post)} data-comment-anchor={`card-${post.id}`}>
      {post.hero ? (
        <div className="post-card__media">
          <img src={post.hero} alt="" loading="lazy" />
        </div>
      ) : (
        <div className="post-card__media is-text">
          <div className="quote">「{post.titleCn}」</div>
        </div>
      )}
      <div className="post-card__body">
        <div className="post-card__meta">
          <span className="post-card__tag">{tagLabel(post.tag).en}</span>
          <span className="dot"></span>
          <span>{fmtDateCN(post.date)}</span>
          <span className="dot"></span>
          <span>{post.readMin} 分钟</span>
        </div>
        <h3 className="post-card__title">
          <span className="t-cn">{post.titleCn}</span>
          <span className="t-en">{post.titleEn}</span>
        </h3>
        <p className="post-card__dek">{post.dekCn}</p>
      </div>
    </article>
  );
}

// ---------- LAYOUT 1: EDITORIAL ----------
function LayoutEditorial({ posts, onOpen }) {
  if (posts.length === 0) return <EmptyState />;
  const [featured, ...rest] = posts;
  const secondary = rest.slice(0, 2);
  const grid = rest.slice(2);

  return (
    <div className="l-editorial wrap">
      <div className="section-head">
        <h2 className="t-h3" style={{ fontWeight: 'var(--w-light)' }}>
          <span className="t-cn" style={{ fontSize: '1.25rem' }}>本周精选 · This week</span>
        </h2>
        <span className="num">EP. {String(POSTS.length - posts.indexOf(featured)).padStart(2, '0')} / {POSTS.length}</span>
      </div>

      {/* Featured */}
      <section className="feat fade-in">
        <div className="feat__hero" onClick={() => onOpen(featured)} data-comment-anchor={`feat-${featured.id}`}>
          {featured.hero ? <img src={featured.hero} alt="" /> : <div style={{ width: '100%', height: '100%', background: 'var(--accent-tint)' }}></div>}
          <div className="protect"></div>
          <span className="feat__hero-tag">最新 · LATEST</span>
        </div>
        <div className="feat__body">
          <div className="feat__meta">
            <span style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 'var(--tr-eyebrow)', fontSize: 'var(--fs-micro)', fontWeight: 'var(--w-medium)' }}>
              {tagLabel(featured.tag).en}
            </span>
            <span className="dot"></span>
            <span>{fmtDateCN(featured.date)}</span>
            <span className="dot"></span>
            <span>{featured.readMin} 分钟阅读</span>
          </div>
          <h3 className="feat__title" onClick={() => onOpen(featured)}>
            <span className="t-cn">{featured.titleCn}</span>
            <span className="t-en">{featured.titleEn}</span>
          </h3>
          <p className="feat__dek">
            {featured.dekCn}
            <span className="en">{featured.dekEn}</span>
          </p>
          <a className="feat__read" href="#" onClick={(e) => { e.preventDefault(); onOpen(featured); }}>
            阅读 · Read <ArrowRight />
          </a>
        </div>
      </section>

      {/* 2-up */}
      {secondary.length > 0 && (
        <>
          <div className="section-head">
            <h2 className="t-h3" style={{ fontWeight: 'var(--w-light)', fontSize: '1.25rem' }}>近期 · Recent</h2>
            <span className="num">{secondary.length + grid.length} 篇 / {posts.length} POSTS</span>
          </div>
          <div className="two-up">
            {secondary.map((p) => <PostCard key={p.id} post={p} onOpen={onOpen} />)}
          </div>
        </>
      )}

      {/* Grid */}
      {grid.length > 0 && (
        <div className="card-grid">
          {grid.map((p) => <PostCard key={p.id} post={p} onOpen={onOpen} />)}
        </div>
      )}
    </div>
  );
}

// ---------- LAYOUT 2: MINIMAL INDEX ----------
function LayoutMinimal({ posts, onOpen }) {
  if (posts.length === 0) return <EmptyState />;
  return (
    <div className="l-minimal wrap">
      {posts.map((p) => (
        <div key={p.id} className="l-minimal__row fade-in" onClick={() => onOpen(p)} data-comment-anchor={`row-${p.id}`}>
          <div className="l-minimal__date">{fmtDateCN(p.date)}</div>
          <h3 className="l-minimal__title">
            <span className="t-cn">{p.titleCn}</span>
            <span className="t-en">{p.titleEn}</span>
          </h3>
          <div className="l-minimal__meta">
            <span className="l-minimal__tag">{tagLabel(p.tag).en}</span>
            <span style={{ color: 'var(--ink-4)' }}>·</span>
            <span>{p.readMin} min</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- LAYOUT 3: JOURNAL ----------
function LayoutJournal({ posts, onOpen }) {
  if (posts.length === 0) return <EmptyState />;

  // group by year-month
  const groups = useMemo(() => {
    const map = new Map();
    posts.forEach((p) => {
      const d = new Date(p.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    });
    return Array.from(map.entries());
  }, [posts]);

  const monthName = (key) => {
    const [y, m] = key.split('-');
    const M = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return `${y}年${parseInt(m, 10)}月 · ${M[parseInt(m, 10) - 1]} ${y}`;
  };

  return (
    <div className="l-journal wrap">
      {groups.map(([key, list]) => (
        <section key={key}>
          <div className="l-journal__month">
            <span>{monthName(key)}</span>
            <span className="cnt">{list.length} 篇</span>
          </div>
          <div className="l-journal__group">
            {list.map((p) => (
              <article key={p.id} className="l-journal__entry fade-in" onClick={() => onOpen(p)} data-comment-anchor={`journal-${p.id}`}>
                <div className="l-journal__date">
                  <span>{fmtDateShort(p.date)}</span>
                  <span className="dot"></span>
                  <span className="tag">{tagLabel(p.tag).en}</span>
                  <span className="dot"></span>
                  <span>{p.readMin} 分钟</span>
                </div>
                <h3 className="l-journal__title">
                  <span className="t-cn">{p.titleCn}</span>
                  <span className="t-en">{p.titleEn}</span>
                </h3>
                <p className="l-journal__dek">
                  {p.dekCn}
                  <span className="en">{p.dekEn}</span>
                </p>
                {p.hero && (
                  <div className="l-journal__hero">
                    <img src={p.hero} alt="" loading="lazy" />
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="wrap" style={{ padding: 'var(--s-9) 0', textAlign: 'center', color: 'var(--ink-3)' }}>
      <p style={{ fontSize: 'var(--fs-h4)', fontWeight: 'var(--w-light)' }}>这个标签下还没有笔记。</p>
      <p style={{ fontSize: 'var(--fs-body-sm)', fontStyle: 'italic' }}>No notes under this tag yet.</p>
    </div>
  );
}

// ---------- Home shell ----------
function Home({ layout, onOpen }) {
  const [activeTag, setActiveTag] = useState('all');

  const visible = useMemo(() => {
    if (activeTag === 'all') return POSTS;
    return POSTS.filter((p) => p.tag === activeTag);
  }, [activeTag]);

  // re-init fade-ins on layout / filter change
  const layoutKey = `${layout}-${activeTag}`;
  useScrollIn([layoutKey]);

  return (
    <main className="page" data-screen-label="01 Home">
      <Masthead onTag={setActiveTag} activeTag={activeTag} />
      {layout === 'minimal' && <LayoutMinimal posts={visible} onOpen={onOpen} />}
      {layout === 'journal' && <LayoutJournal posts={visible} onOpen={onOpen} />}
      {(!layout || layout === 'editorial') && <LayoutEditorial posts={visible} onOpen={onOpen} />}
      <AboutStrip />
      <Footer />
    </main>
  );
}

// ---------- Scroll-in hook ----------
function useScrollIn(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.fade-in');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '-40px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ---------- About strip ----------
function AboutStrip() {
  return (
    <section className="about wrap" data-comment-anchor="about-strip">
      <img className="about__mark crab-mark" src="assets/mr_crab_mark.svg" alt="" />
      <div className="about__inner">
        <div className="about__eyebrow">关于 · About</div>
        <h2 className="about__lede">
          <span className="t-cn">我叫蟹先生，<br/>我拍我看到的小事。</span>
          <span className="t-en">I'm Mr. Crab. I film small things I notice.</span>
        </h2>
        <div className="about__body">
          <p>这个频道没有什么宏大的主题。一杯茶、一场雨、一段安静的早晨——如果其中有什么打动了我，我就把它记下来。</p>
          <p style={{ fontStyle: 'italic', color: 'var(--ink-3)' }}>
            This channel doesn't chase big subjects. A cup of tea, an hour of rain, a quiet morning — if something stops me, I write it down. Then I film it, slowly.
          </p>
        </div>
        <div className="about__sig">
          <img src="assets/mr_crab_mark.svg" alt="" className="crab-mark" />
          <span>— 蟹先生 · Mr. Crab</span>
        </div>
      </div>
    </section>
  );
}

// ---------- Footer ----------
function Footer() {
  return (
    <footer className="foot wrap">
      <div className="foot__brand">
        <img src="assets/mr_crab_mark.svg" alt="" className="crab-mark" />
        <span>© 蟹先生工作室 · Mr. Crab Studio · 2026</span>
      </div>
      <div className="foot__links">
        <a href="#">RSS</a>
        <a href="#">邮箱订阅 · Email</a>
        <a href="https://www.youtube.com" target="_blank" rel="noreferrer">YouTube ↗</a>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Home, AboutStrip, Footer, PostCard,
  fmtDateCN, fmtDateEN, fmtDateShort, fmtYear, tagLabel, useScrollIn,
});
