'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FundadoresSectionProps {
  titulo: string;
  subtitulo: string;
  texto: string;
  imagenPrincipal: string;
  imagenHover: string;
}

export function FundadoresSection({
  titulo,
  subtitulo,
  texto,
  imagenPrincipal,
  imagenHover,
}: FundadoresSectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden border-t border-brand-gray/10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header centered with logo line crossing the word Fundadores */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="relative inline-block">
            {/* The horizontal green line crossing at the middle height */}
            <div className="absolute left-0 right-0 top-[50%] -translate-y-1/2 h-[3.5px] bg-brand-green z-0" />
            <h2 className="font-display text-4xl md:text-5xl font-black text-brand-navy tracking-tight px-4 relative z-10 select-none bg-white">
              {titulo}
            </h2>
          </div>
        </div>

        {/* 2-Column layout: Left: Image, Right: Text */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left Column: Image Container (45% of width on desktop) */}
          <div className="md:col-span-6 lg:col-span-5 flex flex-col items-start w-full">
            <div 
              className="relative w-full aspect-[4/3] rounded-sm overflow-hidden border-[6px] border-brand-navy shadow-xl cursor-pointer group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Primary Image */}
              <div className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                <Image
                  src={imagenPrincipal}
                  alt="Fundadores GEC"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>

              {/* Hover (Fundadores 2) Image */}
              <div className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <Image
                  src={imagenHover}
                  alt="Fundadores GEC 2"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>

              {/* Elegant Bottom-Left overlay for Names */}
              <div className="absolute bottom-3 left-3 bg-brand-navy/85 backdrop-blur-sm text-brand-white text-[11px] md:text-xs font-bold font-body px-3 py-1.5 rounded-sm shadow-md border-l-2 border-brand-green tracking-wide">
                Sr. Ramiro Vizcaíno y Sra. Zeferina Torres
              </div>
            </div>
          </div>

          {/* Right Column: Text & Subtitle (55% of width on desktop) */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-center text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
              HISTORIA GEC
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold text-brand-navy mb-4 leading-tight">
              {subtitulo}
            </h3>
            <div className="w-12 h-[3px] bg-brand-green mb-6" />
            <p className="font-body text-brand-navy/80 text-sm md:text-base leading-relaxed max-w-xl">
              {texto}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
