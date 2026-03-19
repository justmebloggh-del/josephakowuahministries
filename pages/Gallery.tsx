
import React, { useState } from 'react';

const Gallery: React.FC = () => {
  const images = [
    { url: "/images/bbc-bldofjesus.jpg", title: "midweeksvs" },
    { url: "/images/crusade.jpg", title: "crusade" },
    { url: "/images/crusade1.jpg", title: "crusade" },
    { url: "/images/bbcevangelismapstle.jpg", title: "Evangelist" },
    { url: "/images/sunday3.jpg", title: "Sunday Service" },
    { url: "/images/bbc-man.jpg", title: "Men's Ministry" },
    { url: "/images/akwaaba-ministry.jpg", title: "Akwaaba Ministry" },
    { url: "/images/choir.jpg", title: "choir" },
    { url: "/images/mainp2.jpg", title: "church service" },
    { url: "/images/premises.jpg", title: "church compound view" },
    { url: "/images/pastors.jpg", title: "Pastors" },
    { url: "/images/conse1.jpg", title: "Apostolic consecration" },
    { url: "/images/audit.jpg", title: "main auditorium" },
    { url: "/images/mainpic.jpg", title: "church service" },
    { url: "/images/menf1.jpg", title: "men fellowship" },
    { url: "/images/seedtimharvestime.jpg", title: "Akwaaba Ministry" },
  ];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white animate-fadeIn pb-24">
      {/* Header */}
 <section className="bg-slate-900 py-32 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img src="/images/gallery bana.jpg" alt="Scripture Background" className="w-full h-full object-cover bg-slate-800" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-amber-500 font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Serving the Kingdom</span>
          <h1 className="text-5xl md:text-7xl font-bold mb-8">MEDIA  <span className="text-amber-500">GALLERY</span></h1>
          <p className="text-amber-500 font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Capturing moments of glory and the tangible manifestation of God's power in our midst.</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className="relative group cursor-pointer overflow-hidden rounded-[2rem] break-inside-avoid shadow-sm hover:shadow-2xl transition-all duration-500 bg-slate-200 min-h-[200px]"
                onClick={() => setSelectedImage(img.url)}
              >
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-amber-500 font-bold uppercase tracking-widest text-[10px] mb-2">Blessed Baptist</p>
                    <p className="text-white font-bold text-xl">{img.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/95 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-8 right-8 text-white text-5xl font-light hover:text-amber-500 transition-colors" aria-label="Close">&times;</button>
          <img 
            src={selectedImage} 
            alt="Large View" 
            className="max-w-full max-h-[85vh] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-scaleUp bg-slate-900" 
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
