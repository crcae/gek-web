import nodemailer from 'nodemailer';

interface SendOtpOptions {
  email: string;
  code: string;
}

export async function sendOtpEmail({ email, code }: SendOtpOptions): Promise<{ success: boolean; devMode?: boolean; error?: string }> {
  // Always log to console with high visibility for testing / free local usage
  console.log('\n=============================================================');
  console.log('🔐 [GRUPO EXPORTADOR DEL CAMPO - CÓDIGO DE VERIFICACIÓN 2FA]');
  console.log(`👤 Destinatario: ${email}`);
  console.log(`🔢 Código OTP:   ${code}`);
  console.log(`⏰ Validez:      10 minutos`);
  console.log('=============================================================\n');

  // Check if SMTP or Gmail credentials exist
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || (process.env.GMAIL_USER ? 'smtp.gmail.com' : undefined);
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpFrom = process.env.SMTP_FROM || `"Seguridad GEC" <${smtpUser || 'seguridad@grupoexportadordelcampo.com'}>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <title>Código de verificación GEC</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f4f6f8; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #0d3520 0%, #175233 100%); padding: 36px 32px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">
                    GRUPO EXPORTADOR DEL CAMPO
                  </h1>
                  <p style="margin: 6px 0 0; color: #86efac; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
                    Panel de Administración
                  </p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 36px 32px; color: #1e293b;">
                  <h2 style="margin: 0 0 12px; font-size: 19px; font-weight: 600; color: #0f172a;">
                    Tu código de acceso seguro
                  </h2>
                  <p style="margin: 0 0 24px; font-size: 15px; line-height: 1.6; color: #475569;">
                    Hemos recibido una solicitud para iniciar sesión en el panel administrativo de Grupo Exportador del Campo. Ingresa el siguiente código de 6 dígitos:
                  </p>

                  <!-- OTP Box -->
                  <div style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #15803d; display: inline-block;">
                      ${code}
                    </span>
                  </div>

                  <p style="margin: 0 0 16px; font-size: 13px; color: #64748b; line-height: 1.5;">
                    ⏱️ Este código expira en <strong>10 minutos</strong> y es de un solo uso.
                  </p>
                  <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                    Si no solicitaste este código, por favor ignora este correo. Nadie del equipo de soporte te pedirá este código.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                    © ${new Date().getFullYear()} Grupo Exportador del Campo. Todos los derechos reservados.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: email,
        subject: `🔐 Tu código de verificación GEC: ${code}`,
        text: `Tu código de verificación para Grupo Exportador del Campo es: ${code}. Válido por 10 minutos.`,
        html: htmlContent,
      });

      return { success: true };
    } catch (err: any) {
      console.error('❌ Error enviando correo vía SMTP:', err?.message || err);
      // Return success with devMode true so user is not blocked and code was logged to console
      return { success: true, devMode: true, error: err?.message };
    }
  }

  // If no SMTP credentials are set yet, return success in devMode (code is visible in server logs)
  return { success: true, devMode: true };
}
