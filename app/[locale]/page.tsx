import { HeroSection } from '@/components/sections/home/HeroSection';
import { MetricsSection } from '@/components/sections/home/MetricsSection';
import { BrandsSection } from '@/components/sections/home/BrandsSection';
import { FeaturesSection } from '@/components/sections/home/FeaturesSection';
import { NewsSection } from '@/components/sections/home/NewsSection';
import { ContactFormSection } from '@/components/sections/shared/ContactFormSection';
import { getContenidoCached, getNoticiasCached } from '@/lib/queries/cache';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  const [noticias, contenido, tPagina, tHome] = await Promise.all([
    getNoticiasCached(3),
    getContenidoCached(['home.hero.tagline', 'home.hero.sub'], locale),
    getTranslations('pagina'),
    getTranslations('home'),
  ]);

  const tagline = contenido['home.hero.tagline'];
  const subtitle = contenido['home.hero.sub'];

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection
        tagline={tagline ?? tHome('hero_tagline_fallback')}
        subtitle={subtitle ?? 'Grupo Exportador del Campo'}
      />
      <MetricsSection locale={locale} />
      <BrandsSection />
      <FeaturesSection locale={locale} />
      <Suspense fallback={<div className="h-96 bg-brand-white flex items-center justify-center animate-pulse">{tPagina('cargando')}</div>}>
        <NewsSection noticias={noticias} locale={locale} />
      </Suspense>
      <ContactFormSection />
    </div>
  );
}
