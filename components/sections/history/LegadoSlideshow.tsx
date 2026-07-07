'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

interface Slide {
  subtitulo: string;
  texto: string;
  pie: string;
  imagen: string;
}

interface LegadoSlideshowProps {
  titulo: string;
  slides: Slide[];
}

export function LegadoSlideshow({ titulo, slides }: LegadoSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const slideDuration = 6000; // 6 seconds per slide
  const stepTime = 50; // Progress bar updates every 50ms

  // Reset progress and intervals when index changes
  const resetAutoplay = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    setProgress(0);

    // Setup auto-advance
    timerRef.current = setTimeout(() => {
      handleNext();
    }, slideDuration);

    // Setup progress bar animation
    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min((elapsed / slideDuration) * 100, 100);
      setProgress(calculatedProgress);
    }, stepTime);
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const currentSlide = slides[currentIndex];

  if (!currentSlide) return null;

  return (
    <section className="w-full bg-brand-white py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Decorative background watermark */}
      <div 
        className="absolute left-[-150px] top-[-150px] w-[350px] h-[350px] bg-no-repeat bg-contain pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'url(/images/isotipo/isotipo-oscuro.png)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {titulo}
            </h2>
          </AnimatedSection>
          <div className="w-[60px] h-[3px] bg-brand-green" />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[420px]">
          
          {/* Left Column: Text Content & Navigation (7 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full order-2 lg:order-1">
            <div className="transition-all duration-500 ease-in-out transform">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-green block mb-3">
                {currentSlide.subtitulo}
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-6">
                {currentSlide.subtitulo}
              </h3>
              <p className="font-body text-brand-navy/80 text-lg leading-relaxed whitespace-pre-line min-h-[160px]">
                {currentSlide.texto}
              </p>
            </div>

            {/* Navigation & Progress indicators */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Manual Nav buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full border border-brand-navy/10 hover:border-brand-green flex items-center justify-center text-brand-navy hover:text-brand-green transition-all"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-brand-navy/10 hover:border-brand-green flex items-center justify-center text-brand-navy hover:text-brand-green transition-all"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar & Dots */}
              <div className="flex-1 max-w-xs w-full flex items-center gap-4">
                {/* Horizontal Auto-playing Time Line */}
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden flex-1 relative">
                  <div
                    className="absolute left-0 top-0 h-full bg-brand-green transition-all duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Slider Dots */}
                <div className="flex items-center gap-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDotClick(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        currentIndex === idx ? 'bg-brand-green w-6' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Slide Image (5 cols) */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gray-50 group">
              <Image
                src={currentSlide.imagen || '/images/zacatecas/_DSC3592.jpg'}
                alt={currentSlide.pie}
                fill
                className="object-cover transition-transform duration-700 ease-out scale-100 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              
              {/* Bottom Image caption overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/40 to-transparent p-6 pt-16">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-green block mb-1">
                  {currentSlide.subtitulo}
                </span>
                <p className="font-display text-white text-lg font-bold">
                  {currentSlide.pie}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
