import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const item = await prisma.contenidoSitio.findUnique({
    where: { id: params.id },
  });

  // If record is not in database yet, return a blank template instead of 404
  if (!item) {
    const parts = params.id.split('.');
    return NextResponse.json({
      id: params.id,
      seccion: parts[0] || 'general',
      campo: parts.slice(1).join('.') || 'campo',
      valor_es: '',
      valor_en: null,
      valor_de: null,
    });
  }

  return NextResponse.json(item);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { valor_es, valor_en, valor_de } = body;

  if (!valor_es) {
    return NextResponse.json({ error: 'valor_es es obligatorio' }, { status: 400 });
  }

  const parts = params.id.split('.');
  const seccion = parts[0] || 'general';
  const campo = parts.slice(1).join('.') || 'campo';

  // Use upsert so that newly registered keys that don't exist in DB yet are created on save
  const updated = await prisma.contenidoSitio.upsert({
    where: { id: params.id },
    create: {
      id: params.id,
      seccion,
      campo,
      valor_es,
      valor_en: valor_en || null,
      valor_de: valor_de || null,
    },
    update: {
      valor_es,
      valor_en: valor_en || null,
      valor_de: valor_de || null,
    },
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
