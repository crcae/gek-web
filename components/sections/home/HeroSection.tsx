'use client';

import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';

export function HeroSection({ tagline, subtitle }: { tagline: string; subtitle: string }) {
  const t = useTranslations('Hero');

  const scrollToNext = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-brand-navy">
      {/* Background Video */}
      {/* VIDEO: colocar hero.mp4 en /public/videos/institucional/
          Resolución recomendada: 1920x1080, formato MP4 H.264
          Tamaño máximo recomendado: 15MB (comprimir con HandBrake si es necesario) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/images/zacatecas/_DSC3760.jpg"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/institucional/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ background: 'linear-gradient(to right, rgba(13,27,36,0.85) 0%, rgba(13,27,36,0.6) 50%, rgba(13,27,36,0.3) 100%)' }}
      />

      {/* Content aligned bottom-left */}
      <div className="absolute bottom-20 left-6 md:left-16 z-20 flex flex-col items-start px-4 max-w-4xl">
        
        {/* Eyebrow */}
        <AnimatedSection animation="fade-up" delay={1} className="flex items-center gap-4 mb-4">
          <div className="h-[2px] w-[40px] bg-brand-green" />
          <span className="text-[11px] tracking-[0.2em] text-white/70 uppercase font-lora">
            Desde Loreto, Zacatecas
          </span>
        </AnimatedSection>

        {/* Tagline */}
        <AnimatedSection animation="fade-up" delay={2}>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-brand-white font-bold leading-tight mb-4" dangerouslySetInnerHTML={{ __html: tagline }}>
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
          {/* TODO: activar cuando esté listo */}
          <button
            onClick={scrollToNext}
            className="btn-primary bg-brand-green text-brand-white font-body py-3 px-8 text-lg font-medium hover:bg-opacity-90 transition-all rounded-sm min-h-[44px]"
          >
            {t('cta')}
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
}
