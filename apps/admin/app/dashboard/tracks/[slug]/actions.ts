"use server";
import { auth } from "@/auth";
import { assertAdmin } from "@/utils/auth";
import { prisma } from "@repo/db";
import { TrackStatus } from "@repo/db/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";
const updateTrackSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  slug: z.string().min(3),
  logo: z.string().min(3).url(),
  status: z.nativeEnum(TrackStatus),
  id: z.string(),
});

export async function updateTrack(prev: any, formData: FormData) {
  const data = updateTrackSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    slug: formData.get("slug"),
    logo: formData.get("logo"),
    status: formData.get("status"),
    id: formData.get("id"),
  });
  if (data.success === false) {
    return {
      message: `${data.error.issues[0].path}:${data.error.issues[0].message}`,
    };
  }
  const { name, description, slug, logo, status, id } = data.data;
  const session = await auth();
  if (assertAdmin(session) === false) {
    return { message: "Unauthorized" };
  }
  const updatedTrack = await prisma.track.update({
    where: { id },
    data: { name, description, slug, logo, status },
  });
  revalidatePath(`/dashboard/tracks/${updatedTrack.slug}`);
  revalidatePath(`/dashboard/tracks`);
}

const createTrackSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  slug: z.string().min(3),
  logo: z.string().min(3).url(),
  status: z.nativeEnum(TrackStatus),
});

export async function createTrack(prev: any, formData: FormData) {
  const data = createTrackSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    slug: formData.get("slug"),
    logo: formData.get("logo"),
    status: formData.get("status"),
  });
  if (data.success === false) {
    return {
      message: `${data.error.issues[0].path}:${data.error.issues[0].message}`,
    };
  }
  const { name, description, slug, logo, status } = data.data;
  const session = await auth();
  if (assertAdmin(session) === false) {
    return { message: "Unauthorized" };
  }
  const updatedTrack = await prisma.track.create({
    data: { name, description, slug, logo, status },
  });
  revalidatePath(`/dashboard/tracks/${updatedTrack.slug}`);
  revalidatePath(`/dashboard/tracks`);
}

export async function deleteTrack(id: string) {
  const session = await auth();
  if (assertAdmin(session) === false) {
    return { message: "Unauthorized" };
  }
  if (!id || typeof id !== "string") {
    return { message: "Invalid id" };
  }
  const deletedTrack = await prisma.track.delete({
    where: { id },
  });
  revalidatePath(`/dashboard/tracks`);

}
