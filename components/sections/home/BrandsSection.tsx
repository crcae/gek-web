import fs from 'fs';
import path from 'path';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';

export async function BrandsSection() {
  const t = await getTranslations('home');
  const brands = [
    { name: "Vizcaíno Fruit's", file: 'VizcainoFruits_Logo.png' },
    { name: 'Vizcaíno Premium', file: 'VizcainoPremium_Logo_web.png' },
    { name: 'Vizcaíno Services', file: 'VizcainoServices_Logo_web.png' },
  ];

  const brandsWithStatus = brands.map((brand) => {
    const filePath = path.join(process.cwd(), 'public/images/logos', brand.file);
    return {
      ...brand,
      exists: fs.existsSync(filePath),
      url: `/images/logos/${brand.file}`,
    };
  });

  return (
    <section className="w-full bg-brand-white py-20 px-6 relative overflow-hidden">
      {/* Watermark Isotipo on White Background */}
      <div 
        className="absolute right-[-100px] top-[-100px] w-[350px] h-[350px] bg-no-repeat bg-contain pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'url(/images/isotipo/isotipo-oscuro.png)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
              {t('marcas_titulo')}
            </h2>
          </AnimatedSection>
          <AnimatedLine className="h-[3px] bg-brand-green" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-0 md:divide-x md:divide-brand-gray/50">
          {brandsWithStatus.map((brand, idx) => (
            <AnimatedSection
              key={idx}
              animation="fade-up"
              delay={(idx + 1) as 1 | 2 | 3}
              className="flex flex-col items-center justify-center px-12 h-32 w-full md:w-1/3"
            >
              <div className="w-full h-full flex items-center justify-center transition-all duration-250 ease-out hover:scale-108 hover:-translate-y-1 hover:drop-shadow-[0_8px_20px_rgba(77,178,107,0.3)] cursor-default">
                {brand.exists ? (
                  <Image
                    src={brand.url}
                    alt={brand.name}
                    width={200}
                    height={80}
                    className="max-h-full max-w-full object-contain cursor-default"
                    quality={80}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center border border-brand-green/20 rounded-md bg-white p-4 cursor-default">
                    <span className="font-display font-bold text-brand-navy text-lg text-center truncate w-full">
                      {brand.name}
                    </span>
                    <span className="font-body text-xs text-brand-green mt-1">GEC</span>
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
