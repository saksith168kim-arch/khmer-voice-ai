import { auth } from '@/lib/auth/config'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl, auth: session } = req

  // Protect dashboard routes
  if (nextUrl.pathname.startsWith('/dashboard') && !session) {
    const loginUrl = new URL('/login', nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Protect admin routes
  if (nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', nextUrl.origin))
    }
    const user = session.user as any
    if (user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl.origin))
    }
  }

  // Redirect logged-in users from auth pages
  if (session && (nextUrl.pathname === '/login' || nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
}
