import { auth } from "@/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { assertAdmin } from "@/utils/auth";
import { fromNow } from "@/utils/time";
import { prisma } from "@repo/db";
import { cn, parseToNumber, upperFirst } from "@repo/utils";
import { redirect } from "next/navigation";
import ViewReportContent from "./view.client";
async function Reports({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const session = await auth();
  if (assertAdmin(session) === false) redirect(`/no-access`);
  const reports = await prisma.report.paginate({
    limit: parseToNumber(searchParams.limit as string, 100),
    page: parseToNumber(searchParams.page as string, 1),
    where: {
      commentId: {
        not: null,
      },
    },
    orderBy: [
      {
        status: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
    include: {
      author: {
        select: {
          id: true,
          username: true,
          name: true,
        },
      },
      comment: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              username: true,
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });
  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center">
        <div className="flex w-full">
          <div className="ml-auto mb-2">{/* <CreateNewRecord /> */}</div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reporter</TableHead>
              <TableHead>Report</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.result.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.author.name}</TableCell>
                <TableCell>{report.content?.substring(0, 30)}...</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      {
                        "bg-red-500 text-white": report.status === "pending",
                        "bg-green-500 text-white": report.status === "accepted",
                        "bg-gray-500 text-white": report.status === "rejected",
                      }
                    )}
                  >
                    {upperFirst(report.status)}
                  </span>
                </TableCell>
                <TableCell>{fromNow(report.createdAt)}</TableCell>
                <TableCell className="flex items-center justify-center flex-row max-w-[100px]">
                  <ViewReportContent
                    //@ts-expect-error
                    comment={report.comment!}
                    reportContent={report.content}
                    reportId={report.id}
                    reporter={report.author as any}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Reports;
