import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';
import { del } from '@vercel/blob';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const imagen = await prisma.imagenSitio.findUnique({
      where: { id: params.id },
    });

    if (!imagen) {
      return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 });
    }

    // Borrar de Vercel Blob
    try {
      await del(imagen.url);
    } catch (err) {
      console.warn('Could not delete from Blob (may not exist):', err);
    }

    // Borrar registro de BD
    await prisma.imagenSitio.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Error al eliminar imagen' }, { status: 500 });
  }
}
