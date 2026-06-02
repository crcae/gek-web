'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';

interface MegaMenuProps {
  activeKey: string | null;
  onClose: () => void;
}

export function MegaMenu({ activeKey, onClose }: MegaMenuProps) {
  const locale = useLocale();

  if (!activeKey) return null;

  // Localized contents
  const contents: Record<
    string,
    {
      title: string;
      links: { label: string; href: string }[];
      desc: string;
      image: string;
    }
  > = {
    quienesSomos: {
      title: locale === 'en' ? 'About Us' : locale === 'de' ? 'Über uns' : 'Quiénes Somos',
      links: [
        { label: locale === 'en' ? 'Our History' : locale === 'de' ? 'Unsere Geschichte' : 'Nuestra Historia', href: `/${locale}/quienes-somos#historia` },
        { label: locale === 'en' ? 'Our Mission' : locale === 'de' ? 'Unsere Mission' : 'Nuestra Misión', href: `/${locale}/quienes-somos#mision` },
        { label: locale === 'en' ? 'Values' : locale === 'de' ? 'Werte' : 'Valores', href: `/${locale}/quienes-somos#valores` },
        { label: locale === 'en' ? 'Divisions' : locale === 'de' ? 'Divisionen' : 'Divisiones', href: `/${locale}/quienes-somos#divisiones` },
      ],
      desc: locale === 'en' 
        ? 'Grupo Exportador del Campo is dedicated to the production and export of fresh produce.' 
        : locale === 'de'
        ? 'Grupo Exportador del Campo widmet sich der Produktion und dem Export von Frischprodukten.'
        : 'Grupo Exportador del Campo se dedica a la producción y exportación de productos frescos.',
      image: '/images/features/quienes.jpg',
    },
    historia: {
      title: locale === 'en' ? 'History' : locale === 'de' ? 'Geschichte' : 'Historia',
      links: [
        { label: locale === 'en' ? 'Foundation' : locale === 'de' ? 'Gründung' : 'Fundación', href: `/${locale}/historia#fundacion` },
        { label: locale === 'en' ? 'First Precooler' : locale === 'de' ? 'Erster Vorkühler' : 'Primera Enfriadora', href: `/${locale}/historia#enfriadora` },
        { label: locale === 'en' ? 'Expansion' : locale === 'de' ? 'Expansion' : 'Expansión', href: `/${locale}/historia#expansion` },
        { label: locale === 'en' ? 'Milestones' : locale === 'de' ? 'Meilensteine' : 'Hitos importantes', href: `/${locale}/historia` },
      ],
      desc: locale === 'en'
        ? 'Over 50 years of agricultural legacy connecting the fields to domestic and international markets.'
        : locale === 'de'
        ? 'Mehr als 50 Jahre landwirtschaftliches Erbe, das die Felder mit nationalen und internationalen Märkten verbindet.'
        : 'Más de 50 años de legado agrícola conectando el campo con los mercados nacionales e internacionales.',
      image: '/images/features/historia.jpg',
    },
    holding: {
      title: 'Holding',
      links: [
        { label: locale === 'en' ? 'Corporate Structure' : locale === 'de' ? 'Unternehmensstruktur' : 'Estructura Corporativa', href: `/${locale}/holding#estructura` },
        { label: locale === 'en' ? 'Brands' : locale === 'de' ? 'Marken' : 'Marcas', href: `/${locale}/holding#marcas` },
        { label: locale === 'en' ? 'Business Units' : locale === 'de' ? 'Geschäftseinheiten' : 'Unidades de Negocio', href: `/${locale}/holding#unidades` },
      ],
      desc: locale === 'en'
        ? 'Specialized corporate framework driving business synergy and operational efficiency.'
        : locale === 'de'
        ? 'Spezialisierter Unternehmensrahmen, der geschäftliche Synergien und operative Effizienz fördert.'
        : 'Estructura corporativa especializada que impulsa sinergias y eficiencia en cada unidad de negocio.',
      image: '/images/features/holding.jpg',
    },
    contacto: {
      title: locale === 'en' ? 'Contact' : locale === 'de' ? 'Kontakt' : 'Contacto',
      links: [
        { label: locale === 'en' ? 'Get a Quote' : locale === 'de' ? 'Angebot anfordern' : 'Cotización', href: `/${locale}/contacto` },
        { label: locale === 'en' ? 'Suppliers' : locale === 'de' ? 'Lieferanten' : 'Proveedores', href: `/${locale}/contacto` },
        { label: locale === 'en' ? 'Job Board' : locale === 'de' ? 'Karriere' : 'Bolsa de trabajo', href: `/${locale}/contacto` },
      ],
      desc: locale === 'en'
        ? 'We are ready to connect your operations with the efficiency and quality of our harvest.'
        : locale === 'de'
        ? 'Wir sind bereit, Ihre Abläufe mit der Effizienz und Qualität unserer Ernte zu verbinden.'
        : 'Estamos listos para conectar tu operación con la eficiencia y calidad de nuestras cosechas.',
      image: '/images/features/contacto.jpg',
    },
  };

  const current = contents[activeKey];
  if (!current) return null;

  return (
    <div 
      className="absolute left-0 right-0 top-full bg-[#0D1B24] border-t border-brand-green/30 shadow-2xl z-40 transition-all duration-200 transform translate-y-0 opacity-100 py-10"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 text-white">
        {/* Left Column: Isotipo + Title */}
        <div className="md:col-span-3 flex flex-col justify-start">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-white">GEC</span>
            </div>
            <h4 className="font-display font-bold text-lg text-brand-green uppercase tracking-wider">{current.title}</h4>
          </div>
          <div className="h-[1px] bg-white/10 my-4" />
        </div>

        {/* Center Column: Links grid */}
        <div className="md:col-span-5 grid grid-cols-2 gap-4 align-top">
          {current.links.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              onClick={onClose}
              className="flex items-center text-white/70 hover:text-brand-green text-sm font-medium transition-colors py-2 px-1 hover:translate-x-1 duration-200"
            >
              <span className="text-brand-green mr-2">•</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Column: Image and brief description */}
        <div className="md:col-span-4 flex gap-4 bg-white/5 p-4 rounded-lg border border-white/10">
          <div className="relative w-[110px] h-[90px] rounded overflow-hidden shrink-0">
            <Image
              src={current.image}
              alt={current.title}
              fill
              className="object-cover"
              sizes="110px"
              onError={(e) => {
                // Fallback to placeholder color with isotype-claro
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='90' viewBox='0 0 110 90'%3E%3Crect width='100%25' height='100%25' fill='%23132B39'/%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-xs text-white/70 font-lora leading-relaxed line-clamp-3">
              {current.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
