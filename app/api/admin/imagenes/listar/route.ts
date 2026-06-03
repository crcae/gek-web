import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const carpeta = searchParams.get('carpeta');
  if (!carpeta) return NextResponse.json({ imagenes: [] });

  // Seguridad: no permitir path traversal
  if (carpeta.includes('..') || carpeta.startsWith('/')) {
    return NextResponse.json({ error: 'Carpeta inválida' }, { status: 400 });
  }

  try {
    const dir = join(process.cwd(), 'public/images', carpeta);
    if (!existsSync(dir)) return NextResponse.json({ imagenes: [] });

    const archivos = readdirSync(dir)
      .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .sort()
      .map(f => `/images/${carpeta}/${f}`);

    return NextResponse.json({ imagenes: archivos });
  } catch {
    return NextResponse.json({ imagenes: [] });
  }
}
