'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { VisualEditable } from '@/components/admin/VisualEditable';

export function HeroSection({ eyebrow, tagline, subtitle, videoUrl }: { eyebrow: string; tagline: string; subtitle: string; videoUrl: string }) {
  const { data: session } = useSession();
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
      {/* Background Video */}
      <VisualEditable
        id="home.hero.video"
        label="Video de Fondo (Hero)"
        type="video"
        className="absolute inset-0 w-full h-full z-0"
      >
        <video
          ref={videoRef}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          poster="/images/zacatecas/_DSC3760.jpg"
          className="w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </VisualEditable>

      {/* Subtle Overlay */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none" 
        style={{
          background: 'linear-gradient(to right, rgba(13,27,36,0.45) 0%, rgba(13,27,36,0.25) 60%, rgba(13,27,36,0.10) 100%)'
        }}
      />

      {/* Content aligned bottom-left */}
      <div className="absolute bottom-20 left-6 md:left-16 z-20 flex flex-col items-start px-4 max-w-4xl">
        
        {/* Eyebrow */}
        <AnimatedSection animation="fade-up" delay={1} className="flex items-center gap-4 mb-4">
          <div className="h-[2px] w-[40px] bg-brand-green" />
          <VisualEditable id="home.hero.eyebrow" label="Eyebrow del Hero">
            <span className="text-[11px] tracking-[0.2em] text-white/70 uppercase font-lora font-medium block">
              {eyebrow}
            </span>
          </VisualEditable>
        </AnimatedSection>

        {/* Tagline */}
        <AnimatedSection animation="fade-up" delay={2}>
          <VisualEditable id="home.hero.tagline" label="Tagline del Hero">
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-brand-white font-bold leading-tight mb-4">
              {tagline}
            </h1>
          </VisualEditable>
        </AnimatedSection>

        {/* Subtitle */}
        <AnimatedSection animation="fade-up" delay={3}>
          <VisualEditable id="home.hero.sub" label="Subtítulo del Hero">
            <p className="font-lora text-white/80 text-lg max-w-2xl mt-4 line-clamp-2">
              {subtitle}
            </p>
          </VisualEditable>
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

      {/* Sound & Admin Controls */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3">
        {session && (
          <VisualEditable id="home.hero.video" label="Video de Fondo (Hero)" type="video">
            <button
              className="bg-brand-navy hover:bg-brand-green text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg transition-all duration-200 border border-brand-green/30 flex items-center gap-2 min-h-[40px] cursor-pointer"
              title="Cambiar Video de Fondo"
            >
              <Settings className="w-3.5 h-3.5" />
              Administrar Video
            </button>
          </VisualEditable>
        )}
        <button
          onClick={toggleSound}
          className="w-11 h-11 bg-black/50 hover:bg-black/75 rounded-full flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green cursor-pointer"
          aria-label={isMuted ? t('activar_sonido') : t('silenciar_sonido')}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </section>
  );
}
