import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    const currentPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!currentPost) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    // Clean slug
    const cleanSlug = slug
      ? slug.toLowerCase().trim().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '')
      : currentPost.slug;

    // Check slug clash if changed
    if (cleanSlug !== currentPost.slug) {
      const existing = await prisma.blogPost.findUnique({
        where: { slug: cleanSlug },
      });
      if (existing && existing.id !== params.id) {
        return NextResponse.json({ error: 'Ya existe otro artículo con este slug' }, { status: 400 });
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        slug: cleanSlug,
        titulo_es: titulo_es !== undefined ? titulo_es : currentPost.titulo_es,
        titulo_en: titulo_en !== undefined ? (titulo_en || null) : currentPost.titulo_en,
        titulo_de: titulo_de !== undefined ? (titulo_de || null) : currentPost.titulo_de,
        resumen_es: resumen_es !== undefined ? (resumen_es || null) : currentPost.resumen_es,
        resumen_en: resumen_en !== undefined ? (resumen_en || null) : currentPost.resumen_en,
        resumen_de: resumen_de !== undefined ? (resumen_de || null) : currentPost.resumen_de,
        contenido_es: contenido_es !== undefined 
          ? (typeof contenido_es === 'string' ? contenido_es : JSON.stringify(contenido_es)) 
          : currentPost.contenido_es,
        contenido_en: contenido_en !== undefined 
          ? (contenido_en ? (typeof contenido_en === 'string' ? contenido_en : JSON.stringify(contenido_en)) : null) 
          : currentPost.contenido_en,
        contenido_de: contenido_de !== undefined 
          ? (contenido_de ? (typeof contenido_de === 'string' ? contenido_de : JSON.stringify(contenido_de)) : null) 
          : currentPost.contenido_de,
        portadaUrl: portadaUrl !== undefined ? (portadaUrl || null) : currentPost.portadaUrl,
        categoria: categoria !== undefined ? categoria : currentPost.categoria,
        autor: autor !== undefined ? autor : currentPost.autor,
        autorCargo: autorCargo !== undefined ? (autorCargo || null) : currentPost.autorCargo,
        autorAvatar: autorAvatar !== undefined ? (autorAvatar || null) : currentPost.autorAvatar,
        destacado: destacado !== undefined ? !!destacado : currentPost.destacado,
        publicado: publicado !== undefined ? !!publicado : currentPost.publicado,
        fechaPublicacion: fechaPublicacion ? new Date(fechaPublicacion) : currentPost.fechaPublicacion,
      },
    });

    ['es', 'en', 'de'].forEach((locale) => {
      revalidatePath(`/${locale}/blog`);
      revalidatePath(`/${locale}/blog/${cleanSlug}`);
      if (currentPost.slug !== cleanSlug) {
        revalidatePath(`/${locale}/blog/${currentPost.slug}`);
      }
      revalidatePath(`/${locale}`);
    });

    return NextResponse.json({ ok: true, post: updated });
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: error.message || 'Error al actualizar el artículo' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 });
    }

    await prisma.blogPost.delete({
      where: { id: params.id },
    });

    ['es', 'en', 'de'].forEach((locale) => {
      revalidatePath(`/${locale}/blog`);
      revalidatePath(`/${locale}/blog/${post.slug}`);
      revalidatePath(`/${locale}`);
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: error.message || 'Error al eliminar el artículo' }, { status: 500 });
  }
}
