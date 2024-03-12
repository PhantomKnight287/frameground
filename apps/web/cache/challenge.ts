import { memoize } from "nextjs-better-unstable-cache";
import { prisma } from "@/lib/db";

export const getAllChallenges = memoize(
  async (trackSlug?: string | null) =>
    await prisma.challenge.findMany({
      select: {
        slug: true,
        label: true,
      },
      where: trackSlug
        ? {
            track: {
              slug: trackSlug,
            },
          }
        : undefined,
    }),
  {
    revalidateTags: (trackSlug) => [`challenges::${trackSlug || undefined}`],
  }
);
