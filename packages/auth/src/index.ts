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
      username: string;
    };
  }
  interface User {
    createdAt: Date;
    roles: Role[];
    id: string;
    username: string;
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
  adapter: PrismaAdapter(prisma as any) as any,
  callbacks: {
    session: async ({ session, user }: { session: Session; user: User }) => {
      const userId = user.image.split("/")[4].replaceAll("?v=4", "");
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
      const _user = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });
      let username = user.username;
      if (!_user.username) {
        const req = await fetch(`https://api.github.com/user/${userId}`, {})
          .then((res) => res.json())
          .catch((err) => console.error(err));
        const updatedUser = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            username: req.login.toLowerCase(),
          },
        });
        username = req.login;
      }
      session.user = {
        ...session.user,
        id: user.id,
        roles,
        createdAt: user.createdAt,
        username,
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
