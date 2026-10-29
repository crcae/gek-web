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
    const { nombre, orden } = body;

    const dataToUpdate: any = {};
    if (nombre !== undefined) dataToUpdate.nombre = nombre.trim();
    if (orden !== undefined) dataToUpdate.orden = Number(orden);

    const categoria = await prisma.blogCategoria.update({
      where: { id },
      data: dataToUpdate,
    });

    try {
      revalidateTag('blog');
      revalidatePath('/[locale]/blog', 'page');
    } catch {}

    return NextResponse.json({ success: true, categoria });
  } catch (error) {
    console.error('Error updating blog categoria:', error);
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
    await prisma.blogCategoria.delete({
      where: { id },
    });

    try {
      revalidateTag('blog');
      revalidatePath('/[locale]/blog', 'page');
    } catch {}

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog categoria:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
