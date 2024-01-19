import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { cn } from "@/lib/utils";
import { Challenge, User } from "@repo/db/types";
import { upperFirst } from "@/utils";

dayjs.extend(relativeTime);

function ChallengeCard({
  challenge,
}: {
  challenge: Challenge & { authors: Pick<User, "id" | "username">[] };
}) {
  return (
    <Card
      className={cn(
        "text-card-foreground rounded-3xl border shadow-sm group/card bg-background hover:bg-card-hovered relative overflow-hidden duration-300 sm:min-w-[300px] xl:min-w-[333px] ",
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
      <div className="p-3">
        <CardHeader className="pb-0 pt-4">
          <div className="flex flex-row items-start">
            <CardTitle className="h-fit line-clamp-1">
              {challenge.label}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 py-4">
          <Badge className="max-w-fit">
            {upperFirst(challenge.difficulty)}
          </Badge>
          <div className="flex flex-row items-center justify-start text-sm">
            <div className="flex flex-row flex-wrap">
              {challenge.authors.map((author) => (
                <a
                  href={`/@${author.username}`}
                  className="mr-2 flex flex-row items-center"
                  key={author.id}
                >
                  <Badge variant={"secondary"}>{author.username}</Badge>
                </a>
              ))}
            </div>
            <div className="flex flex-row items-center text-sm text-muted-foreground">
              {dayjs(challenge.createdAt).fromNow()}
            </div>
          </div>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {challenge.description}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}

export default ChallengeCard;
