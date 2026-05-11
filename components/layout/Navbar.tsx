'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    router.push(`/${newLocale}${pathWithoutLocale === '' ? '/' : pathWithoutLocale}`);
    setIsOpen(false);
  };

  const navLinks = [
    { key: 'inicio', label: t('home'), href: `/${locale}` },
    { key: 'quienesSomos', label: t('quienes'), href: `/${locale}/quienes-somos` },
    { key: 'historia', label: t('historia'), href: `/${locale}/historia` },
    { key: 'holding', label: t('holding'), href: `/${locale}/holding` },
    { key: 'contacto', label: t('contacto'), href: `/${locale}/contacto` },
  ];

  // Close menu on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      ref={menuRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2 border-brand-green ${
        scrolled
          ? 'py-1.5 bg-brand-navy shadow-lg shadow-black/20'
          : 'py-2 bg-brand-navy'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href={`/${locale}`} prefetch={true} onClick={() => setIsOpen(false)} className="block">
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
        <div className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              prefetch={true}
              className={`nav-link text-brand-white hover:text-brand-green transition-colors font-body text-sm ${
                pathname === link.href ? 'active' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side: language selector (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-3">
          {/* Language selector — desktop only */}
          <div className="hidden lg:block">
            <select
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-brand-navy text-brand-white border border-brand-gray/30 rounded-md py-1 px-2 font-body text-xs focus:outline-none focus:border-brand-green cursor-pointer"
              value={locale}
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
              <option value="de">DE</option>
            </select>
          </div>

          {/* Hamburger button — mobile/tablet only */}
          <button
            className="lg:hidden text-brand-white p-2 rounded-md hover:bg-brand-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? t('cerrar_menu') : t('abrir_menu')}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-brand-navy border-t border-brand-white/10 px-6 pb-6">
          <nav className="flex flex-col">
            {navLinks.map((link, i) => (
              <Link
                key={link.key}
                href={link.href}
                prefetch={true}
                onClick={() => setIsOpen(false)}
                className={`font-display text-lg text-brand-white hover:text-brand-green transition-colors py-4 px-2 ${
                  i !== navLinks.length - 1 ? 'border-b border-brand-white/10' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Language row at bottom */}
          <div className="mt-6 pt-4 border-t border-brand-white/10 flex items-center gap-4">
            {['es', 'en', 'de'].map((l) => (
              <button
                key={l}
                onClick={() => handleLanguageChange(l)}
                className={`font-body text-sm font-medium min-h-[44px] px-3 rounded-md transition-colors ${
                  locale === l
                    ? 'text-brand-green border border-brand-green'
                    : 'text-brand-white/60 hover:text-brand-white'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
