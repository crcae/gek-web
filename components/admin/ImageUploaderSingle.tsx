'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Loader2, ImageIcon } from 'lucide-react';

interface Props {
  carpeta: string;
  nombreArchivo: string;
  label: string;
  descripcion: string;
}

export function ImageUploaderSingle({ carpeta, nombreArchivo, label, descripcion }: Props) {
  const rutaActual = `/images/${carpeta}/${nombreArchivo}`;
  const [imgKey, setImgKey] = useState(0); // fuerza re-render del preview
  const [imgError, setImgError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('carpeta', carpeta);
    formData.append('nombreFijo', nombreArchivo);

    try {
      const res = await fetch('/api/admin/imagenes/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error al subir');
      }

      setImgError(false);
      setImgKey(k => k + 1);
      setSuccessMsg('Imagen guardada');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setUploadError(err.message || 'Error al subir');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-3">
      <div>
        <h3 className="font-semibold text-gray-800 text-sm">{label}</h3>
        <p className="text-xs text-blue-500 mt-0.5">{descripcion}</p>
      </div>

      {/* Preview */}
      <div className="relative h-40 rounded-lg overflow-hidden bg-gray-100 border border-dashed border-gray-300">
        {!imgError ? (
          <Image
            key={imgKey}
            src={`${rutaActual}?v=${imgKey}`}
            alt={label}
            fill
            className="object-cover"
            onError={() => setImgError(true)}
            sizes="400px"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
            <ImageIcon className="w-8 h-8" />
            <p className="text-xs">Sin imagen aún</p>
          </div>
        )}
      </div>

      {/* Uploader */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer border border-gray-200 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition w-fit">
          {uploading ? (
            <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 text-gray-500" />
          )}
          <span>{uploading ? 'Subiendo…' : 'Subir imagen'}</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleUpload}
          />
        </label>
        {successMsg && <span className="text-xs text-green-600 font-medium">{successMsg}</span>}
        {uploadError && <span className="text-xs text-red-500">{uploadError}</span>}
      </div>

      <p className="text-xs text-gray-400 font-mono">{rutaActual}</p>
    </div>
  );
}
