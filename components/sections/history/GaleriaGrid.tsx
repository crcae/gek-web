'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function GaleriaGrid({ images }: { images: string[] }) {
  const t = useTranslations('historia');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const hasImages = images.length > 0;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {hasImages ? (
          images.map((src, idx) => (
            <div 
              key={idx} 
              className="relative aspect-square cursor-pointer overflow-hidden rounded-sm group bg-brand-navy/5"
              onClick={() => setSelectedImage(src)}
            >
              <Image 
                src={src} 
                alt={`Galería Zacatecas ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-brand-navy/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white bg-brand-green/80 p-2 rounded-full font-body text-sm">{t('ampliar' as any)}</span>
              </div>
            </div>
          ))
        ) : (
          [1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="relative aspect-square bg-brand-gray/20 rounded-sm flex flex-col items-center justify-center text-brand-navy/40 border border-brand-gray/50 border-dashed">
              <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs font-body max-w-[80%] text-center opacity-70">
                {t('galeria_titulo' as any)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-brand-navy/95 flex items-center justify-center p-4 md:p-8" onClick={() => setSelectedImage(null)}>
          <button 
            className="absolute top-4 right-4 text-white hover:text-brand-green bg-brand-navy p-2 rounded-full"
            onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image 
              src={selectedImage} 
              alt={t('ampliar' as any)}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
