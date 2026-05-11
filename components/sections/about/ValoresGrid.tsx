'use client';

import { useTranslations } from 'next-intl';
import { Target, CheckCircle2, HeartHandshake, Briefcase, ShieldCheck, FileCheck } from 'lucide-react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';

export function ValoresGrid({ dbValores }: { dbValores?: { id: string, desc: string | null }[] }) {
  const t = useTranslations('About');

  const valores = [
    { id: 'honestidad', icon: Target },
    { id: 'compromiso', icon: CheckCircle2 },
    { id: 'humildad', icon: HeartHandshake },
    { id: 'profesionalismo', icon: Briefcase },
    { id: 'lealtad', icon: ShieldCheck },
    { id: 'transparencia', icon: FileCheck },
  ];

  return (
    <section className="w-full bg-brand-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t('valoresTitle')}
            </h2>
          </AnimatedSection>
          <AnimatedLine className="h-[3px] bg-brand-green" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {valores.map((valor, idx) => {
            const Icon = valor.icon;
            const dbVal = dbValores?.find(v => v.id === valor.id);
            const delay = ((idx % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;

            return (
              <AnimatedSection key={valor.id} animation="fade-up" delay={delay}>
                <div className="card-hover bg-white p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow border-t-4 border-transparent hover:border-brand-green group h-full">
                  <div className="mb-6 w-12 h-12 bg-brand-navy/5 text-brand-navy rounded-full flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-brand-navy mb-3">
                    {t(`valores.${valor.id}.title` as any)}
                  </h3>
                  <p className="font-body text-brand-navy/70 leading-relaxed">
                    {dbVal?.desc || t(`valores.${valor.id}.desc` as any)}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
