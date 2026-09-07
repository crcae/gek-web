'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { cleanImageUrl } from '@/lib/cleanImageUrl';

export interface RecentBlogPost {
  id: string;
  slug: string;
  titulo_es: string;
  titulo_en?: string | null;
  titulo_de?: string | null;
  resumen_es?: string | null;
  resumen_en?: string | null;
  resumen_de?: string | null;
  categoria: string;
  portadaUrl?: string | null;
  fechaPublicacion: Date | string;
}

interface Props {
  posts: RecentBlogPost[];
  locale: string;
}

function getTimeAgo(dateVal: Date | string, locale: string): string {
  try {
    const now = new Date();
    const d = new Date(dateVal);
    const diffHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    if (diffHours < 24) {
      if (diffHours <= 1) return locale === 'en' ? 'Just now' : locale === 'de' ? 'Gerade eben' : 'Recién';
      return locale === 'en' ? `${diffHours}h ago` : locale === 'de' ? `vor ${diffHours} Std.` : `hace ${diffHours}h`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return locale === 'en' ? 'Yesterday' : locale === 'de' ? 'Gestern' : 'Ayer';
    if (diffDays < 7) return locale === 'en' ? `${diffDays}d ago` : locale === 'de' ? `vor ${diffDays}T` : `hace ${diffDays}d`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return locale === 'en' ? `${weeks}w ago` : locale === 'de' ? `vor ${weeks}W` : `hace ${weeks} sem`;
    }
    return d.toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'de' ? 'de-DE' : 'es-MX', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return '';
  }
}

export function RecentBlogDrawer({ posts, locale }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !posts || posts.length === 0) return null;

  const topPost = posts[0];
  const otherPosts = posts.slice(1);

  const getLocalizedTitle = (p: RecentBlogPost) => {
    if (locale === 'en') return p.titulo_en || p.titulo_es;
    if (locale === 'de') return p.titulo_de || p.titulo_es;
    return p.titulo_es;
  };

  const getLocalizedExcerpt = (p: RecentBlogPost) => {
    if (locale === 'en') return p.resumen_en || p.resumen_es || '';
    if (locale === 'de') return p.resumen_de || p.resumen_es || '';
    return p.resumen_es || '';
  };

  const labels = {
    es: {
      appName: 'GEC Blog',
      badge: 'Novedades',
      moreStacked: `+${otherPosts.length} publicaciones más`,
      collapse: 'Colapsar',
      viewAll: 'Ver todos los artículos del Blog',
      readArticle: 'Leer artículo',
      reopen: 'Novedades',
    },
    en: {
      appName: 'GEC Blog',
      badge: 'News',
      moreStacked: `+${otherPosts.length} more updates`,
      collapse: 'Collapse',
      viewAll: 'View all Blog articles',
      readArticle: 'Read article',
      reopen: 'Updates',
    },
    de: {
      appName: 'GEC Blog',
      badge: 'Neuigkeiten',
      moreStacked: `+${otherPosts.length} weitere Beiträge`,
      collapse: 'Einklappen',
      viewAll: 'Alle Blog-Artikel ansehen',
      readArticle: 'Artikel lesen',
      reopen: 'Neuigkeiten',
    },
  }[locale as 'es' | 'en' | 'de'] || {
    appName: 'GEC Blog',
    badge: 'Novedades',
    moreStacked: `+${otherPosts.length} publicaciones más`,
    collapse: 'Colapsar',
    viewAll: 'Ver todos los artículos del Blog',
    readArticle: 'Leer artículo',
    reopen: 'Novedades',
  };

  // Si está completamente descartado por el usuario con la X
  if (isDismissed) {
    return (
      <div className="fixed top-40 sm:top-44 right-4 sm:right-6 z-40 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={() => {
            setIsDismissed(false);
            setIsExpanded(true);
          }}
          className="flex items-center gap-2 bg-[#0D1B24]/90 hover:bg-[#0D1B24] text-white px-3 py-1.5 rounded-full shadow-xl border border-brand-green/40 backdrop-blur-xl text-xs font-semibold hover:scale-105 transition-all cursor-pointer group"
          title={labels.reopen}
        >
          <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span>{labels.appName}</span>
          <span className="bg-brand-green/20 text-brand-green text-[10px] font-bold px-1.5 py-0.2 rounded-full">
            {posts.length}
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-40 sm:top-44 right-4 sm:right-6 z-40 font-sans select-none flex flex-col items-end w-[360px] sm:w-[390px] max-w-[calc(100vw-32px)]">
      
      {/* ── NOTIFICACIÓN PRINCIPAL (Tarjeta Superior estilo iOS) ── */}
      <div className="relative w-full group">
        
        {/* Capas de tarjetas apiladas en el fondo (Efecto Stack estilo iOS de la foto del usuario) */}
        {!isExpanded && otherPosts.length > 0 && (
          <>
            {/* Capa 2 (la más lejana) */}
            <div className="absolute -bottom-2.5 left-4 right-4 h-5 bg-[#0a151d]/70 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg -z-20 pointer-events-none" />
            {/* Capa 1 (intermedia) */}
            <div className="absolute -bottom-1.5 left-2 right-2 h-5 bg-[#0c1822]/80 backdrop-blur-md rounded-2xl border border-white/15 shadow-md -z-10 pointer-events-none" />
          </>
        )}

        {/* Tarjeta principal frontal */}
        <div className="w-full bg-[#0D1B24]/90 hover:bg-[#0D1B24]/95 backdrop-blur-2xl border border-white/20 hover:border-brand-green/40 rounded-2xl p-3.5 sm:p-4 shadow-[0_12px_35px_rgba(0,0,0,0.45)] transition-all duration-200">
          
          {/* Header de la notificación (App Icon + Nombre App + Tiempo + Botón Cerrar) */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-brand-navy p-1 border border-brand-green/40 flex items-center justify-center shrink-0 shadow-sm">
                <Image
                  src="/images/isotipo/isotipo-claro.png"
                  alt="GEC"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/90 font-display">
                {labels.appName}
              </span>
              <span className="text-white/30 text-[10px]">•</span>
              <span className="text-[10px] text-brand-green font-semibold uppercase tracking-wider">
                {topPost.categoria}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-white/50 font-medium">
                {getTimeAgo(topPost.fechaPublicacion, locale)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDismissed(true);
                }}
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/25 text-white/60 hover:text-white flex items-center justify-center transition-colors ml-1"
                title="Cerrar notificación"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Cuerpo de la notificación: Título + Excerpt + Miniatura a la derecha */}
          <Link
            href={`/${locale}/blog/${topPost.slug}`}
            className="flex items-start justify-between gap-3 group/item mt-1"
          >
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-sm font-bold text-white group-hover/item:text-brand-green transition-colors line-clamp-2 leading-snug">
                {getLocalizedTitle(topPost)}
              </h4>
              {getLocalizedExcerpt(topPost) && (
                <p className="text-xs text-white/70 line-clamp-2 mt-1 leading-relaxed font-body">
                  {getLocalizedExcerpt(topPost)}
                </p>
              )}
            </div>

            {/* Thumbnail preview al estilo iOS rich notifications */}
            <div className="relative w-16 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-800 border border-white/15 shadow-sm">
              <Image
                src={cleanImageUrl(topPost.portadaUrl) || '/images/features/historia.jpg'}
                alt={getLocalizedTitle(topPost)}
                fill
                className="object-cover group-hover/item:scale-105 transition-transform duration-300"
                sizes="80px"
                unoptimized
              />
            </div>
          </Link>

          {/* Botón de expansión o stack inferior */}
          {otherPosts.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-[11px] font-semibold text-brand-green hover:text-[#6ee293] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isExpanded ? labels.collapse : labels.moreStacked}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <Link
                href={`/${locale}/blog`}
                className="text-[11px] text-white/50 hover:text-white transition-colors"
              >
                Blog →
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* ── NOTIFICACIONES DESPLEGADAS (El resto del stack desplegado estilo iOS) ── */}
      {isExpanded && otherPosts.length > 0 && (
        <div className="w-full mt-2 space-y-2 max-h-[380px] overflow-y-auto pr-0.5 animate-in fade-in slide-in-from-top-3 duration-200">
          {otherPosts.map((post) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.slug}`}
              className="block w-full bg-[#0D1B24]/90 hover:bg-[#0D1B24]/98 backdrop-blur-2xl border border-white/15 hover:border-brand-green/40 rounded-2xl p-3.5 shadow-xl transition-all duration-200 group/sub"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-brand-green font-bold uppercase tracking-wider">
                    {post.categoria}
                  </span>
                </div>
                <span className="text-[10px] text-white/50">
                  {getTimeAgo(post.fechaPublicacion, locale)}
                </span>
              </div>

              {/* Contenido */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0 pr-1">
                  <h5 className="text-xs font-bold text-white group-hover/sub:text-brand-green transition-colors line-clamp-2 leading-snug">
                    {getLocalizedTitle(post)}
                  </h5>
                  {getLocalizedExcerpt(post) && (
                    <p className="text-[11px] text-white/60 line-clamp-1 mt-0.5 font-body">
                      {getLocalizedExcerpt(post)}
                    </p>
                  )}
                </div>

                <div className="relative w-12 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-800 border border-white/10">
                  <Image
                    src={cleanImageUrl(post.portadaUrl) || '/images/features/historia.jpg'}
                    alt={getLocalizedTitle(post)}
                    fill
                    className="object-cover group-hover/sub:scale-105 transition-transform duration-300"
                    sizes="60px"
                    unoptimized
                  />
                </div>
              </div>
            </Link>
          ))}

          {/* Enlace final a todo el blog */}
          <div className="pt-1 pb-1 flex justify-center">
            <Link
              href={`/${locale}/blog`}
              className="w-full text-center bg-white/5 hover:bg-white/10 text-brand-green border border-brand-green/30 hover:border-brand-green/60 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span>{labels.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
