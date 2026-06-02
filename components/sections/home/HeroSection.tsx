'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Volume2, VolumeX } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export function HeroSection({ tagline, subtitle }: { tagline: string; subtitle: string }) {
  const t = useTranslations('home');
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const scrollToNext = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-brand-navy">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        poster="/images/zacatecas/_DSC3760.jpg"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/institucional/hero.mp4" type="video/mp4" />
      </video>

      {/* Subtle Overlay */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none" 
        style={{
          background: 'linear-gradient(to right, rgba(13,27,36,0.70) 0%, rgba(13,27,36,0.45) 60%, rgba(13,27,36,0.20) 100%)'
        }}
      />

      {/* Content aligned bottom-left */}
      <div className="absolute bottom-20 left-6 md:left-16 z-20 flex flex-col items-start px-4 max-w-4xl">
        
        {/* Eyebrow */}
        <AnimatedSection animation="fade-up" delay={1} className="flex items-center gap-4 mb-4">
          <div className="h-[2px] w-[40px] bg-brand-green" />
          <span className="text-[11px] tracking-[0.2em] text-white/70 uppercase font-lora font-medium">
            {t('hero_eyebrow')}
          </span>
        </AnimatedSection>

        {/* Tagline */}
        <AnimatedSection animation="fade-up" delay={2}>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-brand-white font-bold leading-tight mb-4">
            {t('hero_tagline')} <span className="text-brand-green">GEC</span>
          </h1>
        </AnimatedSection>

        {/* Subtitle */}
        <AnimatedSection animation="fade-up" delay={3}>
          <p className="font-lora text-white/80 text-lg max-w-2xl mt-4 line-clamp-2">
            {subtitle}
          </p>
        </AnimatedSection>

        {/* CTA (hidden) */}
        <AnimatedSection animation="fade-up" delay={4} className="hidden mt-8">
          {/* TODO: activar CTA cuando esté listo */}
          <button
            onClick={scrollToNext}
            className="btn-primary bg-brand-green text-brand-white font-body py-3 px-8 text-lg font-medium hover:bg-opacity-90 transition-all rounded-sm min-h-[44px]"
          >
            {t('hero_cta')}
          </button>
        </AnimatedSection>
      </div>

      {/* Sound Control Button */}
      <button
        onClick={toggleSound}
        className="absolute bottom-6 right-6 z-30 w-11 h-11 bg-black/50 hover:bg-black/75 rounded-full flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green"
        aria-label={isMuted ? t('activar_sonido') : t('silenciar_sonido')}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </section>
  );
}
