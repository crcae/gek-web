import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/shared/PageHero';
import { Timeline } from '@/components/sections/history/Timeline';
import { NuestroLegadoSection } from '@/components/sections/history/NuestroLegadoSection';
import { FundadoresSection } from '@/components/sections/history/FundadoresSection';
import { getContenidoCached } from '@/lib/queries/cache';
import { existsSync } from 'fs';
import { join } from 'path';
import fs from 'fs';
import path from 'path';

export default async function Historia({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('historia');

  const hitoIds: string[] = [];
  for (let i = 1; i <= 19; i++) {
    hitoIds.push(`timeline.hito${i}.anio`);
    hitoIds.push(`timeline.hito${i}.titulo`);
    hitoIds.push(`timeline.hito${i}.desc`);
    hitoIds.push(`timeline.hito${i}.imagen`);
    hitoIds.push(`timeline.hito${i}.generacion`);
  }

  const contenido = await getContenidoCached([
    'historia.hero.titulo',
    'historia.hero.sub',
    'historia.hero.imagen',
    
    'historia.fundadores.titulo',
    'historia.fundadores.subtitulo',
    'historia.fundadores.texto',
    'historia.fundadores.caption',
    'historia.fundadores.imagen',
    'historia.fundadores2.imagen',
    
    'historia.legado.eyebrow',
    'historia.legado.titulo',
    'historia.legado.texto',
    'historia.legado.mapa',
    'historia.slide1.imagen',
    
    'timeline.titulo',
    ...hitoIds
  ], locale);

  const heroTitulo = contenido['historia.hero.titulo'] || t('titulo_pagina');
  const heroSubtitulo = contenido['historia.hero.sub'] || t('subtitulo_pagina');
  const dbHeroImage = contenido['historia.hero.imagen'];

  const fundadoresTitulo = contenido['historia.fundadores.titulo'] || 'Fundadores';
  const fundadoresSubtitulo = contenido['historia.fundadores.subtitulo'] || 'Tres generaciones después';
  const fundadoresTexto = contenido['historia.fundadores.texto'];
  const fundadoresCaption = contenido['historia.fundadores.caption'] || 'Sr. Ramiro Vizcaíno y Sra. Zeferina Torres';
  
  const legadoEyebrow = contenido['historia.legado.eyebrow'] || 'NUESTROS ORÍGENES';
  const legadoTitulo = contenido['historia.legado.titulo'] || (locale === 'es' ? 'Nacidos en Zacatecas' : locale === 'de' ? 'Geboren in Zacatecas' : 'Born in Zacatecas');
  const legadoTexto = contenido['historia.legado.texto'] || (locale === 'es' 
    ? 'Hace más de 50 años, en las áridas pero fértiles tierras de Loreto, Zacatecas, nuestro fundador Don Ramiro Vizcaíno tomó las riendas de un proyecto que marcaría el camino de tres generaciones comprometidas a trabajar el campo.\n\nY la historia comenzó desde el municipio de Loreto.'
    : 'Over 50 years ago, in the fertile lands of Loreto, Zacatecas, our founder Don Ramiro Vizcaíno took the helm of a project that would mark the path of three generations committed to working the field.\n\nAnd the story began from the municipality of Loreto.');
  const legadoMapa = contenido['historia.legado.mapa'] || contenido['historia.slide1.imagen'] || '/images/zacatecas/_DSC3592.jpg';

  const timelineTitulo = contenido['timeline.titulo'] || 'Línea de Tiempo GEC';

  const hitos = [];
  for (let i = 1; i <= 19; i++) {
    const anio = contenido[`timeline.hito${i}.anio`] || '';
    const titulo = contenido[`timeline.hito${i}.titulo`] || '';
    const desc = contenido[`timeline.hito${i}.desc`] || '';
    const imagen = contenido[`timeline.hito${i}.imagen`] || '';
    const generacion = contenido[`timeline.hito${i}.generacion`] || '1';
    
    if (anio || titulo) {
      hitos.push({
        id: `hito${i}`,
        anio,
        titulo,
        desc,
        imagen,
        generacion
      });
    }
  }

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

  const fundadoresImg = fotosFundadores[0] || '/images/zacatecas/_DSC3592.jpg';

  // Franja hero
  const franjaPath = join(process.cwd(), 'public/images/historia/franja-inicio.jpg');
  const franjaImage = dbHeroImage || (existsSync(franjaPath) ? '/images/historia/franja-inicio.jpg' : null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero — texto abajo-izquierda */}
      <PageHero
        title={heroTitulo}
        subtitle={heroSubtitulo}
        heroImage={franjaImage}
        textRight={true}
        titleId="historia.hero.titulo"
        subtitleId="historia.hero.sub"
        heroImageId="historia.hero.imagen"
      />

      {/* Nuestro Legado — Sección compacta con Mapa de Zacatecas Editable */}
      <NuestroLegadoSection
        eyebrow={legadoEyebrow}
        titulo={legadoTitulo}
        texto={legadoTexto}
        mapaImagen={legadoMapa}
      />

      {/* Timeline */}
      <Timeline hitos={hitos} titulo={timelineTitulo} />

      {/* Fundadores */}
      <FundadoresSection
        titulo={fundadoresTitulo}
        subtitulo={fundadoresSubtitulo}
        texto={fundadoresTexto || 'Lo que comenzó como un proyecto familiar dedicado al transporte y comercialización agrícola, hoy integra producción, preenfriamiento, distribución y exportación. Cada paso de este camino tiene su origen en los valores y la visión de quienes iniciaron esta historia.'}
        imagenPrincipal={contenido['historia.fundadores.imagen'] || fundadoresImg}
        imagenHover={contenido['historia.fundadores2.imagen'] || fundadoresImg}
        captionText={fundadoresCaption}
      />
    </div>
  );
}
