'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
}

interface HoldingBrandPanelsProps {
  locale: string;
  marcasData: BrandPanelData[];
}

export function HoldingBrandPanels({ locale, marcasData }: HoldingBrandPanelsProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Desktop view: side-by-side accordion layout */}
      <div className="hidden lg:flex w-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50">
        {marcasData.map((brand, idx) => {
          const isHovered = hoveredIdx === idx;
          const isAnyHovered = hoveredIdx !== null;
          
          // Width determination: if hovered -> 50%, if any other is hovered -> 25%, default -> 33.33%
          let widthClass = 'w-1/3';
          if (isAnyHovered) {
            widthClass = isHovered ? 'w-[50%]' : 'w-[25%]';
          }

          return (
            <div
              key={brand.id}
              className={`relative h-[550px] transition-all duration-500 ease-in-out flex flex-col justify-between p-8 md:p-12 text-white overflow-hidden border-r border-white/10 last:border-r-0 ${brand.bgClass} ${widthClass}`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Background watermark icon / overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30 z-0" />
              
              {/* Overlay highlight */}
              <div className={`absolute inset-0 bg-brand-green/20 z-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

              <div className="relative z-10 flex flex-col h-full justify-between">
                {/* Brand Logo / Header Area */}
                <div className="flex flex-col items-start">
                  <div className="h-16 flex items-center justify-start mb-4">
                    {brand.logo ? (
                      <div className="relative w-48 h-12">
                        <Image
                          src={brand.logo}
                          alt={brand.nombre}
                          fill
                          className="object-contain object-left filter brightness-0 invert"
                        />
                      </div>
                    ) : (
                      <span className="font-display text-2xl font-bold tracking-wider uppercase">
                        {brand.nombre}
                      </span>
                    )}
                  </div>
                  <div className="w-12 h-[3px] bg-brand-green mt-2" />
                </div>

                {/* Body Content Area (shows/expands smoothly) */}
                <div className="my-auto transition-all duration-500">
                  <h4 className="font-display text-xl md:text-2xl font-extrabold mb-3 leading-tight text-white drop-shadow">
                    {brand.subtitulo}
                  </h4>
                  
                  {/* Text description with max-height transition based on hover state */}
                  <div className={`transition-all duration-500 overflow-hidden ${
                    isHovered ? 'max-h-[200px] opacity-100 mt-2' : 'max-h-0 opacity-0 lg:max-h-[60px] lg:opacity-70'
                  }`}>
                    <p className="font-body text-sm md:text-base leading-relaxed text-gray-200">
                      {brand.texto}
                    </p>
                  </div>
                  
                  {/* CTA link visible always, with special styling on hover */}
                  <div className="mt-6">
                    <Link
                      href={brand.link}
                      className={`inline-flex items-center gap-2 font-display text-xs md:text-sm font-bold uppercase tracking-wider py-2.5 px-5 rounded-sm transition-all duration-300 ${
                        isHovered 
                          ? 'bg-brand-green text-brand-navy shadow-lg scale-105' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {brand.ctaText}
                      <span className="font-sans">→</span>
                    </Link>
                  </div>
                </div>

                {/* Footer label (Cultivamos, Transformamos, Movemos) */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4">
                  <span className="text-[10px] uppercase tracking-widest text-white/50">
                    GEC División
                  </span>
                  <span className="font-display text-lg font-black text-brand-green tracking-wide">
                    {brand.pie}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet view: simple clean stacked cards */}
      <div className="lg:hidden flex flex-col gap-6 w-full">
        {marcasData.map((brand) => (
          <div
            key={brand.id}
            className={`relative min-h-[300px] rounded-2xl overflow-hidden p-6 md:p-8 flex flex-col justify-between text-white ${brand.bgClass}`}
          >
            {/* Background watermark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/45 z-0" />

            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              
              {/* Top Row: Logo */}
              <div className="flex items-center justify-between">
                <div className="h-12 flex items-center">
                  {brand.logo ? (
                    <div className="relative w-40 h-10">
                      <Image
                        src={brand.logo}
                        alt={brand.nombre}
                        fill
                        className="object-contain object-left filter brightness-0 invert"
                      />
                    </div>
                  ) : (
                    <span className="font-display text-xl font-bold tracking-wider uppercase">
                      {brand.nombre}
                    </span>
                  )}
                </div>
                <span className="font-display text-sm font-bold text-brand-green uppercase tracking-widest bg-brand-green/10 px-3 py-1 rounded-full">
                  {brand.pie}
                </span>
              </div>

              {/* Middle Row: Content */}
              <div>
                <h4 className="font-display text-lg md:text-xl font-extrabold mb-2 leading-tight">
                  {brand.subtitulo}
                </h4>
                <p className="font-body text-xs md:text-sm text-gray-200 leading-relaxed">
                  {brand.texto}
                </p>
              </div>

              {/* Bottom Row: CTA Link */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                <Link
                  href={brand.link}
                  className="inline-flex items-center gap-2 bg-brand-green text-brand-navy font-display text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-sm hover:bg-white transition-colors"
                >
                  {brand.ctaText}
                  <span>→</span>
                </Link>
                <span className="text-[9px] uppercase tracking-widest text-white/40">
                  Grupo Exportador del Campo
                </span>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
