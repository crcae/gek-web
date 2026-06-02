'use client';

import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

type HitoConfig = {
  id: string;
  anioKey?: string;
  periodoKey?: string;
};

const HITOS: HitoConfig[] = [
  { id: 'hito1',  anioKey: 'hito1_anio',  periodoKey: 'hito1_periodo' },
  { id: 'hito2',  anioKey: 'hito2_anio' },
  { id: 'hito3',  anioKey: 'hito3_anio' },
  { id: 'hito4',  anioKey: 'hito4_anio' },
  { id: 'hito5',  anioKey: 'hito5_anio' },
  { id: 'hito6',  anioKey: 'hito6_anio' },
  { id: 'hito7',  anioKey: 'hito7_anio' },
  { id: 'hito8',  anioKey: 'hito8_anio' },
  { id: 'hito9',  anioKey: 'hito9_anio' },
  { id: 'hito10', anioKey: 'hito10_anio' },
  { id: 'hito11', anioKey: 'hito11_anio' },
  { id: 'hito12', periodoKey: 'hito12_periodo' },
  { id: 'hito13' },
  { id: 'hito14' },
  { id: 'hito15' },
  { id: 'hito16', anioKey: 'hito16_anio', periodoKey: 'hito16_periodo' },
  { id: 'hito17', anioKey: 'hito17_anio', periodoKey: 'hito17_periodo' },
];

function HitoCard({
  titulo,
  desc,
  periodo,
  anio,
  align,
}: {
  titulo: string;
  desc: string;
  periodo?: string | null;
  anio?: string | null;
  align?: 'left' | 'right';
}) {
  return (
    <div className={`card-hover bg-white p-5 md:p-6 rounded-lg shadow-sm border border-brand-gray/20 hover:border-brand-green transition-colors group ${
      align === 'right' ? 'text-left' : 'text-right'
    }`}>
      {periodo && (
        <span className="inline-block bg-brand-green/10 text-brand-green font-bold font-body text-xs px-2 py-0.5 rounded mb-2 uppercase tracking-wider">
          {periodo}
        </span>
      )}
      {anio && (
        <div className={`font-display font-bold text-2xl text-brand-green/70 mb-1 ${align === 'right' ? '' : 'text-right'}`}>
          {anio}
        </div>
      )}
      <h3 className="font-display text-lg md:text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-green transition-colors">
        {titulo}
      </h3>
      <p className="font-body text-brand-navy/70 text-sm md:text-base leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

export function Timeline() {
  const t = useTranslations('historia');

  return (
    <>
      {/* ── DESKTOP: alternating left/right ── */}
      <div className="relative hidden md:block max-w-4xl mx-auto py-8 md:py-12">
        {/* Central vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-brand-gray/40 -translate-x-1/2" />

        {HITOS.map((item, index) => {
          const esIzquierda = index % 2 === 0;
          const animation = esIzquierda ? 'slide-left' as const : 'slide-right' as const;
          const titulo = t(`${item.id}_titulo` as any);
          const desc = t(`${item.id}_desc` as any);
          const periodo = item.periodoKey ? t(item.periodoKey as any) : null;
          const anio = item.anioKey ? t(item.anioKey as any) : null;

          return (
            <div key={item.id} className="relative flex items-start mb-10">
              {/* Left half */}
              <div className="w-1/2 pr-10">
                {esIzquierda && (
                  <AnimatedSection animation={animation}>
                    <HitoCard titulo={titulo} desc={desc} periodo={periodo} anio={anio} align="left" />
                  </AnimatedSection>
                )}
              </div>

              {/* Dot on the central line */}
              <div className={`absolute left-1/2 -translate-x-1/2 top-5 z-10 w-4 h-4 rounded-full ring-4 ring-white shadow-md ${
                item.periodoKey ? 'bg-brand-navy' : 'bg-brand-green'
              }`} />

              {/* Right half */}
              <div className="w-1/2 pl-10">
                {!esIzquierda && (
                  <AnimatedSection animation={animation}>
                    <HitoCard titulo={titulo} desc={desc} periodo={periodo} anio={anio} align="right" />
                  </AnimatedSection>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MOBILE: always left-aligned, line on the left ── */}
      <div className="relative block md:hidden max-w-4xl mx-auto py-8 pl-8">
        {/* Left vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-brand-gray/40" />

        {HITOS.map((item) => {
          const titulo = t(`${item.id}_titulo` as any);
          const desc = t(`${item.id}_desc` as any);
          const periodo = item.periodoKey ? t(item.periodoKey as any) : null;
          const anio = item.anioKey ? t(item.anioKey as any) : null;

          return (
            <div key={item.id} className="relative mb-8">
              {/* Dot on the left line */}
              <div className={`absolute -left-5 top-5 z-10 w-4 h-4 rounded-full ring-4 ring-white shadow-md ${
                item.periodoKey ? 'bg-brand-navy' : 'bg-brand-green'
              }`} />

              <AnimatedSection animation="slide-right">
                <div className="card-hover bg-white p-5 rounded-lg shadow-sm border border-brand-gray/20 hover:border-brand-green transition-colors group text-left">
                  {periodo && (
                    <span className="inline-block bg-brand-green/10 text-brand-green font-bold font-body text-xs px-2 py-0.5 rounded mb-2 uppercase tracking-wider">
                      {periodo}
                    </span>
                  )}
                  {anio && (
                    <div className="font-display font-bold text-2xl text-brand-green/70 mb-1">{anio}</div>
                  )}
                  <h3 className="font-display text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-green transition-colors">
                    {titulo}
                  </h3>
                  <p className="font-body text-brand-navy/70 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            </div>
          );
        })}
      </div>
    </>
  );
}
