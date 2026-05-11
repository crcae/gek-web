'use client';

import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export function Timeline() {
  const t = useTranslations('historia');

  const hitos = [
    { id: 'hito1', periodoKey: 'hito1_periodo' },
    { id: 'hito2' },
    { id: 'hito3' },
    { id: 'hito4' },
    { id: 'hito5' },
    { id: 'hito6' },
    { id: 'hito7' },
    { id: 'hito8' },
    { id: 'hito9', periodoKey: 'hito9_periodo' },
  ];

  return (
    <>
      {/* ── DESKTOP (md+): alternating left / right ── */}
      <div className="relative hidden md:block max-w-4xl mx-auto py-8 md:py-12">
        {/* Vertical line — centered */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-brand-gray/50 -translate-x-1/2" />

        {hitos.map((item, index) => {
          const esIzquierda = index % 2 === 0;
          const animation = esIzquierda ? 'slide-left' as const : 'slide-right' as const;
          const periodo = item.periodoKey ? t(item.periodoKey as any) : null;

          return (
            <div key={index} className="relative flex items-start mb-12">

              {/* Left half */}
              <div className="w-1/2 pr-12">
                {esIzquierda && (
                  <AnimatedSection animation={animation}>
                    <div className="card-hover bg-white p-5 md:p-6 rounded-sm shadow-sm border border-brand-gray/20 hover:border-brand-green transition-colors group text-right">
                      {periodo && (
                        <span className="text-brand-green font-bold font-body text-sm mb-2 block">
                          {periodo}
                        </span>
                      )}
                      <h3 className="font-display text-lg md:text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-green transition-colors">
                        {t(`${item.id}_titulo` as any)}
                      </h3>
                      <p className="font-body text-brand-navy/70 text-sm md:text-base">
                        {t(`${item.id}_desc` as any)}
                      </p>
                    </div>
                  </AnimatedSection>
                )}
              </div>

              {/* Dot — always on the central line, never inside a card */}
              <div className="absolute left-1/2 -translate-x-1/2 top-6 z-10
                              w-4 h-4 rounded-full bg-brand-green
                              ring-4 ring-white shadow-md" />

              {/* Right half */}
              <div className="w-1/2 pl-12">
                {!esIzquierda && (
                  <AnimatedSection animation={animation}>
                    <div className="card-hover bg-white p-5 md:p-6 rounded-sm shadow-sm border border-brand-gray/20 hover:border-brand-green transition-colors group">
                      {periodo && (
                        <span className="text-brand-green font-bold font-body text-sm mb-2 block">
                          {periodo}
                        </span>
                      )}
                      <h3 className="font-display text-lg md:text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-green transition-colors">
                        {t(`${item.id}_titulo` as any)}
                      </h3>
                      <p className="font-body text-brand-navy/70 text-sm md:text-base">
                        {t(`${item.id}_desc` as any)}
                      </p>
                    </div>
                  </AnimatedSection>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* ── MOBILE (<md): always right, line on the left ── */}
      <div className="relative block md:hidden max-w-4xl mx-auto py-8 pl-8">
        {/* Vertical line — left */}
        <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-brand-gray/50" />

        {hitos.map((item, index) => {
          const periodo = item.periodoKey ? t(item.periodoKey as any) : null;
          return (
            <div key={index} className="relative mb-10">
              {/* Dot — on the left line */}
              <div className="absolute -left-5 top-5 z-10
                              w-4 h-4 rounded-full bg-brand-green
                              ring-4 ring-white shadow-md" />

              <AnimatedSection animation="slide-right">
                <div className="card-hover bg-white p-5 rounded-sm shadow-sm border border-brand-gray/20 hover:border-brand-green transition-colors group">
                  {periodo && (
                    <span className="text-brand-green font-bold font-body text-sm mb-2 block">
                      {periodo}
                    </span>
                  )}
                  <h3 className="font-display text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-green transition-colors">
                    {t(`${item.id}_titulo` as any)}
                  </h3>
                  <p className="font-body text-brand-navy/70 text-sm">
                    {t(`${item.id}_desc` as any)}
                  </p>
                </div>
              </AnimatedSection>
            </div>
          );
        })}
      </div>
    </>
  );
}
