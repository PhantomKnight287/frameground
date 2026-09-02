import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Trophy, Users } from "lucide-react";
import { prisma } from "@repo/db";
import { auth } from "@/auth";
import { Metadata } from "next";
import { env } from "@/env.mjs";
import { siteMetadataConfig } from "@repo/config";
import { formatNumber } from "@/utils/intl";
import ChallengeList, { ListChallenge } from "./_components/challenge-list";
import TrackLogo, { darkVariant } from "@/components/track-logo";
import { sortByCurriculum } from "@/utils/challenge-order";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string }>;
  }): Promise<Metadata> {
  const awaited = await params
  const track = await prisma.track.findFirst({
    where: { slug: awaited.track },
  });
  if (!track)
    return {
      title: `Challenges`,
      description: `Challenges for ${awaited.track}`,
    };
  const searchParams = new URLSearchParams();
  searchParams.set("name", track?.name || "");
  // The OG image renders on a dark background, and satori can only fetch
  // absolute URLs - vendored logos are stored as same-origin paths.
  const logo = track.logo ? darkVariant(track.logo) : "";
  searchParams.set(
    "imageUrl",
    logo.startsWith("/") ? `${env.HOST}${logo}` : logo
  );
  return {
    metadataBase: new URL(env.HOST),
    title: `${track?.name} Challenges `,
    description: `Challenges for ${track?.name}`,
    openGraph: {
      type: "website",
      title: `${track?.name} Challenges`,
      description: `Challenges for ${track?.name}`,
      url: `${env.HOST}/tracks/${awaited.track}`,
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
  params:Promise< {
    track: string;
  }>;
  }) {
  const awaited = await params
  const session = await auth();
  const track = await prisma.track.findUnique({
    where: { slug: awaited.track },
    include: { _count: { select: { users: true } } },
  });

  if (!track) notFound();

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
    WHERE t."slug" = ${awaited.track}
    ORDER BY c."createdAt" ASC;
  `;

  // The raw query returns BigInt columns, which cannot cross the server/client
  // boundary - normalise them before handing the rows to the client component.
  // The query orders by age only; the order challenges are meant to be worked
  // through comes from their prerequisites, which the database cannot express.
  const challenges: ListChallenge[] = sortByCurriculum(
    (d ?? []).map((challenge) => ({
      ...challenge,
      createdAt: challenge.createdAt?.toISOString?.() ?? challenge.createdAt,
      prerequisites: challenge.prerequisites ?? [],
      commentsCount: Number(challenge.commentsCount),
      solvesCount: Number(challenge.solvesCount),
      upvotesCount: Number(challenge.upvotesCount),
      solved: challenge.solved?.toString() ?? "0",
    }))
  );

  const solvedCount = challenges.filter((challenge) =>
    parseInt(challenge.solved || "0")
  ).length;
  const progress = challenges.length
    ? Math.round((solvedCount / challenges.length) * 100)
    : 0;

  return (
    <main className="mt-12">
      <div className="container">
        <Link
          href="/tracks"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          All tracks
        </Link>

        <header className="mt-4 overflow-hidden rounded-3xl border bg-gradient-to-br from-muted/60 to-background p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {track.logo ? (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border bg-background p-3 sm:h-20 sm:w-20">
                <TrackLogo
                  logo={track.logo}
                  name={track.name}
                  className="h-full w-full"
                />
              </div>
            ) : null}
            <div className="min-w-0 space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {track.name}
              </h1>
              {track.description ? (
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                  {track.description}
                </p>
              ) : null}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Trophy size={16} />
                  {challenges.length}{" "}
                  {challenges.length === 1 ? "challenge" : "challenges"}
                </span>
                <span className="flex items-center gap-2">
                  <Users size={16} />
                  {formatNumber(track._count.users)} enrolled
                </span>
                {session?.user?.id ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    {solvedCount} solved
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {session?.user?.id && challenges.length ? (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Your progress</span>
                <span>{progress}%</span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : null}
        </header>

        {challenges.length ? (
          <ChallengeList challenges={challenges} track={awaited.track} />
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed py-16 text-center">
            <p className="font-medium">No challenges yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This track is still being put together - check back soon.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default Challenges;
