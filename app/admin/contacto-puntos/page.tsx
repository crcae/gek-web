'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  X,
  Save,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowUpDown,
} from 'lucide-react';
import {
  PuntoContactoItem,
  ICON_CHOICES,
  renderPuntoIcon,
} from '@/components/layout/PuntosContactoList';

export default function AdminPuntosContactoPage() {
  const [puntos, setPuntos] = useState<PuntoContactoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PuntoContactoItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<PuntoContactoItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    texto: '',
    enlace: '',
    icono: 'MapPin',
    orden: 0,
    activo: true,
  });

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchPuntos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/puntos-contacto');
      if (!res.ok) throw new Error('Error al cargar');
      const data = await res.json();
      setPuntos(data.puntos || []);
    } catch {
      showFeedback('error', 'Error al cargar los puntos de contacto.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPuntos();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      texto: '',
      enlace: '',
      icono: 'MapPin',
      orden: puntos.length + 1,
      activo: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item: PuntoContactoItem) => {
    setEditingItem(item);
    setForm({
      texto: item.texto,
      enlace: item.enlace || '',
      icono: item.icono || 'MapPin',
      orden: item.orden,
      activo: item.activo,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.texto.trim()) {
      showFeedback('error', 'Por favor ingresa el texto del punto.');
      return;
    }

    setSaving(true);
    try {
      const url = editingItem
        ? `/api/admin/puntos-contacto/${editingItem.id}`
        : '/api/admin/puntos-contacto';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error al guardar');
      }

      await fetchPuntos();
      window.dispatchEvent(new Event('puntos-contacto-updated'));
      setModalOpen(false);
      showFeedback('success', editingItem ? 'Punto actualizado correctamente.' : 'Punto creado exitosamente.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Error al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmItem) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/puntos-contacto/${deleteConfirmItem.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar');

      await fetchPuntos();
      window.dispatchEvent(new Event('puntos-contacto-updated'));
      setDeleteConfirmItem(null);
      showFeedback('success', 'Punto eliminado correctamente.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Error al eliminar.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-brand-green" />
            <span>Puntos de Contacto y Ubicaciones</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra las ubicaciones, teléfonos y correos mostrados en el Footer y en el Menú Hamburguesa.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-green hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Punto</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Table / List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-7 h-7 animate-spin text-brand-green mr-2" />
            <span>Cargando puntos...</span>
          </div>
        ) : puntos.length === 0 ? (
          <div className="text-center py-16 px-4">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-800">No hay puntos de contacto</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              Comienza agregando las sucursales, oficinas, teléfonos o correos de la empresa.
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-xl text-xs font-semibold"
            >
              <Plus className="w-4 h-4" /> Agregar primer punto
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {puntos.map((punto, idx) => (
              <div
                key={punto.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-gray-50/70 transition-colors gap-4"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center text-brand-green shrink-0 shadow-sm mt-0.5">
                    {renderPuntoIcon(punto.icono, 'w-5 h-5')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-900 text-sm">{punto.texto}</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                        Ícono: {punto.icono}
                      </span>
                    </div>
                    {punto.enlace && (
                      <p className="text-xs text-brand-green/90 mt-1 truncate max-w-md font-mono">
                        {punto.enlace}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(punto)}
                    className="p-2 text-gray-500 hover:text-brand-navy hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmItem(punto)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Agregar / Editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-brand-green/10 text-brand-green rounded-lg">
                  {renderPuntoIcon(form.icono, 'w-5 h-5')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {editingItem ? 'Editar Punto de Contacto' : 'Nuevo Punto de Contacto'}
                  </h3>
                  <p className="text-xs text-gray-500">Visible en Footer y Menú Lateral</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Ícono Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Selecciona el Ícono
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 border border-gray-200 rounded-xl bg-gray-50/50">
                  {ICON_CHOICES.map((opt) => {
                    const IconC = opt.icon;
                    const isSelected = form.icono.toLowerCase() === opt.id.toLowerCase();
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setForm({ ...form, icono: opt.id })}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl text-[11px] font-medium transition-all border ${
                          isSelected
                            ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-brand-green/50 hover:bg-brand-green/5'
                        }`}
                      >
                        <IconC className={`w-5 h-5 mb-1 ${isSelected ? 'text-brand-green' : 'text-gray-600'}`} />
                        <span className="truncate w-full text-center">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Texto */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Texto o Dirección <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Loreto, Zacatecas ó +52 81 2207 0314"
                  value={form.texto}
                  onChange={(e) => setForm({ ...form, texto: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                />
              </div>

              {/* Enlace */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Enlace de Destino (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="tel:+528122070314, mailto:info@gecvt.com, https://..."
                  value={form.enlace}
                  onChange={(e) => setForm({ ...form, enlace: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Si se omite con ícono de Teléfono o Correo, el enlace se generará automáticamente.
                </p>
              </div>

              {/* Orden */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Orden de Visualización
                </label>
                <input
                  type="number"
                  value={form.orden}
                  onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-brand-green hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Guardar Cambios' : 'Crear Punto'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminar */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Eliminar Punto</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar{' '}
              <strong className="text-gray-900 font-semibold">"{deleteConfirmItem.texto}"</strong>?
              Desaparecerá del footer y del menú lateral.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <span>Eliminar</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
