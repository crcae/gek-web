'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Newspaper,
  Building2,
  MessageSquare,
  LogOut,
  ImageIcon,
  FileText,
  Calendar,
  Users,
  ExternalLink,
} from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/eventos', label: 'Eventos', icon: Calendar },
  { href: '/admin/clientes', label: 'Clientes', icon: ImageIcon },
  { href: '/admin/noticias', label: 'Noticias', icon: Newspaper },
  { href: '/admin/holding', label: 'Holding', icon: Building2 },
  { href: '/admin/contenido', label: 'Contenido', icon: FileText },
  { href: '/admin/imagenes', label: 'Imágenes', icon: ImageIcon },
];

interface SidebarProps {
  userName: string;
  unreadCount: number;
  onClose?: () => void;
}

export function Sidebar({ userName, unreadCount, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-[#1E293B] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#4DB26B] rounded flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">GEK</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Grupo Exportador</p>
            <p className="text-white/40 text-xs">del Campo</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium min-h-[44px] ${
                isActive
                  ? 'bg-[#4DB26B] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {item.label === 'Leads' && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-white/10">
        <a
          href="/es"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 mb-2 text-sm text-white/40 hover:text-white transition-colors rounded-md hover:bg-white/5 w-full"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          Ver sitio público
        </a>
        <p className="text-white/40 text-xs mb-3 truncate">{userName}</p>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-2 text-white/50 hover:text-red-400 transition-colors text-sm w-full min-h-[44px]"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
