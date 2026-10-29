import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidateTag, revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';
import { cleanImageUrl } from '@/lib/cleanImageUrl';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const certs = await prisma.certificacion.findMany({
      orderBy: { orden: 'asc' },
    });
    return NextResponse.json(certs);
  } catch (error) {
    console.error('Error fetching certificaciones:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      nombre,
      eyebrow,
      titulo_es,
      titulo_en,
      titulo_de,
      desc_es,
      desc_en,
      desc_de,
      logoUrl,
      enlaceUrl,
      orden,
      activa,
    } = body;

    if (!nombre || !titulo_es || !logoUrl) {
      return NextResponse.json(
        { error: 'Nombre, título (español) y logo son obligatorios' },
        { status: 400 }
      );
    }

    const count = await prisma.certificacion.count();

    const nueva = await prisma.certificacion.create({
      data: {
        nombre: nombre.trim(),
        eyebrow: eyebrow ? eyebrow.trim() : null,
        titulo_es: titulo_es.trim(),
        titulo_en: titulo_en ? titulo_en.trim() : null,
        titulo_de: titulo_de ? titulo_de.trim() : null,
        desc_es: desc_es ? desc_es.trim() : '',
        desc_en: desc_en ? desc_en.trim() : null,
        desc_de: desc_de ? desc_de.trim() : null,
        logoUrl: cleanImageUrl(logoUrl),
        enlaceUrl: enlaceUrl ? enlaceUrl.trim() : null,
        orden: typeof orden === 'number' ? orden : count,
        activa: activa !== false,
      },
    });

    try {
      revalidateTag('certificaciones');
      revalidatePath('/[locale]/quienes-somos', 'page');
      revalidatePath('/es/quienes-somos');
      revalidatePath('/en/quienes-somos');
      revalidatePath('/de/quienes-somos');
    } catch {}

    return NextResponse.json(nueva);
  } catch (error) {
    console.error('Error creating certificacion:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
