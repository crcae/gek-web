import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Newspaper, MessageSquare, Calendar, Users, Plus, Eye } from 'lucide-react';

export default async function Dashboard() {
  const session = await getServerSession();

  const [leadsNoLeidos, eventosActivos, clientesCount, noticiasPub] = await Promise.all([
    prisma.lead.count({ where: { leido: false } }),
    prisma.evento.count({ where: { activo: true } }),
    prisma.clienteLogo.count(),
    prisma.noticia.count({ where: { publicada: true } }),
  ]);

  const ultimosMensajes = await prisma.mensajeContacto.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const metrics = [
    { label: 'Leads sin atender', value: leadsNoLeidos, icon: Users, color: leadsNoLeidos > 0 ? 'text-red-500' : 'text-[#4DB26B]', href: '/admin/leads' },
    { label: 'Eventos activos', value: eventosActivos, icon: Calendar, color: 'text-blue-500', href: '/admin/eventos' },
    { label: 'Logos de clientes', value: clientesCount, icon: MessageSquare, color: 'text-purple-500', href: '/admin/clientes' },
    { label: 'Noticias publicadas', value: noticiasPub, icon: Newspaper, color: 'text-[#4DB26B]', href: '/admin/noticias' },
  ];

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Bienvenido, {session?.user?.email}</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.label} href={m.href} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow block">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-5 h-5 ${m.color}`} />
              </div>
              <p className={`text-4xl font-bold ${m.color} mb-1`}>{m.value}</p>
              <p className="text-gray-500 text-sm">{m.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-10">
        <Link
          href="/admin/noticias/nueva"
          className="flex items-center gap-2 bg-[#4DB26B] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[#43a060] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva noticia
        </Link>
        <Link
          href="/admin/mensajes"
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Ver mensajes
        </Link>
      </div>

      {/* Últimos mensajes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Últimos mensajes recibidos</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {ultimosMensajes.length === 0 ? (
            <p className="px-6 py-8 text-gray-400 text-sm text-center">No hay mensajes todavía.</p>
          ) : (
            ultimosMensajes.map((msg) => (
              <div key={msg.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{msg.nombre}</p>
                  <p className="text-xs text-gray-400">{msg.razonContacto}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleDateString('es')}</p>
                  {!msg.leido && (
                    <span className="inline-block mt-1 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                      Sin leer
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
