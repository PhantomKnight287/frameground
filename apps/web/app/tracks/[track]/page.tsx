import ChallengeCard from "@/components/challenge-card";
import Link from "next/link";
import { prisma } from "@repo/db";
import { auth } from "@/auth";
import { Metadata } from "next";
import { env } from "@/env.mjs";
import { siteMetadataConfig } from "@repo/config";

export async function generateMetadata({
  params,
}: {
  params: { track: string };
}): Promise<Metadata> {
  const track = await prisma.track.findFirst({
    where: { slug: params.track },
  });
  if (!track)
    return {
      title: `Challenges`,
      description: `Challenges for ${params.track}`,
    };
  const searchParams = new URLSearchParams();
  searchParams.set("name", track?.name || "");
  searchParams.set("imageUrl", track?.logo || "");
  return {
    metadataBase: new URL(env.HOST),
    title: `${track?.name} Challenges `,
    description: `Challenges for ${track?.name}`,
    openGraph: {
      type: "website",
      title: `${track?.name} Challenges`,
      description: `Challenges for ${track?.name}`,
      url: `${env.HOST}/tracks/${params.track}`,
      images: [
        {
          url: `${env.HOST}/api/og/track?${searchParams.toString()}`,
          width: 1200,
          height: 600,
          alt: "Tracks",
        },
      ],
    },
    twitter: siteMetadataConfig.twitter,
  };
}

async function Challenges({
  params,
}: {
  params: {
    track: string;
  };
}) {
  const session = await auth();
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
      ) as "upvotesCount",
      (
        SELECT COUNT(DISTINCT s."userId") FROM "Solves" s
        WHERE s."challengeId" = c."id" AND s."userId" = ${
          session?.user?.id || ""
        } AND s."type"='accepted'
      ) as "solved"
    FROM "Challenge" c
    JOIN "Track" t ON c."trackId" = t."id"
    WHERE t."slug" = ${params.track}
    ORDER BY "createdAt" ASC;
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
