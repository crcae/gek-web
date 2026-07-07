'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

interface Hito {
  id: string;
  anio: string;
  titulo: string;
  desc: string;
  imagen: string;
  generacion: string;
}

interface TimelineProps {
  hitos: Hito[];
  titulo: string;
}

export function Timeline({ hitos, titulo }: TimelineProps) {
  const [activeGen, setActiveGen] = useState<string>('1');

  // Filter hitos by generation
  const hitosGen1 = hitos.filter((h) => h.generacion === '1');
  const hitosGen2 = hitos.filter((h) => h.generacion === '2');
  const hitosGen3 = hitos.filter((h) => h.generacion === '3' || h.generacion === 'futuro');

  // Handle intersection observer to highlight side nav active generation
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const gen = entry.target.getAttribute('data-gen');
          if (gen) setActiveGen(gen);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    ['gen-block-1', 'gen-block-2', 'gen-block-3'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const renderHitoCard = (hito: Hito, index: number) => {
    const esIzquierda = index % 2 === 0;
    const animation = esIzquierda ? 'slide-left' : 'slide-right';
    const isFuture = hito.generacion === 'futuro';

    return (
      <div key={hito.id} className="relative flex flex-col md:flex-row items-center mb-16 md:mb-24 last:mb-0">
        {/* Desktop alternating layout */}
        {/* Left Side */}
        <div className="w-full md:w-1/2 md:pr-12 md:text-right order-2 md:order-1">
          {esIzquierda && (
            <AnimatedSection animation={animation}>
              <div className="bg-white/95 backdrop-blur p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 hover:border-brand-green/30 transition-all duration-300 group hover:-translate-y-1 text-left md:text-right flex flex-col md:items-end">
                <span className="inline-block bg-brand-green/10 text-brand-green font-bold text-xs px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
                  {hito.anio}
                </span>
                <h4 className="font-display text-lg md:text-xl font-bold text-brand-navy mb-3 group-hover:text-brand-green transition-colors">
                  {hito.titulo}
                </h4>
                {hito.desc && (
                  <p className="font-body text-brand-navy/70 text-sm leading-relaxed mb-4">
                    {hito.desc}
                  </p>
                )}
                {hito.imagen && (
                  <div className="relative w-full aspect-[16/10] max-w-sm rounded-lg overflow-hidden border border-gray-100 mt-2 shadow-sm">
                    <Image
                      src={hito.imagen}
                      alt={hito.titulo}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                )}
              </div>
            </AnimatedSection>
          )}
        </div>

        {/* Central timeline marker */}
        <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 flex flex-col items-center z-10">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all duration-300 ${
            isFuture ? 'bg-brand-green animate-bounce' : 'bg-brand-navy hover:scale-110'
          }`}>
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
          </div>
          {/* Internal decade/year tag */}
          <span className="mt-2 text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100 uppercase tracking-widest md:hidden">
            {hito.anio}
          </span>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 md:pl-12 order-3 md:order-2 pl-12 md:pl-12 text-left">
          {!esIzquierda && (
            <AnimatedSection animation={animation}>
              <div className="bg-white/95 backdrop-blur p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 hover:border-brand-green/30 transition-all duration-300 group hover:-translate-y-1 text-left flex flex-col items-start">
                <span className="inline-block bg-brand-green/10 text-brand-green font-bold text-xs px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
                  {hito.anio}
                </span>
                <h4 className="font-display text-lg md:text-xl font-bold text-brand-navy mb-3 group-hover:text-brand-green transition-colors">
                  {hito.titulo}
                </h4>
                {hito.desc && (
                  <p className="font-body text-brand-navy/70 text-sm leading-relaxed mb-4">
                    {hito.desc}
                  </p>
                )}
                {hito.imagen && (
                  <div className="relative w-full aspect-[16/10] max-w-sm rounded-lg overflow-hidden border border-gray-100 mt-2 shadow-sm">
                    <Image
                      src={hito.imagen}
                      alt={hito.titulo}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                )}
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-white via-[#0E202C]/65 to-[#0D1B24] py-24 px-4 sm:px-6 overflow-hidden min-h-screen">
      
      {/* Decorative Spheres in Background */}
      {/* Top Spheres (Green/Blue) */}
      <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-brand-green/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[25%] right-[8%] w-96 h-96 rounded-full bg-brand-navy/5 blur-3xl pointer-events-none" />

      {/* Middle Spheres (Light blue/Cyan) */}
      <div className="absolute top-[50%] left-[10%] w-80 h-80 rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[70%] right-[5%] w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      {/* Bottom Spheres (Light green) */}
      <div className="absolute bottom-[15%] left-[8%] w-80 h-80 rounded-full bg-brand-green/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Floating Generation Navigator */}
        <div className="w-full lg:w-1/4 lg:sticky lg:top-28 self-start z-20 mb-8 lg:mb-0">
          <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-row lg:flex-col justify-around lg:justify-start gap-4">
            <h3 className="hidden lg:block font-display text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Navegación
            </h3>
            
            <button
              onClick={() => scrollToSection('gen-block-1')}
              className={`flex items-center gap-3 text-xs md:text-sm font-bold uppercase transition-all tracking-wider ${
                activeGen === '1' ? 'text-brand-green border-b-2 lg:border-b-0 lg:border-l-2 border-brand-green pl-0 lg:pl-3 font-extrabold' : 'text-brand-navy/60 hover:text-brand-navy'
              }`}
            >
              <span>1ª Generación</span>
            </button>
            
            <button
              onClick={() => scrollToSection('gen-block-2')}
              className={`flex items-center gap-3 text-xs md:text-sm font-bold uppercase transition-all tracking-wider ${
                activeGen === '2' ? 'text-brand-green border-b-2 lg:border-b-0 lg:border-l-2 border-brand-green pl-0 lg:pl-3 font-extrabold' : 'text-brand-navy/60 hover:text-brand-navy'
              }`}
            >
              <span>2ª Generación</span>
            </button>
            
            <button
              onClick={() => scrollToSection('gen-block-3')}
              className={`flex items-center gap-3 text-xs md:text-sm font-bold uppercase transition-all tracking-wider ${
                activeGen === '3' ? 'text-brand-green border-b-2 lg:border-b-0 lg:border-l-2 border-brand-green pl-0 lg:pl-3 font-extrabold' : 'text-brand-navy/60 hover:text-brand-navy'
              }`}
            >
              <span>3ª Generación</span>
            </button>
          </div>
        </div>

        {/* Right Side: Timeline Track */}
        <div className="w-full lg:w-3/4">
          
          <div className="text-center lg:text-left mb-16">
            <AnimatedSection animation="fade-up">
              <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-navy mb-4">
                {titulo}
              </h2>
            </AnimatedSection>
            <div className="w-[60px] h-[3px] bg-brand-green mx-auto lg:mx-0" />
          </div>

          <div className="relative pl-4 md:pl-0">
            {/* The vertical timeline track line */}
            <div className="absolute left-4 md:left-1/2 top-4 bottom-12 w-[3px] -translate-x-[1.5px] bg-gradient-to-b from-brand-green via-brand-navy/40 to-brand-green rounded-full pointer-events-none" />

            {/* BLOCK 1: Primera Generación */}
            <div id="gen-block-1" data-gen="1" className="mb-20 scroll-mt-24">
              <div className="flex items-center gap-4 mb-10 justify-start md:justify-center">
                <span className="px-4 py-1.5 rounded-full bg-brand-navy text-white text-xs font-bold uppercase tracking-widest shadow-md">
                  Primera Generación
                </span>
              </div>
              <div className="space-y-4">
                {hitosGen1.map((hito, idx) => renderHitoCard(hito, idx))}
              </div>
            </div>

            {/* BLOCK 2: Segunda Generación */}
            <div id="gen-block-2" data-gen="2" className="mb-20 scroll-mt-24">
              <div className="flex items-center gap-4 mb-10 justify-start md:justify-center">
                <span className="px-4 py-1.5 rounded-full bg-brand-navy text-white text-xs font-bold uppercase tracking-widest shadow-md">
                  Segunda Generación
                </span>
              </div>
              <div className="space-y-4">
                {hitosGen2.map((hito, idx) => renderHitoCard(hito, idx))}
              </div>
            </div>

            {/* BLOCK 3: Tercera Generación */}
            <div id="gen-block-3" data-gen="3" className="scroll-mt-24">
              <div className="flex items-center gap-4 mb-10 justify-start md:justify-center">
                <span className="px-4 py-1.5 rounded-full bg-brand-navy text-white text-xs font-bold uppercase tracking-widest shadow-md">
                  Tercera Generación
                </span>
              </div>
              <div className="space-y-4">
                {hitosGen3.map((hito, idx) => renderHitoCard(hito, idx))}
              </div>
            </div>

          </div>

          {/* Bottom GEC Isotipo icon */}
          <div className="flex flex-col items-center justify-center mt-24 mb-12">
            <div className="relative w-16 h-16 opacity-35 hover:opacity-100 transition-opacity duration-300">
              <Image
                src="/images/isotipo/isotipo-claro.png"
                alt="GEC Isotipo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[10px] text-white/30 uppercase tracking-widest font-body mt-2">
              Grupo Exportador del Campo
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
