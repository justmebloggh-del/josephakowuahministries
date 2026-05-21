
import React, { useState, useEffect, useRef } from 'react';

const categories = ['All', 'Prophetic', 'Prayer', 'Healing', 'Deliverance', 'Teaching'];

const sermons = [
  {
    id: '1',
    title: 'Miracle Services',
    category: 'Healing',
    thumbnail: '/images/audit.jpg',
    description: 'Experience total liberation as Apostle Joseph teaches on overcoming systemic barriers and unlocking miracle territory.',
    date: 'April 2025',
    duration: '1h 20m',
    featured: true,
  },
  {
    id: '2',
    title: 'Prophetic Teachings',
    category: 'Prophetic',
    thumbnail: '/images/founder4.jpg',
    description: 'Walk in the prophetic dimension and hear God\'s voice clearly in every situation of life.',
    date: 'March 2025',
    duration: '58m',
    featured: false,
  },
  {
    id: '3',
    title: 'All-Night Prayers',
    category: 'Prayer',
    thumbnail: '/images/midnight-prayers.png',
    description: 'A powerful session of intercession and warfare prayer that transformed thousands of lives in one night.',
    date: 'February 2025',
    duration: '3h 15m',
    featured: false,
  },
  {
    id: '4',
    title: 'Breaking Chains',
    category: 'Deliverance',
    thumbnail: '/images/Breaking-chains-in-fiery-explosion.png',
    description: 'Total spiritual freedom — Apostle Joseph leads a powerful deliverance session at the BBC altar.',
    date: 'January 2025',
    duration: '1h 45m',
    featured: false,
  },
  {
    id: '5',
    title: 'Evangelism Crusade',
    category: 'Teaching',
    thumbnail: '/images/bbcevangelismapstle.jpg',
    description: 'A great harvest of souls during our community outreach crusade. The Gospel is for everyone.',
    date: 'December 2024',
    duration: '2h 5m',
    featured: false,
  },
  {
    id: '6',
    title: 'Blood of Jesus Service',
    category: 'Prayer',
    thumbnail: '/images/bbcprayer.jpg',
    description: 'The mid-week altar on fire — pleading the blood of Jesus for protection, healing, and breakthrough.',
    date: 'November 2024',
    duration: '1h 30m',
    featured: false,
  },
  {
    id: '7',
    title: 'Jericho Prayer Session',
    category: 'Prayer',
    thumbnail: '/images/conse1.jpg',
    description: 'Thursday Jericho prayers: marching around the walls of every obstacle until they fall.',
    date: 'October 2024',
    duration: '2h 30m',
    featured: false,
  },
  {
    id: '8',
    title: 'Consecration Service',
    category: 'Teaching',
    thumbnail: '/images/consecration.jpg',
    description: 'Setting ourselves apart for God\'s purpose. A deep teaching on holiness and divine consecration.',
    date: 'September 2024',
    duration: '1h 10m',
    featured: false,
  },
  {
    id: '9',
    title: 'Seed Time and Harvest',
    category: 'Teaching',
    thumbnail: '/images/seedtimharvestime.jpg',
    description: 'Biblical principles of sowing and reaping — your giving season is the key to your next harvest.',
    date: 'August 2024',
    duration: '55m',
    featured: false,
  },
];

const Sermons: React.FC = () => {
  const [search,       setSearch]       = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(
      (el) => observerRef.current?.observe(el)
    );
    return () => observerRef.current?.disconnect();
  }, [visibleCount]);

  const filtered = sermons.filter((s) => {
    const matchesSearch   = s.title.toLowerCase().includes(search.toLowerCase()) ||
                            s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const navigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.location.hash = href;
  };

  return (
    <div className="bg-slate-50 min-h-screen animate-fadeIn">

      {/* ── Hero header ── */}
      <section className="bg-slate-900 py-28 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/bbcprayer.jpg" alt="" aria-hidden="true" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/60" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-amber-500 font-black uppercase tracking-[0.35em] text-xs mb-4 block">
            The Word That Transforms
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Sermon <span className="text-gold-gradient">Archives</span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-lg font-light leading-relaxed">
            Life-changing messages and prophetic words delivered by Apostle Joseph Akwasi Akowuah.
            Faith comes by hearing.
          </p>
        </div>
      </section>

      {/* ── Search & filter bar ── */}
      <section className="bg-white border-b border-slate-100 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">

            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-sm">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sermons…"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                aria-label="Search sermons"
              />
            </div>

            {/* Category pills */}
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                      : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured sermon (first result if featured) ── */}
      {activeCategory === 'All' && search === '' && (
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8 reveal">
              <span className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
              <span className="text-amber-600 font-black text-xs uppercase tracking-widest">
                Featured Message
              </span>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-center reveal">
              {/* Video embed placeholder */}
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-slate-800 group">
                <img
                  src={sermons[0].thumbnail}
                  alt={sermons[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <a
                    href="https://www.facebook.com/AkowuahJosephMinistries"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform"
                    aria-label="Watch featured sermon"
                  >
                    <svg className="w-9 h-9 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                  </a>
                </div>
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  Featured
                </div>
              </div>

              <div>
                <span className="text-amber-600 text-xs font-black uppercase tracking-widest">
                  {sermons[0].category}  ·  {sermons[0].date}  ·  {sermons[0].duration}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-5">
                  {sermons[0].title}
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  {sermons[0].description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://www.facebook.com/AkowuahJosephMinistries"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-amber-500 transition-all shadow-lg hover:shadow-amber-600/30 active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                    Watch on Facebook
                  </a>
                  <a
                    href="#/watch-live"
                    onClick={(e) => navigate(e, '#/watch-live')}
                    className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-8 py-3.5 rounded-full font-bold hover:bg-slate-50 transition-all active:scale-95"
                  >
                    Watch Live
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Sermon grid ── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-slate-400 text-lg mb-2">No sermons found.</p>
              <button
                onClick={() => { setSearch(''); setActiveCategory('All'); }}
                className="text-amber-600 font-bold text-sm hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.slice(0, visibleCount).map((sermon, i) => (
                  <div
                    key={sermon.id}
                    className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group card-lift reveal"
                    style={{ transitionDelay: `${(i % 3) * 80}ms` }}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-52 bg-slate-200 overflow-hidden">
                      <img
                        src={sermon.thumbnail}
                        alt={sermon.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-amber-600 shadow-lg">
                          <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                          </svg>
                        </div>
                      </div>
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-slate-900/80 text-amber-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm">
                          {sermon.category}
                        </span>
                      </div>
                      {/* Duration badge */}
                      <div className="absolute bottom-3 right-3">
                        <span className="bg-black/60 text-white text-[9px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                          {sermon.duration}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-7">
                      <span className="text-amber-600 font-bold text-[10px] uppercase tracking-widest">
                        {sermon.date}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-1.5 mb-3">{sermon.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                        {sermon.description}
                      </p>
                      <a
                        href="https://www.facebook.com/AkowuahJosephMinistries"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 font-bold text-sm flex items-center gap-1.5 hover:gap-3 transition-all duration-200 group"
                      >
                        Watch Message
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load more */}
              {visibleCount < filtered.length && (
                <div className="text-center mt-12 reveal">
                  <button
                    onClick={() => setVisibleCount((c) => c + 6)}
                    className="bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-amber-600 transition-all shadow-lg active:scale-95"
                  >
                    Load More Messages
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── Facebook CTA ── */}
      <section className="py-20 bg-slate-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/images/founder.jpg" alt="" aria-hidden="true" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4 reveal">
          <h2 className="text-3xl font-bold text-white mb-4">Watch Live Every Sunday</h2>
          <p className="text-slate-400 mb-8 text-lg">
            8:00 AM GMT — Tune in for the Grace Hour Service and experience the miracle altar from anywhere in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.facebook.com/AkowuahJosephMinistries/live"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-500 transition-all shadow-xl hover:scale-[1.02] active:scale-95"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.383 14.444 5 15.333 5H18V0h-3.333C11.333 0 9 2.333 9 5.333V8z" />
              </svg>
              Watch on Facebook
            </a>
            <a
              href="#/watch-live"
              onClick={(e) => navigate(e, '#/watch-live')}
              className="inline-flex items-center justify-center gap-2 glass text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Live Stream Page
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sermons;
