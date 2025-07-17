import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { subdomainMiddleware } from './middleware/subdomain'

// Define protected routes that require authentication
const protectedRoutes = [
  '/restaurant/dashboard',
  '/onboarding/details',
  '/onboarding/menu'
  // '/restaurant/menu' and '/restaurant/' are NOT here, so /restaurant/menu and its subroutes are public
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/onboarding/auth/signin',
  '/onboarding/auth/signup'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Debug logging
  console.log('MIDDLEWARE:', { pathname, token })

  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];

  // Handle subdomain requests
  if (subdomain && subdomain !== 'www' && subdomain !== 'dineinn' && subdomain !== 'localhost') {
    return subdomainMiddleware(request);
  }

  // If requesting an API route, skip middleware
  if (pathname.startsWith('/api')) return NextResponse.next()

  // If not authenticated and on a protected route, redirect to signin
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    console.log('Redirecting to signin from protected route')
    return NextResponse.redirect(new URL('/onboarding/auth/signin', request.url))
  }

  // If authenticated and on an auth page, redirect to dashboard
  if (token && (pathname === '/onboarding/auth/signin' || pathname === '/onboarding/auth/signup')) {
    console.log('Redirecting to dashboard from auth page')
    return NextResponse.redirect(new URL('/restaurant/dashboard', request.url))
  }

  // If authenticated and on home page, redirect to dashboard
  if (token && pathname === '/') {
    console.log('Redirecting to dashboard from home')
    return NextResponse.redirect(new URL('/restaurant/dashboard', request.url))
  }

  // If on a protected route and token exists, verify it
  if (protectedRoutes.some(route => pathname.startsWith(route)) && token) {
    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
      await jwtVerify(token, secret)
    } catch (error) {
      console.log('Token verification failed, redirecting to signin', error)
      return NextResponse.redirect(new URL('/onboarding/auth/signin', request.url))
    }
  }

  // Otherwise, allow request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
} 