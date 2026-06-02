import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Resend } from 'resend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      nombre, 
      email, 
      tipo, 
      productos, 
      supplierType, 
      mercado, 
      volumen, 
      empresa, 
      whatsapp, 
      comentarios,
      razonContacto,
      mensaje 
    } = body;

    // If "tipo" is present, it's a Lead Pipeline form
    if (tipo) {
      if (!nombre || !email) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
      }

      // Products string: if list exists, save as string/JSON string
      let prodString = '';
      if (Array.isArray(productos)) {
        prodString = JSON.stringify(productos);
      } else if (supplierType) {
        prodString = JSON.stringify([`Proveedor: ${supplierType}`]);
      }

      const nuevoLead = await prisma.lead.create({
        data: {
          tipo: String(tipo),
          productos: prodString,
          mercado: Array.isArray(mercado) ? JSON.stringify(mercado) : (mercado ? String(mercado) : ''),
          volumen: volumen ? String(volumen) : '',
          nombre: String(nombre),
          empresa: empresa ? String(empresa) : '',
          email: String(email),
          whatsapp: whatsapp ? String(whatsapp) : '',
          comentarios: comentarios ? String(comentarios) : '',
        },
      });

      // Send email
      if (process.env.RESEND_API_KEY && process.env.EMAIL_DESTINO) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: 'Sitio Web GEK <noreply@grupoexportadordelcampo.com>',
            to: process.env.EMAIL_DESTINO,
            subject: `Nuevo Lead Registrado — ${tipo}`,
            html: `
              <h2 style="color:#4DB26B;">Nuevo Lead en Pipeline</h2>
              <table style="border-collapse:collapse;width:100%;font-family:sans-serif;">
                <tr><td style="padding:8px;font-weight:bold;">Nombre:</td><td style="padding:8px;">${nombre}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Email:</td><td style="padding:8px;">${email}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">WhatsApp:</td><td style="padding:8px;">${whatsapp || 'N/A'}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Empresa:</td><td style="padding:8px;">${empresa || 'N/A'}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Tipo Lead:</td><td style="padding:8px;">${tipo}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Productos:</td><td style="padding:8px;">${prodString}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Mercado/Destino:</td><td style="padding:8px;">${JSON.stringify(mercado)}</td></tr>
                <tr><td style="padding:8px;font-weight:bold;">Volumen:</td><td style="padding:8px;">${volumen || 'N/A'}</td></tr>
              </table>
              <h3 style="color:#2C3E4B;">Comentarios:</h3>
              <p style="background:#f5f5f5;padding:16px;border-radius:4px;">${comentarios || 'N/A'}</p>
            `,
          });
        } catch (emailError) {
          console.error('Email send failed for lead:', emailError);
        }
      }

      return NextResponse.json({ ok: true, id: nuevoLead.id });
    }

    // Classic Contact Form fallback
    if (!nombre || !email || !razonContacto || !mensaje) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const nuevoMensaje = await prisma.mensajeContacto.create({
      data: {
        nombre,
        email,
        razonContacto,
        mensaje,
      },
    });

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
              <tr><td style="padding:8px;font-weight:bold;">Razón:</td><td style="padding:8px;">${razonContacto}</td></tr>
            </table>
            <h3 style="color:#2C3E4B;">Mensaje:</h3>
            <p style="background:#f5f5f5;padding:16px;border-radius:4px;">${mensaje}</p>
          `,
        });
      } catch (emailError) {
        console.error('Email send failed:', emailError);
      }
    }

    return NextResponse.json({ ok: true, id: nuevoMensaje.id });
  } catch (error) {
    console.error('Error in /api/contacto:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
