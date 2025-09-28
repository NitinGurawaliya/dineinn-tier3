import { NextRequest, NextResponse } from 'next/server';

export function subdomainMiddleware(request: NextRequest) {
  const hostHeader = request.headers.get('host') || '';
  const hostname = hostHeader.split(':')[0]; // strip port if present
  const labels = hostname.toLowerCase().split('.');

  // Skip for localhost/dev and apex domain (no subdomain) or www
  const isLocalDev = hostname === 'localhost' || hostname === '127.0.0.1';
  if (isLocalDev || labels.length < 3 || labels[0] === 'www') {
    return NextResponse.next();
  }

  const subdomain = labels[0];
  const url = request.nextUrl.clone();

  // If accessing root path on subdomain, rewrite to menu page
  if (url.pathname === '/') {
    url.pathname = `/menu/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}