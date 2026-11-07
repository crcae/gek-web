import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendOtpEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';

function parseSupabaseError(errorMsg: string): string {
  const lower = errorMsg.toLowerCase();
  if (lower.includes('rate_limit') || lower.includes('rate limit') || lower.includes('over_email_send')) {
    return 'Límite de correos alcanzado en Supabase (máximo 30 correos por hora en el plan gratuito). Por favor espera unos minutos antes de intentar de nuevo.';
  }
  if (lower.includes('security purposes') || lower.includes('60 seconds') || lower.includes('wait')) {
    return 'Por seguridad, debes esperar 60 segundos entre cada solicitud de código.';
  }
  if (lower.includes('signups not allowed') || lower.includes('user not found')) {
    return 'La cuenta no está habilitada en el sistema de autenticación de Supabase.';
  }
  return `Error de Supabase al enviar correo: ${errorMsg}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawEmail = body?.email;

    if (!rawEmail || typeof rawEmail !== 'string') {
      return NextResponse.json(
        { error: 'Por favor ingresa un correo electrónico válido.' },
        { status: 400 }
      );
    }

    const email = rawEmail.trim().toLowerCase();

    // Verify user exists as an AdminUser in our database
    const user = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No se encontró ninguna cuenta de administrador asociada a este correo.' },
        { status: 404 }
      );
    }

    // Rate-limiting check: if a code was created less than 45 seconds ago
    if (user.otpExpires) {
      const remainingMs = user.otpExpires.getTime() - Date.now();
      const elapsedMs = 10 * 60 * 1000 - remainingMs;
      if (elapsedMs < 45 * 1000 && elapsedMs > 0) {
        const waitSeconds = Math.ceil((45 * 1000 - elapsedMs) / 1000);
        return NextResponse.json(
          { error: `Por favor espera ${waitSeconds} segundos antes de solicitar otro código.` },
          { status: 429 }
        );
      }
    }

    // Determine current origin for email redirection
    const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'https://gek-web.vercel.app';
    const redirectUrl = `${origin}/admin/login`;

    // 1. Try Supabase Auth Free Tier if configured
    let sentViaSupabase = false;
    let supaFailureReason = '';

    if (supabase) {
      try {
        const { error: supaError } = await supabase.auth.signInWithOtp({
          email: user.email,
          options: {
            shouldCreateUser: false,
            emailRedirectTo: redirectUrl,
          },
        });

        if (!supaError) {
          sentViaSupabase = true;
          console.log(`✅ [Supabase Auth] Código OTP despachado por correo a ${user.email}`);
        } else {
          supaFailureReason = parseSupabaseError(supaError.message);
          console.warn('⚠️ [Supabase Auth] Advertencia al enviar OTP:', supaError.message);
        }
      } catch (err: any) {
        supaFailureReason = parseSupabaseError(err?.message || 'Error de conexión');
        console.warn('⚠️ [Supabase Auth] Fallo conexión Auth:', err?.message || err);
      }
    }

    // 2. Generate local OTP as resilient guarantee / secondary channel (8 digits)
    const code = Math.floor(10000000 + Math.random() * 90000000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to DB
    await prisma.adminUser.update({
      where: { id: user.id },
      data: {
        otpCode: code,
        otpExpires: expiresAt,
        otpAttempts: 0,
      },
    });

    // 3. Attempt sending via SMTP / Resend
    const mailResult = await sendOtpEmail({ email: user.email, code });

    // 4. Verify if any email provider actually sent the message
    const actuallySent = sentViaSupabase || mailResult.sent;

    if (!actuallySent) {
      // In local dev, allow proceed only if in non-production
      if (process.env.NODE_ENV !== 'production' && mailResult.devMode) {
        return NextResponse.json({
          success: true,
          message: 'Código generado en modo desarrollo (revisa la consola del servidor).',
          devMode: true,
        });
      }

      // In production, provide the exact reason why the email was not sent
      const reason = supaFailureReason || mailResult.error || 'No se pudo enviar el correo de verificación debido a límites del servidor de correo.';
      return NextResponse.json(
        { error: reason },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Código de verificación enviado exitosamente a tu bandeja de entrada.',
      provider: sentViaSupabase ? 'supabase' : 'smtp',
    });
  } catch (error: any) {
    console.error('Error en send-otp:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar la solicitud. Intenta de nuevo.' },
      { status: 500 }
    );
  }
}
