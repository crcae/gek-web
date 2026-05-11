import fs from 'fs';
import path from 'path';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';

export async function BrandsSection() {
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
    <section className="w-full bg-brand-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
              Nuestras empresas y marcas
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
              {brand.exists ? (
                <img
                  src={brand.url}
                  alt={brand.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-brand-navy/20 rounded-md bg-white">
                  <span className="font-display font-bold text-brand-navy text-xl text-center px-4">
                    {brand.name}
                  </span>
                  <span className="font-body text-xs text-brand-navy/40 mt-2">Próximamente</span>
                </div>
              )}
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
