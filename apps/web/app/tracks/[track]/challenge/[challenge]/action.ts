"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function upvoteChallenge(
  challengeId: string,
  trackSlug: string,
  challengeSlug: string
) {
  const session = await auth();
  if (!session) {
    return { error: "not authenticated" };
  }
  const { user } = session;
  const existingUpvote = await prisma.upvote.findFirst({
    where: {
      authorId: user!.id,
      challengeId,
    },
  });
  if (existingUpvote) {
    await prisma.upvote.delete({
      where: {
        id: existingUpvote.id,
      },
    });
  } else {
    await prisma.upvote.create({
      data: {
        author: { connect: { id: user!.id } },
        challenge: { connect: { id: challengeId } },
      },
    });
  }
  revalidatePath(`/tracks/${trackSlug}/challenge/${challengeSlug}`);
}
