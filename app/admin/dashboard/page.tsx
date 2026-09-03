import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { 
  Newspaper, 
  Sparkles, 
  Calendar, 
  Users, 
  Plus, 
  ExternalLink,
  Edit3,
  Home,
  UserCheck,
  BookOpen,
  Building2,
  Mail,
  ArrowRight
} from 'lucide-react';
import { DashboardCharts } from '@/components/admin/DashboardCharts';

export default async function Dashboard() {
  const session = await getServerSession();

  const [
    leadsNoLeidos, 
    mensajesNoLeidos,
    totalLeads, 
    totalMensajes,
    eventosActivos, 
    clientesCount, 
    noticiasPub,
    allLeads,
    allMensajes,
    ultimosMensajes
  ] = await Promise.all([
    prisma.lead.count({ where: { leido: false } }),
    prisma.mensajeContacto.count({ where: { leido: false } }),
    prisma.lead.count(),
    prisma.mensajeContacto.count(),
    prisma.evento.count({ where: { activo: true } }),
    prisma.clienteLogo.count(),
    prisma.noticia.count({ where: { publicada: true } }),
    prisma.lead.findMany({ select: { id: true, tipo: true, mercado: true, createdAt: true, leido: true } }),
    prisma.mensajeContacto.findMany({ select: { id: true, razonContacto: true, createdAt: true, leido: true } }),
    prisma.mensajeContacto.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
  ]);

  const totalInteracciones = totalLeads + totalMensajes;
  const noLeidosCount = leadsNoLeidos + mensajesNoLeidos;
  const leidosCount = totalInteracciones - noLeidosCount;

  // Compute Real Monthly Distribution for the current year
  const currentYear = new Date().getFullYear();
  const mesesNombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  const monthlyData = mesesNombres.map((mes, index) => {
    const leadsDelMes = allLeads.filter(l => {
      const d = new Date(l.createdAt);
      return d.getFullYear() === currentYear && d.getMonth() === index;
    }).length;

    const mensajesDelMes = allMensajes.filter(m => {
      const d = new Date(m.createdAt);
      return d.getFullYear() === currentYear && d.getMonth() === index;
    }).length;

    return {
      mes,
      leads: leadsDelMes + mensajesDelMes,
    };
  });

  // Compute Real Category Breakdown
  const categoryCounts: Record<string, number> = {};
  allLeads.forEach(l => {
    const cat = l.tipo ? `Lead: ${l.tipo.charAt(0).toUpperCase() + l.tipo.slice(1)}` : 'Cotización Lead';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  allMensajes.forEach(m => {
    const cat = m.razonContacto ? m.razonContacto : 'Consulta General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const categories = Object.entries(categoryCounts)
    .map(([label, count]) => ({
      label,
      count,
      porcentaje: totalInteracciones > 0 ? Math.round((count / totalInteracciones) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const operationalMetrics = [
    { 
      label: 'Leads sin atender', 
      value: noLeidosCount, 
      icon: Users, 
      color: noLeidosCount > 0 ? 'text-red-500' : 'text-brand-green', 
      bgColor: noLeidosCount > 0 ? 'bg-red-50' : 'bg-emerald-50',
      href: '/admin/leads' 
    },
    { 
      label: 'Eventos activos', 
      value: eventosActivos, 
      icon: Calendar, 
      color: 'text-blue-500', 
      bgColor: 'bg-blue-50',
      href: '/admin/eventos' 
    },
    { 
      label: 'Logos de clientes', 
      value: clientesCount, 
      icon: Sparkles, 
      color: 'text-purple-500', 
      bgColor: 'bg-purple-50',
      href: '/admin/clientes' 
    },
    { 
      label: 'Noticias publicadas', 
      value: noticiasPub, 
      icon: Newspaper, 
      color: 'text-brand-green', 
      bgColor: 'bg-emerald-50',
      href: '/admin/noticias' 
    },
  ];

  const quickPages = [
    { title: 'Inicio', path: '/es', desc: 'Hero, pilares, video y cifras principales', icon: Home },
    { title: 'Quiénes Somos', path: '/es/quienes-somos', desc: 'Misión, visión, CEO y capital humano', icon: UserCheck },
    { title: 'Historia', path: '/es/historia', desc: 'Orígenes, Zacatecas y fundadores', icon: BookOpen },
    { title: 'Holding', path: '/es/holding', desc: 'Estructura corporativa y marcas', icon: Building2 },
    { title: 'Contacto', path: '/es/contacto', desc: 'Formulario, sedes y tráiler', icon: Mail },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
            <h1 className="text-2xl md:text-3xl font-bold text-brand-navy font-display">
              Panel de Control
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Sesión activa como <span className="font-semibold text-brand-navy">{session?.user?.email}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/es"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar Sitio en Vivo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/noticias/nueva"
            className="flex items-center gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva noticia</span>
          </Link>
        </div>
      </div>

      {/* Operational Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {operationalMetrics.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.label}
              href={m.href}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group block"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {m.label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${m.bgColor} ${m.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <p className={`text-3xl font-extrabold font-display ${m.color}`}>
                  {m.value}
                </p>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-green group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Real Analytics & Monthly Solicitudes Charts */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-brand-navy font-display">
            Actividad y Consultas Registradas
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Métricas de leads, formularios y solicitudes sincronizadas en tiempo real con la base de datos
          </p>
        </div>
        <DashboardCharts 
          monthlyData={monthlyData}
          categories={categories}
          totalInteracciones={totalInteracciones}
          totalLeidos={leidosCount}
          totalNoLeidos={noLeidosCount}
        />
      </div>

      {/* Live Editing Quick Jump Section */}
      <div className="bg-gradient-to-br from-brand-navy to-[#1a2936] rounded-2xl p-6 md:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1 text-brand-green font-bold text-xs uppercase tracking-widest">
              <Edit3 className="w-4 h-4" />
              <span>Edición Visual Directa</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-display">
              Editar contenido directamente en la web
            </h3>
            <p className="text-white/60 text-xs md:text-sm mt-1">
              Haz clic en cualquier página para modificar textos, fotos y diagramas en tiempo real.
            </p>
          </div>
          <Link
            href="/es"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-brand-green text-brand-navy hover:bg-emerald-400 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors shrink-0 shadow"
          >
            <span>Ir al Sitio Principal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickPages.map((qp) => {
            const Icon = qp.icon;
            return (
              <Link
                key={qp.path}
                href={qp.path}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl p-4 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-green/20 text-brand-green flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-brand-green transition-colors" />
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-brand-green transition-colors">
                    {qp.title}
                  </h4>
                  <p className="text-[11px] text-white/50 mt-1 leading-snug">
                    {qp.desc}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-brand-green mt-3 block">
                  Editar página →
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Latest Messages / Leads Inbox */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-brand-navy font-display">
              Últimos Mensajes y Cotizaciones
            </h2>
            <p className="text-xs text-gray-400">Solicitudes recibidas desde el formulario web</p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1"
          >
            Ver todos los leads →
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {ultimosMensajes.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Mail className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No hay mensajes recientes.</p>
            </div>
          ) : (
            ultimosMensajes.map((msg) => (
              <div key={msg.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-navy/10 text-brand-navy flex items-center justify-center font-bold text-xs uppercase shrink-0">
                    {msg.nombre?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-navy">{msg.nombre}</p>
                    <p className="text-xs text-gray-500">{msg.email || 'Sin datos de contacto'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:text-right">
                  <div>
                    <span className="inline-block bg-brand-green/10 text-brand-green text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {msg.razonContacto || 'Cotización'}
                    </span>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {new Date(msg.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  {!msg.leido && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" title="No leído" />
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
