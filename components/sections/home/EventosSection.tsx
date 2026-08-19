'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { createPortal } from 'react-dom';
import { Calendar, MapPin, Building, ArrowUpRight, Plus, Trash2, Edit2, X, Settings, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { VisualEditable } from '@/components/admin/VisualEditable';
import { IFPABadge } from './IFPABadge';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { AnimatedLine } from '@/components/ui/AnimatedLine';

interface Evento {
  id: string;
  titulo: string;
  descripcion?: string | null;
  fecha: string;
  lugar: string;
  industria?: string | null;
  url?: string | null;
  imagenUrl?: string | null;
  activo: boolean;
}

interface EventosSectionProps {
  initialEventos: Evento[];
  ifpaBadgeExists: boolean;
  eyebrow: string;
  titulo: string;
  eyebrowId?: string;
  tituloId?: string;
}

export function EventosSection({
  initialEventos = [],
  ifpaBadgeExists,
  eyebrow,
  titulo,
  eyebrowId = 'home.eventos_eyebrow',
  tituloId = 'home.eventos_titulo',
}: EventosSectionProps) {
  const { data: session } = useSession();
  const t = useTranslations('home');

  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventList, setEventList] = useState<Evento[]>(initialEventos);
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);

  // Form State
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    lugar: '',
    industria: '',
    url: '',
    activo: true,
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setMounted(true);
    setEventList(initialEventos);
  }, [initialEventos]);

  const handleEditClick = (evt: Evento) => {
    setEditingEvent(evt);
    setForm({
      titulo: evt.titulo || '',
      descripcion: evt.descripcion || '',
      fecha: evt.fecha || '',
      lugar: evt.lugar || '',
      industria: evt.industria || '',
      url: evt.url || '',
      activo: evt.activo,
    });
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setForm({
      titulo: '',
      descripcion: '',
      fecha: '',
      lugar: '',
      industria: '',
      url: '',
      activo: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo || !form.fecha || !form.lugar) {
      setErrorMsg('Por favor completa todos los campos obligatorios (Título, Fecha, Lugar)');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const url = editingEvent 
        ? `/api/admin/eventos/${editingEvent.id}` 
        : '/api/admin/eventos';
      const method = editingEvent ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error al guardar el evento');
      }

      const saved = await res.json();
      if (editingEvent) {
        setEventList((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
        setEditingEvent(null);
      } else {
        setEventList((prev) => [saved, ...prev]);
      }

      // Reset form
      setForm({
        titulo: '',
        descripcion: '',
        fecha: '',
        lugar: '',
        industria: '',
        url: '',
        activo: true,
      });

      // Force page reload to update Server Component cache
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/admin/eventos/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Error al eliminar evento');
      }

      setEventList((prev) => prev.filter((item) => item.id !== id));
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  // Only render active events on main page
  const activeEvents = eventList.filter((e) => e.activo);

  return (
    <section id="eventos" className="w-full bg-white py-20 px-6 border-t border-brand-gray/10 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <AnimatedSection animation="fade-up">
            <VisualEditable id={tituloId} label="Título de la sección Eventos">
              <h2 className="font-display text-3xl font-bold text-brand-navy mb-4">
                {titulo || t('eventos_titulo')}
              </h2>
            </VisualEditable>
          </AnimatedSection>
          <AnimatedLine className="h-[3px] bg-brand-green" />

          {/* Floating Manage Events button */}
          {session && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 bg-brand-navy hover:bg-brand-green text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-all duration-200 border border-brand-green/30 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                Administrar Eventos
              </button>
            </div>
          )}
        </div>

        {activeEvents.length === 0 ? (
          <p className="text-brand-navy/60 text-sm font-body text-center py-6">{t('eventos_vacio')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center mb-16">
            {activeEvents.map((evt) => (
              <div 
                key={evt.id} 
                className="bg-brand-white border border-brand-gray/20 rounded-xl p-6 flex flex-col justify-between hover:border-brand-green/40 transition-all duration-300 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between text-brand-navy/50 text-xs font-bold uppercase tracking-wider mb-4">
                    <span>● {t('eventos_badge')}</span>
                    <span className="text-brand-green">{evt.fecha}</span>
                  </div>

                  <h4 className="font-display text-lg font-bold text-brand-navy mb-4 flex items-start gap-2">
                    {evt.titulo}
                  </h4>

                  <div className="space-y-2 mb-6 text-brand-navy/70 text-sm font-body">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-green shrink-0" />
                      <span>{evt.fecha}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-green shrink-0" />
                      <span>{evt.lugar}</span>
                    </div>
                    {evt.industria && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-brand-green shrink-0" />
                        <span>{evt.industria}</span>
                      </div>
                    )}
                  </div>

                  {evt.descripcion && (
                    <p className="text-brand-navy/60 text-xs font-body leading-relaxed mb-6">
                      {evt.descripcion}
                    </p>
                  )}
                </div>

                {evt.url && (
                  <a
                    href={evt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-bold font-body py-2.5 px-4 rounded text-xs transition-all w-full shadow shadow-brand-green/10"
                  >
                    <span>{t('eventos_ir')}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer / Closure: IFPA Proud Member Badge */}
        <div className="flex flex-col items-center justify-center text-center p-6 border-t border-brand-gray/10 max-w-md mx-auto">
          <IFPABadge imageExists={ifpaBadgeExists} />
          <p className="font-lora italic text-sm text-brand-navy/80 mt-3 leading-relaxed">
            {t('eventos_ifpa')}
          </p>
        </div>

      </div>

      {/* Events Management Modal */}
      {mounted && modalOpen && createPortal(
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm text-gray-800">
          <div className="bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-6 py-4 bg-brand-navy text-white flex items-center justify-between">
              <div>
                <h3 className="text-md font-bold font-display uppercase tracking-wider text-brand-green">
                  {editingEvent ? 'Editar Evento' : 'Administrar Eventos'}
                </h3>
                <p className="text-xs text-white/60">Gestionar agenda de próximos eventos</p>
              </div>
              <button
                onClick={() => { setModalOpen(false); handleCancelEdit(); }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form and List Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Event Edit/Create Form */}
              <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-150 rounded-xl p-4 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {editingEvent ? 'Modificar Evento' : 'Crear Nuevo Evento'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Título *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nombre del evento"
                      value={form.titulo}
                      onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-green focus:outline-none bg-white text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Fecha *</label>
                    <input
                      type="text"
                      required
                      placeholder="Octubre 19-21, 2026"
                      value={form.fecha}
                      onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-green focus:outline-none bg-white text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Lugar *</label>
                    <input
                      type="text"
                      required
                      placeholder="Orlando, Florida"
                      value={form.lugar}
                      onChange={(e) => setForm({ ...form, lugar: e.target.value })}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-green focus:outline-none bg-white text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Industria</label>
                    <input
                      type="text"
                      placeholder="Hortalizas, Logística, etc."
                      value={form.industria}
                      onChange={(e) => setForm({ ...form, industria: e.target.value })}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-green focus:outline-none bg-white text-gray-700"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Enlace / URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={form.url}
                      onChange={(e) => setForm({ ...form, url: e.target.value })}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-green focus:outline-none bg-white text-gray-700"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Descripción</label>
                    <textarea
                      placeholder="Detalles sobre nuestra participación..."
                      value={form.descripcion}
                      onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-brand-green focus:outline-none min-h-[60px] bg-white text-gray-700"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      id="activo-check"
                      checked={form.activo}
                      onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                      className="w-4 h-4 text-brand-green focus:ring-brand-green border-gray-300 rounded"
                    />
                    <label htmlFor="activo-check" className="text-xs font-semibold text-gray-600 select-none">
                      Mostrar evento en la página
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  {editingEvent && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded text-xs font-semibold text-gray-600 transition-colors"
                    >
                      Cancelar Edición
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-1.5 bg-[#4DB26B] hover:bg-[#43a060] text-white px-5 py-2.5 rounded text-xs font-bold shadow disabled:opacity-50 min-h-[36px]"
                  >
                    {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {editingEvent ? 'Guardar Cambios' : 'Crear Evento'}
                  </button>
                </div>
              </form>

              {/* Event List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Eventos Guardados</h4>
                {eventList.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">No hay eventos creados actualmente.</p>
                ) : (
                  <div className="space-y-3">
                    {eventList.map((evt) => (
                      <div
                        key={evt.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-lg bg-white shadow-sm hover:shadow gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-brand-navy">{evt.titulo}</span>
                            {!evt.activo && (
                              <span className="bg-gray-100 text-gray-500 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                Inactivo
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-400 font-mono">
                            {evt.fecha} | {evt.lugar}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleEditClick(evt)}
                            className="text-gray-500 hover:text-brand-green hover:bg-gray-50 p-2 rounded transition-colors"
                            title="Editar Evento"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(evt.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                            title="Eliminar Evento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-150 flex items-center justify-end shrink-0">
              <button
                type="button"
                onClick={() => { setModalOpen(false); handleCancelEdit(); }}
                className="bg-brand-navy hover:bg-brand-green text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-md transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
