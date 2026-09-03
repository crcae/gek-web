import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const posts = await prisma.blogPost.findMany({
    orderBy: { fechaPublicacion: 'desc' },
  });

  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      slug,
      titulo_es,
      titulo_en,
      titulo_de,
      resumen_es,
      resumen_en,
      resumen_de,
      contenido_es,
      contenido_en,
      contenido_de,
      portadaUrl,
      categoria,
      autor,
      autorCargo,
      autorAvatar,
      destacado,
      publicado,
      fechaPublicacion,
    } = body;

    if (!titulo_es || !slug) {
      return NextResponse.json({ error: 'Título y slug son obligatorios' }, { status: 400 });
    }

    // Clean slug
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')
      .replace(/[^\w-]+/g, '');

    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json({ error: 'Ya existe un artículo con este slug/URL' }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        slug: cleanSlug,
        titulo_es,
        titulo_en: titulo_en || null,
        titulo_de: titulo_de || null,
        resumen_es: resumen_es || null,
        resumen_en: resumen_en || null,
        resumen_de: resumen_de || null,
        contenido_es: typeof contenido_es === 'string' ? contenido_es : JSON.stringify(contenido_es || []),
        contenido_en: contenido_en ? (typeof contenido_en === 'string' ? contenido_en : JSON.stringify(contenido_en)) : null,
        contenido_de: contenido_de ? (typeof contenido_de === 'string' ? contenido_de : JSON.stringify(contenido_de)) : null,
        portadaUrl: portadaUrl || null,
        categoria: categoria || 'Agroindustria',
        autor: autor || 'Grupo Exportador del Campo',
        autorCargo: autorCargo || null,
        autorAvatar: autorAvatar || null,
        destacado: !!destacado,
        publicado: publicado !== undefined ? !!publicado : true,
        fechaPublicacion: fechaPublicacion ? new Date(fechaPublicacion) : new Date(),
      },
    });

    ['es', 'en', 'de'].forEach((locale) => {
      revalidatePath(`/${locale}/blog`);
      revalidatePath(`/${locale}/blog/${cleanSlug}`);
      revalidatePath(`/${locale}`);
    });

    return NextResponse.json({ ok: true, id: post.id, slug: post.slug });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: error.message || 'Error al guardar el artículo' }, { status: 500 });
  }
}
