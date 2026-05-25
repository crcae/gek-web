import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';

export function Footer({ locale }: { locale: string }) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  const links = [
    { id: 'quienes', href: `/${locale}/quienes-somos` },
    { id: 'historia', href: `/${locale}/historia` },
    { id: 'holding', href: `/${locale}/holding` },
    { id: 'contacto', href: `/${locale}/contacto` }
  ];

  return (
    <footer className="w-full bg-brand-navy border-t-[3px] border-brand-green pt-16 pb-8 px-6 relative overflow-hidden">

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
        {/* Left Column */}
        <div className="text-center md:text-left max-w-sm">
          <Link href={`/${locale}`} className="inline-block mb-6">
            <Image 
              src="/images/logos/GrupoExportador_Logo1.png" 
              alt="Grupo Exportador del Campo" 
              width={160}
              height={50}
              className="w-[160px] h-auto object-contain brightness-0 invert" 
            />
          </Link>
          <div className="text-brand-white/70 font-body space-y-2 text-sm">
            <p>{t('direccion')}</p>
            <p>{t('tel')}</p>
            <p>{t('web')}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col items-center md:items-end">
          <nav className="flex flex-col items-center md:items-end space-y-3 mb-8">
            <h4 className="text-brand-white font-display font-bold mb-2">{t('nav_titulo')}</h4>
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-brand-white hover:text-brand-green transition-colors font-body text-base min-h-[44px] flex items-center"
              >
                {tNav(link.id as any)}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto relative z-10 mt-16 pt-8 border-t border-brand-white/10 text-center text-brand-white/50 text-xs font-body flex flex-col md:flex-row justify-between items-center gap-4">
        <p>{t('derechos')}</p>
        <div className="flex space-x-4">
          <Link href={`/${locale}/privacidad`} className="hover:text-brand-white transition-colors">{t('privacidad')}</Link>
          <Link href={`/${locale}/terminos`} className="hover:text-brand-white transition-colors">{t('terminos')}</Link>
        </div>
      </div>
    </footer>
  );
}
