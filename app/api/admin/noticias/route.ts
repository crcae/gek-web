import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { titulo_es, linkedinEmbedUrl, publicada } = body;

  if (!titulo_es || !linkedinEmbedUrl) {
    return NextResponse.json({ error: 'Título y URL son obligatorios.' }, { status: 400 });
  }

  if (!linkedinEmbedUrl.startsWith('https://www.linkedin.com/embed/')) {
    return NextResponse.json({ error: 'URL de embed no válida' }, { status: 400 });
  }

  const noticia = await prisma.noticia.create({
    data: { titulo_es, linkedinEmbedUrl, publicada: !!publicada },
  });

  return NextResponse.json({ ok: true, id: noticia.id });
}
