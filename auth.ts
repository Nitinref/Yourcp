import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prismaClient } from "@/lib/prismaclient";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prismaClient),
  session: {
    strategy: "database"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  pages: {
    signIn: "/"
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  }
};

export function getAuthSession() {
  return getServerSession(authOptions);
}
