import NextAuth, { type DefaultSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/db/models/user.model'
import bcrypt from 'bcryptjs'
import { UserSignInSchema } from '@/lib/validator'
import { authConfig } from './auth.config'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }
  interface User {
    role?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = UserSignInSchema.safeParse(credentials)
        if (!parsed.success) return null

        await connectToDatabase()
        const user = await User.findOne({ email: parsed.data.email })
        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(
          parsed.data.password,
          user.password
        )
        if (!isValid) return null

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        }
      },
    }),
  ],
})
