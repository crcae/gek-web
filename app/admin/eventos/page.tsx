'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit2, ToggleLeft, ToggleRight, X, ExternalLink } from 'lucide-react';

interface Evento {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  lugar: string;
  industria: string | null;
  url: string | null;
  imagenUrl: string | null;
  activo: boolean;
}

export default function AdminEventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);

  // Form State
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [lugar, setLugar] = useState('');
  const [industria, setIndustria] = useState('');
  const [url, setUrl] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [activo, setActivo] = useState(true);

  const fetchEventos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/eventos');
      const data = await res.json();
      setEventos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const openCreateModal = () => {
    setEditingEvent(null);
    setTitulo('');
    setDescripcion('');
    setFecha('');
    setLugar('');
    setIndustria('');
    setUrl('');
    setImagenUrl('');
    setActivo(true);
    setModalOpen(true);
  };

  const openEditModal = (evt: Evento) => {
    setEditingEvent(evt);
    setTitulo(evt.titulo);
    setDescripcion(evt.descripcion || '');
    setFecha(evt.fecha);
    setLugar(evt.lugar);
    setIndustria(evt.industria || '');
    setUrl(evt.url || '');
    setImagenUrl(evt.imagenUrl || '');
    setActivo(evt.activo);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      titulo,
      descripcion,
      fecha,
      lugar,
      industria,
      url,
      imagenUrl,
      activo,
    };

    const method = editingEvent ? 'PUT' : 'POST';
    const endpoint = editingEvent ? `/api/admin/eventos/${editingEvent.id}` : '/api/admin/eventos';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setModalOpen(false);
        fetchEventos();
      } else {
        alert('Error al guardar el evento');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActivo = async (evt: Evento) => {
    try {
      const res = await fetch(`/api/admin/eventos/${evt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...evt,
          activo: !evt.activo,
        }),
      });

      if (res.ok) {
        fetchEventos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) return;

    try {
      const res = await fetch(`/api/admin/eventos/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchEventos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-6xl w-full mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-8 h-8 text-[#4DB26B]" />
            Próximos Eventos
          </h1>
          <p className="text-gray-500 text-sm mt-1">Administra la agenda institucional de eventos y conferencias.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#4DB26B] hover:bg-[#43a060] text-white py-2.5 px-5 rounded-md text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Crear Evento
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400 text-sm">Cargando eventos...</div>
      ) : eventos.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg p-16 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-600 font-semibold text-lg mb-2">No hay eventos creados</h3>
          <p className="text-gray-400 text-sm mb-6">Crea eventos para que aparezcan en el Home de tu sitio.</p>
          <button
            onClick={openCreateModal}
            className="text-[#4DB26B] font-semibold hover:underline"
          >
            Crear mi primer evento
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Evento</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fecha / Lugar</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Industria</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eventos.map((evt) => (
                <tr key={evt.id}>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-800 block">{evt.titulo}</span>
                    <span className="text-gray-400 text-xs truncate max-w-xs block">{evt.descripcion}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 text-sm block font-medium">{evt.fecha}</span>
                    <span className="text-gray-400 text-xs block">{evt.lugar}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{evt.industria || 'N/A'}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleActivo(evt)}
                      className="focus:outline-none"
                    >
                      {evt.activo ? (
                        <ToggleRight className="w-8 h-8 text-[#4DB26B]" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-gray-300" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-3 h-full pt-6">
                    <button
                      onClick={() => openEditModal(evt)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(evt.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                {editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Título del Evento *</label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green text-sm"
                  placeholder="e.g. The Mexico Conference"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">Descripción</label>
                <textarea
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green text-sm resize-none"
                  placeholder="Resumen del evento..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Fecha *</label>
                  <input
                    type="text"
                    required
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green text-sm"
                    placeholder="e.g. Mayo 13-14, 2026"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Lugar *</label>
                  <input
                    type="text"
                    required
                    value={lugar}
                    onChange={(e) => setLugar(e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green text-sm"
                    placeholder="e.g. Guadalajara, México"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">Industria</label>
                  <input
                    type="text"
                    value={industria}
                    onChange={(e) => setIndustria(e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green text-sm"
                    placeholder="e.g. Produce fresco"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-600 uppercase">URL del Evento</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-gray-600 uppercase">URL de Imagen</label>
                <input
                  type="text"
                  value={imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:border-brand-green text-sm"
                  placeholder="/images/eventos/mexico-conf.png"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activo-check"
                  checked={activo}
                  onChange={(e) => setActivo(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-green focus:ring-brand-green"
                />
                <label htmlFor="activo-check" className="text-sm font-semibold text-gray-700 select-none">Evento Activo</label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2 px-4 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-[#4DB26B] hover:bg-[#43a060] text-white font-semibold rounded text-sm shadow-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
