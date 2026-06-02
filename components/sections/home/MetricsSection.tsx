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

  // Staggered items definition matching exact requested details
  const metrics = [
    {
      component: <CountUp end={50} prefix="+" />,
      label: m1Lab ?? t('anos_label', { defaultMessage: 'Años de experiencia' }),
      desc: m1Desc ?? 'En producción y comercialización del campo.',
      delay: 1, // 0ms (delay mapping: 1 -> 0ms or similar)
    },
    {
      component: <CountUp end={30000} separator="," prefix="+" />,
      label: m2Lab ?? t('toneladas_label', { defaultMessage: 'Toneladas exportadas al año' }),
      desc: m2Desc ?? 'En mercados alrededor del mundo',
      delay: 2, // 200ms
    },
    {
      component: <CountUp end={200} prefix="+" />,
      label: m3Lab ?? t('colaboradores_label', { defaultMessage: 'Colaboradores' }),
      desc: m3Desc ?? 'Repartidos en nuestras unidades de negocio.',
      delay: 3, // 400ms
    },
    {
      component: <CountUp end={400} prefix="+" />,
      label: m4Lab ?? t('hectareas_label', { defaultMessage: 'Hectáreas de superficie' }),
      desc: m4Desc ?? 'Listas para la producción bajo normativas de inocuidad',
      delay: 4, // 600ms
    },
  ];

  return (
    <section className="relative w-full bg-brand-navy py-20 px-6 overflow-hidden">
      {/* Watermark Decoration */}
      <div 
        className="absolute right-0 bottom-0 w-[450px] h-[280px] bg-no-repeat bg-contain bg-right pointer-events-none opacity-[0.08] z-0"
        style={{ backgroundImage: 'url(/images/camiones/truck1.png)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 lg:divide-x lg:divide-brand-green/30 text-center">
          {metrics.map((metric, idx) => (
            <AnimatedSection
              key={idx}
              animation="fade-up"
              delay={metric.delay as 1 | 2 | 3 | 4}
              className="flex flex-col items-center justify-center px-4"
            >
              <span className="font-display text-4xl sm:text-5xl font-bold text-brand-green mb-4">
                {metric.component}
              </span>
              <span className="font-body font-bold text-white text-xl mb-2">
                {metric.label}
              </span>
              {metric.desc && (
                <p className="font-body text-white/75 text-sm font-normal max-w-[280px]">
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
