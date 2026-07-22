import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. The "Bouncer" checks for the VIP Pass (your 'token' cookie)
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 2. Identify if the user is trying to access ANY of our protected areas
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/reports') || 
    pathname.startsWith('/inventory') || 
    pathname.startsWith('/suppliers'); 

  // 3. If it's a protected route and they have no token, bounce them to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 4. Otherwise, they have the token, let them through
  return NextResponse.next();
}

export const config = {
  // 5. Tell Next.js exactly which paths this middleware should monitor
  matcher: [
    '/dashboard/:path*', 
    '/reports/:path*', 
    '/inventory/:path*', 
    '/suppliers/:path*' // <-- Added suppliers here
  ],
};