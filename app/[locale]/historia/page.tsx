import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/shared/PageHero';
import { Timeline } from '@/components/sections/history/Timeline';
import { GaleriaGrid } from '@/components/sections/history/GaleriaGrid';
import { MapaZacatecas } from '@/components/sections/history/MapaZacatecas';
import Image from 'next/image';
import { getContenidoCached } from '@/lib/queries/cache';
import fs from 'fs';
import path from 'path';

export default async function Historia({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('historia');

  const contenido = await getContenidoCached([
    'historia.fundadores.texto'
  ], locale);

  const fundadoresTexto = contenido['historia.fundadores.texto'];

  // Fotos de Zacatecas
  let fotosZacatecas: string[] = [];
  try {
    const carpetaZacatecas = path.join(process.cwd(), 'public/images/zacatecas');
    if (fs.existsSync(carpetaZacatecas)) {
      fotosZacatecas = fs.readdirSync(carpetaZacatecas)
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .map(f => `/images/zacatecas/${f}`);
    }
  } catch {}

  // Fotos de Fundadores
  let fotosFundadores: string[] = [];
  try {
    const carpetaFundadores = path.join(process.cwd(), 'public/images/fundadores');
    if (fs.existsSync(carpetaFundadores)) {
      fotosFundadores = fs.readdirSync(carpetaFundadores)
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .map(f => `/images/fundadores/${f}`);
    }
  } catch {}

  const galeriaImages = fotosZacatecas.slice(0, 12);
  const fundadoresImg = fotosFundadores[0] || '/images/zacatecas/_DSC3592.jpg';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero — texto abajo-izquierda */}
      <PageHero
        title={t('titulo_pagina')}
        subtitle={t('subtitulo_pagina')}
        align="bottom-left"
      />

      {/* Nacidos en Zacatecas — texto izquierda + mapa animado derecha */}
      <section className="w-full bg-brand-white py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16 items-center">
          {/* Texto */}
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-green block mb-3">
              {t('origen_titulo')}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t('nacidos_titulo')}
            </h2>
            <div className="w-[60px] h-[3px] bg-brand-green mb-6" />
            <p className="font-body text-brand-navy/80 text-lg leading-relaxed">
              {t('nacidos_texto')}
            </p>
          </div>

          {/* Mapa animado */}
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <MapaZacatecas />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="w-full bg-[#F8FAF9] py-16 md:py-20 px-4 sm:px-6 border-t border-brand-gray/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {t('timeline_titulo')}
            </h2>
            <div className="w-[60px] h-[3px] bg-brand-green mx-auto" />
          </div>
          <Timeline />
        </div>
      </section>

      {/* Fundadores */}
      <section className="w-full bg-brand-navy py-16 md:py-20 px-4 sm:px-6 border-y-4 border-brand-green">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-brand-white mb-4">
            {t('fundadores_titulo')}
          </h2>
          <p className="font-body text-brand-white/70 mb-12 md:mb-16 max-w-xl mx-auto">
            {fundadoresTexto || t('fundadores_fallback')}
          </p>

          <div className="flex flex-col items-center">
            <div className="w-full max-w-3xl mb-8 flex justify-center">
              <Image
                src={fundadoresImg}
                alt="Fundadores"
                width={800}
                height={500}
                className="max-w-full h-auto rounded-sm border-2 border-brand-green shadow-lg"
                quality={80}
              />
            </div>
            <div className="flex flex-col items-center text-center">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-white mb-2">
                Sr. Ramiro Vizcaíno y Sra. Ceferina Vizcaíno
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Galería */}
      {galeriaImages.length > 0 && (
        <section className="w-full bg-brand-white py-16 md:py-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center mb-12 text-center">
              <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
                {t('galeria_titulo')}
              </h2>
              <div className="w-[60px] h-[3px] bg-brand-green" />
            </div>
            <GaleriaGrid images={galeriaImages} />
          </div>
        </section>
      )}
    </div>
  );
}
