"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function solveChallenge(
  challengeId: string,
  enrollInTrack: boolean
) {
  const session = await auth();
  if (!session) {
    return { error: "not authenticated" };
  }
  const { user } = session;
  const existingSolved = await prisma.challenge.findFirst({
    where: { id: challengeId, solvers: { some: { id: user!.id } } },
    select: { track: { select: { slug: true } }, slug: true, trackId: true },
  });
  if (existingSolved) {
    redirect(
      `/tracks/${existingSolved.track?.slug}/challenge/${existingSolved.slug}/solved`
    );
  }
  const _tx = await prisma.$transaction(async (tx) => {
    const solved = await tx.challenge.update({
      where: { id: challengeId },
      data: {
        solvers: { connect: { username: user!.username } },
      },
      select: { trackId: true, slug: true, track: { select: { slug: true } } },
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
  redirect(`/tracks/${_tx.track?.slug}/challenge/${_tx.slug}/solved`);
}
