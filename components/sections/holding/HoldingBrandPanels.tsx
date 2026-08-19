'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Settings } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { VisualEditable } from '@/components/admin/VisualEditable';

interface BrandPanelData {
  id: string;
  nombre: string;
  subtitulo: string;
  texto: string;
  ctaText: string;
  link: string;
  pie: string;
  logo: string;
  bgClass: string;
  colorClass: string;
  bgImage?: string;
  folleto?: string;
}

interface HoldingBrandPanelsProps {
  locale: string;
  marcasData: BrandPanelData[];
}

export function HoldingBrandPanels({ locale, marcasData }: HoldingBrandPanelsProps) {
  const { data: session } = useSession();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Desktop view: side-by-side accordion layout */}
      <div className="hidden lg:flex w-full min-h-[680px] rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50">
        {marcasData.map((brand, idx) => {
          const isHovered = hoveredIdx === idx;
          const isAnyHovered = hoveredIdx !== null;
          const brandNum = idx + 1;
          
          // Width determination: active panel is 60%, shrunken is 20%, default is 33.33%
          let widthClass = 'w-1/3';
          if (isAnyHovered) {
            widthClass = isHovered ? 'w-[60%]' : 'w-[20%]';
          }

          return (
            <div
              key={brand.id}
              className={`relative h-[680px] transition-all duration-500 ease-in-out flex flex-col justify-between p-8 md:p-10 text-white overflow-hidden border-r border-white/10 last:border-r-0 ${brand.bgClass} ${widthClass}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Background Image with opacity overlay */}
              {brand.bgImage && (
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                  <Image
                    src={brand.bgImage}
                    alt={brand.nombre}
                    fill
                    className={`object-cover transition-opacity duration-700 ${isHovered ? 'opacity-65' : 'opacity-20'}`}
                    quality={85}
                  />
                </div>
              )}

              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-black/15 z-0" />
              
              {/* Green color bar transition overlay */}
              <div className={`absolute inset-0 bg-brand-navy/30 z-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
              
              {/* Settings button overlay for background image */}
              {session && isHovered && (
                <div className="absolute top-4 right-4 z-35 flex gap-1.5">
                  <VisualEditable id={`holding.marca${brandNum}.imagen`} label={`Fondo Tarjeta - Marca ${brandNum}`} type="image">
                    <button
                      type="button"
                      className="bg-brand-navy/90 hover:bg-brand-green text-white text-[9px] font-bold px-2 py-1 rounded shadow border border-brand-green/30 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" /> Fondo
                    </button>
                  </VisualEditable>
                  <VisualEditable id={`holding.marca${brandNum}.logo`} label={`Logotipo - Marca ${brandNum}`} type="image">
                    <button
                      type="button"
                      className="bg-brand-navy/90 hover:bg-brand-green text-white text-[9px] font-bold px-2 py-1 rounded shadow border border-brand-green/30 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" /> Logo
                    </button>
                  </VisualEditable>
                  <VisualEditable id={`holding.marca${brandNum}.folleto`} label={`Folleto PDF - Marca ${brandNum}`} type="pdf">
                    <button
                      type="button"
                      className="bg-brand-navy/90 hover:bg-brand-green text-white text-[9px] font-bold px-2 py-1 rounded shadow border border-brand-green/30 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" /> Folleto (PDF)
                    </button>
                  </VisualEditable>
                </div>
              )}

              <div className="relative z-10 flex flex-col h-full justify-between items-center lg:items-stretch">
                {/* Brand Logo / Header Area */}
                <div className="flex flex-col items-center lg:items-start w-full">
                  <div className="h-24 flex items-center justify-center lg:justify-start mb-4 w-full">
                    {brand.logo ? (
                      <div className="relative w-80 h-28 transition-all duration-300">
                        <Image
                          src={brand.logo}
                          alt={brand.nombre}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <VisualEditable id={`holding.marca${brandNum}.nombre`} label={`Nombre - Marca ${brandNum}`}>
                        <span className="font-display text-2xl font-bold tracking-wider uppercase">
                          {brand.nombre}
                        </span>
                      </VisualEditable>
                    )}
                  </div>
                  <div className={`w-12 h-[3px] bg-brand-green mt-2 transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0 h-0'}`} />
                </div>

                {/* Body Content Area (shows/expands smoothly) */}
                <div className={`my-auto transition-all duration-500 w-full ${isHovered ? 'opacity-100 max-h-[400px]' : 'opacity-0 max-h-0 pointer-events-none overflow-hidden'}`}>
                  <VisualEditable id={`holding.marca${brandNum}.subtitulo`} label={`Subtítulo - Marca ${brandNum}`}>
                    <h4 className="font-display text-xl md:text-2xl font-extrabold mb-3 leading-tight text-white drop-shadow">
                      {brand.subtitulo}
                    </h4>
                  </VisualEditable>
                  
                  <VisualEditable id={`holding.marca${brandNum}.texto`} label={`Descripción - Marca ${brandNum}`}>
                    <p className="font-body text-xs md:text-sm leading-relaxed text-gray-100">
                      {brand.texto}
                    </p>
                  </VisualEditable>
                  
                  {/* CTA link */}
                  <div className="mt-6">
                    <a
                      href={brand.folleto}
                      download={`Folleto_${brand.nombre.replace(/\s+/g, '_')}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider py-2.5 px-5 rounded-sm transition-all duration-300 bg-brand-green text-brand-navy shadow-lg hover:bg-white cursor-pointer"
                    >
                      {brand.ctaText}
                      <span className="font-sans">↓</span>
                    </a>
                  </div>
                </div>

                {/* Footer label */}
                <div className={`flex items-center justify-between border-t border-white/10 pt-4 mt-4 w-full transition-all duration-500 ${isHovered ? 'opacity-100 max-h-16' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                  <span className="text-[10px] uppercase tracking-widest text-white/50">
                    GEC División
                  </span>
                  <VisualEditable id={`holding.marca${brandNum}.pie`} label={`Pie/Acción - Marca ${brandNum}`}>
                    <span className="font-display text-lg font-black text-brand-green tracking-wide">
                      {brand.pie}
                    </span>
                  </VisualEditable>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet view: simple clean stacked cards */}
      <div className="lg:hidden flex flex-col gap-6 w-full">
        {marcasData.map((brand, idx) => {
          const brandNum = idx + 1;
          return (
            <div
              key={brand.id}
              className={`relative min-h-[320px] rounded-2xl overflow-hidden p-6 md:p-8 flex flex-col justify-between text-white ${brand.bgClass}`}
            >
              {/* Background Image */}
              {brand.bgImage && (
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                  <Image
                    src={brand.bgImage}
                    alt={brand.nombre}
                    fill
                    className="object-cover opacity-30"
                    quality={75}
                  />
                </div>
              )}

              {/* Background watermark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-black/15 z-0" />

              {/* Settings button overlay for background image */}
              {session && (
                <div className="absolute top-4 right-4 z-35 flex gap-1.5">
                  <VisualEditable id={`holding.marca${brandNum}.imagen`} label={`Fondo Tarjeta - Marca ${brandNum}`} type="image">
                    <button
                      type="button"
                      className="bg-brand-navy/90 hover:bg-brand-green text-white text-[9px] font-bold px-2 py-1 rounded shadow border border-brand-green/30 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Settings className="w-3 h-3" /> Fondo
                    </button>
                  </VisualEditable>
                  <VisualEditable id={`holding.marca${brandNum}.logo`} label={`Logotipo - Marca ${brandNum}`} type="image">
                    <button
                      type="button"
                      className="bg-brand-navy/90 hover:bg-brand-green text-white text-[9px] font-bold px-2 py-1 rounded shadow border border-brand-green/30 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Settings className="w-3 h-3" /> Logo
                    </button>
                  </VisualEditable>
                  <VisualEditable id={`holding.marca${brandNum}.folleto`} label={`Folleto PDF - Marca ${brandNum}`} type="pdf">
                    <button
                      type="button"
                      className="bg-brand-navy/90 hover:bg-brand-green text-white text-[9px] font-bold px-2 py-1 rounded shadow border border-brand-green/30 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Settings className="w-3 h-3" /> Folleto
                    </button>
                  </VisualEditable>
                </div>
              )}

              <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                
                {/* Top Row: Logo */}
                <div className="flex items-center justify-between">
                  <div className="h-16 flex items-center">
                    {brand.logo ? (
                      <div className="relative w-56 h-20">
                        <Image
                          src={brand.logo}
                          alt={brand.nombre}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <VisualEditable id={`holding.marca${brandNum}.nombre`} label={`Nombre - Marca ${brandNum}`}>
                        <span className="font-display text-xl font-bold tracking-wider uppercase">
                          {brand.nombre}
                        </span>
                      </VisualEditable>
                    )}
                  </div>
                  <VisualEditable id={`holding.marca${brandNum}.pie`} label={`Pie/Acción - Marca ${brandNum}`}>
                    <span className="font-display text-xs font-bold text-brand-green uppercase tracking-widest bg-brand-green/10 px-3 py-1 rounded-full">
                      {brand.pie}
                    </span>
                  </VisualEditable>
                </div>

                {/* Middle Row: Content */}
                <div>
                  <VisualEditable id={`holding.marca${brandNum}.subtitulo`} label={`Subtítulo - Marca ${brandNum}`}>
                    <h4 className="font-display text-lg md:text-xl font-extrabold mb-2 leading-tight">
                      {brand.subtitulo}
                    </h4>
                  </VisualEditable>
                  <VisualEditable id={`holding.marca${brandNum}.texto`} label={`Descripción - Marca ${brandNum}`}>
                    <p className="font-body text-xs md:text-sm text-gray-200 leading-relaxed">
                      {brand.texto}
                    </p>
                  </VisualEditable>
                </div>

                {/* Bottom Row: CTA Link */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                  <a
                    href={brand.folleto}
                    download={`Folleto_${brand.nombre.replace(/\s+/g, '_')}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-green text-brand-navy font-display text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-sm hover:bg-white transition-colors cursor-pointer"
                  >
                    {brand.ctaText}
                    <span>↓</span>
                  </a>
                  <span className="text-[9px] uppercase tracking-widest text-white/40">
                    Grupo Exportador del Campo
                  </span>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
