import { prisma } from "@repo/db";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import SolutionFiles from "./page.client";
import { Markdown } from "@/components/markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function Solution({ params }: { params: { id: string } }) {
  const solution = await prisma.solution.findFirst({
    where: {
      id: params.id,
    },
    include: {
      author: {
        select: {
          username: true,
          name: true,
        },
      },
      files: true,
      challenge: {
        select: {
          slug: true,
          track: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });
  if (!solution) notFound();
  return (
    <div className="container mt-10 gap-4">
      <div className="flex flex-row items-center gap-2 justify-between">
        <h1 className="text-xl font-bold">{solution.title}</h1>
        <Link
          href={`/tracks/${solution.challenge.track!.slug}/challenge/${
            solution.challenge.slug
          }`}
          className={buttonVariants({
            variant: "secondary",
          })}
        >
          Go to Challenge
        </Link>
      </div>
      <div className="flex flex-row items-center justify-start w-fit my-4">
        <Avatar>
          <AvatarImage src={`/github-avatar/${solution.author.username}`} />
          <AvatarFallback>{solution.author.username}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start justify-between pl-2">
          {solution.author.name}
          <Link
            href={`/@${solution.author.username}`}
            className={buttonVariants({
              variant: "link",
              className: "!p-0 h-fit !text-muted-foreground",
            })}
          >
            @{solution.author.username}
          </Link>
        </div>
      </div>

      <Markdown
        // eslint-disable-next-line react/no-children-prop
        children={solution.description}
      />

      <SolutionFiles files={solution.files} />
    </div>
  );
}

export default Solution;
