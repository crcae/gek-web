import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { getContenidoCached, getNoticiasCached } from '@/lib/queries/cache';
import { prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';

import { HeroSection } from '@/components/sections/home/HeroSection';
import { MetricsSection } from '@/components/sections/home/MetricsSection';
import { BrandsSection } from '@/components/sections/home/BrandsSection';
import { FeaturesSection } from '@/components/sections/home/FeaturesSection';
import { ClientesSection } from '@/components/sections/home/ClientesSection';
import { NewsSection } from '@/components/sections/home/NewsSection';
import { EventosSection } from '@/components/sections/home/EventosSection';
import { LeadPipeline } from '@/components/sections/home/LeadPipeline';

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  const [noticias, contenido, tPagina, tHome, logos, eventos] = await Promise.all([
    getNoticiasCached(3),
    getContenidoCached(['home.hero.eyebrow', 'home.hero.tagline', 'home.hero.sub', 'home.hero.video', 'home.noticias_titulo', 'home.clientes_eyebrow', 'home.clientes_titulo', 'home.eventos_eyebrow', 'home.eventos_titulo'], locale),
    getTranslations('pagina'),
    getTranslations('home'),
    prisma.clienteLogo.findMany({ orderBy: { orden: 'asc' } }),
    prisma.evento.findMany({ where: { activo: true }, orderBy: { createdAt: 'desc' } }),
  ]);

  const ifpaBadgeExists = fs.existsSync(path.join(process.cwd(), 'public/images/eventos/ifpa-proud-member.png'));

  const eyebrow = contenido['home.hero.eyebrow'];
  const tagline = contenido['home.hero.tagline'];
  const subtitle = contenido['home.hero.sub'];
  const videoUrl = contenido['home.hero.video'];
  const noticiasTitulo = contenido['home.noticias_titulo'];
  const clientesEyebrow = contenido['home.clientes_eyebrow'];
  const clientesTitulo = contenido['home.clientes_titulo'];
  const eventosEyebrow = contenido['home.eventos_eyebrow'];
  const eventosTitulo = contenido['home.eventos_titulo'];

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection
        eyebrow={eyebrow ?? tHome('hero_eyebrow')}
        tagline={tagline ?? tHome('hero_tagline_fallback')}
        subtitle={subtitle ?? 'Grupo Exportador del Campo'}
        videoUrl={videoUrl ?? '/videos/institucional/hero.mp4'}
      />

      <MetricsSection locale={locale} />

      <BrandsSection locale={locale} />

      {/* News (LinkedIn Feed) */}
      <Suspense
        fallback={
          <div className="h-96 bg-[#2C3E4B] flex items-center justify-center animate-pulse">
            <span className="text-white/40 text-sm">{tPagina('cargando')}</span>
          </div>
        }
      >
        <NewsSection
          noticias={noticias}
          locale={locale}
          titulo={noticiasTitulo}
        />
      </Suspense>

      {/* Events */}
      <Suspense fallback={<div className="h-96 bg-white flex items-center justify-center animate-pulse">Cargando eventos...</div>}>
        <EventosSection
          initialEventos={eventos}
          ifpaBadgeExists={ifpaBadgeExists}
          eyebrow={eventosEyebrow ?? 'AGENDA GEC'}
          titulo={eventosTitulo ?? tHome('eventos_titulo')}
        />
      </Suspense>

      {/* Client logos infinite carousel — dynamic from DB, static fallback */}
      <ClientesSection
        logos={logos}
        eyebrow={clientesEyebrow ?? tHome('clientes_eyebrow')}
        titulo={clientesTitulo ?? tHome('clientes_titulo')}
      />

      {/* FeaturesSection (Conoce más de nosotros) - Moved immediately before LeadPipeline */}
      <FeaturesSection locale={locale} />

      {/* Lead Pipeline — multi-step contact form */}
      <LeadPipeline />
    </div>
  );
}
