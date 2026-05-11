import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/shared/PageHero';
import { OrganigramaChart } from '@/components/sections/holding/OrganigramaChart';
import { getUnidadesNegocio } from '@/lib/queries/holding';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { getContenido } from '@/lib/contenido';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';
import fs from 'fs';
import path from 'path';

export default async function Holding({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('Holding');

  // Fetch from DB
  const [
    intro, 
    unidades, 
    m1Nombre, m1Desc, m1Prod,
    m2Nombre, m2Desc, m2Prod,
    m3Nombre, m3Desc, m3Prod
  ] = await Promise.all([
    getContenido('holding.intro', locale),
    getUnidadesNegocio(),
    getContenido('holding.marca1.nombre', locale),
    getContenido('holding.marca1.descripcion', locale),
    getContenido('holding.marca1.productos', locale),
    getContenido('holding.marca2.nombre', locale),
    getContenido('holding.marca2.descripcion', locale),
    getContenido('holding.marca2.productos', locale),
    getContenido('holding.marca3.nombre', locale),
    getContenido('holding.marca3.descripcion', locale),
    getContenido('holding.marca3.productos', locale),
  ]);

  const marcas = [
    { 
      nombre: m1Nombre || "Vizcaíno Fruit's", 
      desc: m1Desc, 
      prod: m1Prod,
      logoFile: 'VizcainoFruits_Logo.png'
    },
    { 
      nombre: m2Nombre || "Vizcaíno Premium", 
      desc: m2Desc, 
      prod: m2Prod,
      logoFile: 'VizcainoPremium_Logo_web.png'
    },
    { 
      nombre: m3Nombre || "Vizcaíno Services", 
      desc: m3Desc, 
      prod: m3Prod,
      logoFile: 'VizcainoServices_Logo_web.png'
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      {/* Intro */}
      <section className="w-full bg-brand-white py-20 px-6 border-b border-brand-gray/20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-brand-navy/80 text-xl leading-relaxed">
            {intro ?? t('intro')}
          </p>
        </div>
      </section>

      {/* Unidades de Negocio */}
      <section className="w-full bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
            <AnimatedSection animation="fade-up">
              <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
                {t('unidadesTitle')}
              </h2>
            </AnimatedSection>
            <AnimatedLine className="h-[3px] bg-brand-green" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {unidades.map((unidad, idx) => (
              <AnimatedSection key={unidad.id} animation="fade-up" delay={(idx % 4 + 1) as 1 | 2 | 3 | 4}>
              <div
                className="card-hover bg-brand-white p-8 rounded-sm shadow-sm border border-brand-gray/20 flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-brand-navy hover:text-white transition-colors duration-300 group h-full"
              >
                <div className="w-14 h-14 bg-brand-navy/5 text-brand-green rounded-full flex items-center justify-center shrink-0 group-hover:bg-brand-green/20">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-brand-navy group-hover:text-white mb-2 transition-colors">
                    {locale === 'en' ? (unidad.nameEn || unidad.nameEs) : locale === 'de' ? (unidad.nameDe || unidad.nameEs) : unidad.nameEs}
                  </h3>
                  <p className="font-body text-brand-navy/60 group-hover:text-white/70 transition-colors">
                    {unidad.location}
                  </p>
                </div>
              </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Marcas (Divisiones) */}
      <section className="w-full bg-brand-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
            <AnimatedSection animation="fade-up">
              <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
                Nuestras Marcas
              </h2>
            </AnimatedSection>
            <AnimatedLine className="h-[3px] bg-brand-green" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {marcas.map((marca, idx) => {
              const filePath = path.join(process.cwd(), 'public/images/logos', marca.logoFile);
              const logoExists = fs.existsSync(filePath);

              return (
                <AnimatedSection key={idx} animation="fade-up" delay={(idx + 1) as 1 | 2 | 3}>
                <div className="card-hover bg-white p-8 rounded-sm shadow-sm border-t-[3px] border-t-brand-green border-x border-b border-brand-gray/20 flex flex-col h-full">
                  <div className="h-24 flex items-center justify-center mb-6">
                    {logoExists ? (
                      <Image 
                        src={`/images/logos/${marca.logoFile}`} 
                        alt={marca.nombre}
                        width={200}
                        height={100}
                        className="max-h-full max-w-full object-contain"
                        quality={80}
                      />
                    ) : (
                      <span className="font-display text-brand-navy text-2xl font-bold text-center">
                        {marca.nombre}
                      </span>
                    )}
                  </div>
                  
                  <p className="font-body text-brand-navy/80 mb-6 flex-grow leading-relaxed">
                    {marca.desc}
                  </p>
                  
                  {marca.prod && (
                    <div className="mt-auto">
                      <div className="w-8 h-0.5 bg-brand-green mb-3" />
                      <ul className="space-y-2">
                        {marca.prod.split(', ').map((prodItem, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-brand-green mt-1.5 text-[10px]">●</span>
                            <span className="font-body text-sm text-brand-navy/90">{prodItem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Organigrama */}
      <section className="w-full bg-brand-white py-20 px-6 border-t-4 border-brand-green">
        <div className="max-w-[1200px] mx-auto">
          <AnimatedSection animation="fade-up" className="mb-12">
            <h2 className="font-display text-3xl text-brand-navy">
              Estructura Corporativa
            </h2>
            <h3 className="font-display text-4xl font-bold text-brand-navy mb-4">
              Unidades de Negocio
            </h3>
            <AnimatedLine className="h-[3px] bg-brand-green" />
          </AnimatedSection>
          
          <OrganigramaChart />
        </div>
      </section>
    </div>
  );
}
