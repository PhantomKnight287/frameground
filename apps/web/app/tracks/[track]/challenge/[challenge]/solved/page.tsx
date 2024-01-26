import { PageProps } from "./$types";
import { prisma } from "@repo/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SolvedPageTabs from "./page.client";
import { parseToNumber } from "@/utils";
import { z } from "zod";
import { Solvetype } from "@repo/db/types";
import { FitAddon } from "xterm-addon-fit";
import nextDynamic from "next/dynamic";
import Resizable from "./resizable";
import Comments from "./_components/comments";

export const dynamic = "force-dynamic";

const JestOutputRenderer = nextDynamic(() => import("./_components/terminal"), {
  ssr: false,
});

async function Solved({ params, searchParams }: PageProps) {
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
        />
      }
    />
  );
}

export default Solved;
