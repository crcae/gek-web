import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';

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
          if (locale === 'en') {
            result[id] = (enVal && enVal.startsWith('http')) ? enVal : (esVal || enVal || '');
          } else if (locale === 'de') {
            result[id] = (deVal && deVal.startsWith('http')) ? deVal : (esVal || deVal || '');
          } else {
            result[id] = esVal || enVal || '';
          }
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
