import React, { useState, useEffect } from 'react';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const slideImages: string[] = [
    '/images/bbc-bldofjesus.jpg',
    '/images/bbc-childservs.jpg',
    '/images/bbc-contact.jpg',
    '/images/bbccounselling.jpg',
    '/images/bbcmensfellow.jpg',
    '/images/bbcthursday.jpg',
    '/images/bbcwatchnight.jpg'
  ];

  useEffect(() => {
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slideImages.length]);

  const navigate = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ): void => {
    e.preventDefault();
    window.location.hash = href;
  };

  return (
    <div className="animate-fadeIn">
      {/* Live Altar Alert Banner */}
      <div className="bg-slate-900 py-3 border-b border-amber-600/20">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live Altar Active</span>
          </div>
          <a 
            href="https://www.facebook.com/AkowuahJosephMinistries/live" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-white text-slate-950 px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest"
          >
            Watch Facebook Live Stream →
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/mainp1.jpg"
            alt="Prophetic Worship" 
            className="w-full h-full object-cover filter brightness-[0.3]"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="inline-block bg-amber-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-xl">
            Your Season of Divine Change
          </div>
<<<<<<< HEAD
          <h1 className="text-4xl md:text-8xl font-bold mb-8 leading-[0.9] max-w-5xl tracking-tighter">
=======
          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-[0.9] max-w-5xl tracking-tighter">
>>>>>>> 5b7c637 (all)
            BLESSED <span className="text-amber-500">BAPTIST CHURCH</span> INTERNATIONAL
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-slate-200 max-w-2xl leading-relaxed font-light">
            Join Apostle Joseph Akwasi Akowuah and witness the raw power of the Holy Ghost in Prayer, Prophecy, Healing, and Restoration.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <a 
              href="#/watch-live" 
              onClick={(e) => navigate(e, '#/watch-live')}
              className="bg-amber-600 text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-amber-700 transition-all text-center shadow-2xl group flex items-center justify-center gap-3"
            >
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              Watch Live Stream
            </a>
            <a 
              href="#/ai-guidance" 
              onClick={(e) => navigate(e, '#/ai-guidance')}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all text-center"
            >
              Masofa AI 
            </a>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Featured Quote */}
      <section className="py-24 bg-slate-900 text-white text-center border-y border-amber-600/20">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-amber-500 text-5xl font-serif">"</span>
          <h2 className="text-3xl md:text-5xl font-serif italic mb-8 leading-tight">
            Go ye into all the world, and preach the gospel to every creature. He that believeth and is baptized shall be saved; 
            but he that believeth not shall be damned. And these signs shall follow them that believe; 
            In my name shall they cast out devils; they shall speak with new tongues; they shall take up serpents; 
            and if they drink any deadly thing, 
            it shall not hurt them; they shall lay hands on the sick, and they shall recover.
          </h2>
          <p className="uppercase tracking-[0.3em] text-amber-500 font-bold text-xs">- Apostle Joseph Akwasi Akowuah</p>
=======
      {/* Image Slideshow */}
      <section className="py-24 bg-slate-900 relative overflow-hidden border-y border-amber-600/20">
        <div className="absolute inset-0">
          <img 
            src={slideImages[currentSlide] ?? slideImages[0]} 
            alt={`Ministry moment ${currentSlide + 1}`} 
            className="w-full h-[60vh] md:h-[70vh] object-cover brightness-[0.4] transition-all duration-1000 ease-in-out" 
            key={currentSlide}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center gap-2 mb-8">
              {slideImages.map((_: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentSlide ? 'bg-amber-500 scale-125' : 'bg-white/50 hover:bg-amber-400'
                  }`}
                />
              ))}
            </div>
            <p className="text-amber-400 uppercase tracking-[0.3em] font-bold text-sm mb-4">Prophetic Moments</p>
            <h3 className="text-2xl md:text-4xl font-serif italic">Experience the Glory</h3>
          </div>
>>>>>>> 5b7c637 (all)
        </div>
      </section>

      {/* Quick Services Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: 'Prophetic Altar',
                desc: 'Intense intercession and prophetic ministration to break every yoke.',
                icon: '🔥',
                link: '#/ministries'
              },
              {
                title: 'Deliverance',
                desc: 'Experience total freedom from generational bondages and spiritual barriers.',
                icon: '⚔️',
                link: '#/ministries'
              },
              {
                title: 'The Word',
                desc: 'Unadulterated teaching of the Bible to build your faith and spirit.',
                icon: '📖',
                link: '#/sermons'
              }
            ].map((service, idx) => (
              <a 
                key={idx} 
                href={service.link}
                onClick={(e) => navigate(e, service.link)}
                className="group p-12 rounded-[3rem] bg-slate-50 hover:bg-amber-600 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform">{service.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-white mb-4">{service.title}</h3>
                <p className="text-slate-600 group-hover:text-amber-50 text-lg leading-relaxed">{service.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Social Call */}
      <section className="py-32 bg-slate-900 overflow-hidden relative border-t-8 border-amber-600">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-600 skew-x-12 translate-x-32 opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-5xl font-bold text-white mb-8 leading-tight">Stay Connected to the Prophetic Fire</h2>
              <p className="text-xl text-slate-400 mb-12">Join thousands of believers across the globe following our ministry online for daily breakthroughs on Facebook and TikTok.</p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://www.facebook.com/AkowuahJosephMinistries" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-blue-600/20"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.383 14.444 5 15.333 5H18V0h-3.333C11.333 0 9 2.333 9 5.333V8z"/></svg>
                  Follow on Facebook
                </a>
                <a 
                  href="https://www.tiktok.com/@josephakowuahministries" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white text-black px-10 py-4 rounded-full font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-xl"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.28-2.26.74-4.57 2.58-5.94 1.14-.87 2.56-1.35 4-1.34.03 1.29.01 2.58.01 3.87-1.14-.01-2.3.49-3 1.4-.73.91-.94 2.13-.59 3.25.33 1.05 1.14 1.94 2.21 2.26.85.27 1.77.21 2.58-.15 1.17-.51 1.96-1.74 2.04-3.01.05-3.56.02-7.12.02-10.68z"/></svg>
                  Follow on TikTok
                </a>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
               <img src="/images/seedtimharvestime.jpg" className="rounded-[2.5rem] h-64 w-full object-cover border-4 border-white/5 bg-slate-800" alt="Worship moment" />
               <img src="/images/sun-servc.jpg" className="rounded-[2.5rem] h-64 w-full object-cover mt-12 border-4 border-white/5 bg-slate-800" alt="Prophetic gathering" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

