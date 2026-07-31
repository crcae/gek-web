import { getContenidoCached } from '@/lib/queries/cache';
import { getTranslations } from 'next-intl/server';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { CountUp } from '@/components/ui/CountUp';
import { VisualEditable } from '@/components/admin/VisualEditable';

export async function MetricsSection({ locale }: { locale: string }) {
  const ids = [
    'home.metrica1.numero', 'home.metrica1.label', 'home.metrica1.descripcion',
    'home.metrica2.numero', 'home.metrica2.label', 'home.metrica2.descripcion',
    'home.metrica3.numero', 'home.metrica3.label', 'home.metrica3.descripcion',
    'home.metrica4.numero', 'home.metrica4.label', 'home.metrica4.descripcion'
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

  const m4Num = contenido['home.metrica4.numero'];
  const m4Lab = contenido['home.metrica4.label'];
  const m4Desc = contenido['home.metrica4.descripcion'];

  const parseNum = (val: string | null, fallback: number) => {
    if (!val) return fallback;
    const clean = val.replace(/[^0-9]/g, '');
    const parsed = parseInt(clean, 10);
    return isNaN(parsed) ? fallback : parsed;
  };

  const getPrefix = (val: string | null, defaultPrefix: string) => {
    if (!val) return defaultPrefix;
    return val.startsWith('+') ? '+' : '';
  };

  // Staggered items definition matching exact requested details
  const metrics = [
    {
      numId: 'home.metrica1.numero',
      numVal: parseNum(m1Num, 50),
      numPrefix: getPrefix(m1Num, '+'),
      labId: 'home.metrica1.label',
      label: m1Lab ?? t('anos_label', { defaultMessage: 'Años de experiencia' }),
      descId: 'home.metrica1.descripcion',
      desc: m1Desc ?? 'En producción y comercialización del campo.',
      delay: 1,
    },
    {
      numId: 'home.metrica2.numero',
      numVal: parseNum(m2Num, 30000),
      numPrefix: getPrefix(m2Num, '+'),
      labId: 'home.metrica2.label',
      label: m2Lab ?? t('toneladas_label', { defaultMessage: 'Toneladas exportadas al año' }),
      descId: 'home.metrica2.descripcion',
      desc: m2Desc ?? 'En mercados alrededor del mundo',
      delay: 2,
    },
    {
      numId: 'home.metrica3.numero',
      numVal: parseNum(m3Num, 200),
      numPrefix: getPrefix(m3Num, '+'),
      labId: 'home.metrica3.label',
      label: m3Lab ?? t('colaboradores_label', { defaultMessage: 'Colaboradores' }),
      descId: 'home.metrica3.descripcion',
      desc: m3Desc ?? 'Repartidos en nuestras unidades de negocio.',
      delay: 3,
    },
    {
      numId: 'home.metrica4.numero',
      numVal: parseNum(m4Num, 400),
      numPrefix: getPrefix(m4Num, '+'),
      labId: 'home.metrica4.label',
      label: m4Lab ?? t('hectareas_label', { defaultMessage: 'Hectáreas de superficie' }),
      descId: 'home.metrica4.descripcion',
      desc: m4Desc ?? 'Listas para la producción bajo normativas de inocuidad',
      delay: 4,
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
              <VisualEditable id={metric.numId} label={`Métrica ${idx + 1} - Número`}>
                <span className="font-display text-4xl sm:text-5xl font-bold text-brand-green mb-4 block">
                  <CountUp end={metric.numVal} prefix={metric.numPrefix} separator="," />
                </span>
              </VisualEditable>

              <VisualEditable id={metric.labId} label={`Métrica ${idx + 1} - Etiqueta`}>
                <span className="font-body font-bold text-white text-xl mb-2 block">
                  {metric.label}
                </span>
              </VisualEditable>

              {metric.desc && (
                <VisualEditable id={metric.descId} label={`Métrica ${idx + 1} - Descripción`}>
                  <p className="font-body text-white/75 text-sm font-normal max-w-[280px]">
                    {metric.desc}
                  </p>
                </VisualEditable>
              )}
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
