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
import { usePathname, useRouter } from "next/navigation";

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
  const pathName = usePathname();
  return (
    <Tabs
      defaultValue={queryParams?.tab || "description"}
      onChange={(value) =>
        replace(`${pathName}?tab=${value}`, { scroll: false })
      }
    >
      <TabsList className="w-full">
        <TabsTrigger
          value="description"
          className="flex-grow"
          onClick={() =>
            replace(`${pathName}?tab=description`, { scroll: false })
          }
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="comments"
          className="flex-grow"
          onClick={() => replace(`${pathName}?tab=comments`, { scroll: false })}
        >
          Comments
        </TabsTrigger>
        <TabsTrigger
          value="solutions"
          className="flex-grow"
          onClick={() =>
            replace(`${pathName}?tab=solutions`, { scroll: false })
          }
        >
          Solutions
        </TabsTrigger>
      </TabsList>
      <TabsContent value={"description"}>
        <div className="overflow-scroll custom-scrollable-element p-4 max-h-screen bg-border rounded-xl rounded-t-none">
          <h1 className="text-2xl font-bold mb-2">{challenge.label}</h1>
          <div className="flex flex-row items-center justify-start gap-2">
            {challenge.authors.map((author) => (
              <Tooltip key={author.id}>
                <TooltipTrigger asChild>
                  <a
                    key={author.id}
                    href={`/user/@${author.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Badge
                      key={author.id}
                      className="hover:bg-background p-0"
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
            <span className="text-muted-foreground ">•</span>
            <span className="text-sm">{fromNow(challenge.createdAt)}</span>
          </div>
          <div className="flex flex-row my-2 gap-4">
            <Badge>{upperFirst(challenge.difficulty)}</Badge>
            <UpVote challenge={challenge} params={params} />
          </div>
          <Markdown>{challenge?.info}</Markdown>
        </div>
      </TabsContent>
      <TabsContent value="comments">comments</TabsContent>
      <TabsContent value="solutions">solutions</TabsContent>
    </Tabs>
  );
}

export default ChallengeTabs;
