import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Rotas públicas
  if (pathname === '/login' || pathname === '/admin/login') return NextResponse.next()

  // Rotas admin — requer role ADMIN
  if (pathname.startsWith('/admin')) {
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next()
  }

  // Rotas do app — requer sessão
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/gerar') || pathname.startsWith('/historico')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (session.user.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
