'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { PuntosContactoList, PuntoContactoItem } from './PuntosContactoList';
import { cleanImageUrl } from '@/lib/cleanImageUrl';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { key: string; label: string; href: string }[];
  puntosContacto?: PuntoContactoItem[];
  logoUrl?: string;
}

export function MobileDrawer({ isOpen, onClose, navLinks, puntosContacto = [], logoUrl }: MobileDrawerProps) {
  const locale = useLocale();

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
      {/* Dark Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[75%] sm:w-[50%] max-w-[400px] bg-brand-navy z-50 shadow-2xl transition-transform duration-300 transform flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link href={`/${locale}`} onClick={onClose} className="block">
            <Image
              src={cleanImageUrl(logoUrl) || '/images/logos/GrupoExportador_Logo1.png'}
              alt="Logo GEK"
              width={120}
              height={36}
              className={`h-auto object-contain ${!logoUrl || logoUrl.includes('GrupoExportador_Logo1') ? 'brightness-0 invert' : ''}`}
            />
          </Link>
          <button
            onClick={onClose}
            className="text-white hover:text-brand-green p-2 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Cerrar menú"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 flex flex-col justify-between">
          {/* Tagline */}
          <div>
            <p className="font-lora italic text-white/80 text-sm border-l-2 border-brand-green pl-3">
              "Porque aunque los tiempos cambien, somos y seremos GEC"
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={onClose}
                className="font-display text-lg text-white hover:text-brand-green transition-colors py-3.5 border-b border-white/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Locations and Contact info */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-green">Ubicaciones y Contacto</h4>
            <PuntosContactoList initialItems={puntosContacto} iconSize="sm" textSize="xs" />
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Link
              href={`/${locale}/contacto`}
              onClick={handleContactClick}
              className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-body py-3.5 px-6 rounded-md text-center font-bold text-sm block shadow-lg shadow-brand-green/20 transition-all active:scale-95"
            >
              Ir a Contacto
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
