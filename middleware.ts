import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware({
  locales: ['es', 'en', 'de'],
  defaultLocale: 'es',
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes entirely
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Protect /admin/* routes — but NEVER redirect the login page itself
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login' || pathname.startsWith('/admin/login')) {
      return NextResponse.next();
    }

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Apply i18n middleware for public routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(es|en|de)/:path*',
    '/admin',
    '/admin/:path*',
  ],
};
