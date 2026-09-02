import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@repo/config";

export function CallToAction() {
  return (
    <section className="border-t bg-muted/30">
      <div className="container flex flex-col items-center gap-6 px-4 py-16 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Ready to write some code?
          </h2>
          <p className="mx-auto max-w-[560px] text-muted-foreground">
            Sign in with GitHub, enroll in a track, and solve your first
            challenge in the next ten minutes.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 min-[400px]:flex-row">
          <Button asChild size="lg">
            <Link href="/tracks">
              Browse tracks
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={siteConfig.urls.github} target="_blank" rel="noreferrer">
              <FaGithub className="mr-2 size-4" aria-hidden="true" />
              Star on GitHub
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
