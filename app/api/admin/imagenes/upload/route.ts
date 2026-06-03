import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { writeFileSync, mkdirSync } from 'fs';
import { join, extname } from 'path';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const carpeta = formData.get('carpeta') as string;
    const nombreFijo = formData.get('nombreFijo') as string | null; // para imagen única

    if (!file || !carpeta) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Seguridad: sin path traversal
    if (carpeta.includes('..') || carpeta.startsWith('/')) {
      return NextResponse.json({ error: 'Carpeta inválida' }, { status: 400 });
    }

    const MAX_SIZE = 8 * 1024 * 1024; // 8MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Archivo muy grande (máx 8MB)' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Formato no permitido (JPG, PNG, WebP)' }, { status: 400 });
    }

    const ext = extname(file.name) || '.jpg';
    // nombreFijo: para imágenes únicas (ceo.jpg, franja-inicio.jpg)
    // Sin nombreFijo: nombre único con timestamp para imágenes múltiples
    const filename = nombreFijo
      ? nombreFijo
      : `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    const dir = join(process.cwd(), 'public/images', carpeta);
    mkdirSync(dir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(join(dir, filename), buffer);

    const url = `/images/${carpeta}/${filename}`;
    return NextResponse.json({ url, filename });
  } catch (error) {
    console.error('Upload local error:', error);
    return NextResponse.json({ error: 'Error al guardar imagen' }, { status: 500 });
  }
}
