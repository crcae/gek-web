'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone } from 'lucide-react';
import { VisualEditable } from '@/components/admin/VisualEditable';

// Inline SVG for LinkedIn (avoids lucide-react barrel optimizer issue)
const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface TopbarProps {
  correo?: string;
  telefono?: string;
}

export function Topbar({ correo, telefono }: TopbarProps) {
  const [exchangeRate, setExchangeRate] = useState<string | null>(null);

  const mailVal = correo || 'info@gecvt.com';
  const telVal = telefono || '+52 81 2207 0314';

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (res.ok) {
          const data = await res.json();
          if (data && data.rates && data.rates.MXN) {
            setExchangeRate(`USD: $${Number(data.rates.MXN).toFixed(2)} MXN`);
          }
        }
      } catch (err) {
        console.error('Failed to fetch USD/MXN rate', err);
        // Fail silently and hide widget
        setExchangeRate(null);
      }
    };

    fetchRate();
    const interval = setInterval(fetchRate, 5 * 60 * 1000); // 5 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:flex items-center justify-between bg-[#0D1B24] text-white h-[36px] text-[13px] px-6 relative z-50">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Left side: Mail + Phone */}
        <div className="flex items-center gap-4">
          <VisualEditable id="footer.correo" label="Correo de Contacto (Topbar)">
            <a
              href={`mailto:${mailVal}`}
              className="flex items-center hover:text-brand-green transition-colors"
            >
              <Mail className="w-[14px] h-[14px] mr-2" />
              <span>{mailVal}</span>
            </a>
          </VisualEditable>
          <span className="text-white/30">|</span>
          <VisualEditable id="footer.telefono" label="Teléfono de Contacto (Topbar)">
            <a
              href={`tel:${telVal.replace(/\s+/g, '')}`}
              className="flex items-center hover:text-brand-green transition-colors"
            >
              <Phone className="w-[14px] h-[14px] mr-2" />
              <span>{telVal}</span>
            </a>
          </VisualEditable>
        </div>

        {/* Right side: exchange rate widget & LinkedIn */}
        <div className="flex items-center gap-6">
          {exchangeRate && (
            <div className="bg-[#4DB26B]/10 text-brand-green px-2.5 py-0.5 rounded-full text-xs font-medium border border-brand-green/20">
              {exchangeRate}
            </div>
          )}
          <a
            href="https://www.linkedin.com/company/grupo-exportador-del-campo/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-brand-green transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-[14px] h-[14px]" />
          </a>
        </div>
      </div>
    </div>
  );
}
