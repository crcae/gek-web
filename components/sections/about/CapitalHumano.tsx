'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { VisualEditable } from '@/components/admin/VisualEditable';

interface Numeros {
  val: string;
  valId?: string;
  label: string;
  labelId?: string;
}

interface Props {
  numeros: Numeros[];
  fotos: string[];
  translations: {
    eyebrowId?: string;
    eyebrow: string;
    tituloId?: string;
    titulo: string;
    quoteId?: string;
    quote: string;
    foto: string;
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

export function CapitalHumano({ numeros, fotos, translations }: Props) {
  const { data: session } = useSession();
  const [inView, setInView] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Monitor scroll for parallax mosaic offset
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
      id="capital-humano"
      ref={sectionRef} 
      className="w-full bg-white py-20 px-4 sm:px-6 relative overflow-hidden border-b border-brand-gray/10"
    >
      {/* Background soft Isotipo Watermark */}
      <div
        className="absolute left-[-60px] bottom-[-60px] w-[350px] h-[350px] bg-no-repeat bg-contain pointer-events-none opacity-[0.02] select-none"
        style={{ backgroundImage: 'url(/images/isotipo/isotipo-oscuro.png)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Heading and Stats (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <VisualEditable id={translations.eyebrowId || 'quienes.capital.eyebrow'} label="Eyebrow de Capital Humano">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
              {translations.eyebrow}
            </span>
          </VisualEditable>
          
          <VisualEditable id={translations.tituloId || 'quienes.capital.titulo'} label="Título de Capital Humano">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-navy mb-6 leading-tight">
              {translations.titulo}
            </h2>
          </VisualEditable>
          <div className="w-[60px] h-[3.5px] bg-brand-green mb-8" />
          
          <VisualEditable id={translations.quoteId || 'quienes.capital.quote'} label="Cita de Capital Humano">
            <blockquote className="border-l-4 border-brand-green pl-4 font-body italic text-brand-navy/70 text-sm md:text-base leading-relaxed mb-10 max-w-xl">
              &ldquo;{translations.quote}&rdquo;
            </blockquote>
          </VisualEditable>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6 md:gap-8">
            {/* Stat 1 */}
            <div className="flex flex-col">
              <VisualEditable id={numeros[0]?.valId || ''} label="Métrica 1 (Número)">
                <span className="font-display text-3xl md:text-4xl font-extrabold text-brand-navy leading-none">
                  <Counter value={numeros[0]?.val} trigger={inView} />
                </span>
              </VisualEditable>
              <VisualEditable id={numeros[0]?.labelId || ''} label="Métrica 1 (Etiqueta)">
                <span className="font-body text-xs md:text-sm text-brand-navy/60 mt-2 font-medium">
                  {numeros[0]?.label}
                </span>
              </VisualEditable>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col">
              <VisualEditable id={numeros[1]?.valId || ''} label="Métrica 2 (Número)">
                <span className="font-display text-3xl md:text-4xl font-extrabold text-brand-navy leading-none">
                  <Counter value={numeros[1]?.val} trigger={inView} />
                </span>
              </VisualEditable>
              <VisualEditable id={numeros[1]?.labelId || ''} label="Métrica 2 (Etiqueta)">
                <span className="font-body text-xs md:text-sm text-brand-navy/60 mt-2 font-medium">
                  {numeros[1]?.label}
                </span>
              </VisualEditable>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col">
              <VisualEditable id={numeros[2]?.valId || ''} label="Métrica 3 (Número)">
                <span className="font-display text-3xl md:text-4xl font-extrabold text-brand-navy leading-none">
                  <Counter value={numeros[2]?.val} trigger={inView} />
                </span>
              </VisualEditable>
              <VisualEditable id={numeros[2]?.labelId || ''} label="Métrica 3 (Etiqueta)">
                <span className="font-body text-xs md:text-sm text-brand-navy/60 mt-2 font-medium">
                  {numeros[2]?.label}
                </span>
              </VisualEditable>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col">
              <VisualEditable id={numeros[3]?.valId || ''} label="Métrica 4 (Número)">
                <span className="font-display text-3xl md:text-4xl font-extrabold text-brand-navy leading-none">
                  <Counter value={numeros[3]?.val} trigger={inView} />
                </span>
              </VisualEditable>
              <VisualEditable id={numeros[3]?.labelId || ''} label="Métrica 4 (Etiqueta)">
                <span className="font-body text-xs md:text-sm text-brand-navy/60 mt-2 font-medium">
                  {numeros[3]?.label}
                </span>
              </VisualEditable>
            </div>
          </div>
        </div>

        {/* Right Column: Parallax Mosaic (col-span-7) */}
        <div className="lg:col-span-7 relative h-[450px] md:h-[550px] w-full flex items-center justify-center">
          <div className="relative w-full h-full max-w-[550px]">
            
            {/* Parallax Image 1: Top Left */}
            <div 
              className="absolute left-4 top-4 w-[42%] aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-green/30 transition-transform duration-300 ease-out z-20 group"
              style={{ transform: `translateY(${scrollY * -0.03}px)` }}
            >
              {fotos[0] && (
                <>
                  <Image
                    src={fotos[0]}
                    alt="Equipo GEC 1"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="350px"
                    priority
                  />
                  {session && (
                    <div className="absolute top-2 right-2 z-30">
                      <VisualEditable id="quienes.capital.foto1" label="Foto de Capital Humano 1" type="image">
                        <button
                          type="button"
                          className="bg-brand-navy/90 hover:bg-brand-green text-white text-[9px] font-bold px-2 py-1 rounded-full shadow border border-brand-green/30 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                      </VisualEditable>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Parallax Image 2: Top Right */}
            <div 
              className="absolute right-4 top-16 w-[42%] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-navy/15 transition-transform duration-300 ease-out z-10 group"
              style={{ transform: `translateY(${scrollY * 0.04}px)` }}
            >
              {fotos[1] && (
                <>
                  <Image
                    src={fotos[1]}
                    alt="Equipo GEC 2"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="350px"
                  />
                  {session && (
                    <div className="absolute top-2 right-2 z-30">
                      <VisualEditable id="quienes.capital.foto2" label="Foto de Capital Humano 2" type="image">
                        <button
                          type="button"
                          className="bg-brand-navy/90 hover:bg-brand-green text-white text-[9px] font-bold px-2 py-1 rounded-full shadow border border-brand-green/30 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                      </VisualEditable>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Parallax Image 3: Bottom Left */}
            <div 
              className="absolute left-12 bottom-12 w-[42%] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-navy/15 transition-transform duration-300 ease-out z-10 group"
              style={{ transform: `translateY(${scrollY * -0.05}px)` }}
            >
              {fotos[2] && (
                <>
                  <Image
                    src={fotos[2]}
                    alt="Equipo GEC 3"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="350px"
                  />
                  {session && (
                    <div className="absolute top-2 right-2 z-30">
                      <VisualEditable id="quienes.capital.foto3" label="Foto de Capital Humano 3" type="image">
                        <button
                          type="button"
                          className="bg-brand-navy/90 hover:bg-brand-green text-white text-[9px] font-bold px-2 py-1 rounded-full shadow border border-brand-green/30 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                      </VisualEditable>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Parallax Image 4: Bottom Right */}
            <div 
              className="absolute right-8 bottom-4 w-[42%] aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-green/30 transition-transform duration-300 ease-out z-20 group"
              style={{ transform: `translateY(${scrollY * 0.02}px)` }}
            >
              {fotos[3] && (
                <>
                  <Image
                    src={fotos[3]}
                    alt="Equipo GEC 4"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="350px"
                  />
                  {session && (
                    <div className="absolute top-2 right-2 z-30">
                      <VisualEditable id="quienes.capital.foto4" label="Foto de Capital Humano 4" type="image">
                        <button
                          type="button"
                          className="bg-brand-navy/90 hover:bg-brand-green text-white text-[9px] font-bold px-2 py-1 rounded-full shadow border border-brand-green/30 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                      </VisualEditable>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
