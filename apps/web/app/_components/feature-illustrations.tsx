import { BadgeCheck, Check, Circle, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TrackLogo from "@/components/track-logo";
import { difficultyBadge } from "@/components/challenge-card";
import { cn } from "@/lib/utils";

/**
 * Static, non-interactive previews of real product surfaces. They deliberately
 * reuse the same primitives and tokens as the live UI (difficulty badges, card
 * chrome, the track logo) so the homepage never drifts from what people
 * actually land on - and so they follow the theme instead of baking in colors.
 */

/** A slice of the tracks page: the enrolled card with progress, and the next one up. */
export function TracksIllustration() {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border bg-background p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background p-1.5">
            <TrackLogo
              logo="/tracks/react.svg"
              name="React"
              className="h-full w-full"
            />
          </div>
          <span className="font-semibold">React</span>
          <Badge variant="secondary" className="ml-auto font-normal">
            Enrolled
          </Badge>
        </div>
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span className="tabular-nums">7 / 24</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[29%] rounded-full bg-foreground" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-background p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="size-9 shrink-0 rounded-lg border bg-muted" />
          <span className="font-semibold text-muted-foreground">Next.js</span>
          <Button
            size="sm"
            variant="outline"
            tabIndex={-1}
            className="ml-auto pointer-events-none"
          >
            Enroll
          </Button>
        </div>
      </div>
    </div>
  );
}

/** A slice of a track's challenge list - difficulty spread and solved state. */
const challenges = [
  { label: "Render a list", difficulty: "beginner", solved: true },
  { label: "Controlled inputs", difficulty: "easy", solved: true },
  { label: "Custom hooks", difficulty: "medium", solved: false },
  { label: "Suspense boundaries", difficulty: "hard", solved: false },
];

export function ChallengesIllustration() {
  return (
    <div className="divide-y overflow-hidden rounded-xl border bg-background shadow-sm">
      {challenges.map((challenge) => (
        <div
          key={challenge.label}
          className="flex items-center gap-3 px-4 py-3 text-sm"
        >
          {challenge.solved ? (
            <BadgeCheck className="size-4 shrink-0 text-success" />
          ) : (
            <Circle className="size-4 shrink-0 text-muted-foreground/40" />
          )}
          <span
            className={cn(
              "truncate",
              challenge.solved && "text-muted-foreground"
            )}
          >
            {challenge.label}
          </span>
          <Badge
            variant="outline"
            className={cn(
              "ml-auto shrink-0 bg-background font-normal capitalize",
              difficultyBadge[challenge.difficulty]
            )}
          >
            {challenge.difficulty}
          </Badge>
        </div>
      ))}
    </div>
  );
}

/** The test panel: what you see after a run, not the command that started it. */
const tests = [
  { name: "renders the initial count", ms: 4 },
  { name: "increments on click", ms: 7 },
  { name: "resets to zero", ms: 3 },
];

export function TestsIllustration() {
  return (
    <div className="overflow-hidden rounded-xl border bg-background font-mono text-xs shadow-sm">
      <div className="flex items-center gap-2 border-b px-4 py-2.5">
        <span className="rounded bg-success px-1.5 py-0.5 font-bold text-success-foreground">
          PASS
        </span>
        <span className="truncate text-muted-foreground">counter.test.tsx</span>
      </div>
      <div className="space-y-2 p-4">
        {tests.map((test) => (
          <div key={test.name} className="flex items-center gap-2">
            <Check className="size-3.5 shrink-0 text-success" />
            <span className="truncate text-muted-foreground">{test.name}</span>
            <span className="ml-auto shrink-0 text-muted-foreground/60 tabular-nums">
              {test.ms}ms
            </span>
          </div>
        ))}
        <div className="flex gap-4 border-t pt-3">
          <span className="font-semibold">Tests</span>
          <span className="text-success">3 passed</span>
          <span className="text-muted-foreground">3 total</span>
        </div>
      </div>
    </div>
  );
}

/**
 * The profile: identity, counters, and the solve grid. The grid pattern is a
 * fixed bitmap rather than a random one so the markup is stable between
 * renders.
 */
const solveGrid = [
  0, 1, 0, 2, 3, 1, 0, 2, 0, 3, 2, 1, 0, 0, 1, 3, 2, 0, 1, 2, 3, 3, 1, 0, 2, 1,
  0, 3, 2, 2, 1, 0, 3, 1, 2, 0, 0, 2, 3, 1, 1, 3, 0, 2, 0, 1, 2, 3,
];

const gridShade = [
  "bg-muted",
  "bg-success/30",
  "bg-success/60",
  "bg-success",
] as const;

export function ProfileIllustration() {
  return (
    <div className="rounded-xl border bg-background p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
          PK
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold">@phantomknight287</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Flame className="size-3" aria-hidden="true" />9 day streak
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-6 border-t pt-3 text-sm">
        <p>
          <span className="font-semibold tabular-nums">24</span>{" "}
          <span className="text-muted-foreground">solved</span>
        </p>
        <p>
          <span className="font-semibold tabular-nums">3</span>{" "}
          <span className="text-muted-foreground">solutions</span>
        </p>
      </div>

      <div
        className="mt-4 grid grid-flow-col grid-rows-4 gap-1"
        aria-hidden="true"
      >
        {solveGrid.map((level, i) => (
          <div
            key={i}
            className={cn("size-2.5 rounded-[3px]", gridShade[level])}
          />
        ))}
      </div>
    </div>
  );
}
