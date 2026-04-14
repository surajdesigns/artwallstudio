import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // This will refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();

  const protectedPaths = ['/account', '/wishlist', '/orders'];
  const adminPaths = ['/admin'];
  const authPaths = ['/login', '/register'];
  const path = request.nextUrl.pathname;

  // 1. Session-based protection
  if (protectedPaths.some((p) => path.startsWith(p)) && !session) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', path);
    return NextResponse.redirect(url);
  }

  // 2. Already logged in → skip auth pages
  if (authPaths.some((p) => path.startsWith(p)) && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 3. Admin routes protection
  if (adminPaths.some((p) => path.startsWith(p))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login?redirect=/admin', request.url));
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/account/:path*', '/wishlist', '/orders/:path*', '/admin/:path*', '/login', '/register'],
};
