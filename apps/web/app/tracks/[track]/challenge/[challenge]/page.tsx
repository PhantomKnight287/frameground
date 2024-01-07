import { Markdown } from "@/components/markdown";
import { prisma } from "@repo/db";
import { redirect } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { fromNow } from "@/utils/time";
import { upperFirst } from "@/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThumbsUp } from "lucide-react";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { upvoteChallenge } from "./action";
import UpVote from "./_components/vote";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChallengeTabs from "./page.client";

async function Challenge({
  params,
  queryParams,
}: {
  params: { track: string; challenge: string };
  queryParams: { tab?: string };
}) {
  const data = await auth();
  const challenge = await prisma.challenge.findFirst({
    where: {
      slug: params.challenge,
      track: {
        slug: params.track,
      },
    },
    include: {
      authors: true,
      _count: {
        select: {
          comments: true,
          upvotes: true,
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
  });

  if (!challenge) redirect(`/404`);
  return (
    <div className="p-4 sticky top-[40px]">
      <div className="flex flex-row">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            <ChallengeTabs
              challenge={challenge}
              params={params}
              queryParams={queryParams}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <div className="">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum
              nobis illum incidunt neque esse vel fuga minus optio odio quia!
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default Challenge;
