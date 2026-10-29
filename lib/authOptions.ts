import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        code: { label: 'Código OTP', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error('El correo electrónico es requerido.');
        }

        const email = credentials.email.trim().toLowerCase();
        const user = await prisma.adminUser.findUnique({ where: { email } });

        if (!user) {
          throw new Error('No existe una cuenta de administrador con este correo.');
        }

        // Method 1: 2FA OTP Code Verification (Primary)
        if (credentials.code) {
          const inputCode = credentials.code.trim();

          // 1a. Try verifying via Supabase Auth if configured
          if (supabase) {
            try {
              const { data: supaData, error: supaErr } = await supabase.auth.verifyOtp({
                email: user.email,
                token: inputCode,
                type: 'email',
              });

              if (!supaErr && supaData?.user) {
                // Clear any pending DB OTP
                await prisma.adminUser.update({
                  where: { id: user.id },
                  data: { otpCode: null, otpExpires: null, otpAttempts: 0 },
                });
                return { id: user.id, email: user.email, name: user.nombre ?? 'Admin' };
              }
            } catch (supaException) {
              console.warn('Supabase verifyOtp exception:', supaException);
            }
          }

          // 1b. Verify via local database OTP
          if (user.otpAttempts >= 5) {
            throw new Error('Has superado el límite de intentos. Solicita un nuevo código.');
          }

          if (!user.otpCode || !user.otpExpires) {
            throw new Error('No hay ningún código activo. Solicita un nuevo código.');
          }

          if (new Date() > user.otpExpires) {
            throw new Error('El código ha expirado. Por favor solicita uno nuevo.');
          }

          if (user.otpCode !== inputCode) {
            await prisma.adminUser.update({
              where: { id: user.id },
              data: { otpAttempts: { increment: 1 } },
            });
            throw new Error('Código de verificación incorrecto. Intenta de nuevo.');
          }

          // OTP is valid! Clear it to prevent reuse
          await prisma.adminUser.update({
            where: { id: user.id },
            data: {
              otpCode: null,
              otpExpires: null,
              otpAttempts: 0,
            },
          });

          return { id: user.id, email: user.email, name: user.nombre ?? 'Admin' };
        }

        // Method 2: Legacy fallback if password provided
        if (credentials.password && user.password) {
          const valid = await bcrypt.compare(credentials.password, user.password);
          if (valid) {
            return { id: user.id, email: user.email, name: user.nombre ?? 'Admin' };
          }
          throw new Error('Contraseña incorrecta.');
        }

        throw new Error('Por favor ingresa tu código de verificación de 6 dígitos.');
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).id = token.id;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
