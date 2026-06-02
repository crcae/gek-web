import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { getContenidoCached, getNoticiasCached } from '@/lib/queries/cache';
import { prisma } from '@/lib/db';

import { HeroSection } from '@/components/sections/home/HeroSection';
import { MetricsSection } from '@/components/sections/home/MetricsSection';
import { BrandsSection } from '@/components/sections/home/BrandsSection';
import { FeaturesSection } from '@/components/sections/home/FeaturesSection';
import { ClientesSection } from '@/components/sections/home/ClientesSection';
import { NewsSection } from '@/components/sections/home/NewsSection';
import { LeadPipeline } from '@/components/sections/home/LeadPipeline';

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  const [noticias, contenido, tPagina, tHome, logos] = await Promise.all([
    getNoticiasCached(3),
    getContenidoCached(['home.hero.tagline', 'home.hero.sub'], locale),
    getTranslations('pagina'),
    getTranslations('home'),
    prisma.clienteLogo.findMany({ orderBy: { orden: 'asc' } }),
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

      {/* Client logos infinite carousel — dynamic from DB, static fallback */}
      <ClientesSection logos={logos} />

      {/* News + EventosSection (EventosSection is embedded inside NewsSection) */}
      <Suspense
        fallback={
          <div className="h-96 bg-[#2C3E4B] flex items-center justify-center animate-pulse">
            <span className="text-white/40 text-sm">{tPagina('cargando')}</span>
          </div>
        }
      >
        <NewsSection noticias={noticias} locale={locale} />
      </Suspense>

      {/* Lead Pipeline — multi-step contact form */}
      <LeadPipeline />
    </div>
  );
}
