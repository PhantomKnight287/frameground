import { PrismaClient } from "@prisma/client";
import extension from "prisma-paginate";
import { extendedPrismaClient } from "./_type";

const globalForPrisma = globalThis as unknown as {
  prisma: extendedPrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  }).$extends(extension);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
