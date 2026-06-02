import React from 'react';
import fs from 'fs';
import path from 'path';
import { Calendar, MapPin, Building, ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { IFPABadge } from './IFPABadge';

export async function EventosSection() {
  const [eventos, imageExists, t] = await Promise.all([
    prisma.evento.findMany({ where: { activo: true }, orderBy: { createdAt: 'desc' } }),
    Promise.resolve(
      fs.existsSync(path.join(process.cwd(), 'public/images/eventos/ifpa-proud-member.png'))
    ),
    getTranslations('home'),
  ]);

  return (
    <div className="mt-20 border-t border-white/10 pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Events List (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
              AGENDA GEC
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white mt-1">
              {t('eventos_titulo')}
            </h3>
          </div>

          {eventos.length === 0 ? (
            <p className="text-white/60 text-sm font-body">{t('eventos_vacio')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eventos.map((evt) => (
                <div 
                  key={evt.id} 
                  className="bg-white/5 border border-white/10 rounded-lg p-6 flex flex-col justify-between hover:border-brand-green/30 transition-all duration-300 shadow-lg"
                >
                  <div>
                    {/* Event metadata badge */}
                    <div className="flex items-center justify-between text-white/50 text-xs font-bold uppercase tracking-wider mb-4">
                      <span>● {t('eventos_badge')}</span>
                      <span className="text-brand-green">{evt.fecha}</span>
                    </div>

                    <h4 className="font-display text-lg font-bold text-white mb-4 flex items-start gap-2">
                      {evt.titulo}
                    </h4>

                    <div className="space-y-2 mb-6 text-white/70 text-sm font-body">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-green shrink-0" />
                        <span>{evt.fecha}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-green shrink-0" />
                        <span>{evt.lugar}</span>
                      </div>
                      {evt.industria && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-brand-green shrink-0" />
                          <span>{evt.industria}</span>
                        </div>
                      )}
                    </div>

                    {evt.descripcion && (
                      <p className="text-white/60 text-xs font-body leading-relaxed mb-6">
                        {evt.descripcion}
                      </p>
                    )}
                  </div>

                  {evt.url && (
                    <a
                      href={evt.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-bold font-body py-2.5 px-4 rounded text-xs transition-all w-full shadow shadow-brand-green/10"
                    >
                      <span>{t('eventos_ir')}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: IFPA Proud Member Badge (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-8 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden">
          {/* Watermark decors inside the IFPA card */}
          <div 
            className="absolute left-[-50px] bottom-[-50px] w-[180px] h-[180px] bg-no-repeat bg-contain pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: 'url(/images/isotipo/isotipo-claro.png)' }}
          />

          <IFPABadge imageExists={imageExists} />

          <p className="font-lora italic text-sm text-white/80 max-w-[200px] leading-relaxed">
            {t('eventos_ifpa')}
          </p>
        </div>

      </div>
    </div>
  );
}
