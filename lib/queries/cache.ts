import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';

import { cleanImageUrl } from '@/lib/cleanImageUrl';

export const getContenidoCached = unstable_cache(
  async (ids: string[], locale: string) => {
    const contenido = await prisma.contenidoSitio.findMany({
      where: { id: { in: ids } }
    });
    
    // Convertir a un objeto id -> valor para fácil acceso
    // Siempre retorna string (nunca null) para compatibilidad con TypeScript
    const result: Record<string, string> = {};
    ids.forEach(id => {
      const item = contenido.find(c => c.id === id);
      if (item) {
        const isMedia = id.includes('imagen') || id.includes('logo') || id.includes('foto') || id.includes('folleto') || id.includes('trailer') || id.includes('camion');
        const esVal = item.valor_es || '';
        const enVal = item.valor_en || '';
        const deVal = item.valor_de || '';

        if (isMedia) {
          let mediaVal = '';
          if (locale === 'en') {
            mediaVal = (enVal && enVal.startsWith('http')) ? enVal : (esVal || enVal || '');
          } else if (locale === 'de') {
            mediaVal = (deVal && deVal.startsWith('http')) ? deVal : (esVal || deVal || '');
          } else {
            mediaVal = esVal || enVal || '';
          }
          result[id] = cleanImageUrl(mediaVal);
        } else {
          if (locale === 'en') result[id] = enVal || esVal || '';
          else if (locale === 'de') result[id] = deVal || esVal || '';
          else result[id] = esVal || '';
        }
      } else {
        result[id] = '';
      }
    });
    return result;
  },
  ['contenido-sitio'],
  { revalidate: 3600, tags: ['contenido'] }
);

export const getNoticiasCached = unstable_cache(
  async (limit: number = 3) => {
    return prisma.noticia.findMany({
      where: { publicada: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },
  ['noticias-recientes'],
  { revalidate: 3600, tags: ['noticias'] }
);

export const getUnidadesNegocioCached = unstable_cache(
  async () => {
    return prisma.unidadNegocio.findMany({
      where: { activa: true },
      orderBy: { orden: 'asc' },
      include: { division: true }
    });
  },
  ['unidades-negocio'],
  { revalidate: 3600, tags: ['unidades'] }
);

export const getCertificacionesCached = unstable_cache(
  async () => {
    return prisma.certificacion.findMany({
      where: { activa: true },
      orderBy: { orden: 'asc' },
    });
  },
  ['certificaciones-activas'],
  { revalidate: 3600, tags: ['certificaciones'] }
);

export const getTimelineHitosCached = unstable_cache(
  async (locale: string) => {
    const rows = await prisma.contenidoSitio.findMany({
      where: { seccion: 'timeline' },
      orderBy: { id: 'asc' },
    });

    const hitoMap = new Map<string, { id: string; anio: string; titulo: string; desc: string; imagen: string; generacion: string }>();

    for (const r of rows) {
      const match = r.id.match(/^timeline\.(hito\d+)\.(anio|titulo|desc|imagen|generacion)$/);
      if (!match) continue;
      const [, hitoKey, field] = match;
      if (!hitoMap.has(hitoKey)) {
        hitoMap.set(hitoKey, { id: hitoKey, anio: '', titulo: '', desc: '', imagen: '', generacion: '1' });
      }
      const item = hitoMap.get(hitoKey)!;
      let val = r.valor_es || '';
      if (locale === 'en' && r.valor_en) val = r.valor_en;
      else if (locale === 'de' && r.valor_de) val = r.valor_de;

      if (field === 'anio') item.anio = val;
      else if (field === 'titulo') item.titulo = val;
      else if (field === 'desc') item.desc = val;
      else if (field === 'imagen') item.imagen = r.valor_es ? cleanImageUrl(r.valor_es) : '';
      else if (field === 'generacion') item.generacion = r.valor_es || '1';
    }

    const hitos = Array.from(hitoMap.values()).filter((h) => h.anio || h.titulo);

    // Sort hitos by numeric index from ID
    hitos.sort((a, b) => {
      const numA = parseInt(a.id.replace('hito', ''), 10) || 0;
      const numB = parseInt(b.id.replace('hito', ''), 10) || 0;
      return numA - numB;
    });

    return hitos;
  },
  ['timeline-hitos-dynamic'],
  { revalidate: 3600, tags: ['contenido', 'timeline'] }
);

export const getPuntosContactoCached = unstable_cache(
  async () => {
    let puntos = await prisma.puntoContacto.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
    });

    if (puntos.length === 0) {
      const defaults = [
        {
          texto: 'Stiva No. 484 Parque Industrial Barragán, San Nicolás de los Garza N.L.',
          icono: 'MapPin',
          enlace: null,
          orden: 1,
          activo: true,
        },
        {
          texto: 'Loreto, Zacatecas',
          icono: 'MapPin',
          enlace: null,
          orden: 2,
          activo: true,
        },
        {
          texto: 'Tijuana, Baja California',
          icono: 'MapPin',
          enlace: null,
          orden: 3,
          activo: true,
        },
        {
          texto: '+52 81 2207 0314',
          icono: 'Phone',
          enlace: 'tel:+528122070314',
          orden: 4,
          activo: true,
        },
        {
          texto: 'info@gecvt.com',
          icono: 'Mail',
          enlace: 'mailto:info@gecvt.com',
          orden: 5,
          activo: true,
        },
      ];

      for (const d of defaults) {
        await prisma.puntoContacto.create({ data: d });
      }

      puntos = await prisma.puntoContacto.findMany({
        where: { activo: true },
        orderBy: { orden: 'asc' },
      });
    }

    return puntos;
  },
  ['puntos-contacto-list'],
  { revalidate: 3600, tags: ['puntos-contacto'] }
);


