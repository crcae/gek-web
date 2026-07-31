import Link from 'next/link';
import Image from 'next/image';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Clock, 
  Building, 
  MessageSquare,
  Home 
} from 'lucide-react';
import { VisualEditable } from '@/components/admin/VisualEditable';

// Inline SVG — avoids lucide-react barrel optimizer failing on 'Linkedin'
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface FooterProps {
  locale: string;
  contenido?: Record<string, string | null>;
}

export function Footer({ locale, contenido = {} }: FooterProps) {
  const quoteText = contenido['footer.quote'] || '"Porque aunque los tiempos cambien, somos y seremos GEC"';
  const dirStiva = contenido['footer.direccion.stiva'] || 'Stiva No. 484 Parque Industrial Barragán, San Nicolás de los Garza N.L.';
  const dirLoreto = contenido['footer.direccion.loreto'] || 'Loreto, Zacatecas';
  const dirTijuana = contenido['footer.direccion.tijuana'] || 'Tijuana, Baja California';
  const telVal = contenido['footer.telefono'] || '+52 81 2207 0314';
  const mailVal = contenido['footer.correo'] || 'info@gecvt.com';
  const copyVal = contenido['footer.copyright'] || '© 2026 Grupo Exportador del Campo. Todos los derechos reservados.';
  const privVal = contenido['footer.privacidad'] || 'Aviso de Privacidad';
  const termVal = contenido['footer.terminos'] || 'Términos y Condiciones';

  return (
    <footer className="w-full bg-[#0D1B24] border-t-[3px] border-brand-green pt-16 relative overflow-hidden">
      
      {/* Decorative Watermark bottom-right (removed truck placeholder) */}

      {/* Decorative GEC Logo Watermark bottom-right */}
      <div className="absolute right-[-60px] bottom-[-60px] w-[350px] h-[350px] opacity-50 pointer-events-none select-none z-0">
        <Image
          src="/images/iconos/icono.png"
          alt="GEC Isotipo Watermark"
          width={350}
          height={350}
          className="object-contain object-bottom object-right"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Left Column: Contact info style Logmex (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <Link href={`/${locale}`} className="inline-block">
            <Image 
              src="/images/logos/GrupoExportador_Logo1.png" 
              alt="Grupo Exportador del Campo" 
              width={240}
              height={75}
              className="w-[240px] h-auto object-contain brightness-0 invert" 
            />
          </Link>
          <VisualEditable id="footer.quote" label="Cita del Footer">
            <p className="font-lora italic text-xs text-white/70 max-w-sm">
              {quoteText}
            </p>
          </VisualEditable>
          <div className="h-[2px] w-12 bg-brand-green" />
          
          <div className="space-y-3.5 text-white/80 text-sm font-body">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
              <VisualEditable id="footer.direccion.stiva" label="Dirección Parque Industrial">
                <span>{dirStiva}</span>
              </VisualEditable>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
              <VisualEditable id="footer.direccion.loreto" label="Dirección Loreto">
                <span>{dirLoreto}</span>
              </VisualEditable>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
              <VisualEditable id="footer.direccion.tijuana" label="Dirección Tijuana">
                <span>{dirTijuana}</span>
              </VisualEditable>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-brand-green shrink-0" />
              <VisualEditable id="footer.telefono" label="Teléfono de Contacto">
                <a href={`tel:${telVal.replace(/\s+/g, '')}`} className="hover:text-brand-green transition-colors">{telVal}</a>
              </VisualEditable>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-green shrink-0" />
              <VisualEditable id="footer.correo" label="Correo Electrónico">
                <a href={`mailto:${mailVal}`} className="hover:text-brand-green transition-colors">{mailVal}</a>
              </VisualEditable>
            </div>
          </div>

          {/* LinkedIn and Mail buttons */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://www.linkedin.com/company/grupo-exportador-del-campo/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${mailVal}`}
              className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
              title="Correo"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Central Columns: Navigation with icons (7 cols) */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-5 gap-6 align-top">
          
          {/* Col 1: Inicio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-green font-display font-bold text-xs uppercase tracking-wider">
              <Home className="w-4 h-4" />
              <span>Inicio</span>
            </div>
            <div className="flex flex-col gap-2.5 text-white/70 text-xs font-body">
              <Link href={`/${locale}`} className="hover:text-brand-green transition-colors">Inicio</Link>
              <Link href={`/${locale}#marcas`} className="hover:text-brand-green transition-colors">Marcas</Link>
              <Link href={`/${locale}#clientes`} className="hover:text-brand-green transition-colors">Clientes</Link>
              <Link href={`/${locale}#noticias`} className="hover:text-brand-green transition-colors">Noticias</Link>
              <Link href={`/${locale}#eventos`} className="hover:text-brand-green transition-colors">Eventos</Link>
            </div>
          </div>

          {/* Col 2: Quiénes Somos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-green font-display font-bold text-xs uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Identidad</span>
            </div>
            <div className="flex flex-col gap-2.5 text-white/70 text-xs font-body">
              <Link href={`/${locale}/quienes-somos`} className="hover:text-brand-green transition-colors">Quiénes Somos</Link>
              <Link href={`/${locale}/quienes-somos#grupo-exportador`} className="hover:text-brand-green transition-colors">GEC</Link>
              <Link href={`/${locale}/quienes-somos#ecosistema`} className="hover:text-brand-green transition-colors">Ecosistema</Link>
              <Link href={`/${locale}/quienes-somos#division-campo`} className="hover:text-brand-green transition-colors">Div. Campo</Link>
              <Link href={`/${locale}/quienes-somos#division-cedis`} className="hover:text-brand-green transition-colors">Div. CEDIS</Link>
              <Link href={`/${locale}/quienes-somos#capital-humano`} className="hover:text-brand-green transition-colors">Capital Humano</Link>
            </div>
          </div>

          {/* Col 3: Historia */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-green font-display font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Historia</span>
            </div>
            <div className="flex flex-col gap-2.5 text-white/70 text-xs font-body">
              <Link href={`/${locale}/historia`} className="hover:text-brand-green transition-colors">Historia</Link>
              <Link href={`/${locale}/historia#linea-tiempo`} className="hover:text-brand-green transition-colors">Línea de Tiempo</Link>
              <Link href={`/${locale}/historia#origen`} className="hover:text-brand-green transition-colors">Origen</Link>
            </div>
          </div>

          {/* Col 4: Holding */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-green font-display font-bold text-xs uppercase tracking-wider">
              <Building className="w-4 h-4" />
              <span>Holding</span>
            </div>
            <div className="flex flex-col gap-2.5 text-white/70 text-xs font-body">
              <Link href={`/${locale}/holding`} className="hover:text-brand-green transition-colors">Holding</Link>
              <Link href={`/${locale}/holding#marcas-unidades`} className="hover:text-brand-green transition-colors">Marcas y Unidades</Link>
              <Link href={`/${locale}/holding/vizcaino-fruits`} className="hover:text-brand-green transition-colors">Vizcaíno Fruits</Link>
              <Link href={`/${locale}/holding/vizcaino-premium`} className="hover:text-brand-green transition-colors">Vizcaíno Premium</Link>
              <Link href={`/${locale}/holding/vizcaino-services`} className="hover:text-brand-green transition-colors">Vizcaíno Services</Link>
              <Link href={`/${locale}/holding#estructura-corporativa`} className="hover:text-brand-green transition-colors">Estructura</Link>
            </div>
          </div>

          {/* Col 5: Contacto */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-green font-display font-bold text-xs uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Contacto</span>
            </div>
            <div className="flex flex-col gap-2.5 text-white/70 text-xs font-body">
              <Link href={`/${locale}/contacto`} className="hover:text-brand-green transition-colors">Contacto</Link>
              <Link href={`/${locale}/contacto#cotizacion`} className="hover:text-brand-green transition-colors">Cotización</Link>
              <Link href={`/${locale}/contacto?tipo=proveedor`} className="hover:text-brand-green transition-colors">Proveedores</Link>
              <Link href={`/${locale}/contacto?tipo=bolsa`} className="hover:text-brand-green transition-colors">Bolsa de trabajo</Link>
              <Link href={`/${locale}/contacto?tipo=alianza`} className="hover:text-brand-green transition-colors">Alianzas</Link>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="w-full bg-[#091218] py-6 px-6 mt-8 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-body text-white/40 text-center">
          <VisualEditable id="footer.copyright" label="Derechos de Autor (Copyright)">
            <p>{copyVal}</p>
          </VisualEditable>
          <div className="flex gap-4">
            <VisualEditable id="footer.privacidad" label="Enlace Aviso de Privacidad">
              <Link href={`/${locale}/privacidad`} className="hover:text-white transition-colors">{privVal}</Link>
            </VisualEditable>
            <span className="text-white/10">|</span>
            <VisualEditable id="footer.terminos" label="Enlace Términos y Condiciones">
              <Link href={`/${locale}/terminos`} className="hover:text-white transition-colors">{termVal}</Link>
            </VisualEditable>
          </div>
        </div>
      </div>

    </footer>
  );
}
