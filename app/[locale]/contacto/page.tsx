import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/shared/PageHero';
import { LeadPipeline } from '@/components/sections/home/LeadPipeline';
import { MapPin, Phone, Globe } from 'lucide-react';

export default async function Contacto() {
  const t = await getTranslations('contacto');
  const tFooter = await getTranslations('footer');

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero title={t('titulo_pagina')} subtitle={t('subtitulo_pagina')} />

      {/* Contact info strip */}
      <section className="w-full bg-brand-white py-12 px-4 sm:px-6 border-b border-brand-gray/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-4">
            {t('info_titulo')}
          </h2>
          <div className="w-[60px] h-[3px] bg-brand-green mb-8" />

          <p className="font-body text-brand-navy/80 text-lg mb-8 max-w-2xl">
            {t('bienvenida')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-green shrink-0 shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="font-body text-brand-navy/70 leading-relaxed text-sm max-w-xs">
                {tFooter('direccion')}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-green shrink-0 shadow-sm">
                <Phone className="w-5 h-5" />
              </div>
              <p className="font-body text-brand-navy/70 leading-relaxed text-sm">
                {tFooter('tel')}
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-green shrink-0 shadow-sm">
                <Globe className="w-5 h-5" />
              </div>
              <p className="font-body text-brand-navy/70 leading-relaxed text-sm">
                {tFooter('web')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width multi-step contact pipeline */}
      <LeadPipeline />
    </div>
  );
}
