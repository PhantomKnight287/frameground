import { PropsWithChildren } from "react";
import { notFound } from "next/navigation";
import { getCacheSolvesCount, getCacheUser } from "@/cache/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fromNow } from "@/utils/time";
import  { ProfileButtons } from "./layout.client";
import { Metadata } from "next";
import { env } from "@/env.mjs";
import { siteMetadataConfig } from "@repo/config";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const username = decodeURIComponent(params.username).replace("@", "");
  const user = await getCacheUser(username);

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
    title: {
      template: `${user.username}'s | %s`,
      default: `${user.username}'s profile`,
    },
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

async function ProfileLayout({
  params,
  children,
}: PropsWithChildren<{
  params: { username: string };
}>) {
  const username = decodeURIComponent(params.username).replace("@", "");

  const user = await getCacheUser(username);
  if (!user) notFound();
  const solves = await getCacheSolvesCount(user.id);
  return (
    <>
      <div className="container">
        <div className="flex flex-col gap-8 py-8 md:flex-row">
          <div className="flex flex-col gap-4">
            <Avatar className="h-32 w-32 rounded-3xl bg-cover bg-center bg-no-repeat md:h-64 md:w-64 mx-auto md:mx-0">
              <AvatarImage src={`/github-avatar/${username}`} />
              <AvatarFallback>{username.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-2 md:w-full md:items-start ">
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
              <ProfileButtons solves={solves} user={user} username={username} />
            </div>
          </div>
          <div className="bg-card text-card-foreground rounded-3xl border shadow-sm col-span-4 md:min-h-[calc(100vh_-_56px_-_6rem)] w-full">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileLayout;
