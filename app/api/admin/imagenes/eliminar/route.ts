import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { ruta } = await req.json();

    // Seguridad: solo rutas bajo /images/, sin path traversal
    if (!ruta?.startsWith('/images/') || ruta.includes('..')) {
      return NextResponse.json({ error: 'Ruta inválida' }, { status: 400 });
    }

    const absPath = join(process.cwd(), 'public', ruta);
    if (!existsSync(absPath)) {
      return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 });
    }

    unlinkSync(absPath);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error eliminando imagen:', error);
    return NextResponse.json({ error: 'No se pudo eliminar' }, { status: 500 });
  }
}
