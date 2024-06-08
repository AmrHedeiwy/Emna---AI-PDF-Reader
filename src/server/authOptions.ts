import { DefaultSession, NextAuthOptions } from 'next-auth';
import bcrypt from 'bcrypt';

import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prismadb';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id?: string;
    } & DefaultSession['user'];
  }
}

const authOptions: NextAuthOptions = {
  // @ts-expect-error
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password)
          throw new Error('INVALID_CREDENTIALS');

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.hashedPassword) throw new Error('INVALID_CREDENTIALS');

        const isMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!isMatch) throw new Error('INVALID_CREDENTIALS');

        if (!user.emailVerified) throw new Error('EMAIL_NOT_VERIFIED');

        return user;
      }
    })
  ],
  pages: {
    error: '/sign-in',
    signIn: '/sign-in'
  },
  callbacks: {
    jwt({ token, user }) {
      if (!!user) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (!!token) {
        session.user.id = token.id as string;
      }

      return session;
    }
  },

  // debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' }
};

export default authOptions;
