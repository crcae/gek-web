import Image from 'next/image';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';

interface PageHeroProps {
  title: string;
  subtitle?: string;
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="relative w-full h-[30vh] md:h-[40vh] min-h-[220px] overflow-hidden bg-brand-navy flex flex-col justify-center px-6 border-b-4 border-brand-green">
      {/* Decorative Logo */}
      <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
        <Image
          src="/images/logos/GrupoExportador_Logo2.png"
          alt=""
          width={80}
          height={80}
          className="object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 pt-12 md:pt-16">
        <AnimatedSection animation="fade-up">
          <h1 className="font-display text-3xl md:text-5xl text-brand-white font-bold mb-4">
            {title}
          </h1>
        </AnimatedSection>
        <AnimatedLine className="h-[3px] bg-brand-green mb-4" />
        {subtitle && (
          <AnimatedSection animation="fade-up" delay={2}>
            <p className="font-body text-brand-white/80 text-base md:text-xl max-w-2xl">
              {subtitle}
            </p>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
