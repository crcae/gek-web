import { getContenidoCached } from '@/lib/queries/cache';
import { getTranslations } from 'next-intl/server';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { CountUp } from '@/components/ui/CountUp';

export async function MetricsSection({ locale }: { locale: string }) {
  const ids = [
    'home.metrica1.label', 'home.metrica1.descripcion',
    'home.metrica2.label', 'home.metrica2.descripcion',
    'home.metrica3.label', 'home.metrica3.descripcion',
    'home.metrica4.label', 'home.metrica4.descripcion'
  ];

  const [contenido, t] = await Promise.all([
    getContenidoCached(ids, locale),
    getTranslations('metricas'),
  ]);

  const m1Lab = contenido['home.metrica1.label'];
  const m1Desc = contenido['home.metrica1.descripcion'];
  const m2Lab = contenido['home.metrica2.label'];
  const m2Desc = contenido['home.metrica2.descripcion'];
  const m3Lab = contenido['home.metrica3.label'];
  const m3Desc = contenido['home.metrica3.descripcion'];
  const m4Lab = contenido['home.metrica4.label'];
  const m4Desc = contenido['home.metrica4.descripcion'];

  const metrics = [
    { component: <CountUp end={30000} separator="," />, label: m1Lab ?? t('toneladas_label', { defaultMessage: 'Toneladas exportadas al año' }), desc: m1Desc ?? t('toneladas_desc', { defaultMessage: '' }) },
    { component: <CountUp end={200} prefix="+" />, label: m2Lab ?? t('colaboradores_label', { defaultMessage: 'Colaboradores' }), desc: m2Desc ?? t('colaboradores_desc', { defaultMessage: '' }) },
    { component: <CountUp end={50} prefix="+" />, label: m3Lab ?? t('anos_label', { defaultMessage: 'Años de experiencia' }), desc: m3Desc ?? t('anos_desc', { defaultMessage: '' }) },
    { component: <CountUp end={400} />, label: m4Lab ?? t('hectareas_label', { defaultMessage: 'Hectáreas de superficie para producción' }), desc: m4Desc ?? t('hectareas_desc', { defaultMessage: '' }) },
  ];

  return (
    <section className="w-full bg-brand-navy py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-0 md:divide-x md:divide-brand-green/30 text-center">
          {metrics.map((metric, idx) => (
            <AnimatedSection
              key={idx}
              animation="fade-up"
              delay={(idx + 1) as 1 | 2 | 3 | 4}
              className="flex flex-col items-center justify-center px-4"
            >
              <span className="font-display text-4xl sm:text-5xl font-bold text-brand-green mb-4">
                {metric.component}
              </span>
              <span className="font-body font-bold text-white text-base sm:text-lg mb-2">
                {metric.label}
              </span>
              {metric.desc && (
                <p className="font-body text-white/70 text-sm max-w-[280px]">
                  {metric.desc}
                </p>
              )}
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
