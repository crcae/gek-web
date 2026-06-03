'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Plus, Loader2, X, ImageIcon } from 'lucide-react';

interface Props {
  carpeta: string;
  label: string;
  descripcion: string;
  max?: number;
}

export function ImageUploaderMultiple({ carpeta, label, descripcion, max }: Props) {
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchImagenes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/imagenes/listar?carpeta=${encodeURIComponent(carpeta)}`);
      const data = await res.json();
      setImagenes(data.imagenes ?? []);
    } catch {
      setImagenes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImagenes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carpeta]);

  const handleSubir = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('carpeta', carpeta);

      try {
        const res = await fetch('/api/admin/imagenes/upload', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setError(err.error || 'Error al subir una imagen');
        }
      } catch {
        setError('Error de red al subir');
      }
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    fetchImagenes();
  };

  const handleEliminar = async (ruta: string) => {
    if (!confirm('¿Eliminar esta imagen?')) return;

    try {
      const res = await fetch('/api/admin/imagenes/eliminar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruta }),
      });
      if (res.ok) {
        setImagenes(prev => prev.filter(img => img !== ruta));
      }
    } catch {
      setError('No se pudo eliminar');
    }
  };

  const puedeSubirMas = max === undefined || imagenes.length < max;

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-4">
      <div>
        <h3 className="font-semibold text-gray-800 text-sm">{label}</h3>
        <p className="text-xs text-blue-500 mt-0.5">{descripcion}</p>
        {max && (
          <p className="text-xs text-gray-400 mt-0.5">
            Recomendado: {max} imágenes — ({imagenes.length} actuales)
          </p>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-xs py-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          Cargando imágenes…
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {imagenes.map((img) => (
            <div key={img} className="relative group">
              <div className="relative h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={img}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="150px"
                  unoptimized
                />
              </div>
              <button
                onClick={() => handleEliminar(img)}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs hidden group-hover:flex items-center justify-center shadow hover:bg-red-600 transition-colors"
                title="Eliminar"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Placeholder vacíos hasta el máximo */}
          {max && imagenes.length === 0 && (
            Array.from({ length: Math.min(max, 3) }).map((_, i) => (
              <div key={`ph-${i}`} className="h-24 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-gray-300" />
              </div>
            ))
          )}

          {/* Slot para agregar */}
          {puedeSubirMas && (
            <label className={`h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-[#4DB26B] transition-all text-gray-400 text-xs gap-1 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              <span>{uploading ? 'Subiendo…' : 'Agregar'}</span>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={handleSubir}
              />
            </label>
          )}
        </div>
      )}

      <p className="text-[10px] text-gray-400 font-mono">/images/{carpeta}/</p>
    </div>
  );
}
