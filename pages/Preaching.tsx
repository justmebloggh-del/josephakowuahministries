
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sermon, SERMONS_KEY, LISTEN_LATER_KEY } from '../types';

/* ─── Constants ──────────────────────────────────────────────────────────── */

const SERVICE_TYPES = [
  'All Types', 'Sunday Service', 'Wednesday Service',
  'Jericho Prayer', 'All-Night Warfare', 'Special Programme',
];
const TOPICS = [
  'All Topics', 'Faith', 'Prayer', 'Healing', 'Deliverance',
  'Finances', 'Marriage', 'Purpose', 'Prophecy', 'Salvation', 'Warfare', 'Restoration',
];
const YEARS       = ['All Years', '2026', '2025', '2024', '2023'];
const MONTHS_LIST = [
  'All Months', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const TYPE_COLORS: Record<string, string> = {
  'Sunday Service':    'bg-amber-600/20 text-amber-400 border-amber-600/20',
  'Wednesday Service': 'bg-blue-600/20 text-blue-400 border-blue-600/20',
  'Jericho Prayer':    'bg-green-600/20 text-green-400 border-green-600/20',
  'All-Night Warfare': 'bg-red-600/20 text-red-400 border-red-600/20',
  'Special Programme': 'bg-purple-600/20 text-purple-400 border-purple-600/20',
};

/* ─── Sample data ────────────────────────────────────────────────────────── */

const SAMPLE_SERMONS: Sermon[] = [
  {
    id: 's1', title: 'Breaking the Spirit of Poverty',
    apostle: 'Apostle Joseph Akwasi Akowuah', date: '2025-05-18',
    serviceType: 'Sunday Service', topic: 'Finances', series: 'Kingdom Prosperity',
    duration: '1:12:45', thumbnail: '/images/founder4.jpg', audioUrl: '', featured: true,
    plays: 1247, downloads: 389, dateAdded: '2025-05-18T10:00:00Z',
    description: 'A powerful message on breaking financial curses and walking into divine abundance. Apostle Joseph unveils the spiritual roots of poverty and releases prophetic decrees for financial breakthrough.',
  },
  {
    id: 's2', title: 'The Blood of Jesus Speaks',
    apostle: 'Apostle Joseph Akwasi Akowuah', date: '2025-05-14',
    serviceType: 'Wednesday Service', topic: 'Salvation', series: '',
    duration: '54:20', thumbnail: '/images/bbcprayer.jpg', audioUrl: '', featured: false,
    plays: 892, downloads: 241, dateAdded: '2025-05-14T18:00:00Z',
    description: 'Discover the redemptive power in the blood of Jesus Christ. This teaching exposes how the blood speaks mercy, healing, and deliverance over every situation in your life.',
  },
  {
    id: 's3', title: 'Jericho Prayer: Walls Must Fall',
    apostle: 'Apostle Joseph Akwasi Akowuah', date: '2025-05-08',
    serviceType: 'Jericho Prayer', topic: 'Prayer', series: 'Prophetic Prayer',
    duration: '2:05:00', thumbnail: '/images/bbccon.jpg', audioUrl: '', featured: true,
    plays: 2103, downloads: 567, dateAdded: '2025-05-08T08:00:00Z',
    description: 'Experience the intensity of the Jericho Prayer as Apostle Joseph leads powerful decrees that collapse spiritual walls. Every barrier standing between you and your testimony must fall.',
  },
  {
    id: 's4', title: 'Total Deliverance Night',
    apostle: 'Apostle Joseph Akwasi Akowuah', date: '2025-04-25',
    serviceType: 'All-Night Warfare', topic: 'Deliverance', series: '',
    duration: '3:45:00', thumbnail: '/images/midnight-prayers.png', audioUrl: '', featured: false,
    plays: 1567, downloads: 478, dateAdded: '2025-04-25T22:00:00Z',
    description: 'A full all-night session of warfare, deliverance prayers, and prophetic declarations. Chains were broken, demons were expelled, and lives were transformed.',
  },
  {
    id: 's5', title: 'Divine Healing is Your Portion',
    apostle: 'Apostle Joseph Akwasi Akowuah', date: '2025-04-13',
    serviceType: 'Sunday Service', topic: 'Healing', series: 'Walking in Miracles',
    duration: '58:35', thumbnail: '/images/sun-servc.jpg', audioUrl: '', featured: false,
    plays: 934, downloads: 312, dateAdded: '2025-04-13T08:00:00Z',
    description: 'Receive your healing today as Apostle Joseph teaches on the covenant of divine health. Scripture-packed and anointed declaration-filled message for all who are sick.',
  },
  {
    id: 's6', title: 'Purpose and Destiny Activation',
    apostle: 'Apostle Joseph Akwasi Akowuah', date: '2025-03-30',
    serviceType: 'Sunday Service', topic: 'Purpose', series: 'Destiny Uncovered',
    duration: '1:08:22', thumbnail: '/images/founder4.jpg', audioUrl: '', featured: false,
    plays: 743, downloads: 198, dateAdded: '2025-03-30T08:00:00Z',
    description: 'Discover the divine blueprint for your life as Apostle Joseph unlocks prophetic insight into purpose, calling, and kingdom assignment. Your season of activation has come.',
  },
  {
    id: 's7', title: 'Marriage Restoration & Family Healing',
    apostle: 'Apostle Joseph Akwasi Akowuah', date: '2025-03-19',
    serviceType: 'Wednesday Service', topic: 'Marriage', series: '',
    duration: '47:18', thumbnail: '/images/bbcprayer.jpg', audioUrl: '', featured: false,
    plays: 621, downloads: 187, dateAdded: '2025-03-19T18:00:00Z',
    description: 'A tender but powerful message addressing broken homes, marital conflicts, and family division. Apostle Joseph releases healing and restoration over every household.',
  },
  {
    id: 's8', title: 'Prophetic Word for the New Season',
    apostle: 'Apostle Joseph Akwasi Akowuah', date: '2025-01-05',
    serviceType: 'Special Programme', topic: 'Prophecy', series: 'New Year Prophetic',
    duration: '1:34:50', thumbnail: '/images/bbccon.jpg', audioUrl: '', featured: true,
    plays: 3891, downloads: 1204, dateAdded: '2025-01-05T08:00:00Z',
    description: 'A season-defining prophetic message released at the dawn of the new year. Apostle Joseph speaks into the destinies of nations, families, and individuals for the year ahead.',
  },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function fmtTime(sec: number): string {
  if (!sec || isNaN(sec)) return '0:00';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}
function prettyDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
function monthOf(d: string) { return new Date(d).toLocaleDateString('en-GB', { month: 'long' }); }
function yearOf(d: string)  { return String(new Date(d).getFullYear()); }

/* ─── Sermon Card ────────────────────────────────────────────────────────── */

interface CardProps {
  sermon: Sermon;
  isActive: boolean;
  isPlaying: boolean;
  saved: boolean;
  shareMsg: string;
  onPlay: (s: Sermon) => void;
  onDownload: (s: Sermon) => void;
  onShare: (s: Sermon) => void;
  onToggleSave: (id: string) => void;
}

const SermonCard: React.FC<CardProps> = ({
  sermon, isActive, isPlaying, saved, shareMsg,
  onPlay, onDownload, onShare, onToggleSave,
}) => (
  <div className={`bg-slate-900 border rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:border-amber-600/40 group ${
    isActive ? 'border-amber-500/50 shadow-xl shadow-amber-600/10' : 'border-slate-800'
  }`}>
    {/* Thumbnail */}
    <div className="relative h-48 overflow-hidden flex-shrink-0">
      <img
        src={sermon.thumbnail || '/images/founder4.jpg'}
        alt={sermon.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        onError={(e) => { (e.target as HTMLImageElement).src = '/images/founder4.jpg'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

      {/* Play / Pause overlay */}
      <button
        onClick={() => onPlay(sermon)}
        className="absolute inset-0 flex items-center justify-center"
        aria-label={`Play ${sermon.title}`}
      >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
          isActive && isPlaying
            ? 'bg-amber-600 scale-110'
            : 'bg-black/50 backdrop-blur-sm group-hover:bg-amber-600 group-hover:scale-105'
        }`}>
          {isActive && isPlaying ? (
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
            </svg>
          )}
        </div>
      </button>

      <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
        {sermon.duration}
      </span>
      {sermon.featured && (
        <span className="absolute top-3 left-3 bg-amber-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
          Featured
        </span>
      )}
    </div>

    {/* Body */}
    <div className="p-5 flex flex-col flex-1">
      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full w-fit mb-3 border ${TYPE_COLORS[sermon.serviceType] || 'bg-slate-700/50 text-slate-400 border-slate-700'}`}>
        {sermon.serviceType}
      </span>

      <h3 className="text-white font-bold text-[15px] leading-snug mb-1 line-clamp-2">{sermon.title}</h3>
      <p className="text-amber-500/80 text-[11px] font-bold mb-2">{sermon.apostle}</p>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-500 text-[10px] mb-3">
        <span>{prettyDate(sermon.date)}</span>
        {sermon.series && <><span>·</span><span className="text-slate-400 italic">{sermon.series}</span></>}
      </div>

      <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 flex-1 mb-4">
        {sermon.description}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 text-slate-600 text-[10px] font-bold mb-4">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
          </svg>
          {sermon.plays.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          {sermon.downloads.toLocaleString()}
        </span>
        {sermon.topic && <span className="text-amber-600/60">#{sermon.topic}</span>}
      </div>

      {/* Action row */}
      <div className="flex items-center gap-1 border-t border-slate-800 pt-4">
        <button
          onClick={() => onDownload(sermon)}
          disabled={!sermon.audioUrl}
          title={sermon.audioUrl ? 'Download' : 'Audio coming soon'}
          className="flex-1 flex flex-col items-center gap-1 py-1.5 text-slate-500 hover:text-amber-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          <span className="text-[9px] font-black uppercase tracking-wider">Download</span>
        </button>

        <button
          onClick={() => onShare(sermon)}
          className="flex-1 flex flex-col items-center gap-1 py-1.5 text-slate-500 hover:text-amber-500 transition-colors"
        >
          {shareMsg === sermon.id ? (
            <span className="text-green-400 text-[10px] font-black">✓ Copied!</span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
              <span className="text-[9px] font-black uppercase tracking-wider">Share</span>
            </>
          )}
        </button>

        <button
          onClick={() => onToggleSave(sermon.id)}
          className={`flex-1 flex flex-col items-center gap-1 py-1.5 transition-colors ${saved ? 'text-amber-500' : 'text-slate-500 hover:text-amber-500'}`}
        >
          <svg className={`w-4 h-4 ${saved ? 'fill-amber-500' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
          <span className="text-[9px] font-black uppercase tracking-wider">{saved ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </div>
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────────────── */

const Preaching: React.FC = () => {
  const [sermons, setSermons] = useState<Sermon[]>(() => {
    try {
      const raw = localStorage.getItem(SERMONS_KEY);
      const parsed: Sermon[] = raw ? JSON.parse(raw) : [];
      return parsed.length > 0 ? parsed : SAMPLE_SERMONS;
    } catch { return SAMPLE_SERMONS; }
  });

  /* Filters */
  const [search,       setSearch]       = useState('');
  const [filterYear,   setFilterYear]   = useState('All Years');
  const [filterMonth,  setFilterMonth]  = useState('All Months');
  const [filterType,   setFilterType]   = useState('All Types');
  const [filterTopic,  setFilterTopic]  = useState('All Topics');
  const [filterSeries, setFilterSeries] = useState('All Series');

  /* Player */
  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(null);
  const [isPlaying,     setIsPlaying]     = useState(false);
  const [currentTime,   setCurrentTime]   = useState(0);
  const [audioDur,      setAudioDur]      = useState(0);
  const [volume,        setVolume]        = useState(1);
  const [speed,         setSpeed]         = useState(1);
  const [showPlayer,    setShowPlayer]    = useState(false);
  const [noAudio,       setNoAudio]       = useState(false);

  /* Listen Later */
  const [listenLater, setListenLater] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(LISTEN_LATER_KEY) || '[]'); } catch { return []; }
  });
  const [shareMsg, setShareMsg] = useState('');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* Audio events */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime  = () => setCurrentTime(audio.currentTime);
    const onMeta  = () => setAudioDur(audio.duration);
    const onEnded = () => setIsPlaying(false);
    audio.addEventListener('timeupdate',     onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended',          onEnded);
    return () => {
      audio.removeEventListener('timeupdate',     onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended',          onEnded);
    };
  }, [currentSermon]);

  /* Scroll-reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* Sync sermons if admin updates them from another tab */
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SERMONS_KEY && e.newValue) {
        try { setSermons(JSON.parse(e.newValue)); } catch { /* */ }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const saveSermons = useCallback((updated: Sermon[]) => {
    setSermons(updated);
    localStorage.setItem(SERMONS_KEY, JSON.stringify(updated));
  }, []);

  /* Player controls */
  const playSermon = useCallback((s: Sermon) => {
    if (!s.audioUrl) { setNoAudio(true); setTimeout(() => setNoAudio(false), 3500); return; }
    setCurrentSermon(s);
    setShowPlayer(true);
    setCurrentTime(0);
    setAudioDur(0);
    if (audioRef.current) {
      audioRef.current.src = s.audioUrl;
      audioRef.current.playbackRate = speed;
      audioRef.current.volume = volume;
      audioRef.current.load();
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
    saveSermons(sermons.map(x => x.id === s.id ? { ...x, plays: x.plays + 1 } : x));
  }, [sermons, speed, volume, saveSermons]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {}); }
  };

  const seek = (v: number) => { if (audioRef.current) audioRef.current.currentTime = v; setCurrentTime(v); };
  const setVol = (v: number) => { if (audioRef.current) audioRef.current.volume = v; setVolume(v); };
  const setSpd = (v: number) => { if (audioRef.current) audioRef.current.playbackRate = v; setSpeed(v); };

  const handleDownload = useCallback((s: Sermon) => {
    if (!s.audioUrl) return;
    const a = document.createElement('a');
    a.href = s.audioUrl; a.download = `${s.title} – ${s.apostle}.mp3`; a.click();
    saveSermons(sermons.map(x => x.id === s.id ? { ...x, downloads: x.downloads + 1 } : x));
  }, [sermons, saveSermons]);

  const handleShare = useCallback((s: Sermon) => {
    const url = `${window.location.origin}${window.location.pathname}#/preaching`;
    const text = `"${s.title}" by ${s.apostle} – BBC International`;
    if (navigator.share) { navigator.share({ title: s.title, text, url }); }
    else {
      navigator.clipboard.writeText(`${text}\n${url}`).then(() => {
        setShareMsg(s.id); setTimeout(() => setShareMsg(''), 2500);
      });
    }
  }, []);

  const toggleSave = useCallback((id: string) => {
    setListenLater(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem(LISTEN_LATER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  /* Filter logic */
  const allSeries    = [...new Set(sermons.map(s => s.series).filter(Boolean))];
  const isFiltering  = search || filterYear !== 'All Years' || filterMonth !== 'All Months' || filterType !== 'All Types' || filterTopic !== 'All Topics' || filterSeries !== 'All Series';

  const filtered = sermons.filter(s => {
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) &&
        !s.description.toLowerCase().includes(search.toLowerCase()) &&
        !s.topic.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterYear   !== 'All Years'   && yearOf(s.date)  !== filterYear)   return false;
    if (filterMonth  !== 'All Months'  && monthOf(s.date) !== filterMonth)  return false;
    if (filterType   !== 'All Types'   && s.serviceType   !== filterType)   return false;
    if (filterTopic  !== 'All Topics'  && s.topic         !== filterTopic)  return false;
    if (filterSeries !== 'All Series'  && s.series        !== filterSeries) return false;
    return true;
  });

  const featured = sermons.filter(s => s.featured);
  const trending  = [...sermons].sort((a, b) => b.plays - a.plays).slice(0, 3);

  const cardProps = (s: Sermon) => ({
    sermon: s,
    isActive: currentSermon?.id === s.id,
    isPlaying: currentSermon?.id === s.id && isPlaying,
    saved: listenLater.includes(s.id),
    shareMsg,
    onPlay: playSermon,
    onDownload: handleDownload,
    onShare: handleShare,
    onToggleSave: toggleSave,
  });

  const filterDefs = [
    { value: filterYear,   onChange: setFilterYear,   opts: YEARS },
    { value: filterMonth,  onChange: setFilterMonth,  opts: MONTHS_LIST },
    { value: filterType,   onChange: setFilterType,   opts: SERVICE_TYPES },
    { value: filterTopic,  onChange: setFilterTopic,  opts: TOPICS },
    { value: filterSeries, onChange: setFilterSeries, opts: ['All Series', ...allSeries] },
  ];

  /* ── Render ──────────────────────────────────────────────── */

  return (
    <div className={`min-h-screen bg-slate-950 text-white animate-fadeIn ${showPlayer ? 'pb-28' : ''}`}>
      <audio ref={audioRef} preload="metadata" />

      {/* ── No-audio toast ── */}
      {noAudio && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-800 border border-amber-600/30 text-white text-sm px-6 py-3 rounded-2xl shadow-2xl animate-slideUp whitespace-nowrap">
          🎙️ Audio coming soon —{' '}
          <a href="https://www.facebook.com/AkowuahJosephMinistries" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">listen on Facebook</a>
        </div>
      )}

      {/* ══ Hero ══ */}
      <section className="relative py-28 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="/images/bbcprayer.jpg" alt="" aria-hidden className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <span className="text-amber-500 text-[11px] font-black uppercase tracking-[0.4em] mb-5 block animate-fadeIn">
            Audio Sermon Library
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-5 animate-slideUp leading-tight">
            <span style={{ background: 'linear-gradient(135deg,#f59e0b,#b45309)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Rhema
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed mb-10 animate-slideUp">
            Stream or download transforming messages by Apostle Joseph Akwasi Akowuah.
            Heaven's word for every season of your life.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto animate-slideUp">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by title, topic, or keyword…"
              className="w-full bg-white/8 border border-white/15 text-white rounded-2xl pl-14 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-600 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ══ Stats bar ══ */}
      <section className="bg-amber-600 py-6">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Sermons',  val: sermons.length },
            { label: 'Plays',    val: sermons.reduce((a, s) => a + s.plays, 0).toLocaleString() },
            { label: 'Downloads',val: sermons.reduce((a, s) => a + s.downloads, 0).toLocaleString() },
            { label: 'Series',   val: allSeries.length },
          ].map(st => (
            <div key={st.label}>
              <p className="text-2xl font-black text-white">{st.val}</p>
              <p className="text-amber-100 text-[10px] uppercase tracking-widest font-bold">{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* ══ Filters ══ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-12 reveal">
          {filterDefs.map((f, i) => (
            <select
              key={i} value={f.value} onChange={e => f.onChange(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
        </div>

        {/* ══ Featured + Trending (only when not filtering) ══ */}
        {!isFiltering && (
          <>
            <section className="mb-16 reveal">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-amber-500 text-2xl">★</span> Featured Messages
                <span className="text-slate-600 text-sm font-normal">({featured.length})</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map(s => <SermonCard key={s.id} {...cardProps(s)} />)}
              </div>
            </section>

            <section className="mb-16 reveal">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">🔥</span> Most Listened
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {trending.map(s => <SermonCard key={s.id} {...cardProps(s)} />)}
              </div>
            </section>
          </>
        )}

        {/* ══ All / filtered ══ */}
        <section className="reveal">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <h2 className="text-xl font-bold text-white">
              {search ? `Results for "${search}"` : isFiltering ? 'Filtered Messages' : 'All Messages'}
              <span className="ml-3 text-slate-600 text-sm font-normal">({filtered.length})</span>
            </h2>
            {isFiltering && (
              <button
                onClick={() => { setSearch(''); setFilterYear('All Years'); setFilterMonth('All Months'); setFilterType('All Types'); setFilterTopic('All Topics'); setFilterSeries('All Series'); }}
                className="text-xs text-amber-500 hover:text-amber-400 font-bold"
              >
                Clear filters ×
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24 text-slate-600">
              <p className="text-5xl mb-4">🎙️</p>
              <p className="text-xl font-bold text-slate-400">No messages found</p>
              <p className="text-sm mt-2">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(s => <SermonCard key={s.id} {...cardProps(s)} />)}
            </div>
          )}
        </section>
      </div>

      {/* ══ Sticky Mini Player ══ */}
      {showPlayer && currentSermon && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/98 backdrop-blur-xl border-t border-amber-600/20 shadow-2xl">
          {/* Clickable seek strip */}
          <div className="h-1 bg-slate-800 relative cursor-pointer group/seek">
            <div className="h-full bg-gradient-to-r from-amber-600 to-amber-500 transition-all duration-150"
              style={{ width: `${audioDur ? (currentTime / audioDur) * 100 : 0}%` }} />
            <input
              type="range" min={0} max={audioDur || 100} value={currentTime}
              onChange={e => seek(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 h-full cursor-pointer"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
            {/* Thumbnail */}
            <img src={currentSermon.thumbnail || '/images/founder4.jpg'} alt=""
              className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-lg" />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">{currentSermon.title}</p>
              <p className="text-[10px] text-slate-500">
                {currentSermon.apostle} ·{' '}
                <span className="text-amber-500">{fmtTime(currentTime)}</span>
                {' / '}{fmtTime(audioDur)}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Speed */}
              <select value={speed} onChange={e => setSpd(Number(e.target.value))}
                className="hidden sm:block bg-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1.5 border border-slate-700 focus:outline-none cursor-pointer">
                {[0.75, 1, 1.25, 1.5, 2].map(v => <option key={v} value={v}>{v}×</option>)}
              </select>

              {/* Volume */}
              <div className="hidden md:flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd"/>
                </svg>
                <input type="range" min={0} max={1} step={0.05} value={volume}
                  onChange={e => setVol(Number(e.target.value))}
                  className="w-20 accent-amber-500 cursor-pointer" />
              </div>

              {/* Play / Pause */}
              <button onClick={togglePlay}
                className="w-11 h-11 bg-amber-600 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95">
                {isPlaying ? (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                  </svg>
                )}
              </button>

              {/* Download */}
              <button onClick={() => handleDownload(currentSermon)} disabled={!currentSermon.audioUrl}
                className="hidden sm:flex w-8 h-8 items-center justify-center text-slate-500 hover:text-amber-500 transition-colors disabled:opacity-30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
              </button>

              {/* Close */}
              <button onClick={() => { setShowPlayer(false); audioRef.current?.pause(); setIsPlaying(false); }}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Preaching;
