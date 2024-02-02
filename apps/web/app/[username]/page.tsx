import { auth } from "@/auth";
import { Markdown } from "@/components/markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { env } from "@/env.mjs";
import { fromNow } from "@/utils/time";
import { siteMetadataConfig } from "@repo/config";
import { prisma } from "@repo/db";
import { Difficulty } from "@repo/db/types";
import { AudioWaveform, BadgeCheck, CheckCheck } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IoCog } from "react-icons/io5";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const username = decodeURIComponent(params.username).replace("@", "");
  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: {
      username: true,
      tracks: true,
      name: true,
      createdAt: true,
    },
  });

  if (!user)
    return {
      title: `${username} profile`,
      description: `View profile of ${username} on FrameGround`,
    };
  const searchParams = new URLSearchParams();
  searchParams.set("name", user.name!);
  searchParams.set("username", user.username!);
  return {
    metadataBase: new URL(env.HOST),
    title: `${user.username}'s profile`,
    description: `View profile of ${user.username} on FrameGround`,
    twitter: siteMetadataConfig.twitter,
    openGraph: {
      type: "website",
      title: `${user.username}'s profile`,
      description: `View profile of ${user.username} on FrameGround`,
      url: `${env.HOST}/@${user.username}`,
      images: [
        {
          url: `${env.HOST}/api/og/user?${searchParams.toString()}`,
          width: 1200,
          height: 600,
          alt: `${user.username}'s profile`,
        },
      ],
    },
  };
}

async function ProfilePage({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username).replace("@", "");
  const session = await auth();
  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: {
      username: true,
      tracks: true,
      name: true,
      createdAt: true,
      bio: true,
      id: true,
      _count: {
        select: {
          solutions: true,
          tracks: true,
        },
      },
    },
  })!;
  if (!user) notFound();
  // this is required as one user can attempt same question multiple times
  const solves = await prisma.solves.groupBy({
    by: ["type", "id"],
    _count: true,
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="container">
      <div className="flex flex-col gap-8 py-8 md:flex-row">
        <div className="flex flex-col gap-4">
          <Avatar className="h-32 w-32 rounded-3xl bg-cover bg-center bg-no-repeat md:h-64 md:w-64">
            <AvatarImage src={`/github-avatar/${username}`} />
            <AvatarFallback>{username.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-2 md:w-full md:items-start">
            <div className="flex gap-0 flex-col">
              <div className="text-[2rem] font-bold [&amp;>small]:text-[0.7em] [&amp;>small]:dark:text-slate-400 [&amp;>small]:text-slate-600 font-default h-fit">
                {user?.name}
              </div>
              <span className="text-lg text-muted-foreground">
                @{user?.username}
              </span>
            </div>
            <span className="text-muted-foreground tracking-tight mt-4">
              Joined {fromNow(new Date(user!.createdAt!))}
            </span>
            <div className="flex gap-4 md:w-full md:flex-col">
              <Button
                variant={"outline"}
                className="rounded-xl text-left flex flex-row items-center justify-start gap-2"
              >
                <BadgeCheck className="text-green-500" />
                {solves[0]?._count || 0}{" "}
                {solves[0]?._count <= 1 ? "Challenge" : "Challenges"} Conquered
              </Button>
              <Button
                variant={"outline"}
                className="rounded-xl text-left flex flex-row items-center justify-start gap-2"
              >
                <AudioWaveform className="text-blue-500" />
                Enrolled in {user._count.tracks}{" "}
                {user._count.tracks <= 1 ? "Track" : "Tracks"}
              </Button>
              <Button
                variant={"outline"}
                className="rounded-xl text-left flex flex-row items-center justify-start gap-2"
              >
                <CheckCheck className="text-purple-500" />
                {user._count.solutions}{" "}
                {user._count.solutions <= 1 ? "Solution" : "Solutions"} Posted
              </Button>
              {session?.user?.username?.toLowerCase() ===
              username.toLowerCase() ? (
                <Link
                  className={buttonVariants({
                    variant: "outline",
                    className:
                      "rounded-xl text-left flex flex-row items-center !justify-start gap-2",
                  })}
                  href="/settings"
                >
                  <IoCog size={24} />
                  Settings
                </Link>
              ) : null}
            </div>
          </div>
        </div>
        <div className="bg-card text-card-foreground rounded-3xl border shadow-sm col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)] w-full">
          <div className="flex flex-col p-6 pb-0">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              Bio
            </h3>
          </div>
          <div className="p-6">
            {user.bio ? (
              <Markdown
                // eslint-disable-next-line react/no-children-prop
                children={user.bio}
              />
            ) : (
              <p className="text-muted-foreground text-center">No bio yet!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
