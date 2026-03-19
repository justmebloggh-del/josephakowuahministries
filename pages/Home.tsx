import React, { useState, useEffect, useCallback } from "react";

const slideImages: string[] = [
  "/images/bbc1.jpg",
  "/images/bbc2.jpg",
  "/images/bbc3.jpg",
  "/images/bbc4.jpg",
  "/images/bbc5.jpg",
  "/images/bbc6.jpg",
  "/images/bbc7.jpg",
  "/images/bbc8.jpg",
  "/images/bbc9.jpg",
  "/images/bbc10.jpg",
  "/images/bbc11.jpg",
  "/images/bbc12.jpg",
  "/images/bbc13.jpg",
];

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Auto slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const navigate = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      window.location.hash = href;
    },
    []
  );

  return (
    <div className="animate-fadeIn">
      {/* Live Banner */}
      <div className="bg-slate-900 py-3 border-b border-amber-600/20">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
              Live Altar Active
            </span>
          </div>

          <a
            href="https://www.facebook.com/AkowuahJosephMinistries/live"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-slate-950 px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition"
          >
            Watch Facebook Live →
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img
            src="/images/mainp1.jpg"
            alt="Church worship service"
            className="w-full h-full object-cover brightness-[0.3]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-white">
          <div className="inline-block bg-amber-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-xl">
            Your Season of Divine Change
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight max-w-4xl tracking-tight">
            BLESSED{" "}
            <span className="text-amber-500">BAPTIST CHURCH</span>{" "}
            INTERNATIONAL
          </h1>

          <p className="text-xl md:text-2xl mb-12 text-slate-200 max-w-2xl leading-relaxed font-light">
            Join Apostle Joseph Akwasi Akowuah and witness the raw power of the
            Holy Spirit in Prayer, Prophecy, Healing, and Restoration.
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <a
              href="#/watch-live"
              onClick={(e) => navigate(e, "#/watch-live")}
              className="bg-amber-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-amber-700 transition shadow-xl flex items-center justify-center gap-3"
            >
              <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
              Watch Live Stream
            </a>

            <a
              href="#/ai-guidance"
              onClick={(e) => navigate(e, "#/ai-guidance")}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition text-center"
            >
              Masofa AI
            </a>
          </div>
        </div>
      </section>

      {/* Featured Quote */}
      <section className="py-24 bg-slate-900 text-white text-center border-y border-amber-600/20">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-amber-500 text-5xl font-serif">"</span>
          <h2 className="text-2xl md:text-4xl font-serif italic mb-8 leading-relaxed">
            Go ye into all the world, and preach the gospel to every creature...
          </h2>
          <p className="uppercase tracking-[0.3em] text-amber-500 font-bold text-xs">
            – Apostle Joseph Akwasi Akowuah
          </p>
        </div>
      </section>

      {/* Slideshow */}
      <section className="py-24 bg-slate-900 relative overflow-hidden border-y border-amber-600/20">
        <div className="absolute inset-0">
          <img
            src={slideImages[currentSlide]}
            alt={`Ministry moment ${currentSlide + 1}`}
            className="aspect-square w-full max-h-[40vh] h-auto object-cover brightness-[0.65] mx-auto transition-all duration-1000"
          />
          <div className="absolute -top-6 -left-6 w-full h-full border-2 border-amber-600 rounded-3xl z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        </div>

        <div className="relative z-10 text-center text-white px-6">
          <div className="flex justify-center gap-3 mb-6">
            {slideImages.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition ${
                  idx === currentSlide
                    ? "bg-amber-500 scale-125"
                    : "bg-white/50 hover:bg-amber-400"
                }`}
              />
            ))}
          </div>

          <p className="text-amber-400 uppercase tracking-widest text-sm mb-4">
            Prophetic Moments
          </p>
          <h3 className="text-2xl md:text-4xl font-serif italic">
            Experience the Glory
          </h3>
        </div>
      </section>

      {/* Services */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Prophetic Altar",
              desc: "Intense intercession and prophetic ministration.",
              icon: "🔥",
              link: "#/ministries",
            },
            {
              title: "Deliverance",
              desc: "Total freedom from spiritual bondages.",
              icon: "⚔️",
              link: "#/ministries",
            },
            {
              title: "The Word",
              desc: "Sound teaching to build your faith.",
              icon: "📖",
              link: "#/sermons",
            },
          ].map((service, idx) => (
            <a
              key={idx}
              href={service.link}
              onClick={(e) => navigate(e, service.link)}
              className="group p-10 rounded-3xl bg-slate-50 hover:bg-amber-600 transition-all shadow hover:shadow-xl hover:-translate-y-2"
            >
              <div className="text-5xl mb-6">{service.icon}</div>
              <h3 className="text-2xl font-bold group-hover:text-white mb-4">
                {service.title}
              </h3>
              <p className="text-slate-600 group-hover:text-amber-50">
                {service.desc}
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;