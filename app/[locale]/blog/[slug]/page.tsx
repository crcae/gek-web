import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Calendar, Clock, User, ArrowLeft, Share2, Check, ArrowRight, BookOpen } from 'lucide-react';
import { BlogBlockRenderer } from '@/components/sections/blog/BlogBlockRenderer';
import { BlogShareButtons } from '@/components/sections/blog/BlogShareButtons';
import { BlogCard } from '@/components/sections/blog/BlogCard';

export async function generateMetadata({ params: { locale, slug } }: { params: { locale: string; slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) return { title: 'Artículo no encontrado' };

  const title = (locale === 'en' && post.titulo_en) ? post.titulo_en : (locale === 'de' && post.titulo_de) ? post.titulo_de : post.titulo_es;
  const description = (locale === 'en' && post.resumen_en) ? post.resumen_en : (locale === 'de' && post.resumen_de) ? post.resumen_de : post.resumen_es;

  return {
    title: `${title} | Blog GEC`,
    description: description || 'Artículo del blog de Grupo Exportador del Campo.',
    openGraph: {
      title,
      description: description || undefined,
      images: post.portadaUrl ? [post.portadaUrl] : undefined,
    },
  };
}

export default async function BlogPostPage({ params: { locale, slug } }: { params: { locale: string; slug: string } }) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || (!post.publicado)) {
    notFound();
  }

  // Increment views count asynchronously
  try {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { vistas: { increment: 1 } },
    });
  } catch {}

  // Parse blocks
  let blocks = [];
  const rawContent = (locale === 'en' && post.contenido_en) ? post.contenido_en : (locale === 'de' && post.contenido_de) ? post.contenido_de : post.contenido_es;
  try {
    blocks = JSON.parse(rawContent);
  } catch {
    blocks = [{ type: 'paragraph', content: rawContent }];
  }

  // Fetch related posts (3 other posts)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      publicado: true,
      id: { not: post.id },
    },
    take: 3,
    orderBy: { fechaPublicacion: 'desc' },
  });

  const title = (locale === 'en' && post.titulo_en) ? post.titulo_en : (locale === 'de' && post.titulo_de) ? post.titulo_de : post.titulo_es;
  const excerpt = (locale === 'en' && post.resumen_en) ? post.resumen_en : (locale === 'de' && post.resumen_de) ? post.resumen_de : post.resumen_es;

  const formattedDate = new Date(post.fechaPublicacion).toLocaleDateString(
    locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-US' : 'es-MX',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  return (
    <article className="min-h-screen bg-brand-white pb-20">
      
      {/* Article Header & Breadcrumbs */}
      <header className="w-full bg-[#1E293B] text-white pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b-2 border-brand-green">
        {/* Soft Isotipo Background */}
        <div 
          className="absolute right-[-100px] top-[-100px] w-[400px] h-[400px] bg-no-repeat bg-contain pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'url(/images/isotipo/isotipo-oscuro.png)' }}
        />

        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          
          {/* Breadcrumb & Back */}
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Link href={`/${locale}`} className="hover:text-brand-green transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link href={`/${locale}/blog`} className="hover:text-brand-green transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-brand-green truncate max-w-xs">{post.categoria}</span>
          </div>

          {/* Category Tag & Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-white/70">
            <span className="bg-brand-green text-brand-navy font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
              {post.categoria}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-green" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-green" />
              ~4 min de lectura
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            {title}
          </h1>

          {/* Excerpt */}
          {excerpt && (
            <p className="font-body text-base md:text-lg text-white/80 leading-relaxed font-light">
              {excerpt}
            </p>
          )}

          {/* Author Badge */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-green/20 border border-brand-green/40 flex items-center justify-center text-brand-green font-bold text-sm overflow-hidden relative">
              {post.autorAvatar ? (
                <Image src={post.autorAvatar} alt={post.autor || 'Autor'} fill className="object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{post.autor || 'Grupo Exportador del Campo'}</p>
              {post.autorCargo && <p className="text-xs text-white/50">{post.autorCargo}</p>}
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-10">
        
        {/* Hero Cover Image */}
        {post.portadaUrl && (
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white">
            <Image
              src={post.portadaUrl}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Dynamic Blocks Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-gray-100">
          <BlogBlockRenderer blocks={blocks} />

          {/* Social Share Bar */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-navy uppercase tracking-wider">
              <Share2 className="w-4 h-4 text-brand-green" />
              <span>Compartir este artículo:</span>
            </div>
            <BlogShareButtons title={title} />
          </div>
        </div>

      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-green block mb-1">
                SEGUIR LEYENDO
              </span>
              <h3 className="font-display text-2xl font-bold text-brand-navy">
                Artículos Relacionados
              </h3>
            </div>
            <Link
              href={`/${locale}/blog`}
              className="flex items-center gap-1.5 text-xs font-bold text-brand-green hover:underline"
            >
              <span>Ver todo el blog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((rel) => {
              const relTitle = (locale === 'en' && rel.titulo_en) ? rel.titulo_en : (locale === 'de' && rel.titulo_de) ? rel.titulo_de : rel.titulo_es;
              const relExcerpt = (locale === 'en' && rel.resumen_en) ? rel.resumen_en : (locale === 'de' && rel.resumen_de) ? rel.resumen_de : rel.resumen_es;

              return (
                <BlogCard
                  key={rel.id}
                  slug={rel.slug}
                  title={relTitle}
                  excerpt={relExcerpt}
                  coverImage={rel.portadaUrl}
                  category={rel.categoria}
                  author={rel.autor}
                  date={rel.fechaPublicacion}
                  locale={locale}
                />
              );
            })}
          </div>
        </section>
      )}

    </article>
  );
}
