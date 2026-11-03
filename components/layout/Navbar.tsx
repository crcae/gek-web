'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Pencil, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { createPortal } from 'react-dom';
import { MegaMenu } from './MegaMenu';
import { MobileDrawer } from './MobileDrawer';
import { DesktopDrawer } from './DesktopDrawer';
import { PuntoContactoItem } from './PuntosContactoList';
import { ImageSelectorField } from '@/components/admin/ImageSelectorField';
import { cleanImageUrl } from '@/lib/cleanImageUrl';

interface NavbarProps {
  puntosContacto?: PuntoContactoItem[];
  logoUrl?: string;
}

export function Navbar({ puntosContacto = [], logoUrl }: NavbarProps) {
  const { data: session } = useSession();
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHoverKey, setActiveHoverKey] = useState<string | null>(null);

  // Logo editing state
  const [currentLogo, setCurrentLogo] = useState(logoUrl || '/images/logos/GrupoExportador_Logo1.png');
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [savingLogo, setSavingLogo] = useState(false);
  const [tempLogo, setTempLogo] = useState(currentLogo);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (logoUrl) {
      setCurrentLogo(logoUrl);
      setTempLogo(logoUrl);
    }
  }, [logoUrl]);

  const isDefaultLogo =
    !currentLogo ||
    currentLogo === '/images/logos/GrupoExportador_Logo1.png' ||
    currentLogo.includes('GrupoExportador_Logo1');

  const handleSaveLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLogo(true);
    try {
      const cleaned = cleanImageUrl(tempLogo);
      const res = await fetch('/api/admin/contenido/header.logo', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valor_es: cleaned,
          valor_en: cleaned,
          valor_de: cleaned,
        }),
      });

      if (!res.ok) throw new Error('Error al guardar el logo');

      setCurrentLogo(cleaned);
      setLogoModalOpen(false);
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error al guardar el logotipo');
    } finally {
      setSavingLogo(false);
    }
  };
  
  const navbarRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    router.push(`/${newLocale}${pathWithoutLocale === '' ? '/' : pathWithoutLocale}`);
    setMobileOpen(false);
  };

  const navLinks = [
    { key: 'quienesSomos', label: t('quienes'), href: `/${locale}/quienes-somos` },
    { key: 'historia', label: t('historia'), href: `/${locale}/historia` },
    { key: 'holding', label: t('holding'), href: `/${locale}/holding` },
    { key: 'contacto', label: t('contacto'), href: `/${locale}/contacto` },
  ];

  // Helper to clear timeout
  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleMouseEnterLink = (key: string) => {
    clearHoverTimeout();
    setActiveHoverKey(key);
  };

  const handleMouseLeaveLink = () => {
    clearHoverTimeout();
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveHoverKey(null);
    }, 150); // slight delay to prevent flickering
  };

  const handleMouseEnterMenu = () => {
    clearHoverTimeout();
  };

  return (
    <div 
      ref={navbarRef}
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2 border-brand-green bg-brand-navy ${
        scrolled ? 'py-1.5 shadow-lg shadow-black/20' : 'py-2'
      }`}
      onMouseLeave={handleMouseLeaveLink}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center relative group/logo">
          <Link href={`/${locale}`} prefetch={true} className="block">
            <Image
              src={cleanImageUrl(currentLogo) || '/images/logos/GrupoExportador_Logo1.png'}
              alt={t('logo_alt')}
              width={180}
              height={55}
              priority
              className={`h-auto object-contain transition-all duration-300 ${
                scrolled ? 'w-[100px]' : 'w-[120px]'
              } ${isDefaultLogo ? 'brightness-0 invert' : ''}`}
            />
          </Link>

          {/* Admin Edit Button */}
          {session && (
            <button
              type="button"
              onClick={() => {
                setTempLogo(currentLogo);
                setLogoModalOpen(true);
              }}
              className="opacity-0 group-hover/logo:opacity-100 absolute -top-1 -right-3 p-1.5 rounded-full bg-brand-navy hover:bg-brand-green text-white shadow-md border border-brand-green/40 transition-all cursor-pointer z-30"
              title="Cambiar logotipo del header"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Desktop Navigation Links — lg+ */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div
              key={link.key}
              onMouseEnter={() => handleMouseEnterLink(link.key)}
              className="relative py-4"
            >
              <Link
                href={link.href}
                prefetch={true}
                className={`nav-link text-brand-white hover:text-brand-green transition-colors font-body font-medium tracking-wide text-xl ${
                  pathname === link.href ? 'active text-brand-green border-b-2 border-brand-green pb-1' : ''
                }`}
              >
                {link.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Right side: language switcher flags & mobile hamburger */}
        <div className="flex items-center gap-6">
          
          {/* Flag selector: ES | EN | DE */}
          <div className="hidden lg:flex items-center gap-1.5 bg-black/20 p-1 rounded-md border border-white/5">
            {[
              { code: 'es', flag: '🇲🇽', label: 'ES' },
              { code: 'en', flag: '🇺🇸', label: 'EN' },
              { code: 'de', flag: '🇩🇪', label: 'DE' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold font-body transition-all min-h-[30px] rounded ${
                  locale === lang.code
                    ? 'bg-brand-green text-white shadow-md'
                    : 'text-white opacity-70 hover:opacity-100 hover:bg-white/5'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>

          {/* Desktop Drawer Toggle Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="hidden lg:flex text-brand-white p-2 rounded-md hover:bg-brand-white/10 transition-colors min-h-[44px] min-w-[44px] items-center justify-center"
            aria-label="Abrir panel"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Hamburger menu button for Mobile */}
          <button
            className="lg:hidden text-brand-white p-2 rounded-md hover:bg-brand-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMobileOpen(true)}
            aria-label={t('abrir_menu')}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* MegaMenu Dropdown */}
      <div onMouseEnter={handleMouseEnterMenu}>
        <MegaMenu activeKey={activeHoverKey} onClose={() => setActiveHoverKey(null)} />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={navLinks}
        puntosContacto={puntosContacto}
        logoUrl={currentLogo}
      />

      {/* Desktop Drawer */}
      <DesktopDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        locale={locale}
        puntosContacto={puntosContacto}
        logoUrl={currentLogo}
      />

      {/* MODAL: Cambiar Logotipo del Header */}
      {mounted && logoModalOpen && createPortal(
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Cambiar Logotipo del Header
                </h3>
                <p className="text-xs text-gray-500">
                  Logotipo principal en la barra de navegación superior
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLogoModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveLogo} className="p-6 space-y-5">
              {/* Image Selector Field */}
              <ImageSelectorField
                label="Logotipo del Header"
                valorActual={tempLogo}
                onChange={(url) => setTempLogo(url)}
                aspectRatio="libre"
              />

              {/* Vista previa en fondo de Header */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Vista Previa sobre el fondo del Header
                </label>
                <div className="bg-brand-navy p-6 rounded-xl flex items-center justify-center border border-brand-green/20">
                  <Image
                    src={cleanImageUrl(tempLogo) || '/images/logos/GrupoExportador_Logo1.png'}
                    alt="Vista previa"
                    width={180}
                    height={55}
                    className={`h-auto object-contain max-h-[55px] ${
                      !tempLogo || tempLogo.includes('GrupoExportador_Logo1') ? 'brightness-0 invert' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setLogoModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingLogo}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-brand-green hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {savingLogo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Logotipo</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
