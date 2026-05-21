
import React, { useEffect, useState, useRef } from 'react';

/* ── Countdown hook ── */
function useCountdown(targetDate: string) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  });
  return time;
}

const weeklyServices = [
  {
    day: 'Sunday',
    time: '8:00 AM – 12:00 PM',
    title: 'Grace Hour Service',
    desc: 'Our main celebration service featuring intense worship, profound teaching, and the manifest presence of God.',
    icon: '⛪',
    color: 'bg-amber-50 border-amber-200',
    iconBg: 'bg-amber-600',
  },
  {
    day: 'Tuesday',
    time: '10:00 AM – 12:00 PM',
    title: 'Women Fellowship',
    desc: 'A powerful gathering for women — fellowship, prayer, empowerment, and spiritual growth.',
    icon: '🌸',
    color: 'bg-rose-50 border-rose-200',
    iconBg: 'bg-rose-500',
  },
  {
    day: 'Wednesday',
    time: '6:00 PM – 8:30 PM',
    title: 'Blood of Jesus Service',
    desc: 'Mid-week spiritual fire and persistent prayer to navigate the week in total victory.',
    icon: '💥',
    color: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-700',
  },
  {
    day: 'Thursday',
    time: '8:00 AM – 2:30 PM',
    title: 'Jericho Prayer Service',
    desc: 'A prophetic gathering of intense intercession — marching around every wall until it falls.',
    icon: '🙏',
    color: 'bg-green-50 border-green-200',
    iconBg: 'bg-green-700',
  },
  {
    day: 'Friday',
    time: '10:00 PM – 3:00 AM',
    title: 'All-Night Warfare',
    desc: 'Strategic spiritual warfare at the altar — breaking seasonal barriers and claiming new territories.',
    icon: '⚔️',
    color: 'bg-slate-50 border-slate-200',
    iconBg: 'bg-slate-800',
  },
];

const upcomingEvents = [
  {
    title: 'CONVENTION 2026',
    date: 'To Be Announced',
    countdown: '2026-11-01T06:00:00',
    time: '6:00 PM Prompt',
    location: 'BBC Church Grounds, Atimatim, Kumasi',
    img: '/images/mainpic.jpg',
    tag: 'FLAGSHIP CONFERENCE',
    desc: 'The biggest BBC International gathering of the year. Apostles, Prophets, and Ministers from across the globe converge for an extraordinary move of the Spirit.',
  },
  {
    title: 'CAMP MEETING 2026',
    date: 'To Be Announced',
    countdown: '2026-08-01T05:00:00',
    time: '5:00 PM',
    location: 'BBC Church Grounds, Atimatim, Kumasi',
    img: '/images/sunday3.jpg',
    tag: 'SPECIAL SEMINAR',
    desc: 'Three days of intensive teaching, prayer, and spiritual enrichment. Come ready to encounter God at a deeper dimension.',
  },
];

/* ── Countdown display ── */
const CountdownBlock: React.FC<{ target: string }> = ({ target }) => {
  const { days, hours, minutes, seconds } = useCountdown(target);
  const units = [
    { label: 'Days',    value: days    },
    { label: 'Hours',   value: hours   },
    { label: 'Mins',    value: minutes },
    { label: 'Secs',    value: seconds },
  ];
  return (
    <div className="flex gap-2 sm:gap-3 mt-4">
      {units.map((u) => (
        <div key={u.label} className="flex-1 bg-slate-900/60 backdrop-blur-sm rounded-xl p-2.5 text-center border border-white/10">
          <p className="text-xl sm:text-2xl font-black text-amber-400 leading-none tabular-nums">
            {String(u.value).padStart(2, '0')}
          </p>
          <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">{u.label}</p>
        </div>
      ))}
    </div>
  );
};

const Events: React.FC = () => {
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

  return (
    <div className="bg-white min-h-screen animate-fadeIn">

      {/* ── Hero ── */}
      <section className="py-28 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <img
            src="/images/mainpic.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <span className="text-amber-500 font-black uppercase tracking-[0.4em] text-xs mb-4 block">
            Visitation Schedule
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Connect with the <span className="text-gold-gradient">Divine</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Join us at any of our live sessions to experience the raw power of the Holy Ghost.
          </p>
        </div>
      </section>

      {/* ── Weekly Schedule ── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <span className="text-amber-600 text-xs font-black uppercase tracking-[0.35em] mb-3 block">
              Consistent Spiritual Maintenance
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Weekly Altar Schedule</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklyServices.map((service, idx) => (
              <div
                key={idx}
                className={`${service.color} border rounded-3xl p-8 group hover:shadow-xl transition-all duration-400 hover:-translate-y-1 reveal`}
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                <div className={`w-14 h-14 ${service.iconBg} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <span className="text-amber-600 font-black uppercase tracking-[0.2em] text-[10px]">
                  {service.day}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1.5 mb-1">{service.title}</h3>
                <p className="text-slate-500 font-bold text-sm mb-4">{service.time}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{service.desc}</p>
                <div className="mt-6 pt-5 border-t border-current/10">
                  <a
                    href="#/contact"
                    onClick={(e) => { e.preventDefault(); window.location.hash = '#/contact'; }}
                    className="text-xs font-black uppercase tracking-widest text-slate-700 hover:text-amber-600 flex items-center gap-2 transition-colors"
                  >
                    Get Directions
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events with Countdown ── */}
      <section className="py-28 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <span className="text-amber-600 text-xs font-black uppercase tracking-[0.35em] mb-3 block">
              Mark Your Calendar
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Global Conferences</h2>
          </div>

          <div className="space-y-8">
            {upcomingEvents.map((event, idx) => (
              <div
                key={idx}
                className={`flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 group reveal ${
                  idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Image */}
                <div className="lg:w-5/12 relative overflow-hidden bg-slate-200 min-h-[280px]">
                  <img
                    src={event.img}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-900/60" />
                  {/* Countdown overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <p className="text-amber-400 text-xs font-black uppercase tracking-widest mb-1">
                      Countdown
                    </p>
                    <CountdownBlock target={event.countdown} />
                  </div>
                </div>

                {/* Content */}
                <div className="lg:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-[10px] font-black text-amber-600 tracking-[0.3em] mb-3 block">
                    {event.tag}
                  </span>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">{event.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-6">{event.desc}</p>

                  <div className="space-y-2 mb-8">
                    <p className="text-sm font-semibold text-slate-700 flex items-center gap-3">
                      <span className="text-amber-600">📅</span>
                      {event.date}
                    </p>
                    <p className="text-sm font-semibold text-slate-700 flex items-center gap-3">
                      <span className="text-amber-600">🕒</span>
                      {event.time}
                    </p>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-3">
                      <span className="text-amber-600">📍</span>
                      {event.location}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href="#/contact"
                      onClick={(e) => { e.preventDefault(); window.location.hash = '#/contact'; }}
                      className="inline-block bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold hover:bg-amber-600 transition-all shadow-lg text-center active:scale-95"
                    >
                      Register Interest
                    </a>
                    <a
                      href="https://wa.me/233240171460"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-8 py-3.5 rounded-full font-bold hover:bg-green-600 hover:text-white transition-all"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      Enquire on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Location CTA ── */}
      <section className="py-20 bg-amber-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 reveal">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Us in Kumasi</h2>
          <p className="text-amber-100 text-lg mb-8 leading-relaxed">
            Faith and Love Cathedral, Chairman Kooko-Ano, Atimatim, Kumasi — Ghana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/233240171460"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-amber-700 px-10 py-4 rounded-full font-bold hover:bg-amber-50 transition-colors shadow-xl active:scale-95"
            >
              Get Directions via WhatsApp
            </a>
            <a
              href="#/contact"
              onClick={(e) => { e.preventDefault(); window.location.hash = '#/contact'; }}
              className="inline-block bg-slate-900 text-white px-10 py-4 rounded-full font-bold hover:bg-slate-800 transition-colors shadow-xl active:scale-95"
            >
              Contact the Ministry
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
