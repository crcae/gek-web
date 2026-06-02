'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Sprout, Thermometer, Package, ChevronDown } from 'lucide-react';

export function ProcesosField() {
  const t = useTranslations('quienes');
  const [openId, setOpenId] = useState<string | null>(null);

  const PROCESOS = [
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

  return (
    <section className="w-full bg-brand-navy py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-green block mb-3">
            {t('proc_eyebrow')}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t('proc_titulo')}
          </h2>
          <div className="w-[60px] h-[3px] bg-brand-green mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PROCESOS.map((p) => {
            const Icon = p.icon;
            const isOpen = openId === p.id;
            return (
              <div
                key={p.id}
                className={`rounded-xl border transition-all duration-300 cursor-pointer flex flex-col ${
                  isOpen
                    ? 'border-brand-green bg-brand-green/10'
                    : 'border-white/10 bg-white/5 hover:border-brand-green/40'
                }`}
                onClick={() => setOpenId(isOpen ? null : p.id)}
              >
                <div className="p-6 flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isOpen ? 'bg-brand-green' : 'bg-white/10'
                  }`}>
                    <Icon className={`w-6 h-6 ${isOpen ? 'text-white' : 'text-brand-green'}`} />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white">{p.titulo}</h3>
                  <p className="font-body text-white/60 text-sm leading-relaxed">{p.desc}</p>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-64' : 'max-h-0'}`}>
                  <div className="px-6 pb-6 border-t border-brand-green/20 pt-4 space-y-2">
                    {p.subprocesos.map((s) => (
                      <div key={s} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" />
                        <span className="font-body text-xs text-white/80">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 pb-4 mt-auto flex items-center gap-1 text-brand-green text-xs font-bold">
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  <span>{isOpen ? t('proc_ocultar') : t('proc_ver')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
