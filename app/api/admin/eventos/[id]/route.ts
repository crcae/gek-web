import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
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
    const { titulo, descripcion, fecha, lugar, industria, url, imagenUrl, activo } = body;

    if (!titulo || !fecha || !lugar) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const updated = await prisma.evento.update({
      where: { id },
      data: {
        titulo,
        descripcion,
        fecha,
        lugar,
        industria,
        url,
        imagenUrl,
        activo,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating Evento:', error);
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
    const { id } = params;
    await prisma.evento.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Evento:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
