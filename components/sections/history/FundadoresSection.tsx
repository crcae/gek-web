'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { VisualEditable } from '@/components/admin/VisualEditable';

interface FundadoresSectionProps {
  titulo: string;
  subtitulo: string;
  texto: string;
  imagenPrincipal: string;
  imagenHover: string;
  captionText?: string;
}

export function FundadoresSection({
  titulo,
  subtitulo,
  texto,
  imagenPrincipal,
  imagenHover,
  captionText = 'Sr. Ramiro Vizcaíno y Sra. Zeferina Torres',
}: FundadoresSectionProps) {
  const { data: session } = useSession();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden border-t border-brand-gray/10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header centered */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="relative inline-block">
            <div className="absolute left-0 right-0 top-[50%] -translate-y-1/2 h-[3.5px] bg-brand-green z-0" />
            <div className="relative z-10 bg-white px-4">
              <VisualEditable id="historia.fundadores.titulo" label="Título Fundadores">
                <h2 className="font-display text-4xl md:text-5xl font-black text-brand-navy tracking-tight select-none">
                  {titulo}
                </h2>
              </VisualEditable>
            </div>
          </div>
        </div>

        {/* 2-Column layout: Left: Image, Right: Text */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left Column: Image Container */}
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

              {/* Image control overlay for Admin */}
              {session && (
                <div className="absolute top-2 right-2 z-35 flex gap-1.5">
                  <VisualEditable id="historia.fundadores.imagen" label="Foto Principal Fundadores" type="image">
                    <button
                      type="button"
                      className="bg-brand-navy/90 hover:bg-brand-green text-white text-[8px] font-bold px-2 py-1 rounded shadow border border-brand-green/30 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Settings className="w-3 h-3" /> Principal
                    </button>
                  </VisualEditable>
                  <VisualEditable id="historia.fundadores2.imagen" label="Foto Secundaria Fundadores" type="image">
                    <button
                      type="button"
                      className="bg-brand-navy/90 hover:bg-brand-green text-white text-[8px] font-bold px-2 py-1 rounded shadow border border-brand-green/30 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Settings className="w-3 h-3" /> Hover
                    </button>
                  </VisualEditable>
                </div>
              )}

              {/* Elegant Bottom-Left overlay for Names */}
              <div className="absolute bottom-3 left-3 bg-brand-navy/85 backdrop-blur-sm text-brand-white text-[11px] md:text-xs font-bold font-body px-3 py-1.5 rounded-sm shadow-md border-l-2 border-brand-green tracking-wide">
                <VisualEditable id="historia.fundadores.caption" label="Leyenda de Fotos Fundadores">
                  <span>{captionText}</span>
                </VisualEditable>
              </div>
            </div>
          </div>

          {/* Right Column: Text & Subtitle */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-center text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
              HISTORIA GEC
            </span>
            <VisualEditable id="historia.fundadores.subtitulo" label="Subtítulo Fundadores">
              <h3 className="font-display text-2xl md:text-3xl font-extrabold text-brand-navy mb-4 leading-tight">
                {subtitulo}
              </h3>
            </VisualEditable>
            <div className="w-12 h-[3px] bg-brand-green mb-6" />
            <VisualEditable id="historia.fundadores.texto" label="Texto Fundadores">
              <p className="font-body text-brand-navy/80 text-sm md:text-base leading-relaxed max-w-xl">
                {texto}
              </p>
            </VisualEditable>
          </div>

        </div>

      </div>
    </section>
  );
}
