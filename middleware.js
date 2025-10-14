import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const userId = request.cookies.get('userId')?.value;
  const token = request.cookies.get('token')?.value;

  console.log('🔍 Middleware running on Edge');
  console.log('userId:', userId);
  console.log('token exists:', !!token);
  console.log('pathname:', pathname);

  if (token && userId) {
    if (!pathname.startsWith(`/${userId}/campaign-dashboard`)) {
      console.log(`➡️ Redirecting to /${userId}/campaign-dashboard`);
      return NextResponse.redirect(new URL(`/${userId}/campaign-dashboard`, request.url));
    }
  }

  if (!token && pathname !== '/signin-user' && pathname !== '/signup-user') {
    console.log('🚫 No token found — redirecting to /signin-user');
    return NextResponse.redirect(new URL('/signin-user', request.url));
  }

  console.log('✅ Middleware complete — proceeding');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/signin-user',
    '/signup-user',
    '/campaign-dashboard/:path*',
    '/create-campaign/:path*',
    '/admin/:path*',
  ],
};
