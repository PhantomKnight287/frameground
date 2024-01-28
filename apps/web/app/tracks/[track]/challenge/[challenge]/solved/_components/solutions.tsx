import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fromNow } from "@/utils/time";
import { prisma } from "@repo/db";
import Link from "next/link";

async function Solutions({
  sort,
  challenge,
}: {
  sort?: "oldest" | "newest";
  challenge: string;
}) {
  const solutions = await prisma.solution.paginate({
    page: 1,
    limit: 30,
    where: {
      challenge: {
        slug: challenge,
      },
    },
    orderBy: [
      {
        createdAt: sort === "oldest" ? "asc" : "desc",
      },
    ],
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      author: {
        select: {
          username: true,
        },
      },
    },
  });
  return (
    <div className="flex flex-col gap-4">
      {solutions.result.length === 0 ? (
        <div className="text-center">No solutions yet</div>
      ) : null}
      <div className="px-2">
        {solutions.result.map((solution) => (
          <Link
            className="flex flex-col gap-2 p-2 bg-border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700"
            key={solution.id}
            href={`/solution/${solution.id}`}
          >
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-row items-center justify-start gap-2">
                  <Avatar>
                    <AvatarImage
                      src={`/github-avatar/${solution.author.username}`}
                    />
                    <AvatarFallback>
                      {solution.author.username!.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="text-sm font-bold line-clamp-1">
                      {solution.title}
                    </div>
                    <Link
                      href={`/@${solution.author.username}`}
                      className="text-sm text-muted-foreground hover:underline"
                    >
                      @{solution.author.username}
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-500">
                    {fromNow(solution.createdAt)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <div className="text-sm line-clamp-3 text-gray-300">
                  {solution.description}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Solutions;
