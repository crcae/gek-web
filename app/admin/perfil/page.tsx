'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  Mail,
  User,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Lock,
  Server,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';

interface AdminUserItem {
  id: string;
  email: string;
  nombre: string | null;
  createdAt: string;
}

export default function PerfilSeguridadPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;

  // Tabs
  const [activeTab, setActiveTab] = useState<'USUARIOS' | 'SMTP' | 'PASSWORD'>('USUARIOS');

  // Admin users list state
  const [usuarios, setUsuarios] = useState<AdminUserItem[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newNombre, setNewNombre] = useState('');
  const [userActionLoading, setUserActionLoading] = useState(false);
  const [userMsg, setUserMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password change state
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Copied indicator for env snippets
  const [copiedEnv, setCopiedEnv] = useState(false);

  // Fetch admin users
  const fetchUsuarios = async () => {
    try {
      setLoadingUsuarios(true);
      const res = await fetch('/api/admin/usuarios');
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Handle Add Admin User
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserMsg(null);
    setUserActionLoading(true);

    try {
      const res = await fetch('/api/admin/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, nombre: newNombre }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al agregar el administrador.');
      }

      setUserMsg({ type: 'success', text: `¡Correo ${newEmail} autorizado exitosamente!` });
      setNewEmail('');
      setNewNombre('');
      setShowAddModal(false);
      fetchUsuarios();
    } catch (err: any) {
      setUserMsg({ type: 'error', text: err?.message || 'Error al agregar usuario.' });
    } finally {
      setUserActionLoading(false);
    }
  };

  // Handle Delete Admin User
  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`¿Estás seguro de que deseas revocar el acceso a "${email}"? Ya no podrá ingresar al panel.`)) {
      return;
    }

    setUserMsg(null);
    try {
      const res = await fetch(`/api/admin/usuarios/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al eliminar usuario.');
      }

      setUserMsg({ type: 'success', text: `Acceso revocado para ${email}.` });
      fetchUsuarios();
    } catch (err: any) {
      setUserMsg({ type: 'error', text: err?.message || 'Error al eliminar usuario.' });
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (nuevaPassword !== confirmarPassword) {
      setPassMsg({ type: 'error', text: 'La nueva contraseña y su confirmación no coinciden.' });
      return;
    }

    if (nuevaPassword.length < 6) {
      setPassMsg({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    setPassLoading(true);

    try {
      const res = await fetch('/api/admin/perfil/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passwordActual, nuevaPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar contraseña.');
      }

      setPassMsg({ type: 'success', text: '¡Contraseña actualizada exitosamente!' });
      setPasswordActual('');
      setNuevaPassword('');
      setConfirmarPassword('');
    } catch (err: any) {
      setPassMsg({ type: 'error', text: err.message });
    } finally {
      setPassLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1 text-[#2d6a4f] font-bold text-xs uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4 text-[#4DB26B]" />
          <span>Control de Seguridad y Acceso</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-display">
          Seguridad y Administradores
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Gestiona qué correos tienen autorización para acceder al panel de administración y configura el envío gratuito de códigos 2FA.
        </p>
      </div>

      {/* 2FA Summary Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-emerald-50 rounded-2xl p-6 border border-emerald-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1b4332] text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-6 h-6 text-[#4DB26B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-base">Autenticación en 2 Pasos (2FA) Activa</h3>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                Seguro
              </span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mt-1 leading-relaxed">
              El panel no requiere contraseñas fijas: genera un código dinámico de 6 dígitos que llega al correo de los administradores autorizados.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('USUARIOS')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'USUARIOS'
              ? 'border-[#2d6a4f] text-[#1b4332]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Correos Autorizados ({usuarios.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SMTP')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'SMTP'
              ? 'border-[#2d6a4f] text-[#1b4332]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Envío Gratuito (Supabase / Gmail)</span>
        </button>

        <button
          onClick={() => setActiveTab('PASSWORD')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'PASSWORD'
              ? 'border-[#2d6a4f] text-[#1b4332]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Contraseña de Respaldo</span>
        </button>
      </div>

      {/* TAB 1: Authorized Emails / Admins */}
      {activeTab === 'USUARIOS' && (
        <div className="space-y-6">
          {userMsg && (
            <div
              className={`p-4 rounded-xl text-sm flex items-center gap-2 border ${
                userMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {userMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              <span>{userMsg.text}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Correos que pueden acceder al portal</h2>
              <p className="text-xs text-gray-500">
                Solo estos correos pueden solicitar códigos 2FA e ingresar al panel de administración.
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-[#1b4332] hover:bg-[#143225] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Agregar Correo</span>
            </button>
          </div>

          {/* List of Admins */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {loadingUsuarios ? (
              <div className="p-8 text-center text-gray-400 text-sm">Cargando administradores...</div>
            ) : usuarios.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No hay administradores registrados.</div>
            ) : (
              usuarios.map((u) => {
                const isCurrentSession =
                  session?.user?.email?.toLowerCase() === u.email.toLowerCase();

                return (
                  <div key={u.id} className="p-5 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm">
                        {u.nombre ? u.nombre.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">{u.email}</span>
                          {isCurrentSession && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                              Tu sesión actual
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {u.nombre || 'Administrador'} • Registrado el {new Date(u.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      {!isCurrentSession && usuarios.length > 1 && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.email)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Revocar acceso"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal to add admin email */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 text-base">Autorizar Nuevo Administrador</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="ejemplo@grupoexportadordelcampo.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#4DB26B] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Nombre o Identificador
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={newNombre}
                        onChange={(e) => setNewNombre(e.target.value)}
                        placeholder="Ej. Juan Pérez (Gerencia)"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#4DB26B] outline-none"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    Al guardar este correo, el usuario podrá ingresar a <span className="font-mono text-gray-600">/admin/login</span> y recibir los códigos de acceso 2FA.
                  </p>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={userActionLoading || !newEmail.trim()}
                      className="px-5 py-2.5 bg-[#1b4332] hover:bg-[#143225] text-white text-xs font-semibold rounded-xl shadow disabled:opacity-50 transition-all"
                    >
                      {userActionLoading ? 'Guardando...' : 'Autorizar Correo'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SMTP / Supabase Setup Guide */}
      {activeTab === 'SMTP' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>¿Cómo activar el envío de correos 100% gratis?</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                El proyecto ya está conectado a Supabase para la base de datos (<code className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded font-mono">znbnfiyvbdzwlmdztfdm</code>). Puedes usar el servicio de correo gratuito de Supabase o conectar un correo de Gmail / hosting.
              </p>
            </div>

            {/* Option A: Supabase Free Tier */}
            <div className="border border-emerald-300 rounded-xl p-5 bg-gradient-to-r from-emerald-50 to-teal-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1b4332] text-white text-xs flex items-center justify-center font-bold">1</span>
                  <h3 className="font-bold text-gray-900 text-sm">Opción Recomendada: Supabase Auth Free Tier (Sin Servidores Externos)</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  100% Gratuito
                </span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed pl-8">
                Supabase incluye su propio despachador de correos integrado para códigos de verificación (OTP). Solo necesitas tu clave <strong>anon</strong> de Supabase:
              </p>
              <ol className="text-xs text-gray-700 space-y-2 list-decimal list-inside pl-8 leading-relaxed">
                <li>
                  Entra a tu proyecto en{' '}
                  <a
                    href="https://supabase.com/dashboard/project/znbnfiyvbdzwlmdztfdm/settings/api"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold underline"
                  >
                    Supabase &gt; Project Settings &gt; API
                  </a>.
                </li>
                <li>Copia la clave <strong>anon (public)</strong> que empieza por <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 font-mono text-[11px]">eyJhbGciOi...</code></li>
                <li>Pégala en tu archivo <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-300 font-mono text-[11px]">.env</code>:</li>
              </ol>

              <div className="pl-8 pt-1">
                <pre className="bg-gray-900 text-emerald-400 p-3.5 rounded-xl text-xs font-mono overflow-x-auto shadow-inner">
{`NEXT_PUBLIC_SUPABASE_URL="https://znbnfiyvbdzwlmdztfdm.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_clave_anon_de_supabase_aqui"`}
                </pre>
              </div>
            </div>

            {/* Option B: Free Gmail App Password */}
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/70 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gray-700 text-white text-xs flex items-center justify-center font-bold">2</span>
                <h3 className="font-bold text-gray-900 text-sm">Opción Alternativa: Gmail Gratuito con Contraseña de Aplicación</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed pl-8">
                Si prefieres que los correos salgan desde tu propia cuenta de Gmail:
              </p>
              <ol className="text-xs text-gray-600 space-y-1.5 list-decimal list-inside pl-8 leading-relaxed">
                <li>Ve a <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-emerald-700 font-semibold underline">Google &gt; Seguridad</a> &gt; Verificación en 2 pasos &gt; <strong>Contraseñas de aplicaciones</strong>.</li>
                <li>Crea una para <code className="bg-white px-1 py-0.5 rounded border border-gray-300">GEC</code> y pega la clave de 16 caracteres en el <code className="bg-white px-1 py-0.5 rounded border border-gray-300">.env</code>:</li>
              </ol>

              <div className="pl-8 pt-1">
                <pre className="bg-gray-900 text-emerald-400 p-3.5 rounded-xl text-xs font-mono overflow-x-auto shadow-inner">
{`SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-correo@gmail.com"
SMTP_PASS="abcd efgh ijkl mnop"
SMTP_FROM='"Seguridad GEC" <tu-correo@gmail.com>'`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Backup Password Change */}
      {activeTab === 'PASSWORD' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Contraseña de Respaldo</h2>
            <p className="text-xs text-gray-500 mt-1">
              Opcionalmente puedes mantener una contraseña de respaldo para tu cuenta.
            </p>
          </div>

          {passMsg && (
            <div
              className={`p-4 rounded-xl text-sm flex items-center gap-2 border ${
                passMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {passMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
              <span>{passMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-5">
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
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#4DB26B] outline-none"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#4DB26B] outline-none"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#4DB26B] outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={passLoading}
                className="flex items-center gap-2 bg-[#1b4332] hover:bg-[#143225] text-white font-bold text-sm px-6 py-3 rounded-xl shadow transition-all disabled:opacity-50"
              >
                {passLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
