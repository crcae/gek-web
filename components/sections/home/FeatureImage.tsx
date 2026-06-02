'use client';

import Image from 'next/image';

interface FeatureImageProps {
  src: string;
  alt: string;
}

/**
 * Thin client wrapper so the onError handler is valid in a Server Component tree.
 * Hides the <Image> if it fails to load and lets the navy background show through.
 */
export function FeatureImage({ src, alt }: FeatureImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      sizes="(max-width: 768px) 100vw, 25vw"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  );
}
