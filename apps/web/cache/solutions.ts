import { prisma } from "@repo/db";
import { memoize } from "nextjs-better-unstable-cache";

export const getCachedSolutionsPosted = memoize(
  async (username: string) =>
    await prisma.solution.findMany({ where: { author: { username } } }),
  {
    revalidateTags: (username) => [`solutions::${username}`],
    log: ["verbose", "datacache", "dedupe"],
    logid: "getCachedSolutionsPosted",
  }
);

export const getCachedSolution = memoize(
  async (id: string) =>
    await prisma.solution.findFirst({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            username: true,
            name: true,
          },
        },
        files: true,
        challenge: {
          select: {
            slug: true,
            track: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    }),
  {
    revalidateTags: (id) => [`solution::${id}`],
    log: ["verbose", "datacache", "dedupe"],
    logid: "getCachedSolution",
  }
);
