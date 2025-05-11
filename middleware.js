import { NextResponse } from 'next/server';

const protectedPaths = [
  /^\/campaign-dashboard$/,
  /^\/create-campaign$/,
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const userId = request.cookies.get('userId')?.value;
  const token = request.cookies.get('token')?.value;

  const isAuthenticated = userId && token;

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/signin-user', request.url));
  }

  if ((pathname === '/signin-user' || pathname === '/signup-user') && isAuthenticated) {
    return NextResponse.redirect(new URL(`${userId}/campaign-dashboard`, request.url));
  }

  const isProtected = protectedPaths.some((regex) => regex.test(pathname));
  
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/signin-user', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/signin-user',
    '/signup-user',
    '/campaign-dashboard',
    '/create-campaign',
  ],
};