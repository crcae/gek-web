'use client';

import Image from 'next/image';
import { Download, ExternalLink, Quote as QuoteIcon } from 'lucide-react';
import type { BlockType } from '@/components/admin/BlogEditor';

export function BlogBlockRenderer({ blocks }: { blocks: BlockType[] }) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8 my-8 text-brand-navy">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={index}
                className="font-display text-2xl md:text-3xl font-bold text-brand-navy pt-4 pb-1 border-b border-brand-green/20"
              >
                {block.content}
              </h2>
            );

          case 'paragraph':
            return (
              <p
                key={index}
                className="font-body text-base md:text-lg text-brand-navy/85 leading-relaxed whitespace-pre-line"
              >
                {block.content}
              </p>
            );

          case 'image':
            return (
              <figure key={index} className="my-8 space-y-2">
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
                  <Image
                    src={block.url}
                    alt={block.caption || 'Imagen del blog GEC'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 850px"
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-center font-body text-xs md:text-sm text-gray-500 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'gallery':
            return (
              <div key={index} className="my-8 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {block.images.map((img, i) => (
                    <figure key={i} className="space-y-1.5 group">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md border border-gray-100 bg-gray-50">
                        <Image
                          src={img.url}
                          alt={img.caption || `Foto de galería ${i + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                      </div>
                      {img.caption && (
                        <figcaption className="text-xs text-gray-500 font-medium">
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            );

          case 'quote':
            return (
              <blockquote
                key={index}
                className="my-8 p-6 md:p-8 rounded-2xl bg-[#F8FAFC] border-l-4 border-brand-green shadow-sm relative overflow-hidden"
              >
                <QuoteIcon className="w-10 h-10 text-brand-green/20 absolute -top-1 right-3 pointer-events-none" />
                <p className="font-display italic text-lg md:text-xl text-brand-navy font-medium leading-relaxed mb-3">
                  &ldquo;{block.text}&rdquo;
                </p>
                {block.author && (
                  <footer className="font-body text-xs md:text-sm font-bold text-brand-green uppercase tracking-wider">
                    — {block.author}
                  </footer>
                )}
              </blockquote>
            );

          case 'video':
            return (
              <figure key={index} className="my-8 space-y-2">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-black">
                  {block.url.includes('youtube.com') || block.url.includes('youtu.be') ? (
                    <iframe
                      src={
                        block.url.includes('embed')
                          ? block.url
                          : block.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
                      }
                      title={block.caption || 'Video'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <video
                      src={block.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {block.caption && (
                  <figcaption className="text-center font-body text-xs md:text-sm text-gray-500 italic">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'logos':
            return (
              <div key={index} className="my-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 text-center mb-6">
                  Marcas y Certificaciones Relacionadas
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                  {block.logos.map((logo, lIdx) => (
                    <div key={lIdx} className="flex flex-col items-center gap-2 group">
                      <div className="relative w-28 h-14 transition-transform group-hover:scale-105">
                        <Image
                          src={logo.url}
                          alt={logo.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-gray-600 group-hover:text-brand-green transition-colors">
                        {logo.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );

          case 'download':
            return (
              <div key={index} className="my-8 p-5 bg-[#F1F5F9] rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-green/20 text-brand-green flex items-center justify-center shrink-0">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-navy">{block.title}</h4>
                    {block.fileSize && (
                      <p className="text-xs text-gray-500 font-mono">{block.fileSize}</p>
                    )}
                  </div>
                </div>
                <a
                  href={block.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all"
                >
                  <span>Descargar Archivo</span>
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
