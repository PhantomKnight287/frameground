import { prisma } from "@repo/db";
import { redirect } from "next/navigation";
import { parseToNumber } from "@/utils";
import { z } from "zod";
import { Solvetype } from "@repo/db/types";
import Comments from "./_components/comments";
import Resizable from "./resizable";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

async function Solved({
  params,
  searchParams,
}: {
  params: {
    track: string;
    challenge: string;
  };
  searchParams: {
    limit?: string;
    page?: string;
    status?: string;
    attempt?: string;
    sort_comments?: string;
  };
}) {
  const data = await auth();
  if (!data || !data.user) redirect("/api/auth/signin");
  const solves = await prisma.solves.paginate({
    limit: parseToNumber(searchParams.limit as string, 10),
    page: parseToNumber(searchParams.page as string, 1),
    where: {
      challenge: {
        slug: params.challenge as string,
        track: {
          slug: params.track as string,
        },
      },
      type: z.nativeEnum(Solvetype).safeParse(searchParams.status).success
        ? (searchParams.status as Solvetype)
        : undefined,
    },
    select: {
      id: true,
      type: true,
      output: true,
      createdAt: true,
      challenge: {
        select: {
          id: true,
          trackId: true,
        },
      },
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  if (!solves?.count)
    redirect(`/tracks/${params.track}/challenge/${params.challenge}`);
  const solveToShow = z.string().cuid().safeParse(searchParams.attempt).success
    ? await prisma.solves.findFirst({
        where: {
          id: searchParams.attempt as string,
          challenge: {
            slug: params.challenge as string,
            track: {
              slug: params.track as string,
            },
          },
          userId: data.user.id,
        },
      })
    : await prisma.solves.findFirst({
        where: {
          type: "accepted",
          challenge: {
            slug: params.challenge as string,
            track: {
              slug: params.track as string,
            },
          },
          userId: data.user.id,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
  return (
    <Resizable
      solves={solves?.result}
      solveToShow={solveToShow}
      CommentsSection={
        <Comments
          trackSlug={params.track as string}
          challengeSlug={params.challenge as string}
          sortBy={searchParams.sort_comments as "oldest" | "newest"}
          challengeId={solves?.result[0]!.challenge.id}
          trackId={solves?.result[0]!.challenge.trackId!}
        />
      }
    />
  );
}

export default Solved;
