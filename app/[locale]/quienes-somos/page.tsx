import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/shared/PageHero';
import { ValoresGrid } from '@/components/sections/about/ValoresGrid';
import { SupplyChainCarousel } from '@/components/sections/about/SupplyChainCarousel';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { getContenidoCached } from '@/lib/queries/cache';
import { prisma } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export default async function QuienesSomos({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('quienes');

  const idsValores = ['honestidad', 'compromiso', 'humildad', 'profesionalismo', 'lealtad', 'transparencia'];
  
  const contenido = await getContenidoCached([
    'quienes.intro',
    'quienes.mision',
    'quienes.vision',
    'quienes.cadena.titulo',
    'quienes.cadena.subtitulo',
    ...idsValores.map(id => `quienes.valor.${id}`)
  ], locale);

  const intro = contenido['quienes.intro'];
  const mision = contenido['quienes.mision'];
  const vision = contenido['quienes.vision'];
  const cadenaTitulo = contenido['quienes.cadena.titulo'];
  const cadenaSubtitulo = contenido['quienes.cadena.subtitulo'];
  
  const valoresDesc = idsValores.map(id => contenido[`quienes.valor.${id}`]);

  // Leer fotos de Zacatecas del filesystem
  let fotosZacatecas: string[] = [];
  try {
    const carpetaZacatecas = path.join(process.cwd(), 'public/images/zacatecas');
    if (fs.existsSync(carpetaZacatecas)) {
      fotosZacatecas = fs.readdirSync(carpetaZacatecas)
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .map(f => `/images/zacatecas/${f}`);
    }
  } catch (err) {
    console.error('Error reading zacatecas folder:', err);
  }

  const carouselImages = fotosZacatecas.slice(0, 8);
  const hasPrimus = fs.existsSync(path.join(process.cwd(), 'public/images/logos/PrimusGFS_Logo_web.png'));

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero title={t('titulo_pagina')} subtitle={t('subtitulo_pagina')} />

      {/* Intro — foto debajo del texto en mobile */}
      <section className="w-full bg-brand-white py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
              Grupo Exportador del Campo
            </h2>
            <div className="w-[60px] h-[3px] bg-brand-green mb-6" />
            <p className="font-body text-brand-navy/80 text-lg leading-relaxed">
              {intro || t('intro_titulo')}
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <div className="aspect-video rounded-sm overflow-hidden border border-brand-gray/20 shadow-sm">
              <Image 
                src="/images/zacatecas/_DSC3562.jpg" 
                alt="Campo Zacatecas" 
                width={800}
                height={450}
                className="w-full h-full object-cover"
                quality={75}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Carrusel Cadena de Suministro */}
      <SupplyChainCarousel 
        images={carouselImages}
        title={cadenaTitulo || t('cadena_titulo')}
        subtitle={cadenaSubtitulo || t('cadena_subtitulo')}
        hasPrimus={hasPrimus}
      />

      {/* Misión & Visión */}
      <section className="w-full bg-white py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-brand-white p-8 md:p-10 rounded-sm border-t-[3px] border-brand-green shadow-sm">
            <h3 className="font-display text-2xl font-bold text-brand-navy mb-4">
              {t('mision_titulo')}
            </h3>
            <p className="font-body text-brand-navy/80 leading-relaxed text-lg">
              {mision || t('mision_titulo')}
            </p>
          </div>
          <div className="bg-brand-white p-8 md:p-10 rounded-sm border-t-[3px] border-brand-green shadow-sm">
            <h3 className="font-display text-2xl font-bold text-brand-navy mb-4">
              {t('vision_titulo')}
            </h3>
            <p className="font-body text-brand-navy/80 leading-relaxed text-lg">
              {vision || t('vision_titulo')}
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <ValoresGrid dbValores={valoresDesc.map((v, i) => ({ id: idsValores[i], desc: v }))} />

      {/* Divisiones — 1 col en mobile, 2 en md */}
      <section className="w-full bg-brand-navy py-16 md:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-1/2 md:border-r md:border-brand-white/10 md:pr-12">
            <h3 className="font-display text-2xl font-bold text-brand-green mb-4">
              {t('division_campo_titulo')}
            </h3>
            <p className="font-body text-brand-white/80 leading-relaxed text-lg">
              {t('division_campo_titulo')}
            </p>
          </div>
          <div className="w-full md:w-1/2 md:pl-4">
            <h3 className="font-display text-2xl font-bold text-brand-green mb-4">
              {t('division_sedis_titulo')}
            </h3>
            <p className="font-body text-brand-white/80 leading-relaxed text-lg mb-6">
              {t('division_sedis_titulo')}
            </p>
            <div className="w-full h-32 bg-brand-white/5 rounded-sm flex items-center justify-center border border-brand-white/10 border-dashed">
              <span className="font-body text-brand-white/40 text-sm">...</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
