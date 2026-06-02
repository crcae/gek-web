'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Globe,
  Flame,
  Leaf,
  Sparkles,
  Crop,
  Box,
  FileText,
  ChevronRight,
  Truck,
  Package,
  Scissors,
  Wrench,
  Settings,
  ShieldAlert
} from 'lucide-react';

type Step1Type = 'cotizacion' | 'exportacion' | 'distribucion' | 'alianza' | 'proveedor' | 'atencion' | 'bolsa';

type LeadFormData = {
  nombre: string;
  empresa: string;
  email: string;
  whatsapp: string;
  comentarios: string;
};

export function LeadPipeline() {
  const t = useTranslations('pipeline');
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState<Step1Type | null>(null);

  // Step 2A - Products selection (Client flow) — stored as IDs
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [advisoryType, setAdvisoryType] = useState<string>('');

  // Step 2B - Supplier type — stored as ID
  const [supplierType, setSupplierType] = useState<string>('');

  // Step 3 - Markets selection — stored as IDs
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);

  // Step 4 - Volume selection — stored as ID
  const [selectedVolume, setSelectedVolume] = useState<string>('');

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>();

  const isClientFlow = tipo && ['cotizacion', 'exportacion', 'distribucion', 'alianza', 'atencion'].includes(tipo);
  const isSupplierFlow = tipo === 'proveedor';
  const isBolsaFlow = tipo === 'bolsa';

  const getActiveSteps = () => {
    if (isSupplierFlow) {
      return [
        { num: 1, label: t('step_necesitas') },
        { num: 2, label: t('step_tipo_proveedor') },
        { num: 5, label: t('step_datos_contacto') }
      ];
    }
    if (isBolsaFlow) {
      return [
        { num: 1, label: t('step_necesitas') },
        { num: 5, label: t('step_datos_contacto') }
      ];
    }
    return [
      { num: 1, label: t('step_necesitas') },
      { num: 2, label: t('step_productos') },
      { num: 3, label: t('step_mercados') },
      { num: 4, label: t('step_volumen') },
      { num: 5, label: t('step_contacto') }
    ];
  };

  const activeSteps = getActiveSteps();

  const getCurrentStepIndex = () => activeSteps.findIndex(s => s.num === step);

  const handleSelectTipo = (val: Step1Type) => setTipo(val);

  const handleProductToggle = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(p => p !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleMarketToggle = (id: string) => {
    if (selectedMarkets.includes(id)) {
      setSelectedMarkets(selectedMarkets.filter(m => m !== id));
    } else {
      setSelectedMarkets([...selectedMarkets, id]);
    }
  };

  const handleNext = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < activeSteps.length - 1) {
      setStep(activeSteps[currentIndex + 1].num);
    }
  };

  const handleBack = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setStep(activeSteps[currentIndex - 1].num);
    }
  };

  const onSubmit = async (data: LeadFormData) => {
    setIsSuccess(false);
    setIsError(false);

    // Build products array: map IDs back to Spanish labels for DB/email readability
    const productLabels: Record<string, string> = {
      chiles: 'Chiles y Especialidades Picantes',
      hortalizas: 'Hortalizas y Vegetales Frescos',
      verduras: 'Verduras de Campo y Especialidad',
      frutas: 'Frutas Frescas',
      campo: 'Productos del Campo',
      secos: 'Productos Secos y Procesados',
      programa: 'Programa Integral / Mixto',
      asesoria: `Asesoría: ${advisoryType}`,
    };

    const productosPayload = isClientFlow
      ? selectedProducts.map(id => productLabels[id] ?? id)
      : [];

    const supplierLabels: Record<string, string> = {
      transporte: 'Transporte', empaque: 'Empaque', agroinsumos: 'Agroinsumos',
      servicios: 'Servicios', maquinaria: 'Maquinaria', otro: 'Otro',
    };
    const marketLabels: Record<string, string> = {
      mexico: 'México', usa: 'Estados Unidos', canada: 'Canadá', otros: 'Otros Países',
      retail: 'Retail', food: 'Food Service', procesamiento: 'Procesamiento', mayorista: 'Distribución mayorista',
    };

    const payload = {
      tipo,
      productos: productosPayload,
      supplierType: isSupplierFlow ? (supplierLabels[supplierType] ?? supplierType) : '',
      mercado: isClientFlow ? selectedMarkets.map(id => marketLabels[id] ?? id) : [],
      volumen: isClientFlow ? selectedVolume : '',
      nombre: data.nombre,
      empresa: data.empresa,
      email: data.email,
      whatsapp: data.whatsapp,
      comentarios: data.comentarios,
    };

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSuccess(true);
        setStep(1);
        setTipo(null);
        setSelectedProducts([]);
        setAdvisoryType('');
        setSupplierType('');
        setSelectedMarkets([]);
        setSelectedVolume('');
        reset();
      } else {
        setIsError(true);
      }
    } catch {
      setIsError(true);
    }
  };

  const canGoNext = () => {
    if (step === 1) return tipo !== null;
    if (step === 2 && isClientFlow) {
      if (selectedProducts.length === 0) return false;
      if (selectedProducts.includes('asesoria') && !advisoryType) return false;
      return true;
    }
    if (step === 2 && isSupplierFlow) return supplierType !== '';
    if (step === 3) return selectedMarkets.length > 0;
    if (step === 4) return selectedVolume !== '';
    return true;
  };

  const showExportAlert = selectedMarkets.some(m => ['canada', 'otros'].includes(m));

  return (
    <section id="contacto-pipeline" className="w-full bg-brand-white py-20 px-4 sm:px-6 relative overflow-hidden">
      <div
        className="absolute left-[-150px] bottom-[-150px] w-[400px] h-[400px] bg-no-repeat bg-contain pointer-events-none opacity-[0.04] z-0"
        style={{ backgroundImage: 'url(/images/isotipo/isotipo-oscuro.png)' }}
      />

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 relative z-10 flex flex-col md:flex-row">

        {/* Left Side: Progress tracker */}
        <div className="w-full md:w-[30%] bg-brand-navy p-8 text-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 shrink-0">
          <div>
            <h3 className="font-display text-2xl font-bold text-brand-white mb-2">{t('titulo')}</h3>
            <p className="font-lora italic text-xs text-white/60 mb-8">&ldquo;{t('subtitulo')}&rdquo;</p>

            <div className="hidden md:flex flex-col gap-6 relative">
              <div className="absolute left-[15px] top-[15px] bottom-[15px] w-[2px] bg-white/10 z-0" />
              {activeSteps.map((s, index) => {
                const isCompleted = getCurrentStepIndex() > index;
                const isActive = step === s.num;
                return (
                  <div key={s.num} className="flex items-center gap-4 relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      isCompleted
                        ? 'bg-brand-green text-white scale-105'
                        : isActive
                        ? 'bg-brand-green/20 text-brand-green border border-brand-green scale-105'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}>
                      {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                    </div>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      isActive ? 'text-brand-green font-bold' : isCompleted ? 'text-white' : 'text-white/40'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mobile Progress Indicator */}
            <div className="flex md:hidden items-center justify-between py-2">
              <span className="text-xs text-white/50">
                {t('paso_de', { current: getCurrentStepIndex() + 1, total: activeSteps.length })}
              </span>
              <span className="text-sm font-bold text-brand-green">{activeSteps[getCurrentStepIndex()]?.label}</span>
            </div>
          </div>

          <div className="hidden md:block pt-8 border-t border-white/10">
            <span className="text-xs text-brand-green font-medium block mb-1">{t('tiempo_estimado')}</span>
            <span className="text-xs text-white/40 font-body block">{t('completado_rt')}</span>
          </div>
        </div>

        {/* Right Side: Step Content Pane */}
        <div className="flex-grow p-8 sm:p-12 min-h-[480px] flex flex-col justify-between">
          <div>
            <div className="transition-all duration-200">

              {isSuccess ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mb-6">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-brand-navy mb-4">{t('exito_titulo')}</h3>
                  <p className="font-body text-brand-navy/70 text-base max-w-md mx-auto mb-8">
                    {t('exito_desc')}
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="bg-brand-green hover:bg-brand-green/90 text-white font-body py-3 px-8 text-sm font-bold rounded-md shadow-md"
                  >
                    {t('btn_nueva_consulta')}
                  </button>
                </div>
              ) : (
                <>
                  {/* Step Title Header */}
                  <div className="mb-8">
                    {step === 1 && (
                      <>
                        <h4 className="text-sm font-medium text-brand-green mb-2">{t('h_paso1_label')}</h4>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-navy">{t('h_paso1_titulo')}</h2>
                        <span className="text-xs text-brand-green font-medium mt-1 inline-block">{t('tiempo_estimado')}</span>
                      </>
                    )}
                    {step === 2 && isClientFlow && (
                      <>
                        <h4 className="text-sm font-medium text-brand-green mb-2">{t('h_paso2c_label')}</h4>
                        <h2 className="font-display text-2xl font-bold text-brand-navy">{t('h_paso2c_titulo')}</h2>
                      </>
                    )}
                    {step === 2 && isSupplierFlow && (
                      <>
                        <h4 className="text-sm font-medium text-brand-green mb-2">{t('h_paso2p_label')}</h4>
                        <h2 className="font-display text-2xl font-bold text-brand-navy">{t('h_paso2p_titulo')}</h2>
                      </>
                    )}
                    {step === 3 && (
                      <>
                        <h4 className="text-sm font-medium text-brand-green mb-2">{t('h_paso3_label')}</h4>
                        <h2 className="font-display text-2xl font-bold text-brand-navy">{t('h_paso3_titulo')}</h2>
                      </>
                    )}
                    {step === 4 && (
                      <>
                        <h4 className="text-sm font-medium text-brand-green mb-2">{t('h_paso4_label')}</h4>
                        <h2 className="font-display text-2xl font-bold text-brand-navy">{t('h_paso4_titulo')}</h2>
                      </>
                    )}
                    {step === 5 && (
                      <>
                        <h4 className="text-sm font-medium text-brand-green mb-2">{t('h_paso5_label')}</h4>
                        <h2 className="font-display text-2xl font-bold text-brand-navy">{t('h_paso5_titulo')}</h2>
                      </>
                    )}
                  </div>

                  {/* STEP 1: Flow selection cards */}
                  {step === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {([
                        { id: 'cotizacion', key: 'tipo_cotizacion' },
                        { id: 'exportacion', key: 'tipo_exportacion' },
                        { id: 'distribucion', key: 'tipo_distribucion' },
                        { id: 'alianza', key: 'tipo_alianza' },
                        { id: 'proveedor', key: 'tipo_proveedor' },
                        { id: 'atencion', key: 'tipo_atencion' },
                        { id: 'bolsa', key: 'tipo_bolsa' }
                      ] as { id: Step1Type; key: string }[]).map((item) => {
                        const isSelected = tipo === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSelectTipo(item.id)}
                            className={`flex items-center justify-between p-4 rounded-lg border-2 text-left transition-all min-h-[56px] ${
                              isSelected
                                ? 'border-brand-green bg-brand-green/5 text-brand-navy'
                                : 'border-gray-200 hover:border-brand-green/30 text-gray-700 bg-white'
                            }`}
                          >
                            <span className="font-body text-sm font-medium">{t(item.key as any)}</span>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-brand-green flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* STEP 2A: Products Client selection */}
                  {step === 2 && isClientFlow && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {[
                          { id: 'chiles', key: 'prod_chiles', icon: Flame },
                          { id: 'hortalizas', key: 'prod_hortalizas', icon: Leaf },
                          { id: 'verduras', key: 'prod_verduras', icon: Sparkles },
                          { id: 'frutas', key: 'prod_frutas', icon: Crop },
                          { id: 'campo', key: 'prod_campo', icon: Box },
                          { id: 'secos', key: 'prod_secos', icon: FileText },
                          { id: 'programa', key: 'prod_programa', icon: Settings },
                          { id: 'asesoria', key: 'prod_asesoria', icon: ChevronRight }
                        ].map((prod) => {
                          const IconComp = prod.icon;
                          const isSelected = selectedProducts.includes(prod.id);
                          return (
                            <button
                              key={prod.id}
                              type="button"
                              onClick={() => handleProductToggle(prod.id)}
                              className={`flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all ${
                                isSelected
                                  ? 'border-brand-green bg-brand-green/5 text-brand-navy'
                                  : 'border-gray-200 hover:border-brand-green/30 text-gray-700 bg-white'
                              }`}
                            >
                              <IconComp className={`w-5 h-5 shrink-0 ${isSelected ? 'text-brand-green' : 'text-gray-400'}`} />
                              <span className="font-body text-xs font-semibold">{t(prod.key as any)}</span>
                            </button>
                          );
                        })}
                      </div>

                      {selectedProducts.includes('asesoria') && (
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <label className="block text-xs font-bold text-brand-navy uppercase mb-2">{t('asesoria_tipo')}</label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'logistica', key: 'asesoria_logistica' },
                              { id: 'empaque', key: 'asesoria_empaque' },
                              { id: 'precios', key: 'asesoria_precios' },
                              { id: 'exportacion', key: 'asesoria_exportacion' },
                            ].map((adv) => (
                              <button
                                key={adv.id}
                                type="button"
                                onClick={() => setAdvisoryType(adv.id)}
                                className={`p-2 text-xs font-medium rounded border ${
                                  advisoryType === adv.id
                                    ? 'bg-brand-green border-brand-green text-white'
                                    : 'bg-white border-gray-200 hover:bg-gray-100 text-gray-700'
                                }`}
                              >
                                {t(adv.key as any)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 2B: Supplier Type selection */}
                  {step === 2 && isSupplierFlow && (
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: 'transporte', key: 'sup_transporte', icon: Truck },
                        { id: 'empaque', key: 'sup_empaque', icon: Package },
                        { id: 'agroinsumos', key: 'sup_agroinsumos', icon: Crop },
                        { id: 'servicios', key: 'sup_servicios', icon: Settings },
                        { id: 'maquinaria', key: 'sup_maquinaria', icon: Wrench },
                        { id: 'otro', key: 'sup_otro', icon: FileText }
                      ].map((item) => {
                        const IconComp = item.icon;
                        const isSelected = supplierType === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSupplierType(item.id)}
                            className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 text-center transition-all ${
                              isSelected
                                ? 'border-brand-green bg-brand-green/5 text-brand-navy'
                                : 'border-gray-200 hover:border-brand-green/30 text-gray-700 bg-white'
                            }`}
                          >
                            <IconComp className={`w-8 h-8 mb-3 ${isSelected ? 'text-brand-green' : 'text-gray-400'}`} />
                            <span className="font-body text-sm font-medium">{t(item.key as any)}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* STEP 3: Market Destination selection */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3">{t('mercado_zonas_label')}</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'mexico', key: 'mercado_mexico' },
                            { id: 'usa', key: 'mercado_usa' },
                            { id: 'canada', key: 'mercado_canada' },
                            { id: 'otros', key: 'mercado_otros' },
                          ].map((mkt) => {
                            const isSelected = selectedMarkets.includes(mkt.id);
                            return (
                              <button
                                key={mkt.id}
                                type="button"
                                onClick={() => handleMarketToggle(mkt.id)}
                                className={`p-4 border-2 rounded-lg text-center font-body text-sm font-semibold transition-all ${
                                  isSelected
                                    ? 'border-brand-green bg-brand-green/5 text-brand-navy'
                                    : 'border-gray-200 hover:border-brand-green/30 text-gray-600'
                                }`}
                              >
                                {t(mkt.key as any)}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3">{t('canal_label')}</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'retail', key: 'canal_retail' },
                            { id: 'food', key: 'canal_food' },
                            { id: 'procesamiento', key: 'canal_procesamiento' },
                            { id: 'mayorista', key: 'canal_mayorista' },
                          ].map((mkt) => {
                            const isSelected = selectedMarkets.includes(mkt.id);
                            return (
                              <button
                                key={mkt.id}
                                type="button"
                                onClick={() => handleMarketToggle(mkt.id)}
                                className={`p-4 border-2 rounded-lg text-center font-body text-sm font-semibold transition-all ${
                                  isSelected
                                    ? 'border-brand-green bg-brand-green/5 text-brand-navy'
                                    : 'border-gray-200 hover:border-brand-green/30 text-gray-600'
                                }`}
                              >
                                {t(mkt.key as any)}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {showExportAlert && (
                        <div className="flex items-center gap-3 p-4 bg-brand-green text-white rounded-lg shadow-md">
                          <Globe className="w-5 h-5 shrink-0" />
                          <span className="font-body text-xs font-semibold">{t('alerta_exportacion')}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 4: Volume selection */}
                  {step === 4 && (
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: 'semanal', key: 'vol_semanal' },
                        { id: 'spot', key: 'vol_spot' },
                        { id: 'mensual', key: 'vol_mensual' },
                        { id: 'contenedor', key: 'vol_contenedor' },
                        { id: 'pallets', key: 'vol_pallets' },
                      ].map((vol) => {
                        const isSelected = selectedVolume === vol.id;
                        return (
                          <button
                            key={vol.id}
                            type="button"
                            onClick={() => setSelectedVolume(vol.id)}
                            className={`p-4 border-2 rounded-lg text-left font-body text-sm font-semibold transition-all ${
                              isSelected
                                ? 'border-brand-green bg-brand-green/5 text-brand-navy'
                                : 'border-gray-200 hover:border-brand-green/30 text-gray-600'
                            }`}
                          >
                            {t(vol.key as any)}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* STEP 5: Contact detail fields */}
                  {step === 5 && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1">
                          <label className="text-xs font-bold text-gray-600 uppercase">{t('campo_nombre')}</label>
                          <input
                            type="text"
                            required
                            className="p-3 border border-gray-300 rounded focus:outline-none focus:border-brand-green bg-gray-50/50 text-sm"
                            placeholder={t('campo_nombre_ph')}
                            {...register('nombre', { required: true })}
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-xs font-bold text-gray-600 uppercase">{t('campo_empresa')}</label>
                          <input
                            type="text"
                            required
                            className="p-3 border border-gray-300 rounded focus:outline-none focus:border-brand-green bg-gray-50/50 text-sm"
                            placeholder={t('campo_empresa_ph')}
                            {...register('empresa', { required: true })}
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-xs font-bold text-gray-600 uppercase">{t('campo_email')}</label>
                          <input
                            type="email"
                            required
                            className="p-3 border border-gray-300 rounded focus:outline-none focus:border-brand-green bg-gray-50/50 text-sm"
                            placeholder="ejemplo@correo.com"
                            {...register('email', { required: true })}
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-xs font-bold text-gray-600 uppercase">{t('campo_whatsapp')}</label>
                          <input
                            type="tel"
                            required
                            className="p-3 border border-gray-300 rounded focus:outline-none focus:border-brand-green bg-gray-50/50 text-sm"
                            placeholder="+52..."
                            {...register('whatsapp', { required: true })}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase">{t('campo_comentarios')}</label>
                        <textarea
                          rows={4}
                          className="p-3 border border-gray-300 rounded focus:outline-none focus:border-brand-green bg-gray-50/50 text-sm resize-none"
                          placeholder={isBolsaFlow ? t('campo_comentarios_bolsa_ph') : t('campo_comentarios_ph')}
                          {...register('comentarios')}
                        />
                      </div>

                      {isError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 border border-red-200 rounded text-sm font-semibold">
                          <ShieldAlert className="w-5 h-5 shrink-0" />
                          <span>{t('error_envio')}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-body py-4 rounded-lg font-bold transition-all shadow-lg shadow-brand-green/10 flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
                      >
                        {isSubmitting ? t('btn_enviando') : t('btn_enviar')}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Bottom navigation buttons */}
          {!isSuccess && step < 5 && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-8">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className="flex items-center gap-1.5 text-gray-500 hover:text-brand-navy font-semibold text-sm disabled:opacity-30 disabled:pointer-events-none transition-colors py-2 px-3 rounded min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('btn_atras')}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext()}
                className="flex items-center gap-1.5 bg-brand-green hover:bg-brand-green/90 text-white font-bold py-2.5 px-6 rounded-md shadow disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 min-h-[44px]"
              >
                <span>{t('btn_siguiente')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
