import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/db';
import { PageHero } from '@/components/sections/shared/PageHero';
import { BlogFeed } from '@/components/sections/blog/BlogFeed';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isEn = locale === 'en';
  const isDe = locale === 'de';

  return {
    title: isDe 
      ? 'Blog & Neuigkeiten | Grupo Exportador del Campo' 
      : isEn 
      ? 'Blog & News | Grupo Exportador del Campo' 
      : 'Blog & Noticias | Grupo Exportador del Campo',
    description: isDe
      ? 'Erfahren Sie die neuesten Nachrichten, landwirtschaftliche Innovationen und Nachhaltigkeitsprojekte von GEC.'
      : isEn
      ? 'Explore the latest news, agricultural innovations, and sustainability projects from GEC.'
      : 'Explora las últimas noticias, innovación agrícola, sostenibilidad y proyectos agroindustriales de Grupo Exportador del Campo.',
  };
}

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const posts = await prisma.blogPost.findMany({
    where: { publicado: true },
    orderBy: { fechaPublicacion: 'desc' },
  });

  const uniqueCategories = Array.from(new Set(posts.map((p) => p.categoria)));

  const heroTitulo = locale === 'de' ? 'Blog & Neuigkeiten' : locale === 'en' ? 'Blog & News' : 'Blog & Noticias';
  const heroSubtitulo = locale === 'de'
    ? 'Einblicke, Innovation und Perspektiven aus dem Herzen der mexikanischen Landwirtschaft'
    : locale === 'en'
    ? 'Insights, innovation, and perspectives from the heart of Mexican agriculture'
    : 'Perspectivas, innovación y actualidad desde el corazón del campo mexicano';

  return (
    <div className="flex flex-col min-h-screen bg-brand-white">
      {/* Hero */}
      <PageHero
        title={heroTitulo}
        subtitle={heroSubtitulo}
        heroImage="/images/features/quienes.jpg"
        compact={true}
        titleId="blog.hero.titulo"
        subtitleId="blog.hero.sub"
      />

      {/* Main Feed Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <BlogFeed
          posts={posts}
          locale={locale}
          categories={uniqueCategories}
        />
      </main>
    </div>
  );
}
