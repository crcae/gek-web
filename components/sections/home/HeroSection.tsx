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
    <section className="relative w-full h-[calc(100vh-3.5rem)] overflow-hidden bg-gradient-to-b from-brand-navy to-gray-900 flex flex-col items-center justify-center">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/images/zacatecas/_DSC3760.jpg"
        className="absolute inset-0 w-full h-full object-cover z-0 bg-brand-navy"
      >
        <source src="/videos/institucional/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-brand-navy/65 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">

        <AnimatedSection animation="fade-up" delay={1}>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-white font-bold leading-tight mb-4">
            {tagline}
          </h1>
        </AnimatedSection>

        <AnimatedLine className="h-[2px] bg-brand-green mb-6 mx-auto stagger-2" />

        <AnimatedSection animation="fade-up" delay={2}>
          <p className="font-body text-brand-white/85 text-base md:text-xl mb-10 max-w-2xl">
            {subtitle}
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={3}>
          <button
            onClick={scrollToNext}
            className="btn-primary w-full sm:w-auto bg-brand-green text-brand-white font-body py-3 px-8 text-lg font-medium hover:bg-opacity-90 transition-all rounded-sm min-h-[44px]"
          >
            {t('cta')}
          </button>
        </AnimatedSection>
      </div>
    </section>
  );
}
