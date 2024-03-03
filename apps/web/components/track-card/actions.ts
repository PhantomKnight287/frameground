"use server";

import { auth } from "@/auth";
import { prisma } from "@repo/db";
import { revalidatePath, revalidateTag } from "next/cache";

export async function EnrollOrLeave(track: string, enrolled?: boolean) {
  const session = await auth();
  if (!session) return { error: "You must be logged in to enroll in a track." };
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
    revalidateTag(`profile::${user?.username}`);
    revalidateTag(`user::tracks::${user?.username}`);
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
  revalidateTag(`profile::${user?.username}`);
  revalidateTag(`user::tracks::${user?.username}`);

  revalidatePath(`/tracks`);
}
