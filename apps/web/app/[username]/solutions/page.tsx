import { getCachedSolutionsPosted } from "@/cache/solutions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fromNow } from "@/utils/time";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solutions Posted",
};

async function SolutionsPosted({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username).replace("@", "");

  const solutions = await getCachedSolutionsPosted(username);

  return (
    <>
      <div className="flex flex-col p-6 pb-0">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Solutions Posted
        </h3>
      </div>
      <div className="p-6">
        {solutions.length > 0 ? (
          <Table>
            <TableHeader className="not-in-markdown">
              <TableRow className="not-in-markdown">
                <TableHead className="not-in-markdown">Name</TableHead>
                <TableHead className="not-in-markdown">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solutions.map((solution) => (
                <TableRow key={solution.id} className="not-in-markdown">
                  <TableCell className="font-medium not-in-markdown">
                    <Link
                      href={`/solutions/${solution.id}`}
                      className="hover:underline"
                    >
                      <p className="line-clamp-1">{solution.title}</p>
                    </Link>
                  </TableCell>
                  <TableCell className="not-in-markdown">
                    {fromNow(solution.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </div>
    </>
  );
}

export default SolutionsPosted;
