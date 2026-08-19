'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { VisualEditable } from '@/components/admin/VisualEditable';

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
  const { data: session } = useSession();
  const [activeGen, setActiveGen] = useState<string>('1');

  // Filter hitos by generation
  const hitosGen1 = hitos.filter((h) => h.generacion === '1');
  const hitosGen2 = hitos.filter((h) => h.generacion === '2');
  const hitosGen3 = hitos.filter((h) => h.generacion === '3' || h.generacion === 'futuro');

  // Handle scroll tracking to highlight active generation and vertical text
  useEffect(() => {
    const handleScroll = () => {
      const b1 = document.getElementById('gen-block-1');
      const b2 = document.getElementById('gen-block-2');
      const b3 = document.getElementById('gen-block-3');
      if (!b1 || !b2 || !b3) return;

      const rect1 = b1.getBoundingClientRect();
      const rect2 = b2.getBoundingClientRect();
      const rect3 = b3.getBoundingClientRect();

      const midpoint = window.innerHeight * 0.45;

      if (rect3.top <= midpoint) {
        setActiveGen('3');
      } else if (rect2.top <= midpoint) {
        setActiveGen('2');
      } else {
        setActiveGen('1');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial run
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
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
    const animation = 'slide-left';
    const isFuture = hito.generacion === 'futuro';

    return (
      <div key={hito.id} className="relative flex flex-col md:flex-row items-center mb-16 md:mb-24 last:mb-0">
        {/* Left Side (Content) */}
        <div className="w-full md:w-[90%] md:pr-12 order-2 md:order-1 text-left">
          <AnimatedSection animation={animation}>
            <div className="bg-white/95 backdrop-blur p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 hover:border-brand-green/30 transition-all duration-300 group hover:-translate-y-1 text-left flex flex-col items-start">
              <VisualEditable id={`timeline.${hito.id}.anio`} label={`Hito ${hito.id.replace('hito', '')} - Año`}>
                <span className="inline-block bg-brand-green/10 text-brand-green font-bold text-xs px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
                  {hito.anio}
                </span>
              </VisualEditable>
              <VisualEditable id={`timeline.${hito.id}.titulo`} label={`Hito ${hito.id.replace('hito', '')} - Título`}>
                <h4 className="font-display text-lg md:text-xl font-bold text-brand-navy mb-3 group-hover:text-brand-green transition-colors">
                  {hito.titulo}
                </h4>
              </VisualEditable>
              {hito.desc && (
                <VisualEditable id={`timeline.${hito.id}.desc`} label={`Hito ${hito.id.replace('hito', '')} - Descripción`}>
                  <p className="font-body text-brand-navy/70 text-sm leading-relaxed mb-4">
                    {hito.desc}
                  </p>
                </VisualEditable>
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
                  {session && (
                    <div className="absolute top-2 right-2 z-35">
                      <VisualEditable id={`timeline.${hito.id}.imagen`} label={`Hito ${hito.id.replace('hito', '')} - Imagen`} type="image">
                        <button
                          type="button"
                          className="bg-brand-navy/90 hover:bg-brand-green text-white text-[9px] p-1.5 rounded-full shadow border border-brand-green/30 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                      </VisualEditable>
                    </div>
                  )}
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>

        {/* Right Side Timeline marker */}
        <div className="absolute right-4 md:left-[90%] md:-translate-x-1/2 top-0 bottom-0 flex flex-col items-center z-10">
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
      </div>
    );
  };

  return (
    <section id="linea-tiempo" className="relative w-full bg-gradient-to-b from-white via-[#0E202C]/65 to-[#0D1B24] py-24 px-4 sm:px-6 overflow-x-clip min-h-screen">
      
      {/* Decorative Spheres in Background */}
      <div className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full bg-brand-green/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[25%] right-[8%] w-96 h-96 rounded-full bg-brand-navy/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[50%] left-[10%] w-80 h-80 rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />
      <div className="absolute top-[70%] right-[5%] w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[15%] left-[8%] w-80 h-80 rounded-full bg-brand-green/10 blur-3xl pointer-events-none" />

      {/* Modern Background Dot Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#8da294_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]"
      />

      <div className="absolute top-[18%] left-[-150px] w-[500px] h-[500px] rounded-full border border-brand-navy/5 pointer-events-none z-0" />
      <div className="absolute top-[42%] right-[-200px] w-[600px] h-[600px] rounded-full border border-brand-green/10 pointer-events-none z-0" />
      <div className="absolute bottom-[28%] left-[-100px] w-[450px] h-[450px] rounded-full border border-white/5 pointer-events-none z-0 animate-pulse duration-[10000ms]" />
      <div className="absolute bottom-[8%] right-[-50px] w-[350px] h-[350px] rounded-full border border-white/5 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Column 1 (Left): Sticky Generation Title on Desktop - Horizontal */}
        <div className={`hidden lg:flex lg:col-span-2 lg:sticky lg:top-28 flex-col items-start select-none transition-colors duration-500 ${activeGen === '1' ? 'text-brand-navy' : 'text-white'}`}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes numSlideIn {
              0% { opacity: 0; transform: translateY(-10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .animate-num-slide {
              animation: numSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}} />
          {/* Horizontal Text "1ª Generación" */}
          <div className="flex flex-col items-start font-display font-black tracking-wider transition-colors duration-500">
            <span key={activeGen} className="text-6xl animate-num-slide leading-none mb-2">
              {activeGen}ª
            </span>
            <span className="text-xl uppercase tracking-widest">Generación</span>
          </div>
        </div>

        {/* Column 2 (Center): Timeline Track Column */}
        <div className="w-full lg:col-span-7 order-2 lg:order-none">
          
          <div className="text-center lg:text-left mb-16">
            <AnimatedSection animation="fade-up">
              <VisualEditable id="timeline.titulo" label="Título de Línea de Tiempo">
                <h2 className="font-display text-3xl md:text-5xl font-bold text-[#2C3E4B] mb-4">
                  {titulo}
                </h2>
              </VisualEditable>
            </AnimatedSection>
            <div className="w-[60px] h-[3px] bg-brand-green mx-auto lg:mx-0" />
          </div>

          <div className="relative pl-4 md:pl-0">
            {/* The vertical timeline track line */}
            <div className="absolute right-4 md:left-[90%] top-4 bottom-12 w-[3px] -translate-x-[1.5px] bg-gradient-to-b from-brand-green via-brand-navy/40 to-brand-green rounded-full pointer-events-none" />

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

        </div>

        {/* Column 3 (Right): Sticky Navigation Navigator on Desktop */}
        <div className="w-full lg:col-span-3 lg:sticky lg:top-28 self-start z-20 mb-8 lg:mb-0 flex flex-col gap-6 order-1 lg:order-none">
          <div className="bg-white/80 backdrop-blur p-4 rounded-xl shadow-lg border border-gray-100 flex flex-row lg:flex-col justify-around lg:justify-start gap-2">
            <h3 className="hidden lg:block font-display text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Navegación
            </h3>
            
            <button
              onClick={() => scrollToSection('gen-block-1')}
              className={`flex items-center gap-3 text-xs md:text-sm font-bold uppercase transition-all tracking-wider cursor-pointer ${
                activeGen === '1' ? 'text-brand-green border-b-2 lg:border-b-0 lg:border-l-2 border-brand-green pl-0 lg:pl-3 font-extrabold' : 'text-brand-navy/60 hover:text-brand-navy'
              }`}
            >
              <span>1ª Generación</span>
            </button>
            
            <button
              onClick={() => scrollToSection('gen-block-2')}
              className={`flex items-center gap-3 text-xs md:text-sm font-bold uppercase transition-all tracking-wider cursor-pointer ${
                activeGen === '2' ? 'text-brand-green border-b-2 lg:border-b-0 lg:border-l-2 border-brand-green pl-0 lg:pl-3 font-extrabold' : 'text-brand-navy/60 hover:text-brand-navy'
              }`}
            >
              <span>2ª Generación</span>
            </button>
            
            <button
              onClick={() => scrollToSection('gen-block-3')}
              className={`flex items-center gap-3 text-xs md:text-sm font-bold uppercase transition-all tracking-wider cursor-pointer ${
                activeGen === '3' ? 'text-brand-green border-b-2 lg:border-b-0 lg:border-l-2 border-brand-green pl-0 lg:pl-3 font-extrabold' : 'text-brand-navy/60 hover:text-brand-navy'
              }`}
            >
              <span>3ª Generación</span>
            </button>
          </div>
        </div>
      </div>

      {/* Huge Corner Watermark at the bottom right */}
      <div className="absolute right-[-220px] bottom-[-220px] w-[650px] h-[650px] opacity-[0.06] pointer-events-none select-none z-0">
        <Image
          src="/images/iconos/icono.png"
          alt="GEC Isotipo Huge Watermark"
          fill
          className="object-contain"
        />
      </div>
    </section>
  );
}
