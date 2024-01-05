import { authOptions } from "@repo/auth";
import NextAuth from "next-auth";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(authOptions);
