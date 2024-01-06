import { prisma } from "@/lib/db";
import { PageProps } from "./$types";
import { getModuleDir } from "@/utils/path";
import { getChallenges } from "@repo/challenges/src/challenge";

export const dynamic = "force-dynamic";

async function Challenges({ params }: PageProps) {
  const data = await getChallenges(params.track);
  console.log(data);
  return <div>Challenges</div>;
}

export default Challenges;
