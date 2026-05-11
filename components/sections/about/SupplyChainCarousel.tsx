'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ImageIcon, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export function SupplyChainCarousel({ 
  images, 
  title, 
  subtitle, 
  hasPrimus 
}: { 
  images: string[]; 
  title: string; 
  subtitle: string;
  hasPrimus: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const hasImages = images.length > 0;

  return (
    <section className="w-full bg-white py-16 md:py-20 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-brand-navy mb-2">
            {title}
          </h2>
          <p className="font-body text-brand-navy/70 text-lg mb-4">{subtitle}</p>
          <div className="w-[60px] h-[3px] bg-brand-green" />
        </div>

        <div className="relative w-full h-64 md:h-96 rounded-sm overflow-hidden bg-brand-gray/10 border border-brand-gray/20">
          {hasImages ? (
            <>
              {images.map((src, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Slide ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1200px"
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
              
              {/* Controls */}
              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-brand-green' : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            // Placeholders
            <div className="w-full h-full flex items-center justify-center gap-4 p-4 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1 h-full bg-brand-gray/20 flex items-center justify-center rounded-sm">
                  <ImageIcon className="w-8 h-8 text-brand-navy/20" />
                </div>
              ))}
            </div>
          )}

          {/* Primus Badge */}
          <div className="absolute bottom-4 right-4 z-10">
            {hasPrimus ? (
              <Image 
                src="/images/logos/PrimusGFS_Logo_web.png" 
                alt="Primus GFS Certification" 
                width={128}
                height={64}
                className="w-24 md:w-32 object-contain"
              />
            ) : (
              <div className="bg-white border-2 border-brand-green rounded-sm px-3 py-2 flex items-center gap-2 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-brand-green" />
                <span className="font-display font-bold text-brand-navy text-xs md:text-sm">Certificación Primus</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
