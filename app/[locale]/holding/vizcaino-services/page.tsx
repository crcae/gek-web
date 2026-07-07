import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { PageHero } from '@/components/sections/shared/PageHero';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';
import { MapPin, Warehouse, Truck, RefreshCw, Thermometer, ShieldCheck, Download, Mail } from 'lucide-react';
import fs from 'fs';
import path from 'path';

export default async function VizcainoServicesPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('holding');

  const isEs = locale === 'es';
  const isDe = locale === 'de';

  const title = isEs ? 'Movemos' : isDe ? 'Wir bewegen' : 'We Move';
  const subtitle = isEs 
    ? 'Infraestructura especializada para conectar el campo con sus mercados.' 
    : isDe 
      ? 'Spezialisierte Infrastruktur zur Verbindung des Feldes mit seinen Märkten.' 
      : 'Specialized infrastructure to connect the field with its markets.';

  const intro = isEs
    ? 'Desde el preenfriado hasta el transporte, ofrecemos servicios que fortalecen la cadena de suministro agroalimentaria con eficiencia, confiabilidad y experiencia. Vizcaíno Services integra soluciones logísticas y postcosecha diseñadas para preservar la calidad, optimizar operaciones y garantizar que cada producto llegue a su destino en las mejores condiciones.'
    : isDe
      ? 'Vom Vorkühlen bis zum Transport bieten wir Dienstleistungen, die die landwirtschaftliche Lieferkette mit Effizienz, Zuverlässigkeit und Erfahrung stärken. Vizcaíno Services integriert Logistik- und Nachernte-Lösungen, die darauf ausgelegt sind, die Qualität zu erhalten, den Betrieb zu optimieren und sicherzustellen, dass jedes Produkt im besten Zustand ankommt.'
      : 'From pre-cooling to transport, we offer services that strengthen the agri-food supply chain with efficiency, reliability and experience. Vizcaíno Services integrates logistics and post-harvest solutions designed to preserve quality, optimize operations and guarantee that each product reaches its destination in the best conditions.';

  const servicesHeroImg = '/images/holding/brands/services-bg.jpg';
  const hasHeroBg = fs.existsSync(path.join(process.cwd(), 'public', servicesHeroImg));

  return (
    <div className="flex flex-col min-h-screen bg-brand-white">
      
      {/* Brand Hero Banner */}
      <PageHero
        title={title}
        subtitle={subtitle}
        heroImage={hasHeroBg ? servicesHeroImg : '/images/features/holding.jpg'}
      />

      {/* Intro section */}
      <section className="w-full bg-white py-16 px-6 border-b border-brand-gray/10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
            VIZCAÍNO SERVICES
          </span>
          <h2 className="font-display text-3xl font-bold text-brand-navy mb-6">
            {isEs ? 'Infraestructura y Soluciones Logísticas' : 'Infrastructure and Logistics Solutions'}
          </h2>
          <p className="font-body text-brand-navy/80 text-lg leading-relaxed max-w-3xl">
            {intro}
          </p>
        </div>
      </section>

      {/* Nuestra Infraestructura */}
      <section className="w-full py-20 px-6 bg-brand-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
              {isEs ? 'Activos y Cobertura' : 'Assets & Coverage'}
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-4">
              {isEs ? 'Nuestra Infraestructura' : 'Our Infrastructure'}
            </h3>
            <p className="font-body text-sm text-brand-navy/60 max-w-md mx-auto">
              {isEs 
                ? 'Soluciones integrales diseñadas para dar soporte a la cadena de valor de forma ininterrumpida.'
                : 'Comprehensive solutions designed to support the value chain uninterrupted.'
              }
            </p>
            <div className="w-12 h-[3px] bg-brand-green mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl border border-brand-gray/10 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-brand-navy/5 flex items-center justify-center text-brand-green mb-4">
                <Warehouse className="w-6 h-6" />
              </div>
              <h4 className="font-display text-base font-bold text-brand-navy mb-2">
                {isEs ? 'Almacenaje / Cuartos fríos' : 'Cold Storage / Rooms'}
              </h4>
              <p className="font-body text-xs text-brand-navy/60 leading-relaxed mb-4">
                {isEs ? 'Almacenamiento térmico controlado para asegurar vida útil.' : 'Temperature-controlled storage to secure product shelf life.'}
              </p>
              <span className="text-[11px] font-bold text-brand-green uppercase tracking-wider block mt-auto">
                Monterrey, Nuevo León
              </span>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl border border-brand-gray/10 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-brand-navy/5 flex items-center justify-center text-brand-green mb-4">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h4 className="font-display text-base font-bold text-brand-navy mb-2">
                {isEs ? 'Enmalladora de Productos' : 'Product Netting Packing'}
              </h4>
              <p className="font-body text-xs text-brand-navy/60 leading-relaxed mb-4">
                {isEs ? 'Línea de enmallado automatizada para cítricos, cebollas y más.' : 'Automated netting line for citrus, onions and other products.'}
              </p>
              <span className="text-[11px] font-bold text-brand-green uppercase tracking-wider block mt-auto">
                Monterrey, Nuevo León
              </span>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl border border-brand-gray/10 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-brand-navy/5 flex items-center justify-center text-brand-green mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-display text-base font-bold text-brand-navy mb-2">
                {isEs ? 'Transporte Refrigerado' : 'Refrigerated Transport'}
              </h4>
              <p className="font-body text-xs text-brand-navy/60 leading-relaxed mb-4">
                {isEs ? 'Flotilla con cajas de frío equipadas para larga distancia.' : 'Fleet with cooling trailer boxes equipped for long hauls.'}
              </p>
              <span className="text-[11px] font-bold text-brand-green uppercase tracking-wider block mt-auto">
                Alcance México - USA
              </span>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-xl border border-brand-gray/10 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-lg bg-brand-navy/5 flex items-center justify-center text-brand-green mb-4">
                <Warehouse className="w-6 h-6" />
              </div>
              <h4 className="font-display text-base font-bold text-brand-navy mb-2">
                {isEs ? 'Maquila y Empaque' : 'Maquiladora & Packing'}
              </h4>
              <p className="font-body text-xs text-brand-navy/60 leading-relaxed mb-4">
                {isEs ? 'Reempaque, selección de calibres y servicios logísticos.' : 'Repacking, grading sizes and value-added logistics services.'}
              </p>
              <span className="text-[11px] font-bold text-brand-green uppercase tracking-wider block mt-auto">
                MTY, NL & TIJ, BC
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cadena de Valor Esquema */}
      <section className="w-full py-16 px-6 bg-brand-navy text-white border-t border-b border-brand-green">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
              Proceso Logístico
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
              {isEs ? 'Cadena de Valor Integrada' : 'Integrated Value Chain'}
            </h3>
            <p className="font-body text-xs text-white/50">
              {isEs ? 'Un aliado estratégico de principio a fin.' : 'A strategic ally from end to end.'}
            </p>
          </div>

          {/* Simple step flowchart */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center items-center">
            {[
              isEs ? 'Campo' : 'Field',
              isEs ? 'Preenfriamiento' : 'Pre-cooling',
              isEs ? 'Almacenamiento' : 'Cold Storage',
              isEs ? 'Maquila / Empaque' : 'Maquila / Packing',
              isEs ? 'Transporte' : 'Transport',
              isEs ? 'Mercado / Destino' : 'Market / Destination'
            ].map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center bg-white/5 p-4 rounded-lg border border-white/10">
                <span className="font-display text-2xl font-black text-brand-green mb-1 block">
                  0{idx + 1}
                </span>
                <span className="font-body text-xs font-bold leading-tight">
                  {step}
                </span>
                {idx < 5 && (
                  <span className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-brand-green text-sm font-black z-25">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios de Maquila */}
      <section className="w-full py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
                {isEs ? 'Valor Agregado' : 'Value Addition'}
              </span>
              <h3 className="font-display text-3xl font-bold text-brand-navy mb-6">
                {isEs ? 'Servicios de Maquila y Empaque' : 'Maquila & Packaging Services'}
              </h3>
              <p className="font-body text-sm md:text-base text-brand-navy/70 leading-relaxed mb-6">
                {isEs 
                  ? 'Vizcaíno Services cuenta con maquinaria especializada para realizar empaques personalizados en malla y a granel, cumpliendo con los requerimientos logísticos y estéticos de las principales cadenas de supermercados en México y EE. UU.'
                  : 'Vizcaíno Services is equipped with specialized machinery to perform custom packaging in mesh sacks and bulk, fulfilling the logistics and presentation requirements of top supermarkets in Mexico and the US.'
                }
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 border-l-2 border-brand-green pl-3">
                  <span className="font-display text-sm font-bold text-brand-navy">Maquila enmallado</span>
                  <span className="font-body text-xs text-brand-navy/55">{isEs ? 'Cebolla, limón, cítricos' : 'Onions, lemon, citrus'}</span>
                </div>
                <div className="flex flex-col gap-1 border-l-2 border-brand-green pl-3">
                  <span className="font-display text-sm font-bold text-brand-navy">Malla extruida / tejida</span>
                  <span className="font-body text-xs text-brand-navy/55">{isEs ? 'Diversas presentaciones' : 'Various layouts and sizes'}</span>
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-brand-gray/10 bg-brand-white shadow-lg">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-brand-navy/5 text-center">
                <Warehouse className="w-10 h-10 text-brand-navy/35 mb-2" />
                <span className="text-xs text-brand-navy/50 font-bold uppercase tracking-wider">
                  {isEs ? 'Maquinaria de Enmallado' : 'Netting Packaging Area'}
                </span>
                <span className="text-[10px] text-brand-navy/30 mt-1">
                  /public/images/holding/services/maquila.jpg
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios de Logística */}
      <section className="w-full py-20 px-6 bg-brand-white border-t border-b border-brand-gray/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
              {isEs ? 'Transporte y Distribución' : 'Transport & Distribution'}
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-navy mb-4">
              {isEs ? 'Servicios de Logística' : 'Logistics Services'}
            </h3>
            <div className="w-12 h-[3px] bg-brand-green mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* FTL */}
            <div className="bg-white p-8 rounded-2xl border border-brand-gray/10 shadow-md flex flex-col justify-between">
              <div>
                <h4 className="font-display text-lg font-bold text-brand-navy mb-4">
                  {isEs ? 'Transporte de Carga Completa (FTL)' : 'Full Truck Load (FTL)'}
                </h4>
                <p className="font-body text-xs md:text-sm text-brand-navy/70 leading-relaxed mb-6">
                  {isEs
                    ? 'Movemos grandes volúmenes con eficiencia y control. Diseñado para el traslado de productos perecederos a larga distancia, nuestro servicio de carga completa garantiza la conservación y puntualidad que exige la cadena agroalimentaria.'
                    : 'We move large volumes with efficiency and control. Designed for transporting perishable items long-distance, our FTL service guarantees temperature maintenance and on-time delivery.'
                  }
                </p>
                
                <h5 className="font-display text-xs font-bold text-brand-green uppercase tracking-wider mb-2">
                  {isEs ? 'Capacidades destacadas:' : 'Core capabilities:'}
                </h5>
                <ul className="space-y-2 mb-6">
                  {[
                    isEs ? 'Transporte refrigerado para productos perecederos' : 'Refrigerated trailers for fresh goods',
                    isEs ? 'Cobertura nacional e internacional' : 'National and cross-border coverage',
                    isEs ? 'Monitoreo y trazabilidad de embarques' : 'GPS tracking and shipment status reports',
                    isEs ? 'Operación puerta a puerta' : 'Door-to-door logistics execution'
                  ].map((bullet, i) => (
                    <li key={i} className="flex gap-2 text-xs font-body text-brand-navy/70">
                      <span className="text-brand-green font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-brand-gray/10 pt-4 mt-auto">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
                  {isEs ? 'Mercados atendidos:' : 'Markets:'}
                </span>
                <span className="font-display text-sm font-bold text-brand-navy">
                  México · Estados Unidos
                </span>
              </div>
            </div>

            {/* Ultima Milla */}
            <div className="bg-white p-8 rounded-2xl border border-brand-gray/10 shadow-md flex flex-col justify-between">
              <div>
                <h4 className="font-display text-lg font-bold text-brand-navy mb-4">
                  {isEs ? 'Distribución Regional y Última Milla' : 'Regional & Last Mile Delivery'}
                </h4>
                <p className="font-body text-xs md:text-sm text-brand-navy/70 leading-relaxed mb-6">
                  {isEs
                    ? 'Flexibilidad para abastecer mercados estratégicos. Nuestra flota de distribución regional permite realizar entregas ágiles y eficientes a clientes, puntos de venta y centros de distribución.'
                    : 'Flexibility to supply strategic markets. Our regional distribution fleet performs agile, efficient deliveries to retail stores, points of sale and warehouses.'
                  }
                </p>

                <h5 className="font-display text-xs font-bold text-brand-green uppercase tracking-wider mb-2">
                  {isEs ? 'Capacidades destacadas:' : 'Core capabilities:'}
                </h5>
                <ul className="space-y-2 mb-6">
                  {[
                    isEs ? 'Entregas regionales y urbanas directas' : 'Direct regional and urban routing',
                    isEs ? 'Distribución a CEDIS y puntos de venta' : 'Scheduled distribution to supermarkets & sales centers',
                    isEs ? 'Transporte de productos frescos y enfriados' : 'Temperature-maintained medium trucks',
                    isEs ? 'Mayor flexibilidad operativa en volúmenes pequeños' : 'Higher operational flexibility for smaller volumes'
                  ].map((bullet, i) => (
                    <li key={i} className="flex gap-2 text-xs font-body text-brand-navy/70">
                      <span className="text-brand-green font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-brand-gray/10 pt-4 mt-auto">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">
                  {isEs ? 'Área de Operación:' : 'Area:'}
                </span>
                <span className="font-display text-sm font-bold text-brand-navy">
                  Norte y Centro de México
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planta de Enfriamiento */}
      <section className="w-full py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
              Postcosecha
            </span>
            <h3 className="font-display text-3xl font-bold text-brand-navy mb-4">
              {isEs ? 'Preservamos la frescura desde el origen.' : 'We preserve freshness from the origin.'}
            </h3>
            <p className="font-body text-sm md:text-base text-brand-navy/70 leading-relaxed mb-6">
              {isEs
                ? 'Ubicada estratégicamente en Loreto, Zacatecas, nuestra planta de enfriamiento permite reducir rápidamente la temperatura de los productos recién cosechados, ayudando a preservar su calidad, frescura y vida útil antes de su distribución a mercados nacionales e internacionales.'
                : 'Strategically located in Loreto, Zacatecas, our cooling plant quickly reduces temperature in freshly harvested products, preserving quality, freshness and extending shelf life before distribution.'
              }
            </p>

            <h4 className="font-display text-xs font-bold text-brand-green uppercase tracking-wider mb-3">
              {isEs ? 'Capacidades destacadas:' : 'Core highlights:'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                isEs ? 'Enfriamiento postcosecha de productos perecederos' : 'Rapid post-harvest cooling for fresh produce',
                isEs ? 'Conservación de calidad y frescura integral' : 'Excellent quality and texture retention',
                isEs ? 'Extensión de vida útil del producto' : 'Prolonged shelf life for transit and retail',
                isEs ? 'Integración directa con la cadena de frío' : 'Direct connection into the shipping cold chain'
              ].map((cap, i) => (
                <div key={i} className="flex gap-2 items-start text-xs font-body text-brand-navy/80">
                  <ShieldCheck className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-brand-white p-6 rounded-2xl border border-brand-gray/10 shadow-lg">
            <h4 className="font-display text-sm font-bold text-brand-navy uppercase tracking-wider mb-4 pb-2 border-b border-brand-gray/10">
              {isEs ? 'Especificaciones Técnicas' : 'Technical Specifications'}
            </h4>
            <div className="space-y-3 font-body text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-brand-navy/60">{isEs ? 'Ubicación' : 'Location'}:</span>
                <span className="font-bold text-brand-navy">Loreto, Zacatecas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-navy/60">{isEs ? 'Tecnología' : 'Technology'}:</span>
                <span className="font-bold text-brand-navy">Vacuum Cooling / Prefrío</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-navy/60">{isEs ? 'Capacidad' : 'Capacity'}:</span>
                <span className="font-bold text-brand-navy/40">Por confirmar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-navy/60">{isEs ? 'Tiempo de ciclo' : 'Cycle Time'}:</span>
                <span className="font-bold text-brand-navy/40">Por confirmar</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-navy/60">{isEs ? 'Productos compatibles' : 'Compatible produce'}:</span>
                <span className="font-bold text-brand-navy text-right">Lechuga, apio y hortalizas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-navy/60">{isEs ? 'Temperatura operativa' : 'Operating Temp'}:</span>
                <span className="font-bold text-brand-navy/40">Por confirmar</span>
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
            {isEs ? 'Servicios Integrales' : 'Comprehensive Services'}
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-extrabold mb-4 leading-tight">
            {isEs 
              ? 'Impulsamos el movimiento del campo.'
              : 'We power the flow of agricultural produce.'
            }
          </h3>
          <p className="font-body text-sm text-white/70 max-w-xl mx-auto mb-8">
            {isEs
              ? 'Con infraestructura especializada y soluciones integrales, ayudamos a que los productos lleguen más lejos, conservando su calidad en cada etapa del camino.'
              : 'With specialized infrastructure and comprehensive solutions, we help products go further, preserving quality at every step.'
            }
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/${locale}/contacto?tipo=servicios&marca=vizcaino-services`}
              className="inline-flex items-center gap-2 bg-brand-green text-brand-navy font-display text-xs md:text-sm font-bold uppercase tracking-wider py-3 px-8 rounded-sm hover:bg-white transition-colors shadow-lg w-full sm:w-auto justify-center"
            >
              <Mail className="w-4 h-4" />
              {isEs ? 'Hablar con un especialista' : 'Speak with a specialist'}
            </Link>
            
            <Link
              href={`/${locale}/contacto?tipo=dossier&marca=vizcaino-services`}
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white text-white font-display text-xs md:text-sm font-bold uppercase tracking-wider py-3 px-8 rounded-sm hover:bg-white/10 transition-colors w-full sm:w-auto justify-center"
            >
              <Download className="w-4 h-4" />
              {isEs ? 'Descargar díptico de servicios' : 'Download services overview'}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
