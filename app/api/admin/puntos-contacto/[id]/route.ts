import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidateTag, revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = params;
    const body = await req.json();
    const { texto, enlace, icono, orden, activo } = body;

    const dataToUpdate: any = {};
    if (texto !== undefined) dataToUpdate.texto = texto.trim();
    if (enlace !== undefined) dataToUpdate.enlace = enlace ? enlace.trim() : null;
    if (icono !== undefined) dataToUpdate.icono = icono.trim();
    if (orden !== undefined) dataToUpdate.orden = Number(orden);
    if (activo !== undefined) dataToUpdate.activo = Boolean(activo);

    const punto = await prisma.puntoContacto.update({
      where: { id },
      data: dataToUpdate,
    });

    try {
      revalidateTag('puntos-contacto');
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ success: true, punto });
  } catch (error) {
    console.error('Error updating punto contacto:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = params;
    await prisma.puntoContacto.delete({
      where: { id },
    });

    try {
      revalidateTag('puntos-contacto');
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting punto contacto:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
