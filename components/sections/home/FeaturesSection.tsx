import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Users, BookOpen, Building2, Phone, ArrowRight } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';
import { getContenidoCached } from '@/lib/queries/cache';
import { FeatureImage } from './FeatureImage';

export async function FeaturesSection({ locale }: { locale: string }) {
  const t = await getTranslations('features');

  const imageSlots = [
    'features.quienes.imagen',
    'features.historia.imagen',
    'features.holding.imagen',
    'features.contacto.imagen'
  ];
  
  const content = await getContenidoCached(imageSlots, locale);

  const features = [
    {
      id: 'quienes',
      label: t('quienes_label'),
      href: `/${locale}/quienes-somos`,
      icon: Users,
      desc: t('quienes_desc'),
      image: content['features.quienes.imagen'] || '/images/features/quienes.jpg'
    },
    {
      id: 'historia',
      label: t('historia_label'),
      href: `/${locale}/historia`,
      icon: BookOpen,
      desc: t('historia_desc'),
      image: content['features.historia.imagen'] || '/images/features/historia.jpg'
    },
    {
      id: 'holding',
      label: t('holding_label'),
      href: `/${locale}/holding`,
      icon: Building2,
      desc: t('holding_desc'),
      image: content['features.holding.imagen'] || '/images/features/holding.jpg'
    },
    {
      id: 'contacto',
      label: t('contacto_label'),
      href: `/${locale}/contacto`,
      icon: Phone,
      desc: t('contacto_desc'),
      image: content['features.contacto.imagen'] || '/images/features/contacto.jpg'
    },
  ];

  return (
    <section id="features-section" className="w-full bg-brand-white py-20 px-6 relative overflow-hidden">
      
      {/* Decorative Watermark */}
      <div 
        className="absolute left-[-150px] top-[-150px] w-[350px] h-[350px] bg-no-repeat bg-contain pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'url(/images/isotipo/isotipo-oscuro.png)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-12 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
              {t('titulo')}
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
                className="h-full"
              >
                <Link href={feature.href} className="block h-full group">
                  <div className="bg-white h-full flex flex-col border-l-4 border-transparent hover:border-brand-green transition-all duration-400 shadow-sm hover:shadow-xl overflow-hidden relative rounded-lg border border-gray-100">
                    
                    {/* Top Image Area */}
                    <div className="relative h-[200px] w-full overflow-hidden bg-brand-navy">
                      {/* Check if image URL looks valid and has content, else render fallback wrapper */}
                      <FeatureImage src={feature.image} alt={feature.label} />
                      {/* Watermark Isotipo over Navy placeholder background */}
                      <div 
                        className="absolute inset-0 flex items-center justify-center opacity-10 bg-no-repeat bg-center bg-contain pointer-events-none"
                        style={{ backgroundImage: 'url(/images/isotipo/isotipo-claro.png)', backgroundSize: '60%' }}
                      />
                      <div className="absolute inset-0 bg-brand-navy/50 transition-colors duration-400 group-hover:bg-brand-navy/35" />
                    </div>

                    {/* Content Area */}
                    <div className="p-8 flex flex-col flex-grow relative bg-white transform transition-transform duration-400 group-hover:-translate-y-1">
                      {/* Floating Icon */}
                      <div className="absolute -top-10 left-8 bg-white w-14 h-14 flex items-center justify-center rounded-full shadow-md group-hover:bg-brand-green/10 transition-colors border border-gray-100">
                        <Icon className="w-7 h-7 text-brand-navy group-hover:text-brand-green transition-colors" />
                      </div>
                      
                      <h3 className="font-display text-xl font-bold text-brand-navy mb-3 mt-4">
                        {feature.label}
                      </h3>
                      <p className="font-body text-brand-navy/70 text-sm leading-relaxed flex-grow">
                        {feature.desc}
                      </p>

                      <div className="mt-6 flex items-center text-sm font-medium text-brand-navy group-hover:text-brand-green transition-colors">
                        {t('ver_mas')} <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
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
