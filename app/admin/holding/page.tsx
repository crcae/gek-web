import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Pencil } from 'lucide-react';

export default async function HoldingAdmin() {
  const unidades = await prisma.unidadNegocio.findMany({ orderBy: { orden: 'asc' } });

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Holding</h1>
          <p className="text-gray-500 text-sm mt-1">Gestión de unidades de negocio</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Orden</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Ubicación</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {unidades.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-500">#{u.orden}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-800">{u.nameEs}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{u.location}</td>
                <td className="px-6 py-4">
                  {u.activa ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Activa
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Inactiva
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <Link
                      href={`/admin/holding/${u.id}`}
                      className="p-2 text-gray-400 hover:text-[#4DB26B] hover:bg-green-50 rounded transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
