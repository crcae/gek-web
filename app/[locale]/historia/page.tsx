import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/shared/PageHero';
import { Timeline } from '@/components/sections/history/Timeline';
import { GaleriaGrid } from '@/components/sections/history/GaleriaGrid';
import { getContenido } from '@/lib/contenido';
import { prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export default async function Historia({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('History');

  const [origenTitulo, origenTexto, fundadoresTexto] = await Promise.all([
    getContenido('historia.origen.titulo', locale),
    getContenido('historia.origen.texto', locale),
    getContenido('historia.fundadores.texto', locale),
  ]);

  const [dbZacatecasImages, dbFundadoresImages] = await Promise.all([
    prisma.imagenSitio.findMany({
      where: { seccion: 'zacatecas' },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.imagenSitio.findMany({
      where: { seccion: 'fundadores' },
      orderBy: { createdAt: 'desc' },
    })
  ]);

  const zacatecasImages = dbZacatecasImages
    .filter(img => fs.existsSync(path.join(process.cwd(), 'public', img.url)))
    .map(img => img.url);

  const MAX_GALERIA = 12;
  const galeriaImages = zacatecasImages.slice(0, MAX_GALERIA);

  const fundadoresImg = dbFundadoresImages
    .filter(img => fs.existsSync(path.join(process.cwd(), 'public', img.url)))
    .map(img => img.url)[0] || "/images/zacatecas/_DSC3592.jpg";

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero title={t('title')} subtitle={t('subtitle')} />

      {/* Origen — foto debajo en mobile */}
      <section className="w-full bg-brand-white py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
              {origenTitulo ?? 'El Origen'}
            </h2>
            <div className="w-[60px] h-[3px] bg-brand-green mb-6" />
            <p className="font-body text-brand-navy/80 text-lg leading-relaxed">
              {origenTexto ?? t('origen')}
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="aspect-video bg-white rounded-sm flex flex-col items-center justify-center border border-brand-gray/20 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-brand-navy/5" />
              <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center shadow-lg relative z-10">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
              <p className="font-display text-brand-navy font-bold mt-4 relative z-10">Loreto, Zacatecas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="w-full bg-white py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <Timeline />
        </div>
      </section>

      {/* Fundadores — 1 col mobile, 2 col md */}
      <section className="w-full bg-brand-navy py-16 md:py-20 px-4 sm:px-6 border-y-4 border-brand-green">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-brand-white mb-4">
            {t('fundadoresTitle')}
          </h2>
          <p className="font-body text-brand-white/70 mb-12 md:mb-16 max-w-xl mx-auto">
            {fundadoresTexto ?? t('fundadoresDesc')}
          </p>

          <div className="flex flex-col items-center">
            <div className="w-full max-w-3xl mb-8 flex justify-center">
              <img src={fundadoresImg} alt="Fundadores de la Empresa" className="max-w-full h-auto rounded-sm border-2 border-brand-green shadow-lg" />
            </div>
            
            <div className="flex flex-col items-center text-center">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-white mb-2">
                Sr. Ramiro Vizcaíno y Sra. Ceferina Vizcaíno
              </h3>
              <div className="flex items-center gap-2">
                <span className="font-body text-brand-green font-medium text-lg">
                  {t('fundador')}
                </span>
                <span className="text-brand-white/30">&amp;</span>
                <span className="font-body text-brand-green font-medium text-lg">
                  {t('fundadora')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galería */}
      <section className="w-full bg-brand-white py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
              {t('galeriaTitle')}
            </h2>
            <div className="w-[60px] h-[3px] bg-brand-green" />
          </div>

          <GaleriaGrid images={galeriaImages} />
        </div>
      </section>
    </div>
  );
}
