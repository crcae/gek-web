import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/shared/PageHero';
import { OrganigramaChart } from '@/components/sections/holding/OrganigramaChart';
import { HoldingBrandPanels } from '@/components/sections/holding/HoldingBrandPanels';
import { getContenidoCached } from '@/lib/queries/cache';
import Image from 'next/image';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';
import fs from 'fs';
import path from 'path';

export default async function Holding({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('holding');
  
  const isEs = locale === 'es';
  const isDe = locale === 'de';

  const contentIds = [
    'holding.intro',
    'holding.hero.imagen',
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

  // Build marcasData array for the expandable accordion
  const marcasData = [
    {
      id: 'fruits',
      nombre: "Vizcaíno Fruits",
      subtitulo: isEs ? "Origen agrícola con visión global" : "Agricultural origin with global vision",
      texto: isEs 
        ? "Producimos y comercializamos hortalizas frescas y enfriadas respaldadas por décadas de experiencia agrícola, llevando la calidad del campo mexicano a mercados nacionales e internacionales."
        : "We produce and commercialize fresh and cooled vegetables backed by decades of agricultural experience, bringing Mexican field quality to national and international markets.",
      ctaText: isEs ? "Descubre nuestros productos" : "Discover our products",
      link: `/${locale}/holding/vizcaino-fruits`,
      pie: isEs ? "Cultivamos" : "We cultivate",
      logo: '/images/logos/VizcainoFruits_Logo.png',
      bgClass: 'bg-[#1b4332]', // Dark green
      colorClass: 'brand-green'
    },
    {
      id: 'premium',
      nombre: "Vizcaíno Premium",
      subtitulo: isEs ? "Valor agregado para el campo y sus mercados" : "Value added for the field and its markets",
      texto: isEs
        ? "Especialistas en chiles, cebollas y soluciones de empaque que elevan el valor de cada producto mediante selección, procesamiento y comercialización especializada."
        : "Specialists in chiles, onions and packaging solutions that elevate each product value through specialized selection, processing and commercialization.",
      ctaText: isEs ? "Conoce nuestra especialidad" : "Explore our specialty",
      link: `/${locale}/holding/vizcaino-premium`,
      pie: isEs ? "Transformamos" : "We transform",
      logo: '/images/logos/VizcainoPremium_Logo_web.png',
      bgClass: 'bg-[#7f1d1d]', // Crimson red
      colorClass: 'brand-red'
    },
    {
      id: 'services',
      nombre: "Vizcaíno Services",
      subtitulo: isEs ? "La infraestructura que impulsa al campo" : "The infrastructure that powers the field",
      texto: isEs
        ? "Integramos servicios de logística, refrigeración, enmallado, almacenamiento y maquila para conectar productos frescos con sus destinos de forma eficiente y confiable."
        : "We integrate logistics, pre-cooling, netting packaging, storage and maquila services to connect fresh produce with their destinations efficiently and reliably.",
      ctaText: isEs ? "Explora nuestros servicios" : "Explore our services",
      link: `/${locale}/holding/vizcaino-services`,
      pie: isEs ? "Movemos" : "We move",
      logo: '/images/logos/VizcainoServices_Logo_web.png',
      bgClass: 'bg-[#0f4c5c]', // Deep blue
      colorClass: 'brand-blue'
    }
  ];

  // Resolve corporate structure image path
  const ecPath = '/images/holding/estructura-corporativa.png';
  const hasEcImage = fs.existsSync(path.join(process.cwd(), 'public', ecPath));

  return (
    <div className="flex flex-col min-h-screen bg-brand-white">
      {/* Banner Superior (Hero) */}
      <PageHero
        title={t('titulo_pagina')}
        subtitle={customSubtitle}
        heroImage={dbHeroImage || '/images/features/holding.jpg'}
      />

      {/* Introducción Corporativa */}
      <section className="w-full bg-white py-16 md:py-20 px-6 border-b border-brand-gray/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-brand-navy/80 text-lg md:text-xl leading-relaxed">
            {intro}
          </p>
        </div>
      </section>

      {/* Ecosistema de Marcas y Unidades de Negocio */}
      <section className="w-full bg-[#F8FAF9] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
            <AnimatedSection animation="fade-up">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
                {isEs ? 'Marcas y Unidades de Negocio' : 'Brands & Business Units'}
              </h2>
            </AnimatedSection>
            <AnimatedLine className="h-[3px] bg-brand-green" />
          </div>

          <HoldingBrandPanels locale={locale} marcasData={marcasData} />
        </div>
      </section>

      {/* Organigrama / Estructura Corporativa */}
      <section className="w-full bg-white py-20 px-6 border-t border-brand-gray/10 relative overflow-hidden">
        {/* Background Watermark/Isotipo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
          <div className="relative w-[600px] h-[600px]">
            <Image
              src="/images/isotipo/isotipo-oscuro.png"
              alt="GEC Isotipo Watermark"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto relative z-10">
          <AnimatedSection animation="fade-up" className="mb-16 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
              GEC HOLDING
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {isEs ? 'Estructura Corporativa' : 'Corporate Structure'}
            </h2>
            <AnimatedLine className="h-[3px] bg-brand-green mx-auto" />
          </AnimatedSection>
          
          {hasEcImage ? (
            <div className="relative w-full aspect-[16/9] max-w-4xl mx-auto rounded-lg overflow-hidden border border-brand-gray/15 shadow-xl bg-white mb-12">
              <Image
                src={ecPath}
                alt="Estructura Corporativa GEC"
                fill
                className="object-contain p-4"
              />
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur border border-brand-gray/15 rounded-2xl p-6 shadow-xl relative">
              <OrganigramaChart />
              
              {/* Decorative corners items */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] text-brand-navy/30 uppercase tracking-widest font-body">
                <span>GEC Holding</span>
                <span>•</span>
                <span>Organigrama</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
