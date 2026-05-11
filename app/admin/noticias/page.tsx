import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

async function deleteNoticia(id: string) {
  'use server';
  const session = await getServerSession();
  if (!session) return;
  await prisma.noticia.delete({ where: { id } });
  revalidatePath('/admin/noticias');
}

export default async function NoticiasAdmin() {
  const noticias = await prisma.noticia.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Noticias</h1>
          <p className="text-gray-500 text-sm mt-1">{noticias.length} noticias en total</p>
        </div>
        <Link
          href="/admin/noticias/nueva"
          className="flex items-center gap-2 bg-[#4DB26B] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#43a060] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva noticia
        </Link>
      </div>

      {noticias.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-16 text-center">
          <p className="text-gray-400 mb-4">No hay noticias publicadas aún.</p>
          <Link
            href="/admin/noticias/nueva"
            className="inline-flex items-center gap-2 bg-[#4DB26B] text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-[#43a060] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Crear primera noticia
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Título (ES)</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {noticias.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{n.titulo_es}</p>
                  </td>
                  <td className="px-6 py-4">
                    {n.publicada ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Publicada
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        Borrador
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(n.createdAt).toLocaleDateString('es')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/noticias/${n.id}`}
                        className="p-2 text-gray-400 hover:text-[#4DB26B] hover:bg-green-50 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <form action={deleteNoticia.bind(null, n.id)}>
                        <button
                          type="submit"
                          onClick={(e) => { if (!confirm('¿Eliminar esta noticia?')) e.preventDefault(); }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
