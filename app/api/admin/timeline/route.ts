import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidateTag, revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';
import { cleanImageUrl } from '@/lib/cleanImageUrl';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      anio,
      titulo_es,
      titulo_en,
      titulo_de,
      desc_es,
      desc_en,
      desc_de,
      imagen,
      generacion,
    } = body;

    if (!anio || !titulo_es) {
      return NextResponse.json({ error: 'Año y Título son requeridos' }, { status: 400 });
    }

    // Find the next available hito number
    const rows = await prisma.contenidoSitio.findMany({
      where: { id: { startsWith: 'timeline.hito' } },
      select: { id: true },
    });

    let maxNum = 0;
    for (const r of rows) {
      const match = r.id.match(/^timeline\.hito(\d+)\./);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n > maxNum) maxNum = n;
      }
    }

    const nextIndex = maxNum + 1;
    const hitoKey = `hito${nextIndex}`;
    const genVal = generacion || '1';

    // Create records in ContenidoSitio
    await prisma.$transaction([
      prisma.contenidoSitio.upsert({
        where: { id: `timeline.${hitoKey}.anio` },
        create: {
          id: `timeline.${hitoKey}.anio`,
          seccion: 'timeline',
          campo: `Hito ${nextIndex}: Año`,
          valor_es: anio.trim(),
          valor_en: anio.trim(),
          valor_de: anio.trim(),
        },
        update: {
          valor_es: anio.trim(),
        },
      }),
      prisma.contenidoSitio.upsert({
        where: { id: `timeline.${hitoKey}.titulo` },
        create: {
          id: `timeline.${hitoKey}.titulo`,
          seccion: 'timeline',
          campo: `Hito ${nextIndex}: Título`,
          valor_es: titulo_es.trim(),
          valor_en: titulo_en ? titulo_en.trim() : titulo_es.trim(),
          valor_de: titulo_de ? titulo_de.trim() : titulo_es.trim(),
        },
        update: {
          valor_es: titulo_es.trim(),
          valor_en: titulo_en ? titulo_en.trim() : undefined,
          valor_de: titulo_de ? titulo_de.trim() : undefined,
        },
      }),
      prisma.contenidoSitio.upsert({
        where: { id: `timeline.${hitoKey}.desc` },
        create: {
          id: `timeline.${hitoKey}.desc`,
          seccion: 'timeline',
          campo: `Hito ${nextIndex}: Descripción`,
          valor_es: desc_es ? desc_es.trim() : '',
          valor_en: desc_en ? desc_en.trim() : desc_es ? desc_es.trim() : '',
          valor_de: desc_de ? desc_de.trim() : desc_es ? desc_es.trim() : '',
        },
        update: {
          valor_es: desc_es ? desc_es.trim() : '',
          valor_en: desc_en ? desc_en.trim() : undefined,
          valor_de: desc_de ? desc_de.trim() : undefined,
        },
      }),
      prisma.contenidoSitio.upsert({
        where: { id: `timeline.${hitoKey}.imagen` },
        create: {
          id: `timeline.${hitoKey}.imagen`,
          seccion: 'timeline',
          campo: `Hito ${nextIndex}: Imagen`,
          valor_es: imagen ? cleanImageUrl(imagen) : '',
          valor_en: imagen ? cleanImageUrl(imagen) : '',
          valor_de: imagen ? cleanImageUrl(imagen) : '',
        },
        update: {
          valor_es: imagen ? cleanImageUrl(imagen) : '',
        },
      }),
      prisma.contenidoSitio.upsert({
        where: { id: `timeline.${hitoKey}.generacion` },
        create: {
          id: `timeline.${hitoKey}.generacion`,
          seccion: 'timeline',
          campo: `Hito ${nextIndex}: Generación (1, 2, 3 o futuro)`,
          valor_es: genVal,
          valor_en: genVal,
          valor_de: genVal,
        },
        update: {
          valor_es: genVal,
        },
      }),
    ]);

    try {
      revalidateTag('contenido');
      revalidateTag('timeline');
      revalidatePath('/[locale]/historia', 'page');
      revalidatePath('/es/historia');
      revalidatePath('/en/historia');
      revalidatePath('/de/historia');
    } catch {}

    return NextResponse.json({
      success: true,
      hito: {
        id: hitoKey,
        anio,
        titulo: titulo_es,
        desc: desc_es,
        imagen: imagen ? cleanImageUrl(imagen) : '',
        generacion: genVal,
      },
    });
  } catch (error) {
    console.error('Error creating timeline hito:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
