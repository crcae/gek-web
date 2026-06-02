import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const eventos = await prisma.evento.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(eventos);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { titulo, descripcion, fecha, lugar, industria, url, imagenUrl, activo } = body;

    if (!titulo || !fecha || !lugar) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const evento = await prisma.evento.create({
      data: {
        titulo,
        descripcion,
        fecha,
        lugar,
        industria,
        url,
        imagenUrl,
        activo: activo ?? true,
      },
    });

    return NextResponse.json(evento);
  } catch (error) {
    console.error('Error creating Evento:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
