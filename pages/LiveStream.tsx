
import React, { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window {
    FB?: { XFBML: { parse: (el?: HTMLElement | null) => void } };
  }
}

/* ── Constants ─────────────────────────────────────────────────────────────── */
const FB_PAGE_BASE = 'https://www.facebook.com/AkowuahJosephMinistries';
const FB_PAGE_LIVE = `${FB_PAGE_BASE}/live`;
const DEFAULT_VIDEO = `${FB_PAGE_BASE}/videos/1146991354277026/`;
const FB_W = 560, FB_H = 314;

const schedule = [
  { day: 'Sunday',    time: '8:00 AM GMT',  name: 'Grace Hour Service',     icon: '⛪' },
  { day: 'Wednesday', time: '6:00 PM GMT',  name: 'Blood of Jesus Service', icon: '💥' },
  { day: 'Thursday',  time: '8:00 AM GMT',  name: 'Jericho Prayer',         icon: '🙏' },
  { day: 'Friday',    time: '10:00 PM GMT', name: 'All-Night Warfare',      icon: '⚔️' },
];

/* ── Helpers ───────────────────────────────────────────────────────────────── */
const isLikelyLive = () => {
  const now = new Date(), d = now.getUTCDay(), h = now.getUTCHours();
  return (d===0&&h>=8&&h<=13)||(d===3&&h>=18&&h<=20)||(d===4&&h>=8&&h<=14)||(d===5&&h>=22);
};

/** Normalize any stored src to a direct Facebook video/live URL */
function toDirectUrl(src: string): string {
  const s = (src || '').trim();
  if (!s) return DEFAULT_VIDEO;
  if (s.includes('facebook.com/plugins/video.php')) {
    try {
      const href = new URL(s).searchParams.get('href');
      if (href) return decodeURIComponent(href);
    } catch { /* fall through */ }
  }
  const fbV = s.match(/facebook\.com\/([^/]+)\/videos\/(\d+)/i);
  if (fbV) return `https://www.facebook.com/${fbV[1]}/videos/${fbV[2]}/`;
  const fbL = s.match(/facebook\.com\/([^/?#]+)\/live/i);
  if (fbL) return `https://www.facebook.com/${fbL[1]}/live/`;
  return s;
}

/** Build plugin iframe URL from a direct FB URL */
function toPluginSrc(directUrl: string, w = FB_W, h = FB_H): string {
  if (!directUrl.includes('facebook.com')) return directUrl;
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(directUrl)}&show_text=false&width=${w}&height=${h}&t=0`;
}

/* ── SVG icons ──────────────────────────────────────────────────────────────── */
const FbIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.383 14.444 5 15.333 5H18V0h-3.333C11.333 0 9 2.333 9 5.333V8z" />
  </svg>
);

/* ── Types ──────────────────────────────────────────────────────────────────── */
type EmbedState = 'scanning' | 'sdk-loading' | 'sdk-ready' | 'iframe' | 'error';

/* ══════════════════════════════════════════════════════════════════════════════
   Component
══════════════════════════════════════════════════════════════════════════════ */
const LiveStream: React.FC = () => {
  const [signal,     setSignal]     = useState(0);
  const [embedState, setEmbedState] = useState<EmbedState>('scanning');
  const [streamSrc,  setStreamSrc]  = useState(
    () => localStorage.getItem('bbc_stream_src') || DEFAULT_VIDEO
  );
  const [scale, setScale] = useState(1);

  const playerRef   = useRef<HTMLDivElement>(null);
  const sdkRef      = useRef<HTMLDivElement>(null);
  const sdkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Admin stream URL changes (other tab) */
  useEffect(() => {
    const fn = (e: StorageEvent) => {
      if (e.key === 'bbc_stream_src' && e.newValue) setStreamSrc(e.newValue);
    };
    window.addEventListener('storage', fn);
    return () => window.removeEventListener('storage', fn);
  }, []);

  /* Fast signal scan (~600 ms) */
  useEffect(() => {
    if (embedState !== 'scanning') return;
    let progress = 0;
    const id = setInterval(() => {
      progress += Math.random() * 28 + 8;
      setSignal(Math.min(Math.floor(progress), 100));
      if (progress >= 100) {
        clearInterval(id);
        setTimeout(() => setEmbedState('sdk-loading'), 150);
      }
    }, 75);
    return () => clearInterval(id);
  }, [embedState]);

  /* Initialize FB SDK embed — runs on all devices */
  useEffect(() => {
    if (embedState !== 'sdk-loading') return;

    const directUrl = toDirectUrl(streamSrc);
    const isFb = directUrl.includes('facebook.com');

    if (!isFb) {
      setEmbedState('iframe');
      return;
    }

    let attempts = 0;
    const MAX = 20; // poll up to 4 seconds

    const tryParse = () => {
      if (!sdkRef.current) return;

      if (window.FB?.XFBML?.parse) {
        sdkRef.current.innerHTML = '';
        const div = document.createElement('div');
        div.className = 'fb-video';
        div.dataset.href = directUrl;
        div.dataset.width = 'auto';
        div.dataset.showText = 'false';
        div.dataset.allowfullscreen = 'true';
        sdkRef.current.appendChild(div);

        // Two rAF ticks so the DOM has a real layout width before data-width="auto" is read
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            try {
              window.FB!.XFBML.parse(sdkRef.current!);
              setEmbedState('sdk-ready');
            } catch {
              setEmbedState('iframe');
            }
          });
        });
      } else if (attempts < MAX) {
        attempts++;
        sdkTimerRef.current = setTimeout(tryParse, 200);
      } else {
        setEmbedState('iframe');
      }
    };

    tryParse();
    return () => {
      if (sdkTimerRef.current) clearTimeout(sdkTimerRef.current);
    };
  }, [embedState, streamSrc]);

  /* Scale plugin iframe to fill the container (iframe fallback path) */
  const recalcScale = useCallback(() => {
    const w = playerRef.current?.offsetWidth;
    if (w) setScale(w / FB_W);
  }, []);

  useEffect(() => {
    if (embedState !== 'iframe') return;
    const t = setTimeout(recalcScale, 60);
    return () => clearTimeout(t);
  }, [embedState, recalcScale]);

  useEffect(() => {
    window.addEventListener('resize', recalcScale);
    return () => window.removeEventListener('resize', recalcScale);
  }, [recalcScale]);

  /* Scroll-reveal */
  useEffect(() => {
    if (embedState === 'scanning') return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [embedState]);

  const live       = isLikelyLive();
  const isScanning = embedState === 'scanning';
  const directUrl  = toDirectUrl(streamSrc);
  const pluginSrc  = toPluginSrc(directUrl);

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-950 text-white animate-fadeIn">

      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <div className="sticky top-20 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className={`w-4 h-4 rounded-full transition-all duration-500 ${!isScanning ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-slate-700'}`} />
              {!isScanning && (
                <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-60" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-3">
                Prophetic Live Altar
                {live && (
                  <span className="bg-red-600 text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider animate-pulse">
                    ON AIR
                  </span>
                )}
              </h1>
              <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] mt-0.5">
                {isScanning ? `Scanning Altar Frequency: ${signal}%` : 'Signal Established · Masofa TV'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex gap-1 items-end h-5">
              {[1,2,3,4,5].map((i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all ${signal >= i * 20 ? 'bg-amber-500' : 'bg-slate-700'}`}
                  style={{ height: `${i * 20}%` }}
                />
              ))}
            </div>
            <a
              href={FB_PAGE_LIVE}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/30 active:scale-95"
            >
              <FbIcon className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">Watch on Facebook</span>
              <span className="sm:hidden">Facebook</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Player ─────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <div
          ref={playerRef}
          className="relative aspect-video bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,.6)] border border-white/8"
        >

          {/* ── Scan animation ─────────────────────────────────────────────── */}
          {isScanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-amber-600/20 border-t-amber-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-xl sm:text-2xl">📡</div>
              </div>
              <h2 className="text-lg sm:text-xl font-serif italic text-amber-400">Connecting to Masofa TV…</h2>
              <p className="text-slate-500 mt-2 text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                Initialising Satellite Link · {signal}%
              </p>
              <div className="mt-5 w-40 sm:w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 rounded-full transition-all duration-300"
                  style={{ width: `${signal}%` }}
                />
              </div>
            </div>
          )}

          {/* ── FB SDK embed — shown on all devices ────────────────────────── */}
          {!isScanning && (embedState === 'sdk-loading' || embedState === 'sdk-ready') && (
            <>
              {embedState === 'sdk-loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10 pointer-events-none">
                  <div className="w-9 h-9 border-2 border-amber-600/30 border-t-amber-600 rounded-full animate-spin mb-3" />
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest">Loading player…</p>
                </div>
              )}
              {/* React must NOT touch children of this div — FB SDK manages them */}
              <div ref={sdkRef} className="absolute inset-0 w-full h-full" />
              {embedState === 'sdk-ready' && (
                <div className="absolute inset-x-0 bottom-0 p-3 pointer-events-none bg-gradient-to-t from-black/60 to-transparent flex items-end gap-2 z-10">
                  {live
                    ? <span className="bg-red-600 px-2.5 py-0.5 rounded font-black text-[9px] tracking-widest animate-pulse">LIVE</span>
                    : <span className="bg-slate-700 px-2.5 py-0.5 rounded font-black text-[9px] tracking-widest text-slate-300">REPLAY</span>}
                  <p className="text-[10px] font-bold text-white/70">Masofa TV · BBC International</p>
                </div>
              )}
            </>
          )}

          {/* ── Plugin iframe — fallback when FB SDK is unavailable ─────────── */}
          {!isScanning && embedState === 'iframe' && (
            <>
              <iframe
                src={pluginSrc}
                width={FB_W}
                height={FB_H}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  border: 'none',
                  overflow: 'hidden',
                  display: 'block',
                  transformOrigin: 'top left',
                  transform: `scale(${scale})`,
                }}
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="Masofa TV Live Stream"
                onError={() => setEmbedState('error')}
              />
              <div className="absolute inset-x-0 bottom-0 p-3 pointer-events-none bg-gradient-to-t from-black/70 to-transparent flex items-end gap-2 z-10">
                {live
                  ? <span className="bg-red-600 px-2.5 py-0.5 rounded font-black text-[9px] tracking-widest animate-pulse">LIVE</span>
                  : <span className="bg-slate-700 px-2.5 py-0.5 rounded font-black text-[9px] tracking-widest text-slate-300">REPLAY</span>}
                <p className="text-[10px] font-bold text-white/70">Masofa TV · BBC International</p>
              </div>
            </>
          )}

          {/* ── Error / stream unavailable ──────────────────────────────────── */}
          {!isScanning && embedState === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-center px-6">
              <div className="text-4xl sm:text-5xl mb-4">📡</div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Stream Unavailable</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-xs leading-relaxed">
                The broadcast may have ended or hasn't started yet.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <a
                  href={live ? FB_PAGE_LIVE : directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3 rounded-2xl transition-all flex items-center gap-2 text-sm"
                >
                  <FbIcon className="w-4 h-4 fill-current" />
                  Watch on Facebook
                </a>
                <button
                  onClick={() => setEmbedState('sdk-loading')}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-7 py-3 rounded-2xl transition-all text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── Info & support ─────────────────────────────────────────────────── */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">

          <div className="lg:col-span-8 space-y-8 reveal-left">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">The Anointing Has No Boundaries</h2>
              <p className="text-slate-400 leading-relaxed text-base sm:text-lg">
                You are connecting to a global prophetic movement. If the player shows "Unavailable,"
                the stream may have ended or is scheduled for a later hour.
              </p>
              <p className="text-amber-400 font-serif italic mt-4">
                Use the Facebook button above to check our page directly for recent recordings and
                upcoming broadcasts.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
              {schedule.map((s) => (
                <div
                  key={s.day}
                  className="bg-white/5 border border-white/10 p-4 sm:p-6 rounded-2xl hover:border-amber-600/40 transition-all"
                >
                  <span className="text-xl sm:text-2xl mb-2 sm:mb-3 block">{s.icon}</span>
                  <p className="text-amber-400 font-black text-[9px] sm:text-[10px] uppercase tracking-widest mb-1">{s.day}</p>
                  <p className="text-white font-bold text-base sm:text-lg">{s.time}</p>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">{s.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5 reveal-right">
            <div className="bg-amber-600 p-6 sm:p-8 rounded-3xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Sow into the Altar</h3>
                <p className="text-amber-100 text-sm mb-6 leading-relaxed">
                  Your seed fuels the technology that carries this prophetic word into homes worldwide.
                </p>
                <a
                  href="#/give"
                  onClick={(e) => { e.preventDefault(); window.location.hash = '#/give'; }}
                  className="block w-full bg-slate-950 text-white text-center py-3.5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 active:scale-95 transition-all shadow-xl"
                >
                  Give Online
                </a>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
            </div>

            <div className="bg-slate-900 border border-white/10 p-6 sm:p-8 rounded-3xl hover:border-amber-600/20 transition-all">
              <h3 className="text-lg font-bold mb-3">Prophetic Prayer Request</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Need a personal prophetic word? Our intercession team is available on WhatsApp.
              </p>
              <a
                href="https://wa.me/233240171460"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-green-600/15 border border-green-600/30 text-green-400 py-3.5 rounded-2xl font-bold hover:bg-green-600 hover:text-white transition-all text-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp Intercession
              </a>
            </div>

            <div className="text-center py-4">
              <p className="text-slate-500 text-xs">
                Never miss a broadcast —{' '}
                <a
                  href="https://www.facebook.com/AkowuahJosephMinistries"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline font-bold"
                >
                  follow us on Facebook
                </a>
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default LiveStream;
