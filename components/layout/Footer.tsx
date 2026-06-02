import Link from 'next/link';
import Image from 'next/image';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Clock, 
  Building, 
  MessageSquare 
} from 'lucide-react';

// Inline SVG — avoids lucide-react barrel optimizer failing on 'Linkedin'
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Footer({ locale }: { locale: string }) {
  return (
    <footer className="w-full bg-[#0D1B24] border-t-[3px] border-brand-green pt-16 relative overflow-hidden">
      
      {/* Decorative Truck Watermark bottom-right */}
      <div 
        className="absolute right-[-20px] bottom-[-20px] w-[240px] h-[150px] bg-no-repeat bg-contain bg-right pointer-events-none opacity-[0.15] z-0"
        style={{ backgroundImage: 'url(/images/camiones/truck2.png)' }}
      />

      <div className="max-w-7xl mx-auto px-6 pb-12 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Left Column: Contact info style Logmex (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <Link href={`/${locale}`} className="inline-block">
            <Image 
              src="/images/logos/GrupoExportador_Logo1.png" 
              alt="Grupo Exportador del Campo" 
              width={160}
              height={50}
              className="w-[160px] h-auto object-contain brightness-0 invert" 
            />
          </Link>
          <p className="font-lora italic text-xs text-white/70 max-w-sm">
            "Porque aunque los tiempos cambien, somos y seremos GEC"
          </p>
          <div className="h-[2px] w-12 bg-brand-green" />
          
          <div className="space-y-3.5 text-white/80 text-sm font-body">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
              <span>Stiva No. 484 Parque Industrial Barragán, San Nicolás de los Garza N.L.</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
              <span>Loreto, Zacatecas</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
              <span>Tijuana, Baja California</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-brand-green shrink-0" />
              <a href="tel:+528122070314" className="hover:text-brand-green transition-colors">+52 81 2207 0314</a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand-green shrink-0" />
              <a href="mailto:info@gecvt.com" className="hover:text-brand-green transition-colors">info@gecvt.com</a>
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
              href="mailto:info@gecvt.com"
              className="w-10 h-10 rounded-full bg-brand-green flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
              title="Correo"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Central Columns: Navigation with icons (7 cols) */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 align-top">
          
          {/* Col 1: Quiénes Somos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-green font-display font-bold text-xs uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Identidad</span>
            </div>
            <div className="flex flex-col gap-2.5 text-white/70 text-xs font-body">
              <Link href={`/${locale}/quienes-somos#historia`} className="hover:text-brand-green transition-colors">Nuestra Historia</Link>
              <Link href={`/${locale}/quienes-somos#mision`} className="hover:text-brand-green transition-colors">Misión y Visión</Link>
              <Link href={`/${locale}/quienes-somos#valores`} className="hover:text-brand-green transition-colors">Valores</Link>
              <Link href={`/${locale}/quienes-somos#divisiones`} className="hover:text-brand-green transition-colors">Divisiones</Link>
            </div>
          </div>

          {/* Col 2: Historia */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-green font-display font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Trayectoria</span>
            </div>
            <div className="flex flex-col gap-2.5 text-white/70 text-xs font-body">
              <Link href={`/${locale}/historia#fundacion`} className="hover:text-brand-green transition-colors">Fundación</Link>
              <Link href={`/${locale}/historia`} className="hover:text-brand-green transition-colors">Hitos importantes</Link>
              <Link href={`/${locale}/historia#fundadores`} className="hover:text-brand-green transition-colors">Fundadores</Link>
              <Link href={`/${locale}/historia#galeria`} className="hover:text-brand-green transition-colors">Galería</Link>
            </div>
          </div>

          {/* Col 3: Holding */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-green font-display font-bold text-xs uppercase tracking-wider">
              <Building className="w-4 h-4" />
              <span>Corporativo</span>
            </div>
            <div className="flex flex-col gap-2.5 text-white/70 text-xs font-body">
              <Link href={`/${locale}/holding#estructura`} className="hover:text-brand-green transition-colors">Estructura</Link>
              <Link href={`/${locale}/holding#marcas`} className="hover:text-brand-green transition-colors">Vizcaíno Fruit's</Link>
              <Link href={`/${locale}/holding#marcas`} className="hover:text-brand-green transition-colors">Vizcaíno Premium</Link>
              <Link href={`/${locale}/holding#marcas`} className="hover:text-brand-green transition-colors">Vizcaíno Services</Link>
            </div>
          </div>

          {/* Col 4: Contacto */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-green font-display font-bold text-xs uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Contacto</span>
            </div>
            <div className="flex flex-col gap-2.5 text-white/70 text-xs font-body">
              <Link href={`/${locale}/contacto`} className="hover:text-brand-green transition-colors">Cotización</Link>
              <Link href={`/${locale}/contacto`} className="hover:text-brand-green transition-colors">Proveedores</Link>
              <Link href={`/${locale}/contacto`} className="hover:text-brand-green transition-colors">Bolsa de trabajo</Link>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="w-full bg-[#091218] py-6 px-6 mt-8 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-body text-white/40 text-center">
          <p>© 2026 Grupo Exportador del Campo. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href={`/${locale}/privacidad`} className="hover:text-white transition-colors">Aviso de Privacidad</Link>
            <span className="text-white/10">|</span>
            <Link href={`/${locale}/terminos`} className="hover:text-white transition-colors">Términos y Condiciones</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
