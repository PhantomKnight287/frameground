import {prisma} from "@repo/db";
import {memoize} from "nextjs-better-unstable-cache";

export const getCachedSolutionsPosted = memoize(
    async (username: string) =>
        await prisma.solution.findMany({where: {author: {username}}}),
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
                        initialFiles:true,
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


export const getCachedSolutions = memoize(async (trackSlug: string|null, challengeSlug: string|null, orderBy: "asc" | "desc" | null
) => await prisma.solution.findMany({
    orderBy: [
        {
            createdAt: orderBy || "desc"
        }
    ],
    where: {
        challenge: {
            // passing null with check if slug is null
            slug: challengeSlug || undefined,
            track: {
                slug: trackSlug || undefined,
            }
        }
    },include:{
        challenge:{
            select:{
                label:true,slug:true,
                track:{
                    select:{
                        name:true,
                        slug:true,
                    }
                }
            },
        }
    }
}), {
    revalidateTags: (trackSlug: string|null, challengeSlug: string|null, orderBy: "asc" | "desc" | null) => [`solutions::${trackSlug}::${challengeSlug}::${orderBy}`],
    log: ["verbose", "datacache", "dedupe"],
    logid: "getCachedSolution",
})