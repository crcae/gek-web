import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/shared/PageHero';
import { LeadPipeline } from '@/components/sections/home/LeadPipeline';
import { getContenidoCached } from '@/lib/queries/cache';
import Image from 'next/image';
import { VisualEditable } from '@/components/admin/VisualEditable';

export default async function Contacto({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('contacto');

  const contenido = await getContenidoCached([
    'contacto.hero.titulo',
    'contacto.hero.sub',
    'contacto.hero.imagen',
    'contacto.trailer.imagen'
  ], locale);

  const heroTitulo = contenido['contacto.hero.titulo'] || t('titulo_pagina');
  const heroSubtitulo = contenido['contacto.hero.sub'] || t('subtitulo_pagina');
  const dbHeroImage = contenido['contacto.hero.imagen'];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero
        title={heroTitulo}
        subtitle={heroSubtitulo}
        heroImage={dbHeroImage || '/images/features/contacto.jpg'}
        titleId="contacto.hero.titulo"
        subtitleId="contacto.hero.sub"
        heroImageId="contacto.hero.imagen"
      />
      {/* Full-width multi-step contact pipeline */}
      <LeadPipeline showContactInfo={true} />

      {/* ── Pie de página: Tráiler GEC (Editable) ── */}
      <section className="w-full bg-brand-white pb-12 pt-0 px-4 sm:px-6 relative overflow-hidden flex flex-col items-center justify-center">
        <VisualEditable id="contacto.trailer.imagen" label="Imagen Ilustrativa Tráiler (Pie de Página)" type="image">
          <div className="relative w-72 md:w-96 h-20 md:h-24 flex items-center justify-center cursor-pointer">
            {contenido['contacto.trailer.imagen'] ? (
              <Image
                src={contenido['contacto.trailer.imagen']}
                alt="Ilustración Tráiler GEC"
                fill
                className="object-contain"
                unoptimized
              />
            ) : (
              <div className="text-center p-3 flex items-center gap-2 text-brand-navy/60 text-xs border border-dashed border-gray-300 rounded-lg">
                <span className="text-2xl">🚛</span>
                <span>Subir imagen del Tráiler GEC</span>
              </div>
            )}
          </div>
        </VisualEditable>
      </section>
    </div>
  );
}
