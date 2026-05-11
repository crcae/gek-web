import { HeroSection } from '@/components/sections/home/HeroSection';
import { MetricsSection } from '@/components/sections/home/MetricsSection';
import { BrandsSection } from '@/components/sections/home/BrandsSection';
import { FeaturesSection } from '@/components/sections/home/FeaturesSection';
import { NewsSection } from '@/components/sections/home/NewsSection';
import { ContactFormSection } from '@/components/sections/shared/ContactFormSection';
import { getNoticiasRecientes } from '@/lib/queries/noticias';
import { getContenido } from '@/lib/contenido';

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  const [noticias, tagline, subtitle] = await Promise.all([
    getNoticiasRecientes(3),
    getContenido('home.hero.tagline', locale),
    getContenido('home.hero.sub', locale),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection
        tagline={tagline ?? 'Más de 50 años llevando lo mejor del campo al mundo'}
        subtitle={subtitle ?? 'Grupo Exportador del Campo'}
      />
      <MetricsSection locale={locale} />
      <BrandsSection />
      <FeaturesSection locale={locale} />
      <NewsSection noticias={noticias} locale={locale} />
      <ContactFormSection />
    </div>
  );
}
