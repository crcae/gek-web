'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface AdminShellProps {
  children: React.ReactNode;
  userName: string;
  unreadCount: number;
}

export function AdminShell({ children, userName, unreadCount }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      {/* Overlay on mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <Sidebar
          userName={userName}
          unreadCount={unreadCount}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen lg:ml-60">
        {/* Mobile top bar */}
        <div className="lg:hidden bg-[#1E293B] px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white p-2 rounded-md hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#4DB26B] rounded flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">GEK</span>
            </div>
            <span className="text-white text-sm font-semibold">Admin</span>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
