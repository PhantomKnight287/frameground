"use server";

import { auth } from "@/auth";
import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const zodSchema = z.object({
  challengeId: z.string().cuid(),
  content: z.string().min(1),
  trackId: z.string().cuid(),
});

export async function createComment(prev: any, data: FormData) {
  const session = await auth();
  if (!session) {
    return { error: "not authenticated" };
  }
  const parsed = zodSchema.safeParse({
    challengeId: data.get("challengeId"),
    content: data.get("content"),
    trackId: data.get("trackId"),
  });
  if (!parsed.success) {
    return { error: parsed.error.message };
  }
  const { challengeId, content, trackId } = parsed.data;
  const { user } = session;
  const comment = await prisma.comment.create({
    data: {
      content,
      challengeId,
      authorId: user!.id,
      trackId: trackId,
    },
    include: {
      track: true,
      challenge: true,
    },
  });
  revalidatePath(
    `/tracks/${comment.track!.slug}/challenge/${comment.challenge!.slug}/solved`
  );
  return { id: comment.id };
}

export async function deleteComment(commentId: string) {
  // check if user is the author of the comment
  const session = await auth();
  if (!session) {
    return { error: "not authenticated" };
  }
  const { user } = session;
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
      authorId: user!.id,
    },
    include: {
      track: true,
      challenge: true,
    },
  });
  if (!comment) {
    return { error: "You are not the author of this comment" };
  }
  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
  revalidatePath(
    `/tracks/${comment.track!.slug}/challenge/${comment.challenge!.slug}/solved`
  );
  return { success: true };
}

const zodReportSchema = z.object({
  commentId: z.string().cuid(),
  reason: z.string().min(1),
});

export async function reportComment(prev: any, data: FormData) {
  const session = await auth();
  if (!session) {
    return { error: "not authenticated" };
  }
  const parsed = zodReportSchema.safeParse({
    commentId: data.get("commentId"),
    reason: data.get("reason"),
  });
  if (!parsed.success) {
    return { error: parsed.error.message };
  }
  const { commentId, reason } = parsed.data;
  const { user } = session;
  const report = await prisma.report.create({
    data: {
      content: reason,
      commentId,
      authorId: user!.id,
    },
    include: {
      comment: {
        include: {
          track: true,
          challenge: true,
        },
      },
    },
  });
  revalidatePath(
    `/tracks/${report.comment!.track!.slug}/challenge/${
      report.comment!.challenge!.slug
    }/solved`
  );
  return { id: report.id };
}
