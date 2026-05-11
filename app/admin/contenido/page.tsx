'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle, ChevronDown, ChevronRight } from 'lucide-react';

type Contenido = {
  id: string;
  seccion: string;
  campo: string;
  valor_es: string;
  valor_en: string | null;
  valor_de: string | null;
};

type GroupedContenido = Record<string, Contenido[]>;

export default function ContenidoPage() {
  const [groupedData, setGroupedData] = useState<GroupedContenido>({});
  const [loading, setLoading] = useState(true);
  const [activeSeccion, setActiveSeccion] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/contenido')
      .then((res) => res.json())
      .then((data) => {
        setGroupedData(data);
        const sections = Object.keys(data);
        if (sections.length > 0) setActiveSeccion(sections[0]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4 sm:p-8 text-gray-500">Cargando contenido...</div>;
  }

  const secciones = Object.keys(groupedData);

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Contenido</h1>
        <p className="text-gray-500 text-sm mt-1">Edita los textos de las diferentes secciones del sitio público.</p>
      </div>

      {/* Tabs de Secciones */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        {secciones.map((seccion) => (
          <button
            key={seccion}
            onClick={() => setActiveSeccion(seccion)}
            className={`px-6 py-3 text-sm font-medium border-b-2 -mb-px transition-colors capitalize whitespace-nowrap ${
              activeSeccion === seccion
                ? 'border-[#4DB26B] text-[#4DB26B]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {seccion === 'quienes' ? 'Quiénes Somos' : seccion}
          </button>
        ))}
      </div>

      {/* Lista de Campos */}
      <div className="space-y-6">
        {activeSeccion === 'home' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <span className="font-bold">ℹ️ Nota sobre Noticias:</span> Las noticias se publican desde la sección <a href="/admin/noticias" className="underline font-semibold">/admin/noticias</a> usando posts de LinkedIn. Para agregar una noticia, ve a LinkedIn, publica el post, y luego agrega el embed allá.
            </p>
          </div>
        )}
        {activeSeccion && groupedData[activeSeccion]?.map((item) => (
          <ContentField key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function ContentField({ item }: { item: Contenido }) {
  const [form, setForm] = useState({
    valor_es: item.valor_es,
    valor_en: item.valor_en || '',
    valor_de: item.valor_de || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/contenido/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{item.campo}</h3>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-green-600 text-xs font-medium animate-in fade-in duration-300">
              <CheckCircle className="w-3 h-3" />
              Guardado
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#4DB26B] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-[#43a060] transition-colors disabled:opacity-50"
          >
            <Save className="w-3 h-3" />
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Español (Requerido)</label>
          <textarea
            value={form.valor_es}
            onChange={(e) => setForm({ ...form, valor_es: e.target.value })}
            className="w-full px-4 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-[#4DB26B] focus:outline-none min-h-[80px] bg-white text-gray-700"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Inglés</label>
            <textarea
              value={form.valor_en}
              onChange={(e) => setForm({ ...form, valor_en: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-[#4DB26B] focus:outline-none min-h-[80px] bg-white text-gray-700"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Alemán</label>
            <textarea
              value={form.valor_de}
              onChange={(e) => setForm({ ...form, valor_de: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-[#4DB26B] focus:outline-none min-h-[80px] bg-white text-gray-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
