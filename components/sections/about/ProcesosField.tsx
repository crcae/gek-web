'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sprout, Thermometer, Package, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import Image from 'next/image';

import { VisualEditable } from '@/components/admin/VisualEditable';

interface StepItem {
  titulo: string;
  desc: string;
  subprocesos: string[];
}

interface Props {
  imagenes?: string[];
  titulo?: string;
  subtitulo?: string;
  tituloId?: string;
  subtituloId?: string;
  stepData?: StepItem[];
}

export function ProcesosField({
  imagenes = [],
  titulo,
  subtitulo,
  tituloId = 'quienes.campo.titulo',
  subtituloId = 'quienes.campo.subtitulo',
  stepData,
}: Props) {
  const t = useTranslations('quienes');
  const [currentStep, setCurrentStep] = useState(0);

  const defaultSteps = [
    {
      id: 'siembra',
      icon: Sprout,
      titulo: t('proc_siembra_titulo'),
      desc: t('proc_siembra_desc'),
      subprocesos: [t('proc_siembra_sub1'), t('proc_siembra_sub2'), t('proc_siembra_sub3'), t('proc_siembra_sub4')],
    },
    {
      id: 'cosecha',
      icon: Sprout,
      titulo: t('proc_cosecha_titulo'),
      desc: t('proc_cosecha_desc'),
      subprocesos: [t('proc_cosecha_sub1'), t('proc_cosecha_sub2'), t('proc_cosecha_sub3'), t('proc_cosecha_sub4')],
    },
    {
      id: 'enfriamiento',
      icon: Thermometer,
      titulo: t('proc_enfrio_titulo'),
      desc: t('proc_enfrio_desc'),
      subprocesos: [t('proc_enfrio_sub1'), t('proc_enfrio_sub2'), t('proc_enfrio_sub3'), t('proc_enfrio_sub4')],
    },
    {
      id: 'empaque',
      icon: Package,
      titulo: t('proc_empaque_titulo'),
      desc: t('proc_empaque_desc'),
      subprocesos: [t('proc_empaque_sub1'), t('proc_empaque_sub2'), t('proc_empaque_sub3'), t('proc_empaque_sub4')],
    },
  ];

  const PROCESOS = defaultSteps.map((step, idx) => {
    if (stepData && stepData[idx]) {
      return {
        ...step,
        titulo: stepData[idx].titulo || step.titulo,
        desc: stepData[idx].desc || step.desc,
        subprocesos: stepData[idx].subprocesos && stepData[idx].subprocesos.length > 0
          ? stepData[idx].subprocesos.map((s, sIdx) => s || step.subprocesos[sIdx])
          : step.subprocesos,
      };
    }
    return step;
  });

  const next = () => setCurrentStep((prev) => (prev + 1) % PROCESOS.length);
  const prev = () => setCurrentStep((prev) => (prev - 1 + PROCESOS.length) % PROCESOS.length);

  const activeFicha = PROCESOS[currentStep];
  const activeImg = imagenes[currentStep] || '';
  const ActiveIcon = activeFicha.icon;

  return (
    <section id="division-campo" className="w-full bg-brand-navy py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Interactive Step Card (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Injecting modern transition keyframes */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes modernStepSlide {
              0% { opacity: 0; transform: translateY(8px) scale(0.99); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            .animate-modern-step {
              animation: modernStepSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}} />

          {/* Step Tabs/Indicators */}
          <div className="flex justify-between items-center gap-1.5 mb-5 bg-white/5 p-1.5 rounded-xl border border-white/10">
            {PROCESOS.map((f, i) => {
              const Icon = f.icon;
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
              <div key={currentStep} className="relative w-full h-full animate-modern-step">
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
                    {/* Cambiar Imagen Button */}
                    <div className="absolute top-3 right-3 z-30">
                      <VisualEditable id={`quienes.campo.paso${currentStep + 1}.imagen`} label={`Imagen de Paso ${currentStep + 1}`} type="image">
                        <button
                          type="button"
                          className="bg-brand-navy/90 hover:bg-brand-green text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-brand-green/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          Cambiar Imagen
                        </button>
                      </VisualEditable>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-brand-navy/95 text-white/50">
                    <ActiveIcon className="w-12 h-12 text-brand-green/70 animate-pulse" />
                    <p className="font-body text-xs text-white/40">
                      Próximamente imágenes del proceso
                    </p>
                    {/* Upload Image Button */}
                    <div className="absolute top-3 right-3 z-30">
                      <VisualEditable id={`quienes.campo.paso${currentStep + 1}.imagen`} label={`Imagen de Paso ${currentStep + 1}`} type="image">
                        <button
                          type="button"
                          className="bg-brand-navy/90 hover:bg-brand-green text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-brand-green/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          Subir Imagen
                        </button>
                      </VisualEditable>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Step number badge */}
              <div className="absolute top-3 left-3 bg-brand-navy/90 backdrop-blur-sm text-brand-green font-display text-[9px] font-extrabold px-2.5 py-1 rounded-md shadow-md border-l-2 border-brand-green tracking-wide z-20">
                PASO {currentStep + 1} DE {PROCESOS.length}
              </div>
            </div>

            {/* Bottom: Text details (Shorter padding) */}
            <div key={`desc-${currentStep}`} className="w-full p-5 md:p-6.5 flex flex-col items-start bg-white animate-modern-step">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8.5 h-8.5 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green shadow-sm">
                  <ActiveIcon className="w-4 h-4" />
                </div>
                <VisualEditable id={`quienes.campo.paso${currentStep + 1}.titulo`} label={`Paso ${currentStep + 1} - Título`}>
                  <h3 className="font-display text-base md:text-lg font-bold text-brand-navy">
                    {activeFicha.titulo}
                  </h3>
                </VisualEditable>
              </div>
              
              <VisualEditable id={`quienes.campo.paso${currentStep + 1}.desc`} label={`Paso ${currentStep + 1} - Descripción`}>
                <p className="font-body text-brand-navy/80 text-xs md:text-sm leading-relaxed mb-3.5">
                  {activeFicha.desc}
                </p>
              </VisualEditable>

              {/* Subprocesses bullet points */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full border-t border-brand-gray/10 pt-3">
                {activeFicha.subprocesos.map((sub, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2 text-brand-navy/70 text-[11px] md:text-xs font-body">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0 shadow-sm" />
                    <VisualEditable id={`quienes.campo.paso${currentStep + 1}.sub${sIdx + 1}`} label={`Paso ${currentStep + 1} - Subproceso ${sIdx + 1}`}>
                      <span>{sub}</span>
                    </VisualEditable>
                  </div>
                ))}
              </div>
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

        {/* Right Side: Header and Details (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green mb-3 block">
            {t('proc_eyebrow')}
          </span>
          <VisualEditable id={tituloId} label="Título Procesos Campo">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
              {titulo || t('proc_titulo')}
            </h2>
          </VisualEditable>
          <div className="w-[60px] h-[3px] bg-brand-green mb-6" />
          <VisualEditable id={subtituloId} label="Descripción Procesos Campo">
            <p className="font-body text-white/80 text-sm md:text-base leading-relaxed">
              {subtitulo || t('proc_sub')}
            </p>
          </VisualEditable>
        </div>

      </div>
    </section>
  );
}
