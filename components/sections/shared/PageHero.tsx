import Image from 'next/image';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  heroImage?: string | null;
  textRight?: boolean;
}

export function PageHero({ title, subtitle, heroImage, textRight = false }: PageHeroProps) {
  return (
    <section className="relative w-full h-[200px] md:h-[260px] bg-[#0D1B24] border-b-4 border-brand-green overflow-hidden">
      {/* Background Watermark */}
      <div
        className="absolute right-[-40px] top-[-40px] w-[200px] h-[200px] bg-no-repeat bg-contain pointer-events-none opacity-[0.03] z-0"
        style={{ backgroundImage: 'url(/images/isotipo/isotipo-claro.png)' }}
      />

      <div className="max-w-7xl mx-auto w-full h-full px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Text Column */}
        <div className={`flex flex-col justify-center h-full py-4 ${textRight ? 'md:order-2' : 'md:order-1'}`}>
          <AnimatedSection animation="fade-up">
            <h1 className="font-display text-2xl md:text-4xl text-white font-bold mb-2">
              {title}
            </h1>
          </AnimatedSection>
          <AnimatedLine className="h-[2px] bg-brand-green mb-3 w-[60px]" />
          {subtitle && (
            <AnimatedSection animation="fade-up" delay={2}>
              <p className="font-body text-white/80 text-xs md:text-sm max-w-xl">
                {subtitle}
              </p>
            </AnimatedSection>
          )}
        </div>

        {/* Image Column */}
        <div className={`relative h-[80%] w-full hidden md:flex items-center justify-center ${textRight ? 'md:order-1' : 'md:order-2'}`}>
          {heroImage ? (
            <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/10 shadow-lg bg-[#132B39]">
              <Image
                src={heroImage}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          ) : (
            <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/5 bg-white/5 flex items-center justify-center">
              <span className="text-white/20 text-xs font-body">No image uploaded</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
