import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Users, BookOpen, Building2, Phone, ArrowRight } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';
import { getContenidoCached } from '@/lib/queries/cache';

export async function FeaturesSection({ locale }: { locale: string }) {
  const t = await getTranslations('features');
  const tHome = await getTranslations('home');

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
      label: 'Quiénes Somos',
      href: `/${locale}/quienes-somos`, 
      icon: Users, 
      descKey: 'quienes_desc',
      image: content['features.quienes.imagen'] || '/images/zacatecas/_DSC3751.jpg'
    },
    { 
      id: 'historia', 
      label: 'Historia',
      href: `/${locale}/historia`, 
      icon: BookOpen, 
      descKey: 'historia_desc',
      image: content['features.historia.imagen'] || '/images/fundadores/1778448626256-_dsc3984.jpg'
    },
    { 
      id: 'holding', 
      label: 'Holding',
      href: `/${locale}/holding`, 
      icon: Building2, 
      descKey: 'holding_desc',
      image: content['features.holding.imagen'] || '/images/zacatecas/_DSC3590.jpg'
    },
    { 
      id: 'contacto', 
      label: 'Contacto',
      href: `/${locale}/contacto`, 
      icon: Phone, 
      descKey: 'contacto_desc',
      image: content['features.contacto.imagen'] || '/images/zacatecas/_DSC3760.jpg'
    },
  ];

  return (
    <section id="features-section" className="w-full bg-brand-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
              {tHome('secciones_titulo')}
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
                  <div className="bg-white h-full flex flex-col border-l-4 border-transparent group-hover:border-brand-green transition-all duration-400 shadow-sm hover:shadow-xl overflow-hidden relative">
                    
                    {/* Top Image Area */}
                    <div className="relative h-[200px] w-full overflow-hidden">
                      <Image
                        src={feature.image}
                        alt={feature.label}
                        fill
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-brand-navy/60 transition-colors duration-400 group-hover:bg-brand-navy/40" />
                    </div>

                    {/* Content Area */}
                    <div className="p-8 flex flex-col flex-grow relative bg-white transform transition-transform duration-400 group-hover:-translate-y-1">
                      {/* Floating Icon */}
                      <div className="absolute -top-10 left-8 bg-white w-14 h-14 flex items-center justify-center rounded-full shadow-md group-hover:bg-brand-green/10 transition-colors">
                        <Icon className="w-7 h-7 text-brand-navy group-hover:text-brand-green transition-colors" />
                      </div>
                      
                      <h3 className="font-display text-xl font-bold text-brand-navy mb-3 mt-4">
                        {feature.label}
                      </h3>
                      <p className="font-body text-brand-navy/70 leading-relaxed flex-grow">
                        {t(feature.descKey as any)}
                      </p>

                      <div className="mt-6 flex items-center text-sm font-medium text-brand-navy group-hover:text-brand-green transition-colors">
                        Ver más <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
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
