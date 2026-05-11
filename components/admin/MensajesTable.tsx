'use client';

import { useState } from 'react';
import { Mail, User, Tag, Calendar, X } from 'lucide-react';

type Mensaje = {
  id: string;
  nombre: string;
  email: string;
  razonContacto: string;
  mensaje: string;
  leido: boolean;
  createdAt: string;
};

const RAZONES = ['Todos', 'proveedor', 'cliente', 'alianza', 'otro'];

export function MensajesTable({ mensajes: initialMensajes }: { mensajes: Mensaje[] }) {
  const [mensajes, setMensajes] = useState(initialMensajes);
  const [selected, setSelected] = useState<Mensaje | null>(null);
  const [filtro, setFiltro] = useState('Todos');

  const handleOpen = async (msg: Mensaje) => {
    setSelected(msg);
    if (!msg.leido) {
      await fetch(`/api/admin/mensajes/${msg.id}`, { method: 'PATCH' });
      setMensajes((prev) => prev.map((m) => m.id === msg.id ? { ...m, leido: true } : m));
    }
  };

  const filtered = filtro === 'Todos' ? mensajes : mensajes.filter((m) => m.razonContacto === filtro);

  return (
    <>
      {/* Filtros */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {RAZONES.map((r) => (
          <button key={r} onClick={() => setFiltro(r)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${filtro === r ? 'bg-[#4DB26B] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {r}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Razón</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">No hay mensajes en esta categoría.</td></tr>
            ) : filtered.map((msg) => (
              <tr key={msg.id}
                onClick={() => handleOpen(msg)}
                className={`cursor-pointer hover:bg-blue-50 transition-colors ${!msg.leido ? 'bg-blue-50/40' : ''}`}>
                <td className="px-6 py-4">
                  <p className={`text-sm ${!msg.leido ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>{msg.nombre}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{msg.email}</td>
                <td className="px-6 py-4">
                  <span className="text-xs capitalize bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{msg.razonContacto}</span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString('es')}</td>
                <td className="px-6 py-4">
                  {msg.leido ? (
                    <span className="text-xs text-gray-400">Leído</span>
                  ) : (
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Mensaje de {selected.nombre}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 mb-5 text-sm text-gray-600">
              <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" />{selected.nombre}</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{selected.email}</div>
              <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-gray-400" /><span className="capitalize">{selected.razonContacto}</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" />{new Date(selected.createdAt).toLocaleString('es')}</div>
            </div>
            <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100">
              {selected.mensaje}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
