import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/shared/PageHero';
import { LeadPipeline } from '@/components/sections/home/LeadPipeline';
import { getContenidoCached } from '@/lib/queries/cache';

export default async function Contacto({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('contacto');

  const contenido = await getContenidoCached([
    'contacto.hero.titulo',
    'contacto.hero.sub',
    'contacto.hero.imagen'
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
    </div>
  );
}
