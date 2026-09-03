import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/shared/PageHero';
import { HoldingBrandPanels } from '@/components/sections/holding/HoldingBrandPanels';
import { getContenidoCached } from '@/lib/queries/cache';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';
import { VisualEditable } from '@/components/admin/VisualEditable';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function Holding({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);
  const t = await getTranslations('holding');

  const isEs = locale === 'es';
  const isDe = locale === 'de';

  const contentIds = [
    'holding.hero.titulo',
    'holding.hero.sub',
    'holding.hero.imagen',
    'holding.intro',
    
    'holding.marcas.titulo',
    'holding.estructura.titulo',
    'holding.estructura.subtitulo',
    'holding.estructura.imagen',

    'holding.marca1.nombre',
    'holding.marca1.subtitulo',
    'holding.marca1.texto',
    'holding.marca1.pie',
    'holding.marca1.imagen',
    'holding.marca1.logo',
    'holding.marca1.folleto',

    'holding.marca2.nombre',
    'holding.marca2.subtitulo',
    'holding.marca2.texto',
    'holding.marca2.pie',
    'holding.marca2.imagen',
    'holding.marca2.logo',
    'holding.marca2.folleto',

    'holding.marca3.nombre',
    'holding.marca3.subtitulo',
    'holding.marca3.texto',
    'holding.marca3.pie',
    'holding.marca3.imagen',
    'holding.marca3.logo',
    'holding.marca3.folleto',
  ];

  const contenido = await getContenidoCached(contentIds, locale);

  const dbHeroImage = contenido['holding.hero.imagen'];
  const intro = contenido['holding.intro'] || (isEs
    ? 'Grupo Exportador del Campo integra marcas y unidades de negocio especializadas que operan bajo una misma filosofía: calidad, trazabilidad y compromiso con el campo. Desde la producción agrícola hasta la transformación, logística y comercialización, cada división cumple una función estratégica dentro de un sistema diseñado para llevar productos frescos y soluciones agroalimentarias a mercados nacionales e internacionales.'
    : 'Grupo Exportador del Campo integrates specialized brands and business units operating under a single philosophy: quality, traceability, and field commitment. From agricultural production to processing, logistics, and marketing, each division plays a strategic role within a system designed to deliver fresh produce and food solutions to national and international markets.');

  // Custom subtitle for holding page
  const customSubtitle = isEs
    ? 'Las diferentes unidades de negocio que nos conforman y marcas que nos representan. Comprometidas en una misma filosofía central que nos mueve: La Calidad.'
    : isDe
      ? 'Die verschiedenen Geschäftsbereiche und Marken, die uns repräsentieren. Verpflichtet einer zentralen Philosophie, die uns antreibt: Qualität.'
      : 'The different business units that make us up and brands that represent us. Committed to the same central philosophy that drives us: Quality.';

  const heroTitulo = contenido['holding.hero.titulo'] || t('titulo_pagina');
  const heroSubtitulo = contenido['holding.hero.sub'] || customSubtitle;

  const marcasTitulo = contenido['holding.marcas.titulo'] || (isEs ? 'Marcas y Unidades de Negocio' : 'Brands & Business Units');
  const estructuraTitulo = contenido['holding.estructura.titulo'] || (isEs ? 'Estructura Corporativa' : 'Corporate Structure');
  const estructuraSubtitulo = contenido['holding.estructura.subtitulo'] || 'GEC HOLDING';

  // Build marcasData array for the expandable accordion
  const defaultPdf = '/images/identidad/MANUAL_DE_IDENTIDAD_-_GRUPO_EXPORTADOR_DEL_CAMPO.pdf';
  const marcasData = [
    {
      id: 'fruits',
      nombre: contenido['holding.marca1.nombre'] || "Vizcaíno Fruits",
      subtitulo: contenido['holding.marca1.subtitulo'] || (isEs ? "Origen agrícola con visión global" : "Agricultural origin with global vision"),
      texto: contenido['holding.marca1.texto'] || (isEs
        ? "Producimos y comercializamos hortalizas frescas y enfriadas respaldadas por décadas de experiencia agrícola, llevando la calidad del campo mexicano a mercados nacionales e internacionales."
        : "We produce and commercialize fresh and cooled vegetables backed by decades of agricultural experience, bringing Mexican field quality to national and international markets."),
      ctaText: isEs ? "Descargar brochure" : isDe ? "Broschüre herunterladen" : "Download brochure",
      link: `/${locale}/holding/vizcaino-fruits`,
      pie: contenido['holding.marca1.pie'] || (isEs ? "Cultivamos" : "We cultivate"),
      logo: contenido['holding.marca1.logo'] || '/images/logos/VizcainoFruits_Logo.png',
      bgClass: 'bg-[#1b4332]', // Dark green
      colorClass: 'brand-green',
      bgImage: contenido['holding.marca1.imagen'] || '/images/features/quienes.jpg',
      folleto: contenido['holding.marca1.folleto'] || defaultPdf
    },
    {
      id: 'premium',
      nombre: contenido['holding.marca2.nombre'] || "Vizcaíno Premium",
      subtitulo: contenido['holding.marca2.subtitulo'] || (isEs ? "Valor agregado para el campo y sus mercados" : "Value added for the field and its markets"),
      texto: contenido['holding.marca2.texto'] || (isEs
        ? "Especialistas en chiles, cebollas y soluciones de empaque que elevan el valor de cada product o mediante selección, procesamiento y comercialización especializada."
        : "Specialists in chiles, onions and packaging solutions that elevate each product value through specialized selection, processing and commercialization."),
      ctaText: isEs ? "Descargar brochure" : isDe ? "Broschüre herunterladen" : "Download brochure",
      link: `/${locale}/holding/vizcaino-premium`,
      pie: contenido['holding.marca2.pie'] || (isEs ? "Transformamos" : "We transform"),
      logo: contenido['holding.marca2.logo'] || '/images/logos/VizcainoPremium_Logo_web.png',
      bgClass: 'bg-[#7f1d1d]', // Crimson red
      colorClass: 'brand-red',
      bgImage: contenido['holding.marca2.imagen'] || '/images/features/holding.jpg',
      folleto: contenido['holding.marca2.folleto'] || defaultPdf
    },
    {
      id: 'services',
      nombre: contenido['holding.marca3.nombre'] || "Vizcaíno Services",
      subtitulo: contenido['holding.marca3.subtitulo'] || (isEs ? "La infraestructura que impulsa al campo" : "The infrastructure that powers the field"),
      texto: contenido['holding.marca3.texto'] || (isEs
        ? "Integramos servicios de logística, refrigeración, enmallado, almacenamiento y maquila para conectar productos frescos con sus destinos de forma eficiente y confiable."
        : "We integrate logistics, pre-cooling, netting packaging, storage and maquila services to connect fresh produce with their destinations efficiently and reliably."),
      ctaText: isEs ? "Descargar brochure" : isDe ? "Broschüre herunterladen" : "Download brochure",
      link: `/${locale}/holding/vizcaino-services`,
      pie: contenido['holding.marca3.pie'] || (isEs ? "Movemos" : "We move"),
      logo: contenido['holding.marca3.logo'] || '/images/logos/VizcainoServices_Logo_web.png',
      bgClass: 'bg-[#0f4c5c]', // Deep blue
      colorClass: 'brand-blue',
      bgImage: contenido['holding.marca3.imagen'] || '/images/features/historia.jpg',
      folleto: contenido['holding.marca3.folleto'] || defaultPdf
    }
  ];

  // Corporate structure image
  const imgEstructura = contenido['holding.estructura.imagen'];

  return (
    <div className="flex flex-col min-h-screen bg-brand-white">
      {/* Banner Superior (Hero) */}
      <PageHero
        title={heroTitulo}
        subtitle={heroSubtitulo}
        heroImage={dbHeroImage || '/images/features/holding.jpg'}
        titleId="holding.hero.titulo"
        subtitleId="holding.hero.sub"
        heroImageId="holding.hero.imagen"
      />

      {/* Ecosistema de Marcas y Unidades de Negocio */}
      <section id="marcas-unidades" className="w-full bg-[#F8FAF9] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
            <AnimatedSection animation="fade-up">
              <VisualEditable id="holding.marcas.titulo" label="Título Sección Marcas">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
                  {marcasTitulo}
                </h2>
              </VisualEditable>
            </AnimatedSection>
            <AnimatedLine className="h-[3px] bg-brand-green" />
          </div>

          <HoldingBrandPanels locale={locale} marcasData={marcasData} />
        </div>
      </section>

      {/* Organigrama / Estructura Corporativa (Imagen / Diagrama de Flujos) */}
      <section id="estructura-corporativa" className="w-full bg-gray-50/50 py-20 px-6 border-t border-brand-gray/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedSection animation="fade-up" className="mb-12 text-center">
            <VisualEditable id="holding.estructura.subtitulo" label="Eyebrow Estructura Corporativa">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
                {estructuraSubtitulo}
              </span>
            </VisualEditable>
            <VisualEditable id="holding.estructura.titulo" label="Título Estructura Corporativa">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
                {estructuraTitulo}
              </h2>
            </VisualEditable>
            <AnimatedLine className="h-[3px] bg-brand-green mx-auto" />
          </AnimatedSection>

          {/* Diagrama de Flujos — Imagen Editable */}
          <div className="max-w-5xl mx-auto">
            <VisualEditable id="holding.estructura.imagen" label="Diagrama de Estructura Corporativa (Flujos)" type="image" className="w-full">
              <div className="bg-white border border-brand-gray/20 rounded-2xl shadow-xl overflow-hidden p-4 md:p-8 flex items-center justify-center min-h-[350px] md:min-h-[480px] relative">
                {imgEstructura ? (
                  <div className="relative w-full aspect-[16/9] max-h-[700px]">
                    <Image
                      src={imgEstructura}
                      alt="Diagrama de Estructura Corporativa GEC"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="text-center py-12 px-6 flex flex-col items-center gap-4 max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green border border-brand-green/20">
                      <span className="text-3xl">📊</span>
                    </div>
                    <div>
                      <h3 className="font-display text-lg md:text-xl font-bold text-brand-navy mb-2">
                        Diagrama de Flujo — Estructura Corporativa
                      </h3>
                      <p className="font-body text-xs md:text-sm text-brand-navy/65 leading-relaxed">
                        Espacio asignado para la imagen del diagrama de flujos y estructura corporativa de GEC Holding.
                      </p>
                    </div>
                    {session && (
                      <p className="font-body text-xs font-semibold text-brand-green bg-brand-green/10 px-4 py-2 rounded-full border border-brand-green/30">
                        Haz clic en el lápiz flotante para subir la imagen del diagrama
                      </p>
                    )}
                  </div>
                )}
              </div>
            </VisualEditable>
          </div>
        </div>
      </section>
    </div>
  );
}
