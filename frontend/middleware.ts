import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

//   route cuek
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/reports');

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/', request.url)); 
  }

  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/', '/dashboard/:path*', '/reports/:path*'],
};