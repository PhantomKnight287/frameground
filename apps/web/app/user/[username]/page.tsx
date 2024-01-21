import { auth } from "@/app/api/auth/[...nextauth]/route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fromNow } from "@/utils/time";
import { prisma } from "@repo/db";
import { Metadata } from "next";
import { useEffect } from "react";
import { IoCog, IoContract } from "react-icons/io5";

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

  if (!user) return {};
  return {
    title: `${user.username}'s profile | FrameGround`,
    description: `View profile of ${user.username} on FrameGround`,
  };
}

async function ProfilePage({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username).replace("@", "");
  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: {
      username: true,
      tracks: true,
      name: true,
      createdAt: true,
    },
  })!;
  const githubReq = await fetch(`https://api.github.com/users/${username}`);
  const githubData = await githubReq.json();
  const avatarUrl = githubData.avatar_url;
  const session = await auth();

  return (
    <div className="container">
      <div className="flex flex-row">
        <div className="flex flex-col gap-4">
          <Avatar className="h-32 w-32 rounded-3xl bg-cover bg-center bg-no-repeat md:h-64 md:w-64">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{username.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-2 md:w-full md:items-start">
            <div className="flex gap-4">
              <div className="text-[2rem] font-bold [&amp;>small]:text-[0.7em] [&amp;>small]:dark:text-slate-400 [&amp;>small]:text-slate-600 font-default">
                {user?.name}
              </div>
            </div>
            <span
              className="text-muted-foreground tracking-tight"
              title="Joined Sun Oct 29 2023 22:01:43 GMT+0530 (India Standard Time)"
            >
              Joined {fromNow(new Date(user!.createdAt!))}
            </span>
            <div className="flex gap-4 md:w-full md:flex-col">
              <Button
                variant={"outline"}
                className="rounded-xl text-left flex flex-row items-center justify-start gap-2"
              >
                <IoContract />
                ok
              </Button>
              <Button
                variant={"outline"}
                className="rounded-xl text-left flex flex-row items-center justify-start gap-2"
              >
                <IoContract />
                ok
              </Button>
              <Button
                variant={"outline"}
                className="rounded-xl text-left flex flex-row items-center justify-start gap-2"
              >
                <IoContract />
                ok
              </Button>
              <Button
                variant={"outline"}
                className="rounded-xl text-left flex flex-row items-center justify-start gap-2"
              >
                <IoContract />
                ok
              </Button>
              <Button
                variant={"outline"}
                className="rounded-xl text-left flex flex-row items-center justify-start gap-2"
              >
                <IoContract />
                ok
              </Button>
              <Button
                variant={"outline"}
                className="rounded-xl text-left flex flex-row items-center justify-start gap-2"
              >
                <IoContract />
                ok
              </Button>
              {session?.user?.username?.toLowerCase() ===
              username.toLowerCase() ? (
                <Button
                  variant={"outline"}
                  className="rounded-xl text-left flex flex-row items-center justify-start gap-2"
                >
                  <IoCog size={24} />
                  Settings
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
