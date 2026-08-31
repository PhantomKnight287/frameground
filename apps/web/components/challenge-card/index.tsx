import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn } from "@/lib/utils";
import { Challenge } from "@repo/db/types";
import { upperFirst } from "@/utils";
import { BadgeCheck, MessageCircle, ThumbsUp, User2 } from "lucide-react";

dayjs.extend(relativeTime);

const difficultyBadge: Record<string, string> = {
  beginner:
    "border-difficulty-beginner text-difficulty-beginner dark:border-difficulty-beginner-dark dark:text-difficulty-beginner-dark",
  easy: "border-difficulty-easy text-difficulty-easy dark:border-difficulty-easy-dark dark:text-difficulty-easy-dark",
  medium:
    "border-difficulty-medium text-difficulty-medium dark:border-difficulty-medium-dark dark:text-difficulty-medium-dark",
  hard: "border-difficulty-hard text-difficulty-hard dark:border-difficulty-hard-dark dark:text-difficulty-hard-dark",
  extreme:
    "border-difficulty-extreme text-difficulty-extreme dark:border-difficulty-extreme-dark dark:text-difficulty-extreme-dark",
};

function ChallengeCard({
  challenge,
}: {
  challenge: Challenge & {
    authors: string[];
    solvesCount: BigInt;
    upvotesCount: BigInt;
    commentsCount: BigInt;
    solved?: string;
  };
}) {
  const solved = Boolean(parseInt(challenge.solved || "0"));
  return (
    <div className="relative h-full">
      <div className="absolute -top-2 -right-1 z-10 rounded-full bg-background">
        {solved ? <BadgeCheck className="text-green-500" size={25} /> : null}
      </div>
      <Card
        className={cn(
          "text-card-foreground flex h-full flex-col rounded-3xl border shadow-sm group/card bg-background hover:bg-card-hovered relative overflow-hidden duration-300",
          {
            "shadow-inner group-focus:shadow-beginner dark:hover:shadow-beginner-dark dark:group-focus:shadow-beginner-dark dark:hover:border-difficulty-beginner-dark hover:border-difficulty-beginner dark:group-focus:border-difficulty-beginner-dark group-focus:border-difficulty-beginner hover:shadow-beginner":
              challenge.difficulty === "beginner",
            "shadow-inner group-focus:shadow-easy dark:hover:shadow-easy-dark dark:group-focus:shadow-easy-dark dark:hover:border-difficulty-easy-dark hover:border-difficulty-easy dark:group-focus:border-difficulty-easy-dark group-focus:border-difficulty-easy hover:shadow-easy":
              challenge.difficulty === "easy",
            "shadow-inner group-focus:shadow-medium dark:hover:shadow-medium-dark dark:group-focus:shadow-medium-dark dark:hover:border-difficulty-medium-dark hover:border-difficulty-medium dark:group-focus:border-difficulty-medium-dark group-focus:border-difficulty-medium hover:shadow-medium":
              challenge.difficulty === "medium",
            "shadow-inner group-focus:shadow-hard dark:hover:shadow-hard-dark dark:group-focus:shadow-hard-dark dark:hover:border-difficulty-hard-dark hover:border-difficulty-hard dark:group-focus:border-difficulty-hard-dark group-focus:border-difficulty-hard hover:shadow-hard":
              challenge.difficulty === "hard",
            "shadow-inner group-focus:shadow-extreme dark:hover:shadow-extreme-dark dark:group-focus:shadow-extreme-dark dark:hover:border-difficulty-extreme-dark hover:border-difficulty-extreme dark:group-focus:border-difficulty-extreme-dark group-focus:border-difficulty-extreme hover:shadow-extreme":
              challenge.difficulty === "extreme",
          }
        )}
      >
        <div className="flex h-full flex-col p-3">
          <CardHeader className="pb-0 pt-4">
            <div className="flex flex-row items-start gap-2">
              <CardTitle className="h-fit line-clamp-1">
                {challenge.label}
              </CardTitle>
              <Badge
                variant="outline"
                className={cn(
                  "ml-auto shrink-0 bg-background",
                  difficultyBadge[challenge.difficulty]
                )}
              >
                {upperFirst(challenge.difficulty)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4 py-4">
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {challenge.description}
            </p>
            <div className="flex flex-row flex-wrap items-center gap-2 text-sm">
              {challenge.authors.map((author) => (
                <Badge
                  variant={"secondary"}
                  key={author}
                  className="flex flex-row items-center"
                >
                  {author}
                </Badge>
              ))}
              <span className="line-clamp-1 text-sm text-muted-foreground">
                {dayjs(challenge.createdAt).fromNow()}
              </span>
            </div>
            <div className="mt-auto flex flex-row items-center gap-4 border-t pt-3 text-sm text-muted-foreground">
              <span
                className="flex flex-row items-center gap-2"
                title="Upvotes"
              >
                <ThumbsUp size={16} />
                {challenge.upvotesCount?.toString()}
              </span>
              <span
                className="flex flex-row items-center gap-2"
                title="Comments"
              >
                <MessageCircle size={16} />
                {challenge.commentsCount?.toString()}
              </span>
              <span className="flex flex-row items-center gap-2" title="Solves">
                <User2 size={16} />
                {challenge.solvesCount?.toString()}
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

export default ChallengeCard;
