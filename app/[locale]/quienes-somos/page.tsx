import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { PageHero } from '@/components/sections/shared/PageHero';
import { ProcesosField } from '@/components/sections/about/ProcesosField';
import { EcosistemaGEC } from '@/components/sections/about/EcosistemaGEC';
import { EcosisteGEC } from '@/components/sections/about/EcosisteGEC';
import { CedisProcesos } from '@/components/sections/about/CedisProcesos';
import { CapitalHumano } from '@/components/sections/about/CapitalHumano';
import { User } from 'lucide-react';
import Image from 'next/image';
import { VisualEditable } from '@/components/admin/VisualEditable';
import { AdminImageButton } from '@/components/admin/AdminImageButton';
import { getContenidoCached } from '@/lib/queries/cache';
import { existsSync } from 'fs';
import { join } from 'path';
import fs from 'fs';
import path from 'path';

export default async function QuienesSomos({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('quienes');
  const session = await getServerSession(authOptions);
  const isAdmin = !!session;

  const idsValores = ['honestidad', 'compromiso', 'humildad', 'profesionalismo', 'lealtad', 'transparencia'];

  const contenido = await getContenidoCached([
    'quienes.hero.titulo',
    'quienes.hero.sub',
    'quienes.intro',
    'quienes.intro.titulo',
    'quienes.intro.slogan',
    'quienes.mision',
    'quienes.vision',
    
    'quienes.esencia.eyebrow',
    'quienes.esencia.titulo',
    'quienes.esencia.subtitulo',
    
    'quienes.ecosistema.mision.titulo',
    'quienes.ecosistema.vision.titulo',
    'quienes.ecosistema.valores.titulo',
    'quienes.ecosistema.filosofia.label',

    'quienes.capital.eyebrow',
    'quienes.capital.titulo',
    'quienes.capital.quote',
    'quienes.capital.stat1.numero', 'quienes.capital.stat1.label',
    'quienes.capital.stat2.numero', 'quienes.capital.stat2.label',
    'quienes.capital.stat3.numero', 'quienes.capital.stat3.label',
    'quienes.capital.stat4.numero', 'quienes.capital.stat4.label',
    
    'quienes.campo.titulo',
    'quienes.campo.subtitulo',
    'quienes.cedis.titulo',
    'quienes.cedis.subtitulo',
    
    // Fichas campo
    'quienes.campo.paso1.titulo', 'quienes.campo.paso1.desc', 'quienes.campo.paso1.sub1', 'quienes.campo.paso1.sub2', 'quienes.campo.paso1.sub3', 'quienes.campo.paso1.sub4',
    'quienes.campo.paso2.titulo', 'quienes.campo.paso2.desc', 'quienes.campo.paso2.sub1', 'quienes.campo.paso2.sub2', 'quienes.campo.paso2.sub3', 'quienes.campo.paso2.sub4',
    'quienes.campo.paso3.titulo', 'quienes.campo.paso3.desc', 'quienes.campo.paso3.sub1', 'quienes.campo.paso3.sub2', 'quienes.campo.paso3.sub3', 'quienes.campo.paso3.sub4',
    'quienes.campo.paso4.titulo', 'quienes.campo.paso4.desc', 'quienes.campo.paso4.sub1', 'quienes.campo.paso4.sub2', 'quienes.campo.paso4.sub3', 'quienes.campo.paso4.sub4',

    // Fichas cedis
    'quienes.cedis.paso1.titulo', 'quienes.cedis.paso1.desc',
    'quienes.cedis.paso2.titulo', 'quienes.cedis.paso2.desc',
    'quienes.cedis.paso3.titulo', 'quienes.cedis.paso3.desc',
    'quienes.cedis.paso4.titulo', 'quienes.cedis.paso4.desc',

    // Primus
    'quienes.primus.eyebrow',
    'quienes.primus.titulo',
    'quienes.primus.desc',
    'quienes.primus.imagen',

    // Ecosistema GEC
    'quienes.ecosistema.gec.eyebrow',
    'quienes.ecosistema.gec.titulo',
    'quienes.ecosistema.gec.slogan',
    'quienes.ecosistema.gec.pilar1.titulo', 'quienes.ecosistema.gec.pilar1.subtitulo', 'quienes.ecosistema.gec.pilar1.desc',
    'quienes.ecosistema.gec.pilar2.titulo', 'quienes.ecosistema.gec.pilar2.subtitulo', 'quienes.ecosistema.gec.pilar2.desc',
    'quienes.ecosistema.gec.pilar3.titulo', 'quienes.ecosistema.gec.pilar3.subtitulo', 'quienes.ecosistema.gec.pilar3.desc',
    'quienes.ecosistema.gec.pilar4.titulo', 'quienes.ecosistema.gec.pilar4.subtitulo', 'quienes.ecosistema.gec.pilar4.desc',

    // imágenes gestionadas desde admin
    'quienes.hero.imagen',
    'quienes.franja.imagen',
    'quienes.ceo.eyebrow',
    'quienes.ceo.frase',
    'quienes.ceo.desc',
    'quienes.ceo.imagen',
    'quienes.ecosistema.mision.imagen',
    'quienes.ecosistema.vision.imagen',
    'quienes.ecosistema.valores.imagen',
    
    // Imágenes de pasos
    'quienes.campo.paso1.imagen',
    'quienes.campo.paso2.imagen',
    'quienes.campo.paso3.imagen',
    'quienes.campo.paso4.imagen',
    
    'quienes.cedis.ficha1.imagen',
    'quienes.cedis.ficha2.imagen',
    'quienes.cedis.ficha3.imagen',
    'quienes.cedis.ficha4.imagen',

    // Capital fotos
    'quienes.capital.foto1',
    'quienes.capital.foto2',
    'quienes.capital.foto3',
    'quienes.capital.foto4',

    ...idsValores.map(id => `quienes.valor.${id}`)
  ], locale);

  const heroTitulo = contenido['quienes.hero.titulo'] || t('titulo_pagina');
  const heroSubtitulo = contenido['quienes.hero.sub'] || t('subtitulo_pagina');
  const intro = contenido['quienes.intro'];
  const introTitulo = contenido['quienes.intro.titulo'] || 'Grupo Exportador del Campo';
  const introSlogan = contenido['quienes.intro.slogan'] || t('slogan');
  
  const mision = contenido['quienes.mision'] || t('mision_titulo');
  const vision = contenido['quienes.vision'] || t('vision_titulo');
  
  const esenciaEyebrow = contenido['quienes.esencia.eyebrow'] || 'NUESTRA ESENCIA';
  const esenciaTitulo = contenido['quienes.esencia.titulo'] || 'Ecosistema de Pensamiento GEC';
  const esenciaSubtitulo = contenido['quienes.esencia.subtitulo'] || 'Los principios que guían cada decisión, desde el campo hasta el cliente.';
 
  const misionPanelTitulo = contenido['quienes.ecosistema.mision.titulo'] || t('mision_titulo');
  const visionPanelTitulo = contenido['quienes.ecosistema.vision.titulo'] || t('vision_titulo');
  const valoresPanelTitulo = contenido['quienes.ecosistema.valores.titulo'] || t('valores_titulo');
  const filosofiaGecText = contenido['quienes.ecosistema.filosofia.label'] || 'FILOSOFÍA GEC';
 
  const ceoEyebrow = contenido['quienes.ceo.eyebrow'] || t('ceo_eyebrow');
  const ceoFrase = contenido['quienes.ceo.frase'] || t('ceo_frase');
  const ceoDesc = contenido['quienes.ceo.desc'] || t('ceo_desc');

  const capEyebrow = contenido['quienes.capital.eyebrow'] || t('cap_eyebrow');
  const capTitulo = contenido['quienes.capital.titulo'] || t('cap_titulo');
  const capQuote = contenido['quienes.capital.quote'] || t('cap_quote');

  const campoTitulo = contenido['quienes.campo.titulo'] || t('proc_titulo');
  const campoSubtitulo = contenido['quienes.campo.subtitulo'] || t('proc_sub');
  const cedisTitulo = contenido['quienes.cedis.titulo'] || t('cedis_titulo');
  const cedisSubtitulo = contenido['quienes.cedis.subtitulo'] || t('cedis_sub');

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

  // Imágenes desde admin (Vercel Blob URL o vacío)
  const imgFranja    = contenido['quienes.franja.imagen'] || null;
  const imgCeo       = contenido['quienes.ceo.imagen'] || null;
  const imgHero      = contenido['quienes.hero.imagen'] || null;
  
  const ecoImagenes = {
    'quienes.ecosistema.mision.imagen': contenido['quienes.ecosistema.mision.imagen'] || '',
    'quienes.ecosistema.vision.imagen': contenido['quienes.ecosistema.vision.imagen'] || '',
    'quienes.ecosistema.valores.imagen': contenido['quienes.ecosistema.valores.imagen'] || '',
  };

  const campoImagenes: string[] = [
    contenido['quienes.campo.paso1.imagen'] || fotosZacatecas[0] || '',
    contenido['quienes.campo.paso2.imagen'] || fotosZacatecas[1] || '',
    contenido['quienes.campo.paso3.imagen'] || fotosZacatecas[2] || '',
    contenido['quienes.campo.paso4.imagen'] || fotosZacatecas[3] || '',
  ];

  const cedisImagenes: [string, string, string, string] = [
    contenido['quienes.cedis.ficha1.imagen'] || fotosSedis[0] || '',
    contenido['quienes.cedis.ficha2.imagen'] || fotosSedis[1] || '',
    contenido['quienes.cedis.ficha3.imagen'] || fotosSedis[2] || '',
    contenido['quienes.cedis.ficha4.imagen'] || fotosSedis[3] || '',
  ];

  const capFotos: string[] = [
    contenido['quienes.capital.foto1'] || fotosZacatecas[0] || '',
    contenido['quienes.capital.foto2'] || fotosZacatecas[1] || '',
    contenido['quienes.capital.foto3'] || fotosZacatecas[2] || '',
    contenido['quienes.capital.foto4'] || fotosZacatecas[3] || '',
  ];

  // CEO — DB primero, filesystem como fallback
  const ceoLocalPath = join(process.cwd(), 'public/images/quienes/ceo.jpg');
  const ceoSrc = imgCeo || (existsSync(ceoLocalPath) ? '/images/quienes/ceo.jpg' : null);

  // Franja hero — DB primero, filesystem como fallback
  const franjaLocalPath = join(process.cwd(), 'public/images/quienes/franja-inicio.jpg');
  const franjaImage = imgHero || imgFranja || (existsSync(franjaLocalPath) ? '/images/quienes/franja-inicio.jpg' : null);

  // Primus GFS
  const primusLogoPath = [
    '/images/logos/PrimusGFS_Logo_web.png',
    '/images/logos/primus-cert.png',
  ].find(p => existsSync(join(process.cwd(), 'public', p)));
  const imgPrimus = contenido['quienes.primus.imagen'] || primusLogoPath || '';
  const primusEyebrow = contenido['quienes.primus.eyebrow'] || t('primus_eyebrow');
  const primusTitulo = contenido['quienes.primus.titulo'] || t('primus_titulo');
  const primusDesc = contenido['quienes.primus.desc'] || t('primus_desc');

  // Ecosistema GEC
  const ecoGecEyebrow = contenido['quienes.ecosistema.gec.eyebrow'] || t('eco_eyebrow');
  const ecoGecTitulo = contenido['quienes.ecosistema.gec.titulo'] || t('eco_titulo');
  const ecoGecSlogan = contenido['quienes.ecosistema.gec.slogan'] || t('slogan');
  const ecoGecPilares = [
    {
      id: 'pilar1',
      titulo: contenido['quienes.ecosistema.gec.pilar1.titulo'] || t('eco_pilar1_titulo'),
      subtitulo: contenido['quienes.ecosistema.gec.pilar1.subtitulo'] || t('eco_pilar1_sub'),
      desc: contenido['quienes.ecosistema.gec.pilar1.desc'] || t('eco_pilar1_desc'),
      color: 'bg-brand-green',
    },
    {
      id: 'pilar2',
      titulo: contenido['quienes.ecosistema.gec.pilar2.titulo'] || t('eco_pilar2_titulo'),
      subtitulo: contenido['quienes.ecosistema.gec.pilar2.subtitulo'] || t('eco_pilar2_sub'),
      desc: contenido['quienes.ecosistema.gec.pilar2.desc'] || t('eco_pilar2_desc'),
      color: 'bg-brand-navy',
    },
    {
      id: 'pilar3',
      titulo: contenido['quienes.ecosistema.gec.pilar3.titulo'] || t('eco_pilar3_titulo'),
      subtitulo: contenido['quienes.ecosistema.gec.pilar3.subtitulo'] || t('eco_pilar3_sub'),
      desc: contenido['quienes.ecosistema.gec.pilar3.desc'] || t('eco_pilar3_desc'),
      color: 'bg-[#1a5c3a]',
    },
  ];

  // Campo Step details from DB or fallbacks
  const campoStepData = [
    {
      titulo: contenido['quienes.campo.paso1.titulo'] || '',
      desc: contenido['quienes.campo.paso1.desc'] || '',
      subprocesos: [
        contenido['quienes.campo.paso1.sub1'] || '',
        contenido['quienes.campo.paso1.sub2'] || '',
        contenido['quienes.campo.paso1.sub3'] || '',
        contenido['quienes.campo.paso1.sub4'] || '',
      ]
    },
    {
      titulo: contenido['quienes.campo.paso2.titulo'] || '',
      desc: contenido['quienes.campo.paso2.desc'] || '',
      subprocesos: [
        contenido['quienes.campo.paso2.sub1'] || '',
        contenido['quienes.campo.paso2.sub2'] || '',
        contenido['quienes.campo.paso2.sub3'] || '',
        contenido['quienes.campo.paso2.sub4'] || '',
      ]
    },
    {
      titulo: contenido['quienes.campo.paso3.titulo'] || '',
      desc: contenido['quienes.campo.paso3.desc'] || '',
      subprocesos: [
        contenido['quienes.campo.paso3.sub1'] || '',
        contenido['quienes.campo.paso3.sub2'] || '',
        contenido['quienes.campo.paso3.sub3'] || '',
        contenido['quienes.campo.paso3.sub4'] || '',
      ]
    },
    {
      titulo: contenido['quienes.campo.paso4.titulo'] || '',
      desc: contenido['quienes.campo.paso4.desc'] || '',
      subprocesos: [
        contenido['quienes.campo.paso4.sub1'] || '',
        contenido['quienes.campo.paso4.sub2'] || '',
        contenido['quienes.campo.paso4.sub3'] || '',
        contenido['quienes.campo.paso4.sub4'] || '',
      ]
    }
  ];

  // CEDIS Step details from DB or fallbacks
  const cedisStepData = [
    {
      titulo: contenido['quienes.cedis.paso1.titulo'] || '',
      desc: contenido['quienes.cedis.paso1.desc'] || '',
    },
    {
      titulo: contenido['quienes.cedis.paso2.titulo'] || '',
      desc: contenido['quienes.cedis.paso2.desc'] || '',
    },
    {
      titulo: contenido['quienes.cedis.paso3.titulo'] || '',
      desc: contenido['quienes.cedis.paso3.desc'] || '',
    },
    {
      titulo: contenido['quienes.cedis.paso4.titulo'] || '',
      desc: contenido['quienes.cedis.paso4.desc'] || '',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <PageHero
        title={heroTitulo}
        subtitle={heroSubtitulo}
        heroImage={franjaImage}
        titleId="quienes.hero.titulo"
        subtitleId="quienes.hero.sub"
        heroImageId="quienes.hero.imagen"
        compact={true}
      />

      {/* ── 1. Intro — texto + card CEO ── */}
      <section id="grupo-exportador" className="w-full bg-brand-white py-16 md:py-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Watermark/Isotipo */}
        <div className="absolute left-[-160px] bottom-[-140px] w-[580px] h-[580px] opacity-[0.35] pointer-events-none select-none z-0">
          <Image
            src="/images/iconos/icono.png"
            alt="GEC Isotipo Watermark"
            width={580}
            height={580}
            className="object-contain"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-12 items-start">
          {/* Columna izquierda — texto */}
          <div className="w-full md:w-[65%]">
            <VisualEditable id="quienes.intro.titulo" label="Título de Introducción">
              <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
                {introTitulo}
              </h2>
            </VisualEditable>
            <div className="w-[60px] h-[3px] bg-brand-green mb-6" />
            <VisualEditable id="quienes.intro" label="Párrafo de Introducción">
              <p
                className="rich-text font-body text-brand-navy/80 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: intro || t('intro_titulo') }}
              />
            </VisualEditable>
            <div className="mt-8 pt-4 flex flex-col items-start gap-3">
              <VisualEditable id="quienes.intro.slogan" label="Slogan GEC">
                <p className="font-display text-3xl md:text-5xl text-brand-navy font-black tracking-wide leading-none">
                  {introSlogan}
                </p>
              </VisualEditable>
              <div className="w-[80px] h-[3px] bg-brand-green mt-1" />
              <div className="w-10 h-10 rounded-full border-2 border-brand-green/20 flex items-center justify-center mt-3">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-green" />
              </div>
            </div>
          </div>

          {/* Columna derecha — card CEO */}
          <div className="w-full md:w-[35%] relative md:-mb-20 md:mt-6">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative h-72 md:h-96">
                {ceoSrc ? (
                  <div className="relative w-full h-full">
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
                    {/* Cambiar Foto CEO button — solo admin */}
                    {isAdmin && (
                      <div className="absolute top-3 right-3 z-35">
                        <AdminImageButton
                          id="quienes.ceo.imagen"
                          label="Foto de Joaquín Vizcaíno (CEO)"
                          buttonText="Cambiar Foto"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-brand-navy/40 flex items-center justify-center">
                    <User className="w-16 h-16 text-brand-green/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-navy" />
              </div>
              <div className="bg-brand-navy px-6 py-5">
                <VisualEditable id="quienes.ceo.eyebrow" label="Eyebrow del CEO">
                  <p className="text-brand-green text-xs font-medium uppercase tracking-widest mb-2">
                    {ceoEyebrow}
                  </p>
                </VisualEditable>
                <VisualEditable id="quienes.ceo.frase" label="Frase del CEO">
                  <h3 className="font-display text-white text-2xl font-bold leading-tight mb-3">
                    &ldquo;{ceoFrase}&rdquo;
                  </h3>
                </VisualEditable>
                <VisualEditable id="quienes.ceo.desc" label="Descripción del CEO">
                  <p className="text-white/70 text-sm font-body leading-relaxed">
                    {ceoDesc}
                  </p>
                </VisualEditable>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Ecosistema de Pensamiento — Misión / Visión / Valores ── */}
      <EcosisteGEC
        imagenes={ecoImagenes}
        misionDesc={mision}
        visionDesc={vision}
        valores={idsValores.map(id => ({
          id,
          label: contenido[`quienes.valor.${id}`] || t(`valor_${id}`)
        }))}
        esenciaEyebrow={esenciaEyebrow}
        esenciaTitulo={esenciaTitulo}
        esenciaSubtitulo={esenciaSubtitulo}
        misionTitulo={misionPanelTitulo}
        visionTitulo={visionPanelTitulo}
        valoresTitulo={valoresPanelTitulo}
        filosofiaGecText={filosofiaGecText}
      />

      {/* ── 3. Fichas interactivas — Procesos Campo ── */}
      <ProcesosField
        imagenes={campoImagenes}
        titulo={campoTitulo}
        subtitulo={campoSubtitulo}
        stepData={campoStepData}
      />

      {/* ── 4. Primus GFS badge (en medio de ambos procesos) ── */}
      {imgPrimus && (
        <section className="w-full bg-white py-12 px-4 sm:px-6 border-y border-brand-gray/25 relative">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 justify-center text-center sm:text-left">
            <div className="bg-white p-3 rounded-xl shadow-md shrink-0 border border-brand-gray/10 relative">
              <Image
                src={imgPrimus}
                alt="Primus GFS Certification"
                width={140}
                height={55}
                style={{ objectFit: 'contain' }}
              />
              {isAdmin && (
                <div className="absolute top-1 right-1">
                  <AdminImageButton
                    id="quienes.primus.imagen"
                    label="Logo Primus GFS"
                    buttonText=""
                    className="p-1 rounded-full"
                  />
                </div>
              )}
            </div>
            <div>
              <VisualEditable id="quienes.primus.eyebrow" label="Primus - Eyebrow">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-green block mb-1">
                  {primusEyebrow}
                </span>
              </VisualEditable>
              <VisualEditable id="quienes.primus.titulo" label="Primus - Título">
                <p className="font-display text-xl font-bold text-brand-navy mb-1.5">{primusTitulo}</p>
              </VisualEditable>
              <VisualEditable id="quienes.primus.desc" label="Primus - Descripción">
                <p className="font-body text-sm text-brand-navy/65 leading-relaxed max-w-xl">{primusDesc}</p>
              </VisualEditable>
            </div>
          </div>
        </section>
      )}

      {/* ── 5. Procesos CEDIS (arriba de Capital Humano) ── */}
      <CedisProcesos
        imagenes={cedisImagenes}
        titulo={cedisTitulo}
        subtitulo={cedisSubtitulo}
        stepData={cedisStepData}
      />

      {/* ── 6. Capital Humano ── */}
      <CapitalHumano
        numeros={[
          {
            val: contenido['quienes.capital.stat1.numero'] || '+200',
            valId: 'quienes.capital.stat1.numero',
            label: contenido['quienes.capital.stat1.label'] || t('cap_colaboradores'),
            labelId: 'quienes.capital.stat1.label',
          },
          {
            val: contenido['quienes.capital.stat2.numero'] || 'Décadas',
            valId: 'quienes.capital.stat2.numero',
            label: contenido['quienes.capital.stat2.label'] || t('cap_historia'),
            labelId: 'quienes.capital.stat2.label',
          },
          {
            val: contenido['quienes.capital.stat3.numero'] || 'Múltiples',
            valId: 'quienes.capital.stat3.numero',
            label: contenido['quienes.capital.stat3.label'] || t('cap_generaciones'),
            labelId: 'quienes.capital.stat3.label',
          },
          {
            val: contenido['quienes.capital.stat4.numero'] || 'Coordinado',
            valId: 'quienes.capital.stat4.numero',
            label: contenido['quienes.capital.stat4.label'] || t('cap_compromiso'),
            labelId: 'quienes.capital.stat4.label',
          },
        ]}
        fotos={capFotos}
        translations={{
          eyebrowId: 'quienes.capital.eyebrow',
          eyebrow: capEyebrow,
          tituloId: 'quienes.capital.titulo',
          titulo: capTitulo,
          quoteId: 'quienes.capital.quote',
          quote: capQuote,
          foto: t('cap_foto')
        }}
      />

      {/* ── 7. Ecosistema GEC — Paneles expansibles ── */}
      <EcosistemaGEC
        eyebrow={ecoGecEyebrow}
        titulo={ecoGecTitulo}
        slogan={ecoGecSlogan}
        pilares={ecoGecPilares}
      />
    </div>
  );
}
