'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const CLIENTES_FALLBACK = [
  'S*Mart', 'Soriana', 'Merco', 'Río Produce', 'Mega Produce',
  'Amore Produce', 'Anavale', 'Art Mr.', 'Comercial Mexicana', 'HBE',
  'Mi Tienda del Ahorro', 'Peakopia Produce', 'Jovi Fresh',
  'Dallas Fresh Produce', 'Jose Luna Produce', 'Ergo Produce',
  'Carnicerías San Juan', 'Carnicerías Ramos',
];

interface LogoItem {
  id: string;
  nombre: string;
  url?: string;
}

interface ClientesSectionProps {
  logos?: LogoItem[];
}

export function ClientesSection({ logos }: ClientesSectionProps) {
  const t = useTranslations('home');
  // Use DB logos if provided, otherwise fall back to static list as placeholders
  const items: LogoItem[] = logos && logos.length > 0
    ? logos
    : CLIENTES_FALLBACK.map((name, i) => ({ id: `fallback-${i}`, nombre: name }));

  // Duplicate for seamless infinite loop
  const doubled = [...items, ...items];

  return (
    <section className="w-full bg-white py-16 relative overflow-hidden border-t-[3px] border-brand-green">

      {/* Decorative Truck Watermark */}
      <div
        className="absolute right-4 bottom-4 w-[160px] h-[100px] bg-no-repeat bg-contain bg-right pointer-events-none opacity-[0.08]"
        style={{ backgroundImage: 'url(/images/camiones/truck2.png)' }}
      />

      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-green block mb-2">
          {t('clientes_eyebrow')}
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy">
          {t('clientes_titulo')}
        </h2>
      </div>

      {/* Infinite Carousel Container */}
      <div className="w-full overflow-hidden py-4 bg-gray-50/50">
        <div className="logos-track">
          {doubled.map((client, idx) => (
            <div
              key={`${client.id}-${idx}`}
              className="shrink-0 w-[160px] h-[72px] rounded-lg flex items-center justify-center select-none border border-slate-200 shadow-sm bg-[#E2E8F0] hover:bg-[#CBD5E1] transition-colors"
            >
              {client.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={client.url}
                  alt={client.nombre}
                  className="max-w-[120px] max-h-[52px] object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full px-3">
                  <span className="font-bold text-brand-navy text-[11px] leading-tight line-clamp-2 text-center">
                    {client.nombre}
                  </span>
                  <span className="text-[9px] text-brand-green font-bold mt-0.5 tracking-wider uppercase">
                    GEC
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
