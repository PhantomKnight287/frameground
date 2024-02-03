"use client";

import UpVote from "@/app/tracks/[track]/challenge/[challenge]/_components/vote";
import { Markdown } from "@/components/markdown";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { upperFirst } from "@/utils";
import { fromNow } from "@/utils/time";
import { Challenge, Upvote, User } from "@repo/db/types";
import { cn } from "@repo/utils";
import React from "react";

function ChallengeDescription({
  challenge,
  params,
}: {
  challenge: Challenge & {
    authors: User[];
    upvotes: Upvote[];
    _count: { upvotes: number };
  };
  params: Record<"track" | "challenge", string>;
}) {
  return (
    <div className="overflow-scroll custom-scrollable-element p-4 max-h-screen bg-border rounded-xl rounded-t-none">
      <h1 className="text-2xl font-bold mb-2">{challenge.label}</h1>
      <div className="flex flex-row items-center justify-start gap-2">
        {challenge.authors.map((author) => (
          <Tooltip key={author}>
            <TooltipTrigger asChild>
              <a
                key={author}
                href={`/@${author}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge
                  key={author}
                  className="hover:bg-background p-0"
                  variant={"secondary"}
                >
                  @{author}
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
      <Markdown
        className={cn({
          "pb-5": !challenge.prerequisites.length,
        })}
      >
        {challenge?.info}
      </Markdown>
      <div
        className={cn({
          hidden: !challenge.prerequisites.length,
          "pt-5 pb-10": challenge.prerequisites.length > 0,
        })}
      >
        <h2 className="text-xl font-bold">Prerequisites</h2>
        <ul className="list-disc list-inside">
          {challenge.prerequisites.map((prerequisite) => (
            <li key={prerequisite}>
              <a
                href={`/tracks/${params.track}/challenge/${
                  prerequisite.split("/")[1]
                }`}
                className="text-blue-500 hover:underline"
              >
                {upperFirst(prerequisite.split("/")[1].replace(/-/g, " "))}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChallengeDescription;
