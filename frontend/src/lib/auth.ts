import NextAuth, { type NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type { User, UserProfile } from '@/types';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials);

          // Find user by email
          const userAccount = await prisma.userAccount.findUnique({
            where: { email },
            include: {
              profile: true,
              politicalAlignment: true,
              influenceMetrics: true,
            },
          });

          if (!userAccount) {
            return null;
          }

          if (!userAccount.isActive) {
            throw new Error('Account is deactivated');
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, userAccount.passwordHash);

          if (!isPasswordValid) {
            return null;
          }

          // Update last login
          await prisma.userAccount.update({
            where: { id: userAccount.id },
            data: { lastLoginAt: new Date() },
          });

          // Return user object compatible with NextAuth
          return {
            id: userAccount.id,
            email: userAccount.email,
            username: userAccount.username,
            name: userAccount.profile?.displayName || userAccount.username,
            image: userAccount.profile?.profileImageUrl,
            emailVerified: userAccount.emailVerified,
            profile: userAccount.profile,
            politicalAlignment: userAccount.politicalAlignment,
            influenceMetrics: userAccount.influenceMetrics,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.emailVerified = user.emailVerified;
        token.profile = user.profile;
        token.politicalAlignment = user.politicalAlignment;
        token.influenceMetrics = user.influenceMetrics;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.emailVerified = token.emailVerified as boolean;
        session.user.profile = token.profile as UserProfile;
        session.user.politicalAlignment = token.politicalAlignment;
        session.user.influenceMetrics = token.influenceMetrics;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', { userId: user.id, isNewUser });
    },
    async signOut({ session, token }) {
      console.log('User signed out:', { userId: token?.id });
    },
  },
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Type extensions for NextAuth
declare module 'next-auth' {
  interface User {
    id: string;
    username: string;
    emailVerified: boolean;
    profile?: UserProfile;
    politicalAlignment?: any;
    influenceMetrics?: any;
  }

  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      name: string;
      image?: string;
      emailVerified: boolean;
      profile?: UserProfile;
      politicalAlignment?: any;
      influenceMetrics?: any;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    emailVerified: boolean;
    profile?: UserProfile;
    politicalAlignment?: any;
    influenceMetrics?: any;
  }
}