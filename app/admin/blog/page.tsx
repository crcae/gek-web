import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { 
  Plus, 
  Eye, 
  Edit, 
  Sparkles, 
  Calendar, 
  Globe, 
  CheckCircle2, 
  Clock,
  BookOpen
} from 'lucide-react';
import { DeleteBlogPostButton } from '@/components/admin/DeleteBlogPostButton';

export default async function AdminBlogListPage() {
  const session = await getServerSession();

  const posts = await prisma.blogPost.findMany({
    orderBy: { fechaPublicacion: 'desc' },
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-6 h-6 text-brand-green" />
            <h1 className="text-2xl font-bold text-brand-navy font-display">
              Gestor de Blog & Noticias
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Administra los artículos y contenidos multimedia publicados en la web ({posts.length} artículos)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/es/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Globe className="w-4 h-4 text-brand-green" />
            <span>Ver Blog en Vivo</span>
          </Link>
          <Link
            href="/admin/blog/nuevo"
            className="flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Artículo</span>
          </Link>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">Artículo</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4">Fecha</th>
                <th className="py-3.5 px-4">Vistas</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No hay artículos en el blog todavía. Haz clic en &ldquo;Crear Artículo&rdquo; para redactar el primero.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 relative overflow-hidden shrink-0 border border-gray-200">
                          {post.portadaUrl ? (
                            <Image
                              src={post.portadaUrl}
                              alt={post.titulo_es}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <BookOpen className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-navy truncate max-w-md block group-hover:text-brand-green transition-colors">
                              {post.titulo_es}
                            </span>
                            {post.destacado && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                <Sparkles className="w-3 h-3" /> Destacado
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 font-mono">
                            /blog/{post.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="bg-brand-navy/5 text-brand-navy font-bold text-xs px-2.5 py-1 rounded-full">
                        {post.categoria}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {post.publicado ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Publicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-100 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3.5 h-3.5" /> Borrador
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(post.fechaPublicacion).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-xs font-mono text-gray-600 font-bold">
                      {post.vistas}
                    </td>

                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/es/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-brand-green hover:bg-emerald-50 transition-colors"
                          title="Ver en vivo"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-brand-navy hover:bg-gray-100 transition-colors"
                          title="Editar artículo"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteBlogPostButton id={post.id} title={post.titulo_es} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
