// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Ambil cookie token
  const token = request.cookies.get('token')?.value;

  // 2. Ambil path URL yang sedang diakses
  const { pathname } = request.nextUrl;

  // 3. Tentukan rute mana saja yang butuh proteksi (Protected Routes)
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/reports');

  // 4. Jika mencoba akses rute terproteksi TAPI tidak punya token -> Redirect ke Login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/', request.url)); // Kembali ke halaman utama/login
  }

  // 5. Jika sudah login tapi mencoba akses halaman login lagi -> Redirect ke Dashboard
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Konfigurasimatcher agar middleware hanya berjalan di rute tertentu (menghemat performa)
export const config = {
  matcher: ['/', '/dashboard/:path*', '/reports/:path*'],
};