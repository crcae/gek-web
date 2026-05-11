import { NextResponse } from 'next/server';
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

  return NextResponse.json({ ok: true, id: unidad.id });
}
