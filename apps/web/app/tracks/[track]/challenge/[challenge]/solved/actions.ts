"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
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
