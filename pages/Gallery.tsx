
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  getToken, getPageId, clearFBCache, getCacheAge,
  fetchAlbums, fetchLatestPhotos, fetchAlbumPhotos,
  getLargeImage, getMediumImage, RateLimitError,
  FBAlbum, FBPhoto,
} from '../services/facebookService';

/* ─── Local fallback images ─────────────────────────────────── */

const LOCAL_IMAGES = [
  { id: 'l1',  url: '/images/bbc1.jpg',                title: 'Sunday Service',          album: 'Church Services' },
  { id: 'l2',  url: '/images/bbc2.jpg',                title: 'Congregation in Worship', album: 'Church Services' },
  { id: 'l3',  url: '/images/bbc3.jpg',                title: 'Ministry in Action',      album: 'Church Services' },
  { id: 'l4',  url: '/images/bbc4.jpg',                title: 'The Altar',               album: 'Church Services' },
  { id: 'l5',  url: '/images/bbc5.jpg',                title: 'Power in the Sanctuary',  album: 'Church Services' },
  { id: 'l6',  url: '/images/bbc6.jpg',                title: 'Grace Hour',              album: 'Church Services' },
  { id: 'l7',  url: '/images/bbc7.jpg',                title: 'BBC International',       album: 'Church Services' },
  { id: 'l8',  url: '/images/bbc8.jpg',                title: 'The Move of God',         album: 'Church Services' },
  { id: 'l9',  url: '/images/bbc9.jpg',                title: 'Holy Spirit in Action',   album: 'Church Services' },
  { id: 'l10', url: '/images/bbc10.jpg',               title: 'Sunday Glory',            album: 'Church Services' },
  { id: 'l11', url: '/images/bbcprayer.jpg',           title: 'Prayer Meeting',          album: 'Special Events'  },
  { id: 'l12', url: '/images/midnight-prayers.png',    title: 'All-Night Prayers',       album: 'Special Events'  },
  { id: 'l13', url: '/images/bbcevangelismapstle.jpg', title: 'Evangelism Crusade',      album: 'Crusades'        },
  { id: 'l14', url: '/images/bbccon.jpg',              title: 'Convention',              album: 'Conferences'     },
  { id: 'l15', url: '/images/audit.jpg',               title: 'Miracle Service',         album: 'Special Events'  },
  { id: 'l16', url: '/images/choir.jpg',               title: 'Praise & Worship',        album: 'Church Services' },
  { id: 'l17', url: '/images/bbc-man.jpg',             title: "Men's Fellowship",        album: 'Outreach'        },
  { id: 'l18', url: '/images/bbc-womenflsp.jpg',       title: 'Women Fellowship',        album: 'Outreach'        },
  { id: 'l19', url: '/images/youthchurch.jpg',         title: 'Youth Church',            album: 'Outreach'        },
  { id: 'l20', url: '/images/founder4.jpg',            title: 'Teaching the Word',       album: 'Special Events'  },
  { id: 'l21', url: '/images/pastors.jpg',             title: 'Ministry Leaders',        album: 'Special Events'  },
  { id: 'l22', url: '/images/premises.jpg',            title: 'Church Premises',         album: 'Church Services' },
  { id: 'l23', url: '/images/sun-servc.jpg',           title: 'Grace Hour Service',      album: 'Church Services' },
  { id: 'l24', url: '/images/sunday-serv.jpg',         title: 'Sunday Worship',          album: 'Church Services' },
];

const LOCAL_ALBUMS = ['Church Services', 'Crusades', 'Conferences', 'Outreach', 'Special Events'];

/* ─── Unified photo type ────────────────────────────────────── */

interface GalleryPhoto {
  id:     string;
  url:    string;
  thumb:  string;
  title:  string;
  album:  string;
  date?:  string;
  source: 'local' | 'facebook';
}

/* ─── Helpers ───────────────────────────────────────────────── */

function msToMinutes(ms: number) { return Math.round(ms / 60000); }

function timeAgo(ms: number): string {
  const m = Math.floor(ms / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

function fbPhotoToGallery(p: FBPhoto, albumName: string): GalleryPhoto {
  return {
    id:     p.id,
    url:    getLargeImage(p),
    thumb:  getMediumImage(p),
    title:  p.name || 'Ministry Photo',
    album:  albumName,
    date:   p.created_time,
    source: 'facebook',
  };
}

/* ─── Skeleton card ─────────────────────────────────────────── */

const Skeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-slate-800 animate-pulse break-inside-avoid">
    <div className="w-full bg-slate-700" style={{ paddingBottom: `${55 + Math.random() * 40}%` }} />
  </div>
);

/* ─── Gallery component ─────────────────────────────────────── */

const Gallery: React.FC = () => {
  const [photos,       setPhotos]       = useState<GalleryPhoto[]>([]);
  const [albums,       setAlbums]       = useState<FBAlbum[]>([]);
  const [activeTab,    setActiveTab]    = useState('All');
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [isRateLimit,  setIsRateLimit]  = useState(false);
  const [fbConnected,  setFbConnected]  = useState(false);
  const [cacheAge,     setCacheAge]     = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(24);
  const [selectedIdx,  setSelectedIdx]  = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const token  = getToken();
  const pageId = getPageId();

  /* ── Scroll-reveal ── */
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.05 }
    );
    document.querySelectorAll('.reveal').forEach(el => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [photos, activeTab]);

  /* ── Load photos ── */
  const loadPhotos = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) clearFBCache();

    if (!token) {
      // No token → use local images
      setPhotos(LOCAL_IMAGES.map(img => ({ ...img, thumb: img.url, source: 'local' as const })));
      setFbConnected(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setIsRateLimit(false);

    try {
      // Fetch albums + latest photos in parallel
      const [fetchedAlbums, latestPhotos] = await Promise.all([
        fetchAlbums(token, pageId),
        fetchLatestPhotos(token, pageId),
      ]);

      setAlbums(fetchedAlbums);
      setFbConnected(true);
      setCacheAge(getCacheAge(pageId));

      // Convert latest FB photos to gallery format
      const fbPhotos = latestPhotos.map(p => fbPhotoToGallery(p, 'Latest Photos'));

      // Merge: FB photos first, then local images as archive
      const merged: GalleryPhoto[] = [
        ...fbPhotos,
        ...LOCAL_IMAGES.map(img => ({ ...img, thumb: img.url, source: 'local' as const })),
      ];
      setPhotos(merged);
    } catch (err) {
      if (err instanceof RateLimitError) {
        setIsRateLimit(true);
        setError('Facebook rate limit reached. Showing cached / local photos.');
      } else {
        setError(err instanceof Error ? err.message : 'Could not load Facebook photos.');
      }
      // Fallback to local
      setPhotos(LOCAL_IMAGES.map(img => ({ ...img, thumb: img.url, source: 'local' as const })));
      setFbConnected(false);
    } finally {
      setLoading(false);
    }
  }, [token, pageId]);

  /* ── Load album photos when album tab is selected ── */
  const loadAlbumPhotos = useCallback(async (album: FBAlbum) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const fbPhotos = await fetchAlbumPhotos(token, album.id);
      const galleryPhotos = fbPhotos.map(p => fbPhotoToGallery(p, album.name));
      // Merge with local for that album category
      const localMatch = LOCAL_IMAGES
        .filter(img => img.album.toLowerCase().includes(album.name.toLowerCase().substring(0, 5)))
        .map(img => ({ ...img, thumb: img.url, source: 'local' as const }));
      setPhotos([...galleryPhotos, ...localMatch]);
    } catch (err) {
      if (err instanceof RateLimitError) { setIsRateLimit(true); setError('Rate limit reached.'); }
      else setError(err instanceof Error ? err.message : 'Could not load album.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* ── Tab change ── */
  const handleTabChange = useCallback(async (tab: string) => {
    setActiveTab(tab);
    setSelectedIdx(null);
    setVisibleCount(24);

    if (tab === 'All' || tab === 'Latest Photos') {
      loadPhotos();
      return;
    }

    // Local-only tabs
    if (LOCAL_ALBUMS.includes(tab)) {
      setPhotos(LOCAL_IMAGES.filter(img => img.album === tab).map(img => ({ ...img, thumb: img.url, source: 'local' as const })));
      return;
    }

    // FB album tab
    const album = albums.find(a => a.name === tab);
    if (album) { loadAlbumPhotos(album); return; }
  }, [albums, loadPhotos, loadAlbumPhotos]);

  /* ── Initial load ── */
  useEffect(() => { loadPhotos(); }, [loadPhotos]);

  /* ── Keyboard nav for lightbox ── */
  useEffect(() => {
    if (selectedIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      setSelectedIdx(null);
      if (e.key === 'ArrowRight')  setSelectedIdx(p => p === null ? 0 : (p + 1) % visiblePhotos.length);
      if (e.key === 'ArrowLeft')   setSelectedIdx(p => p === null ? 0 : (p - 1 + visiblePhotos.length) % visiblePhotos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  /* ── Body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = selectedIdx !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedIdx]);

  /* ── Filter logic ── */
  const filteredPhotos = (() => {
    if (activeTab === 'All') return photos;
    if (activeTab === 'Latest Photos') return photos.filter(p => p.source === 'facebook');
    return photos.filter(p => p.album === activeTab);
  })();

  const visiblePhotos = filteredPhotos.slice(0, visibleCount);
  const hasMore = filteredPhotos.length > visibleCount;

  /* ── Tab list ── */
  const tabs = [
    'All',
    ...(fbConnected ? ['Latest Photos'] : []),
    ...LOCAL_ALBUMS,
    ...(fbConnected ? albums.filter(a => !LOCAL_ALBUMS.includes(a.name)).map(a => a.name) : []),
  ];

  /* ── Render ─────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-slate-950 animate-fadeIn pb-20">

      {/* ══ Hero ══ */}
      <section className="relative py-28 text-center text-white overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/gallery bana.jpg" alt="" aria-hidden className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-amber-500 font-black uppercase tracking-[0.35em] text-xs mb-4 block animate-fadeIn">
            Moments of Glory
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slideUp">
            MEDIA <span className="text-gold-gradient">GALLERY</span>
          </h1>
          <p className="text-slate-300 max-w-lg mx-auto text-lg font-light mb-8">
            Capturing divine encounters, miracles, and the tangible move of God's power in our midst.
          </p>

          {/* Status badge */}
          {fbConnected ? (
            <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-600/30 text-green-400 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider animate-fadeIn">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live from Facebook
              {cacheAge !== null && <span className="text-green-600/70 ml-1">· synced {timeAgo(cacheAge)}</span>}
            </div>
          ) : token ? (
            <div className="inline-flex items-center gap-2 bg-amber-900/20 border border-amber-600/30 text-amber-400 px-4 py-2 rounded-full text-xs font-bold">
              <span>⚠</span> Using local archive
            </div>
          ) : (
            <a href="#/admin" onClick={e => { e.preventDefault(); window.location.hash = '#/admin'; }}
              className="inline-flex items-center gap-2 bg-blue-900/20 border border-blue-600/30 text-blue-400 px-4 py-2 rounded-full text-xs font-bold hover:bg-blue-900/40 transition-all">
              Connect Facebook in Admin →
            </a>
          )}
        </div>
      </section>

      {/* ══ Error banner ══ */}
      {error && (
        <div className={`py-3 px-6 text-center text-sm font-semibold ${isRateLimit ? 'bg-amber-900/20 text-amber-400 border-b border-amber-600/20' : 'bg-red-900/20 text-red-400 border-b border-red-600/20'}`}>
          {isRateLimit ? '⚡ ' : '⚠ '}{error}
          {isRateLimit && <span className="ml-2 text-xs opacity-70">Next refresh available in {30 - msToMinutes(cacheAge ?? 0)} min</span>}
        </div>
      )}

      {/* ══ Toolbar: tabs + refresh ══ */}
      <div className="bg-slate-900/80 backdrop-blur-xl sticky top-20 z-30 border-b border-white/5 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            <div className="flex gap-2 flex-1 overflow-x-auto pb-0.5">
              {tabs.map(tab => (
                <button key={tab} onClick={() => handleTabChange(tab)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all ${
                    activeTab === tab
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}>
                  {tab}
                  {tab === 'All' && <span className="ml-1.5 opacity-60">{photos.length}</span>}
                </button>
              ))}
            </div>

            {/* Refresh button */}
            {token && (
              <button onClick={() => loadPhotos(true)} disabled={loading}
                title="Refresh from Facebook"
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-500 hover:text-amber-500 transition-colors disabled:opacity-30">
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══ Grid ══ */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {loading && photos.length === 0 ? (
            /* Loading skeletons */
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
              {Array.from({ length: 16 }).map((_, i) => <Skeleton key={i} />)}
            </div>
          ) : filteredPhotos.length === 0 ? (
            <div className="text-center py-24 text-slate-600">
              <p className="text-5xl mb-4">🖼️</p>
              <p className="text-xl font-bold text-slate-400">No photos in this album yet</p>
              <p className="text-sm mt-2">Check back after the next service</p>
            </div>
          ) : (
            <>
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
                {visiblePhotos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedIdx(idx)}
                    role="button" tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setSelectedIdx(idx)}
                    aria-label={`View ${photo.title}`}
                    className="relative group cursor-pointer overflow-hidden rounded-2xl break-inside-avoid shadow-sm hover:shadow-2xl transition-all duration-300 bg-slate-800 reveal"
                    style={{ transitionDelay: `${(idx % 8) * 40}ms` }}
                  >
                    <img
                      src={photo.thumb || photo.url}
                      alt={photo.title}
                      loading="lazy"
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={e => { (e.target as HTMLImageElement).src = '/images/founder4.jpg'; }}
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                      {photo.source === 'facebook' && (
                        <span className="text-blue-400 font-black text-[8px] uppercase tracking-widest mb-0.5 flex items-center gap-1">
                          <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                            <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.383 14.444 5 15.333 5H18V0h-3.333C11.333 0 9 2.333 9 5.333V8z"/>
                          </svg>
                          Facebook
                        </span>
                      )}
                      <span className="text-amber-400 font-black uppercase tracking-widest text-[9px] mb-1">{photo.album}</span>
                      <p className="text-white font-bold text-sm leading-tight line-clamp-2">{photo.title}</p>
                    </div>

                    {/* Zoom icon */}
                    <div className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <svg className="w-3.5 h-3.5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="text-center mt-12">
                  <button onClick={() => setVisibleCount(n => n + 24)}
                    className="bg-slate-800 border border-slate-700 hover:border-amber-600/40 text-white px-10 py-4 rounded-full font-bold text-sm transition-all hover:bg-slate-700 active:scale-95">
                    Load More Photos ({filteredPhotos.length - visibleCount} remaining)
                  </button>
                </div>
              )}

              {/* Photo count footer */}
              <p className="text-center text-slate-700 text-xs mt-8 font-bold uppercase tracking-wider">
                Showing {Math.min(visibleCount, filteredPhotos.length)} of {filteredPhotos.length} photos
                {fbConnected && photos.filter(p => p.source === 'facebook').length > 0 && (
                  <span className="ml-2 text-blue-700">· {photos.filter(p => p.source === 'facebook').length} from Facebook</span>
                )}
              </p>
            </>
          )}
        </div>
      </section>

      {/* ══ Lightbox ══ */}
      {selectedIdx !== null && visiblePhotos[selectedIdx] && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/97 flex flex-col items-center justify-center animate-fadeIn backdrop-blur-md"
          onClick={() => setSelectedIdx(null)}
          role="dialog" aria-modal="true"
        >
          {/* Close */}
          <button className="absolute top-5 right-5 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition-colors z-10"
            onClick={() => setSelectedIdx(null)} aria-label="Close">✕</button>

          {/* Counter */}
          <div className="absolute top-5 left-5 glass px-4 py-2 rounded-full text-white text-xs font-bold z-10">
            {selectedIdx + 1} / {visiblePhotos.length}
          </div>

          {/* Prev */}
          <button
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-amber-600/50 transition-all z-10"
            onClick={e => { e.stopPropagation(); setSelectedIdx(p => p === null ? 0 : (p - 1 + visiblePhotos.length) % visiblePhotos.length); }}
            aria-label="Previous">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          {/* Image */}
          <img
            src={visiblePhotos[selectedIdx].url || visiblePhotos[selectedIdx].thumb}
            alt={visiblePhotos[selectedIdx].title}
            onClick={e => e.stopPropagation()}
            className="max-w-[90vw] max-h-[78vh] rounded-2xl shadow-2xl object-contain animate-scaleUp border border-white/10 bg-slate-900"
            onError={e => { (e.target as HTMLImageElement).src = '/images/founder4.jpg'; }}
          />

          {/* Caption */}
          <div className="mt-4 text-center px-4">
            <p className="text-white font-bold text-base">{visiblePhotos[selectedIdx].title}</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <p className="text-amber-400 text-xs uppercase tracking-widest">{visiblePhotos[selectedIdx].album}</p>
              {visiblePhotos[selectedIdx].source === 'facebook' && (
                <span className="text-blue-400 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                  <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.383 14.444 5 15.333 5H18V0h-3.333C11.333 0 9 2.333 9 5.333V8z"/>
                  </svg>
                  Facebook
                </span>
              )}
            </div>
          </div>

          {/* Next */}
          <button
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-amber-600/50 transition-all z-10"
            onClick={e => { e.stopPropagation(); setSelectedIdx(p => p === null ? 0 : (p + 1) % visiblePhotos.length); }}
            aria-label="Next">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          <p className="absolute bottom-5 text-slate-600 text-xs hidden sm:block">
            ← → to navigate · ESC to close
          </p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
