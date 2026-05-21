
import React, { useState, useEffect } from 'react';

/* ── Constants ── */
const ADMIN_PASSWORD  = 'BBC@Admin2025';          // change to env var in production
const STORAGE_KEY     = 'bbc_stream_src';
const HISTORY_KEY     = 'bbc_stream_history';
const SESSION_KEY     = 'bbc_admin_session';
const MAX_HISTORY     = 8;

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
  const [activeTab,   setActiveTab]   = useState<'stream' | 'history' | 'info'>('stream');

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
        <div className="flex gap-1 mb-8 bg-slate-900 border border-slate-800 p-1 rounded-2xl w-fit">
          {(['stream', 'history', 'info'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'stream' ? '📡 Stream' : tab === 'history' ? '🕑 History' : 'ℹ️ Info'}
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
      </div>
    </div>
  );
};

export default AdminDashboard;
