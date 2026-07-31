'use client';

import React from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { Shield } from 'lucide-react';
import Link from 'next/link';

function AdminFloatingBadge() {
  const { data: session } = useSession();
  if (!session) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[99999] bg-brand-navy border border-brand-green/40 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md bg-opacity-95">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-green"></span>
      </span>
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-brand-green" />
        <span className="font-display text-xs font-bold uppercase tracking-wider text-brand-white select-none">
          Modo Administrador Activo
        </span>
      </div>
      <Link
        href="/admin"
        className="text-xs bg-brand-green hover:bg-brand-green/90 text-brand-navy px-3.5 py-1.5 rounded-full font-bold transition-all ml-2 cursor-pointer"
      >
        Ir al Panel
      </Link>
    </div>
  );
}

export function ClientSessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <AdminFloatingBadge />
    </SessionProvider>
  );
}
