'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { createPortal } from 'react-dom';
import { Plus, Trash2, X, Upload, Loader2, Settings } from 'lucide-react';
import { VisualEditable } from '@/components/admin/VisualEditable';

const CLIENTES_FALLBACK = [
  'S*Mart', 'Soriana', 'Merco', 'Río Produce', 'Mega Produce',
  'Amore Produce', 'Anavale', 'Art Mr.', 'Comercial Mexicana', 'HBE',
  'Mi Tienda del Ahorro', 'Peakopia Produce', 'Jovi Fresh',
  'Dallas Fresh Produce', 'Jose Luna Produce', 'Ergo Produce',
  'Carnicerías San Juan', 'Carnicerías Ramos',
];

interface LogoItem {
  id: string;
  nombre: string;
  url?: string;
}

interface ClientesSectionProps {
  logos?: LogoItem[];
  eyebrow: string;
  titulo: string;
  eyebrowId?: string;
  tituloId?: string;
}

export function ClientesSection({
  logos = [],
  eyebrow,
  titulo,
  eyebrowId = 'home.clientes_eyebrow',
  tituloId = 'home.clientes_titulo',
}: ClientesSectionProps) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [logoList, setLogoList] = useState<LogoItem[]>(logos);
  const [newNombre, setNewNombre] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    setLogoList(logos);
  }, [logos]);

  const handleUploadAndSave = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!newNombre.trim()) {
      setErrorMsg('Por favor ingresa un nombre para el cliente antes de subir el logo');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    setUploading(true);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('nombre', newNombre.trim());

    try {
      const res = await fetch('/api/admin/clientes', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error al subir logo');
      }

      const newLogo = await res.json();
      setLogoList((prev) => [...prev, newLogo]);
      setNewNombre('');
      // Trigger a page refresh to keep server components sync'd
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar el logo');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;
    setDeletingId(id);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/admin/clientes/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Error al eliminar cliente');
      }

      setLogoList((prev) => prev.filter((item) => item.id !== id));
      // Refresh page to keep list sync'd
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al eliminar');
    } finally {
      setDeletingId(null);
    }
  };

  const items: LogoItem[] = logoList && logoList.length > 0
    ? logoList
    : CLIENTES_FALLBACK.map((name, i) => ({ id: `fallback-${i}`, nombre: name }));

  const doubled = [...items, ...items];

  return (
    <section id="clientes" className="w-full bg-white py-16 relative overflow-hidden border-t-[3px] border-brand-green">
      {/* Decorative watermark placeholder (truck image removed) */}

      <div className="max-w-7xl mx-auto px-6 mb-12 text-center relative z-10">
        <VisualEditable id={eyebrowId} label="Copete / Eyebrow (Nuestros Clientes)">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-green block mb-2">
            {eyebrow}
          </span>
        </VisualEditable>
        
        <VisualEditable id={tituloId} label="Título Principal (Nuestros Clientes)">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-navy">
            {titulo}
          </h2>
        </VisualEditable>

        {/* Floating Settings Gear to manage collection of client logos */}
        {session && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-brand-navy hover:bg-brand-green text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-all duration-200 border border-brand-green/30"
            >
              <Settings className="w-3.5 h-3.5" />
              Administrar Clientes
            </button>
          </div>
        )}
      </div>

      {/* Infinite Carousel Container */}
      <div className="w-full overflow-hidden py-4">
        <div className="logos-track">
          {doubled.map((client, idx) => (
            <div
              key={`${client.id}-${idx}`}
              className="shrink-0 w-[240px] h-[108px] flex items-center justify-center select-none"
            >
              {client.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={client.url}
                  alt={client.nombre}
                  className="max-w-[180px] max-h-[78px] object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full px-3">
                  <span className="font-bold text-brand-navy text-[13px] leading-tight line-clamp-2 text-center">
                    {client.nombre}
                  </span>
                  <span className="text-[10px] text-brand-green font-bold mt-0.5 tracking-wider uppercase">
                    GEC
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Management Modal */}
      {mounted && modalOpen && createPortal(
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm text-gray-800">
          <div className="bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-brand-navy text-white flex items-center justify-between">
              <div>
                <h3 className="text-md font-bold font-display uppercase tracking-wider text-brand-green">Administrar Clientes</h3>
                <p className="text-xs text-white/60">Gestionar logos del carrusel de inicio</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List & Upload Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Add New Client Form */}
              <div className="bg-gray-50 border border-gray-150 rounded-xl p-4 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Agregar Nuevo Cliente</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Nombre del cliente (ej. Walmart)"
                    value={newNombre}
                    onChange={(e) => setNewNombre(e.target.value)}
                    className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-green focus:outline-none bg-white text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading || !newNombre.trim()}
                    className="flex items-center justify-center gap-2 bg-[#4DB26B] hover:bg-[#43a060] text-white text-sm font-semibold px-4 py-2 rounded shadow-md disabled:opacity-50 min-h-[38px] shrink-0"
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {uploading ? 'Guardando...' : 'Subir Logo'}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    className="hidden"
                    onChange={handleUploadAndSave}
                  />
                </div>
              </div>

              {/* Client List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Clientes Actuales</h4>
                
                {logoList.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No hay logos cargados en la base de datos (se muestran fallbacks).</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {logoList.map((client) => (
                      <div
                        key={client.id}
                        className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow"
                      >
                        <div className="flex items-center gap-3">
                          {client.url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={client.url}
                              alt={client.nombre}
                              className="w-12 h-8 object-contain bg-gray-50 p-0.5 rounded border"
                            />
                          )}
                          <span className="text-xs font-bold font-display text-brand-navy truncate max-w-[150px]">
                            {client.nombre}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(client.id)}
                          disabled={deletingId === client.id}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                        >
                          {deletingId === client.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-150 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-brand-navy hover:bg-brand-green text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-md transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
