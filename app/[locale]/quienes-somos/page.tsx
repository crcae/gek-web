import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/shared/PageHero';
import { ValoresGrid } from '@/components/sections/about/ValoresGrid';
import { ProcesosField } from '@/components/sections/about/ProcesosField';
import { EcosistemaGEC } from '@/components/sections/about/EcosistemaGEC';
import { CapitalHumano } from '@/components/sections/about/CapitalHumano';
import { Truck } from 'lucide-react';
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

  // Fotos campo y CEDIS
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

  const primusLogoPath = [
    '/images/logos/PrimusGFS_Logo_web.png',
    '/images/logos/primus-cert.png',
  ].find(p => fs.existsSync(path.join(process.cwd(), 'public', p)));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <PageHero title={t('titulo_pagina')} subtitle={t('subtitulo_pagina')} align="bottom-left" />

      {/* ── 1. Intro — texto + foto ── */}
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
            {/* Slogan debajo del párrafo */}
            <div className="mt-8 border-l-4 border-brand-green pl-4">
              <p className="font-display text-xl font-bold text-brand-navy">
                {t('slogan')} <span className="text-brand-green">GEC</span>
              </p>
            </div>
          </div>
          <div className="w-full md:w-[45%]">
            {primeraFotoZacatecas ? (
              <div className="overflow-hidden rounded-xl shadow-md">
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
              <div className="aspect-video bg-brand-green/10 rounded-xl flex items-center justify-center border border-brand-green/20">
                <Truck className="w-12 h-12 text-brand-green/30" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 2. Misión & Visión ── */}
      <section className="w-full bg-white py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-brand-white p-8 md:p-10 rounded-xl border-t-[3px] border-brand-green shadow-sm">
            <h3 className="font-display text-2xl font-bold text-brand-navy mb-4">{t('mision_titulo')}</h3>
            <p className="font-body text-brand-navy/80 leading-relaxed text-lg">
              {mision || t('mision_titulo')}
            </p>
          </div>
          <div className="bg-brand-white p-8 md:p-10 rounded-xl border-t-[3px] border-brand-green shadow-sm">
            <h3 className="font-display text-2xl font-bold text-brand-navy mb-4">{t('vision_titulo')}</h3>
            <p className="font-body text-brand-navy/80 leading-relaxed text-lg">
              {vision || t('vision_titulo')}
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. Valores ── */}
      <ValoresGrid dbValores={valoresDesc.map((v, i) => ({ id: idsValores[i], desc: v }))} />

      {/* ── 4. Fichas interactivas — Procesos Campo ── */}
      <ProcesosField />

      {/* ── 5. Capital Humano ── */}
      <CapitalHumano />

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
        {/* Camión decorativo */}
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
                {primeraFotoZacatecas ? (
                  <Image
                    src={primeraFotoZacatecas}
                    alt="División Campo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
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
                {primeraFotoSedis ? (
                  <Image
                    src={primeraFotoSedis}
                    alt="División Sedis"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
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
        </div>
      </section>
    </div>
  );
}
