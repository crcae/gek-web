'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Users,
  LogOut,
  ExternalLink,
  Sparkles,
  Globe,
  Home,
  UserCheck,
  BookOpen,
  Building2,
  Mail,
  Edit3
} from 'lucide-react';

const mainNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/blog', label: 'Blog & Artículos', icon: BookOpen },
  { href: '/admin/leads', label: 'Leads y Mensajes', icon: Users },
  { href: '/admin/eventos', label: 'Eventos', icon: Calendar },
  { href: '/admin/clientes', label: 'Logos Clientes', icon: Sparkles },
  { href: '/admin/noticias', label: 'Noticias LinkedIn', icon: Newspaper },
];

const sitePages = [
  { href: '/es', label: 'Inicio', icon: Home },
  { href: '/es/quienes-somos', label: 'Quiénes Somos', icon: UserCheck },
  { href: '/es/historia', label: 'Historia', icon: BookOpen },
  { href: '/es/holding', label: 'Holding', icon: Building2 },
  { href: '/es/blog', label: 'Blog', icon: BookOpen },
  { href: '/es/contacto', label: 'Contacto', icon: Mail },
];

interface SidebarProps {
  userName: string;
  unreadCount: number;
  onClose?: () => void;
}

export function Sidebar({ userName, unreadCount, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#1E293B] flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center shrink-0 shadow">
              <span className="text-white text-xs font-black tracking-wider">GEK</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Grupo Exportador</p>
              <p className="text-brand-green text-xs font-semibold">Panel de Administración</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="px-3 py-4 space-y-6">
          <div>
            <span className="px-3 text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">
              Gestión Operativa
            </span>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium min-h-[42px] ${
                      isActive
                        ? 'bg-brand-green text-white font-bold shadow-md'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                    {item.label.includes('Leads') && unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Edición en Vivo — Rutas del Sitio Web */}
          <div>
            <div className="px-3 flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-brand-green uppercase tracking-widest">
                Edición en Vivo
              </span>
              <Edit3 className="w-3 h-3 text-brand-green" />
            </div>
            <nav className="space-y-1">
              {sitePages.map((page) => {
                const Icon = page.icon;
                return (
                  <Link
                    key={page.href}
                    href={page.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors text-xs font-medium group min-h-[36px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-white/50 group-hover:text-brand-green transition-colors" />
                      <span>{page.label}</span>
                    </div>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-brand-green" />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* User Footer + Logout */}
      <div className="p-4 border-t border-white/10 bg-[#16202E]">
        <Link
          href="/es"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-3 py-2.5 mb-3 text-xs font-bold text-brand-navy bg-brand-green hover:bg-brand-green/90 transition-colors rounded-lg shadow w-full"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Ver Sitio Web en Vivo</span>
        </Link>
        <p className="text-white/50 text-xs mb-2 truncate font-mono">{userName}</p>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-2 text-white/60 hover:text-red-400 transition-colors text-xs font-medium w-full py-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
