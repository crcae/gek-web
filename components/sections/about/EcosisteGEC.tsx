'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Heart, TrendingUp, Star, Settings } from 'lucide-react';
import Image from 'next/image';
import { VisualEditable } from '@/components/admin/VisualEditable';

interface EcosisteGECProps {
  imagenes: Record<string, string>;
  misionDesc: string;
  visionDesc: string;
  valores: { id: string; label: string }[];
  esenciaEyebrow: string;
  esenciaTitulo: string;
  esenciaSubtitulo: string;
  misionTitulo: string;
  visionTitulo: string;
  valoresTitulo: string;
  filosofiaGecText: string;
}

export function EcosisteGEC({
  imagenes,
  misionDesc,
  visionDesc,
  valores,
  esenciaEyebrow,
  esenciaTitulo,
  esenciaSubtitulo,
  misionTitulo,
  visionTitulo,
  valoresTitulo,
  filosofiaGecText,
}: EcosisteGECProps) {
  const [activo, setActivo] = useState<string | null>('mision');
  const { data: session } = useSession();
  const isAdmin = !!session;

  const paneles = [
    {
      id: 'mision',
      titulo: misionTitulo,
      icono: Heart,
      colorFondo: '#1A3D2B',
      contenido: misionDesc,
      imagenKey: 'quienes.ecosistema.mision.imagen',
      dbKey: 'quienes.mision',
      tituloKey: 'quienes.ecosistema.mision.titulo',
    },
    {
      id: 'vision',
      titulo: visionTitulo,
      icono: TrendingUp,
      colorFondo: '#1A2C3D',
      contenido: visionDesc,
      imagenKey: 'quienes.ecosistema.vision.imagen',
      dbKey: 'quienes.vision',
      tituloKey: 'quienes.ecosistema.vision.titulo',
    },
    {
      id: 'valores',
      titulo: valoresTitulo,
      icono: Star,
      colorFondo: '#1E2D3A',
      contenido: null,
      imagenKey: 'quienes.ecosistema.valores.imagen',
      valores: valores,
      tituloKey: 'quienes.ecosistema.valores.titulo',
    },
  ];

  return (
    <section id="ecosistema" className="py-20 px-4 sm:px-6 bg-white border-b border-brand-gray/10">
      <div className="max-w-6xl mx-auto">
        {/* Eyebrow */}
        <VisualEditable id="quienes.esencia.eyebrow" label="Nuestra Esencia - Eyebrow">
          <p className="text-center text-brand-green text-xs font-bold uppercase tracking-widest mb-3">
            {esenciaEyebrow}
          </p>
        </VisualEditable>

        {/* Título */}
        <VisualEditable id="quienes.esencia.titulo" label="Nuestra Esencia - Título">
          <h2 className="text-center font-display text-4xl md:text-5xl text-brand-navy font-bold mb-4">
            {esenciaTitulo}
          </h2>
        </VisualEditable>

        <VisualEditable id="quienes.esencia.subtitulo" label="Nuestra Esencia - Subtítulo">
          <p className="text-center text-brand-navy/60 text-base max-w-xl mx-auto mb-8">
            {esenciaSubtitulo}
          </p>
        </VisualEditable>
        
        <div className="w-[60px] h-[3px] bg-brand-green mx-auto mb-16" />

        {/* Vertical Accordion Stack */}
        <div className="flex flex-col h-[520px] md:h-[580px] rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative">
          {paneles.map((panel) => {
            const estaActivo = activo === panel.id;
            const Icono = panel.icono;
            const imagen = imagenes?.[panel.imagenKey];

            return (
              <div
                key={panel.id}
                onMouseEnter={() => setActivo(panel.id)}
                className={`relative transition-all duration-500 ease-out cursor-pointer overflow-hidden flex flex-col justify-center p-6 md:p-10 border-b border-white/10 last:border-b-0 ${
                  estaActivo ? 'flex-[2.5] md:flex-[3]' : 'flex-1'
                }`}
                style={{ backgroundColor: panel.colorFondo }}
              >
                {/* Background Image with lower opacity overlay */}
                {imagen && (
                  <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <VisualEditable
                      id={panel.imagenKey}
                      label={`Imagen ${panel.titulo}`}
                      type="image"
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={imagen}
                        alt={panel.titulo}
                        fill
                        className="object-cover opacity-45 transition-transform duration-700"
                        quality={90}
                      />
                    </VisualEditable>
                  </div>
                )}

                {/* Edit background image button overlay when active — solo admin */}
                {estaActivo && imagen && isAdmin && (
                  <div className="absolute top-4 right-4 z-20">
                    <VisualEditable id={panel.imagenKey} label={`Imagen ${panel.titulo}`} type="image">
                      <button
                        type="button"
                        className="bg-brand-navy/90 hover:bg-brand-green text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-brand-green/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        Cambiar Imagen
                      </button>
                    </VisualEditable>
                  </div>
                )}

                {/* Shading Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30 z-0" />

                {/* Content */}
                <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Left Column: Icon + Title */}
                  <div className="flex items-center gap-4 shrink-0 transition-transform duration-300">
                    <div className="w-12 h-12 rounded-xl bg-brand-green/20 flex items-center justify-center text-brand-green shrink-0 shadow-inner">
                      <Icono className="w-6 h-6" />
                    </div>
                    <div>
                      <VisualEditable id="quienes.ecosistema.filosofia.label" label="Texto Filosofía GEC">
                        <span className="text-[9px] text-brand-green uppercase tracking-widest font-bold block mb-0.5">
                          {filosofiaGecText}
                        </span>
                      </VisualEditable>
                      <VisualEditable id={panel.tituloKey} label={`Título Panel ${panel.titulo}`}>
                        <h3 className="font-display text-lg md:text-2xl font-extrabold leading-tight text-white">
                          {panel.titulo}
                        </h3>
                      </VisualEditable>
                    </div>
                  </div>

                  {/* Right Column: Description or Grid of Values (Visible when active) */}
                  <div className={`transition-all duration-500 ease-in-out md:border-l md:border-white/10 md:pl-8 flex-grow ${
                    estaActivo ? 'opacity-100 max-h-[300px] md:max-h-full mt-3 md:mt-0' : 'opacity-0 max-h-0 md:max-h-0 overflow-hidden'
                  }`}>
                    {panel.contenido ? (
                      <VisualEditable id={panel.dbKey || ''} label={`Contenido ${panel.titulo}`}>
                        <p className="font-body text-sm md:text-base lg:text-lg text-white/90 leading-relaxed font-light max-w-2xl">
                          {panel.contenido}
                        </p>
                      </VisualEditable>
                    ) : (
                      // Grid of values
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {panel.valores?.map((valor) => (
                          <div key={valor.id} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" />
                            <VisualEditable id={`quienes.valor.${valor.id}`} label={`Valor: ${valor.id}`}>
                              <span className="font-body text-xs md:text-sm text-white/90 font-medium">
                                {valor.label}
                              </span>
                            </VisualEditable>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
