
import React, { useState, useEffect, useCallback, useRef } from 'react';

const slideImages = [
  '/images/bbc1.jpg',
  '/images/bbc2.jpg',
  '/images/bbc3.jpg',
  '/images/bbc4.jpg',
  '/images/bbc5.jpg',
  '/images/bbc6.jpg',
  '/images/bbc7.jpg',
  '/images/bbc8.jpg',
  '/images/bbc9.jpg',
  '/images/bbc10.jpg',
];

const stats = [
  { number: '15+',  label: 'Years of Ministry'   },
  { number: '10K+', label: 'Souls Won to Christ'  },
  { number: '20+',  label: 'Nations Touched'      },
  { number: '500+', label: 'Weekly Worshippers'   },
];

const pillars = [
  {
    title: 'Prophetic Altar',
    desc:  'Personal prophetic words, divine guidance, and spiritual activation for every season of your life.',
    icon:  '🔥',
    link:  '#/ministries',
    img:   '/images/bbcprayer.jpg',
    color: 'from-amber-600 to-amber-800',
  },
  {
    title: 'Total Deliverance',
    desc:  'Complete freedom from spiritual bondages, generational curses, and demonic oppression through Jesus.',
    icon:  '⚔️',
    link:  '#/ministries',
    img:   '/images/crusade1.jpg',
    color: 'from-slate-700 to-slate-900',
  },
  {
    title: 'The Living Word',
    desc:  'Sound apostolic teaching from the uncompromised Word of God that builds unshakeable faith and character.',
    icon:  '📖',
    link:  '#/sermons',
    img:   '/images/founder4.jpg',
    color: 'from-blue-700 to-blue-900',
  },
];

const testimonials = [
  {
    name:     'Sister Abena Asante',
    location: 'Kumasi, Ghana',
    text:     'I came to BBC International broken and without work. After the prophetic altar, I received my miracle within a week. God is truly alive in this ministry!',
  },
  {
    name:     'Brother Emmanuel Kwesi',
    location: 'Accra, Ghana',
    text:     'The all-night prayers changed my family forever. Three years of spiritual battles ended in one single service. Apostle Joseph\'s prophetic word was exact and on point.',
  },
  {
    name:     'Sister Grace Osei',
    location: 'London, UK',
    text:     'Even watching online, I felt the tangible presence of God. I was healed of a condition that doctors said was permanent. All glory to Jesus!',
  },
  {
    name:     'Deacon Kofi Mensah',
    location: 'Kumasi, Ghana',
    text:     'The Jericho Prayer Service unlocked doors that had been shut for 10 years. My business, family, and health were all restored in one season.',
  },
];

const announcements = [
  '📣  Sunday Grace Hour Service — 8:00 AM – 12:00 PM',
  '🔥  Friday All-Night Warfare — 10:00 PM – 3:00 AM',
  '🙏  Jericho Prayer — Every Thursday 8:00 AM',
  '💒  Women Fellowship — Every Tuesday 10:00 AM',
  '🌍  Convention 2026 — Date To Be Announced',
  '📖  Mid-Week Blood of Jesus Service — Wednesday 6:00 PM',
];

const Home: React.FC = () => {
  const [currentSlide,      setCurrentSlide]      = useState(0);
  const [testimonialIdx,    setTestimonialIdx]    = useState(0);
  const [email,             setEmail]             = useState('');
  const [subStatus,         setSubStatus]         = useState<'idle' | 'ok' | 'err'>('idle');
  const observerRef = useRef<IntersectionObserver | null>(null);

  /* ── Scroll-reveal observer ── */
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(
      (el) => observerRef.current?.observe(el)
    );
    return () => observerRef.current?.disconnect();
  }, []);

  /* ── Slideshow auto-advance ── */
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  /* ── Testimonial auto-rotate ── */
  useEffect(() => {
    const id = setInterval(() => setTestimonialIdx((p) => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(id);
  }, []);

  const navigate = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.location.hash = href;
  }, []);

  const goPrev = () => setCurrentSlide((p) => (p - 1 + slideImages.length) % slideImages.length);
  const goNext = () => setCurrentSlide((p) => (p + 1) % slideImages.length);

  const handleSubscribe = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Integration point for newsletter service (Mailchimp, etc.)
    setSubStatus('ok');
    setEmail('');
  };

  return (
    <div>
      {/* ══ 1. Announcement Ticker ══ */}
      <div className="bg-slate-900 border-b border-amber-600/20 py-2.5 overflow-hidden">
        <div className="animate-ticker inline-flex whitespace-nowrap">
          {[...announcements, ...announcements].map((a, i) => (
            <span key={i} className="ticker-item text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              {a}
              <span className="mx-6 text-amber-600/50" aria-hidden="true">|</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ 2. Hero Section ══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/images/mainp1.jpg"
            alt="BBC International worship service"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="hero-overlay absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 lg:py-40">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-amber-600/20 border border-amber-600/40 text-amber-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fadeIn">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              Your Season of Divine Change
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.08] tracking-tight animate-slideUp">
              BLESSED{' '}
              <span className="text-gold-gradient">BAPTIST CHURCH</span>{' '}
              INTERNATIONAL
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-12 leading-relaxed max-w-xl font-light animate-slideUp delay-100">
              Join Apostle Joseph Akwasi Akowuah and witness the raw power of the Holy Spirit in
              Prayer, Prophecy, Healing, and Restoration.
            </p>

            <div className="flex flex-wrap gap-4 animate-slideUp delay-200">
              <a
                href="#/watch-live"
                onClick={(e) => navigate(e, '#/watch-live')}
                className="inline-flex items-center gap-3 bg-amber-600 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-amber-500 transition-all duration-300 shadow-xl shadow-amber-900/40 hover:shadow-amber-600/50 hover:scale-[1.02] active:scale-95"
              >
                <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" aria-hidden="true" />
                Watch Live Stream
              </a>
              <a
                href="#/contact"
                onClick={(e) => navigate(e, '#/contact')}
                className="inline-flex items-center gap-2 glass text-white px-8 py-4 rounded-full font-bold text-base hover:bg-white/10 transition-all duration-300 border border-white/25"
              >
                Send Prayer Request
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float text-white/50">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ══ 3. Stats Bar ══ */}
      <section className="bg-amber-600 py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <p className="text-3xl md:text-4xl font-black text-white mb-1 font-serif">{s.number}</p>
              <p className="text-amber-100 text-xs uppercase tracking-widest font-bold">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ 4. Featured Scripture ══ */}
      <section className="py-20 bg-slate-900 text-center border-y border-amber-600/15 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src="/images/bbcprayer.jpg" alt="" aria-hidden="true" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 reveal">
          <span className="text-amber-500 text-6xl font-serif leading-none">"</span>
          <h2 className="text-xl md:text-3xl font-serif italic text-white mb-6 leading-relaxed -mt-4">
            Go ye into all the world, and preach the gospel to every creature. He that believeth
            and is baptized shall be saved.
          </h2>
          <p className="text-amber-500 font-bold uppercase tracking-[0.35em] text-xs">
            — Mark 16:15–16
          </p>
        </div>
      </section>

      {/* ══ 5. Three Ministry Pillars ══ */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <span className="text-amber-600 text-xs font-black uppercase tracking-[0.35em] mb-3 block">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              Three Pillars of Power
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Every service is a divine encounter. Come expecting a miracle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((p, i) => (
              <a
                key={i}
                href={p.link}
                onClick={(e) => navigate(e, p.link)}
                className="group relative rounded-3xl overflow-hidden shadow-lg card-lift reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${p.color} opacity-80`} />
                </div>
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="text-4xl mb-3">{p.icon}</span>
                  <h3 className="text-2xl font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed line-clamp-2">{p.desc}</p>
                  <span className="mt-4 text-amber-400 text-xs font-black uppercase tracking-widest flex items-center gap-1">
                    Learn more
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. Ministry Slideshow ══ */}
      <section className="py-24 bg-slate-900 border-y border-amber-600/15 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-600 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-800 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12 reveal">
            <span className="text-amber-500 text-xs font-black uppercase tracking-[0.35em] mb-3 block">
              Ministry in Action
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Moments of Glory
            </h2>
          </div>

          {/* Slideshow */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-amber-600/20 aspect-video bg-slate-900">
            {/* Blurred backdrop — fills any letterbox gap */}
            <img
              src={slideImages[currentSlide]}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50 transition-opacity duration-700"
            />
            {/* Full image — nothing cropped */}
            <img
              src={slideImages[currentSlide]}
              alt={`Ministry moment ${currentSlide + 1}`}
              className="relative z-10 w-full h-full object-contain transition-opacity duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />

            {/* Prev / Next arrows */}
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-amber-600/50 transition-all"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-white hover:bg-amber-600/50 transition-all"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Counter badge */}
            <div className="absolute bottom-4 right-4 glass px-3 py-1 rounded-full text-white text-xs font-bold">
              {currentSlide + 1} / {slideImages.length}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {slideImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlide
                    ? 'w-8 h-2.5 bg-amber-500'
                    : 'w-2.5 h-2.5 bg-white/30 hover:bg-amber-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7. Featured Sermon Preview ══ */}
      <section className="py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14 reveal">
            <div>
              <span className="text-amber-600 text-xs font-black uppercase tracking-[0.35em] mb-3 block">
                Latest Teachings
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Featured Messages</h2>
            </div>
            <a
              href="#/sermons"
              onClick={(e) => navigate(e, '#/sermons')}
              className="mt-6 md:mt-0 text-sm font-bold text-amber-600 hover:underline flex items-center gap-1"
            >
              View all sermons
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Miracle Services',      img: '/images/audit.jpg',           desc: 'Experience total liberation as Apostle Joseph teaches on overcoming systemic barriers.' },
              { title: 'Prophetic Teachings',   img: '/images/founder4.jpg',        desc: 'Walk in the prophetic dimension and hear God\'s voice clearly in every situation.' },
              { title: 'All-Night Prayers',     img: '/images/midnight-prayers.png', desc: 'A powerful session of intercession and warfare prayer that changed thousands of lives.' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group card-lift reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="relative h-52 overflow-hidden bg-slate-200">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-amber-600 shadow-lg">
                      <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5 line-clamp-2">{s.desc}</p>
                  <a
                    href="https://www.facebook.com/AkowuahJosephMinistries"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 font-bold text-sm flex items-center gap-1.5 hover:gap-2.5 transition-all"
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
        </div>
      </section>

      {/* ══ 8. Testimonials Slider ══ */}
      <section className="py-28 bg-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img src="/images/bbcprayer.jpg" alt="" aria-hidden="true" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-slate-900/80" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <span className="text-amber-500 text-xs font-black uppercase tracking-[0.35em] mb-3 block reveal">
            Testimonies of Grace
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 reveal">What God is Doing</h2>

          {/* Testimonial card */}
          <div className="relative min-h-[220px]">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-700 ${
                  i === testimonialIdx
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <div className="glass rounded-3xl p-8 md:p-12">
                  <span className="text-5xl text-amber-500 font-serif leading-none">"</span>
                  <p className="text-slate-200 text-lg md:text-xl leading-relaxed italic mb-8 -mt-2">
                    {t.text}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {t.name[0]}
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold text-sm">{t.name}</p>
                      <p className="text-amber-500 text-xs uppercase tracking-widest">{t.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                aria-label={`Testimonial ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  i === testimonialIdx
                    ? 'w-8 h-2.5 bg-amber-500'
                    : 'w-2.5 h-2.5 bg-white/25 hover:bg-amber-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ 9. Quick Services Grid ══ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <span className="text-amber-600 text-xs font-black uppercase tracking-[0.35em] mb-3 block">
              Weekly Schedule
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Join Us This Week
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { day: 'Sunday',    time: '8:00 AM – 12:00 PM', title: 'Grace Hour Service',     icon: '⛪', bg: 'bg-amber-50',  border: 'border-amber-200'  },
              { day: 'Tuesday',   time: '10:00 AM – 12:00 PM', title: 'Women Fellowship',       icon: '🌸', bg: 'bg-rose-50',   border: 'border-rose-200'   },
              { day: 'Wednesday', time: '6:00 PM – 8:30 PM',  title: 'Blood of Jesus Service', icon: '💥', bg: 'bg-blue-50',   border: 'border-blue-200'   },
              { day: 'Thursday',  time: '8:00 AM – 2:30 PM',  title: 'Jericho Prayer',         icon: '🙏', bg: 'bg-green-50',  border: 'border-green-200'  },
              { day: 'Friday',    time: '10:00 PM – 3:00 AM', title: 'All-Night Warfare',      icon: '⚔️', bg: 'bg-slate-50',  border: 'border-slate-200'  },
              { day: 'Online',    time: 'Anytime',            title: 'Watch Live / Archives',  icon: '📡', bg: 'bg-purple-50', border: 'border-purple-200' },
            ].map((s, i) => (
              <a
                key={i}
                href={i === 5 ? '#/watch-live' : '#/events'}
                onClick={(e) => navigate(e, i === 5 ? '#/watch-live' : '#/events')}
                className={`${s.bg} ${s.border} border rounded-2xl p-6 hover:shadow-md transition-all duration-300 group card-lift reveal`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <span className="text-3xl mb-3 block">{s.icon}</span>
                <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.25em]">{s.day}</span>
                <h3 className="text-slate-900 font-bold text-base mt-1 mb-1">{s.title}</h3>
                <p className="text-slate-500 text-sm">{s.time}</p>
              </a>
            ))}
          </div>

          <div className="text-center mt-10 reveal">
            <a
              href="#/events"
              onClick={(e) => navigate(e, '#/events')}
              className="inline-block bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-600/30 active:scale-95"
            >
              Full Event Schedule →
            </a>
          </div>
        </div>
      </section>

      {/* ══ 10. Give / Partner CTA ══ */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/mainp2.jpg" alt="" aria-hidden="true" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/88" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center reveal">
          <span className="text-amber-400 text-xs font-black uppercase tracking-[0.35em] mb-4 block">
            Kingdom Partnerships
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-serif">
            Sow a Seed, Reap a Harvest
          </h2>
          <p className="text-slate-300 text-lg mb-4 leading-relaxed max-w-2xl mx-auto">
            "Give, and it will be given to you. A good measure, pressed down, shaken together and
            running over, will be poured into your lap." — Luke 6:38
          </p>
          <p className="text-slate-400 text-sm mb-12 max-w-xl mx-auto">
            Your financial partnership fuels evangelism, missions, and the technology that carries
            this prophetic word into homes across the globe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#/give"
              onClick={(e) => navigate(e, '#/give')}
              className="inline-block bg-amber-600 text-white px-10 py-4 rounded-full font-bold text-base hover:bg-amber-500 transition-all shadow-xl shadow-amber-900/30 hover:scale-[1.02] active:scale-95"
            >
              Give Online Now
            </a>
            <a
              href="https://wa.me/233240171460"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 glass text-white px-10 py-4 rounded-full font-bold text-base hover:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp Prayer
            </a>
          </div>
        </div>
      </section>

      {/* ══ 11. Newsletter Section ══ */}
      <section className="py-20 bg-amber-600">
        <div className="max-w-3xl mx-auto px-6 text-center reveal">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Stay Connected to the Altar
          </h2>
          <p className="text-amber-100 mb-8 text-base">
            Receive weekly devotionals, service updates, and prophetic announcements directly to your inbox.
          </p>

          {subStatus === 'ok' ? (
            <div className="bg-white/20 rounded-2xl px-8 py-6 inline-block">
              <p className="text-white font-bold text-lg">✓ You are now connected to the Altar!</p>
              <p className="text-amber-100 text-sm mt-1">Check your inbox for a confirmation email.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email address"
                className="flex-1 bg-white/90 text-slate-900 px-6 py-4 rounded-full font-medium focus:outline-none focus:ring-4 focus:ring-white/40 placeholder:text-slate-400"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="text-amber-200/70 text-xs mt-4">
            No spam. Unsubscribe anytime. We honour your privacy.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
