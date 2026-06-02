import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  /** 'center' (default) centers content | 'bottom-left' pins it to bottom-left */
  align?: 'center' | 'bottom-left';
}

export function PageHero({ title, subtitle, align = 'center' }: PageHeroProps) {
  const isBottomLeft = align === 'bottom-left';

  return (
    <section className="relative w-full h-[30vh] md:h-[40vh] min-h-[220px] overflow-hidden bg-brand-navy border-b-4 border-brand-green">
      {/* Isotipo watermark — intentional, subtle */}
      <div
        className="absolute right-[-80px] top-[-80px] w-[300px] h-[300px] bg-no-repeat bg-contain pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: 'url(/images/isotipo/isotipo-claro.png)' }}
      />

      <div className={`max-w-7xl mx-auto w-full h-full px-6 relative z-10 flex flex-col ${
        isBottomLeft ? 'justify-end pb-8 md:pb-12' : 'justify-center pt-12 md:pt-16'
      }`}>
        <AnimatedSection animation="fade-up">
          <h1 className="font-display text-3xl md:text-5xl text-brand-white font-bold mb-4">
            {title}
          </h1>
        </AnimatedSection>
        <AnimatedLine className="h-[3px] bg-brand-green mb-4" />
        {subtitle && (
          <AnimatedSection animation="fade-up" delay={2}>
            <p className={`font-body text-brand-white/80 text-base md:text-xl ${isBottomLeft ? 'max-w-lg' : 'max-w-2xl'}`}>
              {subtitle}
            </p>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
