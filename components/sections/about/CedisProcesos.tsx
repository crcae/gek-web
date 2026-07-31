'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { ShieldCheck, Package, ClipboardList, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

import { VisualEditable } from '@/components/admin/VisualEditable';
import { AdminImageButton } from '@/components/admin/AdminImageButton';

interface StepItem {
  titulo: string;
  desc: string;
}

interface Props {
  imagenes?: [string, string, string, string];
  titulo?: string;
  subtitulo?: string;
  tituloId?: string;
  subtituloId?: string;
  stepData?: StepItem[];
}

export function CedisProcesos({
  imagenes = ['', '', '', ''],
  titulo,
  subtitulo,
  tituloId = 'quienes.cedis.titulo',
  subtituloId = 'quienes.cedis.subtitulo',
  stepData,
}: Props) {
  const t = useTranslations('quienes');
  const { data: session } = useSession();
  const isAdmin = !!session;
  const [currentStep, setCurrentStep] = useState(0);

  const defaultFichas = [
    {
      titulo: t('cedis1_titulo'),
      desc: t('cedis1_desc'),
      Icono: ShieldCheck,
      bg: 'bg-[#0D2233]',
    },
    {
      titulo: t('cedis2_titulo'),
      desc: t('cedis2_desc'),
      Icono: Package,
      bg: 'bg-[#1A3A52]',
    },
    {
      titulo: t('cedis3_titulo'),
      desc: t('cedis3_desc'),
      Icono: ClipboardList,
      bg: 'bg-[#1E4A6A]',
    },
    {
      titulo: t('cedis4_titulo'),
      desc: t('cedis4_desc'),
      Icono: Truck,
      bg: 'bg-brand-navy',
    },
  ];

  const fichas = defaultFichas.map((ficha, idx) => {
    if (stepData && stepData[idx]) {
      return {
        ...ficha,
        titulo: stepData[idx].titulo || ficha.titulo,
        desc: stepData[idx].desc || ficha.desc,
      };
    }
    return ficha;
  });

  const next = () => setCurrentStep((prev) => (prev + 1) % fichas.length);
  const prev = () => setCurrentStep((prev) => (prev - 1 + fichas.length) % fichas.length);

  const activeFicha = fichas[currentStep];
  const activeImg = imagenes[currentStep] || '';
  const ActiveIcon = activeFicha.Icono;

  return (
    <section id="division-cedis" className="w-full bg-brand-navy py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Header and Details (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col justify-center text-white">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
            {t('cedis_eyebrow')}
          </span>
          <VisualEditable id={tituloId} label="Título Procesos CEDIS">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              {titulo || t('cedis_titulo')}
            </h2>
          </VisualEditable>
          <div className="w-[60px] h-[3px] bg-brand-green mb-6" />
          <VisualEditable id={subtituloId} label="Descripción Procesos CEDIS">
            <p className="font-body text-white/80 text-sm md:text-base leading-relaxed">
              {subtitulo || t('cedis_sub')}
            </p>
          </VisualEditable>
        </div>

        {/* Right Side: Interactive Step Card (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Injecting modern transition keyframes */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes modernStepSlideCedis {
              0% { opacity: 0; transform: translateY(8px) scale(0.99); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            .animate-modern-step-cedis {
              animation: modernStepSlideCedis 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}} />

          {/* Step Tabs/Indicators */}
          <div className="flex justify-between items-center gap-1.5 mb-5 bg-white/5 p-1.5 rounded-xl border border-white/10">
            {fichas.map((f, i) => {
              const Icon = f.Icono;
              const isSelected = i === currentStep;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`flex-1 flex flex-col md:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-lg font-display text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-brand-green text-brand-navy shadow scale-102' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden md:inline">Paso {i + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Step Content (Vertical Card) - Shortened height */}
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl border border-brand-gray/10 flex flex-col items-center">
            
            {/* Top: Image container (Shorter height) */}
            <div className="relative w-full h-48 md:h-[210px] bg-brand-navy overflow-hidden">
              <div key={currentStep} className="relative w-full h-full animate-modern-step-cedis">
                {activeImg ? (
                  <>
                    <Image
                      src={activeImg}
                      alt={activeFicha.titulo}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 600px"
                      unoptimized
                    />
                    {/* Cambiar Imagen Button — solo admin */}
                    {isAdmin && (
                      <div className="absolute top-3 right-3 z-30">
                        <AdminImageButton
                          id={`quienes.cedis.ficha${currentStep + 1}.imagen`}
                          label={`Imagen de Paso ${currentStep + 1}`}
                          buttonText="Cambiar Imagen"
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-brand-navy/95 text-white/50">
                    <ActiveIcon className="w-12 h-12 text-brand-green/70 animate-pulse" />
                    <p className="font-body text-xs text-white/40">
                      {t('cedis_proxi')}
                    </p>
                    {/* Subir Imagen Button — solo admin */}
                    {isAdmin && (
                      <div className="absolute top-3 right-3 z-30">
                        <AdminImageButton
                          id={`quienes.cedis.ficha${currentStep + 1}.imagen`}
                          label={`Imagen de Paso ${currentStep + 1}`}
                          buttonText="Subir Imagen"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Step number badge */}
              <div className="absolute top-3 left-3 bg-brand-navy/90 backdrop-blur-sm text-brand-green font-display text-[9px] font-extrabold px-2.5 py-1 rounded-md shadow-md border-l-2 border-brand-green tracking-wide z-20">
                PASO {currentStep + 1} DE {fichas.length}
              </div>
            </div>

            {/* Bottom: Text details (Shorter padding) */}
            <div key={`desc-${currentStep}`} className="w-full p-5 md:p-6.5 flex flex-col items-start bg-white animate-modern-step-cedis">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8.5 h-8.5 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green shadow-sm">
                  <ActiveIcon className="w-4 h-4" />
                </div>
                <VisualEditable id={`quienes.cedis.paso${currentStep + 1}.titulo`} label={`Paso ${currentStep + 1} - Título`}>
                  <h3 className="font-display text-base md:text-lg font-bold text-brand-navy">
                    {activeFicha.titulo}
                  </h3>
                </VisualEditable>
              </div>
              
              <VisualEditable id={`quienes.cedis.paso${currentStep + 1}.desc`} label={`Paso ${currentStep + 1} - Descripción`}>
                <p className="font-body text-brand-navy/80 text-xs md:text-sm leading-relaxed">
                  {activeFicha.desc}
                </p>
              </VisualEditable>
            </div>

            {/* Next/Prev Navigation Buttons */}
            <button
              onClick={prev}
              className="absolute left-3 top-[96px] md:top-[105px] -translate-y-1/2 bg-black/45 hover:bg-brand-green hover:text-brand-navy text-white p-2 rounded-full transition-all backdrop-blur-sm z-20 shadow-md hover:scale-105 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-[96px] md:top-[105px] -translate-y-1/2 bg-black/45 hover:bg-brand-green hover:text-brand-navy text-white p-2 rounded-full transition-all backdrop-blur-sm z-20 shadow-md hover:scale-105 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
