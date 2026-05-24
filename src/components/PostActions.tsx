import { useEffect, useState } from 'react';

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"></path>
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
      <polyline points="16 6 12 2 8 6"></polyline>
      <line x1="12" y1="2" x2="12" y2="15"></line>
    </svg>
  );
}

export default function PostActions() {
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(() => 80 + Math.floor(Math.random() * 200));
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleLike = () => {
    setLiked((l) => {
      setLikeCount((c) => c + (l ? -1 : 1));
      return !l;
    });
  };
  const handleBookmark = () => {
    setBookmarked((b) => {
      setToast(b ? '已移除收藏 · Removed' : '已收藏 · Saved');
      return !b;
    });
  };
  const handleShare = () => {
    try {
      navigator.clipboard?.writeText(window.location.href);
    } catch (e) {}
    setToast('链接已复制 · Link copied');
  };

  return (
    <>
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
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
