import { prisma } from "@repo/db";
import { memoize } from "nextjs-better-unstable-cache";

export const getCacheUser = memoize(
    async (username: string) =>
        await prisma.user.findFirst({
            where: { username: { equals: username, mode: "insensitive" } },
            select: {
                username: true,
                tracks: true,
                name: true,
                createdAt: true,
                bio: true,
                id: true,
                _count: {
                    select: {
                        solutions: true,
                        tracks: true,
                    },
                },
            },
        })!,
    {
        revalidateTags: (username: string) => [`profile::${username}`],
        log: ["verbose", "datacache", "dedupe"],
        logid: "getCacheUser",
    }
);

export const getCacheSolvesCount = memoize(
    async (userId: string) =>
        await prisma.$queryRaw<
            {
                solves_count: number;
            }[]
        >`select cast(count(*) as INTEGER) as solves_count from (select distinct("challengeId","userId") from "Solves" where type = 'accepted' and "userId" = ${userId}) as distinct_solves;`,
    {
        revalidateTags: (userId: string) => [`user::solves::${userId}`],
        log: ["verbose", "datacache", "dedupe"],
        logid: "getCacheSolvesCount",
    }
);

export const getCachedSolvedChallenges = memoize(
    async (username: string) =>
        await prisma.challenge.findMany({
            where: {
                solves: {
                    some: {
                        type: "accepted",
                        user: {
                            username: {
                                equals: username,
                                mode: "insensitive",
                            },
                        },
                    },
                },
            },
            select: {
                label: true,
                id: true,
                solves: {
                    take: 1,
                    orderBy: [
                        {
                            createdAt: "desc",
                        },
                    ],
                },
                track: {
                    select: {
                        slug: true,
                    },
                },
                slug: true,
            },
        }),
    {
        revalidateTags: (username) => [`user::challenges::${username}`],
        log: ["verbose", "datacache", "dedupe"],
        logid: "getCachedSolvedChallenges",
    }
);

export const getCachedEnrolledTracks = memoize(
    async (username: string) =>
        await prisma.track.findMany({
            where: {
                users: {
                    some: {
                        username,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
            },
        }),
    {
        revalidateTags: (username) => [`user::tracks::${username}`],
        log: ["verbose", "datacache", "dedupe",],
        logid: "getCachedEnrolledTracks",
    }
);