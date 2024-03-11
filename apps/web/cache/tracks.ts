import {prisma} from "@repo/db";
import {memoize} from "nextjs-better-unstable-cache";

export const getCachedTracks = memoize(
    async (userId?: string) =>
        await prisma.track.findMany({
            include: {
                _count: {
                    select: {
                        users: true,
                    },
                },
                ...(userId
                    ? {
                        users: {
                            where: {
                                id: userId,
                            },
                        },
                    }
                    : undefined),
            },
        }),
    {
        revalidateTags: (userId) => [`user::tracks::list::${userId}`],
        log: ["verbose", "datacache", "dedupe"],
        logid: "getCachedTracks",
    }
);


export const getAllTracks = memoize(async () => await prisma.track.findMany({}), {
    log: ["verbose", "datacache", "dedupe"],
    logid: "getAllTracks"
})