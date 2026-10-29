'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Award,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  ShieldCheck,
  X,
  Save,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { ImageSelectorField } from '@/components/admin/ImageSelectorField';
import { cleanImageUrl } from '@/lib/cleanImageUrl';

interface Certificacion {
  id: string;
  nombre: string;
  eyebrow?: string | null;
  titulo_es: string;
  titulo_en?: string | null;
  titulo_de?: string | null;
  desc_es: string;
  desc_en?: string | null;
  desc_de?: string | null;
  logoUrl: string;
  enlaceUrl?: string | null;
  orden: number;
  activa: boolean;
  createdAt: string;
}

export default function AdminCertificacionesPage() {
  const [certificaciones, setCertificaciones] = useState<Certificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Certificacion | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeLangTab, setActiveLangTab] = useState<'es' | 'en' | 'de'>('es');

  // Form State
  const [form, setForm] = useState({
    nombre: '',
    eyebrow: '',
    titulo_es: '',
    titulo_en: '',
    titulo_de: '',
    desc_es: '',
    desc_en: '',
    desc_de: '',
    logoUrl: '',
    enlaceUrl: '',
    orden: 0,
    activa: true,
  });

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchCertificaciones = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/certificaciones');
      if (!res.ok) throw new Error('Error al cargar');
      const data = await res.json();
      setCertificaciones(Array.isArray(data) ? data : []);
    } catch {
      showFeedback('error', 'Error al cargar las certificaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificaciones();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      nombre: '',
      eyebrow: 'Certificación de Calidad',
      titulo_es: '',
      titulo_en: '',
      titulo_de: '',
      desc_es: '',
      desc_en: '',
      desc_de: '',
      logoUrl: '',
      enlaceUrl: '',
      orden: certificaciones.length,
      activa: true,
    });
    setActiveLangTab('es');
    setModalOpen(true);
  };

  const openEditModal = (item: Certificacion) => {
    setEditingItem(item);
    setForm({
      nombre: item.nombre,
      eyebrow: item.eyebrow || '',
      titulo_es: item.titulo_es,
      titulo_en: item.titulo_en || '',
      titulo_de: item.titulo_de || '',
      desc_es: item.desc_es || '',
      desc_en: item.desc_en || '',
      desc_de: item.desc_de || '',
      logoUrl: item.logoUrl || '',
      enlaceUrl: item.enlaceUrl || '',
      orden: item.orden ?? 0,
      activa: item.activa ?? true,
    });
    setActiveLangTab('es');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.titulo_es.trim() || !form.logoUrl.trim()) {
      showFeedback('error', 'Nombre, Título (español) y Logo son obligatorios');
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editingItem;
      const url = isEdit
        ? `/api/admin/certificaciones/${editingItem.id}`
        : '/api/admin/certificaciones';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error al guardar');
      }

      showFeedback(
        'success',
        isEdit ? 'Certificación actualizada con éxito' : 'Certificación creada con éxito'
      );
      setModalOpen(false);
      fetchCertificaciones();
    } catch (err: any) {
      showFeedback('error', err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActiva = async (item: Certificacion) => {
    try {
      const res = await fetch(`/api/admin/certificaciones/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activa: !item.activa }),
      });
      if (!res.ok) throw new Error('Error al actualizar');
      setCertificaciones((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, activa: !c.activa } : c))
      );
      showFeedback('success', `Certificación ${!item.activa ? 'activada' : 'desactivada'}`);
    } catch {
      showFeedback('error', 'Error al cambiar estado');
    }
  };

  const handleDelete = async (item: Certificacion) => {
    if (!confirm(`¿Eliminar la certificación "${item.nombre}"? Esta acción no se puede deshacer.`))
      return;

    setDeletingId(item.id);
    try {
      const res = await fetch(`/api/admin/certificaciones/${item.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar');

      setCertificaciones((prev) => prev.filter((c) => c.id !== item.id));
      showFeedback('success', 'Certificación eliminada');
    } catch {
      showFeedback('error', 'Error al eliminar');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-brand-green font-semibold text-xs uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Quiénes Somos · Calidad & Inocuidad</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-brand-navy">
            Certificaciones y Sellos de Calidad
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra las certificaciones internacionales que se muestran en la sección de Quiénes Somos.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-[#4DB26B] hover:bg-[#43a060] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nueva Certificación</span>
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
          <p className="text-sm">Cargando certificaciones...</p>
        </div>
      ) : certificaciones.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-brand-navy mb-1">No hay certificaciones registradas</h3>
          <p className="text-sm text-slate-500 mb-6">
            Comienza agregando tu primera certificación (como Primus GFS, GlobalG.A.P., SENASICA).
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#4DB26B] hover:bg-[#43a060] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Certificación</span>
          </button>
        </div>
      ) : (
        /* Certifications Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificaciones.map((item) => {
            const cleanLogo = cleanImageUrl(item.logoUrl);

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                  item.activa ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
                }`}
              >
                <div>
                  {/* Top Bar with Badge and Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        item.activa
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {item.activa ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-slate-400" />
                          <span>Oculta</span>
                        </>
                      )}
                    </span>

                    <span className="text-xs text-slate-400 font-mono">
                      Orden: #{item.orden}
                    </span>
                  </div>

                  {/* Logo Container */}
                  <div className="w-full h-24 bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-center mb-4">
                    {cleanLogo ? (
                      <Image
                        src={cleanLogo}
                        alt={item.nombre}
                        width={160}
                        height={70}
                        className="max-h-16 w-auto object-contain"
                      />
                    ) : (
                      <Award className="w-8 h-8 text-slate-300" />
                    )}
                  </div>

                  {item.eyebrow && (
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-green mb-0.5">
                      {item.eyebrow}
                    </p>
                  )}
                  <h3 className="font-display font-bold text-base text-brand-navy mb-1.5">
                    {item.titulo_es}
                  </h3>
                  <p className="font-body text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
                    {item.desc_es}
                  </p>

                  {item.enlaceUrl && (
                    <a
                      href={item.enlaceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-brand-green hover:underline mb-2 font-medium"
                    >
                      <span>Ver enlace</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                  <button
                    onClick={() => handleToggleActiva(item)}
                    className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium p-1 rounded hover:bg-slate-100 transition-colors"
                  >
                    {item.activa ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{item.activa ? 'Ocultar' : 'Activar'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 text-slate-600 hover:text-brand-green hover:bg-brand-green/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deletingId === item.id}
                      className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Eliminar"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal Form ── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-brand-navy text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-green/20 flex items-center justify-center text-brand-green">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display uppercase tracking-wider text-brand-green">
                    {editingItem ? 'Editar Certificación' : 'Nueva Certificación'}
                  </h3>
                  <p className="text-xs text-white/60">
                    {editingItem ? editingItem.nombre : 'Agrega una certificación internacional'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-6">
              
              {/* 1. Logo Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Logotipo / Badge Oficial <span className="text-red-500">*</span>
                </label>
                <ImageSelectorField
                  label="Logotipo"
                  valorActual={form.logoUrl}
                  onChange={(url) => setForm({ ...form, logoUrl: url })}
                  type="image"
                  aspectRatio="libre"
                />
              </div>

              {/* 2. Nombre y Eyebrow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Nombre de la Entidad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Primus GFS, GlobalG.A.P."
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green focus:outline-none bg-white text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Eyebrow / Categoría
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Inocuidad y Calidad"
                    value={form.eyebrow}
                    onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green focus:outline-none bg-white text-gray-800"
                  />
                </div>
              </div>

              {/* 3. Textos e Idiomas */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Textos descriptivos
                  </span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
                    {(['es', 'en', 'de'] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveLangTab(lang)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                          activeLangTab === lang
                            ? 'bg-brand-navy text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lang === 'es' ? '🇲🇽 Español' : lang === 'en' ? '🇺🇸 Inglés' : '🇩🇪 Alemán'}
                      </button>
                    ))}
                  </div>
                </div>

                {activeLangTab === 'es' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Título en Español <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ej. Certificación PRIMUS GFS"
                        value={form.titulo_es}
                        onChange={(e) => setForm({ ...form, titulo_es: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-green focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Descripción en Español
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Explica qué valida la certificación, alcances o auditorías..."
                        value={form.desc_es}
                        onChange={(e) => setForm({ ...form, desc_es: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-green focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                )}

                {activeLangTab === 'en' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Título en Inglés (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="ej. PRIMUS GFS Certification"
                        value={form.titulo_en}
                        onChange={(e) => setForm({ ...form, titulo_en: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-green focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Descripción en Inglés
                      </label>
                      <textarea
                        rows={3}
                        placeholder="English description..."
                        value={form.desc_en}
                        onChange={(e) => setForm({ ...form, desc_en: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-green focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                )}

                {activeLangTab === 'de' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Título en Alemán (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="ej. PRIMUS GFS Zertifizierung"
                        value={form.titulo_de}
                        onChange={(e) => setForm({ ...form, titulo_de: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-green focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Descripción en Alemán
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Deutsche Beschreibung..."
                        value={form.desc_de}
                        onChange={(e) => setForm({ ...form, desc_de: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-green focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Enlace y Orden */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Enlace de Verificación (Opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={form.enlaceUrl}
                    onChange={(e) => setForm({ ...form, enlaceUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Orden de Visualización
                  </label>
                  <input
                    type="number"
                    value={form.orden}
                    onChange={(e) => setForm({ ...form, orden: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* 5. Activa */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="admin-cert-activa"
                  checked={form.activa}
                  onChange={(e) => setForm({ ...form, activa: e.target.checked })}
                  className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                />
                <label htmlFor="admin-cert-activa" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Certificación Activa (Visible al público)
                </label>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-[#4DB26B] hover:bg-[#43a060] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md disabled:opacity-50 min-h-[42px] transition-all"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{saving ? 'Guardando...' : 'Guardar Certificación'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
