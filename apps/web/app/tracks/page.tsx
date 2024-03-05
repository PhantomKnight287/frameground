import { auth } from "@/auth";
import { TrackCard } from "@/components/track-card";
import { prisma } from "@/lib/db";
import { Metadata, Viewport } from "next";
import { env } from "@/env.mjs";
import { getCachedTracks } from "@/cache/tracks";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(env.HOST),
  title: "Tracks",
  description:
    "Explore a plethora of tracks tailored for various web frameworks, enabling you to enhance your skills across different technologies seamlessly.",
  openGraph: {
    type: "website",
    title: "Tracks",
    description:
      "Explore a plethora of tracks tailored for various web frameworks, enabling you to enhance your skills across different technologies seamlessly.",
    url: `${env.HOST}/tracks`,
    images: [
      {
        url: `${env.HOST}/api/og/tracks`,
        width: 1200,
        height: 600,
        alt: "Tracks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@gurpalsingh287",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function Tracks({}: { searchParams: { type?: string } }) {
  const session = await auth();
  const tracks = await getCachedTracks(session?.user?.id);

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
