
import React, { useState, useEffect, useRef } from 'react';
import { Sermon, SERMONS_KEY } from '../types';
import {
  getToken, getPageId, clearFBCache, getCacheAge,
  testConnection, FB_TOKEN_KEY, FB_PAGE_ID_KEY, FB_DEFAULT_PAGE,
} from '../services/facebookService';

/* ── Constants ── */
const ADMIN_PASSWORD  = 'BBC@Admin2025';
const STORAGE_KEY     = 'bbc_stream_src';
const HISTORY_KEY     = 'bbc_stream_history';
const SESSION_KEY     = 'bbc_admin_session';
const MAX_HISTORY     = 8;

const SERVICE_TYPES_OPTS = ['Sunday Service', 'Wednesday Service', 'Jericho Prayer', 'All-Night Warfare', 'Special Programme'];
const TOPIC_OPTS         = ['Faith', 'Prayer', 'Healing', 'Deliverance', 'Finances', 'Marriage', 'Purpose', 'Prophecy', 'Salvation', 'Warfare', 'Restoration'];
const BLANK_SERMON: Omit<Sermon, 'id' | 'dateAdded' | 'plays' | 'downloads'> = {
  title: '', apostle: 'Apostle Joseph Akwasi Akowuah', date: '',
  serviceType: 'Sunday Service', topic: 'Faith', series: '', duration: '',
  description: '', thumbnail: '', audioUrl: '', featured: false,
};

const DEFAULT_SRC =
  'https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2FAkowuahJosephMinistries%2Fvideos%2F1146991354277026%2F&show_text=false&width=560&t=0';

/* ── Helpers ── */

/** Convert any Facebook/YouTube URL or raw iframe code → embed src string */
function parseToEmbedSrc(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;

  // 1. Full <iframe …> code — extract src="…"
  const iframeSrc = s.match(/src=["']([^"']+)["']/i);
  if (iframeSrc) return iframeSrc[1];

  // 2. Facebook video URL  →  plugin embed
  //    e.g. https://www.facebook.com/PAGE/videos/VIDEO_ID/
  const fbVideo = s.match(/facebook\.com\/([^/]+)\/videos\/(\d+)/i);
  if (fbVideo) {
    const encoded = encodeURIComponent(`https://www.facebook.com/${fbVideo[1]}/videos/${fbVideo[2]}/`);
    return `https://www.facebook.com/plugins/video.php?height=314&href=${encoded}&show_text=false&width=560&t=0`;
  }

  // 3. Facebook live URL  →  plugin embed
  const fbLive = s.match(/facebook\.com\/([^/?#]+)\/live/i);
  if (fbLive) {
    const encoded = encodeURIComponent(`https://www.facebook.com/${fbLive[1]}/live/`);
    return `https://www.facebook.com/plugins/video.php?height=314&href=${encoded}&show_text=false&width=560&t=0`;
  }

  // 4. YouTube watch  →  embed
  const ytWatch = s.match(/youtube\.com\/watch\?v=([\w-]+)/i);
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}?autoplay=1`;

  // 5. YouTube short link  →  embed
  const ytShort = s.match(/youtu\.be\/([\w-]+)/i);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}?autoplay=1`;

  // 6. YouTube embed URL already  →  pass through
  if (s.includes('youtube.com/embed/') || s.includes('facebook.com/plugins/video')) return s;

  return null;
}

interface StreamRecord {
  src:   string;
  label: string;
  time:  string;
}

/* ══════════════════════════════════════════════════════════ */
/*  LOGIN SCREEN                                             */
/* ══════════════════════════════════════════════════════════ */
const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [pw,    setPw]    = useState('');
  const [error, setError] = useState('');
  const [show,  setShow]  = useState(false);

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onLogin();
    } else {
      setError('Incorrect password. Please try again.');
      setPw('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-3xl flex items-center justify-center text-white font-black text-4xl shadow-2xl mx-auto mb-6">
            J
          </div>
          <h1 className="text-2xl font-bold text-white">BBC International</h1>
          <p className="text-amber-500 text-xs uppercase tracking-[0.3em] font-black mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-white font-bold text-lg mb-1">Welcome back</h2>
          <p className="text-slate-400 text-sm mb-8">Sign in to manage the live stream.</p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={pw}
                  onChange={e => { setPw(e.target.value); setError(''); }}
                  required
                  placeholder="Enter admin password"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-2xl px-5 py-3.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder:text-slate-600 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  {show ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700/50 text-red-400 text-sm px-4 py-3 rounded-2xl font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-amber-500 transition-all shadow-lg shadow-amber-900/30 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Blessed Baptist Church International &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════ */
/*  MAIN ADMIN DASHBOARD                                     */
/* ══════════════════════════════════════════════════════════ */
const AdminDashboard: React.FC = () => {
  const [authed,      setAuthed]      = useState(() => !!sessionStorage.getItem(SESSION_KEY));
  const [currentSrc,  setCurrentSrc]  = useState(() => localStorage.getItem(STORAGE_KEY) || DEFAULT_SRC);
  const [history,     setHistory]     = useState<StreamRecord[]>(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; }
  });

  const [rawInput,    setRawInput]    = useState('');
  const [label,       setLabel]       = useState('');
  const [parsed,      setParsed]      = useState<string | null>(null);
  const [parseErr,    setParseErr]    = useState('');
  const [previewing,  setPreviewing]  = useState(false);
  const [published,   setPublished]   = useState(false);
  const [activeTab,   setActiveTab]   = useState<'stream' | 'history' | 'info' | 'preaching' | 'facebook'>('stream');

  /* ── Facebook state ── */
  const [fbToken,      setFbToken]      = useState(() => getToken());
  const [fbPageId,     setFbPageId]     = useState(() => getPageId());
  const [fbShowToken,  setFbShowToken]  = useState(false);
  const [fbTesting,    setFbTesting]    = useState(false);
  const [fbTestResult, setFbTestResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [fbCacheAge,   setFbCacheAge]   = useState<number | null>(() => getCacheAge(getPageId()));

  const saveFbSettings = () => {
    localStorage.setItem(FB_TOKEN_KEY,   fbToken.trim());
    localStorage.setItem(FB_PAGE_ID_KEY, fbPageId.trim() || FB_DEFAULT_PAGE);
    setFbTestResult({ ok: true, msg: 'Settings saved. Visit the Gallery to sync photos.' });
  };

  const handleTestConnection = async () => {
    if (!fbToken.trim()) return;
    setFbTesting(true);
    setFbTestResult(null);
    try {
      const name = await testConnection(fbToken.trim(), fbPageId.trim() || FB_DEFAULT_PAGE);
      setFbTestResult({ ok: true, msg: `Connected to: ${name}` });
    } catch (err) {
      setFbTestResult({ ok: false, msg: err instanceof Error ? err.message : 'Connection failed.' });
    } finally {
      setFbTesting(false);
    }
  };

  const handleClearCache = () => {
    clearFBCache();
    setFbCacheAge(null);
    setFbTestResult({ ok: true, msg: 'Photo cache cleared. Gallery will re-fetch on next visit.' });
  };

  /* ── Preaching state ── */
  const [sermons, setSermons] = useState<Sermon[]>(() => {
    try { return JSON.parse(localStorage.getItem(SERMONS_KEY) || '[]'); } catch { return []; }
  });
  const [editingId,     setEditingId]     = useState<string | null>(null);
  const [isAdding,      setIsAdding]      = useState(false);
  const [form,          setForm]          = useState({ ...BLANK_SERMON });
  const [uploadFile,    setUploadFile]    = useState<File | null>(null);
  const [uploadPct,     setUploadPct]     = useState(0);
  const [uploadDone,    setUploadDone]    = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveSermons = (updated: Sermon[]) => {
    setSermons(updated);
    localStorage.setItem(SERMONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new StorageEvent('storage', { key: SERMONS_KEY, newValue: JSON.stringify(updated) }));
  };

  const openAdd = () => {
    setForm({ ...BLANK_SERMON });
    setEditingId(null);
    setUploadFile(null);
    setUploadPct(0);
    setUploadDone(false);
    setIsAdding(true);
  };

  const openEdit = (s: Sermon) => {
    setForm({ title: s.title, apostle: s.apostle, date: s.date, serviceType: s.serviceType,
              topic: s.topic, series: s.series, duration: s.duration, description: s.description,
              thumbnail: s.thumbnail, audioUrl: s.audioUrl, featured: s.featured });
    setEditingId(s.id);
    setUploadFile(null);
    setUploadPct(0);
    setUploadDone(false);
    setIsAdding(true);
  };

  const cancelForm = () => { setIsAdding(false); setEditingId(null); };

  const handleAudioFile = (file: File) => {
    const valid = /\.(mp3|wav|m4a|aac)$/i.test(file.name);
    if (!valid) return;
    setUploadFile(file);
    setUploadPct(0);
    setUploadDone(false);
    let pct = 0;
    const iv = setInterval(() => {
      pct += Math.random() * 18 + 4;
      if (pct >= 100) {
        pct = 100;
        clearInterval(iv);
        const url = URL.createObjectURL(file);
        setForm(f => ({ ...f, audioUrl: url }));
        setUploadDone(true);
      }
      setUploadPct(Math.min(Math.floor(pct), 100));
    }, 180);
  };

  const submitSermon = () => {
    if (!form.title || !form.date) return;
    if (editingId) {
      saveSermons(sermons.map(s => s.id === editingId ? { ...s, ...form } : s));
    } else {
      const newS: Sermon = { ...form, id: `s${Date.now()}`, plays: 0, downloads: 0, dateAdded: new Date().toISOString() };
      saveSermons([newS, ...sermons]);
    }
    cancelForm();
  };

  const deleteSermon = (id: string) => {
    saveSermons(sermons.filter(s => s.id !== id));
    setDeleteConfirm(null);
  };

  const toggleFeatured = (id: string) => {
    saveSermons(sermons.map(s => s.id === id ? { ...s, featured: !s.featured } : s));
  };

  /* Parse raw input whenever it changes */
  useEffect(() => {
    setParseErr('');
    setParsed(null);
    setPublished(false);
    if (!rawInput.trim()) return;
    const result = parseToEmbedSrc(rawInput);
    if (result) {
      setParsed(result);
    } else {
      setParseErr('Could not recognise this URL or embed code. Paste a Facebook/YouTube URL or a full <iframe> tag.');
    }
  }, [rawInput]);

  const publish = () => {
    if (!parsed) return;
    const record: StreamRecord = {
      src:   parsed,
      label: label.trim() || 'Untitled Stream',
      time:  new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
    };
    const newHistory = [record, ...history].slice(0, MAX_HISTORY);

    localStorage.setItem(STORAGE_KEY, parsed);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    /* Notify any open LiveStream tab in the same browser */
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: parsed }));

    setCurrentSrc(parsed);
    setHistory(newHistory);
    setPublished(true);
    setPreviewing(false);
    setRawInput('');
    setLabel('');
    setParsed(null);
  };

  const restoreFromHistory = (rec: StreamRecord) => {
    localStorage.setItem(STORAGE_KEY, rec.src);
    window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: rec.src }));
    setCurrentSrc(rec.src);
    setPublished(true);
    setActiveTab('stream');
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  /* ── Stat cards ── */
  const stats = [
    { label: 'Active Stream',  value: currentSrc ? 'LIVE' : 'NONE',  dot: 'bg-green-500' },
    { label: 'Stream History', value: `${history.length} / ${MAX_HISTORY}`, dot: 'bg-amber-500' },
    { label: 'Last Updated',   value: history[0]?.time || '—', dot: 'bg-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Top bar ── */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
              J
            </div>
            <div>
              <span className="font-bold text-white text-sm">BBC International</span>
              <span className="ml-2 text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#/watch-live"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors font-medium flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              View Live Page
            </a>
            <button
              onClick={logout}
              className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-red-400 transition-colors px-4 py-2 rounded-xl hover:bg-red-900/20 border border-transparent hover:border-red-900/30"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Welcome ── */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-1">Stream Control Centre</h1>
          <p className="text-slate-400 text-sm">Manage what viewers see on the Watch Live page.</p>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                <span className="text-slate-400 text-xs uppercase tracking-widest font-bold">{s.label}</span>
              </div>
              <p className="text-white font-bold text-lg leading-tight break-all">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex flex-wrap gap-1 mb-8 bg-slate-900 border border-slate-800 p-1 rounded-2xl w-fit">
          {([
            { id: 'stream',    label: '📡 Stream'    },
            { id: 'history',   label: '🕑 History'   },
            { id: 'preaching', label: '🎙️ Preaching' },
            { id: 'facebook',  label: '📘 Facebook'  },
            { id: 'info',      label: 'ℹ️ Info'      },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════ */}
        {/* TAB: STREAM MANAGER                 */}
        {/* ════════════════════════════════════ */}
        {activeTab === 'stream' && (
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Left: editor */}
            <div className="space-y-6">

              {/* Current active stream */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-300">
                    Active Stream
                  </h2>
                </div>
                <p className="text-slate-500 text-xs break-all leading-relaxed font-mono bg-slate-800/50 p-3 rounded-xl">
                  {currentSrc}
                </p>
              </div>

              {/* Update form */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-300 mb-2">
                  Update Stream
                </h2>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Stream Label (optional)
                  </label>
                  <input
                    type="text"
                    value={label}
                    onChange={e => setLabel(e.target.value)}
                    placeholder='e.g. "Sunday Grace Hour – May 25"'
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Facebook URL, YouTube URL, or &lt;iframe&gt; Embed Code
                  </label>
                  <textarea
                    value={rawInput}
                    onChange={e => setRawInput(e.target.value)}
                    rows={5}
                    placeholder={
                      'Paste any of these:\n' +
                      '• https://www.facebook.com/AkowuahJosephMinistries/videos/1234567/\n' +
                      '• https://www.facebook.com/AkowuahJosephMinistries/live\n' +
                      '• https://www.youtube.com/watch?v=VIDEO_ID\n' +
                      '• Full <iframe src="..."> embed code'
                    }
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm font-mono rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-600 resize-none transition-all leading-relaxed"
                  />
                </div>

                {/* Parse feedback */}
                {parseErr && (
                  <div className="flex items-start gap-3 bg-red-900/20 border border-red-800/40 text-red-400 text-xs px-4 py-3 rounded-2xl">
                    <span className="mt-0.5">⚠️</span>
                    {parseErr}
                  </div>
                )}
                {parsed && !parseErr && (
                  <div className="flex items-start gap-3 bg-green-900/20 border border-green-800/40 text-green-400 text-xs px-4 py-3 rounded-2xl">
                    <span className="mt-0.5">✅</span>
                    <span>Valid embed detected. Ready to preview or publish.</span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setPreviewing(p => !p)}
                    disabled={!parsed}
                    className="flex-1 bg-slate-800 border border-slate-700 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {previewing ? '🔲 Hide Preview' : '👁 Preview'}
                  </button>
                  <button
                    onClick={publish}
                    disabled={!parsed}
                    className="flex-1 bg-amber-600 text-white py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-amber-500 transition-all shadow-lg shadow-amber-900/30 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    🔴 Publish Live
                  </button>
                </div>

                {published && (
                  <div className="flex items-center gap-2 bg-green-900/20 border border-green-800/40 text-green-400 text-sm px-5 py-3.5 rounded-2xl font-bold">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Stream published! The Watch Live page is now updated.
                  </div>
                )}
              </div>
            </div>

            {/* Right: preview player */}
            <div className="space-y-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-300">
                {previewing && parsed ? '👁 Preview' : '📺 Current Live Player'}
              </h2>
              <div className="relative aspect-video bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <iframe
                  key={previewing && parsed ? parsed : currentSrc}
                  src={previewing && parsed ? parsed : currentSrc}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 'none', overflow: 'hidden', display: 'block' }}
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  title="Stream preview"
                />
              </div>
              {previewing && parsed && (
                <p className="text-amber-400 text-xs font-bold uppercase tracking-widest text-center">
                  ⚠️ Preview only — not yet live. Click &quot;Publish Live&quot; to activate.
                </p>
              )}

              {/* Embed src display */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-2">
                  {previewing && parsed ? 'Preview Src' : 'Live Src'}
                </p>
                <p className="text-slate-400 text-xs font-mono break-all leading-relaxed">
                  {previewing && parsed ? parsed : currentSrc}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════ */}
        {/* TAB: HISTORY                        */}
        {/* ════════════════════════════════════ */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-24 text-slate-600">
                <p className="text-5xl mb-4">📭</p>
                <p className="font-bold">No stream history yet.</p>
                <p className="text-sm mt-1">Published streams will appear here.</p>
              </div>
            ) : (
              history.map((rec, i) => (
                <div
                  key={i}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-700/40 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center gap-5 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      {i === 0 && rec.src === currentSrc && (
                        <span className="text-[9px] font-black uppercase tracking-widest bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                      <p className="text-white font-bold text-sm truncate">{rec.label}</p>
                    </div>
                    <p className="text-slate-500 text-[10px] font-mono break-all line-clamp-1">{rec.src}</p>
                    <p className="text-slate-600 text-xs mt-1">{rec.time}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setRawInput(rec.src); setLabel(rec.label); setActiveTab('stream'); }}
                      className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:border-amber-600/50 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => restoreFromHistory(rec)}
                      disabled={rec.src === currentSrc}
                      className="px-4 py-2 text-xs font-black uppercase tracking-wider text-white bg-amber-600 rounded-xl hover:bg-amber-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Restore
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ════════════════════════════════════ */}
        {/* TAB: INFO                           */}
        {/* ════════════════════════════════════ */}
        {activeTab === 'info' && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-5">
              <h2 className="text-white font-bold text-lg mb-2">Supported Stream Sources</h2>

              {[
                {
                  platform: 'Facebook Video',
                  icon: '📘',
                  example: 'https://www.facebook.com/AkowuahJosephMinistries/videos/1146991354277026/',
                  note:    'Any published or live video from the ministry Facebook page.',
                },
                {
                  platform: 'Facebook Live',
                  icon: '🔴',
                  example: 'https://www.facebook.com/AkowuahJosephMinistries/live',
                  note:    'Use during active live broadcasts. Switches to last replay when offline.',
                },
                {
                  platform: 'YouTube Video / Live',
                  icon: '▶️',
                  example: 'https://www.youtube.com/watch?v=VIDEO_ID  or  https://youtu.be/VIDEO_ID',
                  note:    'Full YouTube watch URL or short link. Auto-converts to embed with autoplay.',
                },
                {
                  platform: 'Full iframe Embed Code',
                  icon: '🖥️',
                  example: '<iframe src="https://..." width="560" ...></iframe>',
                  note:    'Paste the entire iframe tag copied from Facebook or YouTube share options.',
                },
              ].map((item) => (
                <div key={item.platform} className="border-t border-slate-800 pt-5 first:border-0 first:pt-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{item.icon}</span>
                    <span className="text-white font-bold text-sm">{item.platform}</span>
                  </div>
                  <p className="text-slate-400 text-xs mb-2">{item.note}</p>
                  <p className="text-amber-400/70 text-xs font-mono bg-slate-800/50 px-3 py-2 rounded-xl break-all">
                    {item.example}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-amber-900/20 border border-amber-700/30 rounded-3xl p-6">
              <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                <span>🔒</span> Security Note
              </h3>
              <p className="text-amber-200/70 text-sm leading-relaxed">
                The admin password is set inside the source code (<code className="font-mono text-amber-400">AdminDashboard.tsx</code>).
                For a production deployment, store it as an environment variable and validate
                server-side. Stream URLs are persisted in <code className="font-mono text-amber-400">localStorage</code> and
                visible to any user of this browser — do not store sensitive credentials here.
              </p>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════ */}
        {/* TAB: FACEBOOK                        */}
        {/* ════════════════════════════════════ */}
        {activeTab === 'facebook' && (
          <div className="max-w-2xl space-y-6">

            {/* Status card */}
            <div className={`rounded-3xl p-5 border flex items-center gap-4 ${fbToken ? 'bg-green-900/20 border-green-700/30' : 'bg-slate-900 border-slate-800'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${fbToken ? 'bg-green-600/20' : 'bg-slate-800'}`}>
                📘
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  {fbToken ? 'Facebook API Connected' : 'Not Connected'}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {fbToken
                    ? `Page: ${fbPageId || FB_DEFAULT_PAGE} · Cache age: ${fbCacheAge ? `${Math.round(fbCacheAge / 60000)}m` : 'none'}`
                    : 'Enter your Page Access Token below to sync gallery photos from Facebook.'}
                </p>
              </div>
            </div>

            {/* Settings form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
              <h2 className="text-white font-bold text-base">Facebook API Settings</h2>

              {/* Page ID */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Facebook Page ID or Username
                </label>
                <input
                  value={fbPageId}
                  onChange={e => setFbPageId(e.target.value)}
                  placeholder={FB_DEFAULT_PAGE}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-600"
                />
                <p className="text-slate-600 text-[10px] mt-1.5">
                  e.g. <span className="text-slate-500 font-mono">AkowuahJosephMinistries</span> or the numeric Page ID
                </p>
              </div>

              {/* Access Token */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Page Access Token
                </label>
                <div className="relative">
                  <input
                    type={fbShowToken ? 'text' : 'password'}
                    value={fbToken}
                    onChange={e => setFbToken(e.target.value)}
                    placeholder="EAAxxxxxx…"
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-600 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setFbShowToken(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-bold uppercase tracking-wider"
                  >
                    {fbShowToken ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Test result */}
              {fbTestResult && (
                <div className={`flex items-start gap-3 text-xs px-4 py-3 rounded-2xl font-medium ${
                  fbTestResult.ok
                    ? 'bg-green-900/20 border border-green-800/40 text-green-400'
                    : 'bg-red-900/20 border border-red-800/40 text-red-400'
                }`}>
                  <span className="mt-0.5">{fbTestResult.ok ? '✅' : '⚠️'}</span>
                  {fbTestResult.msg}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleTestConnection}
                  disabled={!fbToken.trim() || fbTesting}
                  className="flex-1 bg-slate-800 border border-slate-700 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {fbTesting ? 'Testing…' : 'Test Connection'}
                </button>
                <button
                  onClick={saveFbSettings}
                  disabled={!fbToken.trim()}
                  className="flex-1 bg-amber-600 text-white py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-amber-500 transition-all shadow-lg shadow-amber-900/30 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  Save Settings
                </button>
              </div>

              {/* Clear cache */}
              {fbToken && (
                <button
                  onClick={handleClearCache}
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover:border-slate-600"
                >
                  Clear Photo Cache (force re-fetch)
                </button>
              )}
            </div>

            {/* How to get a token */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-white font-bold text-sm">How to get a Page Access Token</h3>
              {[
                { n: '1', t: 'Go to Facebook Graph API Explorer', d: 'Visit developers.facebook.com/tools/explorer' },
                { n: '2', t: 'Select your Facebook App', d: 'Create a free app at developers.facebook.com if you don\'t have one.' },
                { n: '3', t: 'Choose your Page', d: 'In the "User or Page" dropdown, select your ministry Facebook Page.' },
                { n: '4', t: 'Request permissions', d: 'Add: pages_show_list, pages_read_engagement, public_profile.' },
                { n: '5', t: 'Generate & copy token', d: 'Click Generate Access Token, copy it, and paste it above.' },
                { n: '6', t: 'Extend token life (optional)', d: 'Use the Access Token Debugger to exchange for a 60-day long-lived token.' },
              ].map(step => (
                <div key={step.n} className="flex gap-4">
                  <span className="w-6 h-6 bg-amber-600/20 text-amber-500 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">{step.n}</span>
                  <div>
                    <p className="text-white text-sm font-semibold">{step.t}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Security note */}
            <div className="bg-amber-900/20 border border-amber-700/30 rounded-3xl p-5">
              <p className="text-amber-300 font-bold text-xs mb-1 flex items-center gap-2"><span>🔒</span> Security Note</p>
              <p className="text-amber-200/60 text-xs leading-relaxed">
                Your token is stored in <span className="font-mono text-amber-400">localStorage</span> on this device only and is never sent anywhere except directly to <span className="font-mono text-amber-400">graph.facebook.com</span>.
                Do not share this device's browser storage with untrusted users.
                Tokens expire after ~60 days — return here to refresh when the gallery stops syncing.
              </p>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════ */}
        {/* TAB: PREACHING                       */}
        {/* ════════════════════════════════════ */}
        {activeTab === 'preaching' && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Total Sermons',  val: sermons.length,                                                     dot: 'bg-amber-500' },
                { label: 'Total Plays',    val: sermons.reduce((a, s) => a + s.plays, 0).toLocaleString(),          dot: 'bg-green-500' },
                { label: 'Total Downloads',val: sermons.reduce((a, s) => a + s.downloads, 0).toLocaleString(),      dot: 'bg-blue-500'  },
              ].map(st => (
                <div key={st.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${st.dot}`} />
                  <div>
                    <p className="text-white font-bold text-xl">{st.val}</p>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">{st.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add / Edit Form */}
            {isAdding ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-8">
                <h2 className="text-white font-bold text-lg mb-6">
                  {editingId ? 'Edit Sermon' : 'Upload New Sermon'}
                </h2>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sermon Title *</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Breaking the Spirit of Poverty"
                      className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-600" />
                  </div>

                  {/* Apostle */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Preacher</label>
                    <input value={form.apostle} onChange={e => setForm(f => ({ ...f, apostle: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date Preached *</label>
                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>

                  {/* Service Type */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Service Type</label>
                    <select value={form.serviceType} onChange={e => setForm(f => ({ ...f, serviceType: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer">
                      {SERVICE_TYPES_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Topic</label>
                    <select value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer">
                      {TOPIC_OPTS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Series */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Series (optional)</label>
                    <input value={form.series} onChange={e => setForm(f => ({ ...f, series: e.target.value }))}
                      placeholder="e.g. Kingdom Prosperity"
                      className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-600" />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Duration</label>
                    <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                      placeholder="e.g. 1:12:45"
                      className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-600" />
                  </div>

                  {/* Thumbnail */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Thumbnail URL</label>
                    <input value={form.thumbnail} onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))}
                      placeholder="https://… or /images/founder4.jpg"
                      className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-600" />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      rows={3} placeholder="Short summary of the sermon…"
                      className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-600 resize-none" />
                  </div>

                  {/* Audio section */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Audio File</label>

                    {/* Upload zone */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleAudioFile(f); }}
                      className="border-2 border-dashed border-slate-700 hover:border-amber-600/50 rounded-xl p-6 text-center cursor-pointer transition-all mb-3"
                    >
                      <p className="text-slate-400 text-sm mb-1">
                        {uploadFile ? uploadFile.name : 'Drag & drop or click to upload'}
                      </p>
                      <p className="text-slate-600 text-xs">MP3 · WAV · M4A · AAC — any file size</p>
                      <input
                        ref={fileInputRef} type="file" accept=".mp3,.wav,.m4a,.aac,audio/*"
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleAudioFile(f); }}
                      />
                    </div>

                    {/* Upload progress */}
                    {uploadFile && !uploadDone && (
                      <div className="mb-3">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-bold">
                          <span>Uploading… {uploadPct}%</span>
                          <span>{(uploadFile.size / 1024 / 1024).toFixed(1)} MB</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-600 rounded-full transition-all duration-200" style={{ width: `${uploadPct}%` }} />
                        </div>
                      </div>
                    )}
                    {uploadDone && (
                      <p className="text-green-400 text-xs font-bold mb-3">✓ File ready — session URL created</p>
                    )}

                    {/* Or paste URL */}
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">Or paste a cloud audio URL (recommended for persistence)</p>
                      <input value={form.audioUrl.startsWith('blob:') ? '' : form.audioUrl}
                        onChange={e => setForm(f => ({ ...f, audioUrl: e.target.value }))}
                        placeholder="https://drive.google.com/… or SoundCloud / Dropbox direct link"
                        className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-600" />
                    </div>
                  </div>

                  {/* Featured toggle */}
                  <div className="md:col-span-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, featured: !f.featured }))}
                      className={`w-11 h-6 rounded-full transition-all ${form.featured ? 'bg-amber-600' : 'bg-slate-700'}`}
                    >
                      <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${form.featured ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className="text-slate-300 text-sm font-semibold">Mark as Featured</span>
                  </div>
                </div>

                {/* Form actions */}
                <div className="flex gap-3 pt-2 border-t border-slate-800">
                  <button onClick={cancelForm}
                    className="flex-1 bg-slate-800 border border-slate-700 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all">
                    Cancel
                  </button>
                  <button onClick={submitSermon} disabled={!form.title || !form.date}
                    className="flex-1 bg-amber-600 text-white py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-amber-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    {editingId ? 'Save Changes' : 'Publish Sermon'}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={openAdd}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-amber-900/30 mb-8 active:scale-95">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                Upload New Sermon
              </button>
            )}

            {/* Sermon list */}
            {sermons.length === 0 ? (
              <div className="text-center py-20 text-slate-600">
                <p className="text-5xl mb-4">🎙️</p>
                <p className="font-bold text-slate-400">No sermons yet.</p>
                <p className="text-sm mt-1">Click "Upload New Sermon" to add the first message.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sermons.map(s => (
                  <div key={s.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-all">

                    {/* Thumbnail */}
                    <img src={s.thumbnail || '/images/founder4.jpg'} alt=""
                      onError={e => { (e.target as HTMLImageElement).src = '/images/founder4.jpg'; }}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {s.featured && (
                          <span className="text-[8px] font-black uppercase tracking-widest bg-amber-600/20 text-amber-400 border border-amber-600/20 px-2 py-0.5 rounded-full">
                            Featured
                          </span>
                        )}
                        <span className="text-[8px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                          {s.serviceType}
                        </span>
                        {s.audioUrl ? (
                          <span className="text-[8px] font-black uppercase tracking-widest bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full">Audio ✓</span>
                        ) : (
                          <span className="text-[8px] font-black uppercase tracking-widest bg-red-900/20 text-red-400 px-2 py-0.5 rounded-full">No Audio</span>
                        )}
                      </div>
                      <p className="text-white font-bold text-sm truncate">{s.title}</p>
                      <p className="text-slate-500 text-[10px]">
                        {s.date} · {s.duration} · {s.plays.toLocaleString()} plays · {s.downloads.toLocaleString()} downloads
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      {/* Featured toggle */}
                      <button onClick={() => toggleFeatured(s.id)}
                        title={s.featured ? 'Remove from featured' : 'Mark as featured'}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all border ${s.featured ? 'bg-amber-600/20 text-amber-400 border-amber-600/30 hover:bg-amber-600/30' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-amber-600/30'}`}>
                        ★
                      </button>

                      {/* Edit */}
                      <button onClick={() => openEdit(s)}
                        className="text-xs px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg font-bold hover:border-amber-600/40 transition-all">
                        Edit
                      </button>

                      {/* Delete */}
                      {deleteConfirm === s.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => deleteSermon(s.id)}
                            className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg font-black hover:bg-red-500 transition-all">
                            Confirm
                          </button>
                          <button onClick={() => setDeleteConfirm(null)}
                            className="text-xs px-2 py-1.5 text-slate-400 hover:text-white transition-colors">
                            ×
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(s.id)}
                          className="text-xs px-3 py-1.5 bg-red-900/20 border border-red-900/30 text-red-400 rounded-lg font-bold hover:bg-red-900/40 transition-all">
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
