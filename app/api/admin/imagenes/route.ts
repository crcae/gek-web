import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';
import { put } from '@vercel/blob';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const seccion = searchParams.get('seccion');

  const imagenes = await prisma.imagenSitio.findMany({
    where: seccion ? { seccion } : {},
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(imagenes);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const seccion = formData.get('seccion') as string;
    const nombre = formData.get('nombre') as string;

    if (!file || !seccion || !nombre) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Validaciones
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Archivo muy grande (máx 5MB)' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Formato no permitido (JPG, PNG, WebP)' }, { status: 400 });
    }

    // Generar nombre único
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const slug = Math.random().toString(36).slice(2);
    const filename = `${seccion}/${timestamp}-${slug}.${ext}`;

    // Subir a Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    // Guardar en BD
    const imagen = await prisma.imagenSitio.create({
      data: {
        seccion,
        nombre,
        filename: blob.pathname,
        url: blob.url, // URL permanente de Vercel Blob
      },
    });

    return NextResponse.json(imagen);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 });
  }
}
