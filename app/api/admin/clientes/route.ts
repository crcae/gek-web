import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';
import { put } from '@vercel/blob';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const logos = await prisma.clienteLogo.findMany({
    orderBy: { orden: 'asc' },
  });

  return NextResponse.json(logos);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const nombre = formData.get('nombre') as string;

    if (!file || !nombre) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Archivo muy grande (máx 5MB)' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const slug = Math.random().toString(36).slice(2);
    const filename = `clientes/${timestamp}-${slug}.${ext}`;

    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    // Count logos to assign default order
    const count = await prisma.clienteLogo.count();

    const logo = await prisma.clienteLogo.create({
      data: {
        nombre,
        url: blob.url,
        filename: blob.pathname,
        orden: count,
      },
    });

    return NextResponse.json(logo);
  } catch (error) {
    console.error('Upload logo error:', error);
    return NextResponse.json({ error: 'Error al subir logo de cliente' }, { status: 500 });
  }
}
