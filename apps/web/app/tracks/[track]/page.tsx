import ChallengeCard from "@/components/challenge-card";
import Link from "next/link";
import { prisma } from "@repo/db";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

async function Challenges({
  params,
}: {
  params: {
    track: string;
  };
}) {
  const session = await auth();
  const data = await prisma.challenge.findMany({
    where: {
      track: {
        slug: params.track,
      },
    },
    include: {
      _count: {
        select: {
          comments: true,
          solves: true,
          upvotes: true,
        },
      },
      ...(session?.user?.username
        ? {
            solves: {
              select: {
                id: true,
              },
              where: {
                user: { username: session.user.username },
              },
            },
          }
        : undefined),
    },
  });
  const d = await prisma.$queryRaw<any[]>`
    SELECT
      c.*,
      (
        SELECT COUNT(*) FROM "Comment" co
        WHERE co."challengeId" = c."id"
      ) as "commentsCount",
      (
        SELECT COUNT(DISTINCT s."userId") FROM "Solves" s
        WHERE s."challengeId" = c."id" AND s."type"='accepted' 
      ) as "solvesCount",
      (
        SELECT COUNT(*) FROM "Upvote" u
        WHERE u."challengeId" = c."id"
      ) as "upvotesCount"
    FROM "Challenge" c
    JOIN "Track" t ON c."trackId" = t."id"
    WHERE t."slug" = ${params.track};
  `;
  return (
    <main className="flex mt-12">
      <div className="container">
        <h3 className="font-semibold tracking-tight max-w-[75%] truncate text-2xl duration-300">
          Challenges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {d?.map((challenge) => (
            <Link
              key={challenge.id}
              href={`/tracks/${params.track}/challenge/${challenge.slug}`}
              className="group snap-center focus:outline-none sm:w-[330px] xl:w-[333px]"
            >
              <ChallengeCard challenge={challenge} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Challenges;
