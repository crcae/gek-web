'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';

type ContactFormData = {
  nombre: string;
  email: string;
  razonContacto: string;
  mensaje: string;
};

// Shared input classes — 16px font prevents iOS auto-zoom, min-h-[44px] for touch targets
const inputClass = (hasError: boolean) =>
  `p-3 min-h-[44px] text-base border rounded-sm focus:outline-none focus:ring-1 focus:ring-brand-green bg-brand-white/50 ${
    hasError ? 'border-red-500' : 'border-brand-gray/50'
  }`;

export function ContactFormSection() {
  const t = useTranslations('Contact');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSuccess(false);
    setIsError(false);

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        reset();
      } else {
        setIsError(true);
      }
    } catch {
      setIsError(true);
    }
  };

  return (
    <section className="w-full bg-brand-white py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 md:p-12 shadow-sm border-t-4 border-brand-green rounded-md">
        <div className="text-center mb-10">
          <AnimatedSection animation="fade-up">
            <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
              {t('title')}
            </h2>
          </AnimatedSection>
          <AnimatedLine className="h-[2px] bg-brand-green mx-auto" />
        </div>

        {isSuccess ? (
          <div className="bg-brand-green/10 border border-brand-green text-brand-navy p-6 rounded-md text-center font-body">
            <h3 className="font-bold text-lg mb-2 text-brand-green">¡Gracias!</h3>
            <p>{t('success')}</p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-6 text-brand-green underline hover:text-brand-navy transition-colors text-sm min-h-[44px] px-4"
            >
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <AnimatedSection animation="fade-in" delay={2}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 font-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="nombre" className="text-brand-navy font-medium text-sm">
                    {t('nameLabel')} *
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    placeholder={t('namePlaceholder')}
                    className={inputClass(!!errors.nombre)}
                    {...register('nombre', { required: true })}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="email" className="text-brand-navy font-medium text-sm">
                    {t('emailLabel')} *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    className={inputClass(!!errors.email)}
                    {...register('email', {
                      required: true,
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    })}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="razonContacto" className="text-brand-navy font-medium text-sm">
                  {t('reasonLabel')} *
                </label>
                <select
                  id="razonContacto"
                  className={`${inputClass(!!errors.razonContacto)} cursor-pointer`}
                  {...register('razonContacto', { required: true })}
                >
                  <option value="">-- Selecciona --</option>
                  <option value="proveedor">{t('reasons.proveedor')}</option>
                  <option value="cliente">{t('reasons.cliente')}</option>
                  <option value="alianza">{t('reasons.alianza')}</option>
                  <option value="otro">{t('reasons.otro')}</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="mensaje" className="text-brand-navy font-medium text-sm">
                  {t('messageLabel')} *
                </label>
                <textarea
                  id="mensaje"
                  rows={5}
                  placeholder={t('messagePlaceholder')}
                  className={`${inputClass(!!errors.mensaje)} resize-none`}
                  {...register('mensaje', { required: true })}
                />
              </div>

              {isError && (
                <p className="text-red-500 text-sm">Hubo un error al enviar tu mensaje. Intenta de nuevo.</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full bg-brand-green text-white font-medium py-4 px-6 min-h-[44px] hover:bg-opacity-90 transition-all rounded-sm disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>{isSubmitting ? t('sending') : t('submit')}</span>
              </button>
            </form>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
