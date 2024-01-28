"use server";

import { z } from "zod";
import { auth } from "../api/auth/[...nextauth]/route";
import { prisma } from "@repo/db";

const updateBioSchema = z.object({
  bio: z.string().nullable(),
});

export async function UpdateBio(prev: any, current: FormData) {
  const session = await auth();
  if (!session)
    return {
      error: "Not Logged In",
    };
  const parsed = updateBioSchema.safeParse({ bio: current.get("bio") });
  if (!parsed.success)
    return {
      error: "Invalid Request",
    };
  const { user } = session;

  await prisma.user.update({
    where: {
      id: user!.id,
    },
    data: {
      bio: parsed.data.bio,
    },
  });
  return {
    message: "Profile Updated",
  };
}
