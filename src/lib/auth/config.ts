import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'
import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await prisma.user.findUnique({
          where: { email },
        })

        if (!user || !user.passwordHash) return null

        const isValidPassword = await bcrypt.compare(password, user.passwordHash)
        if (!isValidPassword) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          subscriptionPlan: user.subscriptionPlan,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.subscriptionPlan = (user as any).subscriptionPlan
      }

      if (trigger === 'update' && session) {
        token.name = session.name
        token.subscriptionPlan = session.subscriptionPlan
      }

      // // Refresh user data on each token refresh
      // if (token.id) {
      //   const dbUser = await prisma.user.findUnique({
      //     where: { id: token.id as string },
      //     select: {
      //       role: true,
      //       subscriptionPlan: true,
      //       subscriptionStatus: true,
      //     },
      //   })
      //   if (dbUser) {
      //     token.role = dbUser.role
      //     token.subscriptionPlan = dbUser.subscriptionPlan
      //   }
      // }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
          ; (session.user as any).role = token.role
          ; (session.user as any).subscriptionPlan = token.subscriptionPlan
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      // Set default character limit for new users
      await prisma.user.update({
        where: { id: user.id },
        data: {
          charactersLimit: 10000,
          subscriptionPlan: 'FREE',
        },
      })
    },
  },
})
