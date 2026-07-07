import { getTranslations } from 'next-intl/server';
import { PageHero } from '@/components/sections/shared/PageHero';
import { Timeline } from '@/components/sections/history/Timeline';
import { GaleriaGrid } from '@/components/sections/history/GaleriaGrid';
import { LegadoSlideshow } from '@/components/sections/history/LegadoSlideshow';
import { FundadoresSection } from '@/components/sections/history/FundadoresSection';
import Image from 'next/image';
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
    'historia.fundadores.titulo',
    'historia.fundadores.subtitulo',
    'historia.fundadores.texto',
    'historia.fundadores.imagen',
    'historia.fundadores2.imagen',
    'historia.hero.imagen',
    'historia.slideshow.titulo',
    'historia.slide1.subtitulo',
    'historia.slide1.pie',
    'historia.slide1.texto',
    'historia.slide1.imagen',
    'historia.slide2.subtitulo',
    'historia.slide2.pie',
    'historia.slide2.texto',
    'historia.slide2.imagen',
    'historia.slide3.subtitulo',
    'historia.slide3.pie',
    'historia.slide3.texto',
    'historia.slide3.imagen',
    'timeline.titulo',
    ...hitoIds
  ], locale);

  const fundadoresTitulo = contenido['historia.fundadores.titulo'] || 'Fundadores';
  const fundadoresSubtitulo = contenido['historia.fundadores.subtitulo'] || 'Tres generaciones después';
  const fundadoresTexto = contenido['historia.fundadores.texto'];
  const dbHeroImage = contenido['historia.hero.imagen'];
  const slideshowTitulo = contenido['historia.slideshow.titulo'] || 'Nuestro Legado';
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

  const slides = [
    {
      subtitulo: contenido['historia.slide1.subtitulo'] || 'Primera Generación',
      pie: contenido['historia.slide1.pie'] || 'Nacidos en Zacatecas',
      texto: contenido['historia.slide1.texto'] || 'Hace más de 50 años, en las fértiles tierras de Zacatecas, nuestro fundador Don Ramiro Vizcaíno tomó las riendas de un proyecto que marcaría el camino de tres generaciones comprometidas a trabajar el campo.\n\nY la historia comenzó desde el municipio de Loreto.',
      imagen: contenido['historia.slide1.imagen'] || '/images/zacatecas/_DSC3592.jpg'
    },
    {
      subtitulo: contenido['historia.slide2.subtitulo'] || 'Segunda Generación',
      pie: contenido['historia.slide2.pie'] || 'Crecidos en México',
      texto: contenido['historia.slide2.texto'] || 'La segunda generación llevó la operación fuera de Zacatecas, a expandir nuestras operaciones y puntos de venta por el país. Entrando a cadenas de retail y realizando nuestras primeras exportaciones.',
      imagen: contenido['historia.slide2.imagen'] || '/images/sedis/sedis1.jpg'
    },
    {
      subtitulo: contenido['historia.slide3.subtitulo'] || 'Tercera Generación',
      pie: contenido['historia.slide3.pie'] || 'Listos para el Mundo',
      texto: contenido['historia.slide3.texto'] || 'En la actualidad, la tercera generación ha incursionado en un proceso de institucionalización; instaurando procesos, estructuración sólida, nuevas unidades de negocio y mayor responsabilidad social.\n\nPara seguir llevando una probadita de México al mundo entero.',
      imagen: contenido['historia.slide3.imagen'] || '/images/features/quienes.jpg'
    }
  ];

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

  // Franja hero
  const franjaPath = join(process.cwd(), 'public/images/historia/franja-inicio.jpg');
  const franjaImage = dbHeroImage || (existsSync(franjaPath) ? '/images/historia/franja-inicio.jpg' : null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero — texto abajo-izquierda */}
      <PageHero
        title={t('titulo_pagina')}
        subtitle={t('subtitulo_pagina')}
        heroImage={franjaImage}
        textRight={true}
      />

      {/* Legado Slideshow — 3 partes cambiantes */}
      <LegadoSlideshow titulo={slideshowTitulo} slides={slides} />

      {/* Timeline */}
      <Timeline hitos={hitos} titulo={timelineTitulo} />

      {/* Fundadores */}
      <FundadoresSection
        titulo={fundadoresTitulo}
        subtitulo={fundadoresSubtitulo}
        texto={fundadoresTexto || 'Lo que comenzó como un proyecto familiar dedicado al transporte y comercialización agrícola, hoy integra producción, preenfriamiento, distribución y exportación. Cada paso de este camino tiene su origen en los valores y la visión de quienes iniciaron esta historia.'}
        imagenPrincipal={contenido['historia.fundadores.imagen'] || fundadoresImg}
        imagenHover={contenido['historia.fundadores2.imagen'] || fundadoresImg}
      />

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
