import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Users, BookOpen, Building2, Phone } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';

export function FeaturesSection({ locale }: { locale: string }) {
  const t = useTranslations('Features');

  const features = [
    { id: 'quienesSomos', href: `/${locale}/quienes-somos`, icon: Users },
    { id: 'historia', href: `/${locale}/historia`, icon: BookOpen },
    { id: 'holding', href: `/${locale}/holding`, icon: Building2 },
    { id: 'contacto', href: `/${locale}/contacto`, icon: Phone },
  ];

  return (
    <section id="features-section" className="w-full bg-brand-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
              {t('title' as any)}
            </h2>
          </AnimatedSection>
          <AnimatedLine className="h-[3px] bg-brand-green" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <AnimatedSection
                key={feature.id}
                animation="fade-up"
                delay={(idx + 1) as 1 | 2 | 3 | 4}
              >
                <Link href={feature.href}>
                  <div className="card-hover bg-white p-8 h-full flex flex-col border-l-4 border-transparent hover:border-brand-green transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group">
                    <div className="mb-6 bg-brand-white w-14 h-14 flex items-center justify-center rounded-full group-hover:bg-brand-green/10 transition-colors">
                      <Icon className="w-7 h-7 text-brand-navy group-hover:text-brand-green transition-colors" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-brand-navy mb-3">
                      {t(`${feature.id}.title` as any)}
                    </h3>
                    <p className="font-body text-brand-navy/70 leading-relaxed flex-grow">
                      {t(`${feature.id}.description` as any)}
                    </p>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
