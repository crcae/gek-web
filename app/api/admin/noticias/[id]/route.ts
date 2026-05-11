import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { titulo_es, linkedinEmbedUrl, publicada } = body;

  if (linkedinEmbedUrl && !linkedinEmbedUrl.startsWith('https://www.linkedin.com/embed/')) {
    return NextResponse.json({ error: 'URL de embed no válida' }, { status: 400 });
  }

  const dataToUpdate: any = {};
  if (titulo_es !== undefined) dataToUpdate.titulo_es = titulo_es;
  if (linkedinEmbedUrl !== undefined) dataToUpdate.linkedinEmbedUrl = linkedinEmbedUrl;
  if (publicada !== undefined) dataToUpdate.publicada = !!publicada;

  const noticia = await prisma.noticia.update({
    where: { id: params.id },
    data: dataToUpdate,
  });

  // Revalidar noticias
  revalidateTag('noticias');
  
  // Revalidar home (donde se ven las noticias)
  ['es', 'en', 'de'].forEach(locale => {
    revalidatePath(`/${locale}`);
  });

  return NextResponse.json({ ok: true, id: noticia.id });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.noticia.delete({ where: { id: params.id } });

  // Revalidar noticias
  revalidateTag('noticias');
  
  // Revalidar home
  ['es', 'en', 'de'].forEach(locale => {
    revalidatePath(`/${locale}`);
  });

  return NextResponse.json({ ok: true });
}
