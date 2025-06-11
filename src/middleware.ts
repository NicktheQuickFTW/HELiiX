import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )
  
  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Define protected routes
  const protectedRoutes = [
    '/dashboard',
    '/finance',
    '/operations', 
    '/teams',
    '/awards',
    '/profile',
    '/settings',
    '/ai-assistant',
    '/ai-features'
  ]

  // Define admin-only routes
  const adminRoutes = [
    '/admin',
    '/settings'
  ]

  // Define role-based route access
  const roleBasedRoutes = {
    '/finance': ['admin', 'finance'],
    '/operations': ['admin', 'operations', 'finance'],
    '/awards': ['admin', 'operations', 'marketing'],
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isLoginPage = pathname === '/login'

  // If accessing login page and already authenticated, redirect to dashboard
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // If accessing protected route without authentication, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If authenticated, check role-based access
  if (session && isProtectedRoute) {
    try {
      // Get user profile to check role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        // Check admin routes
        if (isAdminRoute && profile.role !== 'admin') {
          return NextResponse.redirect(new URL('/dashboard', req.url))
        }

        // Check role-based routes
        for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
          if (pathname.startsWith(route) && !allowedRoles.includes(profile.role)) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
          }
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error)
      // On error, redirect to login to be safe
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}