import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { passwordActual, nuevaPassword } = body;

    if (!passwordActual || !nuevaPassword) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    if (nuevaPassword.length < 6) {
      return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const validCurrent = await bcrypt.compare(passwordActual, user.password);
    if (!validCurrent) {
      return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(nuevaPassword, 10);
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return NextResponse.json({ ok: true, message: 'Contraseña actualizada correctamente' });
  } catch (err: any) {
    console.error('Error changing password:', err);
    return NextResponse.json({ error: 'Error interno al actualizar la contraseña' }, { status: 500 });
  }
}
