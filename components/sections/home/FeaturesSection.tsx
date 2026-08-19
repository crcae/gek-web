import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Users, BookOpen, Building2, Phone, ArrowRight, Settings } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';
import { getContenidoCached } from '@/lib/queries/cache';
import { FeatureImage } from './FeatureImage';
import { VisualEditable } from '@/components/admin/VisualEditable';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function FeaturesSection({ locale }: { locale: string }) {
  const [t, session] = await Promise.all([
    getTranslations('features'),
    getServerSession(authOptions)
  ]);

  const slots = [
    'home.features_titulo',
    'features.quienes.imagen',
    'features.quienes.label',
    'features.quienes.desc',
    'features.historia.imagen',
    'features.historia.label',
    'features.historia.desc',
    'features.holding.imagen',
    'features.holding.label',
    'features.holding.desc',
    'features.contacto.imagen',
    'features.contacto.label',
    'features.contacto.desc',
  ];
  
  const content = await getContenidoCached(slots, locale);

  const features = [
    { 
      id: 'quienes',
      label: content['features.quienes.label'] || 'Quiénes Somos',
      href: `/${locale}/quienes-somos`, 
      icon: Users, 
      desc: content['features.quienes.desc'] || 'Velamos por el campo desde hace cincuenta años y seguimos apuntando alto',
      image: content['features.quienes.imagen'] || '/images/features/quienes.jpg'
    },
    { 
      id: 'historia', 
      label: content['features.historia.label'] || 'Historia',
      href: `/${locale}/historia`, 
      icon: BookOpen, 
      desc: content['features.historia.desc'] || 'Porque somos más que una operación, somos un legado',
      image: content['features.historia.imagen'] || '/images/features/historia.jpg'
    },
    { 
      id: 'holding', 
      label: content['features.holding.label'] || 'Holding',
      href: `/${locale}/holding`, 
      icon: Building2, 
      desc: content['features.holding.desc'] || t('holding_desc'),
      image: content['features.holding.imagen'] || '/images/features/holding.jpg'
    },
    { 
      id: 'contacto', 
      label: content['features.contacto.label'] || 'Contacto',
      href: `/${locale}/contacto`, 
      icon: Phone, 
      desc: content['features.contacto.desc'] || t('contacto_desc'),
      image: content['features.contacto.imagen'] || '/images/features/contacto.jpg'
    },
  ];

  return (
    <section id="features-section" className="w-full bg-brand-white py-20 px-6 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-12 text-center">
          <AnimatedSection animation="fade-up">
            <VisualEditable id="home.features_titulo" label="Título Sección Conoce más de nosotros">
              <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
                {content['home.features_titulo'] || t('titulo')}
              </h2>
            </VisualEditable>
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
                {session ? (
                  <div className="block h-full group">
                    <div className="bg-white h-full flex flex-col border-l-4 border-transparent hover:border-brand-green transition-all duration-400 shadow-sm hover:shadow-xl overflow-hidden relative rounded-lg border border-gray-100">
                      
                      {/* Top Image Area */}
                      <div className="relative h-[200px] w-full overflow-hidden bg-brand-navy">
                        <FeatureImage src={feature.image} alt={feature.label} />
                        
                        {/* Administrar Imagen Button Overlay */}
                        <div className="absolute top-3 right-3 z-20">
                          <VisualEditable id={`features.${feature.id}.imagen`} label={`Imagen de ${feature.label}`} type="image">
                            <button
                              type="button"
                              className="bg-brand-navy/90 hover:bg-brand-green text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-brand-green/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Settings className="w-3.5 h-3.5" />
                            </button>
                          </VisualEditable>
                        </div>
                        <div className="absolute inset-0 bg-brand-navy/25 transition-colors duration-400 group-hover:bg-brand-navy/15" />
                      </div>

                      {/* Content Area */}
                      <div className="p-8 flex flex-col flex-grow relative bg-white transform transition-transform duration-400 group-hover:-translate-y-1">
                        {/* Floating Icon */}
                        <div className="absolute -top-10 left-8 bg-white w-14 h-14 flex items-center justify-center rounded-full shadow-md group-hover:bg-brand-green/10 transition-colors border border-gray-100">
                          <Icon className="w-7 h-7 text-brand-navy group-hover:text-brand-green transition-colors" />
                        </div>
                        
                        <VisualEditable id={`features.${feature.id}.label`} label={`Título de ${feature.label}`}>
                          <h3 className="font-display text-xl font-bold text-brand-navy mb-3 mt-4">
                            {feature.label}
                          </h3>
                        </VisualEditable>

                        <VisualEditable id={`features.${feature.id}.desc`} label={`Descripción de ${feature.label}`}>
                          <p className="font-body text-brand-navy/70 text-sm leading-relaxed flex-grow">
                            {feature.desc}
                          </p>
                        </VisualEditable>

                        <Link href={feature.href} className="mt-6 flex items-center text-sm font-medium text-brand-navy hover:text-brand-green transition-colors cursor-pointer">
                          {t('ver_mas')} <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href={feature.href} className="block h-full group">
                    <div className="bg-white h-full flex flex-col border-l-4 border-transparent hover:border-brand-green transition-all duration-400 shadow-sm hover:shadow-xl overflow-hidden relative rounded-lg border border-gray-100">
                      
                      {/* Top Image Area */}
                      <div className="relative h-[200px] w-full overflow-hidden bg-brand-navy">
                        <VisualEditable id={`features.${feature.id}.imagen`} label={`Imagen de ${feature.label}`} type="image">
                          <FeatureImage src={feature.image} alt={feature.label} />
                        </VisualEditable>
                        <div className="absolute inset-0 bg-brand-navy/25 transition-colors duration-400 group-hover:bg-brand-navy/15" />
                      </div>

                      {/* Content Area */}
                      <div className="p-8 flex flex-col flex-grow relative bg-white transform transition-transform duration-400 group-hover:-translate-y-1">
                        {/* Floating Icon */}
                        <div className="absolute -top-10 left-8 bg-white w-14 h-14 flex items-center justify-center rounded-full shadow-md group-hover:bg-brand-green/10 transition-colors border border-gray-100">
                          <Icon className="w-7 h-7 text-brand-navy group-hover:text-brand-green transition-colors" />
                        </div>
                        
                        <VisualEditable id={`features.${feature.id}.label`} label={`Título de ${feature.label}`}>
                          <h3 className="font-display text-xl font-bold text-brand-navy mb-3 mt-4">
                            {feature.label}
                          </h3>
                        </VisualEditable>

                        <VisualEditable id={`features.${feature.id}.desc`} label={`Descripción de ${feature.label}`}>
                          <p className="font-body text-brand-navy/70 text-sm leading-relaxed flex-grow">
                            {feature.desc}
                          </p>
                        </VisualEditable>

                        <div className="mt-6 flex items-center text-sm font-medium text-brand-navy group-hover:text-brand-green transition-colors">
                          {t('ver_mas')} <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
