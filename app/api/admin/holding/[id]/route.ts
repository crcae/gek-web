import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { nameEs, nameEn, nameDe, location, orden, activa } = body;

  const unidad = await prisma.unidadNegocio.update({
    where: { id: params.id },
    data: { nameEs, nameEn, nameDe, location, orden: Number(orden), activa: !!activa },
  });

  // Revalidar unidades
  revalidateTag('unidades');
  
  // Revalidar página de holding
  ['es', 'en', 'de'].forEach(locale => {
    revalidatePath(`/${locale}/holding`);
  });

  return NextResponse.json({ ok: true, id: unidad.id });
}
