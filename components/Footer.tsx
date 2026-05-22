
import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [email, setEmail]     = useState('');
  const [subDone, setSubDone] = useState(false);

  const navigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.location.hash = href;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSub = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubDone(true);
    setEmail('');
  };

  const quickLinks = [
    { label: 'Our Story',          href: '#/about'       },
    { label: 'Ministry Wings',     href: '#/ministries'  },
    { label: 'Watch Sermons',      href: '#/sermons'     },
    { label: 'Upcoming Events',    href: '#/events'      },
    { label: 'Media Gallery',      href: '#/gallery'     },
    { label: 'Live Stream',        href: '#/watch-live'  },
  ];

  const connectLinks = [
    { label: 'Masofa Altar', href: '#/ai-guidance' },
    { label: 'Online Giving',          href: '#/give'        },
    { label: 'Prayer Requests',        href: '#/contact'     },
    { label: 'Partner With Us',        href: '#/give'        },
    { label: 'Contact & Directions',   href: '#/contact'     },
  ];

  const serviceSchedule = [
    { day: 'Sunday',    time: '8:00 AM – 12:00 PM', name: 'Grace Hour Service'     },
    { day: 'Tuesday',   time: '10:00 AM – 12:00 PM', name: 'Women Fellowship'       },
    { day: 'Wednesday', time: '6:00 PM – 8:30 PM',  name: 'Blood of Jesus Service' },
    { day: 'Thursday',  time: '8:00 AM – 2:30 PM',  name: 'Jericho Prayer'         },
    { day: 'Friday',    time: '10:00 PM – 3:00 AM', name: 'All-Night Warfare'      },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400" role="contentinfo">
      {/* Gold top accent */}
      <div className="divider-gold" />

      {/* ── Main footer grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* ── Brand column (wider) ── */}
          <div className="lg:col-span-4">
            <a
              href="#/"
              onClick={(e) => navigate(e, '#/')}
              className="flex items-center gap-3 mb-6 group w-fit"
              aria-label="Joseph Akowuah Ministries – Home"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                J
              </div>
              <div className="flex flex-col leading-none gap-0.5">
                <span className="font-serif text-[15px] font-bold text-white">Joseph Akowuah</span>
                <span className="text-[9px] uppercase tracking-[0.28em] text-amber-600 font-black">Ministries</span>
              </div>
            </a>

            <p className="text-sm leading-relaxed mb-8 max-w-xs">
              Dedicated to spiritual restoration, prophetic breakthroughs, and preaching the
              unadulterated Word of God under the leadership of Apostle Joseph Akwasi Akowuah.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mb-8">
              <a
                href="https://www.facebook.com/AkowuahJosephMinistries"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-amber-600 transition-all duration-300 group"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.383 14.444 5 15.333 5H18V0h-3.333C11.333 0 9 2.333 9 5.333V8z" />
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@josephakowuahministries"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-amber-600 transition-all duration-300"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.28-2.26.74-4.57 2.58-5.94 1.14-.87 2.56-1.35 4-1.34.03 1.29.01 2.58.01 3.87-1.14-.01-2.3.49-3 1.4-.73.91-.94 2.13-.59 3.25.33 1.05 1.14 1.94 2.21 2.26.85.27 1.77.21 2.58-.15 1.17-.51 1.96-1.74 2.04-3.01.05-3.56.02-7.12.02-10.68z" />
                </svg>
              </a>

              <a
                href="https://wa.me/233240171460"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-green-600 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>

            {/* Newsletter */}
            <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/50">
              <p className="text-white font-bold text-sm mb-1">Stay Connected</p>
              <p className="text-xs mb-4">Weekly devotionals & ministry updates.</p>
              {subDone ? (
                <p className="text-green-400 text-xs font-bold">✓ Subscribed! God bless you.</p>
              ) : (
                <form onSubmit={handleSub} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="flex-1 bg-slate-700 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600 placeholder:text-slate-500 min-w-0"
                    aria-label="Email for newsletter"
                  />
                  <button
                    type="submit"
                    className="bg-amber-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-amber-500 transition-colors whitespace-nowrap"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={(e) => navigate(e, l.href)}
                    className="text-sm hover:text-amber-500 transition-colors hover:translate-x-1 inline-block duration-200"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Connect ── */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Connect</h4>
            <ul className="space-y-3">
              {connectLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={(e) => navigate(e, l.href)}
                    className="text-sm hover:text-amber-500 transition-colors hover:translate-x-1 inline-block duration-200"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Service Schedule ── */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Weekly Services</h4>
            <ul className="space-y-3">
              {serviceSchedule.map((s) => (
                <li key={s.day} className="flex items-start gap-3">
                  <span className="text-amber-600 font-black text-[10px] uppercase tracking-wider w-16 flex-shrink-0 pt-0.5">
                    {s.day}
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold">{s.name}</p>
                    <p className="text-slate-500 text-xs">{s.time}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Contact block */}
            <div className="mt-8 space-y-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Reach Out</h4>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-amber-500 text-sm flex-shrink-0">📞</div>
                <a href="tel:+233240171460" className="text-sm text-white hover:text-amber-500 transition-colors font-medium">
                  +233 24 017 1460
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-amber-500 text-sm flex-shrink-0">📧</div>
                <a href="mailto:blessedbaptist90@gmail.com" className="text-xs text-white hover:text-amber-500 transition-colors font-medium break-all">
                  blessedbaptist90@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-amber-500 text-sm flex-shrink-0 mt-0.5">📍</div>
                <p className="text-xs leading-relaxed">
                  Faith and Love Cathedral,<br />
                  Chairman Kooko-Ano, Atimatim,<br />
                  Kumasi, Ghana
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>
            &copy; {new Date().getFullYear()} Joseph Akowuah Ministries / Blessed Baptist Church International.
            All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#/" onClick={(e) => navigate(e, '#/')} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#/" onClick={(e) => navigate(e, '#/')} className="hover:text-slate-300 transition-colors">
              Terms of Service
            </a>
            <a href="#/contact" onClick={(e) => navigate(e, '#/contact')} className="hover:text-slate-300 transition-colors">
              Contact
            </a>
            <a href="#/admin" onClick={(e) => navigate(e, '#/admin')} className="hover:text-slate-300 transition-colors">
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
