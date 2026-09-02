import Link from "next/link";
import { CreateAppAnimation } from "./index.client";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import { getGithubStars } from "@/cache/stars";
import { getHomeStats } from "@/cache/home";
import { formatNumber } from "@/utils/intl";
import { siteConfig } from "@repo/config";

export async function Hero() {
  const [githubStars, stats] = await Promise.all([
    getGithubStars(),
    getHomeStats(),
  ]);

  return (
    <section className="w-full py-10 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <div className="flex w-full justify-center lg:justify-start">
                {githubStars != null ? (
                  <Link
                    href={siteConfig.urls.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Badge
                      className="rounded-full px-3.5 py-1.5 font-normal"
                      variant="secondary"
                    >
                      <FaGithub className="mr-2 size-3.5" aria-hidden="true" />
                      {formatNumber(githubStars)} stars on GitHub
                    </Badge>
                    <span className="sr-only">
                      FrameGround on GitHub, {githubStars} stars
                    </span>
                  </Link>
                ) : null}
              </div>
              <h1 className="text-center text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none lg:text-left">
                Learn JavaScript frameworks by{" "}
                <span className="text-muted-foreground">actually building</span>
              </h1>
              <p className="text-center text-lg text-muted-foreground md:text-xl lg:max-w-[600px] lg:text-left">
                React, Next.js and more - in a real editor, in your browser. No
                setup, no video to scrub through. Write the code, run the tests,
                see it pass.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-3 min-[400px]:flex-row lg:justify-start">
              <Button asChild size="lg" className="w-full min-[400px]:w-auto">
                <Link href="/tracks">
                  Start a track
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full min-[400px]:w-auto"
              >
                <Link href="/solutions">Browse solutions</Link>
              </Button>
            </div>
            {stats ? (
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t pt-6 text-sm lg:justify-start">
                <Stat singular="challenge" value={stats.challenges} />
                <Stat singular="track" value={stats.tracks} />
                <Stat singular="challenge solved" plural="challenges solved" value={stats.solves} />
                <Stat singular="developer" value={stats.builders} />
              </div>
            ) : null}
          </div>
          <CreateAppAnimation />
        </div>
      </div>
    </section>
  );
}

function Stat({
  singular,
  plural = `${singular}s`,
  value,
}: {
  singular: string;
  plural?: string;
  value: number;
}) {
  // A counter still sitting at zero says nothing worth saying.
  if (value === 0) return null;

  return (
    <p className="flex items-baseline gap-1.5">
      <span className="text-base font-semibold tabular-nums">
        {formatNumber(value)}
      </span>
      <span className="text-muted-foreground">
        {value === 1 ? singular : plural}
      </span>
    </p>
  );
}
