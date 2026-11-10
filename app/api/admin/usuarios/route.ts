import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';
import { syncUserToSupabaseAuth } from '@/lib/supabase-auth-sync';

// GET: List all admin users
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const usuarios = await prisma.adminUser.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(usuarios);
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener usuarios administradores' }, { status: 500 });
  }
}

// POST: Add new admin user
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const rawEmail = body?.email;
    const nombre = body?.nombre ? String(body.nombre).trim() : 'Administrador';

    if (!rawEmail || typeof rawEmail !== 'string') {
      return NextResponse.json({ error: 'El correo electrónico es requerido.' }, { status: 400 });
    }

    const email = rawEmail.trim().toLowerCase();

    // Check if email already exists
    const existing = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe un administrador registrado con este correo.' },
        { status: 400 }
      );
    }

    const nuevoUsuario = await prisma.adminUser.create({
      data: {
        email,
        nombre,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        createdAt: true,
      },
    });

    // Automatically synchronize user into Supabase auth.users & identities
    await syncUserToSupabaseAuth(email);

    return NextResponse.json({ ok: true, usuario: nuevoUsuario });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Error interno al agregar el nuevo administrador.' },
      { status: 500 }
    );
  }
}
