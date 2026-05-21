
import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentPath, setCurrentPath] = useState(() => window.location.hash || '#/');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const onHash   = () => setCurrentPath(window.location.hash || '#/');

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', onHash);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.location.hash = href;
    setIsOpen(false);
  };

  const isActive = (href: string) => currentPath === href;

  const navLinks = [
    { name: 'Home',       href: '#/'           },
    { name: 'About',      href: '#/about'      },
    { name: 'Ministries', href: '#/ministries' },
    { name: 'Sermons',    href: '#/sermons'    },
    { name: 'Events',     href: '#/events'     },
    { name: 'Gallery',    href: '#/gallery'    },
    { name: 'Give',       href: '#/give'       },
    { name: 'Prophetic AI', href: '#/ai-guidance' },
  ];

  return (
    <>
      {/* ── Main Navbar ── */}
      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/98 backdrop-blur-xl shadow-lg shadow-slate-900/6 border-b border-slate-100'
            : 'bg-white/96 backdrop-blur-md shadow-sm border-b border-slate-100/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* ── Logo ── */}
            <a
              href="#/"
              onClick={(e) => navigate(e, '#/')}
              className="flex items-center gap-3 group flex-shrink-0"
              aria-label="Joseph Akowuah Ministries – Home"
            >
              <div className="relative">
                <img
                  src="/images/logo.jpeg"
                  alt="Joseph Akowuah Ministries logo"
                  className="w-11 h-11 rounded-xl object-cover animate-logo"
                />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" aria-hidden="true" />
              </div>
              <div className="flex flex-col leading-none gap-0.5">
                <span className="font-serif text-[15px] font-bold text-slate-900 tracking-tight">
                  Joseph Akowuah
                </span>
                <span className="text-[9px] uppercase tracking-[0.28em] text-amber-600 font-black">
                  Ministries
                </span>
              </div>
            </a>

            {/* ── Desktop navigation ── */}
            <div className="hidden xl:flex items-center gap-0.5">
              {/* Live badge */}
              <a
                href="#/watch-live"
                onClick={(e) => navigate(e, '#/watch-live')}
                className="flex items-center gap-2 text-red-600 px-4 py-2 rounded-lg font-bold text-[11px] uppercase tracking-wider hover:bg-red-50 transition-all mr-2"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-sm shadow-red-500/60" aria-hidden="true" />
                Watch Live
              </a>

              {navLinks.slice(1).map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => navigate(e, link.href)}
                  className={`px-3.5 py-2 rounded-lg font-semibold text-[11px] uppercase tracking-wider transition-all duration-200 ${
                    isActive(link.href)
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </a>
              ))}

              <a
                href="#/contact"
                onClick={(e) => navigate(e, '#/contact')}
                className="ml-3 bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-amber-600 transition-all duration-300 shadow-md hover:shadow-amber-600/30 active:scale-95"
              >
                Prayer Request
              </a>
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="xl:hidden p-2.5 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-slate-50 transition-all"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 xl:hidden"
          onClick={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" aria-hidden="true" />

          {/* Drawer */}
          <div
            className="absolute top-20 left-0 right-0 bg-white shadow-2xl border-t border-slate-100 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Navigation menu"
          >
            <div className="px-4 py-6 space-y-1.5 max-h-[80vh] overflow-y-auto">

              {/* Live link */}
              <a
                href="#/watch-live"
                onClick={(e) => navigate(e, '#/watch-live')}
                className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-600 bg-red-50 rounded-2xl"
              >
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" aria-hidden="true" />
                WATCH LIVE NOW
              </a>

              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => navigate(e, link.href)}
                  className={`flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all ${
                    isActive(link.href)
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-slate-700 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive(link.href) && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </a>
              ))}

              {/* CTA buttons */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <a
                  href="#/contact"
                  onClick={(e) => navigate(e, '#/contact')}
                  className="text-center bg-slate-900 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors"
                >
                  Prayer Request
                </a>
                <a
                  href="#/give"
                  onClick={(e) => navigate(e, '#/give')}
                  className="text-center bg-amber-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-amber-700 transition-colors"
                >
                  Give Online
                </a>
              </div>

              {/* Social links */}
              <div className="pt-2 flex items-center justify-center gap-4 text-slate-400 text-xs font-medium">
                <a
                  href="https://www.facebook.com/AkowuahJosephMinistries"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-600 transition-colors"
                >
                  Facebook
                </a>
                <span>·</span>
                <a
                  href="https://www.tiktok.com/@josephakowuahministries"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-600 transition-colors"
                >
                  TikTok
                </a>
                <span>·</span>
                <a
                  href="https://wa.me/233240171460"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-600 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
