'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Lock, Check, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';

export default function PerfilSeguridadPage() {
  const { data: session } = useSession();
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (nuevaPassword !== confirmarPassword) {
      setError('La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    if (nuevaPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/perfil/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passwordActual, nuevaPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar contraseña');
      }

      setSuccess('¡Contraseña actualizada exitosamente! Úsala en tu próximo inicio de sesión.');
      setPasswordActual('');
      setNuevaPassword('');
      setConfirmarPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1 text-brand-green font-bold text-xs uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          <span>Seguridad de la Cuenta</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-brand-navy font-display">
          Cambiar Contraseña de Administrador
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Actualiza tus credenciales de acceso para la cuenta <span className="font-semibold text-brand-navy">{session?.user?.email}</span>
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-sm font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-brand-green shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Contraseña Actual */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Contraseña Actual *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={passwordActual}
                onChange={(e) => setPasswordActual(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-brand-navy text-sm focus:bg-white focus:ring-2 focus:ring-brand-green focus:outline-none"
              />
            </div>
          </div>

          {/* Nueva Contraseña */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Nueva Contraseña (mínimo 6 caracteres) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-brand-navy text-sm focus:bg-white focus:ring-2 focus:ring-brand-green focus:outline-none"
              />
            </div>
          </div>

          {/* Confirmar Nueva Contraseña */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Confirmar Nueva Contraseña *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-brand-navy text-sm focus:bg-white focus:ring-2 focus:ring-brand-green focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-sm px-6 py-3 rounded-xl shadow transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Actualizando...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Actualizar Contraseña</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
