'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { createPortal } from 'react-dom';
import {
  Settings,
  Plus,
  Trash2,
  ExternalLink,
  X,
  Save,
  Loader2,
  Award,
} from 'lucide-react';
import { ImageSelectorField } from '@/components/admin/ImageSelectorField';
import { cleanImageUrl } from '@/lib/cleanImageUrl';

export interface CertificacionItem {
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
}

interface CertificacionesSectionProps {
  certificaciones?: CertificacionItem[];
  locale?: string;
  sectionEyebrow?: string;
  sectionTitulo?: string;
  sectionSubtitulo?: string;
}

const DEFAULT_PRIMUS: CertificacionItem = {
  id: 'fallback-primus',
  nombre: 'Primus GFS',
  eyebrow: 'Certificación de calidad',
  titulo_es: 'Certificación PRIMUS GFS',
  titulo_en: 'PRIMUS GFS Certification',
  titulo_de: 'PRIMUS GFS Zertifizierung',
  desc_es: 'Inocuidad alimentaria certificada internacionalmente en todas nuestras unidades productivas.',
  desc_en: 'Internationally certified food safety across all our production units.',
  desc_de: 'International zertifizierte Lebensmittelsicherheit in allen unseren Produktionseinheiten.',
  logoUrl: '/images/logos/PrimusGFS_Logo_web.png',
  enlaceUrl: null,
  orden: 0,
  activa: true,
};

export function CertificacionesSection({
  certificaciones = [],
  locale = 'es',
}: CertificacionesSectionProps) {
  const { data: session } = useSession();
  const isAdmin = !!session;

  const [items, setItems] = useState<CertificacionItem[]>(
    certificaciones.length > 0 ? certificaciones : [DEFAULT_PRIMUS]
  );
  const [mounted, setMounted] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CertificacionItem | null>(null);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (certificaciones.length > 0) {
      setItems(certificaciones);
    }
  }, [certificaciones]);

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({
      nombre: '',
      eyebrow: 'Certificación de calidad',
      titulo_es: '',
      titulo_en: '',
      titulo_de: '',
      desc_es: '',
      desc_en: '',
      desc_de: '',
      logoUrl: '',
      enlaceUrl: '',
      orden: items.length,
      activa: true,
    });
    setActiveLangTab('es');
    setModalOpen(true);
  };

  const openEditModal = (item: CertificacionItem) => {
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
      alert('Por favor completa el Nombre, Título en Español y selecciona el Logotipo');
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editingItem && !editingItem.id.startsWith('fallback-');
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

      const saved = await res.json();

      if (isEdit) {
        setItems((prev) => prev.map((it) => (it.id === saved.id ? saved : it)));
      } else {
        setItems((prev) => [...prev.filter((it) => !it.id.startsWith('fallback-')), saved]);
      }

      setModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Error al guardar la certificación');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: CertificacionItem) => {
    if (item.id.startsWith('fallback-')) {
      alert('Esta es una certificación por defecto.');
      return;
    }
    if (!confirm(`¿Eliminar la certificación "${item.nombre}"?`)) return;

    setDeletingId(item.id);
    try {
      const res = await fetch(`/api/admin/certificaciones/${item.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar');

      setItems((prev) => prev.filter((it) => it.id !== item.id));
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter for display: admin sees all, visitors see active only
  const displayItems = isAdmin ? items : items.filter((it) => it.activa);

  if (displayItems.length === 0 && !isAdmin) {
    return null;
  }

  // Multilingual helper matching exact translations from photo 2
  const getLocalized = (item: CertificacionItem) => {
    let eyebrow = item.eyebrow || 'Certificación de calidad';
    let titulo = item.titulo_es;
    let desc = item.desc_es;

    if (locale === 'en') {
      titulo = item.titulo_en || item.titulo_es;
      desc = item.desc_en || item.desc_es;
      if (eyebrow.toLowerCase().includes('calidad') || eyebrow.toLowerCase().includes('certificaci')) {
        eyebrow = 'Quality certification';
      }
    } else if (locale === 'de') {
      titulo = item.titulo_de || item.titulo_es;
      desc = item.desc_de || item.desc_es;
      if (eyebrow.toLowerCase().includes('calidad') || eyebrow.toLowerCase().includes('certificaci')) {
        eyebrow = 'Qualitätszertifizierung';
      }
    }

    return { eyebrow, titulo, desc };
  };

  const count = displayItems.length;

  return (
    <section className="w-full bg-white py-12 px-4 sm:px-6 border-y border-brand-gray/25 relative">
      
      {/* Admin Quick Action Button (discrete) */}
      {isAdmin && (
        <div className="max-w-4xl mx-auto flex justify-end mb-4">
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-green/10 hover:bg-brand-green text-brand-green hover:text-white text-xs font-semibold transition-all border border-brand-green/30 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Agregar Certificación</span>
          </button>
        </div>
      )}

      {/* Certifications Layout */}
      <div
        className={
          count === 1
            ? 'max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6 justify-center text-center sm:text-left'
            : count === 2
            ? 'max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center'
            : 'max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start'
        }
      >
        {displayItems.map((item) => {
          const { eyebrow, titulo, desc } = getLocalized(item);
          const cleanLogo = cleanImageUrl(item.logoUrl) || '/images/logos/PrimusGFS_Logo_web.png';

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center gap-6 justify-center text-center sm:text-left relative group"
            >
              {/* Logo Card with exact styling from photo 2 */}
              <div className="bg-white p-3 rounded-xl shadow-md shrink-0 border border-brand-gray/10 relative">
                <Image
                  src={cleanLogo}
                  alt={item.nombre}
                  width={140}
                  height={55}
                  style={{ objectFit: 'contain' }}
                  className="h-[55px] w-[140px] object-contain"
                />

                {/* Admin Gear Button exactly matching photo 2 */}
                {isAdmin && (
                  <div className="absolute top-1 right-1 flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="w-7 h-7 bg-[#2A3B47] hover:bg-[#1E2B34] text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                      title="Editar certificación"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    {displayItems.length > 1 && (
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={deletingId === item.id}
                        className="w-7 h-7 bg-red-600/90 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-md transition-colors disabled:opacity-50"
                        title="Eliminar certificación"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Text Block matching photo 2 */}
              <div>
                {eyebrow && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-green block mb-1">
                    {eyebrow}
                  </span>
                )}
                <p className="font-display text-xl font-bold text-brand-navy mb-1.5">
                  {titulo}
                </p>
                <p className="font-body text-sm text-brand-navy/65 leading-relaxed max-w-xl">
                  {desc}
                </p>

                {item.enlaceUrl && (
                  <a
                    href={item.enlaceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green hover:underline mt-2"
                  >
                    <span>Ver certificado</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal Admin (Crear / Editar Certificación) ── */}
      {mounted && modalOpen && createPortal(
        <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
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
              
              {/* Logo Selector */}
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

              {/* Nombre y Eyebrow */}
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
                    placeholder="ej. Certificación de calidad"
                    value={form.eyebrow}
                    onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green focus:outline-none bg-white text-gray-800"
                  />
                </div>
              </div>

              {/* Textos descriptivos por idioma */}
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
                        placeholder="Inocuidad alimentaria certificada internacionalmente..."
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
                        placeholder="Internationally certified food safety..."
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
                        placeholder="International zertifizierte Lebensmittelsicherheit..."
                        value={form.desc_de}
                        onChange={(e) => setForm({ ...form, desc_de: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-brand-green focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Enlace y Orden */}
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

              {/* Activa */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="cert-activa"
                  checked={form.activa}
                  onChange={(e) => setForm({ ...form, activa: e.target.checked })}
                  className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green"
                />
                <label htmlFor="cert-activa" className="text-sm font-medium text-gray-700 cursor-pointer">
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
                  <span>{saving ? 'Guardando...' : 'Guardar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
