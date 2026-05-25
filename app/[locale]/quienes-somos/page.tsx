import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/shared/PageHero';
import { ValoresGrid } from '@/components/sections/about/ValoresGrid';
import { CarruselCampo } from '@/components/sections/about/CarruselCampo';
import { CarruselCedis } from '@/components/sections/about/CarruselCedis';
import { Warehouse } from 'lucide-react';
import Image from 'next/image';
import { getContenidoCached } from '@/lib/queries/cache';
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
    'quienes.divisiones.titulo',
    'quienes.divisiones.subtitulo',
    'quienes.division.campo',
    'quienes.division.sedis',
    ...idsValores.map(id => `quienes.valor.${id}`)
  ], locale);

  const intro = contenido['quienes.intro'];
  const mision = contenido['quienes.mision'];
  const vision = contenido['quienes.vision'];
  const divisionesTitulo = contenido['quienes.divisiones.titulo'];
  const divisionesSubtitulo = contenido['quienes.divisiones.subtitulo'];
  const divisionCampoDesc = contenido['quienes.division.campo'];
  const divisionSedisDesc = contenido['quienes.division.sedis'];

  const valoresDesc = idsValores.map(id => contenido[`quienes.valor.${id}`]);

  // Leer fotos de Zacatecas
  let fotosZacatecas: string[] = [];
  try {
    const carpetaZacatecas = path.join(process.cwd(), 'public/images/zacatecas');
    if (fs.existsSync(carpetaZacatecas)) {
      fotosZacatecas = fs.readdirSync(carpetaZacatecas)
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .sort()
        .slice(0, 10)
        .map(f => `/images/zacatecas/${f}`);
    }
  } catch (err) {
    console.error('Error reading zacatecas folder:', err);
  }

  // Leer fotos de Sedis
  let fotosSedis: string[] = [];
  try {
    const carpetaSedis = path.join(process.cwd(), 'public/images/sedis');
    if (fs.existsSync(carpetaSedis)) {
      fotosSedis = fs.readdirSync(carpetaSedis)
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .sort()
        .slice(0, 10)
        .map(f => `/images/sedis/${f}`);
    }
  } catch (err) {
    console.error('Error reading sedis folder:', err);
  }

  const primeraFotoZacatecas = fotosZacatecas[0] ?? null;
  const primeraFotoSedis = fotosSedis[0] ?? null;

  const hasPrimus = fs.existsSync(path.join(process.cwd(), 'public/images/logos/PrimusGFS_Logo_web.png'))
    || fs.existsSync(path.join(process.cwd(), 'public/images/logos/primus-cert.png'));
  const primusPath = fs.existsSync(path.join(process.cwd(), 'public/images/logos/PrimusGFS_Logo_web.png'))
    ? '/images/logos/PrimusGFS_Logo_web.png'
    : '/images/logos/primus-cert.png';

  return (
    <div className="flex flex-col min-h-screen">
      <PageHero title={t('titulo_pagina')} subtitle={t('subtitulo_pagina')} />

      {/* CAMBIO 1 — Intro: 2 columnas texto+imagen, negritas con dangerouslySetInnerHTML */}
      <section className="w-full bg-brand-white py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-[55%]">
            <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
              Grupo Exportador del Campo
            </h2>
            <div className="w-[60px] h-[3px] bg-brand-green mb-6" />
            <p
              className="rich-text font-body text-brand-navy/80 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: intro || t('intro_titulo') }}
            />
          </div>
          <div className="w-full md:w-[45%]">
            {primeraFotoZacatecas ? (
              <div className="overflow-hidden shadow-md" style={{ borderRadius: 12 }}>
                <Image
                  src={primeraFotoZacatecas}
                  alt="Campo Zacatecas"
                  width={800}
                  height={533}
                  className="w-full h-full object-cover"
                  quality={80}
                />
              </div>
            ) : (
              <div className="aspect-video bg-brand-gray/10 rounded-xl flex items-center justify-center">
                <Warehouse className="w-12 h-12 text-brand-navy/20" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CAMBIO 2 — Carrusel 1: Del campo al empaque */}
      <CarruselCampo
        images={fotosZacatecas}
        title="Del campo al empaque"
        subtitle="Nuestros procesos en Loreto, Zacatecas"
      />

      {/* CAMBIO 2 — Carrusel 2: Del CEDIS al cliente */}
      <CarruselCedis
        images={fotosSedis}
        title="Del CEDIS al cliente"
        subtitle="Nuestros procesos en San Nicolás de los Garza, NL"
      />

      {/* CAMBIO 3 — Logo Primus GFS: sección independiente */}
      {hasPrimus && (
        <section className="w-full bg-white py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
            <span className="font-body text-sm text-brand-navy/50 uppercase tracking-widest">
              Certificación de calidad
            </span>
            <Image
              src={primusPath}
              alt="Primus GFS Certification"
              width={180}
              height={75}
              style={{ objectFit: 'contain' }}
            />
            <span className="font-body text-sm text-brand-navy/60 text-center">
              Certificación internacional de inocuidad alimentaria
            </span>
          </div>
        </section>
      )}

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

      {/* CAMBIOS 4 & 5 — Título + Cards de divisiones estilo Logmex */}
      <section className="w-full bg-white py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Título de sección */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl md:text-5xl text-brand-navy font-bold leading-tight mb-6">
              {divisionesTitulo ? (
                <span dangerouslySetInnerHTML={{ __html: divisionesTitulo }} />
              ) : (
                <>
                  Nuestras <span className="text-brand-green">divisiones</span>
                </>
              )}
            </h2>
            <p className="font-body text-lg text-brand-navy/70">
              {divisionesSubtitulo || 'Operamos desde el campo hasta el cliente final con control total de la cadena de valor.'}
            </p>
          </div>

          {/* Cards estilo Logmex */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card División Campo */}
            <div
              className="overflow-hidden"
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(44,62,75,0.10)',
              }}
            >
              <div className="relative w-full h-[240px] overflow-hidden">
                {primeraFotoZacatecas ? (
                  <Image
                    src={primeraFotoZacatecas}
                    alt="División Campo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-gray/20 flex items-center justify-center">
                    <Warehouse className="w-10 h-10 text-brand-navy/20" />
                  </div>
                )}
              </div>
              <div className="p-8 bg-white">
                <h3 className="font-display text-2xl font-bold text-brand-navy mb-4">
                  División Campo
                </h3>
                <p className="font-body text-sm text-brand-navy/80 leading-relaxed">
                  {divisionCampoDesc || 'Producción, tratamiento y empaque de productos del campo en Loreto, Zacatecas.'}
                </p>
              </div>
            </div>

            {/* Card División Sedis */}
            <div
              className="overflow-hidden"
              style={{
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(44,62,75,0.10)',
              }}
            >
              <div className="relative w-full h-[240px] overflow-hidden">
                {primeraFotoSedis ? (
                  <Image
                    src={primeraFotoSedis}
                    alt="División Sedis"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: 'rgba(44,62,75,0.08)' }}
                  >
                    <Warehouse className="w-14 h-14" style={{ color: 'rgba(44,62,75,0.15)' }} />
                  </div>
                )}
              </div>
              <div className="p-8 bg-white">
                <h3 className="font-display text-2xl font-bold text-brand-navy mb-4">
                  División Sedis
                </h3>
                <p className="font-body text-sm text-brand-navy/80 leading-relaxed">
                  {divisionSedisDesc || 'Centro de distribución y comercialización en San Nicolás de los Garza, NL.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
