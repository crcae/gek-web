import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/shared/PageHero';
import { ProcesosField } from '@/components/sections/about/ProcesosField';
import { EcosistemaGEC } from '@/components/sections/about/EcosistemaGEC';
import { EcosisteGEC } from '@/components/sections/about/EcosisteGEC';
import { CedisProcesos } from '@/components/sections/about/CedisProcesos';
import { CapitalHumano } from '@/components/sections/about/CapitalHumano';
import { User, Truck } from 'lucide-react';
import Image from 'next/image';
import { getContenidoCached } from '@/lib/queries/cache';
import { existsSync } from 'fs';
import { join } from 'path';
import fs from 'fs';
import path from 'path';

export default async function QuienesSomos({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('quienes');

  const idsValores = ['honestidad', 'compromiso', 'humildad', 'profesionalismo', 'lealtad', 'transparencia'];

  const contenido = await getContenidoCached([
    'quienes.intro',
    'quienes.mision',
    'quienes.vision',
    'quienes.divisiones.titulo',
    'quienes.divisiones.subtitulo',
    'quienes.division.campo',
    'quienes.division.sedis',
    // imágenes gestionadas desde admin
    'quienes.hero.imagen',
    'quienes.franja.imagen',
    'quienes.ceo.imagen',
    'quienes.ecosistema.mision.imagen',
    'quienes.ecosistema.vision.imagen',
    'quienes.ecosistema.valores.imagen',
    'quienes.cedis.ficha1.imagen',
    'quienes.cedis.ficha2.imagen',
    'quienes.cedis.ficha3.imagen',
    'quienes.cedis.ficha4.imagen',
    'quienes.division.campo.imagen',
    'quienes.division.sedis.imagen',
    ...idsValores.map(id => `quienes.valor.${id}`)
  ], locale);

  const intro = contenido['quienes.intro'];
  const mision = contenido['quienes.mision'] || t('mision_titulo');
  const vision = contenido['quienes.vision'] || t('vision_titulo');
  const divisionesTitulo = contenido['quienes.divisiones.titulo'];
  const divisionesSubtitulo = contenido['quienes.divisiones.subtitulo'];
  const divisionCampoDesc = contenido['quienes.division.campo'];
  const divisionSedisDesc = contenido['quienes.division.sedis'];

  // Imágenes desde admin (Vercel Blob URL o vacío)
  const imgFranja    = contenido['quienes.franja.imagen'] || null;
  const imgCeo       = contenido['quienes.ceo.imagen'] || null;
  const imgHero      = contenido['quienes.hero.imagen'] || null;
  const ecoImagenes = {
    'quienes.ecosistema.mision.imagen': contenido['quienes.ecosistema.mision.imagen'] || '',
    'quienes.ecosistema.vision.imagen': contenido['quienes.ecosistema.vision.imagen'] || '',
    'quienes.ecosistema.valores.imagen': contenido['quienes.ecosistema.valores.imagen'] || '',
  };
  const cedisImagenes: [string, string, string, string] = [
    contenido['quienes.cedis.ficha1.imagen'] || '',
    contenido['quienes.cedis.ficha2.imagen'] || '',
    contenido['quienes.cedis.ficha3.imagen'] || '',
    contenido['quienes.cedis.ficha4.imagen'] || '',
  ];
  const imgDivCampo  = contenido['quienes.division.campo.imagen'] || null;
  const imgDivSedis  = contenido['quienes.division.sedis.imagen'] || null;

  // Fotos
  const readImages = (folder: string): string[] => {
    try {
      const p = path.join(process.cwd(), 'public/images', folder);
      if (!fs.existsSync(p)) return [];
      return fs.readdirSync(p)
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .sort()
        .map(f => `/images/${folder}/${f}`);
    } catch { return []; }
  };

  const fotosZacatecas = readImages('zacatecas').slice(0, 10);
  const fotosSedis = readImages('sedis').slice(0, 10);
  const primeraFotoZacatecas = fotosZacatecas[0] ?? null;
  const primeraFotoSedis = fotosSedis[0] ?? null;

  // CEO — DB primero, filesystem como fallback
  const ceoLocalPath = join(process.cwd(), 'public/images/quienes/ceo.jpg');
  const ceoSrc = imgCeo || (existsSync(ceoLocalPath) ? '/images/quienes/ceo.jpg' : null);

  // Franja hero — DB primero, filesystem como fallback
  const franjaLocalPath = join(process.cwd(), 'public/images/quienes/franja-inicio.jpg');
  const franjaImage = imgHero || imgFranja || (existsSync(franjaLocalPath) ? '/images/quienes/franja-inicio.jpg' : null);

  // Camión decorativo
  const truckPath = join(process.cwd(), 'public/images/camiones/truck1.png');
  const truckExists = existsSync(truckPath);

  // Primus logo
  const primusLogoPath = [
    '/images/logos/PrimusGFS_Logo_web.png',
    '/images/logos/primus-cert.png',
  ].find(p => existsSync(join(process.cwd(), 'public', p)));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <PageHero
        title={t('titulo_pagina')}
        subtitle={t('subtitulo_pagina')}
        heroImage={franjaImage}
      />

      {/* ── 1. Intro — texto + card CEO ── */}
      <section className="w-full bg-brand-white py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start">
          {/* Columna izquierda — texto */}
          <div className="w-full md:w-[55%]">
            <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
              Grupo Exportador del Campo
            </h2>
            <div className="w-[60px] h-[3px] bg-brand-green mb-6" />
            <p
              className="rich-text font-body text-brand-navy/80 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: intro || t('intro_titulo') }}
            />
            <div className="mt-8 pt-6 border-t border-brand-green/20">
              <p className="font-display text-2xl md:text-3xl text-brand-green font-semibold tracking-wide">
                {t('slogan')} <span className="text-brand-navy">GEC</span>
              </p>
            </div>
          </div>

          {/* Columna derecha — card CEO */}
          <div className="w-full md:w-[45%] relative md:-mb-20 md:mt-6">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative h-72 md:h-96">
                {ceoSrc ? (
                  <Image
                    src={ceoSrc}
                    alt="Joaquín Vizcaíno — Director General"
                    fill
                    className="object-cover object-top"
                    style={{
                      maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-brand-navy/40 flex items-center justify-center">
                    <User className="w-16 h-16 text-brand-green/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-navy" />
              </div>
              <div className="bg-brand-navy px-6 py-5">
                <p className="text-brand-green text-xs font-medium uppercase tracking-widest mb-2">
                  {t('ceo_eyebrow')}
                </p>
                <h3 className="font-display text-white text-2xl font-bold leading-tight mb-3">
                  &ldquo;{t('ceo_frase')}&rdquo;
                </h3>
                <p className="text-white/70 text-sm font-body leading-relaxed">
                  {t('ceo_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Ecosistema de Pensamiento — Misión / Visión / Valores ── */}
      <EcosisteGEC imagenes={ecoImagenes} />

      {/* ── 3. Fichas interactivas — Procesos Campo ── */}
      <ProcesosField />

      {/* ── 4. Capital Humano ── */}
      <CapitalHumano locale={locale} />

      {/* ── 5. Procesos CEDIS ── */}
      <CedisProcesos imagenes={cedisImagenes} />

      {/* ── 6. Primus GFS badge ── */}
      {primusLogoPath && (
        <section className="w-full bg-white py-10 px-4 sm:px-6 border-y border-brand-gray/20">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-6 justify-center">
            <Image
              src={primusLogoPath}
              alt="Primus GFS Certification"
              width={160}
              height={65}
              style={{ objectFit: 'contain' }}
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green block mb-0.5">
                {t('primus_eyebrow')}
              </span>
              <p className="font-display text-lg font-bold text-brand-navy">{t('primus_titulo')}</p>
              <p className="font-body text-sm text-brand-navy/60">{t('primus_desc')}</p>
            </div>
          </div>
        </section>
      )}

      {/* ── 7. Ecosistema GEC — Paneles expansibles ── */}
      <EcosistemaGEC />

      {/* ── 8. Divisiones — con camión decorativo ── */}
      <section className="w-full bg-[#F8FAF9] py-16 md:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div
          className="absolute right-[-20px] bottom-0 w-[300px] h-[180px] bg-no-repeat bg-contain bg-right-bottom pointer-events-none opacity-[0.06]"
          style={{ backgroundImage: 'url(/images/camiones/truck2.png)' }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-green block mb-3">
              {t('div_eyebrow')}
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-brand-navy font-bold leading-tight mb-6">
              {divisionesTitulo ? (
                <span dangerouslySetInnerHTML={{ __html: divisionesTitulo }} />
              ) : (
                <>{t('div_titulo_fallback').split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="text-brand-green">{t('div_titulo_fallback').split(' ').slice(-1)}</span>
                </>
              )}
            </h2>
            <p className="font-body text-lg text-brand-navy/70">
              {divisionesSubtitulo || t('div_sub_fallback')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* División Campo */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-brand-gray/10">
              <div className="relative w-full h-[260px]">
                {(imgDivCampo || primeraFotoZacatecas) ? (
                  <Image
                    src={imgDivCampo || primeraFotoZacatecas!}
                    alt="División Campo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                    unoptimized={!!imgDivCampo}
                  />
                ) : (
                  <div className="w-full h-full bg-brand-green/10 flex items-center justify-center">
                    <Truck className="w-12 h-12 text-brand-green/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
                <span className="absolute bottom-4 left-5 font-display text-white font-bold text-xl">
                  {t('div_campo_label')}
                </span>
              </div>
              <div className="p-7 bg-white">
                <div className="w-8 h-[2px] bg-brand-green mb-4" />
                <p className="font-body text-sm text-brand-navy/80 leading-relaxed">
                  {divisionCampoDesc || t('div_campo_desc_fallback')}
                </p>
              </div>
            </div>

            {/* División Sedis */}
            <div className="rounded-2xl overflow-hidden shadow-md border border-brand-gray/10">
              <div className="relative w-full h-[260px]">
                {(imgDivSedis || primeraFotoSedis) ? (
                  <Image
                    src={imgDivSedis || primeraFotoSedis!}
                    alt="División Sedis"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                    unoptimized={!!imgDivSedis}
                  />
                ) : (
                  <div className="w-full h-full bg-brand-navy/10 flex items-center justify-center">
                    <Truck className="w-12 h-12 text-brand-navy/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
                <span className="absolute bottom-4 left-5 font-display text-white font-bold text-xl">
                  {t('div_sedis_label')}
                </span>
              </div>
              <div className="p-7 bg-white">
                <div className="w-8 h-[2px] bg-brand-green mb-4" />
                <p className="font-body text-sm text-brand-navy/80 leading-relaxed">
                  {divisionSedisDesc || t('div_sedis_desc_fallback')}
                </p>
              </div>
            </div>
          </div>

          {/* Camión decorativo grande */}
          {truckExists && (
            <div className="mt-12 flex justify-center overflow-hidden">
              <Image
                src="/images/camiones/truck1.png"
                alt="Flota Grupo Exportador del Campo"
                width={800}
                height={320}
                className="object-contain w-full max-w-3xl opacity-85 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
