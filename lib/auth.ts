import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '@/lib/mongodb';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/signup',
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return false;

      const client = await clientPromise;
      const db = client.db('skillswap'); // ✅ explicit DB
      const users = db.collection('users');

      const existingUser = await users.findOne({
        authProvider: 'google',
        authProviderId: account.providerAccountId,
      });

      // 🔑 mark whether user is new
      (user as any).isNewUser = !existingUser;

      if (!existingUser) {
        await users.insertOne({
          authProvider: 'google',
          authProviderId: account.providerAccountId,
          name: user.name,
          email: user.email,
          image: user.image,
          canTeach: [],
          wantsHelpWith: [],
          onboardingCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user && (user as any).isNewUser !== undefined) {
        token.isNewUser = (user as any).isNewUser;
      }
      return token;
    },

    async redirect({ baseUrl, token }) {
      // ✅ new users → onboarding
      if (token?.isNewUser) {
        return `${baseUrl}/onboarding`;
      }

      // ✅ existing users → explore
      return `${baseUrl}/explore`;
    },
  },
};