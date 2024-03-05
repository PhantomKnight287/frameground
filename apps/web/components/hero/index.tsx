import Link from "next/link";
import { CreateAppAnimation } from "./index.client";
import { Badge } from "../ui/badge";
import { Github } from "lucide-react";
import { getGithubStars } from "@/cache/stars";
import { siteConfig } from "@repo/config";

export async function Hero() {
  const githubStars = await getGithubStars();
  return (
    <section className="w-full py-12">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <div className="w-full flex">
                {githubStars != null ? (
                  <Link
                    href={siteConfig.urls.github}
                    target="_blank"
                    rel="noreferrer"
                    className="mx-auto lg:mx-0"
                  >
                    <Badge
                      aria-hidden="true"
                      className="rounded-md px-3.5 py-1.5"
                      variant="secondary"
                    >
                      <Github className="mr-2 size-3.5" aria-hidden="true" />
                      {githubStars} stars on GitHub
                    </Badge>
                    <span className="sr-only">GitHub</span>
                  </Link>
                ) : null}
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-center lg:text-left">
                Learn JavaScript frameworks with interactive challenges
              </h1>
              <p className="lg:max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 text-center lg:text-left">
                Dive into React, Next.js and more. Write code, run tests, and
                watch your progress in real time.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row items-center justify-center lg:justify-start">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="/tracks"
              >
                Get Started
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200  bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                href="/tracks"
              >
                Explore Tracks
              </Link>
            </div>
          </div>
          <CreateAppAnimation />
        </div>
      </div>
    </section>
  );
}
