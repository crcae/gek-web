import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/shared/PageHero';
import { ContactFormSection } from '@/components/sections/shared/ContactFormSection';
import { MapPin, Phone, Globe } from 'lucide-react';

export default async function Contacto() {
  const t = await getTranslations('contacto');
  const tFooter = await getTranslations('footer');

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero title={t('titulo_pagina')} subtitle={t('subtitulo_pagina')} />

      <section className="w-full bg-brand-white py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Info — primero en mobile */}
          <div className="flex flex-col">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-4">
              {t('info_titulo')}
            </h2>
            <div className="w-[60px] h-[3px] bg-brand-green mb-8" />

            <p className="font-body text-brand-navy/80 text-lg mb-10 md:mb-12">
              {t('bienvenida')}
            </p>

            <div className="space-y-6 md:space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-green shrink-0 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-brand-navy mb-1">...</h4>
                  <p className="font-body text-brand-navy/70 leading-relaxed max-w-xs">
                    {tFooter('direccion')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-green shrink-0 shadow-sm">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-brand-navy mb-1">...</h4>
                  <p className="font-body text-brand-navy/70 leading-relaxed">
                    {tFooter('tel')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-green shrink-0 shadow-sm">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-brand-navy mb-1">...</h4>
                  <p className="font-body text-brand-navy/70 leading-relaxed">
                    {tFooter('web')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario — debajo en mobile */}
          <div className="w-full">
            <ContactFormSection />
          </div>

        </div>
      </section>
    </div>
  );
}
