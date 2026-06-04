'use client';

import { useState } from 'react';
import { Heart, TrendingUp, Star } from 'lucide-react';

const paneles = [
  {
    id: 'mision',
    titulo: 'Nuestra razón de ser',
    icono: Heart,
    colorFondo: '#1A3D2B',
    contenido: 'Seguir la tradición de más de 3 generaciones de poner al alcance de los consumidores chiles y hortalizas de calidad, con alto valor agregado garantizando la máxima calidad del mercado.',
    imagenKey: 'quienes.ecosistema.mision.imagen',
  },
  {
    id: 'vision',
    titulo: 'Seguimos apuntando alto',
    icono: TrendingUp,
    colorFondo: '#1A2C3D',
    contenido: 'Empresa de producción y comercialización de altos volúmenes en mercados nacionales y extranjeros, con calidad sanitaria certificada y con una trazabilidad que dé confianza al cliente final.',
    imagenKey: 'quienes.ecosistema.vision.imagen',
  },
  {
    id: 'valores',
    titulo: 'Filosofía GEC',
    icono: Star,
    colorFondo: '#1E2D3A',
    contenido: null, // Muestra grid de valores en lugar de texto
    imagenKey: 'quienes.ecosistema.valores.imagen',
    valores: ['Honestidad', 'Compromiso', 'Humildad', 'Profesionalismo', 'Lealtad', 'Transparencia'],
  },
];

export function EcosisteGEC({ imagenes }: { imagenes: Record<string, string> }) {
  const [activo, setActivo] = useState<string | null>(null);

  return (
    <section className="py-20 px-4">
      {/* Eyebrow */}
      <p className="text-center text-brand-green text-xs font-medium uppercase tracking-widest mb-3">
        NUESTRA ESENCIA
      </p>

      {/* Título */}
      <h2 className="text-center font-display text-4xl md:text-5xl text-brand-navy font-bold mb-3">
        Ecosistema de Pensamiento GEC
      </h2>
      <p className="text-center text-gray-500 text-base mb-12 max-w-xl mx-auto">
        Los principios que guían cada decisión, desde el campo hasta el cliente.
      </p>
      <div className="w-12 h-0.5 bg-brand-green mx-auto mb-12" />

      {/* Paneles */}
      <div className="flex h-80 md:h-96 rounded-2xl overflow-hidden max-w-6xl mx-auto shadow-xl">
        {paneles.map((panel) => {
          const estaActivo = activo === panel.id;
          const Icono = panel.icono;
          const imagen = imagenes?.[panel.imagenKey];

          return (
            <div
              key={panel.id}
              onMouseEnter={() => setActivo(panel.id)}
              onMouseLeave={() => setActivo(null)}
              className={`relative transition-all duration-500 ease-out cursor-pointer overflow-hidden ${
                estaActivo ? 'flex-[3]' : 'flex-1'
              }`}
              style={{ backgroundColor: panel.colorFondo }}
            >
              {/* Imagen de fondo si existe */}
              {imagen && (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
                  style={{
                    backgroundImage: `url(${imagen})`,
                    opacity: estaActivo ? 0.25 : 0.15,
                  }}
                />
              )}

              {/* Overlay */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: panel.colorFondo + 'CC' }}
              />

              {/* Contenido */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
                <Icono className="w-7 h-7 text-brand-green mb-3 flex-shrink-0" />

                <h3 className="font-display text-white font-bold text-lg md:text-xl leading-tight">
                  {panel.titulo}
                </h3>

                {/* Texto expandido — solo visible cuando activo */}
                <div
                  className={`transition-all duration-400 overflow-hidden ${
                    estaActivo ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="w-8 h-0.5 bg-brand-green mb-3" />
                  {panel.contenido ? (
                    <p className="text-white/80 text-sm leading-relaxed">
                      {panel.contenido}
                    </p>
                  ) : (
                    // Panel Filosofía GEC: grid de valores
                    <div className="grid grid-cols-2 gap-2">
                      {panel.valores?.map((valor) => (
                        <span key={valor} className="text-white/80 text-sm flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" />
                          {valor}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: tabs verticales */}
      <div className="md:hidden mt-6 space-y-3">
        {paneles.map((panel) => {
          const estaActivo = activo === panel.id;
          const Icono = panel.icono;
          return (
            <div
              key={panel.id}
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: panel.colorFondo }}
            >
              <button
                onClick={() => setActivo(estaActivo ? null : panel.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <Icono className="w-5 h-5 text-brand-green flex-shrink-0" />
                <span className="font-display text-white font-bold">{panel.titulo}</span>
                <span
                  className={`ml-auto text-white/60 transition-transform ${
                    estaActivo ? 'rotate-180' : ''
                  }`}
                >
                  ▾
                </span>
              </button>
              {estaActivo && (
                <div className="px-4 pb-4">
                  <div className="w-8 h-0.5 bg-brand-green mb-3" />
                  {panel.contenido ? (
                    <p className="text-white/80 text-sm leading-relaxed">
                      {panel.contenido}
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {panel.valores?.map((valor) => (
                        <span key={valor} className="text-white/80 text-sm flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                          {valor}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
