import { prisma } from '../db';

export async function getNoticiasRecientes(limit: number = 3) {
  try {
    const noticias = await prisma.noticia.findMany({
      where: {
        publicada: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
    return noticias;
  } catch (error) {
    console.error('Error fetching noticias:', error);
    return [];
  }
}
