/* global React */
const { useEffect, useState } = React;

function Nav({ active, onNav, onSearch, scrolled }) {
  return (
    <nav className={'nav' + (scrolled ? ' is-scrolled' : '')}>
      <div className="nav__inner">
        <a className="nav__brand" href="#" onClick={(e) => { e.preventDefault(); onNav('home'); }}>
          <img src="assets/mr_crab_mark.svg" alt="" className="crab-mark" />
          <span>蟹先生</span>
          <span className="nav__brand-sub">· 笔记</span>
        </a>
        <div className="nav__links">
          <a href="#" className={active === 'home' ? 'is-active' : ''}
             onClick={(e) => { e.preventDefault(); onNav('home'); }}>
            笔记 · Notes
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); onNav('about'); }}>
            关于 · About
          </a>
          <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
            视频 · Videos ↗
          </a>
        </div>
        <div className="nav__right">
          <button className="nav__search" onClick={onSearch}>
            <SearchIcon />
            <span>搜索</span>
            <kbd>⌘K</kbd>
          </button>
        </div>
      </div>
    </nav>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7"></circle>
      <path d="m20 20-3.5-3.5"></path>
    </svg>
  );
}

function ArrowRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14"></path><path d="m13 5 7 7-7 7"></path>
    </svg>
  );
}

function ArrowLeft({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5"></path><path d="m12 19-7-7 7-7"></path>
    </svg>
  );
}

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

Object.assign(window, { Nav, SearchIcon, ArrowRight, ArrowLeft, BookmarkIcon, HeartIcon, ShareIcon });
