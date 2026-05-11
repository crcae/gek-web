'use client';

import { AnimatedSection } from '@/components/ui/AnimatedSection';

const hitos = [
  {
    titulo: "Fundación",
    descripcion: "El Sr. Ramiro Vizcaíno inicia la producción y comercialización de hortalizas en Loreto, Zacatecas.",
    periodo: "Origen"
  },
  {
    titulo: "Primera enfriadora",
    descripcion: "Construcción de la primera planta de preenfriamiento en Zacatecas.",
    periodo: ""
  },
  {
    titulo: "Incursión a la agricultura",
    descripcion: "Compra del primer rancho agrícola, consolidando el control sobre la producción.",
    periodo: ""
  },
  {
    titulo: "Expansión comercial",
    descripcion: "Apertura de dos puntos de venta en Monterrey y Guadalajara.",
    periodo: ""
  },
  {
    titulo: "Constitución del Grupo",
    descripcion: "Proceso de transición de empresa familiar a institución: constitución formal de Grupo Exportador del Campo.",
    periodo: ""
  },
  {
    titulo: "Primera exportación",
    descripcion: "Primera exportación oficial como Grupo Exportador del Campo.",
    periodo: ""
  },
  {
    titulo: "Inauguración del CEDIS",
    descripcion: "Apertura del Centro de Distribución en San Nicolás de los Garza, Nuevo León.",
    periodo: ""
  },
  {
    titulo: "Segunda enfriadora",
    descripcion: "Inauguración de la segunda planta de preenfriamiento, duplicando la capacidad de operación.",
    periodo: ""
  },
  {
    titulo: "Actualidad y futuro",
    descripcion: "Continuamos creciendo con la visión de trascender como institución agroindustrial de clase mundial.",
    periodo: "Hoy"
  },
];

export function Timeline() {
  return (
    <>
      {/* ── DESKTOP (md+): alternating left / right ── */}
      <div className="relative hidden md:block max-w-4xl mx-auto py-8 md:py-12">
        {/* Vertical line — centered */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-brand-gray/50 -translate-x-1/2" />

        {hitos.map((item, index) => {
          const esIzquierda = index % 2 === 0;
          const animation = esIzquierda ? 'slide-left' as const : 'slide-right' as const;

          return (
            <div key={index} className="relative flex items-start mb-12">

              {/* Left half */}
              <div className="w-1/2 pr-12">
                {esIzquierda && (
                  <AnimatedSection animation={animation}>
                    <div className="card-hover bg-white p-5 md:p-6 rounded-sm shadow-sm border border-brand-gray/20 hover:border-brand-green transition-colors group text-right">
                      {item.periodo && (
                        <span className="text-brand-green font-bold font-body text-sm mb-2 block">
                          {item.periodo}
                        </span>
                      )}
                      <h3 className="font-display text-lg md:text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-green transition-colors">
                        {item.titulo}
                      </h3>
                      <p className="font-body text-brand-navy/70 text-sm md:text-base">
                        {item.descripcion}
                      </p>
                    </div>
                  </AnimatedSection>
                )}
              </div>

              {/* Dot — always on the central line, never inside a card */}
              <div className="absolute left-1/2 -translate-x-1/2 top-6 z-10
                              w-4 h-4 rounded-full bg-brand-green
                              ring-4 ring-white shadow-md" />

              {/* Right half */}
              <div className="w-1/2 pl-12">
                {!esIzquierda && (
                  <AnimatedSection animation={animation}>
                    <div className="card-hover bg-white p-5 md:p-6 rounded-sm shadow-sm border border-brand-gray/20 hover:border-brand-green transition-colors group">
                      {item.periodo && (
                        <span className="text-brand-green font-bold font-body text-sm mb-2 block">
                          {item.periodo}
                        </span>
                      )}
                      <h3 className="font-display text-lg md:text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-green transition-colors">
                        {item.titulo}
                      </h3>
                      <p className="font-body text-brand-navy/70 text-sm md:text-base">
                        {item.descripcion}
                      </p>
                    </div>
                  </AnimatedSection>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* ── MOBILE (<md): always right, line on the left ── */}
      <div className="relative block md:hidden max-w-4xl mx-auto py-8 pl-8">
        {/* Vertical line — left */}
        <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-brand-gray/50" />

        {hitos.map((item, index) => (
          <div key={index} className="relative mb-10">
            {/* Dot — on the left line */}
            <div className="absolute -left-5 top-5 z-10
                            w-4 h-4 rounded-full bg-brand-green
                            ring-4 ring-white shadow-md" />

            <AnimatedSection animation="slide-right">
              <div className="card-hover bg-white p-5 rounded-sm shadow-sm border border-brand-gray/20 hover:border-brand-green transition-colors group">
                {item.periodo && (
                  <span className="text-brand-green font-bold font-body text-sm mb-2 block">
                    {item.periodo}
                  </span>
                )}
                <h3 className="font-display text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-green transition-colors">
                  {item.titulo}
                </h3>
                <p className="font-body text-brand-navy/70 text-sm">
                  {item.descripcion}
                </p>
              </div>
            </AnimatedSection>
          </div>
        ))}
      </div>
    </>
  );
}
