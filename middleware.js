import { NextResponse } from 'next/server';

const userProtectedPaths = [
  /^\/campaign-dashboard(\/.*)?$/,
  /^\/create-campaign(\/.*)?$/,
];

const adminProtectedPaths = [
  /^\/admin(\/.*)?$/, // This will match all admin paths
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const userId = request.cookies.get('userId')?.value;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('Role')?.value;
  const isAuthenticated = userId && token;
  const isAdmin = role === 'Admin';
  const isRegularUser = isAuthenticated && !isAdmin;

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/signin-user', request.url));
  }

  if ((pathname === '/signin-user' || pathname === '/signup-user') && (isAuthenticated || isAdmin)) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/campaign-dashboard', request.url));
  }

  const isAdminPath = adminProtectedPaths.some(regex => regex.test(pathname));
  if (isAdminPath) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/signin-user', request.url));
    }
    return NextResponse.next();
  }

  const isUserPath = userProtectedPaths.some(regex => regex.test(pathname));
  if (isUserPath) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/signin-user', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

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