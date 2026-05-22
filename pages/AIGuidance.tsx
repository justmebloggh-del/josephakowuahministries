
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  getSpiritualGuidance,
  parseGuidanceResponse,
  type GuidanceResponse,
  type ScriptureItem,
  type BibleVersion,
} from '../services/geminiService';
import { Message } from '../types';

/* ── Daily Verses (cycles by day-of-month) ─────────────────────────────────── */
const DAILY_VERSES: ScriptureItem[] = [
  { reference: 'Jeremiah 29:11',      version: 'KJV', verse: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.', context: '' },
  { reference: 'Philippians 4:13',    version: 'KJV', verse: 'I can do all things through Christ which strengtheneth me.', context: '' },
  { reference: 'Isaiah 40:31',        version: 'KJV', verse: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.', context: '' },
  { reference: 'Romans 8:28',         version: 'KJV', verse: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.', context: '' },
  { reference: 'John 3:16',           version: 'KJV', verse: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', context: '' },
  { reference: 'Psalm 23:1',          version: 'KJV', verse: 'The LORD is my shepherd; I shall not want.', context: '' },
  { reference: 'Proverbs 3:5-6',      version: 'KJV', verse: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.', context: '' },
  { reference: 'Isaiah 41:10',        version: 'KJV', verse: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.', context: '' },
  { reference: 'Matthew 6:33',        version: 'KJV', verse: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.', context: '' },
  { reference: 'Psalm 46:1',          version: 'KJV', verse: 'God is our refuge and strength, a very present help in trouble.', context: '' },
  { reference: '2 Timothy 1:7',       version: 'KJV', verse: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.', context: '' },
  { reference: 'Joshua 1:9',          version: 'KJV', verse: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.', context: '' },
  { reference: 'Philippians 4:6-7',   version: 'KJV', verse: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.', context: '' },
  { reference: 'John 14:27',          version: 'KJV', verse: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.', context: '' },
  { reference: 'Psalm 34:18',         version: 'KJV', verse: 'The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.', context: '' },
  { reference: 'Romans 10:13',        version: 'KJV', verse: 'For whosoever shall call upon the name of the Lord shall be saved.', context: '' },
  { reference: 'James 4:7',           version: 'KJV', verse: 'Submit yourselves therefore to God. Resist the devil, and he will flee from you.', context: '' },
  { reference: 'Malachi 3:10',        version: 'KJV', verse: 'Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts, if I will not open you the windows of heaven, and pour you out a blessing, that there shall not be room enough to receive it.', context: '' },
  { reference: 'Matthew 11:28',       version: 'KJV', verse: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', context: '' },
  { reference: 'Romans 8:37',         version: 'KJV', verse: 'Nay, in all these things we are more than conquerors through him that loved us.', context: '' },
  { reference: '1 John 4:4',          version: 'KJV', verse: 'Ye are of God, little children, and have overcome them: because greater is he that is in you, than he that is in the world.', context: '' },
  { reference: 'Psalm 91:11',         version: 'KJV', verse: 'For he shall give his angels charge over thee, to keep thee in all thy ways.', context: '' },
  { reference: 'Isaiah 53:5',         version: 'KJV', verse: 'But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.', context: '' },
  { reference: 'Ephesians 6:11',      version: 'KJV', verse: 'Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.', context: '' },
  { reference: 'John 8:36',           version: 'KJV', verse: 'If the Son therefore shall make you free, ye shall be free indeed.', context: '' },
  { reference: 'Matthew 21:22',       version: 'KJV', verse: 'And all things, whatsoever ye shall ask in prayer, believing, ye shall receive.', context: '' },
  { reference: 'Lamentations 3:22-23',version: 'KJV', verse: 'It is of the LORD\'s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.', context: '' },
  { reference: 'Galatians 6:9',       version: 'KJV', verse: 'And let us not be weary in well doing: for in due season we shall reap, if we faint not.', context: '' },
  { reference: 'Hebrews 11:1',        version: 'KJV', verse: 'Now faith is the substance of things hoped for, the evidence of things not seen.', context: '' },
  { reference: 'Luke 1:37',           version: 'KJV', verse: 'For with God nothing shall be impossible.', context: '' },
  { reference: 'Proverbs 18:10',      version: 'KJV', verse: 'The name of the LORD is a strong tower: the righteous runneth into it, and is safe.', context: '' },
];

const getTodaysVerse = (): ScriptureItem => {
  const day = new Date().getDate();
  return DAILY_VERSES[(day - 1) % DAILY_VERSES.length];
};

/* ── Topic chips ───────────────────────────────────────────────────────────── */
const TOPICS = [
  { icon: '💊', label: 'Healing',          prompt: 'I need prayer and scriptures for divine healing and restoration in my body' },
  { icon: '💰', label: 'Finances',         prompt: 'I need a word about financial breakthrough, provision, and overcoming debt' },
  { icon: '❤️', label: 'Marriage',         prompt: 'I need biblical guidance and prayer for my marriage and family' },
  { icon: '😔', label: 'Anxiety & Fear',   prompt: 'I am struggling with anxiety and fear and need God\'s peace' },
  { icon: '🔥', label: 'Purpose',          prompt: 'I feel lost and need to discover my God-given purpose and calling' },
  { icon: '⚔️', label: 'Spiritual Warfare',prompt: 'I am under spiritual attack and need deliverance prayers and scriptures' },
  { icon: '🕊️', label: 'Forgiveness',      prompt: 'I am struggling with forgiveness — towards others and towards myself' },
  { icon: '✝️', label: 'Faith',            prompt: 'I need to strengthen my faith and understand salvation deeply' },
  { icon: '😢', label: 'Grief & Loss',     prompt: 'I am grieving and need God\'s comfort and healing' },
  { icon: '📖', label: 'Bible Study',      prompt: 'Help me understand and study the Word of God more effectively' },
  { icon: '🌅', label: 'Morning Devotion', prompt: 'Give me a morning devotion and scripture to start my day with God' },
  { icon: '⏳', label: 'Waiting on God',   prompt: 'I have been waiting on God for a long time and need encouragement' },
  { icon: '🙌', label: 'Breakthrough',     prompt: 'I need a prophetic word and prayer for my breakthrough this season' },
  { icon: '👫', label: 'Relationships',    prompt: 'I need biblical wisdom and prayer concerning my relationship' },
  { icon: '🧠', label: 'Depression',       prompt: 'I am dealing with depression and heaviness and need God\'s hope' },
  { icon: '🙏', label: 'Prayer Life',      prompt: 'How do I strengthen my prayer life and hear God\'s voice clearly?' },
];

/* ── Sub-components ────────────────────────────────────────────────────────── */
const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-all font-bold uppercase tracking-widest"
    >
      {copied ? '✓ Copied' : '📋 Copy'}
    </button>
  );
};

const ScriptureCard = ({
  scripture,
  onSave,
  saved,
}: {
  scripture: ScriptureItem;
  onSave: () => void;
  saved: boolean;
}) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-amber-600/20 shadow-lg">
    <div className="flex items-center gap-2 mb-3 flex-wrap">
      <span className="text-amber-400 text-base">📖</span>
      <span className="text-amber-400 font-bold text-sm">{scripture.reference}</span>
      <span className="bg-amber-600/20 text-amber-300 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-amber-600/20">
        {scripture.version}
      </span>
    </div>
    <p className="text-white/90 italic leading-relaxed text-sm sm:text-base mb-3">
      "{scripture.verse}"
    </p>
    {scripture.context && (
      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-white/10 pt-3 mb-3">
        {scripture.context}
      </p>
    )}
    <div className="flex gap-2 flex-wrap">
      <CopyButton text={`"${scripture.verse}" — ${scripture.reference} (${scripture.version})`} />
      <button
        onClick={onSave}
        className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full transition-all font-bold uppercase tracking-widest ${
          saved
            ? 'bg-amber-600/30 text-amber-400 border border-amber-600/30'
            : 'text-slate-400 hover:text-amber-400 bg-white/10 hover:bg-amber-600/20'
        }`}
      >
        {saved ? '♥ Saved' : '♡ Save'}
      </button>
    </div>
  </div>
);

const PrayerBlock = ({ prayer }: { prayer: string }) => (
  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xl">🙏</span>
      <span className="text-amber-800 font-black text-[10px] uppercase tracking-widest">Prayer</span>
    </div>
    <p className="text-slate-700 italic leading-relaxed text-sm whitespace-pre-wrap">{prayer}</p>
  </div>
);

const StructuredMessage = ({
  data,
  savedRefs,
  onSave,
}: {
  data: GuidanceResponse;
  savedRefs: Set<string>;
  onSave: (s: ScriptureItem) => void;
}) => (
  <div className="space-y-4 text-sm">
    {data.acknowledgement && (
      <p className="text-slate-700 leading-relaxed">{data.acknowledgement}</p>
    )}
    {data.declaration && (
      <div className="border-l-4 border-amber-500 pl-4 py-1">
        <p className="text-slate-800 font-semibold italic leading-relaxed">{data.declaration}</p>
      </div>
    )}
    {data.scriptures.length > 0 && (
      <div className="space-y-3">
        {data.scriptures.map((s, i) => (
          <ScriptureCard
            key={i}
            scripture={s}
            saved={savedRefs.has(s.reference)}
            onSave={() => onSave(s)}
          />
        ))}
      </div>
    )}
    {data.encouragement && (
      <p className="text-slate-700 leading-relaxed">{data.encouragement}</p>
    )}
    {data.prayer && <PrayerBlock prayer={data.prayer} />}
    {data.closing && (
      <details className="mt-1">
        <summary className="text-amber-600 text-[11px] font-black uppercase tracking-widest cursor-pointer select-none hover:text-amber-700 transition-colors">
          📞 Contact Ministry
        </summary>
        <div className="mt-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
          <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap">{data.closing}</p>
        </div>
      </details>
    )}
  </div>
);

const VerseOfDay = () => {
  const verse = getTodaysVerse();
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="bg-amber-600/20 border border-amber-600/30 text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            ✦ Verse of the Day
          </span>
          <span className="text-slate-400 text-xs">{dateStr}</span>
        </div>
        <p className="text-white text-lg sm:text-xl font-serif italic leading-relaxed mb-4">
          "{verse.verse}"
        </p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-amber-400 font-bold text-sm">— {verse.reference} ({verse.version})</span>
          <CopyButton text={`"${verse.verse}" — ${verse.reference} (${verse.version})`} />
        </div>
      </div>
    </div>
  );
};

/* ── Main component ────────────────────────────────────────────────────────── */
const AIGuidance: React.FC = () => {
  const [messages,      setMessages]      = useState<Message[]>([
    {
      role: 'model',
      text: 'Shalom, beloved child of God. 🕊️\n\nI am the Masofa Altar AI of Blessed Baptist Church International, standing under the spiritual covering of Apostle Joseph Akwasi Akowuah.\n\nHeaven has brought you here for a reason. Whatever you are facing — sickness, financial pressure, broken relationships, spiritual attacks, confusion about your purpose, or simply a need for God\'s presence — bring it to this altar.\n\nI will pray with you, speak the Word of God over your life, and release a prophetic declaration into your situation. **You are not alone. The altar is open. Share what is on your heart.**',
    },
  ]);
  const [input,         setInput]         = useState('');
  const [isLoading,     setIsLoading]     = useState(false);
  const [bibleVersion,  setBibleVersion]  = useState<BibleVersion>('KJV');
  const [bookmarks,     setBookmarks]     = useState<ScriptureItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('masofa_bookmarks') || '[]'); }
    catch { return []; }
  });
  const [showBookmarks, setShowBookmarks] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  /* Auto-scroll */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  /* Persist bookmarks */
  useEffect(() => {
    localStorage.setItem('masofa_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const saveVerse = useCallback((s: ScriptureItem) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.reference === s.reference)) return prev;
      return [...prev, s];
    });
  }, []);

  const removeBookmark = useCallback((ref: string) => {
    setBookmarks((prev) => prev.filter((b) => b.reference !== ref));
  }, []);

  const savedRefs = new Set(bookmarks.map((b) => b.reference));

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history  = messages.slice(1);
      const aiText   = await getSpiritualGuidance(history, trimmed, bibleVersion);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: aiText || 'May the Lord bless and keep you.' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: 'The spiritual atmosphere is resetting. Please reach out directly to our ministry at +233 24 017 1460 for immediate prayer support.',
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-16 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.35em] mb-3 block">
            Apostolic Powered Ministry
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-3">
            Masofa Altar
          </h1>
          <p className="text-slate-500 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Receive instant scriptural guidance, breakthrough prayers, and the Word of God
            spoken over your life.
          </p>
        </div>

        {/* ── Verse of the Day ─────────────────────────────────────────────── */}
        <VerseOfDay />

        {/* ── Bookmarks bar ────────────────────────────────────────────────── */}
        {bookmarks.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowBookmarks((v) => !v)}
              className="flex items-center gap-2 text-xs font-black text-amber-700 uppercase tracking-widest hover:text-amber-600 transition-colors"
            >
              <span>♥ Saved Scriptures ({bookmarks.length})</span>
              <span className="text-slate-400">{showBookmarks ? '▲' : '▼'}</span>
            </button>
            {showBookmarks && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {bookmarks.map((b) => (
                  <div key={b.reference} className="relative">
                    <ScriptureCard
                      scripture={b}
                      saved={true}
                      onSave={() => removeBookmark(b.reference)}
                    />
                    <button
                      onClick={() => removeBookmark(b.reference)}
                      className="absolute top-3 right-3 text-slate-500 hover:text-red-400 text-xs font-bold transition-colors"
                      title="Remove bookmark"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Topic chips ──────────────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {TOPICS.map((t) => (
            <button
              key={t.label}
              onClick={() => sendMessage(t.prompt)}
              disabled={isLoading}
              className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-2 rounded-full whitespace-nowrap hover:border-amber-500 hover:text-amber-700 hover:bg-amber-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Chat window ──────────────────────────────────────────────────── */}
        <div
          className="bg-white rounded-[1.75rem] shadow-2xl overflow-hidden border border-slate-200"
          style={{ height: '640px', display: 'flex', flexDirection: 'column' }}
        >
          {/* Chat header */}
          <div className="bg-slate-900 px-4 sm:px-6 py-4 text-white flex items-center justify-between flex-shrink-0 border-b border-amber-600/20 gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                  🕊️
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-slate-900" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-sm sm:text-base leading-none truncate">Masofa Altar</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                  <p className="text-slate-400 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold truncate">
                    Divine Signal Active
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Bible version selector */}
              <select
                value={bibleVersion}
                onChange={(e) => setBibleVersion(e.target.value as BibleVersion)}
                className="text-[10px] bg-white/10 text-white border border-white/20 rounded-lg px-2 py-1.5 font-black uppercase tracking-widest cursor-pointer focus:outline-none focus:border-amber-500"
              >
                <option value="KJV" className="bg-slate-900">KJV</option>
                <option value="NIV" className="bg-slate-900">NIV</option>
                <option value="NKJV" className="bg-slate-900">NKJV</option>
              </select>

              <a
                href="https://wa.me/233240171460"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline text-[10px] font-black text-amber-400 border border-amber-600/30 px-3 sm:px-4 py-2 rounded-full uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all bg-white/5 whitespace-nowrap"
              >
                Talk to Human
              </a>
            </div>
          </div>

          {/* Messages area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/40"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((m, idx) => {
              const parsed = m.role === 'model' ? parseGuidanceResponse(m.text) : null;

              return (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}
                >
                  {m.role === 'model' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-600 rounded-xl flex items-center justify-center text-xs sm:text-sm mr-2 sm:mr-3 flex-shrink-0 mt-1 shadow-sm">
                      🕊️
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[82%] p-4 sm:p-5 shadow-sm ${
                      m.role === 'user'
                        ? 'bg-amber-600 text-white rounded-3xl rounded-tr-sm text-sm leading-relaxed'
                        : 'bg-white text-slate-800 rounded-3xl rounded-tl-sm border border-slate-100'
                    }`}
                  >
                    {m.role === 'model' && parsed ? (
                      <StructuredMessage
                        data={parsed}
                        savedRefs={savedRefs}
                        onSave={saveVerse}
                      />
                    ) : (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.text}</p>
                    )}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-800 rounded-xl flex items-center justify-center text-[10px] sm:text-xs ml-2 sm:ml-3 flex-shrink-0 mt-1 shadow-sm text-white font-bold">
                      You
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-600 rounded-xl flex items-center justify-center text-xs sm:text-sm mr-2 sm:mr-3 flex-shrink-0 shadow-sm">
                  🕊️
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-sm flex items-center gap-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Seeking Divine Counsel…
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-100 flex-shrink-0">
            <div className="flex gap-2 sm:gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder="Ask for prayer, scriptures, or biblical guidance…"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all placeholder:text-slate-400"
                aria-label="Message input"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="bg-slate-900 text-white w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center hover:bg-amber-600 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 group flex-shrink-0"
                aria-label="Send message"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest text-center mt-2.5 font-bold">
              God is your helper · Believe and receive · Bible version: {bibleVersion}
            </p>
          </div>
        </div>

        {/* ── Disclaimer ───────────────────────────────────────────────────── */}
        <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 text-center">
          <p className="text-amber-800 text-xs sm:text-sm leading-relaxed">
            <span className="font-bold">Note:</span> This AI assistant provides scriptural encouragement and general spiritual guidance.
            For personal prophetic ministry, counseling, or urgent prayer, please{' '}
            <a
              href="#/contact"
              onClick={(e) => { e.preventDefault(); window.location.hash = '#/contact'; }}
              className="font-bold underline"
            >
              contact our ministry
            </a>{' '}
            or reach us on{' '}
            <a href="https://wa.me/233240171460" target="_blank" rel="noopener noreferrer" className="font-bold underline">
              WhatsApp
            </a>.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AIGuidance;
