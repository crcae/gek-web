import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nombre, email, telefono, razonContacto, mensaje } = body;

    if (!nombre || !email || !razonContacto || !mensaje) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Guardar en BD siempre, sin importar si el email falla
    const nuevoMensaje = await prisma.mensajeContacto.create({
      data: {
        nombre,
        email,
        razonContacto,
        mensaje,
      },
    });

    // Enviar email (no fallar el request si el email falla)
    if (process.env.RESEND_API_KEY && process.env.EMAIL_DESTINO) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'Sitio Web GEK <noreply@grupoexportadordelcampo.com>',
          to: process.env.EMAIL_DESTINO,
          subject: `Nuevo mensaje de contacto — ${razonContacto}`,
          html: `
            <h2 style="color:#2C3E4B;">Nuevo mensaje desde el sitio web</h2>
            <table style="border-collapse:collapse;width:100%;font-family:sans-serif;">
              <tr><td style="padding:8px;font-weight:bold;">Nombre:</td><td style="padding:8px;">${nombre}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Email:</td><td style="padding:8px;">${email}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Teléfono:</td><td style="padding:8px;">${telefono || 'No proporcionado'}</td></tr>
              <tr><td style="padding:8px;font-weight:bold;">Razón:</td><td style="padding:8px;">${razonContacto}</td></tr>
            </table>
            <h3 style="color:#2C3E4B;">Mensaje:</h3>
            <p style="background:#f5f5f5;padding:16px;border-radius:4px;">${mensaje}</p>
            <hr/>
            <p style="color:#999;font-size:12px;">Mensaje guardado con ID: ${nuevoMensaje.id}</p>
          `,
        });
      } catch (emailError) {
        // El mensaje ya está en BD — solo loguear el error de email
        console.error('Email send failed (message saved in DB):', emailError);
      }
    }

    return NextResponse.json({ ok: true, id: nuevoMensaje.id });
  } catch (error) {
    console.error('Error in /api/contacto:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
