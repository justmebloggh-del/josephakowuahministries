
import React, { useState, useEffect, useRef } from 'react';

const Contact: React.FC = () => {
  const [status, setStatus]   = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name:    '',
    phone:   '',
    email:   '',
    subject: 'Prayer Request',
    message: '',
  });
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
  }, [status]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const response = await fetch('https://formspree.io/f/mkovrvvl', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          _subject: `${formData.subject} from ${formData.name}`,
        }),
      });
      setStatus(response.ok ? 'success' : 'error');
      if (response.ok) setFormData({ name: '', phone: '', email: '', subject: 'Prayer Request', message: '' });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-white animate-fadeIn">
        <div className="text-center p-12 max-w-lg">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
            ✓
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Request Received!</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            Your message has been sent to the Altar. Apostle Joseph and the prayer team will
            stand in agreement with you. Expect your testimony!
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="bg-amber-600 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl active:scale-95"
          >
            Send Another Request
          </button>
        </div>
      </div>
    );
  }

  const inputClass =
    'w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all shadow-sm placeholder:text-slate-400';

  return (
    <div className="animate-fadeIn py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="text-center mb-16 reveal">
          <span className="text-amber-600 text-xs font-black uppercase tracking-[0.35em] mb-3 block">
            We Are Here For You
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Let's Connect</h1>
          <p className="text-slate-500 max-w-xl mx-auto text-lg font-light">
            Whether you need prayer, counseling, or want to visit us in Kumasi — your breakthrough
            is one conversation away.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ── Left: contact info ── */}
          <div className="space-y-6 reveal-left">

            {/* Quick contact cards */}
            {[
              {
                icon:    '📱',
                title:   'WhatsApp & Calls',
                bg:      'bg-amber-600',
                content: (
                  <div className="space-y-1">
                    <a href="tel:+233240171460" className="block text-xl font-bold text-amber-600 hover:text-amber-700 transition-colors">+233 24 017 1460</a>
                    <a href="tel:+233532027582" className="block text-xl font-bold text-amber-600 hover:text-amber-700 transition-colors">+233 53 202 7582</a>
                    <a
                      href="https://wa.me/233240171460"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 bg-green-500 text-white px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-green-600 transition-colors shadow-md"
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      Instant WhatsApp Prayer
                    </a>
                  </div>
                ),
              },
              {
                icon:    '✉️',
                title:   'Email Us',
                bg:      'bg-slate-800',
                content: (
                  <a
                    href="mailto:blessedbaptist90@gmail.com"
                    className="text-slate-600 hover:text-amber-600 transition-colors break-all text-base"
                  >
                    blessedbaptist90@gmail.com
                  </a>
                ),
              },
              {
                icon:    '📍',
                title:   'Our Location',
                bg:      'bg-amber-50',
                content: (
                  <div>
                    <p className="text-slate-700 font-semibold">Faith and Love Cathedral</p>
                    <p className="text-slate-500 text-sm mt-1">Chairman Kooko-Ano, Atimatim<br />Kumasi, Ashanti Region, Ghana</p>
                  </div>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-start gap-5">
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-md`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h4>
                  {item.content}
                </div>
              </div>
            ))}

            {/* Service times quick ref */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white">
              <h4 className="font-bold text-amber-400 text-xs uppercase tracking-widest mb-4">Service Hours</h4>
              <div className="space-y-2 text-sm">
                {[
                  ['Sunday',    '8:00 AM – 12:00 PM'],
                  ['Wednesday', '6:00 PM – 8:30 PM' ],
                  ['Friday',    '10:00 PM – 3:00 AM' ],
                ].map(([day, time]) => (
                  <div key={day} className="flex justify-between items-center">
                    <span className="text-slate-400">{day}</span>
                    <span className="text-white font-semibold">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 reveal-right">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Send a Prophetic Request</h3>
            <p className="text-slate-500 text-sm mb-8">
              Fill in the form below and we will pray with you and respond as soon as possible.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5 ml-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5 ml-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={inputClass}
                    placeholder="+233..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5 ml-1">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Prayer Request">Prayer Request</option>
                  <option value="Counseling">Counseling Session</option>
                  <option value="Testimony">Share a Testimony</option>
                  <option value="Partnership">Partnership Inquiry</option>
                  <option value="Giving">Giving / Donations</option>
                  <option value="General">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5 ml-1">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  className={`${inputClass} resize-none`}
                  placeholder="Describe your situation, prayer need, or message..."
                />
              </div>

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-semibold p-4 rounded-2xl text-center">
                  Something went wrong. Please try again or contact us via WhatsApp.
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-amber-600 text-white font-black py-4 rounded-2xl hover:bg-amber-500 transition-all shadow-xl shadow-amber-600/20 text-sm uppercase tracking-widest active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-3"
              >
                {status === 'submitting' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending to Altar…
                  </>
                ) : (
                  'Submit to the Altar'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
