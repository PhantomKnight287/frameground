import { TrackCard } from "@/components/track-card";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Tracks({}: { searchParams: { type?: string } }) {
  const tracks = await prisma.track.findMany({});

  return (
    <main className="flex mt-12">
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
