import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      const isProtectedRoute =
        nextUrl.pathname.startsWith('/checkout') ||
        nextUrl.pathname.startsWith('/orders') ||
        nextUrl.pathname.startsWith('/account')

      if (isAdminRoute) {
        if (!isLoggedIn) return Response.redirect(new URL('/sign-in', nextUrl))
        if (auth?.user?.role !== 'admin')
          return Response.redirect(new URL('/', nextUrl))
        return true
      }

      if (isProtectedRoute && !isLoggedIn) {
        return Response.redirect(
          new URL(`/sign-in?callbackUrl=${nextUrl.pathname}`, nextUrl)
        )
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  session: { strategy: 'jwt' as const },
} satisfies NextAuthConfig
