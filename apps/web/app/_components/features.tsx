import { ReactNode } from "react";
import {
  TracksIllustration,
  ChallengesIllustration,
  TestsIllustration,
  ProfileIllustration,
} from "./feature-illustrations";

/**
 * Each feature is a card with a bounded preview area underneath. The preview is
 * clipped and faded at the bottom, so illustrations can overflow their frame
 * deliberately instead of being cut off by a hard edge.
 */
function Feature({
  title,
  children,
  preview,
}: {
  title: string;
  children: ReactNode;
  preview: ReactNode;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card">
      <div className="space-y-2 p-6 md:p-8">
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        <p className="text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {children}
        </p>
      </div>
      <div className="h-[200px] shrink-0 px-6 md:px-8 [mask-image:linear-gradient(to_bottom,black_65%,transparent)]">
        <div aria-hidden="true">{preview}</div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section className="container px-4 py-16 md:px-6">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
        What&apos;s inside
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Feature title="Learning tracks" preview={<TracksIllustration />}>
          Curated sequences of challenges that build on each other, so you always
          know what to attempt next.
        </Feature>

        <Feature title="Challenges" preview={<ChallengesIllustration />}>
          Problems spanning every difficulty, written for the frameworks you
          actually ship with.
        </Feature>

        <Feature title="Real test runs" preview={<TestsIllustration />}>
          Jest and Vitest run against your code in the browser and tell you
          exactly which assertion broke.
        </Feature>

        <Feature title="Your profile" preview={<ProfileIllustration />}>
          Every solve is recorded - track your streak, revisit past work, and
          publish your solutions.
        </Feature>
      </div>
    </section>
  );
}
