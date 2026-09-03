'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Type,
  Quote,
  Video,
  Grid,
  FileText,
  Sparkles,
  Eye,
  Check,
  UploadCloud,
  X
} from 'lucide-react';
import { ImageSelectorField } from '@/components/admin/ImageSelectorField';

export type BlockType = 
  | { type: 'heading'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'gallery'; images: Array<{ url: string; caption?: string }> }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'video'; url: string; caption?: string }
  | { type: 'logos'; logos: Array<{ url: string; name: string }> }
  | { type: 'download'; title: string; url: string; fileSize?: string };

interface BlogPostData {
  id?: string;
  slug: string;
  titulo_es: string;
  titulo_en?: string;
  titulo_de?: string;
  resumen_es?: string;
  resumen_en?: string;
  resumen_de?: string;
  portadaUrl?: string;
  categoria: string;
  autor?: string;
  autorCargo?: string;
  autorAvatar?: string;
  destacado: boolean;
  publicado: boolean;
  contenido_es: BlockType[];
}

interface BlogEditorProps {
  initialData?: Partial<BlogPostData>;
  isNew?: boolean;
}

const CATEGORIAS = [
  'Agroindustria',
  'Innovación',
  'Sostenibilidad',
  'Holding GEC',
  'Eventos',
  'Exportación',
  'Responsabilidad Social'
];

export function BlogEditor({ initialData, isNew = false }: BlogEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form State
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [tituloEs, setTituloEs] = useState(initialData?.titulo_es || '');
  const [tituloEn, setTituloEn] = useState(initialData?.titulo_en || '');
  const [tituloDe, setTituloDe] = useState(initialData?.titulo_de || '');
  const [resumenEs, setResumenEs] = useState(initialData?.resumen_es || '');
  const [portadaUrl, setPortadaUrl] = useState(initialData?.portadaUrl || '');
  const [categoria, setCategoria] = useState(initialData?.categoria || 'Agroindustria');
  const [autor, setAutor] = useState(initialData?.autor || 'Grupo Exportador del Campo');
  const [autorCargo, setAutorCargo] = useState(initialData?.autorCargo || 'Comunicación Corporativa');
  const [destacado, setDestacado] = useState(initialData?.destacado || false);
  const [publicado, setPublicado] = useState(initialData?.publicado !== undefined ? initialData.publicado : true);

  // Content Blocks
  let initialBlocks: BlockType[] = [];
  if (initialData?.contenido_es) {
    if (typeof initialData.contenido_es === 'string') {
      try {
        initialBlocks = JSON.parse(initialData.contenido_es);
      } catch {
        initialBlocks = [{ type: 'paragraph', content: initialData.contenido_es }];
      }
    } else if (Array.isArray(initialData.contenido_es)) {
      initialBlocks = initialData.contenido_es;
    }
  }

  const [blocks, setBlocks] = useState<BlockType[]>(
    initialBlocks.length > 0 
      ? initialBlocks 
      : [{ type: 'paragraph', content: '' }]
  );

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTituloEs(val);
    if (isNew) {
      const generated = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w-]+/g, '');
      setSlug(generated);
    }
  };

  // Block handlers
  const addBlock = (type: string) => {
    switch (type) {
      case 'heading':
        setBlocks([...blocks, { type: 'heading', content: '' }]);
        break;
      case 'paragraph':
        setBlocks([...blocks, { type: 'paragraph', content: '' }]);
        break;
      case 'image':
        setBlocks([...blocks, { type: 'image', url: '', caption: '' }]);
        break;
      case 'gallery':
        setBlocks([...blocks, { type: 'gallery', images: [{ url: '', caption: '' }] }]);
        break;
      case 'quote':
        setBlocks([...blocks, { type: 'quote', text: '', author: '' }]);
        break;
      case 'video':
        setBlocks([...blocks, { type: 'video', url: '', caption: '' }]);
        break;
      case 'logos':
        setBlocks([...blocks, { type: 'logos', logos: [{ url: '', name: '' }] }]);
        break;
      case 'download':
        setBlocks([...blocks, { type: 'download', title: '', url: '', fileSize: '' }]);
        break;
    }
  };

  const updateBlock = (index: number, updated: BlockType) => {
    const copy = [...blocks];
    copy[index] = updated;
    setBlocks(copy);
  };

  const deleteBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const copy = [...blocks];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setBlocks(copy);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      slug,
      titulo_es: tituloEs,
      titulo_en: tituloEn,
      titulo_de: tituloDe,
      resumen_es: resumenEs,
      portadaUrl,
      categoria,
      autor,
      autorCargo,
      destacado,
      publicado,
      contenido_es: JSON.stringify(blocks),
    };

    try {
      const url = isNew ? '/api/admin/blog' : `/api/admin/blog/${initialData?.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar el artículo');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/blog');
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-brand-navy hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-brand-navy font-display">
              {isNew ? 'Nuevo Artículo de Blog' : 'Editar Artículo'}
            </h1>
            <p className="text-xs text-gray-500">
              {isNew ? 'Crea y personaliza un artículo con bloques multimedia' : `Editando: ${initialData?.titulo_es}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && slug && (
            <Link
              href={`/es/blog/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4 text-brand-green" />
              <span>Ver en Vivo</span>
            </Link>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Guardando...</span>
            ) : success ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Artículo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Main Form: Metadata Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-brand-navy font-display flex items-center gap-2 pb-3 border-b border-gray-100">
          <Sparkles className="w-4 h-4 text-brand-green" />
          <span>Información General del Artículo</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Título Principal */}
          <div className="md:col-span-8">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Título en Español *
            </label>
            <input
              type="text"
              required
              value={tituloEs}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ej: Innovación en la Cadena de Frío para Exportación"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-brand-navy font-medium focus:ring-2 focus:ring-brand-green focus:outline-none"
            />
          </div>

          {/* Categoría */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Categoría
            </label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-brand-navy font-medium focus:ring-2 focus:ring-brand-green focus:outline-none bg-white"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Slug URL */}
          <div className="md:col-span-6">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              URL / Slug Amigable *
            </label>
            <div className="flex items-center">
              <span className="bg-gray-100 px-3 py-3 rounded-l-xl text-xs text-gray-500 font-mono border border-r-0 border-gray-200">
                /blog/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="innovacion-cadena-frio"
                className="w-full px-4 py-3 border border-gray-200 rounded-r-xl text-brand-navy font-mono text-sm focus:ring-2 focus:ring-brand-green focus:outline-none"
              />
            </div>
          </div>

          {/* Portada con ImageSelectorField */}
          <div className="md:col-span-6">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Imagen de Portada (Subir o seleccionar)
            </label>
            <ImageSelectorField
              label="Portada del Artículo"
              valorActual={portadaUrl}
              onChange={(url) => setPortadaUrl(url)}
              type="image"
            />
          </div>

          {/* Resumen / Extracto */}
          <div className="md:col-span-12">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Resumen / Extracto para el Feed
            </label>
            <textarea
              rows={2}
              value={resumenEs}
              onChange={(e) => setResumenEs(e.target.value)}
              placeholder="Breve introducción que se muestra en las tarjetas del blog..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-brand-navy text-sm focus:ring-2 focus:ring-brand-green focus:outline-none"
            />
          </div>

          {/* Autor y Cargo */}
          <div className="md:col-span-6">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Nombre del Autor
            </label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              placeholder="Grupo Exportador del Campo"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
            />
          </div>

          <div className="md:col-span-6">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Cargo del Autor
            </label>
            <input
              type="text"
              value={autorCargo}
              onChange={(e) => setAutorCargo(e.target.value)}
              placeholder="Dirección Agrícola"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
            />
          </div>

          {/* Opciones: Destacado & Publicado */}
          <div className="md:col-span-12 flex flex-wrap gap-6 pt-2 border-t border-gray-100">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={publicado}
                onChange={(e) => setPublicado(e.target.checked)}
                className="w-5 h-5 rounded text-brand-green focus:ring-brand-green"
              />
              <span className="text-sm font-bold text-brand-navy">
                Publicar inmediatamente (visible en la web)
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={destacado}
                onChange={(e) => setDestacado(e.target.checked)}
                className="w-5 h-5 rounded text-brand-green focus:ring-brand-green"
              />
              <span className="text-sm font-bold text-brand-navy">
                Marcar como Artículo Destacado (Banner Hero)
              </span>
            </label>
          </div>

        </div>
      </div>

      {/* Dynamic Content Blocks Builder */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-brand-navy font-display flex items-center gap-2">
              <Grid className="w-4 h-4 text-brand-green" />
              <span>Contenido Multimedia por Bloques ({blocks.length})</span>
            </h2>
            <p className="text-xs text-gray-500">
              Combina texto, fotos con picker, galerías, citas, videos y logotipos con total flexibilidad.
            </p>
          </div>
        </div>

        {/* Blocks List */}
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <div
              key={index}
              className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-5 relative group hover:border-brand-green/50 transition-all"
            >
              {/* Block Header Controls */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
                <span className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-navy text-white text-[10px] flex items-center justify-center font-mono">
                    {index + 1}
                  </span>
                  {block.type === 'heading' && 'Subtítulo / Encabezado'}
                  {block.type === 'paragraph' && 'Párrafo de Texto'}
                  {block.type === 'image' && 'Imagen con Pie de Foto'}
                  {block.type === 'gallery' && 'Galería / Mosaico de Fotos'}
                  {block.type === 'quote' && 'Cita Destacada (Quote)'}
                  {block.type === 'video' && 'Video / Embed'}
                  {block.type === 'logos' && 'Fila de Logotipos / Aliados'}
                  {block.type === 'download' && 'Documento Descargable (PDF)'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="p-1 rounded text-gray-400 hover:text-brand-navy disabled:opacity-20 transition-colors cursor-pointer"
                    title="Mover arriba"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-1 rounded text-gray-400 hover:text-brand-navy disabled:opacity-20 transition-colors cursor-pointer"
                    title="Mover abajo"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBlock(index)}
                    className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors ml-2 cursor-pointer"
                    title="Eliminar bloque"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Block Body depending on Type */}
              {block.type === 'heading' && (
                <input
                  type="text"
                  value={block.content}
                  onChange={(e) => updateBlock(index, { type: 'heading', content: e.target.value })}
                  placeholder="Escribe el subtítulo de la sección..."
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-brand-navy text-lg focus:ring-2 focus:ring-brand-green focus:outline-none"
                />
              )}

              {block.type === 'paragraph' && (
                <textarea
                  rows={4}
                  value={block.content}
                  onChange={(e) => updateBlock(index, { type: 'paragraph', content: e.target.value })}
                  placeholder="Escribe el contenido del párrafo..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-brand-navy text-sm leading-relaxed focus:ring-2 focus:ring-brand-green focus:outline-none"
                />
              )}

              {block.type === 'image' && (
                <div className="space-y-4">
                  <ImageSelectorField
                    label="Fotografía del Bloque"
                    valorActual={block.url}
                    onChange={(url) => updateBlock(index, { ...block, url })}
                    type="image"
                  />
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                      Pie de Foto (Caption)
                    </label>
                    <input
                      type="text"
                      value={block.caption || ''}
                      onChange={(e) => updateBlock(index, { ...block, caption: e.target.value })}
                      placeholder="Descripción o crédito de la imagen..."
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {block.type === 'quote' && (
                <div className="space-y-3">
                  <textarea
                    rows={2}
                    value={block.text}
                    onChange={(e) => updateBlock(index, { ...block, text: e.target.value })}
                    placeholder="Texto de la frase o cita célebre..."
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl italic text-brand-navy text-sm"
                  />
                  <input
                    type="text"
                    value={block.author || ''}
                    onChange={(e) => updateBlock(index, { ...block, author: e.target.value })}
                    placeholder="Autor o fuente de la cita (ej. Joaquín Vizcaíno, CEO)"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
              )}

              {block.type === 'video' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                        URL del Video (YouTube o Video MP4)
                      </label>
                      <input
                        type="text"
                        value={block.url}
                        onChange={(e) => updateBlock(index, { ...block, url: e.target.value })}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                        Título / Pie del Video
                      </label>
                      <input
                        type="text"
                        value={block.caption || ''}
                        onChange={(e) => updateBlock(index, { ...block, caption: e.target.value })}
                        placeholder="Recorrido por nuestros campos de cultivo..."
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                      O subir archivo de video local / MP4
                    </label>
                    <ImageSelectorField
                      label="Archivo de Video"
                      valorActual={block.url.startsWith('https://www.youtube') ? '' : block.url}
                      onChange={(url) => updateBlock(index, { ...block, url })}
                      type="video"
                    />
                  </div>
                </div>
              )}

              {block.type === 'gallery' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {block.images.map((img, imgIdx) => (
                      <div key={imgIdx} className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-3 relative shadow-sm">
                        <button
                          type="button"
                          onClick={() => {
                            const newImgs = block.images.filter((_, i) => i !== imgIdx);
                            updateBlock(index, { ...block, images: newImgs });
                          }}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <ImageSelectorField
                          label={`Foto ${imgIdx + 1}`}
                          valorActual={img.url}
                          onChange={(url) => {
                            const newImgs = [...block.images];
                            newImgs[imgIdx].url = url;
                            updateBlock(index, { ...block, images: newImgs });
                          }}
                          type="image"
                        />
                        <input
                          type="text"
                          value={img.caption || ''}
                          onChange={(e) => {
                            const newImgs = [...block.images];
                            newImgs[imgIdx].caption = e.target.value;
                            updateBlock(index, { ...block, images: newImgs });
                          }}
                          placeholder="Pie de foto..."
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-[11px]"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      updateBlock(index, { ...block, images: [...block.images, { url: '', caption: '' }] });
                    }}
                    className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Añadir otra foto a la galería
                  </button>
                </div>
              )}

              {block.type === 'logos' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {block.logos.map((logo, logoIdx) => (
                      <div key={logoIdx} className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-3 relative shadow-sm">
                        <button
                          type="button"
                          onClick={() => {
                            const newLogos = block.logos.filter((_, i) => i !== logoIdx);
                            updateBlock(index, { ...block, logos: newLogos });
                          }}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <ImageSelectorField
                          label={`Logo ${logoIdx + 1}`}
                          valorActual={logo.url}
                          onChange={(url) => {
                            const newLogos = [...block.logos];
                            newLogos[logoIdx].url = url;
                            updateBlock(index, { ...block, logos: newLogos });
                          }}
                          type="image"
                        />
                        <input
                          type="text"
                          value={logo.name}
                          onChange={(e) => {
                            const newLogos = [...block.logos];
                            newLogos[logoIdx].name = e.target.value;
                            updateBlock(index, { ...block, logos: newLogos });
                          }}
                          placeholder="Nombre de la marca o certificación..."
                          className="w-full px-2.5 py-1.5 border border-gray-200 rounded text-[11px]"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      updateBlock(index, { ...block, logos: [...block.logos, { url: '', name: '' }] });
                    }}
                    className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Añadir otro logo
                  </button>
                </div>
              )}

              {block.type === 'download' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                        Título del Archivo
                      </label>
                      <input
                        type="text"
                        value={block.title}
                        onChange={(e) => updateBlock(index, { ...block, title: e.target.value })}
                        placeholder="Título (ej. Ficha Técnica Aguacate Hass)"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                        Tamaño del Archivo
                      </label>
                      <input
                        type="text"
                        value={block.fileSize || ''}
                        onChange={(e) => updateBlock(index, { ...block, fileSize: e.target.value })}
                        placeholder="Tamaño (ej. PDF • 2.4 MB)"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <ImageSelectorField
                    label="Subir Documento PDF"
                    valorActual={block.url}
                    onChange={(url) => updateBlock(index, { ...block, url })}
                    type="pdf"
                  />
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Add Block Toolbar Buttons */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            + Añadir Nuevo Bloque de Contenido:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => addBlock('paragraph')}
              className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 transition-colors cursor-pointer"
            >
              <Type className="w-3.5 h-3.5 text-brand-navy" />
              <span>Párrafo</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('heading')}
              className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-brand-navy" />
              <span>Subtítulo</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('image')}
              className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-brand-green" />
              <span>Foto Individual</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('gallery')}
              className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 transition-colors cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5 text-brand-green" />
              <span>Galería de Fotos</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('quote')}
              className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 transition-colors cursor-pointer"
            >
              <Quote className="w-3.5 h-3.5 text-amber-500" />
              <span>Cita Destacada</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('video')}
              className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 transition-colors cursor-pointer"
            >
              <Video className="w-3.5 h-3.5 text-blue-500" />
              <span>Video / Embed</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('logos')}
              className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Logos / Aliados</span>
            </button>
            <button
              type="button"
              onClick={() => addBlock('download')}
              className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 transition-colors cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>Descargable PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Save Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Link
          href="/admin/blog"
          className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Guardando...' : 'Guardar Artículo'}
        </button>
      </div>

    </form>
  );
}
