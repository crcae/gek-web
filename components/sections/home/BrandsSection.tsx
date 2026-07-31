import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';

import { getContenidoCached } from '@/lib/queries/cache';
import { VisualEditable } from '@/components/admin/VisualEditable';

export async function BrandsSection({ locale }: { locale: string }) {
  const [contenido, t] = await Promise.all([
    getContenidoCached(['home.marcas_titulo', 'home.marca1.logo', 'home.marca2.logo', 'home.marca3.logo'], locale),
    getTranslations('home'),
  ]);
  const marcasTitulo = contenido['home.marcas_titulo'];
  const brands = [
    { name: "Vizcaíno Fruit's", file: 'VizcainoFruits_Logo.png', slug: 'vizcaino-fruits', dbKey: 'home.marca1.logo' },
    { name: 'Vizcaíno Premium', file: 'VizcainoPremium_Logo_web.png', slug: 'vizcaino-premium', dbKey: 'home.marca2.logo' },
    { name: 'Vizcaíno Services', file: 'VizcainoServices_Logo_web.png', slug: 'vizcaino-services', dbKey: 'home.marca3.logo' },
  ];

  const brandsWithStatus = brands.map((brand) => {
    const dbUrl = contenido[brand.dbKey];
    const defaultUrl = `/images/logos/${brand.file}`;
    const url = dbUrl || defaultUrl;
    
    // Check local fallback existence only if not loaded from DB URL (since DB URL can be Vercel Blob)
    const exists = dbUrl ? true : fs.existsSync(path.join(process.cwd(), 'public', defaultUrl));

    return {
      ...brand,
      exists,
      url,
      link: `/${locale}/holding/${brand.slug}`,
    };
  });

  return (
    <section id="marcas" className="w-full bg-brand-white py-20 px-6 relative overflow-hidden">
      {/* Watermark Isotipo on White Background */}
      <div 
        className="absolute right-[-100px] top-[-100px] w-[350px] h-[350px] bg-no-repeat bg-contain pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'url(/images/isotipo/isotipo-oscuro.png)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <AnimatedSection animation="fade-up">
            <VisualEditable id="home.marcas_titulo" label="Título Sección Marcas">
              <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
                {marcasTitulo || t('marcas_titulo')}
              </h2>
            </VisualEditable>
          </AnimatedSection>
          <AnimatedLine className="h-[3px] bg-brand-green" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0 md:divide-x md:divide-brand-gray/50 mb-12">
          {brandsWithStatus.map((brand, idx) => (
            <AnimatedSection
              key={idx}
              animation="fade-up"
              delay={(idx + 1) as 1 | 2 | 3}
              className="flex flex-col items-center justify-center px-12 h-32 w-full md:w-1/3"
            >
              <VisualEditable id={brand.dbKey} label={brand.name} type="image" className="w-full h-full">
                <Link 
                  href={brand.link}
                  className="w-full h-full flex items-center justify-center transition-all duration-250 ease-out hover:scale-108 hover:-translate-y-1 hover:drop-shadow-[0_8px_20px_rgba(77,178,107,0.3)] cursor-pointer"
                >
                  {brand.exists ? (
                    <Image
                      src={brand.url}
                      alt={brand.name}
                      width={200}
                      height={80}
                      className="max-h-full max-w-full object-contain cursor-pointer"
                      quality={80}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center border border-brand-green/20 rounded-md bg-white p-4 cursor-pointer">
                      <span className="font-display font-bold text-brand-navy text-lg text-center truncate w-full">
                        {brand.name}
                      </span>
                      <span className="font-body text-xs text-brand-green mt-1">GEC</span>
                    </div>
                  )}
                </Link>
              </VisualEditable>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
