
import React, { useState, useEffect, useRef } from 'react';

const allImages = [
  { url: '/images/bbc1.jpg',                title: 'Sunday Service',         category: 'Worship'    },
  { url: '/images/bbc2.jpg',                title: 'Congregation in Worship', category: 'Worship'    },
  { url: '/images/bbc3.jpg',                title: 'Ministry in Action',      category: 'Worship'    },
  { url: '/images/bbc4.jpg',                title: 'The Altar',               category: 'Worship'    },
  { url: '/images/bbc5.jpg',                title: 'Power in the Sanctuary',  category: 'Worship'    },
  { url: '/images/bbc6.jpg',                title: 'Grace Hour',              category: 'Worship'    },
  { url: '/images/bbc7.jpg',                title: 'BBC International',       category: 'Worship'    },
  { url: '/images/bbc8.jpg',                title: 'The Move of God',         category: 'Worship'    },
  { url: '/images/bbc9.jpg',                title: 'Holy Spirit in Action',   category: 'Worship'    },
  { url: '/images/bbc10.jpg',               title: 'Sunday Glory',            category: 'Worship'    },
  { url: '/images/bbc11.jpg',               title: 'Anointed Service',        category: 'Worship'    },
  { url: '/images/bbc12.jpg',               title: 'BBC Congregation',        category: 'Worship'    },
  { url: '/images/bbc13.jpg',               title: 'Kingdom Gathering',       category: 'Worship'    },
  { url: '/images/bbcprayer.jpg',           title: 'Prayer Meeting',          category: 'Prayer'     },
  { url: '/images/midnight-prayers.png',    title: 'All-Night Prayers',       category: 'Prayer'     },
  { url: '/images/conse1.jpg',              title: 'Jericho Prayer',          category: 'Prayer'     },
  { url: '/images/bbcevangelismapstle.jpg', title: 'Evangelism Crusade',      category: 'Evangelism' },
  { url: '/images/crusade1.jpg',            title: 'Community Crusade',       category: 'Evangelism' },
  { url: '/images/crusade.jpg',             title: 'Outreach Mission',        category: 'Evangelism' },
  { url: '/images/evangelist1.jpg',         title: 'Gospel Outreach',         category: 'Evangelism' },
  { url: '/images/bbc-man.jpg',             title: "Men's Fellowship",        category: 'Fellowship' },
  { url: '/images/men2.jpg',                title: "Men of God",              category: 'Fellowship' },
  { url: '/images/menf1.jpg',               title: "Men's Ministry",          category: 'Fellowship' },
  { url: '/images/bbc-womenflsp.jpg',       title: "Women Fellowship",        category: 'Fellowship' },
  { url: '/images/womenflshp.jpg',          title: "Women of Faith",          category: 'Fellowship' },
  { url: '/images/youthchurch.jpg',         title: "Youth Church",            category: 'Fellowship' },
  { url: '/images/founder.jpg',             title: 'Apostle Joseph Akowuah', category: 'Leadership' },
  { url: '/images/founder1.jpg',            title: 'The Apostle',             category: 'Leadership' },
  { url: '/images/founder3.jpg',            title: 'Apostolic Ministry',      category: 'Leadership' },
  { url: '/images/founder4.jpg',            title: 'Teaching the Word',       category: 'Leadership' },
  { url: '/images/pastors.jpg',             title: 'Ministry Leaders',        category: 'Leadership' },
  { url: '/images/consecration.jpg',        title: 'Consecration Service',   category: 'Events'     },
  { url: '/images/bbccon.jpg',              title: 'Convention',              category: 'Events'     },
  { url: '/images/audit.jpg',               title: 'Miracle Service',         category: 'Events'     },
  { url: '/images/choir.jpg',               title: 'Praise & Worship',        category: 'Events'     },
  { url: '/images/premises.jpg',            title: 'Church Premises',         category: 'Events'     },
];

const categories = ['All', 'Worship', 'Prayer', 'Evangelism', 'Fellowship', 'Leadership', 'Events'];

const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage,  setSelectedImage]  = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const filtered = activeCategory === 'All'
    ? allImages
    : allImages.filter((img) => img.category === activeCategory);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.05 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [activeCategory]);

  /* Keyboard navigation for lightbox */
  useEffect(() => {
    if (selectedImage === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowRight') setSelectedImage((p) => p === null ? 0 : (p + 1) % filtered.length);
      if (e.key === 'ArrowLeft')  setSelectedImage((p) => p === null ? 0 : (p - 1 + filtered.length) % filtered.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedImage, filtered.length]);

  /* Lock scroll when lightbox open */
  useEffect(() => {
    document.body.style.overflow = selectedImage !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedImage]);

  return (
    <div className="min-h-screen bg-white animate-fadeIn pb-24">

      {/* ── Hero ── */}
      <section className="bg-slate-900 py-28 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/gallery bana.jpg" alt="" aria-hidden="true" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-amber-500 font-black uppercase tracking-[0.35em] text-xs mb-4 block">
            Moments of Glory
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            MEDIA <span className="text-gold-gradient">GALLERY</span>
          </h1>
          <p className="text-slate-300 max-w-lg mx-auto text-lg font-light">
            Capturing moments of divine glory and the tangible manifestation of God's power in our midst.
          </p>
        </div>
      </section>

      {/* ── Category filter bar ── */}
      <div className="bg-white sticky top-20 z-30 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2 flex-wrap justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSelectedImage(null); }}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              {cat}
              {cat === 'All' && (
                <span className="ml-1.5 text-[9px] opacity-70">{allImages.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Masonry grid ── */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
            {filtered.map((img, idx) => (
              <div
                key={`${activeCategory}-${idx}`}
                className="relative group cursor-pointer overflow-hidden rounded-2xl break-inside-avoid shadow-sm hover:shadow-2xl transition-all duration-400 bg-slate-200 reveal"
                onClick={() => setSelectedImage(idx)}
                role="button"
                tabIndex={0}
                aria-label={`View ${img.title}`}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedImage(idx)}
                style={{ transitionDelay: `${(idx % 8) * 40}ms` }}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-auto object-cover transition-transform duration-600 group-hover:scale-108"
                  loading="lazy"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <span className="text-amber-400 font-black uppercase tracking-widest text-[9px] mb-1">
                    {img.category}
                  </span>
                  <p className="text-white font-bold text-sm leading-tight">{img.title}</p>
                </div>
                {/* Zoom icon */}
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/96 flex flex-col items-center justify-center animate-fadeIn backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Image viewer: ${filtered[selectedImage]?.title}`}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition-colors z-10"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image viewer"
          >
            ✕
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-5 glass px-4 py-2 rounded-full text-white text-xs font-bold z-10">
            {selectedImage + 1} / {filtered.length}
          </div>

          {/* Prev */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-amber-600/50 transition-all z-10"
            onClick={(e) => { e.stopPropagation(); setSelectedImage((p) => p === null ? 0 : (p - 1 + filtered.length) % filtered.length); }}
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image */}
          <img
            src={filtered[selectedImage]?.url}
            alt={filtered[selectedImage]?.title}
            className="max-w-[90vw] max-h-[80vh] rounded-2xl shadow-2xl object-contain animate-scaleUp border border-white/10 bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Caption */}
          <div className="mt-4 text-center">
            <p className="text-white font-bold text-base">{filtered[selectedImage]?.title}</p>
            <p className="text-amber-400 text-xs uppercase tracking-widest mt-1">{filtered[selectedImage]?.category}</p>
          </div>

          {/* Next */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-amber-600/50 transition-all z-10"
            onClick={(e) => { e.stopPropagation(); setSelectedImage((p) => p === null ? 0 : (p + 1) % filtered.length); }}
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <p className="absolute bottom-5 text-slate-500 text-xs">
            Press ← → to navigate · ESC to close
          </p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
