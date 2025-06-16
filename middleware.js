import { NextResponse } from 'next/server';

const protectedPaths = [
  /^\/campaign-dashboard$/,
  /^\/create-campaign$/,
];

const adminOnlyPaths = [
  /^\/admin\/dashboard$/,
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const userId = request.cookies.get('userId')?.value;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('Role')?.value;
  const isAuthenticated = userId && token;
  const isAdmin = role === 'Admin';

  // Redirect from root to signin
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/signin-user', request.url));
  }

  // Redirect signed-in users away from login/signup pages
  if (
    (pathname === '/signin-user' || pathname === '/signup-user') &&
    (isAuthenticated || isAdmin)
  ) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.redirect(new URL(`/${userId}/campaign-dashboard`, request.url));
  }

  // Protect regular user routes
  const isProtected = protectedPaths.some((regex) => regex.test(pathname));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/signin-user', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin-only routes
  const isAdminProtected = adminOnlyPaths.some((regex) => regex.test(pathname));
  if (isAdminProtected && !isAdmin) {
    return NextResponse.redirect(new URL('/signin-user', request.url));
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
    '/admin/dashboard',
  ],
};
