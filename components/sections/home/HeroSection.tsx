'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Volume2,
  VolumeX,
  Settings,
  Play,
  Maximize2,
  Minimize2,
  X,
  Film,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { VisualEditable } from '@/components/admin/VisualEditable';

export function HeroSection({
  eyebrow,
  tagline,
  subtitle,
  videoUrl,
}: {
  eyebrow: string;
  tagline: string;
  subtitle: string;
  videoUrl: string;
}) {
  const { data: session } = useSession();
  const t = useTranslations('home');

  const [isMuted, setIsMuted] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const openVideoModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setVideoModalOpen(true);
    // Play with sound once modal video is mounted
    setTimeout(() => {
      if (modalVideoRef.current) {
        modalVideoRef.current.muted = false;
        modalVideoRef.current.currentTime = 0;
        modalVideoRef.current.play().catch(() => {
          // Fallback if browser blocks unmuted autoplay
          if (modalVideoRef.current) {
            modalVideoRef.current.muted = true;
            modalVideoRef.current.play();
          }
        });
      }
    }, 150);
  };

  const closeVideoModal = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setVideoModalOpen(false);
    setIsNativeFullscreen(false);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      if (modalContainerRef.current?.requestFullscreen) {
        modalContainerRef.current.requestFullscreen().catch(() => {});
        setIsNativeFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsNativeFullscreen(false);
      }
    }
  };

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeVideoModal();
      }
    };
    if (videoModalOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [videoModalOpen]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsNativeFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-brand-navy">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0">
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
      </div>

      {/* Subtle Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(13,27,36,0.55) 0%, rgba(13,27,36,0.30) 60%, rgba(13,27,36,0.15) 100%)',
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
      </div>

      {/* Sound, Watch Full Video & Admin Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-4 sm:right-8 z-30 flex flex-wrap items-center justify-end gap-2.5 sm:gap-3">
        {/* Watch Full Video Button (Pill) */}
        <button
          onClick={openVideoModal}
          className="inline-flex items-center gap-2 bg-black/50 hover:bg-black/80 backdrop-blur-md text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full border border-white/20 hover:border-brand-green/60 shadow-lg hover:shadow-brand-green/20 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
          title="Ver video institucional completo en pantalla completa"
        >
          <span className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center text-brand-navy shadow-sm group-hover:scale-110 transition-transform">
            <Play className="w-3.5 h-3.5 fill-current ml-0.5 text-brand-navy" />
          </span>
          <span className="tracking-wide">Ver video completo</span>
          <Maximize2 className="w-3.5 h-3.5 text-white/60 group-hover:text-brand-green transition-colors hidden sm:inline" />
        </button>

        {/* Admin Video Manager */}
        {session && (
          <VisualEditable id="home.hero.video" label="Video de Fondo (Hero)" type="video">
            <button
              className="bg-brand-navy hover:bg-brand-green text-white text-xs font-bold px-3.5 py-2.5 rounded-full shadow-lg transition-all duration-200 border border-brand-green/30 flex items-center gap-1.5 cursor-pointer"
              title="Cambiar Video de Fondo"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Administrar</span>
            </button>
          </VisualEditable>
        )}

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="w-10 h-10 sm:w-11 sm:h-11 bg-black/50 hover:bg-black/75 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all focus:outline-none focus:ring-2 focus:ring-brand-green cursor-pointer border border-white/10"
          aria-label={isMuted ? t('activar_sonido') : t('silenciar_sonido')}
          title={isMuted ? 'Activar sonido de fondo' : 'Silenciar sonido'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      </div>

      {/* ── CINEMA MODE / FULLSCREEN MODAL ── */}
      {mounted && videoModalOpen && createPortal(
        <div
          ref={modalContainerRef}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 md:p-8 animate-in fade-in duration-300"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-4 w-full max-w-6xl mx-auto z-10 shrink-0">
            <div className="flex items-center gap-3 text-white">
              <div className="w-9 h-9 rounded-xl bg-brand-green/20 border border-brand-green/40 flex items-center justify-center text-brand-green">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white leading-tight">
                  Grupo Exportador del Campo
                </h3>
                <p className="text-xs text-brand-green font-medium tracking-wide">
                  Video Institucional Completo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Native Fullscreen Button */}
              <button
                onClick={toggleNativeFullscreen}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/15 transition-all"
                title={isNativeFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              >
                {isNativeFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    <span>Reducir</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4" />
                    <span>Pantalla Completa</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={closeVideoModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-red-500/80 text-white text-xs font-semibold backdrop-blur-sm border border-white/15 hover:border-red-400 transition-all cursor-pointer group"
                title="Cerrar video (ESC)"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                <span className="hidden sm:inline">Cerrar (ESC)</span>
              </button>
            </div>
          </div>

          {/* Center: Video Player */}
          <div className="flex-1 flex items-center justify-center my-4 w-full">
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/15">
              <video
                ref={modalVideoRef}
                src={videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain bg-black"
              />
            </div>
          </div>

          {/* Bottom Caption Bar */}
          <div className="text-center text-xs text-white/50 w-full max-w-6xl mx-auto shrink-0 pb-1">
            <span>&ldquo;{tagline}&rdquo; — {subtitle}</span>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
