
import React, { useState } from 'react';

const Gallery: React.FC = () => {
  const images = [
    { url: "/images/bbc1.jpg", title: "BBC Ministry 1" },
    { url: "/images/bbc2.jpg", title: "BBC Ministry 2" },
    { url: "/images/bbc3.jpg", title: "BBC Ministry 3" },
    { url: "/images/bbc4.jpg", title: "BBC Ministry 4" },
    { url: "/images/bbc5.jpg", title: "BBC Ministry 5" },
    { url: "/images/bbc6.jpg", title: "BBC Ministry 6" },
    { url: "/images/bbc7.jpg", title: "BBC Ministry 7" },
    { url: "/images/bbc8.jpg", title: "BBC Ministry 8" },
    { url: "/images/bbc9.jpg", title: "BBC Ministry 9" },
    { url: "/images/bbc10.jpg", title: "BBC Ministry 10" },
    { url: "/images/bbc11.jpg", title: "BBC Ministry 11" },
    { url: "/images/bbc12.jpg", title: "BBC Ministry 12" },
    { url: "/images/bbc13.jpg", title: "BBC Ministry 13" },
    { url: "/images/bbc-man.jpg", title: "Men's Ministry" },
    { url: "/images/bbcprayer.jpg", title: "Prayer Meeting" },
    { url: "/images/bbcevangelismapstle.jpg", title: "Evangelism" },
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
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 lg:gap-6 space-y-4 sm:space-y-6 min-h-[150px] sm:min-h-[200px]">
            {images.map((img, idx) => (
              <div 
                key={idx} 
className="relative group cursor-pointer overflow-hidden rounded-[2rem] break-inside-avoid shadow-sm hover:shadow-2xl transition-all duration-500 bg-slate-200 min-h-[150px] sm:min-h-[200px]"
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
            className="max-w-full max-h-[80vh] sm:max-h-[85vh] rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-scaleUp bg-slate-900" 
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
