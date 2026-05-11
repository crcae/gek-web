'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type LoginForm = { email: string; password: string };

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setError('');
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (res?.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-10">
          {/* Logo placeholder */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#2C3E4B] rounded-full flex items-center justify-center mb-3">
                <span className="text-[#4DB26B] font-bold text-xl">GEK</span>
              </div>
              {/* TODO: Reemplazar con <Image src="/images/logos/GrupoExportador_Logo2.png" width={160} height={60} alt="GEK" /> */}
              <p className="text-gray-400 text-xs">Panel de Administración</p>
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-800 text-center mb-8">
            Iniciar sesión
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                {...register('email', { required: true })}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DB26B] focus:border-transparent bg-gray-50"
                placeholder="admin@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                {...register('password', { required: true })}
                className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DB26B] focus:border-transparent bg-gray-50"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-md border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#4DB26B] text-white font-medium py-3 px-6 rounded-md hover:bg-[#43a060] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Verificando...' : 'Ingresar al panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
