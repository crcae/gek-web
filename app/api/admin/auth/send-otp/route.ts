import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendOtpEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';

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
          console.log(`✅ [Supabase Auth] Código OTP despachado por correo vía Supabase Free Tier a ${user.email} con redirect a ${redirectUrl}`);
        } else {
          console.warn('⚠️ [Supabase Auth] Advertencia al enviar OTP:', supaError.message);
        }
      } catch (err: any) {
        console.warn('⚠️ [Supabase Auth] Fallo conexión Auth:', err?.message || err);
      }
    }

    // 2. Generate local OTP as resilient guarantee / dev console
    const code = Math.floor(100000 + Math.random() * 900000).toString();
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

    // Send the email via Nodemailer / SMTP or console log
    const mailResult = await sendOtpEmail({ email: user.email, code });

    return NextResponse.json({
      success: true,
      message: sentViaSupabase
        ? 'Código de verificación enviado a tu correo mediante Supabase.'
        : 'Código de verificación generado y enviado.',
      devMode: mailResult.devMode ?? false,
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
