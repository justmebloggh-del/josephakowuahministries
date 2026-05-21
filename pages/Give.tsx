
import React, { useEffect, useRef } from 'react';

const givingTiers = [
  {
    name:   'Seed Gift',
    amount: 'Any Amount',
    desc:   'Every seed sown in faith produces a harvest. Give as the Lord leads.',
    icon:   '🌱',
    highlight: false,
  },
  {
    name:   'Ministry Partner',
    amount: 'Monthly Gift',
    desc:   'Become a covenant partner and be part of our global missions and outreach.',
    icon:   '🤝',
    highlight: true,
  },
  {
    name:   'Kingdom Builder',
    amount: 'Major Gift',
    desc:   'Help build the infrastructure of this ministry — church, media, and crusades.',
    icon:   '🏛️',
    highlight: false,
  },
];

const Give: React.FC = () => {
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
    <div className="animate-fadeIn bg-slate-50 min-h-screen">

      {/* ── Hero ── */}
      <section className="relative py-28 bg-slate-900 text-white text-center overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img src="/images/seedtimharvestime.jpg" alt="" aria-hidden="true" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="w-20 h-20 bg-amber-600/20 border border-amber-600/40 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-amber-400 text-xs font-black uppercase tracking-[0.35em] mb-4 block">
            Kingdom Giving
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Honoring God <br className="hidden md:block" />
            Through <span className="text-gold-gradient">Giving</span>
          </h1>
          <p className="text-slate-300 text-xl italic font-light max-w-2xl mx-auto leading-relaxed">
            "Give, and it will be given to you. A good measure, pressed down, shaken together and
            running over, will be poured into your lap." — Luke 6:38
          </p>
        </div>
      </section>

      {/* ── Giving tiers ── */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 reveal">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Choose How to Give</h2>
            <p className="text-slate-500 mt-2">Every level of giving is honoured before God.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {givingTiers.map((tier, i) => (
              <div
                key={i}
                className={`rounded-3xl p-8 text-center transition-all duration-300 reveal card-lift ${
                  tier.highlight
                    ? 'bg-slate-900 text-white shadow-2xl ring-2 ring-amber-600'
                    : 'bg-slate-50 border border-slate-200 hover:border-amber-200'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="text-4xl mb-4 block">{tier.icon}</span>
                <h3 className={`text-xl font-bold mb-1 ${tier.highlight ? 'text-white' : 'text-slate-900'}`}>
                  {tier.name}
                </h3>
                <p className={`font-black text-sm uppercase tracking-wider mb-4 ${tier.highlight ? 'text-amber-400' : 'text-amber-600'}`}>
                  {tier.amount}
                </p>
                <p className={`text-sm leading-relaxed ${tier.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
                  {tier.desc}
                </p>
                {tier.highlight && (
                  <span className="mt-4 inline-block bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Most Chosen
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Giving methods ── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 reveal">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Ways to Give</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Mobile Money */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 reveal-left">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">📱</div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Mobile Money</h3>
                  <p className="text-slate-500 text-sm">Ghana — Instant & Secure</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { network: 'MTN MoMo', number: '+233 24 017 1460', tel: '+233240171460' },
                  { network: 'MTN MoMo', number: '+233 24 149 9199', tel: '+233241499199' },
                ].map((m, i) => (
                  <div key={i} className="bg-amber-50 border border-amber-100 p-5 rounded-2xl flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-1">
                        {m.network}
                      </p>
                      <a
                        href={`tel:${m.tel}`}
                        className="text-xl font-bold text-slate-900 hover:text-amber-600 transition-colors"
                      >
                        {m.number}
                      </a>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-xl">
                      💰
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-xs text-slate-400 font-bold uppercase tracking-widest text-center bg-slate-50 rounded-xl py-3">
                * Confirm: Joseph Akowuah Ministries
              </p>
            </div>

            {/* International / Bank */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 shadow-xl text-white relative overflow-hidden reveal-right">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-2xl border border-white/20">🌍</div>
                  <div>
                    <h3 className="text-2xl font-bold">International Partners</h3>
                    <p className="text-slate-400 text-sm">Wire transfer & global giving</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl mb-8 backdrop-blur-sm">
                  <h4 className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-3">
                    Bank Transfer / SWIFT
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    For international wire transfers and SWIFT payments, please contact our finance
                    office directly for secure banking details.
                  </p>
                  <a
                    href="#/contact"
                    onClick={(e) => navigate(e, '#/contact')}
                    className="inline-block w-full text-center bg-amber-600 text-white px-8 py-3.5 rounded-full font-bold hover:bg-amber-500 transition-all shadow-lg active:scale-95 text-sm"
                  >
                    Contact Finance Office
                  </a>
                </div>

                {/* WhatsApp give */}
                <a
                  href="https://wa.me/233240171460"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-green-600/15 border border-green-600/30 text-green-400 py-4 rounded-2xl font-bold hover:bg-green-600 hover:text-white transition-all text-sm"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Give via WhatsApp
                </a>

                <p className="mt-5 flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Secure Communication Guaranteed
                </p>
              </div>

              {/* Decorative glow */}
              <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Scripture & testimony CTA ── */}
      <section className="py-20 bg-white border-t border-slate-100 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-subtle opacity-50 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 reveal">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Your Testimony is Next
          </h3>
          <p className="text-slate-600 text-lg leading-relaxed mb-3 italic">
            "But my God shall supply all your need according to his riches in glory by Christ Jesus."
          </p>
          <p className="text-amber-600 font-bold text-sm mb-10 uppercase tracking-widest">
            — Philippians 4:19
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#/contact"
              onClick={(e) => navigate(e, '#/contact')}
              className="inline-block bg-slate-900 text-white px-12 py-4 rounded-full font-bold hover:bg-amber-600 transition-all shadow-xl active:scale-95"
            >
              Share Your Testimony
            </a>
            <a
              href="#/contact"
              onClick={(e) => navigate(e, '#/contact')}
              className="inline-block border border-slate-200 text-slate-700 px-12 py-4 rounded-full font-bold hover:bg-slate-50 transition-all active:scale-95"
            >
              Request Prayer for Breakthrough
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Give;
