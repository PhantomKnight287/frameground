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

export async function attemptChallenge(challengeId: string, output: string) {
  const session = await auth();
  if (!session) {
    return { error: "not authenticated" };
  }
  const { user } = session;
  const attempt = await prisma.solves.create({
    data: {
      type: "failed",
      output,
      challengeId,
      userId: user!.id,
    },
  });
  return { id: attempt.id };
}

export async function solveChallenge(
  challengeId: string,
  enrollInTrack: boolean,
  output: string
) {
  const session = await auth();
  if (!session) {
    return { error: "not authenticated" };
  }
  const { user } = session;
  const _tx = await prisma.$transaction(async (tx) => {
    const solved = await tx.challenge.update({
      where: { id: challengeId },
      data: {
        solves: { create: { userId: user!.id } },
      },
      select: { trackId: true, slug: true, track: { select: { slug: true } } },
    });
    await tx.solves.create({
      data: {
        type: "accepted",
        output,
        challengeId,
        userId: user!.id,
      },
    });
    if (enrollInTrack) {
      await prisma.track.update({
        where: { id: solved.trackId as string },
        data: {
          users: {
            connect: {
              username: user!.username,
            },
          },
        },
      });
    }
    return solved;
  });
  return {
    url: `/tracks/${_tx.track?.slug}/challenge/${_tx.slug}/solved`,
  };
}
