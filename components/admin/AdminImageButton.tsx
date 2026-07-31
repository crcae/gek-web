'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Settings, Save, X, Loader2 } from 'lucide-react';
import { ImageSelectorField } from './ImageSelectorField';

/**
 * AdminImageButton — botón autónomo para cambiar una imagen específica desde el sitio público.
 * Solo se renderiza cuando el admin ya ha verificado la sesión en el servidor (el padre decide si mostrarlo).
 */
interface AdminImageButtonProps {
  id: string;
  label: string;
  buttonText?: string;
  className?: string;
}

export function AdminImageButton({
  id,
  label,
  buttonText = 'Cambiar Foto',
  className = '',
}: AdminImageButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [valorEs, setValorEs] = useState('');

  const handleOpen = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/contenido/${id}`);
      if (res.ok) {
        const data = await res.json();
        setValorEs(data.valor_es || '');
      }
    } catch (err) {
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/contenido/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor_es: valorEs, valor_en: valorEs, valor_de: valorEs }),
      });
      if (res.ok) {
        setModalOpen(false);
        window.location.reload();
      }
    } catch (err) {
      console.error('Error saving content:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={`bg-brand-navy/90 hover:bg-brand-green text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-brand-green/30 flex items-center gap-1.5 transition-colors cursor-pointer ${className}`}
      >
        <Settings className="w-3.5 h-3.5" />
        {buttonText}
      </button>

      {modalOpen && createPortal(
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 bg-brand-navy text-white flex items-center justify-between">
              <div>
                <h3 className="text-md font-bold font-display uppercase tracking-wider text-brand-green">
                  Editar Imagen
                </h3>
                <p className="text-xs text-white/60 font-mono mt-0.5">{id}</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800 font-medium mb-6">
                Cambiar imagen: <span className="font-bold font-display">{label}</span>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
                  <span className="text-sm font-medium">Cargando...</span>
                </div>
              ) : (
                <ImageSelectorField
                  label="Imagen"
                  valorActual={valorEs}
                  onChange={(v) => setValorEs(v)}
                  type="image"
                />
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
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
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
