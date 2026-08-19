import Image from 'next/image';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';
import { VisualEditable } from '@/components/admin/VisualEditable';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  heroImage?: string | null;
  textRight?: boolean;
  titleId?: string;
  subtitleId?: string;
  heroImageId?: string;
  compact?: boolean;
}

export function PageHero({
  title,
  subtitle,
  heroImage,
  textRight = false,
  titleId,
  subtitleId,
  heroImageId,
  compact = false,
}: PageHeroProps) {
  return (
    <section className={`relative w-full ${compact ? 'h-[170px] md:h-[220px]' : 'h-[220px] md:h-[280px]'} bg-[#0D1B24] overflow-hidden flex items-center border-b-4 border-brand-green`}>
      
      {/* Background image on the right side - pointer-events-auto allows editing background hero image */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-[60%] h-full z-0 select-none pointer-events-auto">
        {heroImage ? (
          <VisualEditable
            id={heroImageId || 'hero.imagen'}
            label="Imagen de Hero"
            type="image"
            className="absolute inset-0 w-full h-full pointer-events-auto"
          >
            <Image
              src={heroImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority
            />
          </VisualEditable>
        ) : (
          <div className="w-full h-full bg-[#132B39]" />
        )}
        
        {/* Navy blue overlay/shading */}
        <div className="absolute inset-0 bg-[#0D1B24]/20 mix-blend-multiply md:mix-blend-normal md:bg-gradient-to-r md:from-[#0D1B24] md:via-[#0D1B24]/50 md:to-transparent pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto w-full px-6 relative z-10 pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Overlapping Navy Box containing Title and Subtitle */}
          <div className="col-span-12 md:col-span-6 lg:col-span-5 bg-[#0D1B24]/90 md:bg-[#0D1B24] p-6 md:p-8 rounded-lg shadow-2xl border border-white/5 md:border-r-0 relative pointer-events-auto">
            <AnimatedSection animation="fade-up">
              <VisualEditable id={titleId || 'hero.titulo'} label="Título de Hero">
                <h1 className="font-display text-2xl md:text-3xl lg:text-4xl text-white font-extrabold mb-3 leading-tight">
                  {title}
                </h1>
              </VisualEditable>
            </AnimatedSection>
            
            {/* Green Line closer to the text */}
            <AnimatedLine className="h-[4px] bg-brand-green mb-4 w-[60px]" />
            
            {subtitle && (
              <AnimatedSection animation="fade-up" delay={2}>
                <VisualEditable id={subtitleId || 'hero.sub'} label="Subtítulo de Hero">
                  <p className="font-body text-white/80 text-xs md:text-sm leading-relaxed max-w-md">
                    {subtitle}
                  </p>
                </VisualEditable>
              </AnimatedSection>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}
