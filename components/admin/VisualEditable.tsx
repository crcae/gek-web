'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';
import { Pencil, Save, X, Loader2 } from 'lucide-react';
import { ImageSelectorField } from './ImageSelectorField';

interface VisualEditableProps {
  id: string;
  label: string;
  type?: 'text' | 'image' | 'video' | 'pdf';
  children: React.ReactNode;
  className?: string;
}

export function VisualEditable({ id, label, type = 'text', children, className = '' }: VisualEditableProps) {
  const { data: session } = useSession();
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [form, setForm] = useState({
    valor_es: '',
    valor_en: '',
    valor_de: '',
  });

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/contenido/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          valor_es: data.valor_es || '',
          valor_en: data.valor_en || '',
          valor_de: data.valor_de || '',
        });
      }
    } catch (err) {
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = (e: React.MouseEvent) => {
    console.log('VisualEditable: handleOpen clicked for field:', id);
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
    fetchContent();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/contenido/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setModalOpen(false);
        // Refresh page to load updated contents
        window.location.reload();
      }
    } catch (err) {
      console.error('Error saving content:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!session) {
    return <>{children}</>;
  }

  const isMediaField = type === 'image' || type === 'video' || type === 'pdf';

  return (
    <div
      className={`relative group/editable ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Visual Hover Highlights */}
      {hovered && (
        <div className="absolute -inset-1.5 border border-dashed border-brand-green bg-brand-green/5 rounded-lg pointer-events-none z-30 animate-pulse duration-700" />
      )}

      {/* Children elements */}
      {children}

      {/* Floating pencil edit button */}
      <button
        onClick={handleOpen}
        className="absolute top-2 right-2 bg-brand-navy hover:bg-brand-green text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform scale-0 group-hover/editable:scale-100 z-40 border border-brand-green/30"
        title={`Editar: ${label}`}
      >
        <Pencil className="w-4 h-4" />
      </button>

      {mounted && modalOpen && createPortal(
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm text-gray-800">
          <div className="bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 bg-brand-navy text-white flex items-center justify-between">
              <div>
                <h3 className="text-md font-bold font-display uppercase tracking-wider text-brand-green">Editar Contenido</h3>
                <p className="text-xs text-white/60 font-mono mt-0.5">{id}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Field Form */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-blue-50 border border-blue-150 rounded-lg p-3 text-xs text-blue-800 font-medium">
                Edición rápida del campo: <span className="font-bold font-display">{label}</span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
                  <span className="text-sm font-medium">Cargando datos del servidor...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Spanish Input */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Archivo (Requerido)</label>
                    {isMediaField ? (
                      <ImageSelectorField
                        label="Archivo"
                        valorActual={form.valor_es}
                        onChange={(v) => setForm({ valor_es: v, valor_en: v, valor_de: v })}
                        type={type === 'pdf' ? 'pdf' : type === 'video' ? 'video' : 'image'}
                      />
                    ) : (
                      <textarea
                        value={form.valor_es}
                        onChange={(e) => setForm({ ...form, valor_es: e.target.value })}
                        className="w-full px-4 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-brand-green focus:outline-none min-h-[90px] bg-white text-gray-700 font-body"
                      />
                    )}
                  </div>

                  {/* Multilingual Inputs (English / German) — solo para campos de texto */}
                  {!isMediaField && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Inglés</label>
                        <textarea
                          value={form.valor_en}
                          onChange={(e) => setForm({ ...form, valor_en: e.target.value })}
                          className="w-full px-4 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-brand-green focus:outline-none min-h-[90px] bg-white text-gray-700 font-body"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Alemán</label>
                        <textarea
                          value={form.valor_de}
                          onChange={(e) => setForm({ ...form, valor_de: e.target.value })}
                          className="w-full px-4 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-brand-green focus:outline-none min-h-[90px] bg-white text-gray-700 font-body"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-150 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-2 bg-[#4DB26B] hover:bg-[#43a060] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md disabled:opacity-50 min-h-[40px]"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
