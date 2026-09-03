'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { VisualEditable } from '@/components/admin/VisualEditable';

interface Numeros {
  val: string;
  valId?: string;
  label: string;
  labelId?: string;
}

interface FundadoresSectionProps {
  numeros?: Numeros[];
  fotos?: string[];
  translations: {
    eyebrowId?: string;
    eyebrow: string;
    tituloId?: string;
    titulo: string;
    quoteId?: string;
    quote: string;
  };
}

function Counter({ value, trigger }: { value: string; trigger: boolean }) {
  const [count, setCount] = useState(0);
  const parsed = parseInt(value.replace(/[^0-9]/g, ''), 10);
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    if (!trigger || isNaN(parsed)) return;
    let start = 0;
    const duration = 1200;
    const steps = 30;
    const stepTime = duration / steps;
    const increment = Math.ceil(parsed / steps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= parsed) {
        setCount(parsed);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [parsed, trigger]);

  if (isNaN(parsed)) return <span>{value}</span>;
  return <span>{suffix.includes('+') ? `+${count}` : `${count}${suffix}`}</span>;
}

export function FundadoresSection({
  numeros = [
    { val: '+50', valId: 'historia.fundadores.stat1.numero', label: 'Años de historia', labelId: 'historia.fundadores.stat1.label' },
    { val: '3', valId: 'historia.fundadores.stat2.numero', label: 'Generaciones', labelId: 'historia.fundadores.stat2.label' },
    { val: '1965', valId: 'historia.fundadores.stat3.numero', label: 'Año de fundación', labelId: 'historia.fundadores.stat3.label' },
    { val: '100%', valId: 'historia.fundadores.stat4.numero', label: 'Legado familiar', labelId: 'historia.fundadores.stat4.label' },
  ],
  fotos = [
    '/images/fundadores/fundadores.jpg',
    '/images/fundadores/fundadores2.jpg',
  ],
  translations,
}: FundadoresSectionProps) {
  const { data: session } = useSession();
  const [inView, setInView] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for parallax offset
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      
      const scrolled = viewHeight - rect.top;
      if (scrolled > 0 && rect.bottom > 0) {
        setScrollY(scrolled);
      }

      if (rect.top < viewHeight * 0.8) {
        setInView(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="fundadores"
      ref={sectionRef} 
      className="w-full bg-white py-10 md:py-14 px-4 sm:px-6 relative overflow-hidden border-t border-brand-gray/10"
    >
      {/* Background soft Isotipo Watermark */}
      <div
        className="absolute left-[-60px] bottom-[-60px] w-[320px] h-[320px] bg-no-repeat bg-contain pointer-events-none opacity-[0.02] select-none"
        style={{ backgroundImage: 'url(/images/isotipo/isotipo-oscuro.png)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center">
        
        {/* Left Column: Heading, Quote and Stats (col-span-6) */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <VisualEditable id={translations.eyebrowId || 'historia.fundadores.eyebrow'} label="Eyebrow Fundadores">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-2 block">
              {translations.eyebrow}
            </span>
          </VisualEditable>
          
          <VisualEditable id={translations.tituloId || 'historia.fundadores.titulo'} label="Título Fundadores">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-brand-navy mb-4 leading-tight">
              {translations.titulo}
            </h2>
          </VisualEditable>
          <div className="w-[50px] h-[3px] bg-brand-green mb-5" />
          
          <VisualEditable id={translations.quoteId || 'historia.fundadores.texto'} label="Texto / Cita Fundadores">
            <blockquote className="border-l-4 border-brand-green pl-4 font-body italic text-brand-navy/70 text-sm md:text-base leading-relaxed mb-6 max-w-xl">
              &ldquo;{translations.quote}&rdquo;
            </blockquote>
          </VisualEditable>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {/* Stat 1 */}
            <div className="flex flex-col">
              <VisualEditable id={numeros[0]?.valId || 'historia.fundadores.stat1.numero'} label="Métrica 1 (Número)">
                <span className="font-display text-2xl md:text-3xl font-extrabold text-brand-navy leading-none">
                  <Counter value={numeros[0]?.val} trigger={inView} />
                </span>
              </VisualEditable>
              <VisualEditable id={numeros[0]?.labelId || 'historia.fundadores.stat1.label'} label="Métrica 1 (Etiqueta)">
                <span className="font-body text-xs text-brand-navy/60 mt-1.5 font-medium">
                  {numeros[0]?.label}
                </span>
              </VisualEditable>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col">
              <VisualEditable id={numeros[1]?.valId || 'historia.fundadores.stat2.numero'} label="Métrica 2 (Número)">
                <span className="font-display text-2xl md:text-3xl font-extrabold text-brand-navy leading-none">
                  <Counter value={numeros[1]?.val} trigger={inView} />
                </span>
              </VisualEditable>
              <VisualEditable id={numeros[1]?.labelId || 'historia.fundadores.stat2.label'} label="Métrica 2 (Etiqueta)">
                <span className="font-body text-xs text-brand-navy/60 mt-1.5 font-medium">
                  {numeros[1]?.label}
                </span>
              </VisualEditable>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col">
              <VisualEditable id={numeros[2]?.valId || 'historia.fundadores.stat3.numero'} label="Métrica 3 (Número)">
                <span className="font-display text-2xl md:text-3xl font-extrabold text-brand-navy leading-none">
                  <Counter value={numeros[2]?.val} trigger={inView} />
                </span>
              </VisualEditable>
              <VisualEditable id={numeros[2]?.labelId || 'historia.fundadores.stat3.label'} label="Métrica 3 (Etiqueta)">
                <span className="font-body text-xs text-brand-navy/60 mt-1.5 font-medium">
                  {numeros[2]?.label}
                </span>
              </VisualEditable>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col">
              <VisualEditable id={numeros[3]?.valId || 'historia.fundadores.stat4.numero'} label="Métrica 4 (Número)">
                <span className="font-display text-2xl md:text-3xl font-extrabold text-brand-navy leading-none">
                  <Counter value={numeros[3]?.val} trigger={inView} />
                </span>
              </VisualEditable>
              <VisualEditable id={numeros[3]?.labelId || 'historia.fundadores.stat4.label'} label="Métrica 4 (Etiqueta)">
                <span className="font-body text-xs text-brand-navy/60 mt-1.5 font-medium">
                  {numeros[3]?.label}
                </span>
              </VisualEditable>
            </div>
          </div>
        </div>

        {/* Right Column: 2-Image Overlapping Parallax Mosaic (col-span-6) */}
        <div className="lg:col-span-6 relative h-[340px] md:h-[400px] w-full flex items-center justify-center">
          <div className="relative w-full h-full max-w-[460px]">
            
            {/* Foto 1: Principal (Arriba / Izquierda) */}
            <div 
              className="absolute left-2 top-2 w-[60%] aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-2 border-brand-green/40 transition-transform duration-300 ease-out z-20 group"
              style={{ transform: `translateY(${scrollY * -0.02}px)` }}
            >
              {fotos[0] && (
                <VisualEditable id="historia.fundadores.foto1" label="Foto Principal Fundadores" type="image" className="w-full h-full">
                  <div className="relative w-full h-full">
                    <Image
                      src={fotos[0]}
                      alt="Fundadores GEC 1"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="400px"
                      priority
                    />
                  </div>
                </VisualEditable>
              )}
            </div>

            {/* Foto 2: Secundaria (Abajo / Derecha) */}
            <div 
              className="absolute right-2 bottom-2 w-[56%] aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border-2 border-brand-navy/20 transition-transform duration-300 ease-out z-10 group"
              style={{ transform: `translateY(${scrollY * 0.02}px)` }}
            >
              {fotos[1] && (
                <VisualEditable id="historia.fundadores.foto2" label="Foto Secundaria Fundadores" type="image" className="w-full h-full">
                  <div className="relative w-full h-full">
                    <Image
                      src={fotos[1]}
                      alt="Fundadores GEC 2"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="400px"
                    />
                  </div>
                </VisualEditable>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
