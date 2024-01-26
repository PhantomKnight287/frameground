import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { prisma } from "@repo/db";
import CreateComment from "./comment-modal";
import FilterButton from "./filter-buttons";
import { fromNow } from "@/utils/time";
import Link from "next/link";

async function Comments({
  challengeSlug,
  trackSlug,
  sortBy,
  challengeId,
  trackId,
}: {
  challengeSlug?: string;
  trackSlug: string;
  sortBy?: "oldest" | "newest";
  challengeId: string;
  trackId: string;
}) {
  const comments = await prisma.comment.paginate({
    page: 1,
    limit: 30,
    orderBy: [
      {
        createdAt: sortBy === "oldest" ? "asc" : "desc",
      },
    ],
    where: {
      challenge: {
        ...(challengeSlug && { slug: challengeSlug }),
        track: {
          slug: trackSlug,
        },
      },
    },
    select: {
      id: true,
      author: {
        select: {
          username: true,
          id: true,
        },
      },
      content: true,
      createdAt: true,
    },
  });

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex flex-row w-full items-center justify-between border-b-2 border-zinc-300 dark:border-zinc-700 pb-2 px-2">
        <FilterButton />
        <CreateComment challengeId={challengeId} trackId={trackId} />
      </div>
      {comments?.result?.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No comments yet.
        </div>
      ) : null}
      <div className="flex flex-col gap-4 w-full px-2">
        {comments?.result?.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-1">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-start justify-start gap-2">
                <Avatar>
                  <AvatarImage
                    src={`/github-avatar/${comment.author.username}`}
                  />
                  <AvatarFallback>
                    {comment.author.username!.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-start">
                  <div className="flex flex-row gap-1 items-center">
                    <Link
                      href={`/@${comment.author.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline font-medium text-sm"
                    >
                      {comment.author.username}
                    </Link>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {fromNow(comment.createdAt)}
                    </span>
                  </div>
                  <div className="text-sm text-white">{comment.content}</div>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <button className="text-sm text-muted-foreground hover:text-muted-foreground-hover">
                  Report
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;
