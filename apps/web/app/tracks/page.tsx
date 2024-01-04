import { TrackCard } from "@/components/track-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { Track } from "@repo/db/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Tracks({}: { searchParams: { type?: string } }) {
  const tracks = await prisma.track.findMany({});

  return (
    <main className="flex">
      <div className="container">
        <h1 className="text-2xl font-semibold">Tracks</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {tracks.map((track) => (
            <TrackCard {...track} key={track.id} />
          ))}
        </div>
      </div>
    </main>
  );
}

function TrackCardWithLogo(track: Track) {
  return (
    <Card key={track.id} className="relative overflow-hidden">
      <CardContent className="mt-4 relative">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-xl font-medium">{track.name}</h3>
          <Avatar>
            <AvatarImage src={track.logo!} />
            <AvatarFallback>{track.name}</AvatarFallback>
          </Avatar>
        </div>
        <p className="dark:text-gray-400 mt-4 text-gray-800">
          {track.description}
        </p>
        <div className="mt-5">
          <p className="mb-2 w-full text-center text-sm dark:text-gray-400 text-gray-800">
            69+ people enrolled
          </p>
          <div className="flex flex-row items-center justify-around">
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
              href="/tracks?type=enrolled"
            >
              Enroll
            </Link>
            <Button variant={"secondary"}>View Content</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
