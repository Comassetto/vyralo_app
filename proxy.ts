import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from '@auth/core/jwt'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/login' || pathname === '/admin/login') {
    return NextResponse.next()
  }

  const isSecure = process.env.NODE_ENV === 'production'

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET!,
    secureCookie: isSecure,
  })

  if (pathname.startsWith('/admin')) {
    if (!token || (token as any).role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next()
  }

  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/gerar') ||
    pathname.startsWith('/historico')
  ) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if ((token as any).role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
