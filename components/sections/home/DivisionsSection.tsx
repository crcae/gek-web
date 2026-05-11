import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export function DivisionsSection() {
  const t = useTranslations('Divisions');

  const divisions = [
    { id: 'hortalizas', animation: 'slide-left' as const },
    { id: 'chiles', animation: 'fade-up' as const },
    { id: 'servicios', animation: 'slide-right' as const },
  ];

  return (
    <section className="w-full bg-brand-navy py-16 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {divisions.map((div, index) => (
            <AnimatedSection
              key={div.id}
              animation={div.animation}
              delay={(index + 1) as 1 | 2 | 3}
              className={`flex flex-col items-center text-center p-8 ${
                index !== divisions.length - 1
                  ? 'border-b border-brand-white/10 lg:border-b-0 lg:border-r lg:border-brand-white/10'
                  : ''
              }`}
            >
              <div className="w-24 h-24 rounded-full bg-brand-white/10 flex items-center justify-center mb-6 border border-brand-green/30">
                <span className="font-display text-brand-green text-3xl font-bold">
                  {div.id.charAt(0).toUpperCase()}
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-brand-white mb-4">
                {t(`${div.id}.title` as any)}
              </h3>
              <p className="font-body text-brand-white/70">
                {t(`${div.id}.description` as any)}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
