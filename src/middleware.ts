import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Temporarily disabled auth middleware for debugging
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}