import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidateTag, revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

const DEFAULT_CATEGORIAS = [
  'Agroindustria',
  'Innovación',
  'Sostenibilidad',
  'Holding GEC',
  'Eventos',
  'Exportación',
  'Responsabilidad Social',
];

export async function GET() {
  try {
    let categorias = await prisma.blogCategoria.findMany({
      orderBy: { orden: 'asc' },
    });

    if (categorias.length === 0) {
      // Also check existing blog posts for any categories already used
      const existingPosts = await prisma.blogPost.findMany({
        select: { categoria: true },
        distinct: ['categoria'],
      });

      const allCatNames = Array.from(
        new Set([
          ...DEFAULT_CATEGORIAS,
          ...existingPosts.map((p) => p.categoria).filter(Boolean),
        ])
      );

      for (let i = 0; i < allCatNames.length; i++) {
        await prisma.blogCategoria.upsert({
          where: { nombre: allCatNames[i] },
          create: { nombre: allCatNames[i], orden: i + 1 },
          update: {},
        });
      }

      categorias = await prisma.blogCategoria.findMany({
        orderBy: { orden: 'asc' },
      });
    }

    return NextResponse.json({ success: true, categorias });
  } catch (error) {
    console.error('Error fetching blog categorias:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { nombre, orden } = body;

    if (!nombre || !nombre.trim()) {
      return NextResponse.json({ error: 'El nombre de la categoría es requerido' }, { status: 400 });
    }

    const cleanName = nombre.trim();

    // Check if exists
    const existing = await prisma.blogCategoria.findUnique({
      where: { nombre: cleanName },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        categoria: existing,
        message: 'La categoría ya existe',
      });
    }

    // Default orden to next highest
    let orderNum = typeof orden === 'number' ? orden : 0;
    if (typeof orden !== 'number') {
      const maxItem = await prisma.blogCategoria.findFirst({
        orderBy: { orden: 'desc' },
        select: { orden: true },
      });
      orderNum = (maxItem?.orden ?? 0) + 1;
    }

    const categoria = await prisma.blogCategoria.create({
      data: {
        nombre: cleanName,
        orden: orderNum,
      },
    });

    try {
      revalidateTag('blog');
      revalidatePath('/[locale]/blog', 'page');
    } catch {}

    return NextResponse.json({ success: true, categoria });
  } catch (error) {
    console.error('Error creating blog categoria:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
