'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Warehouse } from 'lucide-react';
import Image from 'next/image';

export function CarruselCedis({ images, title, subtitle }: { images: string[]; title: string; subtitle: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasImages = images.length > 0;

  useEffect(() => {
    if (!hasImages) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length, hasImages]);

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-10 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-2">{title}</h2>
          <p className="font-body text-brand-navy/70 text-lg mb-4">{subtitle}</p>
          <div className="w-[60px] h-[3px] bg-brand-green" />
        </div>

        <div className="relative w-full h-80 md:h-[480px] rounded-xl overflow-hidden bg-brand-gray/10">
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
                    alt={`CEDIS ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1200px"
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}

              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-brand-green/80 backdrop-blur-sm p-2 rounded-full text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-brand-green/80 backdrop-blur-sm p-2 rounded-full text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

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
            <div className="w-full h-full flex items-center justify-center gap-4 p-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-1 h-full rounded-xl flex flex-col items-center justify-center gap-3"
                  style={{ background: 'rgba(44,62,75,0.08)' }}
                >
                  <Warehouse className="w-10 h-10" style={{ color: 'rgba(44,62,75,0.25)' }} />
                  <span className="font-body text-sm text-center" style={{ color: 'rgba(44,62,75,0.45)' }}>
                    Fotografías próximamente
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
