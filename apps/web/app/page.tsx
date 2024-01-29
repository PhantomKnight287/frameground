import Terminal from "@/assets/terminal";
import SolvedChallenge from "@/assets/solved-challenge";
import UnsolvedChallenge from "@/assets/unsolved-challenge";
import { Hero } from "@/components/hero";
import EnrollCard from "./_components/card";
import ProfileCard from "@/assets/profile";
import { Github } from "lucide-react";

export default function Home() {
  return (
    <>
      <main className="my-20">
        <Hero />
        <div className="container mt-10">
          <h1 className="text-3xl font-bold text-center mb-10">Features</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-md min-h-[330px] md:min-h-[500px] border">
              <div className="p-8 ">
                <div className="relative space-y-2">
                  <h2 className="text-xl font-bold tracking-tight md:text-xl">
                    Learning Tracks
                  </h2>
                  <p className="text-sm leading-5 text-zinc-600 dark:text-zinc-400 sm:text-base sm:leading-7">
                    Tracks are curated challenges, spanning various topics and
                    difficulty levels, to advance your skills.
                  </p>
                  <div>
                    <EnrollCard className="mx-auto" />
                    <div className="absolute w-full -bottom-20">
                      <EnrollCard />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border rounded-md overflow-hidden min-h-[330px] md:min-h-[500px] ">
              <div className="p-8">
                <div className="relative space-y-2">
                  <h2 className="text-xl font-bold tracking-tight md:text-xl">
                    Challenges
                  </h2>
                  <p className="text-sm mb-8 leading-5 text-zinc-600 dark:text-zinc-400 sm:text-base sm:leading-7">
                    Explore a plethora of challenges tailored for various web
                    frameworks, enabling you to enhance your skills across
                    different technologies seamlessly.
                  </p>
                  <div className="!mt-8">
                    <UnsolvedChallenge className="mx-auto" />
                    <div className="absolute w-full -bottom-20">
                      <SolvedChallenge />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border rounded-md overflow-hidden min-h-[330px] md:min-h-[500px] ">
              <div className="p-8">
                <div className="relative space-y-2">
                  <h2 className="text-xl font-bold tracking-tight md:text-xl">
                    Test Cases
                  </h2>
                  <p className="text-sm mb-8 leading-5 text-zinc-600 dark:text-zinc-400 sm:text-base sm:leading-7">
                    Test your code with various test cases, and get real-time
                    feedback on your code.
                  </p>
                  <Terminal width={550} height={400} />
                </div>
              </div>
            </div>
            <div className="border rounded-md overflow-hidden min-h-[330px] md:min-h-[500px] ">
              <div className="p-8">
                <div className="relative space-y-2">
                  <h2 className="text-xl font-bold tracking-tight md:text-xl">
                    Profile
                  </h2>
                  <p className="text-sm mb-8 leading-5 text-zinc-600 dark:text-zinc-400 sm:text-base sm:leading-7">
                    Track your progress, and view your completed challenges.
                  </p>
                  <ProfileCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="flex flex-col items-center gap-2 px-8 pb-12 text-sm font-light sm:px-16 sm:pb-20 sm:pt-6 md:px-0 md:py-12 border-t">
        <div className="container flex flex-col-reverse justify-between gap-2 md:flex-row md:items-end">
          <span>Made by PhantomKnight287</span>
          <div className="flex items-center gap-2">
            <a
              target="_blank"
              rel="noreferrer"
              className="group rounded-lg p-2"
              href="https://github.com/phantomknight287/frameground"
            >
              <span className="sr-only">PhantomKnight287</span>
              <Github className="h-5 w-5 duration-150 group-hover:scale-110 group-hover:fill-black dark:group-hover:fill-white" />
            </a>
          </div>
        </div>
        <div className="container flex flex-col justify-between gap-2 text-neutral-500 dark:text-neutral-400  md:flex-row md:items-end">
          <span>
            <div className="inline-block rotate-180">©</div>
            {new Date().getFullYear()} FrameGround
          </span>
        </div>
      </footer>
    </>
  );
}
