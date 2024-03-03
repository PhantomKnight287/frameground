import { getCachedSolvedChallenges } from "@/cache/user";
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
  title: "Solved Challenges",
};

async function Challenges({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username).replace("@", "");
  const challenges = await getCachedSolvedChallenges(username);
  return (
    <>
      <div className="flex flex-col p-6 pb-0">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Solved Challenges
        </h3>
      </div>
      <div className="p-6">
        {challenges.length > 0 ? (
          <Table>
            <TableHeader className="not-in-markdown">
              <TableRow className="not-in-markdown">
                <TableHead className="not-in-markdown">Name</TableHead>
                <TableHead className="not-in-markdown">
                  Latest Submission
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {challenges.map((challenge) => (
                <TableRow key={challenge.id} className="not-in-markdown">
                  <TableCell className="font-medium not-in-markdown">
                    <Link
                      href={`/track/${challenge.track!.slug}/challenge/${
                        challenge.slug
                      }`}
                      className="hover:underline"
                    >
                      {challenge.label}
                    </Link>
                  </TableCell>
                  <TableCell className="not-in-markdown">
                    {fromNow(challenge.solves[0].createdAt)}
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

export default Challenges;
