import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TrackLogo from "@/components/track-logo";
import { getFeaturedTracks } from "@/cache/home";
import { formatNumber } from "@/utils/intl";

export async function FeaturedTracks() {
  const tracks = await getFeaturedTracks();
  if (!tracks.length) return null;

  return (
    <section className="container px-4 py-16 md:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Pick a track and start
          </h2>
          <p className="text-muted-foreground">
            Curated sequences of challenges that take you from the basics to the
            parts of a framework people actually get stuck on.
          </p>
        </div>
        <Link
          href="/tracks"
          className="group inline-flex shrink-0 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          All tracks
          <ArrowRight
            className="ml-1 size-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => (
          <li key={track.id}>
            <Link
              href={`/tracks/${track.slug}`}
              className="flex h-full flex-col rounded-lg border bg-card p-6 transition-colors hover:bg-card-hovered focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex items-center gap-3">
                {track.logo ? (
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-background p-1.5">
                    <TrackLogo
                      logo={track.logo}
                      name={track.name}
                      className="h-full w-full"
                    />
                  </div>
                ) : null}
                <h3 className="font-semibold">{track.name}</h3>
              </div>
              {track.description ? (
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                  {track.description}
                </p>
              ) : null}
              <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
                <Badge variant="secondary" className="font-normal">
                  {formatNumber(track._count.challenges)} challenges
                </Badge>
                <Badge variant="secondary" className="font-normal">
                  {formatNumber(track._count.users)} enrolled
                </Badge>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
