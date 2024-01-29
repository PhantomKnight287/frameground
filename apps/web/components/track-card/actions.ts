"use server";

import { auth } from "@/auth";
import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function EnrollOrLeave(track: string, enrolled?: boolean) {
  const session = await auth();
  if (!session) return;
  const { user } = session;
  if (enrolled) {
    await prisma.track.update({
      where: { slug: track },
      data: {
        users: {
          disconnect: {
            id: user!.id,
          },
        },
      },
    });
    revalidatePath(`/tracks`);
    return;
  }
  await prisma.track.update({
    where: { slug: track },
    data: {
      users: {
        connect: {
          id: user!.id,
        },
      },
    },
  });
  revalidatePath(`/tracks`);
}
