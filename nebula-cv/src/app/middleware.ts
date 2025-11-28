// /middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the routes that MUST be protected
const protectedRoutes = ['/builder', '/tracker', '/settings', '/dashboard']; 
// Define public auth routes we want to redirect FROM if logged in
const authRoutes = ['/login', '/signup']; 

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // IMPORTANT: This refreshes the session and sets new cookies if needed.
  const { data: { session } } = await supabase.auth.getSession();

  const currentPath = req.nextUrl.pathname;
  
  // --- LOGIC 1: Enforce Protection ---
  const isProtectedPath = protectedRoutes.some(path => currentPath.startsWith(path));
  
  if (isProtectedPath && !session) {
    console.log(`Middleware: Unauthorized access to ${currentPath}. Redirecting to /login.`);
    
    const loginUrl = new URL('/login', req.url);
    // Pass the intended destination so the user lands there after signing in
    loginUrl.searchParams.set('redirectTo', currentPath); 
    return NextResponse.redirect(loginUrl);
  }

  // --- LOGIC 2: Redirect Logged-In Users from Auth Pages ---
  const isAuthPath = authRoutes.some(path => currentPath.startsWith(path));

  if (isAuthPath && session) {
    console.log('Middleware: Logged-in user accessing auth route. Redirecting to /dashboard.');
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Pass the request through (Crucial: updates the response with new cookies)
  return res;
}

// 3. Configure matcher to run middleware on all app paths (except static assets)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};