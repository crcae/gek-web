import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/db';

export const getContenidoCached = unstable_cache(
  async (ids: string[], locale: string) => {
    const contenido = await prisma.contenidoSitio.findMany({
      where: { id: { in: ids } }
    });
    
    // Convertir a un objeto id -> valor para fácil acceso
    const result: Record<string, string | null> = {};
    ids.forEach(id => {
      const item = contenido.find(c => c.id === id);
      if (item) {
        if (locale === 'en') result[id] = item.valor_en || item.valor_es;
        else if (locale === 'de') result[id] = item.valor_de || item.valor_es;
        else result[id] = item.valor_es;
      } else {
        result[id] = null;
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
