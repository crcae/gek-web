import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { valor_es, valor_en, valor_de } = body;

  if (!valor_es) {
    return NextResponse.json({ error: 'valor_es es obligatorio' }, { status: 400 });
  }

  const updated = await prisma.contenidoSitio.update({
    where: { id: params.id },
    data: { valor_es, valor_en: valor_en || null, valor_de: valor_de || null },
  });

  // Revalidar cache de contenido
  revalidateTag('contenido');
  
  // Revalidar todas las páginas principales para todos los idiomas
  ['es', 'en', 'de'].forEach(locale => {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/quienes-somos`);
    revalidatePath(`/${locale}/historia`);
    revalidatePath(`/${locale}/holding`);
    revalidatePath(`/${locale}/contacto`);
  });

  return NextResponse.json({ ok: true, id: updated.id });
}
