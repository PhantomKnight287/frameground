import { unstable_cache as cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { Track } from "@repo/db/types";

export type HomeStats = {
  tracks: number;
  challenges: number;
  solves: number;
  builders: number;
};

export type FeaturedTrack = Track & {
  _count: { users: number; challenges: number };
};

/**
 * The homepage is statically rendered and revalidated, so it has to survive a
 * build with no database reachable. Every query here falls back to `null` and
 * the section that asked for it renders nothing rather than failing the page.
 */
export const getHomeStats = cache(
  async (): Promise<HomeStats | null> => {
    try {
      const [tracks, challenges, solves, builders] = await Promise.all([
        prisma.track.count({ where: { status: "active" } }),
        prisma.challenge.count(),
        prisma.solves.count({ where: { type: "accepted" } }),
        prisma.user.count(),
      ]);
      return { tracks, challenges, solves, builders };
    } catch (err) {
      console.error("failed to load home stats", err);
      return null;
    }
  },
  ["home-stats"],
  { revalidate: 900, tags: ["home-stats"] }
);

export const getFeaturedTracks = cache(
  async (): Promise<FeaturedTrack[]> => {
    try {
      return await prisma.track.findMany({
        where: { status: "active" },
        include: { _count: { select: { users: true, challenges: true } } },
        orderBy: { users: { _count: "desc" } },
        take: 3,
      });
    } catch (err) {
      console.error("failed to load featured tracks", err);
      return [];
    }
  },
  ["home-featured-tracks"],
  { revalidate: 900, tags: ["home-featured-tracks"] }
);
