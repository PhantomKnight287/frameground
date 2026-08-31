"use client";

import UpVote from "@/app/tracks/[track]/challenge/[challenge]/_components/vote";
import { Markdown } from "@/components/markdown";
import { upperFirst } from "@/utils";
import { fromNow } from "@/utils/time";
import { Challenge, Upvote, User } from "@repo/db/types";
import { cn } from "@repo/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const difficultyStyles: Record<string, string> = {
  beginner:
    "border-difficulty-beginner/40 text-difficulty-beginner dark:border-difficulty-beginner-dark/40 dark:text-difficulty-beginner-dark",
  easy: "border-difficulty-easy/40 text-difficulty-easy dark:border-difficulty-easy-dark/40 dark:text-difficulty-easy-dark",
  medium:
    "border-difficulty-medium/40 text-difficulty-medium dark:border-difficulty-medium-dark/40 dark:text-difficulty-medium-dark",
  hard: "border-difficulty-hard/40 text-difficulty-hard dark:border-difficulty-hard-dark/40 dark:text-difficulty-hard-dark",
  extreme:
    "border-difficulty-extreme/40 text-difficulty-extreme dark:border-difficulty-extreme-dark/40 dark:text-difficulty-extreme-dark",
};

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
    <div className="custom-scrollable-element max-h-screen overflow-y-auto bg-card">
      <header className="sticky top-0 z-10 border-b bg-card/95 px-5 py-4 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            {challenge.label}
          </h1>
          <UpVote challenge={challenge} params={params} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
              difficultyStyles[challenge.difficulty]
            )}
          >
            {upperFirst(challenge.difficulty)}
          </span>
          {challenge.authors.map((author) => (
            <a
              key={author as unknown as string}
              href={`/@${author}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground hover:underline"
            >
              @{author as unknown as string}
            </a>
          ))}
          <span aria-hidden>•</span>
          <span>{fromNow(challenge.createdAt)}</span>
        </div>
      </header>

      <div className="px-5 py-4">
        {challenge.prerequisites.length ? (
          <section className="mb-6 rounded-xl border bg-muted/40 p-4">
            <h2 className="text-sm font-semibold">Before you start</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This challenge builds on{" "}
              {challenge.prerequisites.length === 1
                ? "another challenge"
                : "these challenges"}
              .
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {challenge.prerequisites.map((prerequisite) => {
                // a prerequisite is stored as `<track>/<challenge>` and may
                // well live in another track than the one being solved
                const [track, slug] = prerequisite.split("/");
                return (
                  <li key={prerequisite}>
                    <Link
                      href={`/tracks/${track}/challenge/${slug}`}
                      className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1 text-sm transition-colors hover:border-foreground/30 hover:bg-accent"
                    >
                      {upperFirst(slug.replace(/-/g, " "))}
                      <ArrowUpRight size={14} className="text-muted-foreground" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <Markdown className="pb-10">{challenge?.info}</Markdown>
      </div>
    </div>
  );
}

export default ChallengeDescription;
