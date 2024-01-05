import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@repo/db";
import type { Role } from "@repo/db/types";
import type { DefaultSession, Session, User } from "next-auth";
import { NextAuthConfig } from "next-auth";
import GithubProvider from "next-auth/providers/github";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: DefaultSession["user"] & {
      id: string;
      roles: Role[];
      createdAt: Date;
    };
  }
  interface User {
    createdAt: Date;
    roles: Role[];
  }
}
if (!process.env.GITHUB_CLIENT_ID)
  throw new Error(`GITHUB_CLIENT_ID is required`);
if (!process.env.GITHUB_CLIENT_SECRET)
  throw new Error(`GITHUB_CLIENT_SECRET is required`);

function getEnvVar(key: string) {
  return process.env[key] || "";
}

const useSecureCookies = getEnvVar("NEXTAUTH_URL").startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = new URL(getEnvVar("NEXTAUTH_URL")).hostname;

export const authOptions: NextAuthConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma) as any,
  callbacks: {
    session: async ({ session, user }: { session: Session; user: User }) => {
      let roles: Role[] = user.roles || [];
      if (roles.includes("user") == false) {
        const updatedUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            roles: {
              push: "user",
            },
          },
        });
      }
      session.user = {
        ...session.user,
        id: user.id,
        roles,
        createdAt: user.createdAt,
      };
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: "." + hostName,
        secure: useSecureCookies,
      },
    },
  },
};
