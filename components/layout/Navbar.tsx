'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { MegaMenu } from './MegaMenu';
import { MobileDrawer } from './MobileDrawer';
import { DesktopDrawer } from './DesktopDrawer';

export function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHoverKey, setActiveHoverKey] = useState<string | null>(null);
  
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
        <div className="flex-shrink-0 flex items-center">
          <Link href={`/${locale}`} prefetch={true} className="block">
            <Image
              src="/images/logos/GrupoExportador_Logo1.png"
              alt={t('logo_alt')}
              width={180}
              height={55}
              priority
              className={`h-auto object-contain brightness-0 invert transition-all duration-300 ${
                scrolled ? 'w-[100px]' : 'w-[120px]'
              }`}
            />
          </Link>
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
      />

      {/* Desktop Drawer */}
      <DesktopDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        locale={locale}
      />
    </div>
  );
}
