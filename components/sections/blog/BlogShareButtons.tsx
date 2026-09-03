'use client';

import { useState } from 'react';
import { Copy, Check, MessageCircle } from 'lucide-react';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.62 1.62 0 1 0 1.63 1.62 1.63 1.63 0 0 0-1.63-1.62z" />
  </svg>
);

const TwitterXIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function BlogShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinkedIn = () => {
    if (typeof window !== 'undefined') {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
        '_blank'
      );
    }
  };

  const shareWhatsApp = () => {
    if (typeof window !== 'undefined') {
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${window.location.href}`)}`,
        '_blank'
      );
    }
  };

  const shareTwitter = () => {
    if (typeof window !== 'undefined') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`,
        '_blank'
      );
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={shareLinkedIn}
        className="p-2.5 rounded-full bg-gray-100 hover:bg-[#0077b5] text-gray-600 hover:text-white transition-all cursor-pointer"
        title="Compartir en LinkedIn"
      >
        <LinkedinIcon className="w-4 h-4" />
      </button>

      <button
        onClick={shareWhatsApp}
        className="p-2.5 rounded-full bg-gray-100 hover:bg-[#25D366] text-gray-600 hover:text-white transition-all cursor-pointer"
        title="Compartir en WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </button>

      <button
        onClick={shareTwitter}
        className="p-2.5 rounded-full bg-gray-100 hover:bg-black text-gray-600 hover:text-white transition-all cursor-pointer"
        title="Compartir en X"
      >
        <TwitterXIcon className="w-4 h-4" />
      </button>

      <button
        onClick={handleCopy}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
          copied
            ? 'bg-brand-green text-white shadow-sm'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
        title="Copiar enlace"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>¡Copiado!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar link</span>
          </>
        )}
      </button>
    </div>
  );
}
