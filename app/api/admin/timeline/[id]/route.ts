import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidateTag, revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';
import { cleanImageUrl } from '@/lib/cleanImageUrl';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = params;
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

    const nextIndex = id.replace('hito', '');

    await prisma.$transaction([
      prisma.contenidoSitio.upsert({
        where: { id: `timeline.${id}.anio` },
        create: {
          id: `timeline.${id}.anio`,
          seccion: 'timeline',
          campo: `Hito ${nextIndex}: Año`,
          valor_es: anio ? anio.trim() : '',
          valor_en: anio ? anio.trim() : '',
          valor_de: anio ? anio.trim() : '',
        },
        update: { valor_es: anio ? anio.trim() : '' },
      }),
      prisma.contenidoSitio.upsert({
        where: { id: `timeline.${id}.titulo` },
        create: {
          id: `timeline.${id}.titulo`,
          seccion: 'timeline',
          campo: `Hito ${nextIndex}: Título`,
          valor_es: titulo_es ? titulo_es.trim() : '',
          valor_en: titulo_en ? titulo_en.trim() : titulo_es ? titulo_es.trim() : '',
          valor_de: titulo_de ? titulo_de.trim() : titulo_es ? titulo_es.trim() : '',
        },
        update: {
          valor_es: titulo_es ? titulo_es.trim() : '',
          valor_en: titulo_en !== undefined ? titulo_en.trim() : undefined,
          valor_de: titulo_de !== undefined ? titulo_de.trim() : undefined,
        },
      }),
      prisma.contenidoSitio.upsert({
        where: { id: `timeline.${id}.desc` },
        create: {
          id: `timeline.${id}.desc`,
          seccion: 'timeline',
          campo: `Hito ${nextIndex}: Descripción`,
          valor_es: desc_es ? desc_es.trim() : '',
          valor_en: desc_en ? desc_en.trim() : desc_es ? desc_es.trim() : '',
          valor_de: desc_de ? desc_de.trim() : desc_es ? desc_es.trim() : '',
        },
        update: {
          valor_es: desc_es ? desc_es.trim() : '',
          valor_en: desc_en !== undefined ? desc_en.trim() : undefined,
          valor_de: desc_de !== undefined ? desc_de.trim() : undefined,
        },
      }),
      prisma.contenidoSitio.upsert({
        where: { id: `timeline.${id}.imagen` },
        create: {
          id: `timeline.${id}.imagen`,
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
        where: { id: `timeline.${id}.generacion` },
        create: {
          id: `timeline.${id}.generacion`,
          seccion: 'timeline',
          campo: `Hito ${nextIndex}: Generación (1, 2, 3 o futuro)`,
          valor_es: generacion || '1',
          valor_en: generacion || '1',
          valor_de: generacion || '1',
        },
        update: {
          valor_es: generacion || '1',
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating timeline hito:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = params; // e.g. "hito20" or "hito5"
    if (!id || !id.startsWith('hito')) {
      return NextResponse.json({ error: 'ID de hito inválido' }, { status: 400 });
    }

    await prisma.contenidoSitio.deleteMany({
      where: {
        id: { startsWith: `timeline.${id}.` },
      },
    });

    try {
      revalidateTag('contenido');
      revalidateTag('timeline');
      revalidatePath('/[locale]/historia', 'page');
      revalidatePath('/es/historia');
      revalidatePath('/en/historia');
      revalidatePath('/de/historia');
    } catch {}

    return NextResponse.json({ success: true, deleted: id });
  } catch (error) {
    console.error('Error deleting timeline hito:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
