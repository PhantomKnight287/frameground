"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import { ChallengeFilesStructure } from "@repo/challenges/src";
import { prisma } from "@repo/db";

export async function createSolution(
  challengeSlug: string,
  title: string,
  description: string,
  files: ChallengeFilesStructure[]
) {
  const session = await auth();
  if (!session) return { message: "You are not logged in" };
  const { user } = session;

  const solution = await prisma.solution.create({
    data: {
      description,
      title,
      author: {
        connect: {
          id: user!.id,
        },
      },
      challenge: {
        connect: {
          slug: challengeSlug,
        },
      },
      files: {
        createMany: {
          data: files.map((file) => ({
            content: file.content as string,
            name: file.name as string,
          })),
        },
      },
    },
  });
  return {
    id: solution.id,
  };
}
