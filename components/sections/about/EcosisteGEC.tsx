'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Heart, TrendingUp, Star } from 'lucide-react';

interface Props {
  misionText: string;
  visionText: string;
}

export function EcosisteGEC({ misionText, visionText }: Props) {
  const t = useTranslations('quienes');
  const [activo, setActivo] = useState<number | null>(null);

  const valores = [
    t('honestidad'), t('compromiso'), t('humildad'),
    t('profesionalismo'), t('lealtad'), t('transparencia'),
  ];

  const paneles = [
    {
      titulo: t('pens_mision_titulo'),
      Icono: Heart,
      contenido: misionText,
      gradiente: 'from-brand-navy to-[#1A3D2B]',
    },
    {
      titulo: t('pens_vision_titulo'),
      Icono: TrendingUp,
      contenido: visionText,
      gradiente: 'from-brand-navy to-[#0D2233]',
    },
    {
      titulo: t('pens_valores_titulo'),
      Icono: Star,
      contenido: null,
      gradiente: 'from-brand-navy to-[#1E4A6A]',
    },
  ];

  return (
    <section className="w-full bg-[#F8FAF9] py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-green block mb-3">
            {t('pens_eyebrow')}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-3">
            {t('pens_titulo')}
          </h2>
          <p className="font-body text-brand-navy/60 text-base max-w-2xl mx-auto">
            {t('pens_sub')}
          </p>
          <div className="w-[60px] h-[3px] bg-brand-green mx-auto mt-4" />
        </div>

        {/* Desktop — paneles horizontales */}
        <div className="hidden md:flex h-96 rounded-2xl overflow-hidden shadow-xl">
          {paneles.map((panel, i) => {
            const isOpen = activo === i;
            return (
              <div
                key={i}
                className={`relative transition-all duration-500 cursor-pointer ${
                  isOpen ? 'flex-[3]' : 'flex-1'
                }`}
                onMouseEnter={() => setActivo(i)}
                onMouseLeave={() => setActivo(null)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${panel.gradiente}`} />

                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  <panel.Icono className="w-8 h-8 text-brand-green mb-3" />
                  <h3 className="font-display text-white text-xl font-bold">{panel.titulo}</h3>

                  <div className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="w-8 h-0.5 bg-brand-green mb-3" />
                    {panel.contenido ? (
                      <p className="text-white/80 text-sm font-body leading-relaxed">
                        {panel.contenido}
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {valores.map((v) => (
                          <div key={v} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" />
                            <span className="text-white/80 text-xs font-body">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Separador vertical entre paneles */}
                {i < paneles.length - 1 && (
                  <div className="absolute right-0 top-0 bottom-0 w-px bg-white/10 z-20" />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile — tabs verticales colapsables */}
        <div className="flex flex-col gap-3 md:hidden">
          {paneles.map((panel, i) => {
            const isOpen = activo === i;
            return (
              <div
                key={i}
                className="rounded-xl overflow-hidden shadow-sm border border-gray-200"
              >
                <button
                  className={`w-full flex items-center gap-4 p-5 text-left transition-colors duration-200 ${
                    isOpen ? 'bg-brand-navy text-white' : 'bg-white hover:bg-gray-50 text-brand-navy'
                  }`}
                  onClick={() => setActivo(isOpen ? null : i)}
                >
                  <panel.Icono className={`w-6 h-6 shrink-0 ${isOpen ? 'text-brand-green' : 'text-brand-navy/40'}`} />
                  <span className="font-display font-bold text-lg">{panel.titulo}</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'max-h-80' : 'max-h-0'
                }`}>
                  <div className="px-6 py-5 bg-brand-navy/5 border-t border-brand-navy/10">
                    {panel.contenido ? (
                      <p className="font-body text-brand-navy/80 text-sm leading-relaxed">
                        {panel.contenido}
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {valores.map((v) => (
                          <div key={v} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" />
                            <span className="text-brand-navy/80 text-xs font-body">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
