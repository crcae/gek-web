'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Link from 'next/link';

type UnidadFormData = {
  nameEs: string; nameEn: string; nameDe: string;
  location: string; orden: number; activa: boolean;
};

export function UnidadForm({ unidad }: { unidad: UnidadFormData & { id: string } }) {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'es' | 'en' | 'de'>('es');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<UnidadFormData>({
    defaultValues: unidad,
  });

  const onSubmit = async (data: UnidadFormData) => {
    setMessage(null);
    const res = await fetch(`/api/admin/holding/${unidad.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) setMessage({ type: 'success', text: 'Cambios guardados correctamente.' });
    else setMessage({ type: 'error', text: 'Error al guardar. Intenta nuevamente.' });
  };

  const tabs = [{ id: 'es', label: 'Español' }, { id: 'en', label: 'English' }, { id: 'de', label: 'Deutsch' }] as const;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab.id ? 'border-[#4DB26B] text-[#4DB26B]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre ({tab.label})</label>
          <input {...register(`name${tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}` as any)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DB26B]" />
        </div>
      ))}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
          <input {...register('location')} className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DB26B]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Orden de aparición</label>
          <input type="number" {...register('orden', { valueAsNumber: true })} className="w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DB26B]" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" {...register('activa')} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4DB26B]"></div>
        </label>
        <span className="text-sm font-medium text-gray-700">Unidad activa</span>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <button type="submit" disabled={isSubmitting}
          className="bg-[#4DB26B] text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-[#43a060] transition-colors disabled:opacity-50">
          {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <Link href="/admin/holding" className="text-gray-500 hover:text-gray-700 text-sm font-medium">Cancelar</Link>
      </div>
    </form>
  );
}
