import { NextRequest, NextResponse } from 'next/server';

export function subdomainMiddleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  
  // Skip for main domain and www
  if (subdomain === 'www' || subdomain === 'dineinn' || subdomain === 'localhost') {
    return NextResponse.next();
  }

  // Check if this is a valid subdomain
  const url = request.nextUrl.clone();
  
  // If accessing root path on subdomain, redirect to menu page
  if (url.pathname === '/') {
    url.pathname = `/menu/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
} 