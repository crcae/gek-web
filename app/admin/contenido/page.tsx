'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { ImageSelectorField } from '@/components/admin/ImageSelectorField';

type Contenido = {
  id: string;
  seccion: string;
  campo: string;
  valor_es: string;
  valor_en: string | null;
  valor_de: string | null;
};

type GroupedContenido = Record<string, Contenido[]>;

// Mapa de dónde aparece cada campo en el sitio público
const CAMPO_DESCRIPCION: Record<string, string> = {
  'home.hero.tagline':          '→ Home · Tagline principal del Hero (video)',
  'home.hero.sub':              '→ Home · Subtítulo bajo el tagline del Hero',
  'home.marcas_titulo':         '→ Home · Título sección "Las Marcas que nos Representan"',
  'home.metrica1.numero':       '→ Home · Métricas · Número 1 (ej. +50)',
  'home.metrica1.label':        '→ Home · Métricas · Etiqueta 1 (ej. Años de experiencia)',
  'home.metrica1.descripcion':  '→ Home · Métricas · Descripción 1',
  'home.metrica2.numero':       '→ Home · Métricas · Número 2',
  'home.metrica2.label':        '→ Home · Métricas · Etiqueta 2',
  'home.metrica2.descripcion':  '→ Home · Métricas · Descripción 2',
  'home.metrica3.numero':       '→ Home · Métricas · Número 3',
  'home.metrica3.label':        '→ Home · Métricas · Etiqueta 3',
  'home.metrica3.descripcion':  '→ Home · Métricas · Descripción 3',
  'home.metrica4.numero':       '→ Home · Métricas · Número 4',
  'home.metrica4.label':        '→ Home · Métricas · Etiqueta 4',
  'home.metrica4.descripcion':  '→ Home · Métricas · Descripción 4',
  'features.quienes.imagen':    '→ Home · Foto de la card "Quiénes Somos"',
  'features.quienes.label':     '→ Home · Título de la card "Quiénes Somos"',
  'features.quienes.desc':      '→ Home · Descripción de la card "Quiénes Somos"',
  'features.historia.imagen':   '→ Home · Foto de la card "Historia"',
  'features.historia.label':    '→ Home · Título de la card "Historia"',
  'features.historia.desc':     '→ Home · Descripción de la card "Historia"',
  'features.holding.imagen':    '→ Home · Foto de la card "Holding"',
  'features.holding.label':     '→ Home · Título de la card "Holding"',
  'features.holding.desc':      '→ Home · Descripción de la card "Holding"',
  'features.contacto.imagen':   '→ Home · Foto de la card "Contacto"',
  'features.contacto.label':    '→ Home · Título de la card "Contacto"',
  'features.contacto.desc':     '→ Home · Descripción de la card "Contacto"',
  'quienes.intro':              '→ Quiénes Somos · Párrafo de introducción (acepta HTML)',
  'quienes.mision':             '→ Quiénes Somos · Panel "Nuestra razón de ser" (Misión)',
  'quienes.vision':             '→ Quiénes Somos · Panel "Seguimos apuntando alto" (Visión)',
  'quienes.cadena.titulo':      '→ Quiénes Somos · Título sección cadena de suministro',
  'quienes.cadena.subtitulo':   '→ Quiénes Somos · Subtítulo sección cadena de suministro',
  'quienes.divisiones.titulo':  '→ Quiénes Somos · Título sección Divisiones (acepta HTML)',
  'quienes.divisiones.subtitulo': '→ Quiénes Somos · Subtítulo sección Divisiones',
  'quienes.division.campo':     '→ Quiénes Somos · Descripción División Campo',
  'quienes.division.sedis':     '→ Quiénes Somos · Descripción División Sedis',
  'quienes.hero.imagen':                  '→ Quiénes Somos · Imagen del banner superior (Hero)',
  'quienes.franja.imagen':                '→ Quiénes Somos · Franja decorativa arriba del título (PageHero)',
  'quienes.ceo.imagen':                   '→ Quiénes Somos · Foto del Director General Joaquín Vizcaíno',
  'quienes.ecosistema.mision.imagen':     '→ Quiénes Somos · Fondo del panel izquierdo del Ecosistema (Misión)',
  'quienes.ecosistema.vision.imagen':     '→ Quiénes Somos · Fondo del panel central del Ecosistema (Visión)',
  'quienes.ecosistema.valores.imagen':    '→ Quiénes Somos · Fondo del panel derecho del Ecosistema (Valores)',
  'quienes.cedis.ficha1.imagen':          '→ Quiénes Somos · Primera ficha CEDIS (Desinfección y Clasificación)',
  'quienes.cedis.ficha2.imagen':          '→ Quiénes Somos · Segunda ficha CEDIS (Empaque)',
  'quienes.cedis.ficha3.imagen':          '→ Quiénes Somos · Tercera ficha CEDIS (Preparación Logística)',
  'quienes.cedis.ficha4.imagen':          '→ Quiénes Somos · Cuarta ficha CEDIS (Distribución)',
  'quienes.division.campo.imagen':        '→ Quiénes Somos · Foto cuadro izquierdo en Nuestras Divisiones',
  'quienes.division.sedis.imagen':        '→ Quiénes Somos · Foto cuadro derecho en Nuestras Divisiones',
  'quienes.campo.titulo':       '→ Quiénes Somos · Título sección Procesos Campo',
  'quienes.campo.subtitulo':    '→ Quiénes Somos · Subtítulo sección Procesos Campo',
  'quienes.cedis.titulo':       '→ Quiénes Somos · Título sección Procesos CEDIS',
  'quienes.cedis.subtitulo':    '→ Quiénes Somos · Subtítulo sección Procesos CEDIS',
  'quienes.valor.honestidad':   '→ Quiénes Somos · Valores · Descripción Honestidad',
  'quienes.valor.compromiso':   '→ Quiénes Somos · Valores · Descripción Compromiso',
  'quienes.valor.humildad':     '→ Quiénes Somos · Valores · Descripción Humildad',
  'quienes.valor.profesionalismo': '→ Quiénes Somos · Valores · Descripción Profesionalismo',
  'quienes.valor.lealtad':      '→ Quiénes Somos · Valores · Descripción Lealtad',
  'quienes.valor.transparencia': '→ Quiénes Somos · Valores · Descripción Transparencia',
  'historia.hero.imagen':       '→ Historia · Imagen del banner superior (Hero)',
  'historia.origen.titulo':     '→ Historia · Eyebrow "Nuestros Orígenes"',
  'historia.origen.texto':      '→ Historia · Párrafo "Nacidos en Zacatecas"',
  'historia.fundadores.texto':  '→ Historia · Texto debajo del título Fundadores',
  'holding.hero.imagen':        '→ Holding · Imagen del banner superior (Hero)',
  'holding.intro':              '→ Holding · Párrafo de introducción corporativa',
  'holding.organigrama.placeholder': '→ Holding · Texto placeholder del organigrama',
  'holding.marca1.nombre':      '→ Holding · Nombre de la Marca 1 (Vizcaíno Fruit\'s)',
  'holding.marca1.descripcion': '→ Holding · Descripción de la Marca 1',
  'holding.marca1.productos':   '→ Holding · Productos de la Marca 1',
  'holding.marca2.nombre':      '→ Holding · Nombre de la Marca 2 (Vizcaíno Premium)',
  'holding.marca2.descripcion': '→ Holding · Descripción de la Marca 2',
  'holding.marca2.productos':   '→ Holding · Productos de la Marca 2',
  'holding.marca3.nombre':      '→ Holding · Nombre de la Marca 3 (Vizcaíno Services)',
  'holding.marca3.descripcion': '→ Holding · Descripción de la Marca 3',
  'holding.marca3.productos':   '→ Holding · Productos de la Marca 3',
  'contacto.hero.imagen':       '→ Contacto · Imagen del banner superior (Hero)',
};

// Detectar si un campo es de tipo imagen
const esImagen = (id: string, valor: string) =>
  id.toLowerCase().includes('imagen') ||
  /\.(jpg|jpeg|png|webp|svg)$/i.test(valor?.trim() ?? '');

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
              <span className="font-bold">ℹ️ Noticias:</span> Las noticias se publican desde{' '}
              <a href="/admin/noticias" className="underline font-semibold">/admin/noticias</a>.
            </p>
          </div>
        )}
        {activeSeccion && (() => {
          const all = groupedData[activeSeccion] ?? [];
          const imgItems = all.filter(i => esImagen(i.id, i.valor_es));
          const txtItems = all.filter(i => !esImagen(i.id, i.valor_es));

          if (imgItems.length === 0) {
            return txtItems.map(item => <ContentField key={item.id} item={item} />);
          }

          return (
            <>
              {/* Sección imágenes — arriba */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2">Imágenes</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {imgItems.map(item => <ContentField key={item.id} item={item} />)}
              </div>

              {/* Sección textos — abajo */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2">Textos</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              {txtItems.map(item => <ContentField key={item.id} item={item} />)}
            </>
          );
        })()}
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

  const isImageField = esImagen(item.id, form.valor_es);
  const descripcion = CAMPO_DESCRIPCION[item.id];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">{item.campo}</h3>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{item.id}</p>
          {descripcion && (
            <p className="text-xs text-blue-500 mt-1 font-medium">{descripcion}</p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {saved && (
            <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
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

      <div className="p-6 space-y-6">
        {/* Campo Español */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
            Español (Requerido)
          </label>
          {isImageField ? (
            <ImageSelectorField
              label="Español"
              valorActual={form.valor_es}
              onChange={(v) => setForm({ ...form, valor_es: v })}
            />
          ) : (
            <textarea
              value={form.valor_es}
              onChange={(e) => setForm({ ...form, valor_es: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-[#4DB26B] focus:outline-none min-h-[80px] bg-white text-gray-700"
            />
          )}
        </div>

        {/* Campos EN / DE — solo para campos de texto (las imágenes comparten ruta) */}
        {!isImageField && (
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
        )}
      </div>
    </div>
  );
}
