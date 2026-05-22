
import React, { useState, useRef, useEffect } from 'react';
import { getSpiritualGuidance } from '../services/geminiService';
import { Message } from '../types';

const quickPrompts = [
  'Pray with me for healing and restoration',
  'I need a prophetic word for my finances',
  'I am dealing with depression and fear',
  'Speak into my marriage and family',
  'I feel lost — what is my purpose?',
  'Pray for my breakthrough this season',
  'I am under spiritual attack — help me',
  'How do I strengthen my prayer life?',
];

const AIGuidance: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: 'Shalom, beloved child of God. 🕊️\n\nI am the Prophetic Altar AI of Blessed Baptist Church International, standing under the spiritual covering of Apostle Joseph Akwasi Akowuah.\n\nHeaven has brought you here for a reason. Whatever you are facing — sickness, financial pressure, broken relationships, spiritual attacks, confusion about your purpose, or simply a need for God\'s presence — bring it to this altar.\n\nI will pray with you, speak the Word of God over your life, and release a prophetic declaration into your situation.\n\n**You are not alone. The altar is open. Share what is on your heart.**',
    },
  ]);
  const [input,     setInput]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(1);
      const aiText  = await getSpiritualGuidance(history, trimmed);
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

  const handleSend = () => sendMessage(input);

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20 animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4">

        {/* ── Page header ── */}
        <div className="text-center mb-10">
          <span className="text-amber-600 text-xs font-black uppercase tracking-[0.35em] mb-3 block">
            Apostolic Powered Ministry
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Masofa Altar
          </h1>
          <p className="text-slate-500 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Receive instant scriptural guidance and breakthrough prayers powered by divine wisdom
            and the Word of God.
          </p>
        </div>

        {/* ── Quick prompts ── */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              disabled={isLoading}
              className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-2 rounded-full hover:border-amber-500 hover:text-amber-600 hover:bg-amber-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* ── Chat window ── */}
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200" style={{ height: '640px', display: 'flex', flexDirection: 'column' }}>

          {/* Chat header */}
          <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between flex-shrink-0 border-b border-amber-600/20">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  🕊️
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
              </div>
              <div>
                <h2 className="font-bold text-base leading-none">Prophetic Assistant</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                    Divine Signal Active
                  </p>
                </div>
              </div>
            </div>
            <a
              href="https://wa.me/233240171460"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-black text-amber-400 border border-amber-600/30 px-4 py-2 rounded-full uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all bg-white/5"
            >
              Talk to Human
            </a>
          </div>

          {/* Messages area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/40"
            role="log"
            aria-live="polite"
            aria-label="Chat messages"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}
              >
                {m.role === 'model' && (
                  <div className="w-8 h-8 bg-amber-600 rounded-xl flex items-center justify-center text-sm mr-3 flex-shrink-0 mt-1 shadow-sm">
                    🕊️
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-5 rounded-3xl shadow-sm text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-amber-600 text-white rounded-tr-sm'
                      : 'bg-white text-slate-800 rounded-tl-sm border border-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
                {m.role === 'user' && (
                  <div className="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center text-xs ml-3 flex-shrink-0 mt-1 shadow-sm text-white font-bold">
                    You
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 bg-amber-600 rounded-xl flex items-center justify-center text-sm mr-3 flex-shrink-0 shadow-sm">
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
          <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Request a prayer or biblical guidance…"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all placeholder:text-slate-400"
                aria-label="Message input"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-amber-600 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 group flex-shrink-0"
                aria-label="Send message"
              >
                <svg
                  className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest text-center mt-3 font-bold">
              God is your helper · Believe and receive · Powered by Gemini AI
            </p>
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
          <p className="text-amber-800 text-sm leading-relaxed">
            <span className="font-bold">Note:</span> This AI assistant provides scriptural encouragement and general spiritual guidance.
            For personal prophetic ministry, counseling, or urgent prayer, please{' '}
            <a href="#/contact" onClick={(e) => { e.preventDefault(); window.location.hash = '#/contact'; }} className="font-bold underline">
              contact our ministry directly
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
