import React from "react";
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

async function Solved({ params, searchParams }: PageProps) {
  const data = await auth();
  if (!data) redirect("/api/auth/signin");
  const solve = await prisma.solves.findFirst({
    where: {
      challenge: { slug: params.challenge, track: { slug: params.track } },
    },
    include: {
      challenge: {
        include: {
          _count: {
            select: {
              comments: true,
              upvotes: true,
            },
          },
          track: {
            select: {
              users: data?.user?.username
                ? {
                    select: { id: true },
                    where: {
                      username: {
                        equals: data.user.username,
                        mode: "insensitive",
                      },
                    },
                  }
                : undefined,
              name: true,
            },
          },
          ...(data?.user?.id
            ? {
                upvotes: {
                  select: {
                    id: true,
                  },
                  where: {
                    authorId: data.user.id,
                  },
                },
              }
            : undefined),
        },
      },
      user: true,
    },
  });
  if (!solve) redirect(`/tracks/${params.track}/challenge/${params.challenge}`);
  return (
    <div className="p-4 h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <SolvedPageTabs
            challenge={solve}
            currentTab={searchParams.tab as string}
            params={params}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="bg-border rounded-md p-4">
          <h1 className="text-2xl font-semibold text-green-500">
            Congratulations! You solved the challenge!
          </h1>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default Solved;
