import { useTranslations } from 'next-intl';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

interface Noticia {
  id: string;
  linkedinEmbedUrl: string;
}

export function NewsSection({ noticias }: { noticias: Noticia[], locale: string }) {
  const t = useTranslations('News');

  const hasNews = noticias && noticias.length > 0;

  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <AnimatedSection animation="fade-up">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4 text-center">
              {t('title')}
            </h2>
          </AnimatedSection>
          <AnimatedLine className="h-[2px] bg-brand-green" />
        </div>

        {hasNews ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {noticias.map((noticia, idx) => (
              <AnimatedSection
                key={noticia.id}
                animation="fade-up"
                delay={(idx + 1) as 1 | 2 | 3}
              >
                <div className="card-hover relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 flex flex-col h-full pt-4">
                  {/* Badge LinkedIn */}
                  <div className="absolute top-0 right-0 bg-[#0A66C2] text-white px-3 py-1 text-xs font-bold rounded-bl-lg z-10 flex items-center gap-1">
                    <LinkedinIcon className="w-3 h-3" />
                    LinkedIn
                  </div>

                  {/* Iframe */}
                  <div className="w-full flex-grow relative bg-gray-50 flex justify-center">
                    <iframe
                      src={noticia.linkedinEmbedUrl}
                      height="450"
                      width="100%"
                      frameBorder="0"
                      allowFullScreen={true}
                      title="LinkedIn Embed"
                      className="border-none w-full min-h-[450px] rounded-lg"
                    />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection animation="fade-in" delay={2}>
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border border-gray-100 max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 bg-[#0A66C2]/10 text-[#0A66C2] rounded-full flex items-center justify-center mb-6">
                <LinkedinIcon className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-brand-navy mb-3">
                Conecta con nosotros en LinkedIn
              </h3>
              <p className="font-body text-gray-600 mb-8 max-w-lg mx-auto">
                Próximamente compartiremos noticias y actualizaciones desde nuestra página corporativa oficial de LinkedIn.
              </p>
              <a
                href="https://www.linkedin.com/company/grupo-exportador-del-campo/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0A66C2] text-white px-6 py-3 rounded-md font-medium hover:bg-[#084e96] transition-colors shadow-sm"
              >
                <LinkedinIcon className="w-5 h-5" />
                Seguirnos en LinkedIn →
              </a>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
