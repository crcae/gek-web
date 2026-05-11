'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type NoticiaFormData = {
  titulo_es: string;
  linkedinEmbedUrl: string;
  publicada: boolean;
};

export function NoticiaForm({
  initialData,
  noticiaId,
}: {
  initialData?: Partial<NoticiaFormData>;
  noticiaId?: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { register, handleSubmit, watch, formState: { isSubmitting, errors } } = useForm<NoticiaFormData>({
    defaultValues: {
      titulo_es: '',
      linkedinEmbedUrl: '',
      publicada: false,
      ...initialData,
    },
  });

  const embedUrlValue = watch('linkedinEmbedUrl');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (embedUrlValue && embedUrlValue.startsWith('https://www.linkedin.com/embed/')) {
      setPreviewUrl(embedUrlValue);
    } else {
      setPreviewUrl('');
    }
  }, [embedUrlValue]);

  const onSubmit = async (data: NoticiaFormData) => {
    setMessage(null);
    if (!data.linkedinEmbedUrl.startsWith('https://www.linkedin.com/embed/')) {
      setMessage({ type: 'error', text: 'Pega la URL del src del iframe, no la URL del post' });
      return;
    }

    const url = noticiaId ? `/api/admin/noticias/${noticiaId}` : '/api/admin/noticias';
    const method = noticiaId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setMessage({ type: 'success', text: noticiaId ? 'Noticia actualizada correctamente.' : 'Noticia creada correctamente.' });
      if (!noticiaId) setTimeout(() => router.push('/admin/noticias'), 1200);
    } else {
      setMessage({ type: 'error', text: 'Hubo un error. Intenta nuevamente.' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      
      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Título (referencia interna) <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">Ej: Apertura CEDIS Monterrey - May 2026. Solo visible en el admin, no en el sitio.</p>
        <input
          {...register('titulo_es', { required: true, minLength: 5 })}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DB26B] bg-white"
          placeholder="Escribe un título descriptivo..."
        />
        {errors.titulo_es && <p className="text-red-500 text-xs mt-1">El título es requerido (mín. 5 caracteres).</p>}
      </div>

      {/* LinkedIn Embed URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL de embed de LinkedIn <span className="text-red-500">*</span>
        </label>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-md mb-3 text-sm text-blue-800">
          <strong className="block mb-1">ℹ️ Cómo obtenerla:</strong>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Ve al post en LinkedIn</li>
            <li>Haz clic en los tres puntos (...) → "Embed this post"</li>
            <li>Copia <strong>solo la URL</strong> que está dentro del atributo <code className="bg-blue-100 px-1 rounded">src="..."</code></li>
          </ol>
          <p className="mt-2 text-xs">Debe verse así: <code>https://www.linkedin.com/embed/feed/update/...</code></p>
        </div>
        <input
          {...register('linkedinEmbedUrl', { required: true })}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DB26B] bg-white"
          placeholder="https://www.linkedin.com/embed/feed/update/urn:li:share:..."
        />
      </div>

      {/* Live Preview */}
      {previewUrl && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vista previa del post:</label>
          <div className="rounded-lg overflow-hidden border border-gray-200 max-w-md bg-gray-50 flex justify-center">
            <iframe 
              src={previewUrl} 
              height="450" 
              width="100%" 
              frameBorder="0" 
              allowFullScreen={true}
              title="LinkedIn Preview"
              className="border-none w-full min-h-[450px]"
            />
          </div>
        </div>
      )}

      {/* Publish toggle */}
      <div className="flex items-center gap-3 pt-4">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" {...register('publicada')} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#4DB26B] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4DB26B]"></div>
        </label>
        <span className="text-sm font-medium text-gray-700">Publicar en el sitio</span>
      </div>

      {/* Feedback */}
      {message && (
        <div className={`px-4 py-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <Link
          href="/admin/noticias"
          className="text-gray-500 hover:text-gray-700 text-sm font-medium px-4 py-2 border border-gray-200 rounded-md"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#4DB26B] text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-[#43a060] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar noticia'}
        </button>
      </div>
    </form>
  );
}
