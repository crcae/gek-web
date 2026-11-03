'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PuntosContactoList, PuntoContactoItem } from './PuntosContactoList';
import { cleanImageUrl } from '@/lib/cleanImageUrl';

interface Props {
  open: boolean;
  onClose: () => void;
  locale: string;
  puntosContacto?: PuntoContactoItem[];
  logoUrl?: string;
}

export function DesktopDrawer({ open, onClose, locale, puntosContacto = [], logoUrl }: Props) {
  // Close with Escape key and block body scroll when open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleContactClick = (e: React.MouseEvent) => {
    onClose();
    // Scroll to contact if we are on the homepage, else navigate
    const contactSection = document.getElementById('cotizacion') || document.getElementById('contacto-pipeline');
    if (contactSection) {
      e.preventDefault();
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-brand-navy z-50 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header del panel */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Image
            src={cleanImageUrl(logoUrl) || '/images/logos/GrupoExportador_Logo1.png'}
            alt="Grupo Exportador del Campo"
            width={120}
            height={48}
            className={`object-contain ${!logoUrl || logoUrl.includes('GrupoExportador_Logo1') ? 'brightness-0 invert' : ''}`}
          />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            aria-label="Cerrar panel"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Eslogan */}
          <p className="font-display italic text-white/60 text-sm leading-relaxed">
            "Porque aunque los tiempos cambien,<br />
            somos y seremos GEC"
          </p>

          {/* Separador verde */}
          <div className="w-8 h-0.5 bg-brand-green" />

          {/* Puntos de Contacto y Ubicaciones */}
          <div className="space-y-4">
            <p className="text-xs text-white/40 uppercase tracking-widest font-medium">
              Contacto y Ubicaciones
            </p>
            <PuntosContactoList initialItems={puntosContacto} iconSize="sm" textSize="sm" />
          </div>
        </div>

        {/* Footer — botón ir a contacto */}
        <div className="p-6 border-t border-white/10">
          <Link
            href={`/${locale}/contacto`}
            onClick={handleContactClick}
            className="flex items-center justify-center w-full bg-brand-green hover:bg-brand-green/90 text-white font-medium text-sm py-3 px-6 rounded-lg transition-colors"
          >
            Ir a Contacto
          </Link>
        </div>
      </div>
    </>
  );
}
