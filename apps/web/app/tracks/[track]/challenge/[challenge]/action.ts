"use server";

import { auth } from "@/auth";
import { prisma } from "@repo/db";
import { revalidatePath, revalidateTag } from "next/cache";

export async function upvoteChallenge(
  challengeId: string,
  trackSlug: string,
  challengeSlug: string
) {
  const session = await auth();
  if (!session) {
    return { error: "You must be logged in to upvote a challenge" };
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
  revalidateTag(`challenge-${trackSlug}-${user!.id}`);
  console.log(`challenge-${trackSlug}-${user!.id}`);
}

export async function attemptChallenge(challengeId: string, output: string) {
  const session = await auth();
  if (!session) {
    return { error: "You must be logged in to attempt a challenge" };
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
  if (!output)
    return {
      error: "no output provided",
    };
  const session = await auth();
  if (!session) {
    return { error: "You must be logged in to solve a challenge" };
  }
  const { user } = session;
  const _tx = await prisma.$transaction(async (tx) => {
    const solved = await tx.challenge.update({
      where: { id: challengeId },
      data: {
        solves: { create: { userId: user!.id, type: "accepted", output } },
      },
      select: { trackId: true, slug: true, track: { select: { slug: true } } },
    });
    if (enrollInTrack) {
      await tx.track.update({
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
  revalidateTag(`user::challenges::${user?.username}`);
  revalidateTag(`profile::${user?.username}`);
  revalidateTag(`user::solves::${user?.id}`);

  return {
    url: `/tracks/${_tx.track?.slug}/challenge/${_tx.slug}/solved`,
  };
}
