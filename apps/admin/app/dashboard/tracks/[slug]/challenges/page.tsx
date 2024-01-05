import { prisma } from "@repo/db";
import { redirect } from "next/navigation";

async function Challenges({ params }: { params: { slug: string } }) {
  const track = await prisma.track.findUnique({
    where: { slug: params.slug },
  });
  if (!track) redirect("/dashboard/tracks");
  const challenges = await prisma.challenge.findMany({
    where: { trackId: track.id },
  });
  return (
    <div className="container">
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis ipsa error
      assumenda. Incidunt quia sapiente libero blanditiis ratione dolor optio.
    </div>
  );
}

export default Challenges;
