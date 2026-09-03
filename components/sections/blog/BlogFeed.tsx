'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, Clock, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { BlogCard } from './BlogCard';

export interface BlogPostItem {
  id: string;
  slug: string;
  titulo_es: string;
  titulo_en?: string | null;
  titulo_de?: string | null;
  resumen_es?: string | null;
  resumen_en?: string | null;
  resumen_de?: string | null;
  portadaUrl?: string | null;
  categoria: string;
  autor?: string | null;
  destacado: boolean;
  fechaPublicacion: Date | string;
}

interface BlogFeedProps {
  posts: BlogPostItem[];
  locale: string;
  categories: string[];
}

export function BlogFeed({ posts, locale, categories }: BlogFeedProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');

  // Filter posts based on search & category
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const title = (locale === 'en' && post.titulo_en) ? post.titulo_en : (locale === 'de' && post.titulo_de) ? post.titulo_de : post.titulo_es;
      const excerpt = (locale === 'en' && post.resumen_en) ? post.resumen_en : (locale === 'de' && post.resumen_de) ? post.resumen_de : (post.resumen_es || '');

      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.categoria.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = activeCategory === 'Todas' || post.categoria === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchTerm, activeCategory, locale]);

  // Featured post (first marked as destacado or first post overall when no search/filter active)
  const featuredPost = useMemo(() => {
    if (searchTerm || activeCategory !== 'Todas') return null;
    return posts.find((p) => p.destacado) || posts[0] || null;
  }, [posts, searchTerm, activeCategory]);

  // Remaining posts list excluding featured if shown
  const gridPosts = useMemo(() => {
    if (featuredPost && !searchTerm && activeCategory === 'Todas') {
      return filteredPosts.filter((p) => p.id !== featuredPost.id);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost, searchTerm, activeCategory]);

  return (
    <div className="space-y-12">
      
      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveCategory('Todas')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'Todas'
                ? 'bg-brand-navy text-brand-green shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-brand-navy text-brand-green shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar artículos..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs text-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-green focus:outline-none transition-all"
          />
        </div>

      </div>

      {/* Featured Hero Card (When in 'Todas' without search) */}
      {featuredPost && (
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 group transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Image (7 cols) */}
            <Link
              href={`/${locale}/blog/${featuredPost.slug}`}
              className="lg:col-span-7 relative min-h-[280px] sm:min-h-[360px] lg:min-h-full overflow-hidden bg-gray-100 block"
            >
              <Image
                src={featuredPost.portadaUrl || '/images/features/quienes.jpg'}
                alt={featuredPost.titulo_es}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute top-4 left-4">
                <span className="bg-brand-navy/90 backdrop-blur-sm text-brand-green text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow border border-brand-green/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Artículo Destacado
                </span>
              </div>
            </Link>

            {/* Content (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                  <span className="bg-brand-green/10 text-brand-green font-bold px-2.5 py-1 rounded-md text-[11px] uppercase">
                    {featuredPost.categoria}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-green" />
                    {new Date(featuredPost.fechaPublicacion).toLocaleDateString(
                      locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-US' : 'es-MX',
                      { day: 'numeric', month: 'short', year: 'numeric' }
                    )}
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl font-bold text-brand-navy group-hover:text-brand-green transition-colors leading-tight mb-4">
                  <Link href={`/${locale}/blog/${featuredPost.slug}`}>
                    {(locale === 'en' && featuredPost.titulo_en) ? featuredPost.titulo_en : (locale === 'de' && featuredPost.titulo_de) ? featuredPost.titulo_de : featuredPost.titulo_es}
                  </Link>
                </h2>

                <p className="font-body text-sm sm:text-base text-brand-navy/75 leading-relaxed mb-6">
                  {(locale === 'en' && featuredPost.resumen_en) ? featuredPost.resumen_en : (locale === 'de' && featuredPost.resumen_de) ? featuredPost.resumen_de : featuredPost.resumen_es}
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  Por {featuredPost.autor || 'Grupo Exportador del Campo'}
                </span>
                <Link
                  href={`/${locale}/blog/${featuredPost.slug}`}
                  className="flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow transition-all group-hover:translate-x-1"
                >
                  <span>Leer Artículo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Grid of Articles */}
      {gridPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridPosts.map((post) => {
            const title = (locale === 'en' && post.titulo_en) ? post.titulo_en : (locale === 'de' && post.titulo_de) ? post.titulo_de : post.titulo_es;
            const excerpt = (locale === 'en' && post.resumen_en) ? post.resumen_en : (locale === 'de' && post.resumen_de) ? post.resumen_de : post.resumen_es;

            return (
              <BlogCard
                key={post.id}
                slug={post.slug}
                title={title}
                excerpt={excerpt}
                coverImage={post.portadaUrl}
                category={post.categoria}
                author={post.autor}
                date={post.fechaPublicacion}
                locale={locale}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="font-display text-xl font-bold text-brand-navy">
            No se encontraron artículos
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Intenta buscando con otras palabras clave o selecciona otra categoría.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('Todas');
            }}
            className="bg-brand-navy text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-brand-green transition-colors"
          >
            Ver todos los artículos
          </button>
        </div>
      )}

    </div>
  );
}
