import { getContenidoCached } from '@/lib/queries/cache';
import { getTranslations } from 'next-intl/server';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export async function MetricsSection({ locale }: { locale: string }) {
  const ids = [
    'home.metrica1.numero', 'home.metrica1.label', 'home.metrica1.descripcion',
    'home.metrica2.numero', 'home.metrica2.label', 'home.metrica2.descripcion',
    'home.metrica3.numero', 'home.metrica3.label', 'home.metrica3.descripcion'
  ];

  const [contenido, t] = await Promise.all([
    getContenidoCached(ids, locale),
    getTranslations('metricas'),
  ]);

  const m1Num = contenido['home.metrica1.numero'];
  const m1Lab = contenido['home.metrica1.label'];
  const m1Desc = contenido['home.metrica1.descripcion'];
  const m2Num = contenido['home.metrica2.numero'];
  const m2Lab = contenido['home.metrica2.label'];
  const m2Desc = contenido['home.metrica2.descripcion'];
  const m3Num = contenido['home.metrica3.numero'];
  const m3Lab = contenido['home.metrica3.label'];
  const m3Desc = contenido['home.metrica3.descripcion'];

  const metrics = [
    { num: m1Num ?? '+50', label: m1Lab ?? t('anos_label'), desc: m1Desc ?? t('anos_desc') },
    { num: m2Num ?? '25,000', label: m2Lab ?? t('toneladas_label'), desc: m2Desc ?? t('toneladas_desc') },
    { num: m3Num ?? '+120', label: m3Lab ?? t('colaboradores_label'), desc: m3Desc ?? t('colaboradores_desc') },
  ];

  return (
    <section className="w-full bg-brand-navy py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0 md:divide-x md:divide-brand-green/30 text-center">
          {metrics.map((metric, idx) => (
            <AnimatedSection
              key={idx}
              animation="fade-up"
              delay={(idx + 1) as 1 | 2 | 3}
              className="flex flex-col items-center justify-center px-4"
            >
              <span className="font-display text-5xl font-bold text-brand-green mb-4">
                {metric.num}
              </span>
              <span className="font-body font-bold text-white text-lg mb-2">
                {metric.label}
              </span>
              <p className="font-body text-white/70 text-sm max-w-[280px]">
                {metric.desc}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
