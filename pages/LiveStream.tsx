
import React, { useState, useEffect, useRef, useCallback } from 'react';

/* Native dimensions Facebook encodes in the plugin URL */
const FB_W = 560;
const FB_H = 314;

const schedule = [
  { day: 'Sunday',    time: '8:00 AM GMT',  name: 'Grace Hour Service',     icon: '⛪' },
  { day: 'Wednesday', time: '6:00 PM GMT',  name: 'Blood of Jesus Service', icon: '💥' },
  { day: 'Thursday',  time: '8:00 AM GMT',  name: 'Jericho Prayer',         icon: '🙏' },
  { day: 'Friday',    time: '10:00 PM GMT', name: 'All-Night Warfare',      icon: '⚔️' },
];

const isLikelyLive = () => {
  const now  = new Date();
  const day  = now.getUTCDay();
  const hour = now.getUTCHours();
  return (day === 0 && hour >= 8 && hour <= 13) ||
         (day === 3 && hour >= 18 && hour <= 20) ||
         (day === 4 && hour >= 8  && hour <= 14) ||
         (day === 5 && hour >= 22);
};

/* Default: the exact plugin URL from the Facebook "Embed" button */
const DEFAULT_SRC =
  'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FAkowuahJosephMinistries%2Fvideos%2F1146991354277026%2F&show_text=false&width=560&t=0';

/**
 * Normalise any admin-saved stream URL into a renderable src:
 *  - direct FB video/live URL  → plugin embed URL
 *  - plugin URL already        → pass through
 *  - YouTube                   → pass through (already an embed URL)
 */
function toEmbedSrc(src: string): string {
  const s = src.trim();
  if (!s) return DEFAULT_SRC;

  // Already a FB plugin URL
  if (s.includes('facebook.com/plugins/video')) return s;

  // Direct FB video: https://www.facebook.com/PAGE/videos/ID/
  const fbVideo = s.match(/facebook\.com\/([^/]+)\/videos\/(\d+)/i);
  if (fbVideo) {
    const href = encodeURIComponent(`https://www.facebook.com/${fbVideo[1]}/videos/${fbVideo[2]}/`);
    return `https://www.facebook.com/plugins/video.php?height=${FB_H}&href=${href}&show_text=false&width=${FB_W}&t=0`;
  }

  // Direct FB live: https://www.facebook.com/PAGE/live
  const fbLive = s.match(/facebook\.com\/([^/?#]+)\/live/i);
  if (fbLive) {
    const href = encodeURIComponent(`https://www.facebook.com/${fbLive[1]}/live/`);
    return `https://www.facebook.com/plugins/video.php?height=${FB_H}&href=${href}&show_text=false&width=${FB_W}&t=0`;
  }

  // Anything else (YouTube embed, etc.)
  return s;
}

function isFbEmbed(src: string) {
  return src.includes('facebook.com');
}

const LiveStream: React.FC = () => {
  const [signalStrength, setSignalStrength] = useState(0);
  const [showEmbed,      setShowEmbed]      = useState(false);
  const [streamSrc,      setStreamSrc]      = useState(
    () => localStorage.getItem('bbc_stream_src') || DEFAULT_SRC
  );
  const [scale, setScale] = useState(1);

  const playerBoxRef = useRef<HTMLDivElement | null>(null);
  const observerRef  = useRef<IntersectionObserver | null>(null);

  /* Sync src from admin */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'bbc_stream_src' && e.newValue) setStreamSrc(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  /* Signal scanning animation */
  useEffect(() => {
    let progress = 0;
    const id = setInterval(() => {
      progress += Math.random() * 18;
      setSignalStrength(Math.min(Math.floor(progress), 100));
      if (progress >= 100) {
        clearInterval(id);
        setTimeout(() => setShowEmbed(true), 400);
      }
    }, 130);
    return () => clearInterval(id);
  }, []);

  /* Compute the CSS scale so the 560×314 iframe fills the container */
  const recalcScale = useCallback(() => {
    const w = playerBoxRef.current?.offsetWidth;
    if (w) setScale(w / FB_W);
  }, []);

  useEffect(() => {
    if (!showEmbed) return;
    const t = setTimeout(recalcScale, 60);
    return () => clearTimeout(t);
  }, [showEmbed, recalcScale]);

  useEffect(() => {
    window.addEventListener('resize', recalcScale);
    return () => window.removeEventListener('resize', recalcScale);
  }, [recalcScale]);

  /* Scroll reveal */
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(
      (el) => observerRef.current?.observe(el)
    );
    return () => observerRef.current?.disconnect();
  }, [showEmbed]);

  const connected = signalStrength === 100;
  const live      = isLikelyLive();
  const embedSrc  = toEmbedSrc(streamSrc);
  const fb        = isFbEmbed(embedSrc);

  return (
    <div className="min-h-screen bg-slate-950 text-white animate-fadeIn">

      {/* ── Sticky header ── */}
      <div className="sticky top-20 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className={`w-4 h-4 rounded-full transition-all duration-500 ${connected ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-slate-700'}`} />
              {connected && <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-60" />}
            </div>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-3">
                Prophetic Live Altar
                {live && (
                  <span className="bg-red-600 text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider animate-pulse">ON AIR</span>
                )}
              </h1>
              <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] mt-0.5">
                {!connected ? `Scanning Altar Frequency: ${signalStrength}%` : 'Signal Established · Masofa TV'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex gap-1 items-end h-5">
              {[1,2,3,4,5].map((i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-400 ${signalStrength >= i * 20 ? 'bg-amber-500' : 'bg-slate-700'}`}
                  style={{ height: `${i * 20}%` }}
                />
              ))}
            </div>
            <a
              href="https://www.facebook.com/AkowuahJosephMinistries/live"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/30 active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.383 14.444 5 15.333 5H18V0h-3.333C11.333 0 9 2.333 9 5.333V8z" />
              </svg>
              Watch on Facebook
            </a>
          </div>
        </div>
      </div>

      {/* ── Player ── */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/*
          The outer box is aspect-video (16:9).
          For Facebook embeds we render the iframe at its native 560×314 size
          then scale it to fill the box with CSS transform — no clipping, no
          scrollbars, interactive controls still work at any screen width.
        */}
        <div
          ref={playerBoxRef}
          className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,.7)] border border-white/8"
        >
          {!showEmbed ? (
            /* Scanning animation */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-amber-600/20 border-t-amber-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">📡</div>
              </div>
              <h2 className="text-xl font-serif italic text-amber-400">Connecting to Masofa TV…</h2>
              <p className="text-slate-500 mt-3 text-xs uppercase tracking-widest font-bold">
                Initialising Satellite Link · {signalStrength}%
              </p>
              <div className="mt-6 w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 rounded-full transition-all duration-300"
                  style={{ width: `${signalStrength}%` }}
                />
              </div>
            </div>

          ) : fb ? (
            /* Facebook plugin embed — scaled to fill the container on every screen */
            <>
              <iframe
                src={embedSrc}
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
                title="BBC International Live Stream"
              />
              {/* Badge — pointer-events-none so it doesn't block the player */}
              <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none bg-gradient-to-t from-black/70 to-transparent flex items-end gap-3 z-10">
                {live
                  ? <span className="bg-red-600 px-3 py-1 rounded font-black text-[10px] tracking-widest animate-pulse">LIVE</span>
                  : <span className="bg-slate-700 px-3 py-1 rounded font-black text-[10px] tracking-widest text-slate-300">REPLAY</span>
                }
                <p className="text-xs font-bold text-white/80">Masofa TV · BBC International</p>
              </div>
            </>

          ) : (
            /* YouTube / generic embed */
            <>
              <iframe
                key={embedSrc}
                src={embedSrc}
                className="absolute inset-0 w-full h-full"
                style={{ border: 'none', overflow: 'hidden', display: 'block' }}
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title="BBC International Live Stream"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none bg-gradient-to-t from-black/70 to-transparent flex items-end gap-3 z-10">
                {live
                  ? <span className="bg-red-600 px-3 py-1 rounded font-black text-[10px] tracking-widest animate-pulse">LIVE</span>
                  : <span className="bg-slate-700 px-3 py-1 rounded font-black text-[10px] tracking-widest text-slate-300">REPLAY</span>
                }
                <p className="text-xs font-bold text-white/80">Masofa TV · BBC International</p>
              </div>
            </>
          )}
        </div>

        {/* ── Info & support ── */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10">

          <div className="lg:col-span-8 space-y-8 reveal-left">
            <div>
              <h2 className="text-3xl font-bold mb-3">The Anointing Has No Boundaries</h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                You are connecting to a global prophetic movement. If the player shows "Unavailable,"
                the stream may have ended or is scheduled for a later hour.
              </p>
              <p className="text-amber-400 font-serif italic mt-4">
                Use the Facebook button above to check our page directly for recent recordings and
                upcoming broadcasts.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {schedule.map((s) => (
                <div
                  key={s.day}
                  className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-amber-600/40 transition-all"
                >
                  <span className="text-2xl mb-3 block">{s.icon}</span>
                  <p className="text-amber-400 font-black text-[10px] uppercase tracking-widest mb-1">{s.day}</p>
                  <p className="text-white font-bold text-lg">{s.time}</p>
                  <p className="text-slate-500 text-sm mt-1">{s.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5 reveal-right">
            <div className="bg-amber-600 p-8 rounded-3xl relative overflow-hidden group">
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

            <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl hover:border-amber-600/20 transition-all">
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
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
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
