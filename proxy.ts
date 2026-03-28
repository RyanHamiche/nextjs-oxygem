import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
const { auth } = NextAuth(authConfig)

export default auth((request) => {
  const _request = request
  return undefined
})

export const config = {
  matcher: ['/admin/:path*', '/checkout/:path*', '/orders/:path*', '/account/:path*'],
}
