"use server";

import { auth } from "@/auth";
import { assertAdmin } from "@/utils/auth";
import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

export async function DeleteReportedComment(reportId: string) {
  const session = await auth();
  if (!assertAdmin(session)) return { error: "Unauthorized" };
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });
  if (!report) return { error: "Report not found" };
  const tx = await prisma.$transaction([
    prisma.comment.delete({
      where: {
        id: report.commentId!,
      },
    }),
    prisma.report.update({
      where: { id: reportId },
      data: {
        status: "accepted",
      },
    }),
  ]);

  revalidatePath("/dashboard/reports");
}

export async function RejectReportedComment(reportId: string) {
  const session = await auth();
  if (!assertAdmin(session)) return { error: "Unauthorized" };
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });
  if (!report) return { error: "Report not found" };
  const tx = await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "rejected",
    },
  });

  revalidatePath("/dashboard/reports");
}
