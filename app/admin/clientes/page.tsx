'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  GripVertical,
} from 'lucide-react';

interface ClienteLogo {
  id: string;
  nombre: string;
  url: string;
  filename: string;
  orden: number;
  createdAt: string;
}

type Feedback = { type: 'success' | 'error'; message: string } | null;

export default function AdminClientesPage() {
  const [logos, setLogos] = useState<ClienteLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Upload form state
  const [nombre, setNombre] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchLogos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/clientes');
      const data = await res.json();
      setLogos(Array.isArray(data) ? data : []);
    } catch {
      showFeedback('error', 'Error al cargar los logos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    // Auto-fill name from filename if empty
    if (!nombre) {
      setNombre(f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }
    // Image preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !nombre.trim()) {
      showFeedback('error', 'Debes seleccionar un archivo y escribir un nombre.');
      return;
    }

    const allowed = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!allowed.includes(file.type)) {
      showFeedback('error', 'Formato no soportado. Usa PNG, JPG, SVG o WebP.');
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('nombre', nombre.trim());

      const res = await fetch('/api/admin/clientes', { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Error desconocido');
      }

      showFeedback('success', `Logo "${nombre.trim()}" subido correctamente.`);
      // Reset form
      setNombre('');
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchLogos();
    } catch (err: unknown) {
      showFeedback('error', err instanceof Error ? err.message : 'Error al subir el logo.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (logo: ClienteLogo) => {
    if (!confirm(`¿Eliminar el logo de "${logo.nombre}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(logo.id);
    try {
      const res = await fetch(`/api/admin/clientes/${logo.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showFeedback('success', `Logo "${logo.nombre}" eliminado.`);
      setLogos((prev) => prev.filter((l) => l.id !== logo.id));
    } catch {
      showFeedback('error', 'Error al eliminar el logo.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Logos de Clientes</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestiona los logos que aparecen en el carrusel de la página principal.
          Los logos activos se muestran en orden ascendente.
        </p>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold border animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {feedback.type === 'success'
            ? <CheckCircle2 className="w-4 h-4 shrink-0" />
            : <AlertCircle className="w-4 h-4 shrink-0" />}
          {feedback.message}
        </div>
      )}

      {/* Upload Form Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#4DB26B]" />
          <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
            Agregar Nuevo Logo
          </h2>
        </div>

        <form onSubmit={handleUpload} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* File Drop Zone */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                Archivo de Imagen *
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 hover:border-[#4DB26B] rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors group cursor-pointer min-h-[120px]"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-[80px] max-w-full object-contain"
                  />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#4DB26B] transition-colors" />
                    <span className="text-sm text-gray-500 group-hover:text-[#4DB26B] transition-colors">
                      Haz clic para seleccionar imagen
                    </span>
                    <span className="text-xs text-gray-400">PNG, JPG, SVG, WebP · máx 5 MB</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              {file && (
                <p className="text-xs text-gray-500 mt-1.5 truncate">
                  📎 {file.name} ({(file.size / 1024).toFixed(0)} KB)
                </p>
              )}
            </div>

            {/* Name Field */}
            <div className="flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">
                  Nombre del Cliente *
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Soriana, S*Mart, HBE..."
                  maxLength={80}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#4DB26B] focus:ring-1 focus:ring-[#4DB26B]/20"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  Este nombre se mostrará como alt text en el carrusel.
                </p>
              </div>

              <button
                type="submit"
                disabled={uploading || !file || !nombre.trim()}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-[#4DB26B] hover:bg-[#3d9a5a] text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none min-h-[44px] text-sm"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Subir Logo
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Logo Grid */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#4DB26B]" />
            <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
              Logos Activos
            </h2>
          </div>
          <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2.5 py-1 rounded-full">
            {logos.length} {logos.length === 1 ? 'logo' : 'logos'}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando logos...</span>
          </div>
        ) : logos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
            <ImageIcon className="w-10 h-10 opacity-30" />
            <p className="text-sm font-medium">No hay logos cargados todavía.</p>
            <p className="text-xs">Usa el formulario de arriba para agregar el primero.</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {logos.map((logo) => (
              <div
                key={logo.id}
                className="group relative bg-gray-50 border border-gray-200 rounded-lg overflow-hidden hover:border-[#4DB26B]/40 hover:shadow-md transition-all duration-200"
              >
                {/* Drag handle placeholder (visual only) */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-40 transition-opacity">
                  <GripVertical className="w-4 h-4 text-gray-500" />
                </div>

                {/* Logo image */}
                <div className="h-[100px] flex items-center justify-center p-4 bg-white border-b border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.url}
                    alt={logo.nombre}
                    className="max-h-[72px] max-w-full object-contain"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      t.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40'%3E%3Crect width='100%25' height='100%25' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='55%25' fill='%23cbd5e1' font-family='sans-serif' font-size='9' text-anchor='middle'%3EImagen no disponible%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                </div>

                {/* Name + delete footer */}
                <div className="px-3 py-2.5 flex items-center justify-between gap-1">
                  <span
                    className="text-xs font-semibold text-gray-700 leading-tight truncate flex-1"
                    title={logo.nombre}
                  >
                    {logo.nombre}
                  </span>
                  <button
                    onClick={() => handleDelete(logo)}
                    disabled={deleting === logo.id}
                    title="Eliminar logo"
                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                  >
                    {deleting === logo.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />
                    }
                  </button>
                </div>

                {/* Orden badge */}
                <div className="absolute top-2 right-2 bg-[#0D1B24]/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  #{logo.orden + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info note */}
      <p className="text-xs text-gray-400 text-center pb-4">
        Los logos se muestran en el carrusel de la página principal en el orden en que fueron subidos.
        Para reordenar, elimina y vuelve a subir en el orden deseado.
      </p>
    </div>
  );
}
