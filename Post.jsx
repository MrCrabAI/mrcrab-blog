/* global React, POSTS, ArrowLeft, ArrowRight, BookmarkIcon, HeartIcon, ShareIcon,
   tagLabel, fmtDateCN, fmtDateEN, useScrollIn */
const { useState, useEffect, useRef } = React;

function Post({ post, onBack, onOpen, onToast }) {
  const [progress, setProgress] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(() => 80 + Math.floor(Math.random() * 200));
  const articleRef = useRef(null);

  // scroll-to-top on mount
  useEffect(() => { window.scrollTo({ top: 0 }); }, [post.id]);

  // progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const passed = Math.min(Math.max(-r.top, 0), total);
      const p = total > 0 ? (passed / total) * 100 : 0;
      setProgress(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [post.id]);

  useScrollIn([post.id]);

  const idx = POSTS.findIndex((p) => p.id === post.id);
  const nextPost = POSTS[idx + 1] || POSTS[0];

  const cnParas = post.bodyCn.split('\n\n');
  const enParas = post.bodyEn.split('\n\n');

  // place pull-quote between 1st and 2nd CN paragraph if present
  const pullQuote = cnParas.length >= 2 ? cnParas[0].split('。')[0] + '。' : null;

  const handleBookmark = () => {
    setBookmarked((b) => {
      onToast && onToast(b ? '已移除收藏 · Removed' : '已收藏 · Saved');
      return !b;
    });
  };
  const handleLike = () => {
    setLiked((l) => {
      setLikeCount((c) => c + (l ? -1 : 1));
      return !l;
    });
  };
  const handleShare = () => {
    onToast && onToast('链接已复制 · Link copied');
  };

  return (
    <main className="page" data-screen-label={`02 Post · ${post.titleEn}`}>
      <div className="post-progress"><div className="post-progress__bar" style={{ width: progress + '%' }}></div></div>

      <button className="post-back" onClick={onBack} aria-label="Back to all notes">
        <ArrowLeft />
      </button>

      <article className="post-article" ref={articleRef} data-comment-anchor={`article-${post.id}`}>
        <div className="post-article__eyebrow">
          <span className="tag">{tagLabel(post.tag).cn} · {tagLabel(post.tag).en}</span>
          <span className="dot"></span>
          <span>{fmtDateCN(post.date)}</span>
          <span className="dot"></span>
          <span>{post.readMin} 分钟阅读 · {post.readMin} min read</span>
        </div>

        <h1 className="post-article__title">
          <span className="t-cn">{post.titleCn}</span>
          <span className="t-en">{post.titleEn}</span>
        </h1>

        <p className="post-article__dek">
          {post.dekCn}
          <span className="en">{post.dekEn}</span>
        </p>

        <div className="post-article__byline">
          <img src="assets/mr_crab_mark.svg" alt="" className="crab-mark" />
          <div className="post-article__byline-text">
            <span className="name">蟹先生 · Mr. Crab</span>
            <span className="meta">{fmtDateEN(post.date)}</span>
          </div>
          <div className="post-article__byline-spacer"></div>
          <button className="post-action with-label" onClick={handleBookmark} aria-pressed={bookmarked}>
            <span className={bookmarked ? 'is-on' : ''} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <BookmarkIcon />
              <span>{bookmarked ? '已收藏' : '收藏'}</span>
            </span>
          </button>
        </div>

        {post.hero && (
          <div className="post-article__hero">
            <img src={post.hero} alt="" />
          </div>
        )}

        <div className="post-article__body">
          <div className="lang-cn">
            {cnParas.map((p, i) => (
              <React.Fragment key={i}>
                <p>{p}</p>
                {i === 0 && pullQuote && cnParas.length > 2 && (
                  <blockquote className="post-article__pullquote">{pullQuote}</blockquote>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="lang-en">
            {enParas.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>

        {/* Action rail */}
        <div className="post-actions__wrap">
          <div className="post-actions">
            <button
              className={'post-action with-label' + (liked ? ' is-on' : '')}
              onClick={handleLike}
              aria-pressed={liked}
              aria-label="Like this post"
            >
              <HeartIcon />
              <span>{likeCount}</span>
            </button>
            <button
              className={'post-action' + (bookmarked ? ' is-on' : '')}
              onClick={handleBookmark}
              aria-pressed={bookmarked}
              aria-label="Bookmark"
            >
              <BookmarkIcon />
            </button>
            <button className="post-action" onClick={handleShare} aria-label="Share">
              <ShareIcon />
            </button>
          </div>
        </div>
      </article>

      {nextPost && (
        <section className="post-next">
          <div className="post-next__head">下一篇 · Read next</div>
          <div className="post-next__card" onClick={() => onOpen(nextPost)}>
            <div>
              <h3 className="post-next__card-title">
                <span className="t-cn">{nextPost.titleCn}</span>
                <span className="t-en">{nextPost.titleEn}</span>
              </h3>
              <div className="post-next__card-meta">
                {tagLabel(nextPost.tag).en} · {fmtDateCN(nextPost.date)} · {nextPost.readMin} 分钟
              </div>
            </div>
            <div className="post-next__arrow"><ArrowRight size={20} /></div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

Object.assign(window, { Post });
