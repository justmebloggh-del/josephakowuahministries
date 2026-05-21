
import React, { useEffect, useRef } from 'react';

const ministryList = [
  {
    title: 'The Prophetic Wing',
    desc:  'Specialised prayer sessions and prophetic guidance to uncover divine destinies through direct revelation from God.',
    icon:  '⚡',
    img:   '/images/bbcprayer.jpg',
    color: 'from-amber-600 to-amber-800',
    tag:   'Core Ministry',
  },
  {
    title: 'Youth Ministry',
    desc:  'Empowering the next generation to walk in holiness, spiritual authority, and career excellence for God\'s kingdom.',
    icon:  '🚀',
    img:   '/images/youthchurch.jpg',
    color: 'from-indigo-600 to-indigo-900',
    tag:   'Next Generation',
  },
  {
    title: "Women's Fellowship",
    desc:  'A fellowship of virtuous women dedicated to prayer, family restoration, and spiritual growth in God\'s kingdom.',
    icon:  '🌸',
    img:   '/images/womenflshp.jpg',
    color: 'from-rose-500 to-rose-800',
    tag:   'Women of Faith',
  },
  {
    title: "Men's Fellowship",
    desc:  'Strengthening men to lead as priests of their homes and stand as pillars in the kingdom of God.',
    icon:  '⚔️',
    img:   '/images/bbc-man.jpg',
    color: 'from-slate-600 to-slate-900',
    tag:   'Men of God',
  },
  {
    title: "Children's Ministry",
    desc:  'Nurturing children in the fear of the Lord through creative, engaging, and biblically sound foundations.',
    icon:  '🧸',
    img:   '/images/bbc1.jpg',
    color: 'from-emerald-500 to-emerald-800',
    tag:   'Kingdom Seeds',
  },
  {
    title: 'Evangelism & Missions',
    desc:  'Bringing the light of the Gospel to remote areas through missions, charity, crusades, and soul-winning campaigns.',
    icon:  '🌍',
    img:   '/images/bbcevangelismapstle.jpg',
    color: 'from-orange-500 to-orange-800',
    tag:   'Global Outreach',
  },
];

const Ministries: React.FC = () => {
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
    <div className="bg-white min-h-screen animate-fadeIn">

      {/* ── Hero ── */}
      <section className="bg-slate-900 py-32 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/sunday-serv.jpg" alt="" aria-hidden="true" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-xs mb-4 block">
            Serving the Kingdom
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            OUR <span className="text-gold-gradient">MINISTRIES</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Every part of our ministry exists to serve a specific purpose in God's kingdom.
            Find where your gifts, calling, and passion align with our mission.
          </p>
        </div>
      </section>

      {/* ── Ministry cards grid ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministryList.map((m, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 border border-slate-100 reveal"
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                {/* Image header */}
                <div className="relative h-52 overflow-hidden bg-slate-200">
                  <img
                    src={m.img}
                    alt={m.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${m.color} opacity-75`} />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/30">
                      {m.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-4xl">{m.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{m.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{m.desc}</p>
                  <a
                    href="#/contact"
                    onClick={(e) => navigate(e, '#/contact')}
                    className="inline-flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all duration-200"
                  >
                    Join This Ministry
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How to get involved ── */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="reveal">
            <span className="text-amber-600 text-xs font-black uppercase tracking-[0.35em] mb-3 block">
              Get Involved
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mb-12">Three Steps to Join Us</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Attend a Service',  desc: 'Come to any of our weekly services and experience the BBC atmosphere in person.' },
              { step: '02', title: 'Connect with Us',    desc: 'Reach out via WhatsApp or the contact form to express your interest in a ministry wing.' },
              { step: '03', title: 'Be Deployed',        desc: 'Our ministry leaders will identify your gifts and place you where you can serve best.' },
            ].map((s, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center text-white font-black text-xl mx-auto mb-5 shadow-lg">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-slate-900 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-amber-600 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-2xl mx-auto px-4 relative z-10 reveal">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">Want to make an impact?</h2>
          <p className="text-slate-400 mb-10 text-lg italic leading-relaxed">
            "For we are God's handiwork, created in Christ Jesus to do good works,
            which God prepared in advance for us to do." — Ephesians 2:10
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#/contact"
              onClick={(e) => navigate(e, '#/contact')}
              className="inline-block bg-amber-600 text-white px-10 py-4 rounded-full font-bold hover:bg-amber-500 transition-all shadow-xl active:scale-95"
            >
              Contact Ministry Leaders
            </a>
            <a
              href="https://wa.me/233240171460"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 glass text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
            >
              WhatsApp Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ministries;
