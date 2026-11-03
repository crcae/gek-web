'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export interface BlogCategoriaItem {
  id: string;
  nombre: string;
  orden: number;
}

export function BlogCategoriasModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [categorias, setCategorias] = useState<BlogCategoriaItem[]>([]);
  const [loading, setLoading] = useState(false);

  // New category form
  const [newCatName, setNewCatName] = useState('');
  const [adding, setAdding] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/blog/categorias');
      const data = await res.json();
      if (data.categorias) setCategorias(data.categorias);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategorias();
    }
  }, [open]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setAdding(true);
    try {
      const res = await fetch('/api/admin/blog/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: newCatName.trim() }),
      });
      const data = await res.json();
      if (data.categoria) {
        setNewCatName('');
        await fetchCategorias();
      }
    } catch (err) {
      alert('Error al agregar categoría');
    } finally {
      setAdding(false);
    }
  };

  const handleStartEdit = (cat: BlogCategoriaItem) => {
    setEditingId(cat.id);
    setEditName(cat.nombre);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/blog/categorias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: editName.trim() }),
      });
      if (res.ok) {
        setEditingId(null);
        await fetchCategorias();
      }
    } catch (err) {
      alert('Error al actualizar');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la categoría "${nombre}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/blog/categorias/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchCategorias();
      }
    } catch (err) {
      alert('Error al eliminar');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
      >
        <Tag className="w-4 h-4 text-brand-green" />
        <span>Categorías</span>
      </button>

      {mounted && open && createPortal(
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-brand-green/10 text-brand-green rounded-lg">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Categorías del Blog
                  </h3>
                  <p className="text-xs text-gray-500">
                    Crea y administra las categorías disponibles para los artículos
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Form Nueva Categoría */}
              <form onSubmit={handleAdd} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Escribe el nombre de la nueva categoría..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
                />
                <button
                  type="submit"
                  disabled={adding || !newCatName.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-green hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer shrink-0"
                >
                  {adding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Agregar</span>
                    </>
                  )}
                </button>
              </form>

              {/* Categorías List */}
              <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="py-12 flex items-center justify-center text-gray-400 text-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-brand-green mr-2" />
                    Cargando categorías...
                  </div>
                ) : categorias.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-sm">
                    No hay categorías registradas.
                  </div>
                ) : (
                  categorias.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/60 transition-colors gap-3"
                    >
                      {editingId === cat.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSaveEdit(cat.id);
                              }
                            }}
                            className="flex-1 px-3 py-1.5 border border-brand-green rounded-lg text-sm focus:outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(cat.id)}
                            disabled={savingEdit}
                            className="p-1.5 bg-brand-green text-white rounded-lg hover:bg-emerald-600"
                            title="Guardar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-brand-green shrink-0" />
                            <span className="text-sm font-semibold text-gray-800 truncate">
                              {cat.nombre}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(cat)}
                              className="p-1.5 text-gray-400 hover:text-brand-navy hover:bg-gray-100 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(cat.id, cat.nombre)}
                              disabled={deletingId === cat.id}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-gray-50/80 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
