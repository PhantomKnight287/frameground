import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { prisma } from "@repo/db";

async function Comments({
  challengeSlug,
  trackSlug,
}: {
  challengeSlug?: string;
  trackSlug: string;
}) {
  const comments = await prisma.comment.paginate({
    page: 1,
    limit: 30,
    orderBy: [
      {
        createdAt: "desc",
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
  if (comments.count === 0)
    return (
      <div className="text-center text-muted-foreground">No comments yet.</div>
    );
  return (
    <div className="flex flex-col gap-2">
      {comments.result.map((comment) => (
        <div key={comment.id} className="flex flex-col gap-1">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={`/github-avatar/${comment.author.username}`}
                />
                <AvatarFallback>
                  {comment.author.username!.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{comment.author.username}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
                A
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <button className="text-sm text-muted-foreground hover:text-muted-foreground-hover">
                Reply
              </button>
              <button className="text-sm text-muted-foreground hover:text-muted-foreground-hover">
                Report
              </button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{comment.content}</div>
        </div>
      ))}
    </div>
  );
}

export default Comments;
