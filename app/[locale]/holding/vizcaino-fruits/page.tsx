import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/sections/shared/PageHero';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';
import { ShieldCheck, CheckCircle2, MapPin, Award } from 'lucide-react';
import { getContenidoCached } from '@/lib/queries/cache';
import fs from 'fs';
import path from 'path';

export default async function VizcainoFruitsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('holding');
  
  // Resolve localized texts
  const isEs = locale === 'es';
  const isDe = locale === 'de';

  const title = isEs ? 'Cultivamos' : isDe ? 'Wir kultivieren' : 'We Cultivate';
  const subtitle = isEs 
    ? 'Frutas y hortalizas frescas con calidad que trasciende fronteras.' 
    : isDe 
      ? 'Frisches Obst und Gemüse mit Qualität, die Grenzen überschreitet.' 
      : 'Fresh fruits and vegetables with quality that transcends borders.';

  const intro = isEs
    ? 'Nacimos en Loreto, Zacatecas, cultivando lechugas y repollo hace más de 50 años. Hoy llevamos al mercado una amplia oferta de frutas y hortalizas frescas, manteniendo el compromiso con la calidad y la confianza que han distinguido a nuestra familia desde el inicio.'
    : isDe
      ? 'Wir wurden in Loreto, Zacatecas, geboren und bauen vor mehr als 50 Jahren Salat und Kohl an. Heute bringen wir eine breite Palette an frischem Obst und Gemüse auf den Markt und bewahren das Engagement für Qualität und Vertrauen, das unsere Familie von Anfang an ausgezeichnet hat.'
      : 'We were born in Loreto, Zacatecas, cultivating lettuce and cabbage more than 50 years ago. Today we bring a wide range of fresh fruits and vegetables to the market, maintaining the commitment to quality and trust that have distinguished our family from the beginning.';

  const highlights = [
    { value: '+50', label: isEs ? 'Años de experiencia' : isDe ? 'Jahre Erfahrung' : 'Years of experience' },
    { value: '100%', label: isEs ? 'Producción propia' : isDe ? 'Eigene Produktion' : 'Own production' },
    { value: 'Retail', label: isEs ? 'Presencia en cadenas nacionales' : isDe ? 'Präsenz in nationalen Ketten' : 'Presence in national chains' },
    { value: 'Global', label: isEs ? 'Distribuidoras internacionales' : isDe ? 'Internationale Vertriebspartner' : 'International distributors' },
    { value: 'GDL', label: isEs ? 'Punto de venta en Guadalajara, Jalisco' : isDe ? 'Verkaufsstelle in Guadalajara' : 'Point of sale in Guadalajara, Jal.' },
    { value: '360°', label: isEs ? 'Cadena integrada' : isDe ? 'Integrierte Kette' : 'Integrated supply chain' },
    { value: '365', label: isEs ? 'Productos los 365 días del año' : isDe ? 'Produkte an 365 Tagen im Jahr' : 'Products 365 days a year' },
  ];

  const calidadPuntos = [
    isEs ? 'Calidad respaldada por procesos rigurosos' : 'Quality backed by rigorous processes',
    isEs ? 'Manejo cuidadoso postcosecha' : 'Careful post-harvest handling',
    isEs ? 'Trazabilidad completa de principio a fin' : 'Complete end-to-end traceability',
    isEs ? 'Protocolos estrictos de inocuidad alimentaria' : 'Strict food safety protocols',
    isEs ? 'Mantenimiento ininterrumpido de la cadena de frío' : 'Uninterrupted cold chain maintenance',
    isEs ? 'Altos estándares de calidad internacional' : 'High international quality standards',
  ];

  // Check if PrimusGFS certificate logo exists
  const primusPath = path.join(process.cwd(), 'public/images/certificados/primusgfs.png');
  const hasPrimus = fs.existsSync(primusPath);

  // Background check for branding header banner image
  const fruitsHeroImg = '/images/holding/brands/fruits-bg.jpg';
  const hasHeroBg = fs.existsSync(path.join(process.cwd(), 'public', fruitsHeroImg));

  return (
    <div className="flex flex-col min-h-screen bg-brand-white">
      
      {/* Brand Hero Banner */}
      <PageHero
        title={title}
        subtitle={subtitle}
        heroImage={hasHeroBg ? fruitsHeroImg : '/images/features/holding.jpg'}
      />

      {/* Intro section */}
      <section className="w-full bg-white py-16 px-6 border-b border-brand-gray/10">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
            VIZCAÍNO FRUITS
          </span>
          <h2 className="font-display text-3xl font-bold text-brand-navy mb-6">
            {isEs ? 'Origen Agrícola con Visión Global' : 'Agricultural Origin with Global Vision'}
          </h2>
          <p className="font-body text-brand-navy/80 text-lg leading-relaxed">
            {intro}
          </p>
        </div>
      </section>

      {/* Highlights / Metrics */}
      <section className="w-full py-16 px-6 bg-brand-navy text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 text-center">
            {highlights.map((h, idx) => (
              <AnimatedSection key={idx} animation="fade-up" className="flex flex-col items-center">
                <span className="font-display text-3xl md:text-4xl font-black text-brand-green mb-2 block">
                  {h.value}
                </span>
                <span className="font-body text-xs text-white/70 leading-snug max-w-[120px]">
                  {h.label}
                </span>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Calidad e Inocuidad */}
      <section className="w-full py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
              {isEs ? 'Estándares Internacionales' : 'International Standards'}
            </span>
            <h3 className="font-display text-3xl font-bold text-brand-navy mb-6">
              {isEs ? 'Calidad e inocuidad' : 'Quality & Food Safety'}
            </h3>
            <AnimatedLine className="h-[3px] bg-brand-green mb-8" />
            
            <ul className="space-y-4">
              {calidadPuntos.map((punto, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                  <span className="font-body text-sm md:text-base text-brand-navy/80">{punto}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications Block */}
          <div className="bg-brand-white p-8 rounded-2xl border border-brand-gray/10 flex flex-col items-center justify-center text-center shadow-lg">
            <Award className="w-12 h-12 text-brand-navy mb-4" />
            <h4 className="font-display text-lg font-bold text-brand-navy mb-2">
              {isEs ? 'Certificación de Inocuidad' : 'Food Safety Certification'}
            </h4>
            <p className="font-body text-xs text-brand-navy/60 max-w-xs mb-6">
              {isEs 
                ? 'Nuestros campos y procesos postcosecha cumplen con rigurosos estándares globales de inocuidad alimentaria.'
                : 'Our fields and post-harvest operations comply with rigorous global food safety standards.'
              }
            </p>
            {hasPrimus ? (
              <div className="relative w-48 h-20">
                <Image
                  src="/images/certificados/primusgfs.png"
                  alt="Primus GFS Certification"
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-brand-navy/20 p-4 rounded bg-white text-xs font-bold uppercase tracking-widest text-brand-navy/40">
                Primus GFS Certificado
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Unidades de Negocio */}
      <section className="w-full py-20 px-6 bg-brand-white border-t border-brand-gray/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-4">
              {isEs ? 'Unidades de Negocio de Vizcaíno Fruits' : 'Vizcaíno Fruits Business Units'}
            </h3>
            <div className="w-12 h-[3px] bg-brand-green mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Campos de Producción */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-brand-gray/10 hover:shadow-xl transition-shadow flex flex-col justify-between">
              <div>
                <span className="inline-block bg-brand-green/10 text-brand-green font-bold text-xs px-2.5 py-1 rounded-full mb-4 uppercase tracking-wider">
                  {isEs ? 'Operación Agrícola' : 'Agricultural Operations'}
                </span>
                <h4 className="font-display text-xl font-bold text-brand-navy mb-4">
                  {isEs ? 'Campos de Producción' : 'Production Fields'}
                </h4>
                <p className="font-body text-sm text-brand-navy/70 leading-relaxed mb-6">
                  {isEs 
                    ? 'Campos propios estratégicos y una red de campos aliados con proveedores de la más alta confianza que nos permiten asegurar abasto continuo.'
                    : 'Strategic owned fields and a network of allied fields with high-trust growers allowing us to secure continuous supply.'
                  }
                </p>
              </div>
              <div className="flex items-center gap-2 border-t border-brand-gray/10 pt-4 mt-4">
                <MapPin className="w-5 h-5 text-brand-green shrink-0" />
                <span className="font-display text-sm font-bold text-brand-navy">
                  Loreto, Zacatecas
                </span>
              </div>
            </div>

            {/* Card 2: Bodega Mercado de Abastos Guadalajara */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-brand-gray/10 hover:shadow-xl transition-shadow flex flex-col justify-between">
              <div>
                <span className="inline-block bg-brand-green/10 text-brand-green font-bold text-xs px-2.5 py-1 rounded-full mb-4 uppercase tracking-wider">
                  {isEs ? 'Distribución Mayorista' : 'Wholesale Distribution'}
                </span>
                <h4 className="font-display text-xl font-bold text-brand-navy mb-4">
                  {isEs ? 'Bodega Mercado de Abastos' : 'Market Warehouse'}
                </h4>
                <p className="font-body text-sm text-brand-navy/70 leading-relaxed mb-6">
                  {isEs
                    ? 'Punto estratégico de venta mayorista y distribución en uno de los centros de abasto más activos e importantes del occidente de la República.'
                    : 'Strategic point of wholesale sales and distribution in one of the most active and important supply centers in Western Mexico.'
                  }
                </p>
              </div>
              <div className="flex items-center gap-2 border-t border-brand-gray/10 pt-4 mt-4">
                <MapPin className="w-5 h-5 text-brand-green shrink-0" />
                <span className="font-display text-sm font-bold text-brand-navy">
                  Calle 10, Guadalajara, Jalisco
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cierre / CTA */}
      <section className="w-full py-20 px-6 bg-brand-navy text-white text-center relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-brand-navy/90 z-0" />
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-brand-green/10 to-transparent z-0 pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
            {isEs ? 'Contacto Comercial' : 'Commercial Contact'}
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-extrabold mb-4 leading-tight">
            {isEs 
              ? 'Cultivamos relaciones duraderas a través de productos excepcionales.'
              : 'We cultivate lasting relations through exceptional products.'
            }
          </h3>
          <p className="font-body text-sm text-white/70 max-w-xl mx-auto mb-8">
            {isEs
              ? '¿Buscas un proveedor confiable de frutas y hortalizas frescas?'
              : 'Looking for a reliable supplier of fresh fruits and vegetables?'
            }
          </p>

          <Link
            href={`/${locale}/contacto?tipo=cotizacion&marca=vizcaino-fruits`}
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
