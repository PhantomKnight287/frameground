import { PageProps } from "./$types";
import ChallengeCard from "@/components/challenge-card";
import Link from "next/link";
import { prisma } from "@repo/db";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

async function Challenges({ params }: PageProps) {
  const session = await auth();
  const data = await prisma.challenge.findMany({
    where: {
      track: {
        slug: params.track,
      },
    },
    include: {
      authors: {
        select: {
          username: true,
          id: true,
        },
      },
      _count: {
        select: {
          comments: true,
          solvers: true,
          upvotes: true,
        },
      },
      ...(session?.user?.username
        ? {
            solvers: {
              select: {
                id: true,
              },
              where: {
                username: {
                  equals: session.user.username,
                  mode: "insensitive",
                },
              },
            },
          }
        : undefined),
    },
  });

  return (
    <main className="flex mt-12">
      <div className="container">
        <h3 className="font-semibold tracking-tight max-w-[75%] truncate text-2xl duration-300">
          Challenges
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {data?.map((challenge) => (
            <Link
              key={challenge.id}
              href={`/tracks/${params.track}/challenge/${challenge.slug}`}
              className="group snap-center focus:outline-none sm:w-[330px] xl:w-[333px]"
            >
              <ChallengeCard challenge={challenge} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Challenges;
