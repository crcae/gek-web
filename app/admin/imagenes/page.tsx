'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, ImageIcon, Plus, X, CheckCircle } from 'lucide-react';
import Image from 'next/image';

type Imagen = {
  id: string;
  seccion: string;
  nombre: string;
  url: string;
  filename: string;
  createdAt: string;
};

const SECCIONES = [
  { id: 'zacatecas', label: 'Zacatecas' },
  { id: 'fundadores', label: 'Fundadores' },
  { id: 'holding', label: 'Holding' },
  { id: 'sedis', label: 'Sedis' },
  { id: 'logos', label: 'Logos' },
];

export default function ImagenesPage() {
  const [activeSeccion, setActiveSeccion] = useState(SECCIONES[0].id);
  const [imagenes, setImagenes] = useState<Imagen[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImagenes = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/imagenes?seccion=${activeSeccion}`);
    const data = await res.json();
    setImagenes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchImagenes();
  }, [activeSeccion]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('seccion', activeSeccion);
      formData.append('nombre', file.name);

      try {
        await fetch('/api/admin/imagenes', {
          method: 'POST',
          body: formData,
        });
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    fetchImagenes();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta imagen permanentemente?')) return;
    
    const res = await fetch(`/api/admin/imagenes/${id}`, {
      method: 'DELETE',
    });
    
    if (res.ok) {
      setImagenes(imagenes.filter(img => img.id !== id));
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Galería de Imágenes</h1>
          <p className="text-gray-500 text-sm mt-1">Sube y gestiona las fotos que aparecen en las secciones informativas.</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-[#4DB26B] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#43a060] transition-colors disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Subiendo...' : 'Subir Fotos'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          multiple
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        {SECCIONES.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSeccion(s.id)}
            className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
              activeSeccion === s.id
                ? 'border-[#4DB26B] text-[#4DB26B]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-gray-400 text-sm py-12">Cargando galería...</div>
      ) : imagenes.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-16 text-center">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium mb-1">No hay imágenes en esta sección</p>
          <p className="text-gray-400 text-sm mb-6">Sube fotos para empezar a construir tu galería.</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-[#4DB26B] font-semibold text-sm hover:underline"
          >
            Subir mi primera foto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {imagenes.map((img) => (
            <div key={img.id} className="group relative bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="aspect-square relative">
                <Image
                  src={img.url}
                  alt={img.nombre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-gray-700 truncate" title={img.nombre}>
                  {img.nombre}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
