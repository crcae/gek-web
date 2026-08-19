'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ImageIcon, Film, Upload, Loader2 } from 'lucide-react';

interface Props {
  label: string;
  valorActual: string;
  onChange: (ruta: string) => void;
  type?: 'image' | 'video' | 'pdf';
}

export function ImageSelectorField({ label, valorActual, onChange, type = 'image' }: Props) {
  const [mediaError, setMediaError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('seccion', 'media');
    formData.append('nombre', file.name);

    try {
      const res = await fetch('/api/admin/imagenes', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error al subir');
      }

      const data = await res.json();
      setMediaError(false);
      onChange(data.url);
    } catch (err: any) {
      setUploadError(err.message || 'Error al subir el archivo');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const isVideo = type === 'video';
  const isPdf = type === 'pdf';

  return (
    <div className="space-y-3">
      {/* Preview */}
      {valorActual && !mediaError ? (
        <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
          {isPdf ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gray-50">
              <span className="text-4xl mb-2">📄</span>
              <span className="text-xs text-gray-500 font-mono text-center max-w-[90%] truncate">{valorActual.split('/').pop()}</span>
            </div>
          ) : isVideo ? (
            <video
              src={valorActual}
              controls
              className="w-full h-full object-contain bg-black"
              onError={() => setMediaError(true)}
            />
          ) : (
            <Image
              src={valorActual}
              alt="Preview"
              fill
              className="object-cover"
              onError={() => setMediaError(true)}
              sizes="600px"
              unoptimized
            />
          )}
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-mono max-w-[90%] truncate z-10">
            {valorActual}
          </div>
        </div>
      ) : valorActual ? (
        <div className="w-full h-40 rounded-lg bg-gray-100 border border-dashed border-gray-300 flex flex-col items-center justify-center gap-2">
          {isPdf ? (
            <span className="text-3xl">📄</span>
          ) : isVideo ? (
            <Film className="w-8 h-8 text-gray-300" />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-300" />
          )}
          <p className="text-xs text-gray-400 font-mono truncate max-w-full px-4">{valorActual}</p>
          <p className="text-xs text-red-400">Archivo no encontrado o inválido</p>
        </div>
      ) : (
        <div className="w-full h-24 rounded-lg bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center">
          <p className="text-xs text-gray-400">Sin archivo asignado</p>
        </div>
      )}

      {/* Botón subir + input ruta */}
      <div className="flex gap-2">
        <input
          type="text"
          value={valorActual}
          onChange={(e) => { setMediaError(false); onChange(e.target.value); }}
          placeholder={isPdf ? "/uploads/... o URL" : "/images/... o URL"}
          className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm font-mono focus:ring-1 focus:ring-[#4DB26B] focus:outline-none bg-white text-gray-700"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-[#4DB26B] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#43a060] transition-colors disabled:opacity-50 shrink-0"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? 'Subiendo…' : 'Subir'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={isPdf ? 'application/pdf' : isVideo ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml'}
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {uploadError && (
        <p className="text-xs text-red-500">{uploadError}</p>
      )}
    </div>
  );
}
