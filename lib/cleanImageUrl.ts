export function cleanImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  let clean = url.trim();

  // If it's a Next.js optimized image URL: http://.../_next/image?url=... or /_next/image?url=...
  if (clean.includes('_next/image') && clean.includes('url=')) {
    try {
      const fullUrl = clean.startsWith('http')
        ? clean
        : `http://localhost:3000${clean.startsWith('/') ? '' : '/'}${clean}`;
      const parsed = new URL(fullUrl);
      const innerUrl = parsed.searchParams.get('url');
      if (innerUrl) {
        return decodeURIComponent(innerUrl);
      }
    } catch {}
  }

  // If it's a localhost absolute URL: http://localhost:3000/images/...
  if (clean.startsWith('http://localhost') || clean.startsWith('http://127.0.0.1')) {
    try {
      const parsed = new URL(clean);
      return parsed.pathname + parsed.search;
    } catch {}
  }

  return clean;
}
