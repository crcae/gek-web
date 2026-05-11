import { getContenido } from '@/lib/contenido';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export async function MetricsSection({ locale }: { locale: string }) {
  const [
    m1Num, m1Lab, m1Desc,
    m2Num, m2Lab, m2Desc,
    m3Num, m3Lab, m3Desc
  ] = await Promise.all([
    getContenido('home.metrica1.numero', locale),
    getContenido('home.metrica1.label', locale),
    getContenido('home.metrica1.descripcion', locale),
    getContenido('home.metrica2.numero', locale),
    getContenido('home.metrica2.label', locale),
    getContenido('home.metrica2.descripcion', locale),
    getContenido('home.metrica3.numero', locale),
    getContenido('home.metrica3.label', locale),
    getContenido('home.metrica3.descripcion', locale),
  ]);

  const metrics = [
    { num: m1Num ?? '+50', label: m1Lab ?? 'Años de experiencia', desc: m1Desc ?? 'Produciendo y exportando desde Zacatecas' },
    { num: m2Num ?? '25,000', label: m2Lab ?? 'Toneladas exportadas', desc: m2Desc ?? 'En mercados de México y Estados Unidos' },
    { num: m3Num ?? '+120', label: m3Lab ?? 'Colaboradores', desc: m3Desc ?? 'En nuestras unidades de negocio' },
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
