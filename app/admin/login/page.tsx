'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import {
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  // State
  const OTP_LENGTH = 8;
  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Input refs for OTP digits
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown effect for resend cooldown
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Focus first OTP input when step changes to OTP
  useEffect(() => {
    if (step === 'OTP') {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Detect Magic Link access_token in URL hash (when clicking email link)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.replace(/^#/, ''));
    const accessToken = params.get('access_token');
    const errorDescription = params.get('error_description');

    if (errorDescription) {
      setError(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
      return;
    }

    if (accessToken && supabase) {
      setIsLoading(true);
      setError('');
      supabase.auth.getUser(accessToken).then(async ({ data, error: userError }) => {
        if (userError || !data?.user?.email) {
          setError('El enlace de acceso es inválido o ha expirado. Por favor solicita uno nuevo.');
          setIsLoading(false);
          return;
        }

        const userEmail = data.user.email.toLowerCase();
        setEmail(userEmail);

        const res = await signIn('credentials', {
          email: userEmail,
          supabaseToken: accessToken,
          redirect: false,
        });

        if (res?.ok) {
          window.location.href = '/admin/dashboard';
        } else {
          setError(res?.error || 'No tienes permisos de administrador con esta cuenta.');
          setIsLoading(false);
        }
      }).catch((err: any) => {
        setError(err?.message || 'Error al autenticar mediante el enlace.');
        setIsLoading(false);
      });
    }
  }, []);

  // 1. Send OTP Request
  const handleSendOtp = async (targetEmail?: string) => {
    const emailToSend = (targetEmail || email).trim().toLowerCase();
    if (!emailToSend) {
      setError('Por favor ingresa tu correo electrónico.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSend }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al enviar el código de verificación.');
      }

      setStep('OTP');
      setCooldown(60);
      setSuccessMsg('¡Código enviado exitosamente a tu bandeja de entrada!');
      setOtp(Array(OTP_LENGTH).fill(''));
    } catch (err: any) {
      setError(err?.message || 'No se pudo enviar el código. Verifica el correo ingresado.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/\D/g, '');
    const newOtp = [...otp];

    if (!cleanVal) {
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    // Set the digit
    newOtp[index] = cleanVal.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto-advance focus to next box
    if (index < OTP_LENGTH - 1 && cleanVal) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all digits filled, trigger verification automatically
    if (newOtp.every((digit) => digit !== '')) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  // Handle Backspace and Navigation
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste of OTP code
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;

    const newOtp = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, idx) => {
      if (idx < OTP_LENGTH) newOtp[idx] = char;
    });
    setOtp(newOtp);

    // Focus last filled or next
    const targetIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[targetIdx]?.focus();

    if (pasted.length >= 6) {
      handleVerifyOtp(pasted);
    }
  };

  // 3. Verify OTP via NextAuth credentials
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = (codeToVerify || otp.join('')).trim();
    if (code.length < 6) {
      setError('Por favor introduce el código completo de verificación.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        code,
        redirect: false,
      });

      if (res?.ok) {
        window.location.href = '/admin/dashboard';
      } else {
        const errorMsg =
          !res?.error || res.error === 'CredentialsSignin'
            ? 'Código de verificación incorrecto o expirado. Por favor intenta de nuevo.'
            : res.error;
        setError(errorMsg);
      }
    } catch (err: any) {
      setError('Error al conectar con el servidor. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c2418] via-[#163a28] to-[#1e4a34] flex items-center justify-center p-4 selection:bg-[#4DB26B]/30 selection:text-white">
      {/* Background Glow Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#4DB26B]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#2d6a4f]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 sm:p-10 transition-all duration-300">
          
          {/* Header Brand */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 mb-3 relative flex items-center justify-center rounded-2xl bg-[#0c2418]/5 p-2 border border-[#4DB26B]/20 shadow-inner">
              <Image
                src="/images/logos/GrupoExportador_Logo2.png"
                alt="Grupo Exportador del Campo"
                width={72}
                height={72}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              GRUPO EXPORTADOR DEL CAMPO
            </h1>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold uppercase tracking-wider text-[#2d6a4f]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4DB26B]" />
              <span>Acceso Seguro 2FA</span>
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/90 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3 shadow-sm animate-fadeIn">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && !error && (
            <div className="mb-6 p-4 bg-emerald-50/90 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-start gap-3 shadow-sm animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: Email Form */}
          {step === 'EMAIL' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendOtp();
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Correo del Administrador
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    placeholder="admin@grupoexportadordelcampo.com"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4DB26B] focus:border-transparent focus:bg-white text-sm transition-all"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Sin contraseñas. Te enviaremos un código de un solo uso por correo.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full mt-2 bg-[#1b4332] hover:bg-[#143225] text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group text-sm"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Enviando código...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar Código de Acceso</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP Form */}
          {step === 'OTP' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex p-3 rounded-full bg-emerald-50 text-[#1b4332] mb-3">
                  <KeyRound className="w-6 h-6 text-[#4DB26B]" />
                </div>
                <h2 className="text-base font-semibold text-gray-900">
                  Introduce el código de verificación
                </h2>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                  Enviado a <strong className="text-gray-800">{email}</strong>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStep('EMAIL');
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-[#2d6a4f] hover:text-[#1b4332] font-semibold hover:underline"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Cambiar correo
                </button>
              </div>

              {/* OTP Boxes (8 digits with 4-4 visual grouping) */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-4" onPaste={handlePaste}>
                {otp.slice(0, 4).map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-9 h-12 sm:w-11 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 border-gray-200 bg-gray-50/50 text-gray-900 focus:border-[#4DB26B] focus:bg-white focus:ring-4 focus:ring-[#4DB26B]/15 outline-none transition-all"
                  />
                ))}
                <span className="text-gray-300 font-bold text-lg select-none px-0.5">—</span>
                {otp.slice(4, 8).map((digit, relIdx) => {
                  const idx = relIdx + 4;
                  return (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-9 h-12 sm:w-11 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 border-gray-200 bg-gray-50/50 text-gray-900 focus:border-[#4DB26B] focus:bg-white focus:ring-4 focus:ring-[#4DB26B]/15 outline-none transition-all"
                    />
                  );
                })}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={isLoading || otp.filter(Boolean).length < 6}
                className="w-full bg-[#1b4332] hover:bg-[#143225] text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verificando código...</span>
                  </>
                ) : (
                  <span>Verificar e Ingresar al Panel</span>
                )}
              </button>

              {/* Resend Cooldown */}
              <div className="text-center pt-2">
                {cooldown > 0 ? (
                  <p className="text-xs text-gray-400">
                    Puedes solicitar otro código en{' '}
                    <span className="font-semibold text-gray-700">{cooldown}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={isLoading}
                    className="text-xs font-semibold text-[#2d6a4f] hover:text-[#1b4332] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>¿No recibiste el código? Reenviar</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400">
              Protegido con verificación en dos pasos (2FA) • Grupo Exportador del Campo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
