import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImage?: string | null;
  category: string;
  author?: string | null;
  date: Date | string;
  locale: string;
  readTimeMinutes?: number;
}

export function BlogCard({
  slug,
  title,
  excerpt,
  coverImage = '/images/features/quienes.jpg',
  category,
  author = 'Grupo Exportador del Campo',
  date,
  locale,
  readTimeMinutes = 4,
}: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString(
    locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-US' : 'es-MX',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1">
      <div>
        {/* Cover Image Container */}
        <Link href={`/${locale}/blog/${slug}`} className="block relative aspect-[16/10] overflow-hidden bg-gray-100">
          <Image
            src={coverImage || '/images/features/quienes.jpg'}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Category Tag */}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-brand-navy/90 backdrop-blur-sm text-brand-green text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow border border-brand-green/30">
              {category}
            </span>
          </div>
        </Link>

        {/* Card Body */}
        <div className="p-6">
          {/* Metadata Bar */}
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 font-body">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-green" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-green" />
              ~{readTimeMinutes} min
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display text-lg md:text-xl font-bold text-brand-navy group-hover:text-brand-green transition-colors line-clamp-2 leading-snug mb-3">
            <Link href={`/${locale}/blog/${slug}`}>
              {title}
            </Link>
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="font-body text-xs md:text-sm text-brand-navy/70 line-clamp-3 leading-relaxed">
              {excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 pt-0 border-t border-gray-50 flex items-center justify-between text-xs mt-4">
        <div className="flex items-center gap-2 text-gray-500 truncate max-w-[180px]">
          <User className="w-3.5 h-3.5 text-brand-green shrink-0" />
          <span className="truncate font-medium">{author}</span>
        </div>

        <Link
          href={`/${locale}/blog/${slug}`}
          className="flex items-center gap-1 text-brand-green font-bold group-hover:translate-x-1 transition-transform"
        >
          <span>Leer más</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
