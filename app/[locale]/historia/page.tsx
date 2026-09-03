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
    
    'historia.fundadores.eyebrow',
    'historia.fundadores.titulo',
    'historia.fundadores.subtitulo',
    'historia.fundadores.texto',
    'historia.fundadores.imagen',
    'historia.fundadores2.imagen',
    'historia.fundadores.foto1',
    'historia.fundadores.foto2',
    'historia.fundadores.foto3',
    'historia.fundadores.foto4',
    'historia.fundadores.stat1.numero',
    'historia.fundadores.stat1.label',
    'historia.fundadores.stat2.numero',
    'historia.fundadores.stat2.label',
    'historia.fundadores.stat3.numero',
    'historia.fundadores.stat3.label',
    'historia.fundadores.stat4.numero',
    'historia.fundadores.stat4.label',
    
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

  const fundadoresEyebrow = contenido['historia.fundadores.eyebrow'] || 'HISTORIA GEC';
  const fundadoresTitulo = contenido['historia.fundadores.titulo'] || (locale === 'es' ? 'Fundadores' : locale === 'de' ? 'Gründer' : 'Founders');
  const fundadoresTexto = contenido['historia.fundadores.texto'] || (locale === 'es'
    ? 'Lo que comenzó como un proyecto familiar dedicado al transporte y comercialización agrícola, hoy integra producción, preenfriamiento, distribución y exportación. Cada paso de este camino tiene su origen en los valores y la visión de quienes iniciaron esta historia.'
    : 'What began as a family project dedicated to agricultural transport and commercialization now integrates production, pre-cooling, distribution and export. Every step of this journey originates in the values and vision of those who started this story.');

  const fundadoresNumeros = [
    {
      val: contenido['historia.fundadores.stat1.numero'] || '+50',
      valId: 'historia.fundadores.stat1.numero',
      label: contenido['historia.fundadores.stat1.label'] || (locale === 'es' ? 'Años de historia' : locale === 'de' ? 'Jahre Geschichte' : 'Years of history'),
      labelId: 'historia.fundadores.stat1.label',
    },
    {
      val: contenido['historia.fundadores.stat2.numero'] || '3',
      valId: 'historia.fundadores.stat2.numero',
      label: contenido['historia.fundadores.stat2.label'] || (locale === 'es' ? 'Generaciones' : locale === 'de' ? 'Generationen' : 'Generations'),
      labelId: 'historia.fundadores.stat2.label',
    },
    {
      val: contenido['historia.fundadores.stat3.numero'] || '1965',
      valId: 'historia.fundadores.stat3.numero',
      label: contenido['historia.fundadores.stat3.label'] || (locale === 'es' ? 'Año de fundación' : locale === 'de' ? 'Gründungsjahr' : 'Foundation year'),
      labelId: 'historia.fundadores.stat3.label',
    },
    {
      val: contenido['historia.fundadores.stat4.numero'] || '100%',
      valId: 'historia.fundadores.stat4.numero',
      label: contenido['historia.fundadores.stat4.label'] || (locale === 'es' ? 'Legado familiar' : locale === 'de' ? 'Familienvermächtnis' : 'Family legacy'),
      labelId: 'historia.fundadores.stat4.label',
    },
  ];

  const fundadoresFotos = [
    contenido['historia.fundadores.foto1'] || contenido['historia.fundadores.imagen'] || '/images/fundadores/fundadores.jpg',
    contenido['historia.fundadores.foto2'] || contenido['historia.fundadores2.imagen'] || '/images/fundadores/fundadores2.jpg',
  ];

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

      {/* Fundadores — Mosaico Parallax y Métricas estilo Capital Humano */}
      <FundadoresSection
        numeros={fundadoresNumeros}
        fotos={fundadoresFotos}
        translations={{
          eyebrowId: 'historia.fundadores.eyebrow',
          eyebrow: fundadoresEyebrow,
          tituloId: 'historia.fundadores.titulo',
          titulo: fundadoresTitulo,
          quoteId: 'historia.fundadores.texto',
          quote: fundadoresTexto,
        }}
      />
    </div>
  );
}
