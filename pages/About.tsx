
import React, { useEffect, useRef } from 'react';

const stats = [
  { number: '15+',  label: 'Years of Ministry'  },
  { number: '10K+', label: 'Souls Won to Christ' },
  { number: '20+',  label: 'Nations Reached'     },
  { number: '500+', label: 'Weekly Worshippers'  },
];

const pillars = [
  { icon: '🔥', title: 'Prayer',    desc: 'The foundation of all we do — persistent, fervent, and altar-backed intercession.' },
  { icon: '⚡', title: 'Prophecy', desc: 'Apostolic and prophetic ministry revealing God\'s will and counsel for His people.' },
  { icon: '✝️', title: 'The Word', desc: 'Sound, uncompromised biblical teaching that transforms minds and builds faith.' },
  { icon: '🌍', title: 'Missions', desc: 'Taking the Gospel to the ends of the earth — no soul left behind.' },
];

const timeline = [
  { year: '2009', event: 'Joseph Akowuah Ministries founded in Kumasi with a small prayer group of 12.' },
  { year: '2012', event: 'Blessed Baptist Church International formally established. The congregation grows beyond 100.' },
  { year: '2015', event: 'First international crusade. Ministry reaches neighbouring countries across West Africa.' },
  { year: '2018', event: 'Faith and Love Cathedral constructed — a permanent home for the BBC International altar.' },
  { year: '2021', event: 'Masofa TV launched — live streaming brings the altar into homes across the globe.' },
  { year: '2024', event: 'BBC International now reaches 20+ nations with 500+ weekly worshippers.' },
];

const About: React.FC = () => {
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
  }, []);

  const navigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.location.hash = href;
  };

  return (
    <div className="animate-fadeIn">

      {/* ── Hero ── */}
      <section className="bg-slate-900 py-32 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/bbcprayer.jpg" alt="" aria-hidden="true" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-xs mb-4 block">
            Our Foundation
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Built on the <span className="text-gold-gradient">Living Word</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Founded on the pillars of Prayer, Prophecy, and the manifestation of the Holy Spirit —
            BBC International is a global movement for the restoration of man to God.
          </p>
        </div>
      </section>

      {/* ── Stats bar ── */}
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

      {/* ── Apostle Bio ── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            {/* Photo */}
            <div className="lg:w-5/12 reveal-left">
              <div className="relative">
                <div className="absolute -top-5 -left-5 w-full h-full border-2 border-amber-600 rounded-3xl z-0" />
                <img
                  src="/images/founder1.jpg"
                  alt="Apostle Joseph Akwasi Akowuah"
                  className="relative z-10 rounded-3xl shadow-2xl w-full object-cover"
                  loading="lazy"
                />
                {/* Badge */}
                <div className="absolute -bottom-6 right-6 z-20 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl text-center">
                  <p className="text-amber-500 text-[9px] font-black uppercase tracking-widest">Apostle &amp; Founder</p>
                  <p className="text-white font-bold text-sm mt-1">Joseph Akwasi Akowuah</p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="lg:w-7/12 reveal-right">
              <span className="text-amber-600 text-xs font-black uppercase tracking-[0.35em] mb-4 block">
                Meet the Apostle
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
                Apostle Joseph Akwasi Akowuah
              </h2>
              <div className="space-y-5 text-slate-600 leading-relaxed">
                <p>
                  Apostle Joseph Akwasi Akowuah is the founder and senior leader of Blessed Baptist
                  Church International. Carrying a profound mandate to preach the unadulterated Word
                  of God and demonstrate the power of the Holy Spirit, his journey began in Kumasi,
                  Ghana, where he established a small prayer group that has since blossomed into a
                  worldwide ministry.
                </p>
                <p>
                  Known for his apostolic and prophetic ministry, he emphasises the importance of
                  a personal relationship with Jesus Christ, the power of persistent prayer, and the
                  breaking of generational limitations through the prophetic word. His ministry is
                  marked by tangible signs, miracles, and healing that follow the preaching of the Gospel.
                </p>
                <blockquote className="border-l-4 border-amber-600 pl-6 py-2 bg-amber-50 rounded-r-2xl">
                  <p className="font-bold italic text-slate-900 text-lg leading-relaxed">
                    "My mission is simple: to see the captive set free and the name of Jesus
                    glorified in every household."
                  </p>
                  <footer className="text-amber-600 text-xs font-black uppercase tracking-widest mt-3">
                    — Apostle Joseph Akwasi Akowuah
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Four Pillars ── */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <span className="text-amber-600 text-xs font-black uppercase tracking-[0.35em] mb-3 block">
              What Drives Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Core Pillars</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="text-4xl block mb-5">{p.icon}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-slate-900 p-12 rounded-3xl text-white reveal-left">
              <div className="w-14 h-14 bg-amber-600 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-lg">🎯</div>
              <h3 className="text-2xl font-bold text-white mb-5">Our Mission</h3>
              <p className="text-slate-300 leading-relaxed text-lg">
                To liberate the world from the bondages of darkness through prophetic ministry and
                the teaching of Jesus Christ, making disciples of all nations and restoring every
                soul to its divine destiny.
              </p>
            </div>
            <div className="bg-amber-600 p-12 rounded-3xl text-white reveal-right">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-8">👁️</div>
              <h3 className="text-2xl font-bold text-white mb-5">Our Vision</h3>
              <p className="text-amber-100 leading-relaxed text-lg">
                A world where the manifestation of the Holy Spirit is tangible in every life — where
                every soul is restored to its divine purpose and no household is left untouched by
                the Gospel of Jesus Christ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ministry Timeline ── */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 reveal">
            <span className="text-amber-600 text-xs font-black uppercase tracking-[0.35em] mb-3 block">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Ministry Timeline</h2>
          </div>

          <div className="relative">
            {/* Centre line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-amber-200 -translate-x-1/2 hidden md:block" />

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <div
                  key={i}
                  className={`flex flex-col md:flex-row items-center gap-6 reveal ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className={`md:w-5/12 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 inline-block text-left">
                      <p className="text-slate-600 text-sm leading-relaxed">{item.event}</p>
                    </div>
                  </div>
                  {/* Year bubble */}
                  <div className="md:w-2/12 flex justify-center">
                    <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg ring-4 ring-amber-100 z-10">
                      {item.year}
                    </div>
                  </div>
                  <div className="md:w-5/12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-slate-900 text-center text-white">
        <div className="max-w-3xl mx-auto px-4 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start your spiritual journey?
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Join thousands who have found healing, restoration, and purpose through this ministry.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#/contact"
              onClick={(e) => navigate(e, '#/contact')}
              className="bg-amber-600 text-white px-10 py-4 rounded-full font-bold hover:bg-amber-500 transition-all shadow-xl active:scale-95"
            >
              Connect With Us Today
            </a>
            <a
              href="#/ai-guidance"
              onClick={(e) => navigate(e, '#/ai-guidance')}
              className="glass text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
            >
              Speak to Prophetic AI
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
