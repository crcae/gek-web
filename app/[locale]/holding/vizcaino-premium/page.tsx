import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { PageHero } from '@/components/sections/shared/PageHero';
import { ProductSpecsSelector } from '@/components/sections/holding/ProductSpecsSelector';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';
import { MapPin, CheckSquare, Sparkles } from 'lucide-react';
import fs from 'fs';
import path from 'path';

export default async function VizcainoPremiumPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('holding');

  const isEs = locale === 'es';
  const isDe = locale === 'de';

  const title = isEs ? 'Transformamos' : isDe ? 'Wir transformieren' : 'We Transform';
  const subtitle = isEs 
    ? 'Del campo a soluciones especializadas para mercados exigentes.' 
    : isDe 
      ? 'Vom Feld zu spezialisierten Lösungen für anspruchsvolle Märkte.' 
      : 'From the field to specialized solutions for demanding markets.';

  const intro = isEs
    ? 'Productos seleccionados y soluciones que generan valor. Vizcaíno Premium es la división especializada en chiles, cebollas y productos del campo que requieren procesamiento, selección de calidades y empaques adaptados a las necesidades de cada cliente y mercado.'
    : isDe
      ? 'Ausgewählte Produkte und Lösungen, die Wert generieren. Vizcaíno Premium ist die spezialisierte Abteilung für Chilis, Zwiebeln und Feldprodukte, die eine Verarbeitung, Qualitätsauswahl und Verpackung erfordern, die an die Bedürfnisse jedes Kunden und Marktes angepasst sind.'
      : 'Selected products and solutions that generate value. Vizcaíno Premium is the specialized division for chiles, onions, and field products requiring processing, quality selection, and packaging tailored to the needs of each customer and market.';

  const premiumHeroImg = '/images/holding/brands/premium-bg.jpg';
  const hasHeroBg = fs.existsSync(path.join(process.cwd(), 'public', premiumHeroImg));

  return (
    <div className="flex flex-col min-h-screen bg-brand-white">
      
      {/* Brand Hero Banner */}
      <PageHero
        title={title}
        subtitle={subtitle}
        heroImage={hasHeroBg ? premiumHeroImg : '/images/features/holding.jpg'}
      />

      {/* Intro section */}
      <section className="w-full bg-white py-16 px-6 border-b border-brand-gray/10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
            VIZCAÍNO PREMIUM
          </span>
          <h2 className="font-display text-3xl font-bold text-brand-navy mb-6">
            {isEs ? 'Valor Agregado para el Campo' : 'Value Added for the Field'}
          </h2>
          <p className="font-body text-brand-navy/80 text-lg leading-relaxed mb-8 max-w-2xl">
            {intro}
          </p>

          <Link
            href={`/${locale}/contacto?tipo=portafolio&marca=vizcaino-premium`}
            className="inline-flex items-center gap-2 border-2 border-brand-navy text-brand-navy font-display text-xs font-bold uppercase tracking-wider py-2.5 px-6 hover:bg-brand-navy hover:text-white transition-colors rounded-sm"
          >
            {isEs ? 'Ver Portafolio' : 'View Portfolio'}
            <span className="font-sans">→</span>
          </Link>
        </div>
      </section>

      {/* Unidades de Negocio */}
      <section className="w-full py-16 px-6 bg-brand-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-4">
              {isEs ? 'Centros de Distribución Premium' : 'Premium Distribution Centers'}
            </h3>
            <div className="w-12 h-[3px] bg-brand-green mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: CEDIS MTY */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-brand-gray/10 flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-lg bg-brand-navy/5 flex items-center justify-center text-brand-green mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="font-display text-lg font-bold text-brand-navy mb-2">
                  {isEs ? 'Centro de Distribución MTY' : 'Distribution Center MTY'}
                </h4>
                <p className="font-body text-xs md:text-sm text-brand-navy/70 leading-relaxed">
                  {isEs
                    ? 'Instalaciones equipadas para la recepción, enmallado, almacenamiento refrigerado y distribución rápida a cadenas de autoservicio en el norte y noreste del país.'
                    : 'Facilities equipped for receipt, mesh-bag packaging, cold storage and quick distribution to supermarkets in the north and northeast region.'
                  }
                </p>
              </div>
              <div className="border-t border-brand-gray/10 pt-4 mt-6">
                <span className="font-display text-xs font-black text-brand-navy uppercase tracking-wider">
                  San Nicolás de los Garza, Nuevo León
                </span>
              </div>
            </div>

            {/* Card 2: CEDIS TIJ */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-brand-gray/10 flex flex-col justify-between hover:shadow-lg transition-all">
              <div>
                <div className="w-12 h-12 rounded-lg bg-brand-navy/5 flex items-center justify-center text-brand-green mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="font-display text-lg font-bold text-brand-navy mb-2">
                  {isEs ? 'Centro de Distribución TIJ' : 'Distribution Center TIJ'}
                </h4>
                <p className="font-body text-xs md:text-sm text-brand-navy/70 leading-relaxed">
                  {isEs
                    ? 'Alianza logística estratégica que nos permite atender de manera ágil los mercados de la costa oeste y agilizar los cruces de exportación hacia Estados Unidos.'
                    : 'Strategic logistics alliance enabling us to agilely serve west coast markets and accelerate export crossings into the United States.'
                  }
                </p>
              </div>
              <div className="border-t border-brand-gray/10 pt-4 mt-6">
                <span className="font-display text-xs font-black text-brand-navy uppercase tracking-wider">
                  Tijuana, Baja California
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestra Especialidad */}
      <section className="w-full py-20 px-6 bg-white border-t border-b border-brand-gray/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
              {isEs ? 'Enfoque de Producto' : 'Product Focus'}
            </span>
            <h3 className="font-display text-3xl font-bold text-brand-navy mb-4">
              {isEs ? 'NUESTRA ESPECIALIDAD' : 'OUR SPECIALTY'}
            </h3>
            <p className="font-display text-lg font-medium text-brand-green mb-4">
              {isEs ? 'Expertos en productos picosos y cebollas.' : 'Experts in chiles and onions.'}
            </p>
            <p className="font-body text-sm md:text-base text-brand-navy/70 leading-relaxed">
              {isEs
                ? 'Nos especializamos en categorías estratégicas del campo mexicano, desarrollando soluciones de comercialización y empaque para cadenas de autoservicio, distribuidores y mercados internacionales.'
                : 'We specialize in strategic categories of the Mexican fields, developing commercialization and packaging solutions for supermarket chains, distributors and international markets.'
              }
            </p>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            <div className="p-4 bg-brand-white rounded-xl border border-brand-gray/10">
              <Sparkles className="w-6 h-6 text-brand-green mb-2" />
              <span className="block font-display text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
                {isEs ? 'Especialistas' : 'Specialists'}
              </span>
              <span className="block font-body text-xs text-brand-navy/60">
                {isEs ? 'Enfoque en chiles y cebollas' : 'Focus on peppers and onions'}
              </span>
            </div>
            <div className="p-4 bg-brand-white rounded-xl border border-brand-gray/10">
              <CheckSquare className="w-6 h-6 text-brand-green mb-2" />
              <span className="block font-display text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
                {isEs ? 'Soluciones Retail' : 'Retail Solutions'}
              </span>
              <span className="block font-body text-xs text-brand-navy/60">
                {isEs ? 'Empaques a la medida' : 'Tailored packaging styles'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Especificaciones de Producto */}
      <section className="w-full py-20 px-6 bg-brand-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
              Fichas Técnicas
            </span>
            <h3 className="font-display text-2xl md:text-4xl font-bold text-brand-navy mb-4">
              {isEs ? 'Especificaciones de Producto' : 'Product Specifications'}
            </h3>
            <div className="w-12 h-[3px] bg-brand-green mx-auto" />
          </div>

          <ProductSpecsSelector locale={locale} />
        </div>
      </section>

      {/* Sección de Calidades */}
      <section className="w-full py-20 px-6 bg-white border-t border-brand-gray/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-4">
              {isEs 
                ? 'Seleccionamos cada producto de acuerdo con las necesidades de tu mercado.'
                : 'We select each product according to the needs of your market.'
              }
            </h3>
            <p className="font-body text-sm text-brand-navy/60 leading-relaxed mt-4">
              {isEs
                ? 'Entendemos que cada cliente requiere especificaciones distintas. Por ello, clasificamos nuestros productos con base en criterios de calidad, apariencia y destino comercial, asegurando la mejor opción para cada aplicación.'
                : 'We understand that each client requires different specifications. Therefore, we classify our products based on quality criteria, appearance and commercial destination, ensuring the best option for each application.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Primera Calidad */}
            <div className="bg-brand-white p-8 rounded-2xl border-t-4 border-brand-navy shadow-md border-x border-b border-brand-gray/10 flex flex-col justify-between">
              <div>
                <h4 className="font-display text-lg font-bold text-brand-navy mb-4">
                  {isEs ? 'Primera Calidad' : 'Premium Grade'}
                </h4>
                <p className="font-body text-xs text-brand-navy/80 mb-6 leading-relaxed">
                  {isEs
                    ? 'La máxima expresión del producto del campo, seleccionada para los mercados más exigentes.'
                    : 'The maximum expression of the field product, selected for the most demanding markets.'
                  }
                </p>
                <ul className="space-y-3">
                  {[
                    isEs ? 'Primeros cortes de campo asegurados' : 'Guaranteed first fields harvest cuts',
                    isEs ? 'Calidad ideal para cadenas de retail y autoservicio' : 'Ideal quality for retail and supermarket chains',
                    isEs ? 'Óptima para exportación nacional e internacional' : 'Optimal for national and international export',
                    isEs ? 'Selección con los más altos estándares estéticos' : 'Selection with the highest aesthetic standards',
                    isEs ? 'Mayor uniformidad en tamaño, color y apariencia' : 'Greater uniformity in size, color and appearance'
                  ].map((bullet, i) => (
                    <li key={i} className="flex gap-2 text-xs font-body text-brand-navy/70">
                      <span className="text-brand-green font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card 2: Segunda Calidad */}
            <div className="bg-brand-white p-8 rounded-2xl border-t-4 border-brand-green shadow-md border-x border-b border-brand-gray/10 flex flex-col justify-between">
              <div>
                <h4 className="font-display text-lg font-bold text-brand-navy mb-4">
                  {isEs ? 'Segunda Calidad' : 'Standard Grade'}
                </h4>
                <p className="font-body text-xs text-brand-navy/80 mb-6 leading-relaxed">
                  {isEs
                    ? 'Una alternativa eficiente que mantiene altos estándares comerciales para diversos canales de distribución.'
                    : 'An efficient alternative that maintains high commercial standards for various distribution channels.'
                  }
                </p>
                <ul className="space-y-3">
                  {[
                    isEs ? 'Excelente relación calidad-precio' : 'Excellent quality-price ratio',
                    isEs ? 'Ideal para mercados mayoristas y food service' : 'Ideal for wholesale markets and food service',
                    isEs ? 'Apta para procesamiento y reempaque' : 'Suitable for processing and repackaging',
                    isEs ? 'Cumple especificaciones comerciales de frescura y presentación' : 'Meets commercial freshness and presentation specs',
                    isEs ? 'Mayor flexibilidad en calibres y apariencia' : 'Greater flexibility in sizes and appearance'
                  ].map((bullet, i) => (
                    <li key={i} className="flex gap-2 text-xs font-body text-brand-navy/70">
                      <span className="text-brand-green font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card 3: Tercera Calidad */}
            <div className="bg-brand-white p-8 rounded-2xl border-t-4 border-gray-300 shadow-md border-x border-b border-brand-gray/10 flex flex-col justify-between">
              <div>
                <h4 className="font-display text-lg font-bold text-brand-navy mb-4">
                  {isEs ? 'Tercera Calidad' : 'Utility/Industrial Grade'}
                </h4>
                <p className="font-body text-xs text-brand-navy/80 mb-6 leading-relaxed">
                  {isEs
                    ? 'Productos funcionales orientados a aplicaciones industriales y de transformación.'
                    : 'Functional products oriented to industrial applications and processing.'
                  }
                </p>
                <ul className="space-y-3">
                  {[
                    isEs ? 'Óptima para salseras e industria alimentaria' : 'Optimal for hot sauce makers and food industry',
                    isEs ? 'Ideal para procesos de molienda, cocción y transformación' : 'Ideal for grinding, cooking and transformation processes',
                    isEs ? 'Aprovechamiento eficiente del producto' : 'Efficient product utilization',
                    isEs ? 'Alternativa rentable para mercados industriales' : 'Cost-effective alternative for industrial markets',
                    isEs ? 'Disponibilidad para grandes volúmenes' : 'Availability for large volumes'
                  ].map((bullet, i) => (
                    <li key={i} className="flex gap-2 text-xs font-body text-brand-navy/70">
                      <span className="text-brand-green font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Cierre / CTA */}
      <section className="w-full py-20 px-6 bg-brand-navy text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-navy/90 z-0" />
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-brand-green/10 to-transparent z-0 pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
            {isEs ? 'Contacto Comercial' : 'Commercial Contact'}
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-extrabold mb-4 leading-tight">
            {isEs 
              ? 'Especialización que agrega valor a cada cosecha.'
              : 'Specialization that adds value to each harvest.'
            }
          </h3>
          <p className="font-body text-sm text-white/70 max-w-xl mx-auto mb-8">
            {isEs
              ? 'Trabajamos con clientes que buscan calidad, flexibilidad y soluciones adaptadas a su mercado.'
              : 'We work with clients seeking quality, flexibility and solutions adapted to their markets.'
            }
          </p>

          <Link
            href={`/${locale}/contacto?tipo=cotizacion&marca=vizcaino-premium`}
            className="inline-flex items-center gap-2 bg-brand-green text-brand-navy font-display text-xs md:text-sm font-bold uppercase tracking-wider py-3 px-8 rounded-sm hover:bg-white transition-colors shadow-lg"
          >
            {isEs ? 'Consultar Productos' : 'Inquire Products'}
            <span className="font-sans">→</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
