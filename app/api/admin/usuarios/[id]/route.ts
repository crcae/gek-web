import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { id } = params;

    // Check count of admins to avoid deleting the only admin
    const totalAdmins = await prisma.adminUser.count();
    if (totalAdmins <= 1) {
      return NextResponse.json(
        { error: 'No puedes eliminar el único administrador existente.' },
        { status: 400 }
      );
    }

    const usuario = await prisma.adminUser.findUnique({ where: { id } });
    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Optional: prevent self-deletion if current session email is being deleted
    if (usuario.email.toLowerCase() === session.user.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'No puedes eliminar tu propia cuenta en sesión activa.' },
        { status: 400 }
      );
    }

    await prisma.adminUser.delete({ where: { id } });

    // Clean up from Supabase auth.users as well
    try {
      await prisma.$executeRawUnsafe(
        'DELETE FROM auth.users WHERE lower(email) = lower($1)',
        usuario.email
      );
    } catch (e) {
      console.warn('[UsuarioDelete] Error deleting from auth.users:', e);
    }

    return NextResponse.json({ ok: true, message: 'Administrador eliminado con éxito.' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al eliminar el administrador.' }, { status: 500 });
  }
}
