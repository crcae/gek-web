'use client';

import { useState, useEffect } from 'react';
import { Mail, ChevronUp } from 'lucide-react';

export function FloatingButtons() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Mail link button */}
      <a
        href="mailto:info@gecvt.com"
        className="w-11 h-11 rounded-full bg-brand-green flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200"
        title="Contáctanos"
      >
        <Mail className="w-5 h-5 text-white" />
      </a>
      
      {/* Scroll to top button */}
      {visible && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-11 h-11 rounded-full bg-brand-navy flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 border border-white/10"
          title="Subir"
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </button>
      )}
    </div>
  );
}
