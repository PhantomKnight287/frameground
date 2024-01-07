"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { upperFirst } from "@/utils";
import { fromNow } from "@/utils/time";
import React from "react";
import UpVote from "./_components/vote";
import { Markdown } from "@/components/markdown";
import { Challenge, Upvote, User } from "@repo/db/types";
import { useRouter } from "next/navigation";

function ChallengeTabs({
  challenge,
  params,
  queryParams,
}: {
  queryParams?: { tab?: string };
  challenge: Challenge & {
    authors: User[];
    upvotes: Upvote[];
    _count: { upvotes: number };
  };
  params: Record<"track" | "challenge", string>;
}) {
  const { replace } = useRouter();
  return (
    <Tabs defaultValue="description" onChange={console.log}>
      <TabsList className="w-full">
        <TabsTrigger
          value="description"
          className="flex-grow"
          onClick={() =>
            replace(
              `/tracks/${params.track}/challenge/${params.challenge}?tab=description`,
              { scroll: false }
            )
          }
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="comments"
          className="flex-grow"
          onClick={() =>
            replace(
              `/tracks/${params.track}/challenge/${params.challenge}?tab=comments`,
              { scroll: false }
            )
          }
        >
          Comments
        </TabsTrigger>
      </TabsList>
      <TabsContent value={queryParams?.tab || "description"}>
        <div className="overflow-scroll custom-scrollable-element p-4 max-h-screen bg-border rounded-xl rounded-t-none">
          <h1 className="text-2xl font-bold mb-2">{challenge.label}</h1>
          <div className="flex flex-row items-center justify-start gap-4">
            {challenge.authors.map((author) => (
              <Tooltip key={author.id}>
                <TooltipTrigger asChild>
                  <a key={author.id} href={`/@${author.username}`}>
                    <Badge
                      key={author.id}
                      className="hover:bg-background"
                      variant={"secondary"}
                    >
                      @{author.username}
                    </Badge>
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Author</p>
                </TooltipContent>
              </Tooltip>
            ))}
            <span className="text-sm text-muted-foreground">
              {fromNow(challenge.updatedAt)}
            </span>
          </div>
          <div className="flex flex-row my-2 gap-4">
            <Badge>{upperFirst(challenge.difficulty)}</Badge>
            <UpVote challenge={challenge} params={params} />
          </div>
          <Markdown>{challenge?.info}</Markdown>
        </div>
      </TabsContent>
      <TabsContent value="comments">comments</TabsContent>
    </Tabs>
  );
}

export default ChallengeTabs;
