'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { VisualEditable } from '@/components/admin/VisualEditable';

interface Pilar {
  id: string;
  titulo: string;
  subtitulo: string;
  desc: string;
  color: string;
}

interface EcosistemaGECProps {
  eyebrow: string;
  titulo: string;
  slogan: string;
  pilares: Pilar[];
}

export function EcosistemaGEC({
  eyebrow,
  titulo,
  slogan,
  pilares = [],
}: EcosistemaGECProps) {
  const [openId, setOpenId] = useState<string | null>('campo');

  return (
    <section className="w-full bg-white py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <VisualEditable id="quienes.ecosistema.gec.eyebrow" label="Ecosistema GEC - Eyebrow">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-green block mb-3">
              {eyebrow}
            </span>
          </VisualEditable>
          
          <VisualEditable id="quienes.ecosistema.gec.titulo" label="Ecosistema GEC - Título">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {titulo}
            </h2>
          </VisualEditable>
          <div className="w-[60px] h-[3px] bg-brand-green mx-auto" />
        </div>

        <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          {pilares.map((p) => {
            const isOpen = openId === p.id;
            return (
              <div key={p.id} className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <button
                  className={`w-full flex items-center justify-between p-5 text-left transition-colors duration-200 ${
                    isOpen ? 'bg-brand-navy text-white' : 'bg-white hover:bg-gray-50 text-brand-navy'
                  }`}
                  onClick={() => setOpenId(isOpen ? null : p.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-10 rounded-full shrink-0 ${p.color}`} />
                    <div>
                      <VisualEditable id={`quienes.ecosistema.gec.${p.id}.titulo`} label={`Pilar ${p.id} - Título`}>
                        <span className={`font-display font-bold text-lg leading-none block ${isOpen ? 'text-white' : 'text-brand-navy'}`}>
                          {p.titulo}
                        </span>
                      </VisualEditable>
                      <VisualEditable id={`quienes.ecosistema.gec.${p.id}.subtitulo`} label={`Pilar ${p.id} - Subtítulo`}>
                        <span className={`font-body text-xs mt-0.5 block ${isOpen ? 'text-brand-green' : 'text-brand-navy/50'}`}>
                          {p.subtitulo}
                        </span>
                      </VisualEditable>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-brand-green' : 'text-brand-navy/30'
                  }`} />
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48' : 'max-h-0'}`}>
                  <div className="px-6 py-5 bg-brand-navy/5 border-t border-brand-navy/10">
                    <VisualEditable id={`quienes.ecosistema.gec.${p.id}.desc`} label={`Pilar ${p.id} - Descripción`}>
                      <p className="font-body text-brand-navy/80 leading-relaxed">{p.desc}</p>
                    </VisualEditable>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slogan GEC */}
        <div className="mt-16 text-center">
          <div className="inline-block border-t-2 border-b-2 border-brand-green py-4 px-8">
            <VisualEditable id="quienes.ecosistema.gec.slogan" label="Ecosistema GEC - Slogan Final">
              <p className="font-display text-2xl md:text-3xl font-bold text-brand-navy">
                {slogan}
              </p>
            </VisualEditable>
          </div>
        </div>
      </div>
    </section>
  );
}
