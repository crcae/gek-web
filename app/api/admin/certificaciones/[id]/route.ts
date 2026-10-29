import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidateTag, revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';
import { cleanImageUrl } from '@/lib/cleanImageUrl';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const cert = await prisma.certificacion.findUnique({
      where: { id: params.id },
    });
    if (!cert) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(cert);
  } catch (error) {
    console.error('Error fetching certificacion:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const data: any = {};
    if (nombre !== undefined) data.nombre = nombre.trim();
    if (eyebrow !== undefined) data.eyebrow = eyebrow ? eyebrow.trim() : null;
    if (titulo_es !== undefined) data.titulo_es = titulo_es.trim();
    if (titulo_en !== undefined) data.titulo_en = titulo_en ? titulo_en.trim() : null;
    if (titulo_de !== undefined) data.titulo_de = titulo_de ? titulo_de.trim() : null;
    if (desc_es !== undefined) data.desc_es = desc_es ? desc_es.trim() : '';
    if (desc_en !== undefined) data.desc_en = desc_en ? desc_en.trim() : null;
    if (desc_de !== undefined) data.desc_de = desc_de ? desc_de.trim() : null;
    if (logoUrl !== undefined) data.logoUrl = cleanImageUrl(logoUrl);
    if (enlaceUrl !== undefined) data.enlaceUrl = enlaceUrl ? enlaceUrl.trim() : null;
    if (orden !== undefined) data.orden = Number(orden);
    if (activa !== undefined) data.activa = Boolean(activa);

    const updated = await prisma.certificacion.update({
      where: { id: params.id },
      data,
    });

    try {
      revalidateTag('certificaciones');
      revalidatePath('/[locale]/quienes-somos', 'page');
      revalidatePath('/es/quienes-somos');
      revalidatePath('/en/quienes-somos');
      revalidatePath('/de/quienes-somos');
    } catch {}

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating certificacion:', error);
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
    await prisma.certificacion.delete({
      where: { id: params.id },
    });

    try {
      revalidateTag('certificaciones');
      revalidatePath('/[locale]/quienes-somos', 'page');
      revalidatePath('/es/quienes-somos');
      revalidatePath('/en/quienes-somos');
      revalidatePath('/de/quienes-somos');
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting certificacion:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
