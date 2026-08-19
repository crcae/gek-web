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

      {/* ── Espacio para la imagen en alta del Tráiler (Editable) ── */}
      <section className="w-full bg-white pb-16 pt-4 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex justify-center">
          <VisualEditable id="contacto.trailer.imagen" label="Imagen Ilustrativa Tráiler (Contacto)" type="image" className="w-full">
            <div className="relative w-full aspect-[21/9] max-h-[450px] overflow-hidden flex items-center justify-center">
              {contenido['contacto.trailer.imagen'] ? (
                <Image
                  src={contenido['contacto.trailer.imagen']}
                  alt="Ilustración Tráiler GEC"
                  fill
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="text-center p-8 flex flex-col items-center gap-3">
                  <span className="text-5xl">🚛</span>
                  <p className="font-display text-lg font-semibold text-brand-navy">Espacio para Imagen: El Tráiler</p>
                  <p className="font-body text-xs text-brand-navy/60">Haz clic en el lápiz de edición flotante para subir la imagen en alta del tráiler</p>
                </div>
              )}
            </div>
          </VisualEditable>
        </div>
      </section>
    </div>
  );
}
