'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import {
  MapPin,
  Phone,
  Mail,
  Building,
  Clock,
  Globe,
  MessageSquare,
  Smartphone,
  Truck,
  Users,
  Briefcase,
  FileText,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  ExternalLink,
} from 'lucide-react';

export interface PuntoContactoItem {
  id: string;
  texto: string;
  enlace?: string | null;
  icono: string;
  orden: number;
  activo: boolean;
}

export const ICON_CHOICES = [
  { id: 'MapPin', label: 'Ubicación', icon: MapPin },
  { id: 'Phone', label: 'Teléfono', icon: Phone },
  { id: 'Mail', label: 'Correo', icon: Mail },
  { id: 'Building', label: 'Oficina / Planta', icon: Building },
  { id: 'Clock', label: 'Horario', icon: Clock },
  { id: 'Globe', label: 'Web / Global', icon: Globe },
  { id: 'MessageSquare', label: 'WhatsApp / Chat', icon: MessageSquare },
  { id: 'Smartphone', label: 'Celular', icon: Smartphone },
  { id: 'Truck', label: 'Logística', icon: Truck },
  { id: 'Users', label: 'Atención', icon: Users },
  { id: 'Briefcase', label: 'Corporativo', icon: Briefcase },
  { id: 'FileText', label: 'Información', icon: FileText },
];

export function renderPuntoIcon(name: string, className = 'w-4 h-4') {
  const match = ICON_CHOICES.find((i) => i.id.toLowerCase() === (name || '').toLowerCase());
  const IconComp = match ? match.icon : MapPin;
  return <IconComp className={className} />;
}

interface Props {
  initialItems?: PuntoContactoItem[];
  iconSize?: 'sm' | 'md';
  textSize?: 'xs' | 'sm';
  showAddButton?: boolean;
}

export function PuntosContactoList({
  initialItems = [],
  iconSize = 'md',
  textSize = 'sm',
  showAddButton = true,
}: Props) {
  const { data: session } = useSession();
  const isAdmin = !!session;
  const router = useRouter();

  const [items, setItems] = useState<PuntoContactoItem[]>(initialItems);
  const [mounted, setMounted] = useState(false);

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
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialItems.length > 0) {
      setItems(initialItems);
    }
  }, [initialItems]);

  // Synchronize instances via custom event
  useEffect(() => {
    const handleUpdate = () => {
      fetch('/api/admin/puntos-contacto')
        .then((res) => res.json())
        .then((data) => {
          if (data.puntos) setItems(data.puntos);
        })
        .catch(() => {});
    };

    window.addEventListener('puntos-contacto-updated', handleUpdate);
    return () => window.removeEventListener('puntos-contacto-updated', handleUpdate);
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      texto: '',
      enlace: '',
      icono: 'MapPin',
      orden: items.length + 1,
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
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.texto.trim()) {
      alert('Por favor ingresa el texto del punto.');
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
        throw new Error(err.error || 'Error al guardar el punto');
      }

      const data = await res.json();
      if (editingItem) {
        setItems((prev) =>
          prev.map((i) => (i.id === editingItem.id ? { ...i, ...data.punto } : i))
        );
      } else if (data.punto) {
        setItems((prev) => [...prev, data.punto]);
      }

      setModalOpen(false);
      window.dispatchEvent(new Event('puntos-contacto-updated'));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
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

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Error al eliminar');
      }

      setItems((prev) => prev.filter((i) => i.id !== deleteConfirmItem.id));
      setDeleteConfirmItem(null);
      window.dispatchEvent(new Event('puntos-contacto-updated'));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  const getHref = (item: PuntoContactoItem): string | null => {
    if (item.enlace && item.enlace.trim()) {
      return item.enlace.trim();
    }
    const ico = item.icono.toLowerCase();
    const text = item.texto.trim();
    if (ico === 'phone' || ico === 'smartphone') {
      return `tel:${text.replace(/[\s()-]/g, '')}`;
    }
    if (ico === 'mail') {
      return `mailto:${text}`;
    }
    if (ico === 'messagesquare' && /^\+?[0-9\s-]+$/.test(text)) {
      return `https://wa.me/${text.replace(/[^0-9]/g, '')}`;
    }
    return null;
  };

  const iconCls = iconSize === 'md' ? 'w-5 h-5 text-brand-green shrink-0 mt-0.5' : 'w-4 h-4 text-brand-green shrink-0 mt-0.5';
  const textCls = textSize === 'xs' ? 'text-xs' : 'text-sm';

  return (
    <div className="space-y-3.5">
      {items.map((item) => {
        const href = getHref(item);
        const isExternal = href && (href.startsWith('http://') || href.startsWith('https://'));

        return (
          <div
            key={item.id}
            className={`group relative flex items-start justify-between gap-2.5 text-white/80 ${textCls} font-body hover:text-white transition-colors`}
          >
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {renderPuntoIcon(item.icono, iconCls)}
              <div className="min-w-0 flex-1 break-words">
                {href ? (
                  <a
                    href={href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className="hover:text-brand-green transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{item.texto}</span>
                    {isExternal && <ExternalLink className="w-3 h-3 opacity-60 inline shrink-0" />}
                  </a>
                ) : (
                  <span>{item.texto}</span>
                )}
              </div>
            </div>

            {/* Admin Controls on hover/touch */}
            {isAdmin && (
              <div className="opacity-75 group-hover:opacity-100 flex items-center gap-1 shrink-0 ml-2 bg-black/40 backdrop-blur px-1.5 py-0.5 rounded-md border border-white/10 transition-opacity">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="p-1 text-gray-300 hover:text-brand-green rounded transition-colors"
                  title="Editar punto"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmItem(item)}
                  className="p-1 text-gray-300 hover:text-red-400 rounded transition-colors"
                  title="Eliminar punto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Admin Add Button */}
      {isAdmin && showAddButton && (
        <div className="pt-2">
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 text-xs text-brand-green hover:text-white bg-brand-green/10 hover:bg-brand-green px-3 py-1.5 rounded-lg border border-brand-green/30 transition-all font-medium cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agregar punto</span>
          </button>
        </div>
      )}

      {/* MODAL: Agregar / Editar Punto */}
      {mounted && modalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-brand-green/10 text-brand-green rounded-lg">
                  {renderPuntoIcon(form.icono, 'w-5 h-5')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {editingItem ? 'Editar Punto de Contacto' : 'Agregar Punto de Contacto'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Visible en el footer y en el menú lateral de navegación
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Selector de Ícono */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Selecciona el Ícono
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto p-1 border border-gray-100 rounded-xl bg-gray-50/50">
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

              {/* Texto del punto */}
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

              {/* Enlace opcional */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Enlace de Destino (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. tel:+528122070314, mailto:info@gecvt.com, https://maps.google.com/..."
                  value={form.enlace}
                  onChange={(e) => setForm({ ...form, enlace: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Si se deja vacío con ícono de Teléfono o Correo, el enlace se crea automáticamente.
                </p>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-brand-green hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Guardar Cambios' : 'Agregar Punto'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* CONFIRM DELETE MODAL */}
      {mounted && deleteConfirmItem && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900">
                Eliminar Punto
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar{' '}
              <strong className="text-gray-900 font-semibold">
                "{deleteConfirmItem.texto}"
              </strong>
              ? Desaparecerá del footer y del menú lateral.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
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
        </div>,
        document.body
      )}
    </div>
  );
}
