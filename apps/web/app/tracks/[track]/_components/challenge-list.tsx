"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, SearchX } from "lucide-react";
import ChallengeCard from "@/components/challenge-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { upperFirst } from "@/utils";

export type ListChallenge = {
  id: string;
  slug: string;
  label: string;
  description: string;
  difficulty: string;
  authors: string[];
  prerequisites: string[];
  createdAt: string;
  solvesCount: number;
  upvotesCount: number;
  commentsCount: number;
  solved: string;
};

const DIFFICULTIES = ["beginner", "easy", "medium", "hard", "extreme"] as const;

function ChallengeList({
  challenges,
  track,
}: {
  challenges: ListChallenge[];
  track: string;
}) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [hideSolved, setHideSolved] = useState(false);

  const available = useMemo(
    () => new Set(challenges.map((challenge) => challenge.difficulty)),
    [challenges]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return challenges.filter((challenge) => {
      if (difficulty && challenge.difficulty !== difficulty) return false;
      if (hideSolved && parseInt(challenge.solved || "0")) return false;
      if (!q) return true;
      return (
        challenge.label.toLowerCase().includes(q) ||
        challenge.description.toLowerCase().includes(q)
      );
    });
  }, [challenges, query, difficulty, hideSolved]);

  return (
    <section className="mt-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Challenges</h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {challenges.length} challenges
          </p>
        </div>
        <div className="relative w-full lg:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search challenges..."
            className="rounded-full pl-9"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <FilterChip active={!difficulty} onClick={() => setDifficulty(null)}>
          All
        </FilterChip>
        {DIFFICULTIES.filter((level) => available.has(level)).map((level) => (
          <FilterChip
            key={level}
            active={difficulty === level}
            onClick={() => setDifficulty(difficulty === level ? null : level)}
          >
            {upperFirst(level)}
          </FilterChip>
        ))}
        <FilterChip
          active={hideSolved}
          onClick={() => setHideSolved(!hideSolved)}
          className="ml-auto"
        >
          Hide solved
        </FilterChip>
      </div>

      {filtered.length ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((challenge) => (
            <Link
              key={challenge.id}
              href={`/tracks/${track}/challenge/${challenge.slug}`}
              className="group h-full snap-center focus:outline-none"
            >
              <ChallengeCard challenge={challenge as any} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-3xl border border-dashed py-16 text-center">
          <SearchX className="text-muted-foreground" size={28} />
          <p className="font-medium">No challenges found</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Try a different search term or clear the filters to see everything
            in this track.
          </p>
        </div>
      )}
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  className,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-transparent bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

export default ChallengeList;
