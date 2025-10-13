import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const userProtectedPaths = [
  /^\/campaign-dashboard(\/.*)?$/,
  /^\/create-campaign(\/.*)?$/,
];

const adminProtectedPaths = [
  /^\/admin(\/.*)?$/,
];

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const userId = request.cookies.get('userId')?.value;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('Role')?.value;

  let isAuthenticated = false;
  let isTokenExpired = false;
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      isAuthenticated = true;
      isAdmin = role === 'Admin';
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        isTokenExpired = true;
      }
      isAuthenticated = false;
    }
  }

  if (isTokenExpired) {
    const response = NextResponse.redirect(new URL('/signin-user', request.url));
    response.cookies.delete('token');
    response.cookies.delete('userId');
    response.cookies.delete('Role');
    return response;
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/signin-user', request.url));
  }

  if ((pathname === '/signin-user' || pathname === '/signup-user') && isAuthenticated) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.redirect(new URL(`/${userId}/campaign-dashboard`, request.url));
  }

  const isAdminPath = adminProtectedPaths.some(regex => regex.test(pathname));
  if (isAdminPath) {
    if (!isAuthenticated || !isAdmin) {
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
