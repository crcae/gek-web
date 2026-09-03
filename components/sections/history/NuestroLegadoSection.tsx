'use client';

import Image from 'next/image';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';
import { VisualEditable } from '@/components/admin/VisualEditable';

interface NuestroLegadoSectionProps {
  eyebrow?: string;
  titulo?: string;
  texto?: string;
  mapaImagen?: string;
}

export function NuestroLegadoSection({
  eyebrow = 'NUESTROS ORÍGENES',
  titulo = 'Nacidos en Zacatecas',
  texto = 'Hace más de 50 años, en las fértiles tierras de Loreto, Zacatecas, nuestro fundador Don Ramiro Vizcaíno tomó las riendas de un proyecto que marcaría el camino de tres generaciones comprometidas a trabajar el campo.\n\nY la historia comenzó desde el municipio de Loreto.',
  mapaImagen,
}: NuestroLegadoSectionProps) {
  const defaultImg = '/images/zacatecas/_DSC3592.jpg';
  const displayImage = mapaImagen || defaultImg;

  return (
    <section id="origen" className="w-full bg-brand-white py-12 md:py-16 px-4 sm:px-6 relative overflow-hidden border-b border-brand-gray/10">
      {/* Background Watermark */}
      <div 
        className="absolute left-[-120px] top-[-120px] w-[320px] h-[320px] bg-no-repeat bg-contain pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'url(/images/isotipo/isotipo-oscuro.png)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left Column: Text & Story (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <AnimatedSection animation="fade-up">
              <VisualEditable id="historia.legado.eyebrow" label="Nuestro Legado - Eyebrow">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-green block mb-2.5">
                  {eyebrow}
                </span>
              </VisualEditable>

              <VisualEditable id="historia.legado.titulo" label="Nuestro Legado - Título">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
                  {titulo}
                </h2>
              </VisualEditable>
              
              <AnimatedLine className="h-[3px] bg-brand-green mb-6" />

              <VisualEditable id="historia.legado.texto" label="Nuestro Legado - Párrafo">
                <p className="font-body text-brand-navy/80 text-base md:text-lg leading-relaxed whitespace-pre-line">
                  {texto}
                </p>
              </VisualEditable>
            </AnimatedSection>
          </div>

          {/* Right Column: Editable Zacatecas Map / Illustration (6 cols) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-lg">
              <VisualEditable id="historia.legado.mapa" label="Mapa / Ilustración de Zacatecas" type="image" className="w-full">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-brand-gray/20 bg-white flex items-center justify-center">
                  <Image
                    src={displayImage}
                    alt="Mapa de Zacatecas — Origen GEC"
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
              </VisualEditable>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
