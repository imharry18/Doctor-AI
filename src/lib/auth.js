import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

// Initialize global prisma to avoid active connection limits on reload
const globalForPrisma = global;
export const prisma = globalForPrisma.prisma || new PrismaClient({});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const authOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "doctor@ai.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        let user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          // Auto-create for rapid demo purposes locally
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
            }
          });
        }
        
        return user;
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "supersecretkey_for_local_dev",
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    }
  }
};
