import { checkAuthStatus } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Define paths that require authentication
  const protectedPaths = ['/dashboard', '/profile', '/admin'];
  
  // Check if the current path matches any protected paths
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(`${path}/`)
  );
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  const { authenticated, requiresNewLogin } = await checkAuthStatus(request);
  
  // If not authenticated or requires new login after 30 days, redirect to login
  if (!authenticated || requiresNewLogin) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Export config to specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need authentication
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth/login|api/auth/signup).*)',
  ],
};