import { prisma } from './db';

export async function getContenido(id: string, locale: string): Promise<string | null> {
  try {
    const row = await prisma.contenidoSitio.findUnique({ where: { id } });
    if (!row) return null;
    if (locale === 'en') return row.valor_en ?? row.valor_es;
    if (locale === 'de') return row.valor_de ?? row.valor_es;
    return row.valor_es;
  } catch {
    return null;
  }
}

export async function getContenidosBySeccion(seccion: string) {
  return prisma.contenidoSitio.findMany({
    where: { seccion },
    orderBy: { id: 'asc' },
  });
}

export async function getAllContenidos() {
  const rows = await prisma.contenidoSitio.findMany({ orderBy: { id: 'asc' } });
  // Group by seccion
  const grouped: Record<string, typeof rows> = {};
  for (const r of rows) {
    if (!grouped[r.seccion]) grouped[r.seccion] = [];
    grouped[r.seccion].push(r);
  }
  return grouped;
}
