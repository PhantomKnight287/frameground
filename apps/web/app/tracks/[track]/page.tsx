import { prisma } from "@/lib/db";
import { PageProps } from "./$types";

export const dynamic = "force-dynamic"

async function Challenges({ params }: PageProps) {
  const data = await prisma.challenge.findMany({
    where: { track: { slug: params.track } },
  });
  console.log(data);
  return <div>Challenges</div>;
}

export default Challenges;
