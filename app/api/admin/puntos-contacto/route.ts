import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidateTag, revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const puntos = await prisma.puntoContacto.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
    });
    return NextResponse.json({ success: true, puntos });
  } catch (error) {
    console.error('Error fetching puntos contacto:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { texto, enlace, icono, orden, activo } = body;

    if (!texto || !texto.trim()) {
      return NextResponse.json({ error: 'El texto es requerido' }, { status: 400 });
    }

    // Default orden to next highest
    let orderNum = typeof orden === 'number' ? orden : 0;
    if (typeof orden !== 'number') {
      const maxItem = await prisma.puntoContacto.findFirst({
        orderBy: { orden: 'desc' },
        select: { orden: true },
      });
      orderNum = (maxItem?.orden ?? 0) + 1;
    }

    const punto = await prisma.puntoContacto.create({
      data: {
        texto: texto.trim(),
        enlace: enlace ? enlace.trim() : null,
        icono: icono ? icono.trim() : 'MapPin',
        orden: orderNum,
        activo: activo !== undefined ? Boolean(activo) : true,
      },
    });

    try {
      revalidateTag('puntos-contacto');
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ success: true, punto });
  } catch (error) {
    console.error('Error creating punto contacto:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
