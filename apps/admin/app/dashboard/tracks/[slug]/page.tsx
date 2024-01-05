import { prisma } from "@repo/db";
import { redirect } from "next/navigation";
import UpdateTrack from "./page.client";

async function Track({ params }: { params: { slug: string } }) {
  const track = await prisma.track.findUnique({
    where: { slug: params.slug },
  });
  if (!track) redirect("/dashboard/tracks");
  return (
    <div className="container">
      <UpdateTrack track={track} />
    </div>
  );
}

export default Track;
